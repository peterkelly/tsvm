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
    public productions: { [name: string]: Action } = {};
    public names: string[] = [];

    public define(name: string, fun: Action) {
        if (this.productions[name] != null)
            throw new Error("Production "+name+" is already defined");
        this.productions[name] = new ProductionAction(name,fun);
        this.names.push(name);
    }

    public lookup(name: string): Action {
        return this.productions[name];
    }
    public dump(output: (str: string) => void): void {
        for (const name of this.names)
            this.productions[name].dump("","",output);
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

function actionArrayEquals(first: Action[], second: Action[]): boolean {
    if (first.length != second.length)
        return false;
    for (let i = 0; i < first.length; i++) {
        if (!first[i].equals(second[i]))
            return false;
    }
    return true;
}

function numberArrayEquals(first: number[], second: number[]): boolean {
    if (first.length != second.length)
        return false;
    for (let i = 0; i < first.length; i++) {
        if (first[i] != second[i])
            return false;
    }
    return true;
}

function actionsTotalOffset(actions: Action[]): number {
    let total = 0;
    for (const action of actions)
        total += action.offset;
    return total;
}

function actionsSameOffset(actions: Action[]): number {
    if (actions.length == 0)
        return 0;
    let result = actions[0].offset;
    for (let i = 1; i < actions.length; i++) {
        if (actions[i].offset != result)
            throw new Error("Choice has children with different offset values");
    }
    return result;
}

export abstract class Action {
    public readonly kind: string;
    public readonly offset: number;

    public constructor(kind: string, offset: number) {
        this.kind = kind;
        this.offset = offset;
    }

    public abstract equals(other: Action): boolean;

    public abstract execute(b: Builder): void;

    public abstract dump(prefix: string, indent: string, output: (str: string) => void): void;
}

class ProductionAction extends Action {
    private child: Action;
    private name: string;

    public constructor(name: string, child: Action) {
        super("["+name+"]",1);
        this.name = name;
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ProductionAction) &&
                this.child.equals(other.child) &&
                (this.name == other.name));
    }

    public execute(b: Builder): void {
        b.attempt((): void => {
            const oldLength = b.length;
            this.child.execute(b);
            b.assertLengthIs(oldLength+1);
            checkNode(b.get(0));
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output("grm.define("+JSON.stringify(this.name)+",\n");
        this.child.dump(indent+"    ",indent+"    ",output);
        output(");\n\n");
    }
}

class NotAction extends Action {
    private child: Action;

    public constructor(child: Action) {
        super("not",0);
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof NotAction) &&
                this.child.equals(other.child));
    }

    public execute(b: Builder): void {
        b.not((b: Builder) => {
            this.child.execute(b);
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(indent+"not(");
        this.child.dump("",indent,output);
        output(")");
    }
}

export function not(f: Action): Action {
    return new NotAction(f);
}

class RefAction extends Action {
    private name: string;

    public constructor(productionName: string) {
        super("ref",1);
        this.name = productionName;
    }

    public equals(other: Action): boolean {
        return ((other instanceof RefAction) &&
                (this.name == other.name));
    }

    public execute(b: Builder): void {
        const production = b.grammar.lookup(this.name);
        if (production == null)
            throw new Error("Production "+this.name+" not defined");
        production.execute(b);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"ref("+JSON.stringify(this.name)+")");
    }
}

export function ref(name: string): Action {
    return new RefAction(name);
}

class ListAction extends Action {
    private first: Action;
    private rest: Action;

    public constructor(first: Action, rest: Action) {
        super("list",1);
        this.first = first;
        this.rest = rest;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ListAction) &&
                this.first.equals(other.first) &&
                this.rest.equals(other.rest));
    }

    public execute(bx: Builder): void {
        bx.list(
            (b: Builder): void => this.first.execute(b),
            (b: Builder): void => this.rest.execute(b)
        );
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"list(\n");
        this.first.dump(indent+"    ",indent+"    ",output);
        output(",\n");
        this.rest.dump(indent+"    ",indent+"    ",output);
        output("\n"+indent+")");
    }
}

export function list(first: Action, rest: Action): Action {
    return new ListAction(first,rest);
}

class SequenceAction extends Action {
    private actions: Action[];

    public constructor(actions: Action[]) {
        super("sequence",actionsTotalOffset(actions));
        this.actions = actions;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SequenceAction) &&
                actionArrayEquals(this.actions,other.actions));
    }

    public execute(bx: Builder): void {
        const funs = this.actions.map((act) => (b: Builder): void => act.execute(b));
        bx.sequence(funs);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"sequence([\n");
        for (const act of this.actions) {
            act.dump(indent+"    ",indent+"    ",output);
            output(",\n");
        }
        output(indent+"])");
    }
}

export function sequence(actions: Action[]): Action {
    return new SequenceAction(actions);
}

class SpliceNullAction extends Action {
    private index: number;

    public constructor(index: number) {
        super("spliceNull",-index);
        this.index = index;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceNullAction) &&
                (this.index == other.index));
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,null);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"spliceNull("+this.index+")");
    }
}

export function spliceNull(index: number): Action {
    return new SpliceNullAction(index);
}

class SpliceReplaceAction extends Action {
    private index: number;
    private srcIndex: number;

    public constructor(index: number, srcIndex: number) {
        super("spliceReplace",-index);
        this.index = index;
        this.srcIndex = srcIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceReplaceAction) &&
                (this.index == other.index) &&
                (this.srcIndex == other.srcIndex));
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,b.get(this.srcIndex));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"spliceReplace("+this.index+","+this.srcIndex+")");
    }
}

export function spliceReplace(index: number, srcIndex: number): Action {
    return new SpliceReplaceAction(index,srcIndex);
}

class SpliceNodeAction extends Action {
    private index: number;
    private name: string;
    private startIndex: number;
    private endIndex: number;
    private childIndices: number[];

    public constructor(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]) {
        super("spliceNode",-index);
        this.index = index;
        this.name = name;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.childIndices = childIndices;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceNodeAction) &&
                (this.index == other.index) &&
                (this.name == other.name) &&
                (this.startIndex == other.startIndex) &&
                (this.endIndex == other.endIndex) &&
                numberArrayEquals(this.childIndices,other.childIndices));
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,makeNode(b,this.startIndex,this.endIndex,this.name,this.childIndices));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(
            prefix+
            "spliceNode("+
            this.index+","+
            JSON.stringify(this.name)+","+
            this.startIndex+","+
            this.endIndex+","+
            "["+this.childIndices.map((n: number) => n.toString()).join(",")+"]"+
            ")"
        )
    }
}

export function spliceNode(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]): Action {
    return new SpliceNodeAction(index,name,startIndex,endIndex,childIndices);
}

class SpliceStringNodeAction extends Action {
    private index: number;
    private nodeName: string;
    private startIndex: number;
    private endIndex: number;
    private valueIndex: number;

    public constructor(index: number, nodeName: string, startIndex: number, endIndex: number, valueIndex: number) {
        super("spliceStringNode",-index);
        this.index = index;
        this.nodeName = nodeName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.valueIndex = valueIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceStringNodeAction) &&
                (this.nodeName == other.nodeName) &&
                (this.startIndex == other.startIndex) &&
                (this.endIndex == other.endIndex) &&
                (this.valueIndex == other.valueIndex));
    }

    public execute(b: Builder): void {
        const start = checkNumber(b.get(this.startIndex));
        const end = checkNumber(b.get(this.endIndex));
        const range = new Range(start,end);
        const valueNode = checkStringNode(b.get(this.valueIndex));
        b.popAboveAndSet(this.index,new GenericStringNode(range,this.nodeName,valueNode.value));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(
            prefix+"spliceStringNode("+this.index+","+
            JSON.stringify(this.nodeName)+","+
            this.startIndex+","+
            this.endIndex+","+
            this.valueIndex+")"
        );
    }
}

export function spliceStringNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): Action {
    return new SpliceStringNodeAction(index,name,startIndex,endIndex,valueIndex);
}

class SpliceNumberNodeAction extends Action {
    private index: number;
    private nodeName: string;
    private startIndex: number;
    private endIndex: number;
    private valueIndex: number;

    public constructor(index: number, nodeName: string, startIndex: number, endIndex: number, valueIndex: number) {
        super("spliceNumberNode",-index);
        this.index = index;
        this.nodeName = nodeName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.valueIndex = valueIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceNumberNodeAction) &&
                (this.nodeName == other.nodeName) &&
                (this.startIndex == other.startIndex) &&
                (this.endIndex == other.endIndex) &&
                (this.valueIndex == other.valueIndex));
    }

    public execute(b: Builder): void {
        const start = checkNumber(b.get(this.startIndex));
        const end = checkNumber(b.get(this.endIndex));
        const range = new Range(start,end);
        const valueNode = checkNumberNode(b.get(this.valueIndex));
        b.popAboveAndSet(this.index,new GenericNumberNode(range,this.nodeName,valueNode.value));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(
            prefix+"spliceNumberNode("+this.index+","+
            JSON.stringify(this.nodeName)+","+
            this.startIndex+","+
            this.endIndex+","+
            this.valueIndex+")"
        );
    }
}

export function spliceNumberNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): Action {
    return new SpliceNumberNodeAction(index,name,startIndex,endIndex,valueIndex);
}

class SpliceEmptyListNodeAction extends Action {
    private index: number;
    private startIndex: number;
    private endIndex: number;

    public constructor(index: number, startIndex: number, endIndex: number) {
        super("spliceEmptyListNode",-index);
        this.index = index;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceEmptyListNodeAction) &&
                (this.startIndex == other.startIndex) &&
                (this.endIndex == other.endIndex));
    }

    public execute(b: Builder): void {
        b.popAboveAndSet(this.index,makeEmptyListNode(b,this.startIndex,this.endIndex));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"spliceEmptyListNode("+this.index+","+this.startIndex+","+this.endIndex+")");
    }
}

export function spliceEmptyListNode(index: number, startIndex: number, endIndex: number): Action {
    return new SpliceEmptyListNodeAction(index,startIndex,endIndex);
}

class PushAction extends Action {
    private value: any;

    public constructor(value: any) {
        super("push",1);
        this.value = value;
    }

    public equals(other: Action): boolean {
        return ((other instanceof PushAction) &&
                (this.value == other.value));
    }

    public execute(b: Builder): void {
        b.push(this.value);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"push("+JSON.stringify(this.value)+")");
    }
}

export function push(value: any): Action {
    return new PushAction(value);
}

class PopAction extends Action {
    public constructor() {
        super("pop",-1);
    }

    public equals(other: Action): boolean {
        return (other instanceof PopAction);
    }

    public execute(b: Builder): void {
        b.pop();
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"pop");
    }
}

export const pop: Action = new PopAction();

class OptAction extends Action {
    private child: Action;

    public constructor(child: Action) {
        super("opt",1);
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof OptAction) &&
                this.child.equals(other.child));
    }

    public execute(b: Builder): void {
        b.opt((b: Builder) => {
            this.child.execute(b);
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(indent+"opt(");
        this.child.dump("",indent,output);
        output(")");
    }
}

export function opt(f: Action): Action {
    return new OptAction(f);
}

class ChoiceAction extends Action {
    private actions: Action[];

    public constructor(actions: Action[]) {
        super("choice",actionsSameOffset(actions));
        this.actions = actions;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ChoiceAction) &&
                actionArrayEquals(this.actions,other.actions));
    }

    public execute(bx: Builder): void {
        const funs = this.actions.map((act) => (b: Builder): void => act.execute(b));
        bx.choice(funs);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"choice([\n");
        for (const act of this.actions) {
            act.dump(indent+"    ",indent+"    ",output);
            output(",\n");
        }
        output(indent+"])");
    }
}

export function choice(actions: Action[]): Action {
    return new ChoiceAction(actions);
}

class RepeatAction extends Action {
    private child: Action;

    public constructor(child: Action) {
        super("repeat",0);
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof RepeatAction) &&
                this.child.equals(other.child));
    }

    public execute(b: Builder): void {
        b.repeat((b: Builder) => {
            this.child.execute(b);
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(indent+"repeat(");
        this.child.dump("",indent,output);
        output(")");
    }
}

export function repeat(f: Action): Action {
    return new RepeatAction(f);
}

class PosAction extends Action {
    public constructor() {
        super("pos",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof PosAction);
    }

    public execute(b: Builder): void {
        b.push(b.parser.pos);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"pos");
    }
}

export const pos: Action = new PosAction();

class ValueAction extends Action {
    private value: any;

    public constructor(value: any) {
        super("value",1);
        this.value = value;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ValueAction) &&
                (this.value == other.value));
    }

    public execute(b: Builder): void {
        b.push(this.value);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"value("+JSON.stringify(this.value)+")");
    }
}

// FIXME: Isn't this the same as push?
export function value(value: any): Action {
    return new ValueAction(value);
}

class KeywordAction extends Action {
    private str: string;

    public constructor(str: string) {
        super("keyword",1);
        this.str = str;
    }

    public equals(other: Action): boolean {
        return ((other instanceof KeywordAction) &&
                (this.str == other.str));
    }

    public execute(b: Builder): void {
        b.parser.expectKeyword(this.str);
        b.push(null);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"keyword("+JSON.stringify(this.str)+")");
    }
}

export function keyword(str: string): Action {
    return new KeywordAction(str);
}

class IdentifierAction extends Action {
    private str: string;

    public constructor(str: string) {
        super("identifier",1);
        this.str = str;
    }

    public equals(other: Action): boolean {
        return ((other instanceof IdentifierAction) &&
                (this.str == other.str));
    }

    public execute(b: Builder): void {
        b.attempt((): void => {
            const oldLength = b.stack.length;
            const start = b.parser.pos;
            ref("Identifier").execute(b);
            b.assertLengthIs(oldLength+1);
            const ident = checkNode(b.get(0));
            if (!(ident instanceof GenericStringNode) || (ident.value != this.str))
                throw new ParseError(b.parser,start,"Expected "+this.str);
            // Identifier_b will already have pushed onto the stack
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"identifier("+JSON.stringify(this.str)+")");
    }
}

export function identifier(str: string): Action {
    return new IdentifierAction(str);
}

class WhitespaceAction extends Action {
    public constructor() {
        super("whitespace",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof WhitespaceAction);
    }

    public execute(b: Builder): void {
        b.parser.skipWhitespace();
        b.push(null);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"whitespace");
    }
}

export const whitespace = new WhitespaceAction();

class WhitespaceNoNewlineAction extends Action {
    public constructor() {
        super("whitespaceNoNewline",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof WhitespaceNoNewlineAction);
    }

    public execute(b: Builder): void {
        b.parser.skipWhitespaceNoNewline();
        b.push(null);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"whitespaceNoNewline");
    }
}

export const whitespaceNoNewline = new WhitespaceNoNewlineAction();

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
        super("identifier_token",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof IdentifierTokenAction);
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

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"identifier_token");
    }
}

export const identifier_token: Action = new IdentifierTokenAction();

class NumericLiteralTokenAction extends Action {
    public constructor() {
        super("numeric_literal_token",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof NumericLiteralTokenAction);
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

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"numeric_literal_token");
    }
}

export const numeric_literal_token: Action = new NumericLiteralTokenAction();

class StringLiteralTokenAction extends Action {
    public constructor() {
        super("string_literal_token",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof StringLiteralTokenAction);
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

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"string_literal_token");
    }
}

export const string_literal_token = new StringLiteralTokenAction();
