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
    Parser,
    ParseFailure,
    ParseError,
    ParseIgnore,
} from "./parser";
import {
    TokenKind,
} from "./lexer";
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

    public push(value: any): void {
        this.stack.push(value);
    }

    public get(index: number): any {
        const pos = this.stack.length-1-index;
        if (pos >= 0)
            return this.stack[pos];
        else
            throw new Error("Attempt to access position "+(this.stack.length-1-index)+" on stack");
    }

    public getNumber(index: number): number {
        const value = this.get(index);
        if (typeof(value) === "number")
            return value;
        throw new CastError(value,"number");
    }

    public getNode(index: number): any {
        const value = this.get(index);
        if ((value === null) || (value instanceof ASTNode))
            return value;
        else
            throw new CastError(value,"ASTNode | null");
    }

    public getStringNode(index: number): GenericStringNode | null {
        const value = this.get(index);
        if ((value === null) || (value instanceof GenericStringNode))
            return value;
        else
            throw new CastError(value,"GenericStringNode | null");
    }

    public getNumberNode(index: number): GenericNumberNode | null {
        const value = this.get(index);
        if ((value === null) || (value instanceof GenericNumberNode))
            return value;
        else
            throw new CastError(value,"GenericNumberNode | null");
    }

    public splice(index: number, value: any): any {
        const pos = this.stack.length-index-1;
        if (pos >= 0) {
            this.stack[pos] = value;
            this.stack.length = pos+1;
        }
        else {
            throw new Error("Attempt to set position "+(this.stack.length-1-index)+" on stack");
        }
    }

    public attempt(f: (b: Builder) => void): void {
        const start = this.parser.pos;
        const length = this.stack.length;
        try {
            f(this);
        }
        catch (e) {
            this.parser.pos = start;
            this.stack.length = length;
            throw e;
        }
    }

    public repeat(f: (b: Builder) => void): void {
        while (true) {
            try {
                this.attempt(f);
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                return;
            }
        }
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

export abstract class LeafAction extends Action {
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
            b.getNode(0); // Check that the top of the stack is either a node null
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
        const start = b.parser.pos;
        const length = b.stack.length;

        let hadException = false;
        try {
            this.child.execute(b);
        }
        catch (e) {
            b.parser.pos = start;
            b.stack.length = length;
            if (!(e instanceof ParseFailure))
                throw e;
            hadException = true;
        }

        b.parser.pos = start;
        b.stack.length = length;

        if (!hadException)
            throw new ParseError(b.parser,b.parser.pos,"NOT predicate failed");
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

    public execute(b: Builder): void {
        b.attempt(() => {
            const start = b.parser.pos;
            const elements: ASTNode[] = [];
            const initialLength = b.stack.length;

            this.first.execute(b);
            b.assertLengthIs(initialLength+1);
            const firstNode = b.getNode(0);
            if (firstNode != null)
                elements.push(firstNode);
            b.stack.pop();

            b.assertLengthIs(initialLength);
            b.repeat(() => {
                this.rest.execute(b);
                b.assertLengthIs(initialLength+1);
                const node = b.get(0);
                if (node != null)
                    elements.push(node);
                b.stack.pop();
                b.assertLengthIs(initialLength);
            });
            b.assertLengthIs(initialLength);
            const end = (elements.length > 0) ? elements[elements.length-1].range.end : start;
            b.push(new ListNode(new Range(start,end),elements));
        });
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

    public execute(b: Builder): void {
        for (const act of this.actions)
            act.execute(b);
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

class SpliceNullAction extends LeafAction {
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
        b.splice(this.index,null);
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"spliceNull("+this.index+")");
    }
}

export function spliceNull(index: number): Action {
    return new SpliceNullAction(index);
}

class SpliceReplaceAction extends LeafAction {
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
        b.splice(this.index,b.get(this.srcIndex));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"spliceReplace("+this.index+","+this.srcIndex+")");
    }
}

export function spliceReplace(index: number, srcIndex: number): Action {
    return new SpliceReplaceAction(index,srcIndex);
}

class SpliceNodeAction extends LeafAction {
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
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        const children: (ASTNode | null)[] = [];
        for (const childIndex of this.childIndices) {
            children.push(b.getNode(childIndex));
        }
        b.splice(this.index,new GenericNode(new Range(start,end),this.name,children));
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

class SpliceStringNodeAction extends LeafAction {
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
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        const range = new Range(start,end);
        const valueNode = b.getStringNode(this.valueIndex);
        b.splice(this.index,new GenericStringNode(range,this.nodeName,valueNode.value));
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

class SpliceNumberNodeAction extends LeafAction {
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
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        const range = new Range(start,end);
        const valueNode = b.getNumberNode(this.valueIndex);
        b.splice(this.index,new GenericNumberNode(range,this.nodeName,valueNode.value));
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

class SpliceEmptyListNodeAction extends LeafAction {
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
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        b.splice(this.index,new ListNode(new Range(start,end),[]));
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"spliceEmptyListNode("+this.index+","+this.startIndex+","+this.endIndex+")");
    }
}

export function spliceEmptyListNode(index: number, startIndex: number, endIndex: number): Action {
    return new SpliceEmptyListNodeAction(index,startIndex,endIndex);
}

class PopAction extends LeafAction {
    public constructor() {
        super("pop",-1);
    }

    public equals(other: Action): boolean {
        return (other instanceof PopAction);
    }

    public execute(b: Builder): void {
        if (b.stack.length == 0)
            throw new Error("Attempt to pop past end of stack");
        b.stack.length--;
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
        // child must either throw an exception or result in exactly one extra item on the stack
        try {
            b.attempt(() => {
                const oldLength = b.stack.length;
                this.child.execute(b);
                b.assertLengthIs(oldLength+1);
            });
        }
        catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
            b.push(null);
        }
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

    public execute(b: Builder): void {
        const start = b.parser.pos;
        const length = b.stack.length;
        for (const act of this.actions) {
            try {
                act.execute(b);
                return;
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                b.parser.pos = start;
                b.stack.length = length;
            }
        }
        throw new ParseError(b.parser,b.parser.pos,"No valid alternative found");
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

class PosAction extends LeafAction {
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

class ValueAction extends LeafAction {
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

export function value(value: any): Action {
    return new ValueAction(value);
}

class KeywordAction extends LeafAction {
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
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.value != this.str))
                throw new ParseError(b.parser,b.parser.pos,"Expected "+this.str);
            b.push(null);
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"keyword("+JSON.stringify(this.str)+")");
    }
}

export function keyword(str: string): Action {
    return new KeywordAction(str);
}

class IdentifierAction extends LeafAction {
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
            const ident = b.getNode(0);
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

class WhitespaceAction extends LeafAction {
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

class WhitespaceNoNewlineAction extends LeafAction {
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

class IdentifierTokenAction extends LeafAction {
    public constructor() {
        super("identifier_token",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof IdentifierTokenAction);
    }

    public execute(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind != TokenKind.IDENT))
                throw new ParseError(b.parser,b.parser.pos,"Expected identifier");
            b.push(new GenericStringNode(token.range,"Identifier",token.value));
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"identifier_token");
    }
}

export const identifier_token: Action = new IdentifierTokenAction();

class NumericLiteralTokenAction extends LeafAction {
    public constructor() {
        super("numeric_literal_token",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof NumericLiteralTokenAction);
    }

    public execute(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind != TokenKind.NUMBER))
                throw new ParseError(b.parser,b.parser.pos,"Expected number");
            const numericValue = parseFloat(token.value);
            b.push(new GenericNumberNode(token.range,"NumericLiteral",numericValue));
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"numeric_literal_token");
    }
}

export const numeric_literal_token: Action = new NumericLiteralTokenAction();

class StringLiteralTokenAction extends LeafAction {
    public constructor() {
        super("string_literal_token",1);
    }

    public equals(other: Action): boolean {
        return (other instanceof StringLiteralTokenAction);
    }

    public execute(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind != TokenKind.STRING))
                throw new ParseError(b.parser,b.parser.pos,"Expected string");
            b.push(new GenericStringNode(token.range,"StringLiteral",token.value,true));
        });
    }

    public dump(prefix: string, indent: string, output: (str: string) => void): void {
        output(prefix+"string_literal_token");
    }
}

export const string_literal_token = new StringLiteralTokenAction();
