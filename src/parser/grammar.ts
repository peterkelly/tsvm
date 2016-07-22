// Copyright 2016 Peter Kelly <peter@pmkelly.net>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
    isIdStart,
    isIdChar,
    isKeyword,
    Parser,
    ParseFailure,
    ParseError,
    ParseIgnore,
} from "./parser";
import {
    CastError,
    Range,
    ASTNode,
    ListNode,
    ErrorNode,
    GenericNode,
    GenericStringNode,
    GenericNumberNode,
} from "./ast";

export class Grammar {
    public productions: { [name: string]: (b: Builder) => void } = {};

    public define(name: string, fun: (b: Builder) => void) {
        if (this.productions[name] != null)
            throw new Error("Production "+name+" is already defined");
        this.productions[name] = (b: Builder) => {
            b.attempt((): void => {
                const oldLength = b.length;
                fun(b);
                b.assertLengthIs(oldLength+1);
                checkNode(b.get(0));
            });
        }
    }
    public lookup(name: string): (b: Builder) => void {
        return this.productions[name];
    }
}

export class Builder {
    public grammar: Grammar;
    public parser: Parser;
    public stack: any[] = [];
    public constructor(grammar: Grammar, parser: Parser) {
        this.grammar = grammar;
        this.parser = parser;
    }
    public get length(): number {
        return this.stack.length;
    }
    public item(f: (b: Builder) => void): void {
        f(this);
    }
    public sequence(funs: ((b: Builder) => void)[]): void {
        for (const f of funs)
            f(this);
    }
    public push(value: any): void {
        this.stack.push(value);
    }
    public pop(n: number = 1): void {
        if (n > this.stack.length)
            throw new Error("Attempt to pop past end of stack");
        this.stack.length -= n;
    }
    public get(index: number): any {
        const pos = this.stack.length-1-index;
        if (pos >= 0)
            return this.stack[pos];
        else
            throw new Error("Attempt to access position "+(this.stack.length-1-index)+" on stack");
    }

    public popAboveAndSet(index: number, value: any): any {
        const pos = this.stack.length-index-1;
        if (pos >= 0) {
            this.stack[pos] = value;
            this.stack.length = pos+1;
        }
        else {
            throw new Error("Attempt to set position "+(this.stack.length-1-index)+" on stack");
        }
    }

    public attempt(f: () => void): void {
        const start = this.parser.pos;
        const length = this.stack.length;
        try {
            f();
        }
        catch (e) {
            this.parser.pos = start;
            this.stack.length = length;
            throw e;
        }
    }

    public not(f: (b: Builder) => void): void {
        const start = this.parser.pos;
        const length = this.stack.length;

        let hadException = false;
        try {
            f(this);
        }
        catch (e) {
            this.parser.pos = start;
            this.stack.length = length;
            if (!(e instanceof ParseFailure))
                throw e;
            hadException = true;
        }

        this.parser.pos = start;
        this.stack.length = length;

        if (!hadException)
            throw new ParseError(this.parser,this.parser.pos,"NOT predicate failed");
    }

    // F must either throw an exception or result in exactly one extra item on the stack
    public opt(f: (b: Builder) => void): void {
        try {
            this.attempt(() => {
                const oldLength = this.stack.length;
                f(this);
                this.assertLengthIs(oldLength+1);
            });
        }
        catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
            this.push(null);
        }
    }

    public choice(list: ((b: Builder) => void)[]): void {
        const start = this.parser.pos;
        const length = this.stack.length;
        for (const item of list) {
            try {
                return item(this);
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                this.parser.pos = start;
                this.stack.length = length;
            }
        }
        throw new ParseError(this.parser,this.parser.pos,"No valid alternative found");
    }

    public repeat(f: (b: Builder) => void): void {
        while (true) {
            const start = this.parser.pos;
            const length = this.stack.length;
            try {
                f(this);
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;

                this.parser.pos = start;
                this.stack.length = length;
                return;
            }
        }
    }

    public list(first: (b: Builder) => void, rest: (b: Builder) => void): void {
        this.attempt(() => {
            const start = this.parser.pos;
            const elements: ASTNode[] = [];
            const initialLength = this.stack.length;

            first(this);
            this.assertLengthIs(initialLength+1);
            const firstNode = checkNode(this.get(0));
            if (firstNode != null)
                elements.push(firstNode);
            this.stack.pop();

            this.assertLengthIs(initialLength);
            this.repeat(() => {
                rest(this);
                this.assertLengthIs(initialLength+1);
                const node = this.get(0);
                if (node != null)
                    elements.push(node);
                this.stack.pop();
                this.assertLengthIs(initialLength);
            });

            this.assertLengthIs(initialLength);
            const end = (elements.length > 0) ? elements[elements.length-1].range.end : start;
            this.push(new ListNode(new Range(start,end),elements));
        });
    }

    public assertLengthIs(length: number): void {
        if (this.stack.length != length)
            throw new Error("Expected b to have exactly "+length+
                            " items on the stack; have "+this.stack.length);
    }
}

export abstract class Action {
    public readonly kind: string;

    public constructor(kind: string) {
        this.kind = kind;
    }

    public abstract execute(b: Builder): void;
}

class ProductionAction extends Action {
    private child: Action;

    public constructor(name: string, child: Action) {
        super("["+name+"]");
        this.child = child;
    }

    public execute(b: Builder): void {
        b.attempt((): void => {
            const oldLength = b.length;
            this.child.execute(b);
            b.assertLengthIs(oldLength+1);
            checkNode(b.get(0));
        });
    }
}

class FunctionAction extends Action {
    private f: (b: Builder) => void;

    public constructor(f: (b: Builder) => void) {
        super("function");
        this.f = f;
    }

    public execute(b: Builder): void {
        this.f(b);
    }
}

class NotAction extends Action {
    private child: Action;

    public constructor(child: Action) {
        super("not");
        this.child = child;
    }

    public execute(b: Builder): void {
        b.not((b: Builder) => {
            this.child.execute(b);
        });
    }
}

export function not(f: (b: Builder) => void): (b: Builder) => void {
    const fact = new FunctionAction(f);
    const act = new NotAction(fact);
    return (b: Builder) => act.execute(b);
}

class RefAction extends Action {
    private name: string;

    public constructor(productionName: string) {
        super("ref");
        this.name = productionName;
    }

    public execute(b: Builder): void {
        const production = b.grammar.lookup(this.name);
        if (production == null)
            throw new Error("Production "+this.name+" not defined");
        production(b);
    }
}

export function ref(name: string): (b: Builder) => void {
    const act = new RefAction(name);
    return (b: Builder) => act.execute(b);
}

class ListAction extends Action {
    private first: Action;
    private rest: Action;

    public constructor(first: Action, rest: Action) {
        super("list");
        this.first = first;
        this.rest = rest;
    }

    public execute(bx: Builder): void {
        bx.list(
            (b: Builder): void => this.first.execute(b),
            (b: Builder): void => this.rest.execute(b)
        );
    }
}

export function list(first: (b: Builder) => void, rest: (b: Builder) => void): (b: Builder) => void {
    const firstAct = new FunctionAction(first);
    const restAct = new FunctionAction(rest);
    const act = new ListAction(firstAct,restAct);
    return (b: Builder) => act.execute(b);
}

class SequenceAction extends Action {
    private actions: Action[];

    public constructor(actions: Action[]) {
        super("sequence");
        this.actions = actions;
    }

    public execute(bx: Builder): void {
        const funs = this.actions.map((act) => (b: Builder): void => act.execute(b));
        bx.sequence(funs);
    }
}

export function sequence(funs: ((b: Builder) => void)[]): (b: Builder) => void {
    const actions = funs.map((f) => new FunctionAction(f));
    const act = new SequenceAction(actions);
    return (b: Builder) => act.execute(b);
}

class SpliceNullAction extends Action {
    private index: number;

    public constructor(index: number) {
        super("spliceNull");
        this.index = index;
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,null);
    }
}

export function spliceNull(index: number): (b: Builder) => void {
    const act = new SpliceNullAction(index);
    return (b: Builder) => act.execute(b);
}

class SpliceReplaceAction extends Action {
    private index: number;
    private srcIndex: number;

    public constructor(index: number, srcIndex: number) {
        super("spliceReplace");
        this.index = index;
        this.srcIndex = srcIndex;
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,b.get(this.srcIndex));
    }
}

export function spliceReplace(index: number, srcIndex: number): (b: Builder) => void {
    const act = new SpliceReplaceAction(index,srcIndex);
    return (b: Builder) => act.execute(b);
}

class SpliceNodeAction extends Action {
    private index: number;
    private name: string;
    private startIndex: number;
    private endIndex: number;
    private childIndices: number[];

    public constructor(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]) {
        super("spliceNode");
        this.index = index;
        this.name = name;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.childIndices = childIndices;
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,makeNode(b,this.startIndex,this.endIndex,this.name,this.childIndices));
    }
}

export function spliceNode(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]): (b: Builder) => void {
    const act = new SpliceNodeAction(index,name,startIndex,endIndex,childIndices);
    return (b: Builder) => act.execute(b);
}

class SpliceStringNodeAction extends Action {
    private index: number;
    private nodeName: string;
    private startIndex: number;
    private endIndex: number;
    private valueIndex: number;

    public constructor(index: number, nodeName: string, startIndex: number, endIndex: number, valueIndex: number) {
        super("spliceStringNode");
        this.index = index;
        this.nodeName = nodeName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.valueIndex = valueIndex;
    }

    public execute(b: Builder): void {
        const start = checkNumber(b.get(this.startIndex));
        const end = checkNumber(b.get(this.endIndex));
        const range = new Range(start,end);
        const valueNode = checkStringNode(b.get(this.valueIndex));
        b.popAboveAndSet(this.index,new GenericStringNode(range,this.nodeName,valueNode.value));
    }
}

export function spliceStringNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): (b: Builder) => void {
    const act = new SpliceStringNodeAction(index,name,startIndex,endIndex,valueIndex);
    return (b: Builder) => act.execute(b);
}

class SpliceNumberNodeAction extends Action {
    private index: number;
    private nodeName: string;
    private startIndex: number;
    private endIndex: number;
    private valueIndex: number;

    public constructor(index: number, nodeName: string, startIndex: number, endIndex: number, valueIndex: number) {
        super("spliceNumberNode");
        this.index = index;
        this.nodeName = nodeName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.valueIndex = valueIndex;
    }

    public execute(b: Builder): void {
        const start = checkNumber(b.get(this.startIndex));
        const end = checkNumber(b.get(this.endIndex));
        const range = new Range(start,end);
        const valueNode = checkNumberNode(b.get(this.valueIndex));
        b.popAboveAndSet(this.index,new GenericNumberNode(range,this.nodeName,valueNode.value));
    }
}

export function spliceNumberNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): (b: Builder) => void {
    const act = new SpliceNumberNodeAction(index,name,startIndex,endIndex,valueIndex);
    return (b: Builder) => act.execute(b);
}

class SpliceEmptyListNodeAction extends Action {
    private index: number;
    private startIndex: number;
    private endIndex: number;

    public constructor(index: number, startIndex: number, endIndex: number) {
        super("spliceEmptyListNode");
        this.index = index;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,makeEmptyListNode(b,this.startIndex,this.endIndex));
    }
}

export function spliceEmptyListNode(index: number, startIndex: number, endIndex: number): (b: Builder) => void {
    const act = new SpliceEmptyListNodeAction(index,startIndex,endIndex);
    return (b: Builder) => act.execute(b);
}

class PushAction extends Action {
    private value: any;

    public constructor(value: any) {
        super("push");
        this.value = value;
    }

    public execute(b: Builder): void {
        b.push(this.value);
    }
}

export function push(value: any): (b: Builder) => void {
    const act = new PushAction(value);
    return (b: Builder) => act.execute(b);
}

class PopAction extends Action {
    public constructor() {
        super("pop");
    }

    public execute(b: Builder): void {
        b.pop();
    }
}

const popAct: Action = new PopAction();
export function pop(b: Builder): void {
    popAct.execute(b);
}

class OptAction extends Action {
    private child: Action;

    public constructor(child: Action) {
        super("opt");
        this.child = child;
    }

    public execute(b: Builder): void {
        b.opt((b: Builder) => {
            this.child.execute(b);
        });
    }
}

export function opt(f: (b: Builder) => void): (b: Builder) => void {
    const act = new OptAction(new FunctionAction(f));
    return (b: Builder) => act.execute(b);
}

class ChoiceAction extends Action {
    private actions: Action[];

    public constructor(actions: Action[]) {
        super("choice");
        this.actions = actions;
    }

    public execute(bx: Builder): void {
        const funs = this.actions.map((act) => (b: Builder): void => act.execute(b));
        bx.choice(funs);
    }
}

export function choice(list: ((b: Builder) => void)[]): (b: Builder) => void {
    const actions = list.map((f) => new FunctionAction(f));
    const act = new ChoiceAction(actions);
    return (b: Builder) => act.execute(b);
}

class RepeatAction extends Action {
    private child: Action;

    public constructor(child: Action) {
        super("repeat");
        this.child = child;
    }

    public execute(b: Builder): void {
        b.repeat((b: Builder) => {
            this.child.execute(b);
        });
    }
}

export function repeat(f: (b: Builder) => void): (b: Builder) => void {
    const fact = new FunctionAction(f);
    const act = new RepeatAction(fact);
    return (b: Builder) => act.execute(b);
}

class PosAction extends Action {
    public constructor() {
        super("pos");
    }

    public execute(b: Builder): void {
        b.push(b.parser.pos);
    }
}

const posAct: Action = new PosAction();
export function pos(b: Builder) {
    posAct.execute(b);
}

class ValueAction extends Action {
    private value: any;

    public constructor(value: any) {
        super("value");
        this.value = value;
    }

    public execute(b: Builder): void {
        b.push(this.value);
    }
}

// FIXME: Isn't this the same as push?
export function value(value: any): (b: Builder) => void {
    const act = new ValueAction(value);
    return (b: Builder) => act.execute(b);
}

class KeywordAction extends Action {
    private str: string;

    public constructor(str: string) {
        super("keyword");
        this.str = str;
    }

    public execute(b: Builder): void {
        b.parser.expectKeyword(this.str);
        b.push(null);
    }
}

export function keyword(str: string): ((b: Builder) => void) {
    const act = new KeywordAction(str);
    return (b: Builder) => act.execute(b);
}

class IdentifierAction extends Action {
    private str: string;

    public constructor(str: string) {
        super("identifier");
        this.str = str;
    }

    public execute(b: Builder): void {
        b.attempt((): void => {
            const oldLength = b.stack.length;
            const start = b.parser.pos;
            ref("Identifier")(b);
            b.assertLengthIs(oldLength+1);
            const ident = checkNode(b.get(0));
            if (!(ident instanceof GenericStringNode) || (ident.value != this.str))
                throw new ParseError(b.parser,start,"Expected "+this.str);
            // Identifier_b will already have pushed onto the stack
        });
    }
}

export function identifier(str: string): (b: Builder) => void {
    const act = new IdentifierAction(str);
    return (b: Builder) => act.execute(b);
}

class WhitespaceAction extends Action {
    public constructor() {
        super("whitespace");
    }

    public execute(b: Builder): void {
        b.parser.skipWhitespace();
        b.push(null);
    }
}

const whitespaceAct = new WhitespaceAction();
export function whitespace(b: Builder): void {
    whitespaceAct.execute(b);
}

class WhitespaceNoNewlineAction extends Action {
    public constructor() {
        super("whitespaceNoNewline");
    }

    public execute(b: Builder): void {
        b.parser.skipWhitespaceNoNewline();
        b.push(null);
    }
}

const whitespaceNoNewlineAct = new WhitespaceNoNewlineAction();
export function whitespaceNoNewline(b: Builder): void {
    whitespaceNoNewlineAct.execute(b);
}

export function checkNode(value: any): ASTNode | null {
    if ((value === null) || (value instanceof ASTNode))
        return value;
    else
        throw new CastError(value,"ASTNode | null");
}

export function checkStringNode(value: any): GenericStringNode | null {
    if ((value === null) || (value instanceof GenericStringNode))
        return value;
    else
        throw new CastError(value,"GenericStringNode | null");
}

export function checkNumberNode(value: any): GenericNumberNode | null {
    if ((value === null) || (value instanceof GenericNumberNode))
        return value;
    else
        throw new CastError(value,"GenericNumberNode | null");
}

export function checkListNode(value: any): ListNode | ErrorNode | null {
    if ((value == null) || (value instanceof ListNode) || (value instanceof ErrorNode))
        return value;
    else
        throw new CastError(value,"ListNode | ErrorNode | null");
}

export function checkNumber(value: any): number {
    if (typeof(value) === "number")
        return value;
    throw new CastError(value,"number");
}

export function makeNode(b: Builder, startIndex: number, endIndex: number, name: string, childIndices: number[]): GenericNode {
    const start = checkNumber(b.get(startIndex));
    const end = checkNumber(b.get(endIndex));
    const children: (ASTNode | null)[] = [];
    for (const childIndex of childIndices) {
        children.push(checkNode(b.get(childIndex)));
    }
    return new GenericNode(new Range(start,end),name,children);
}

export function makeEmptyListNode(b: Builder, startIndex: number, endIndex: number): ListNode {
    const start = checkNumber(b.get(startIndex));
    const end = checkNumber(b.get(endIndex));
    return new ListNode(new Range(start,end),[]);
}

class IdentifierTokenAction extends Action {
    public constructor() {
        super("identifier_token");
    }

    public execute(b: Builder): void {
        b.attempt((): void => {
            const p = b.parser;
            const start = p.pos;
            const oldLength = b.length;
            if ((p.cur != null) && isIdStart(p.cur)) {
                p.next();
                while ((p.cur != null) && isIdChar(p.cur))
                    p.next();
                const range = new Range(start,p.pos);
                const value = p.text.substring(range.start,range.end);
                if (isKeyword(value))
                    throw new ParseError(p,p.pos,"Keyword "+JSON.stringify(value)+" used where identifier expected");
                b.push(new GenericStringNode(range,"Identifier",value));
                b.assertLengthIs(oldLength+1);
                checkNode(b.get(0));
            }
            else {
                throw new ParseError(p,p.pos,"Expected Identifier");
            }
        });
    }
}

const identifierTokenAct: Action = new IdentifierTokenAction();
export function identifier_token(b: Builder): void {
    identifierTokenAct.execute(b);
}

class NumericLiteralTokenAction extends Action {
    public constructor() {
        super("numeric_literal_token");
    }

    public execute(b: Builder): void {
        // TODO: Complete numeric literal syntax according to spec
        const p = b.parser;
        const start = p.pos;
        while ((p.cur != null) && (p.cur >= "0") && (p.cur <= "9"))
            p.next();
        if (p.pos == start)
            throw new ParseError(p,p.pos,"Expected number");
        if (p.cur == ".") {
            p.next();
            const postDecimal = p.pos;
            while ((p.cur != null) && (p.cur >= "0") && (p.cur <= "9"))
                p.next();
            if (p.pos == postDecimal)
                throw new ParseError(p,p.pos,"Invalid number");
        }
        const value = parseFloat(p.text.substring(start,p.pos));
        b.push(new GenericNumberNode(new Range(start,p.pos),"NumericLiteral",value));
    }
}

const numericLiteralTokenAct: Action = new NumericLiteralTokenAction();
export function numeric_literal_token(b: Builder): void {
    numericLiteralTokenAct.execute(b);
}

class StringLiteralTokenAction extends Action {
    public constructor() {
        super("string_literal_token");
    }

    public execute(b: Builder): void {
        // TODO: Complete string literal syntax according to spec
        const p = b.parser;
        const start = p.pos;
        if ((p.cur == "\"") || (p.cur == "'")) {
            const quote = p.cur;
            p.next();
            let value = "";
            while (true) {
                if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "\"")) {
                    value += "\"";
                    p.pos += 2;
                }
                else if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "'")) {
                    value += "'";
                    p.pos += 2;
                }
                else if ((p.pos < p.len) && (p.text[p.pos] == "\"") && (quote == "\"")) {
                    p.pos++;
                    break;
                }
                else if ((p.pos < p.len) && (p.text[p.pos] == "'") && (quote == "'")) {
                    p.pos++;
                    break;
                }
                else if (p.pos < p.len) {
                    value += p.text[p.pos];
                    p.pos++;
                }
                else {
                    throw new ParseError(p,p.pos,"Unterminated string");
                }
            }
            b.push(new GenericStringNode(new Range(start,p.pos),"StringLiteral",value,true));
            checkNode(b.get(0));
            return;
        }
        throw new ParseError(p,p.pos,"Invalid string");
    }
}

const stringLiteralTokenAct = new StringLiteralTokenAction();
export function string_literal_token(b: Builder): void {
    stringLiteralTokenAct.execute(b);
}
