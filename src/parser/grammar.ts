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
    Identifier
} from "./syntax";
import {
    CastError,
    Range,
    ASTNode,
    ListNode,
    ErrorNode,
    GenericNode,
    ExpressionNode,
    IdentifierNode,
} from "./ast";

export class Builder {
    public parser: Parser;
    public stack: any[] = [];
    public constructor(parser: Parser) {
        this.parser = parser;
    }
    public get length(): number {
        return this.stack.length;
    }
    public item(f: (b: Builder) => void): void {
        f(this);
    }
    public items(funs: ((b: Builder) => void)[]): void {
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

    public repeatChoice(list: ((b: Builder) => void)[]): void {
        this.repeat(() => this.choice(list));
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

export function opt(f: (b: Builder) => void): (b: Builder) => void {
    return (b: Builder) => b.opt(f);
}

export function choice(list: ((b: Builder) => void)[]): (b: Builder) => void {
    return (b: Builder) => b.choice(list);
}

export function pos(b: Builder) {
    b.push(b.parser.pos);
}

export function value(value: any): (b: Builder) => void {
    return (b: Builder) => b.push(value);
}

export function keyword(str: string): ((b: Builder) => void) {
    return (b: Builder): void => {
        b.parser.expectKeyword(str);
        b.push(null);
    }
}

export function punctuator(str: string): (b: Builder) => void {
    return (b: Builder): void => {
        b.parser.expectPunctuator(str);
        b.push(null);
    }
}

export function notKeyword(str: string): (b: Builder) => void {
    return (b: Builder): void => {
        if (b.parser.lookaheadKeyword(str))
            throw new ParseError(b.parser,b.parser.pos,"Unexpected "+str);
        b.push(null);
    };
}

export function notPunctuator(str: string): (b: Builder) => void {
    return (b: Builder): void => {
        if (b.parser.lookaheadPunctuator(str))
            throw new ParseError(b.parser,b.parser.pos,"Unexpected "+str);
        b.push(null);
    };
}

export function identifier(str: string): (b: Builder) => void {
    return (b: Builder): void => {
        b.attempt((): void => {
            const oldLength = b.stack.length;
            const start = b.parser.pos;
            Identifier(b);
            b.assertLengthIs(oldLength+1);
            const ident = checkNode(b.get(0));
            if (!(ident instanceof IdentifierNode) || (ident.value != str))
                throw new ParseError(b.parser,start,"Expected "+str);
            // Identifier_b will already have pushed onto the stack
        })
    };
}

export function whitespace(b: Builder): void {
    b.parser.skipWhitespace();
    b.push(null);
}

export function whitespaceNoNewline(b: Builder): void {
    b.parser.skipWhitespaceNoNewline();
    b.push(null);
}

export function checkNode(value: any): ASTNode | null {
    if ((value === null) || (value instanceof ASTNode))
        return value;
    else
        throw new CastError(value,"ASTNode | null");
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
