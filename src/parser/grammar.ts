// Copyright 2016-2017 Peter Kelly <peter@pmkelly.net>
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
import { leftpad, rightpad } from "../util";

const PROFILE_WIDTH = 24;
const PRODUCTION_WIDTH = 40;

const TOP_PRECEDENCE = 11;
const CHOICE_PRECEDENCE = 10;
const SEQUENCE_PRECEDENCE = 9;
const NOT_PRECEDENCE = 8;
const QUESTION_PRECEDENCE = 7;
const STAR_PRECEDENCE = 7;
const PLUS_PRECEDENCE = 7;

export interface OutputOptions {
    profile?: boolean;
    write(str: string): void;
}

export type Transformer = (action: Action, ctx: Context) => Action;

export class Context {
    public readonly transformer: Transformer;
    public readonly grammar: Grammar;

    public constructor(transformer: Transformer, grammar: Grammar) {
        this.transformer = transformer;
        this.grammar = grammar;
    }

    public process(action: Action): Action {
        return this.transformer(action, this);
    }
}

function needParentheses(precedence: number, target: number): boolean {
    return precedence <= target;
}

export class Grammar {
    private productions = new Map<string, ProductionAction>();
    private names: string[] = [];

    public define(name: string, fun: Action) {
        if (this.productions.has(name))
            throw new Error("Production " + name + " is already defined");
        this.productions.set(name, new ProductionAction(name, fun));
        this.names.push(name);
    }

    public derive(name: string, fun: Action): ProductionAction {
        const match = name.match(/(^.*)_([0-9]+)$/);
        const baseName = match ? match[1] : name;
        let num = 1;
        while (this.productions.has(baseName + ":" + num))
            num++;
        const derivedName = baseName + ":" + num;
        let index = this.names.indexOf(baseName);
        index = (index >= 0) ? index : this.names.length;

        const production = new ProductionAction(derivedName, fun, fun.offset);
        this.productions.set(derivedName, production);
        this.names.splice(index, 0, derivedName);
        return production;
    }

    public lookup(name: string): ProductionAction {
        const production = this.productions.get(name);
        if (production === undefined)
            throw new Error("Production not found: " + name);
        return production;
    }

    public dump(output: OutputOptions): void {
        for (const name of this.names) {
            this.lookup(name).dump("", "", output);
        }
    }

    public toSyntax(output: OutputOptions): void {
        for (const name of this.names) {
            this.lookup(name).toSyntax(output, TOP_PRECEDENCE);
            output.write("\n");
        }
    }

    public clone(): Grammar {
        const newGrammar = new Grammar();
        for (const name of this.names) {
            const production = this.lookup(name);
            newGrammar.productions.set(name, production);
            newGrammar.names.push(name);
        }
        return newGrammar;
    }

    public transform(t: Transformer) {
        const newGrammar = this.clone();
        const ctx = new Context(t, newGrammar);
        for (let i = 0; i < newGrammar.names.length; i++) {
            const name = newGrammar.names[i];
            const production = newGrammar.productions.get(name);
            if (production === undefined)
                throw new Error("Action " + JSON.stringify(name) + " not found");
            const result = ctx.process(production);
            if (result instanceof ProductionAction)
                newGrammar.productions.set(name, result);
            else
                newGrammar.productions.set(name, new ProductionAction(name, result, result.offset));
        }
        return newGrammar;
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
        const pos = this.stack.length - 1 - index;
        if (pos >= 0)
            return this.stack[pos];
        else
            throw new Error("Attempt to access position " + (this.stack.length - 1 - index) + " on stack");
    }

    public getNumber(index: number): number {
        const value = this.get(index);
        if (typeof(value) === "number")
            return value;
        throw new CastError(value, "number");
    }

    public getNode(index: number): any {
        const value = this.get(index);
        if ((value === null) || (value instanceof ASTNode))
            return value;
        else
            throw new CastError(value, "ASTNode | null");
    }

    public getStringNode(index: number): GenericStringNode | null {
        const value = this.get(index);
        if ((value === null) || (value instanceof GenericStringNode))
            return value;
        else
            throw new CastError(value, "GenericStringNode | null");
    }

    public getNumberNode(index: number): GenericNumberNode | null {
        const value = this.get(index);
        if ((value === null) || (value instanceof GenericNumberNode))
            return value;
        else
            throw new CastError(value, "GenericNumberNode | null");
    }

    public splice(index: number, value: any): any {
        const pos = this.stack.length - index - 1;
        if (pos >= 0) {
            this.stack[pos] = value;
            this.stack.length = pos + 1;
        }
        else {
            throw new Error("Attempt to set position " + (this.stack.length - 1 - index) + " on stack");
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
        if (this.stack.length !== length)
            throw new Error("Expected b to have exactly " + length +
                            " items on the stack; have " + this.stack.length);
    }
}

function actionArrayEquals(first: Action[], second: Action[]): boolean {
    if (first.length !== second.length)
        return false;
    for (let i = 0; i < first.length; i++) {
        if (!first[i].equals(second[i]))
            return false;
    }
    return true;
}

function numberArrayEquals(first: number[], second: number[]): boolean {
    if (first.length !== second.length)
        return false;
    for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i])
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
    if (actions.length === 0)
        return 0;
    const result = actions[0].offset;
    for (let i = 1; i < actions.length; i++) {
        if ((actions[i].offset !== result) &&
            !(actions[i] instanceof FailAction) &&
            !(actions[i] instanceof LabelAction) &&
            !(actions[i] instanceof GotoAction)) // FIXME: Unsure if we should include goto here
            throw new Error("Choice has children with different offset values " +
                actions.map(action => (<any> action).constructor.name + " (" + action.offset + ")").join(", "));
    }
    return result;
}

export abstract class Action {
    public readonly kind: string;
    public readonly offset: number;
    public started = 0;
    public finished = 0;
    public readonly id: number;
    public derivedFrom: Action | null = null;
    public readonly derivatives: Set<Action> = new Set<Action>();

    private static nextId = 0;

    public constructor(kind: string, offset: number) {
        this.kind = kind;
        this.offset = offset;
        this.id = Action.nextId++;
    }

    public execute(b: Builder): void {
        this.started++;
        this.executeImpl(b);
        this.finished++;
    }

    public stats(output: OutputOptions): string {
        if (!output.profile)
            return "";
        if (this.started === 0)
            return this.space(output);
        const pct = (this.started > 0) ? (Math.round(100 * (this.finished / this.started)) + "%") : "0%";
        return leftpad(this.started, 7) + " " + leftpad(this.finished, 7) + " " + leftpad(pct, 4) + "    ";
    }

    public space(output: OutputOptions): string {
        if (!output.profile)
            return "";
        return leftpad("", PROFILE_WIDTH);
    }

    public recordDerivation(from: Action): this {
        from.derivatives.add(this);
        this.derivedFrom = from;
        return this;
    }

    public abstract equals(other: Action): boolean;

    public abstract executeImpl(b: Builder): void;

    public abstract dump(prefix: string, indent: string, output: OutputOptions): void;

    public abstract toSyntax(output: OutputOptions, precedence: number): void;

    public abstract transform(ctx: Context): Action;

    public abstract toString(): string;
}

export abstract class LeafAction extends Action {
    public transform(ctx: Context): Action {
        return this;
    }
    public abstract shortString(): string;

    public toString(): string {
        return this.shortString();
    }
}

export class ProductionAction extends Action {
    public readonly body: Action;
    public readonly name: string;

    public constructor(name: string, body: Action, offset?: number) {
        super("[" + name + "]", (offset !== undefined) ? offset : 1);
        this.name = name;
        this.body = body;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ProductionAction) &&
                this.body.equals(other.body) &&
                (this.name === other.name));
    }

    public executeImpl(b: Builder): void {
        b.attempt((): void => {
            const oldLength = b.length;
            this.body.execute(b);
            b.assertLengthIs(oldLength + 1);
            b.getNode(0); // Check that the top of the stack is either a node null
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + "grm.define(" + JSON.stringify(this.name) + ",\n");
        this.body.dump(indent + "    ", indent + "    ", output);
        output.write(");\n\n");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(rightpad(this.name, PRODUCTION_WIDTH) + " = ");
        if (this.body instanceof ChoiceAction) {
            for (let i = 0; i < this.body.choices.length; i++) {
                if (i > 0)
                    output.write(rightpad("", PRODUCTION_WIDTH) + " | ");
                this.body.choices[i].toSyntax(output, CHOICE_PRECEDENCE);
                if (i + 1 < this.body.choices.length)
                    output.write("\n");
            }
        }
        else {
            this.body.toSyntax(output, precedence);
        }
        output.write(";");
    }

    public transform(ctx: Context): Action {
        const body = ctx.process(this.body);
        if (body === this.body)
            return this;
        else
            return new ProductionAction(this.name, body, body.offset);
    }

    public toString(): string {
        return "<Production " + this.name + ">";
    }
}

export class EmptyAction extends LeafAction {
    public constructor(offset?: number) {
        super("empty", offset || 0);
    }

    public equals(other: Action): boolean {
        return (other instanceof EmptyAction);
    }

    public executeImpl(b: Builder): void {
        for (let i = 0; i < this.offset; i++)
            b.push(null);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + indent + this.shortString());
    }

    public toSyntax(): string {
        return "<empty>";
    }

    public shortString(): string {
        return "empty()";
    }
}

export function empty(offset?: number): Action {
    return new EmptyAction(offset);
}

export class FailAction extends LeafAction {
    public constructor(offset?: number) {
        super("fail", offset || 0);
    }

    public equals(other: Action): boolean {
        return (other instanceof FailAction);
    }

    public executeImpl(b: Builder): void {
        for (let i = 0; i < this.offset; i++)
            b.push(null);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + indent + this.shortString());
    }

    public toSyntax(): string {
        return "<fail>";
    }

    public shortString(): string {
        return "fail()";
    }
}

export function fail(offset?: number): Action {
    return new FailAction(offset);
}

export class NotAction extends Action {
    public readonly child: Action;

    public constructor(child: Action) {
        super("not", 0);
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof NotAction) &&
                this.child.equals(other.child));
    }

    public executeImpl(b: Builder): void {
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
            throw new ParseError(b.parser, b.parser.pos, "NOT predicate failed");
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + indent + "not(");
        this.child.dump("", indent, output);
        output.write(")");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("!");
        if (needParentheses(precedence, NOT_PRECEDENCE))
            output.write("(");
        this.child.toSyntax(output, NOT_PRECEDENCE);
        if (needParentheses(precedence, NOT_PRECEDENCE))
            output.write(")");
    }

    public transform(ctx: Context): Action {
        const child = ctx.process(this.child);
        return (child !== this.child) ? new NotAction(child) : this;
    }

    public toString(): string {
        return "<not>";
    }
}

export function not(f: Action): Action {
    return new NotAction(f);
}

export class RefAction extends Action {
    public readonly name: string;

    public constructor(productionName: string, offset?: number) {
        super("ref", (offset !== undefined) ? offset : 1);
        this.name = productionName;
    }

    public equals(other: Action): boolean {
        return ((other instanceof RefAction) &&
                (this.name === other.name));
    }

    public executeImpl(b: Builder): void {
        const production = b.grammar.lookup(this.name);
        if (production == null)
            throw new Error("Production " + this.name + " not defined");
        production.execute(b);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + "ref(" + JSON.stringify(this.name) + ")");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.name);
    }

    public transform(ctx: Context): Action {
        return this;
    }

    public toString(): string {
        return "<ref " + this.name + ">";
    }
}

export function ref(name: string): Action {
    return new RefAction(name);
}

export class ListAction extends Action {
    public readonly first: Action;
    public readonly rest: Action;

    public constructor(first: Action, rest: Action) {
        super("list", 1);
        this.first = first;
        this.rest = rest;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ListAction) &&
                this.first.equals(other.first) &&
                this.rest.equals(other.rest));
    }

    public executeImpl(b: Builder): void {
        b.attempt(() => {
            const start = b.parser.pos;
            const elements: ASTNode[] = [];
            const initialLength = b.stack.length;

            this.first.execute(b);
            b.assertLengthIs(initialLength + 1);
            const firstNode = b.getNode(0);
            if (firstNode != null)
                elements.push(firstNode);
            b.stack.pop();

            b.assertLengthIs(initialLength);
            b.repeat(() => {
                this.rest.execute(b);
                b.assertLengthIs(initialLength + 1);
                const node = b.get(0);
                if (node != null)
                    elements.push(node);
                b.stack.pop();
                b.assertLengthIs(initialLength);
            });
            b.assertLengthIs(initialLength);
            const end = (elements.length > 0) ? elements[elements.length - 1].range.end : start;
            b.push(new ListNode(new Range(start, end), elements));
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + "list(\n");
        this.first.dump(indent + "    ", indent + "    ", output);
        output.write(",\n");
        this.rest.dump(indent + "    ", indent + "    ", output);
        output.write("\n" + this.space(output) + indent + ")");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("list(");
        this.first.toSyntax(output, precedence);
        output.write(", ");
        this.rest.toSyntax(output, precedence);
        output.write(")");
    }

    public transform(ctx: Context): Action {
        const first = ctx.process(this.first);
        const rest = ctx.process(this.rest);
        if ((first !== this.first) || (rest !== this.rest))
            return new ListAction(first, rest);
        else
            return this;
    }

    public toString(): string {
        return "<list>";
    }
}

export function list(first: Action, rest: Action): Action {
    return new ListAction(first, rest);
}

export class SequenceAction extends Action {
    public readonly items: Action[];

    public constructor(items: Action[]) {
        super("sequence", actionsTotalOffset(items));
        this.items = items;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SequenceAction) &&
                actionArrayEquals(this.items, other.items));
    }

    public executeImpl(b: Builder): void {
        for (const act of this.items)
            act.execute(b);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + "sequence([\n");
        for (const act of this.items) {
            act.dump(indent + "    ", indent + "    ", output);
            output.write(",\n");
        }
        output.write(this.space(output) + indent + "])");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        if (needParentheses(precedence, SEQUENCE_PRECEDENCE))
            output.write("(");
        const itemsToPrint = this.items.filter(action => {
            return (!(action instanceof PosAction));
        });
        for (let i = 0; i < itemsToPrint.length; i++) {
            const act = itemsToPrint[i];
            act.toSyntax(output, SEQUENCE_PRECEDENCE);
            if (i + 1 < itemsToPrint.length)
                output.write(" ");
        }
        if (needParentheses(precedence, SEQUENCE_PRECEDENCE))
            output.write(")");
    }

    public transform(ctx: Context): Action {
        const newItems: Action[] = [];
        let different = false;
        for (let i = 0; i < this.items.length; i++) {
            newItems.push(ctx.process(this.items[i]));
            different = different || (newItems[i] !== this.items[i]);
        }
        return different ? new SequenceAction(newItems) : this;
    }

    public toString(): string {
        return "<sequence>";
    }
}

export function sequence(items: Action[]): Action {
    return new SequenceAction(items);
}

export class SpliceNullAction extends LeafAction {
    public readonly index: number;

    public constructor(index: number) {
        super("spliceNull", -index);
        this.index = index;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceNullAction) &&
                (this.index === other.index));
    }

    public executeImpl(b: Builder): void {
        b.splice(this.index, null);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return "spliceNull(" + this.index + ")";
    }
}

export function spliceNull(index: number): Action {
    return new SpliceNullAction(index);
}

export class SpliceReplaceAction extends LeafAction {
    public readonly index: number;
    public readonly srcIndex: number;

    public constructor(index: number, srcIndex: number) {
        super("spliceReplace", -index);
        this.index = index;
        this.srcIndex = srcIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceReplaceAction) &&
                (this.index === other.index) &&
                (this.srcIndex === other.srcIndex));
    }

    public executeImpl(b: Builder): void {
        b.splice(this.index, b.get(this.srcIndex));
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return "spliceReplace(" + this.index + ", " + this.srcIndex + ")";
    }
}

export function spliceReplace(index: number, srcIndex: number): Action {
    return new SpliceReplaceAction(index, srcIndex);
}

export class SpliceNodeAction extends LeafAction {
    public readonly index: number;
    public readonly name: string;
    public readonly startIndex: number;
    public readonly endIndex: number;
    public readonly childIndices: number[];

    public constructor(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]) {
        super("spliceNode", -index);
        this.index = index;
        this.name = name;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.childIndices = childIndices;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceNodeAction) &&
                (this.index === other.index) &&
                (this.name === other.name) &&
                (this.startIndex === other.startIndex) &&
                (this.endIndex === other.endIndex) &&
                numberArrayEquals(this.childIndices, other.childIndices));
    }

    public executeImpl(b: Builder): void {
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        const children: (ASTNode | null)[] = [];
        for (const childIndex of this.childIndices) {
            children.push(b.getNode(childIndex));
        }
        b.splice(this.index, new GenericNode(new Range(start, end), this.name, children));
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("=> " + this.name + "(" + this.childIndices.map((n: number) => n.toString()).join(", ") + ")");
    }

    public shortString(): string {
        return (
            "spliceNode(" +
            this.index + ", " +
            JSON.stringify(this.name) + ", " +
            this.startIndex + ", " +
            this.endIndex + ", " +
            "[" + this.childIndices.map((n: number) => n.toString()).join(", ") + "]" +
            ")");
    }
}

export function spliceNode(index: number, name: string, startIndex: number, endIndex: number, childIndices: number[]): Action {
    return new SpliceNodeAction(index, name, startIndex, endIndex, childIndices);
}

export class SpliceStringNodeAction extends LeafAction {
    public readonly index: number;
    public readonly nodeName: string;
    public readonly startIndex: number;
    public readonly endIndex: number;
    public readonly valueIndex: number;

    public constructor(index: number, nodeName: string, startIndex: number, endIndex: number, valueIndex: number) {
        super("spliceStringNode", -index);
        this.index = index;
        this.nodeName = nodeName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.valueIndex = valueIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceStringNodeAction) &&
                (this.nodeName === other.nodeName) &&
                (this.startIndex === other.startIndex) &&
                (this.endIndex === other.endIndex) &&
                (this.valueIndex === other.valueIndex));
    }

    public executeImpl(b: Builder): void {
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        const range = new Range(start, end);
        const valueNode = b.getStringNode(this.valueIndex);
        if (valueNode == null)
            b.splice(this.index, null);
        else
            b.splice(this.index, new GenericStringNode(range, this.nodeName, valueNode.value));
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(
            this.stats(output) +
            prefix +
            this.shortString()
        );
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return (
            "spliceStringNode(" + this.index + ", " +
            JSON.stringify(this.nodeName) + ", " +
            this.startIndex + ", " +
            this.endIndex + ", " +
            this.valueIndex + ")"
        );
    }
}

export function spliceStringNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): Action {
    return new SpliceStringNodeAction(index, name, startIndex, endIndex, valueIndex);
}

export class SpliceNumberNodeAction extends LeafAction {
    public readonly index: number;
    public readonly nodeName: string;
    public readonly startIndex: number;
    public readonly endIndex: number;
    public readonly valueIndex: number;

    public constructor(index: number, nodeName: string, startIndex: number, endIndex: number, valueIndex: number) {
        super("spliceNumberNode", -index);
        this.index = index;
        this.nodeName = nodeName;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.valueIndex = valueIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceNumberNodeAction) &&
                (this.nodeName === other.nodeName) &&
                (this.startIndex === other.startIndex) &&
                (this.endIndex === other.endIndex) &&
                (this.valueIndex === other.valueIndex));
    }

    public executeImpl(b: Builder): void {
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        const range = new Range(start, end);
        const valueNode = b.getNumberNode(this.valueIndex);
        if (valueNode == null)
            b.splice(this.index, null);
        else
            b.splice(this.index, new GenericNumberNode(range, this.nodeName, valueNode.value));
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return (
            "spliceNumberNode(" + this.index + ", " +
            JSON.stringify(this.nodeName) + ", " +
            this.startIndex + ", " +
            this.endIndex + ", " +
            this.valueIndex + ")"
        );
    }
}

export function spliceNumberNode(index: number, name: string, startIndex: number, endIndex: number, valueIndex: number): Action {
    return new SpliceNumberNodeAction(index, name, startIndex, endIndex, valueIndex);
}

export class SpliceEmptyListNodeAction extends LeafAction {
    public readonly index: number;
    public readonly startIndex: number;
    public readonly endIndex: number;

    public constructor(index: number, startIndex: number, endIndex: number) {
        super("spliceEmptyListNode", -index);
        this.index = index;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }

    public equals(other: Action): boolean {
        return ((other instanceof SpliceEmptyListNodeAction) &&
                (this.startIndex === other.startIndex) &&
                (this.endIndex === other.endIndex));
    }

    public executeImpl(b: Builder): void {
        const start = b.getNumber(this.startIndex);
        const end = b.getNumber(this.endIndex);
        b.splice(this.index, new ListNode(new Range(start, end), []));
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return "spliceEmptyListNode(" + this.index + ", " + this.startIndex + ", " + this.endIndex + ")";
    }
}

export function spliceEmptyListNode(index: number, startIndex: number, endIndex: number): Action {
    return new SpliceEmptyListNodeAction(index, startIndex, endIndex);
}

export class PopAction extends LeafAction {
    public constructor() {
        super("pop", -1);
    }

    public equals(other: Action): boolean {
        return (other instanceof PopAction);
    }

    public executeImpl(b: Builder): void {
        if (b.stack.length === 0)
            throw new Error("Attempt to pop past end of stack");
        b.stack.length--;
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return "pop()";
    }
}

export function pop(): Action {
    return new PopAction();
}

export class OptAction extends Action {
    public readonly child: Action;

    public constructor(child: Action) {
        super("opt", 1);
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof OptAction) &&
                this.child.equals(other.child));
    }

    public executeImpl(b: Builder): void {
        // child must either throw an exception or result in exactly one extra item on the stack
        try {
            b.attempt(() => {
                const oldLength = b.stack.length;
                this.child.execute(b);
                b.assertLengthIs(oldLength + 1);
            });
        }
        catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
            b.push(null);
        }
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + indent + "opt(");
        this.child.dump("", indent, output);
        output.write(")");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        if (needParentheses(precedence, QUESTION_PRECEDENCE))
            output.write("(");
        this.child.toSyntax(output, QUESTION_PRECEDENCE);
        if (needParentheses(precedence, QUESTION_PRECEDENCE))
            output.write(")");
        output.write(")?");
    }

    public transform(ctx: Context): Action {
        const child = ctx.process(this.child);
        return (child !== this.child) ? new OptAction(child) : this;
    }

    public toString(): string {
        return "<opt>";
    }
}

export function opt(f: Action): Action {
    return new OptAction(f);
}

export class ChoiceAction extends Action {
    public readonly choices: Action[];

    public constructor(choices: Action[]) {
        super("choice", actionsSameOffset(choices));
        this.choices = choices;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ChoiceAction) &&
                actionArrayEquals(this.choices, other.choices));
    }

    public executeImpl(b: Builder): void {
        const start = b.parser.pos;
        const length = b.stack.length;
        for (const act of this.choices) {
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
        throw new ParseError(b.parser, b.parser.pos, "No valid alternative found");
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + "choice([\n");
        for (const act of this.choices) {
            act.dump(indent + "    ", indent + "    ", output);
            output.write(",\n");
        }
        output.write(this.stats(output) + indent + "])");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        if (needParentheses(precedence, CHOICE_PRECEDENCE))
            output.write("(");
        for (let i = 0; i < this.choices.length; i++) {
            const act = this.choices[i];
            act.toSyntax(output, CHOICE_PRECEDENCE);
            if (i + 1 < this.choices.length)
                output.write(" | ");
        }
        if (needParentheses(precedence, CHOICE_PRECEDENCE))
            output.write(")");
    }

    public transform(ctx: Context): Action {
        const newChoices: Action[] = [];
        let different = false;
        for (let i = 0; i < this.choices.length; i++) {
            newChoices.push(ctx.process(this.choices[i]));
            different = different || (newChoices[i] !== this.choices[i]);
        }
        return different ? new ChoiceAction(newChoices) : this;
    }

    public toString(): string {
        return "<choice>";
    }
}

export function choice(choices: Action[]): Action {
    return new ChoiceAction(choices);
}

export class RepeatAction extends Action {
    public readonly child: Action;

    public constructor(child: Action) {
        super("repeat", 0);
        this.child = child;
    }

    public equals(other: Action): boolean {
        return ((other instanceof RepeatAction) &&
                this.child.equals(other.child));
    }

    public executeImpl(b: Builder): void {
        b.repeat((b: Builder) => {
            this.child.execute(b);
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + indent + "repeat(");
        this.child.dump("", indent, output);
        output.write(")");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        if (needParentheses(precedence, STAR_PRECEDENCE))
            output.write("(");
        this.child.toSyntax(output, STAR_PRECEDENCE);
        if (needParentheses(precedence, STAR_PRECEDENCE))
            output.write(")");
        output.write("*");
    }

    public transform(ctx: Context): Action {
        const child = ctx.process(this.child);
        return (child !== this.child) ? new RepeatAction(child) : this;
    }

    public toString(): string {
        return "<repeat>";
    }
}

export function repeat(f: Action): Action {
    return new RepeatAction(f);
}

export class PosAction extends LeafAction {
    public constructor() {
        super("pos", 1);
    }

    public equals(other: Action): boolean {
        return (other instanceof PosAction);
    }

    public executeImpl(b: Builder): void {
        b.push(b.parser.pos);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("<pos>");
    }

    public shortString(): string {
        return "pos()";
    }
}

export function pos(): Action {
    return new PosAction();
}

export class ValueAction extends LeafAction {
    public readonly value: any;

    public constructor(value: any) {
        super("value", 1);
        this.value = value;
    }

    public equals(other: Action): boolean {
        return ((other instanceof ValueAction) &&
                (this.value === other.value));
    }

    public executeImpl(b: Builder): void {
        b.push(this.value);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public shortString(): string {
        return "value(" + JSON.stringify(this.value) + ")";
    }
}

export function value(value: any): Action {
    return new ValueAction(value);
}

export abstract class TokenAction extends LeafAction {
}

export class KeywordAction extends TokenAction {
    public readonly str: string;

    public constructor(str: string) {
        super("keyword", 1);
        this.str = str;
    }

    public equals(other: Action): boolean {
        return ((other instanceof KeywordAction) &&
                (this.str === other.str));
    }

    public executeImpl(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token === null) || (token.value !== this.str))
                throw new ParseError(b.parser, b.parser.pos, "Expected " + this.str);
            b.push(null);
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(JSON.stringify(this.str));
    }

    public shortString(): string {
        return "keyword(" + JSON.stringify(this.str) + ")";
    }
}

export function keyword(str: string): Action {
    return new KeywordAction(str);
}

export class IdentifierAction extends LeafAction {
    public readonly str: string;

    public constructor(str: string) {
        super("identifier", 1);
        this.str = str;
    }

    public equals(other: Action): boolean {
        return ((other instanceof IdentifierAction) &&
                (this.str === other.str));
    }

    public executeImpl(b: Builder): void {
        b.attempt((): void => {
            const oldLength = b.stack.length;
            const start = b.parser.pos;
            ref("Identifier").execute(b);
            b.assertLengthIs(oldLength + 1);
            const ident = b.getNode(0);
            if (!(ident instanceof GenericStringNode) || (ident.value !== this.str))
                throw new ParseError(b.parser, start, "Expected " + this.str);
            // Identifier_b will already have pushed onto the stack
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(JSON.stringify(this.str));
    }

    public shortString(): string {
        return "identifier(" + JSON.stringify(this.str) + ")";
    }
}

export function identifier(str: string): Action {
    return new IdentifierAction(str);
}

export class WhitespaceAction extends LeafAction {
    public constructor() {
        super("whitespace", 1);
    }

    public equals(other: Action): boolean {
        return (other instanceof WhitespaceAction);
    }

    public executeImpl(b: Builder): void {
        b.parser.skipWhitespace();
        b.push(null);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(".");
    }

    public shortString(): string {
        return "whitespace()";
    }
}

export function whitespace(): Action {
    return new WhitespaceAction();
}

export class WhitespaceNoNewlineAction extends LeafAction {
    public constructor() {
        super("whitespaceNoNewline", 1);
    }

    public equals(other: Action): boolean {
        return (other instanceof WhitespaceNoNewlineAction);
    }

    public executeImpl(b: Builder): void {
        b.parser.skipWhitespaceNoNewline();
        b.push(null);
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(".n");
    }

    public shortString(): string {
        return "whitespaceNoNewline()";
    }
}

export function whitespaceNoNewline(): Action {
    return new WhitespaceNoNewlineAction();
}

export class IdentifierTokenAction extends LeafAction {
    public constructor() {
        super("identifier_token", 1);
    }

    public equals(other: Action): boolean {
        return (other instanceof IdentifierTokenAction);
    }

    public executeImpl(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind !== TokenKind.IDENT))
                throw new ParseError(b.parser, b.parser.pos, "Expected identifier");
            b.push(new GenericStringNode(token.range, "Identifier", token.value));
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("<identifier>");
    }

    public shortString(): string {
        return "identifier_token()";
    }
}

export function identifier_token(): Action {
    return new IdentifierTokenAction();
}

export class NumericLiteralTokenAction extends LeafAction {
    public constructor() {
        super("numeric_literal_token", 1);
    }

    public equals(other: Action): boolean {
        return (other instanceof NumericLiteralTokenAction);
    }

    public executeImpl(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind !== TokenKind.NUMBER))
                throw new ParseError(b.parser, b.parser.pos, "Expected number");
            const numericValue = parseFloat(token.value);
            b.push(new GenericNumberNode(token.range, "NumericLiteral", numericValue));
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("<number>");
    }

    public shortString(): string {
        return "numeric_literal_token()";
    }
}

export function numeric_literal_token(): Action {
    return new NumericLiteralTokenAction();
}

export class StringLiteralTokenAction extends LeafAction {
    public constructor() {
        super("string_literal_token", 1);
    }

    public equals(other: Action): boolean {
        return (other instanceof StringLiteralTokenAction);
    }

    public executeImpl(b: Builder): void {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind !== TokenKind.STRING))
                throw new ParseError(b.parser, b.parser.pos, "Expected string");
            b.push(new GenericStringNode(token.range, "StringLiteral", token.value, true));
        });
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write("<string>");
    }

    public shortString(): string {
        return "string_literal_token()";
    }
}

export function string_literal_token(): Action {
    return new StringLiteralTokenAction();
}

export class CaseAction extends Action {
    public readonly token: TokenAction;
    public readonly body: Action;

    public constructor(token: TokenAction, body: Action) {
        super("case", body.offset);
        this.token = token;
        this.body = body;
    }

    public equals(other: Action): boolean {
        throw new Error("TODO: CaseAction.equals() not implemented");
    }

    public executeImpl(b: Builder): void {
        throw new Error("TODO: CaseAction.executeImpl() not implemented");
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        throw new Error("TODO: CaseAction.dump() not implemented");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        throw new Error("TODO: CaseAction.toSyntax() not implemented");
    }

    public transform(ctx: Context): CaseAction {
        const newToken = ctx.process(this.token);
        if (!(newToken instanceof TokenAction))
            throw new Error("Case token must be a TokenAction subclass");
        const newBody = ctx.process(this.body);
        if ((newToken !== this.token) || (newBody !== this.body))
            return new CaseAction(newToken, newBody);
        else
            return this;
    }

    public toString(): string {
        return "<case " + this.token.toString() + ">";
    }
}

export class SwitchAction extends Action {
    public cases: CaseAction[];
    public otherwise: Action;

    public constructor(cases: CaseAction[], otherwise: Action) {
        // super("switch", actionsSameOffset((<Action[]> cases).concat([otherwise])));
        super("switch", actionsSameOffset(cases)); // FIXME: Check offsets
        this.cases = cases;
        this.otherwise = otherwise;
    }

    public equals(other: Action): boolean {
        throw new Error("TODO: SwitchAction.equals() not implemented");
    }

    public executeImpl(b: Builder): void {
        throw new Error("TODO: SwitchAction.executeImpl() not implemented");
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        throw new Error("TODO: SwitchAction.dump() not implemented");
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        throw new Error("TODO: SwitchAction.toSyntax() not implemented");
    }

    public transform(ctx: Context): Action {
        let different = false;
        const newCases: CaseAction[] = [];
        for (const action of this.cases) {
            const newAction = ctx.process(action);
            if (!(newAction instanceof CaseAction))
                throw new Error("Switch transform on CaseAction returned " + (<any> newAction).constructor.name);
            newCases.push(newAction);
            different = different || (newAction !== action);
        }
        const newOtherwise = ctx.process(this.otherwise);
        different = different || (newOtherwise !== this.otherwise);
        if (different)
            return new SwitchAction(newCases, newOtherwise);
        else
            return this;
    }

    public toString(): string {
        return "<switch>";
    }
}

export class LabelAction extends LeafAction {
    private static nextLabelId = 0;
    public readonly labelId: number;
    public constructor() {
        super("Label", 0);
        this.labelId = LabelAction.nextLabelId++;
    }

    public equals(other: Action): boolean {
        return ((other instanceof LabelAction) && (other.labelId === this.labelId));
    }

    public executeImpl(b: Builder): void {
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public transform(ctx: Context): Action {
        return this;
    }

    public shortString(): string {
        return "label " + this.labelId;
    }
}

export function label(): LabelAction {
    return new LabelAction();
}

export class GotoAction extends LeafAction {
    public readonly labelId: number;
    public constructor(labelId: number) {
        super("Goto", 0);
        this.labelId = labelId;
    }

    public equals(other: Action): boolean {
        return ((other instanceof GotoAction) && (other.labelId === this.labelId));
    }

    public executeImpl(b: Builder): void {
    }

    public dump(prefix: string, indent: string, output: OutputOptions): void {
        output.write(this.stats(output) + prefix + this.shortString());
    }

    public toSyntax(output: OutputOptions, precedence: number): void {
        output.write(this.shortString());
    }

    public transform(ctx: Context): Action {
        return this;
    }

    public shortString(): string {
        return "goto " + this.labelId;
    }

}

export function goto(labelId: number): GotoAction {
    return new GotoAction(labelId);
}
