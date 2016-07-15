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
    ErrorNode,
    GenericNode,
    IdentifierNode,
    StringLiteralNode,
    NumericLiteralNode,
    ComputedPropertyNameNode,
    ColonPropertyDefinitionNode,
    CoverInitializedNameNode,
    MethodDefinitionNode,
    IdentifierReferenceNode,
    StatementNode,
    DeclarationNode,
    BindingIdentifierNode,
    SingleNameBindingNode,
    ExpressionNode,
    BindingPropertyListNode,
    BindingElementType,
    BindingPatternInitNode,
    BindingPatternNode,
    BindingRestElementNode,
    BindingElisionElementNode,
    ElisionNode,
} from "./ast";

export class Builder {
    public parser: Parser;
    public stack: any[] = [];
    public constructor(parser: Parser) {
        this.parser = parser;
    }
    public item(f: (p: Parser) => any): void {
        this.stack.push(f(this.parser));
    }
    public items(funs: ((p: Parser) => any)[]): void {
        for (const f of funs)
            this.item(f);
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

    public attempt<T>(f: () => T): T {
        const start = this.parser.pos;
        const length = this.stack.length;
        try {
            return f();
        }
        catch (e) {
            this.parser.pos = start;
            this.stack.length = length;
            throw e;
        }
    }

    // F must either throw an exception or result in exactly one extra item on the stack
    public opt(f: () => void): void {
        try {
            this.attempt(() => {
                const oldLength = this.stack.length;
                f();
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

    public assertLengthIs(length: number): void {
        if (this.stack.length != length)
            throw new Error("Expected b to have exactly "+length+
                            " items on the stack; have "+this.stack.length);
    }
}

export function opt<T>(f: (p: Parser) => T): (p: Parser) => T {
    return (p: Parser): T => p.opt(f);
}

export function pos(p: Parser) {
    return p.pos;
}

export function keyword(str: string): ((p: Parser) => void) {
    return (p: Parser): void => p.expectKeyword(str);
}

export function punctuator(str: string): (p: Parser) => void {
    return (p: Parser): void => p.expectPunctuator(str);
}

export function notKeyword(str: string) {
    return (p: Parser): void => {
        if (p.lookaheadKeyword(str))
            throw new ParseError(p,p.pos,"Unexpected "+str);
    };
}

export function notPunctuator(str: string) {
    return (p: Parser): void => {
        if (p.lookaheadPunctuator(str))
            throw new ParseError(p,p.pos,"Unexpected "+str);
    };
}

export function identifier(str: string) {
    return (p: Parser): void => {
        const ident = Identifier(p);
        if (ident instanceof ErrorNode)
            throw new ParseError(p,p.pos,"Expected "+str);
        if (ident.value != str)
            throw new ParseError(p,p.pos,"Expected "+str);
    };
}

export function whitespace(p: Parser): void {
    p.skipWhitespace();
}

export function whitespaceNoNewline(p: Parser): void {
    p.skipWhitespaceNoNewline();
}

export function isLiteralPropertyNameType(value: any): boolean {
    if (value == null)
        return false;
    return ((value instanceof IdentifierNode) ||
            (value instanceof StringLiteralNode) ||
            (value instanceof NumericLiteralNode));
}

export function isPropertyNameType(value: any): boolean {
    if (value == null)
        return false;
    return ((value instanceof ComputedPropertyNameNode) ||
            isLiteralPropertyNameType(value));
}

export function isPropertyDefinitionType(value: any): boolean {
    if (value == null)
        return false;
    return ((value instanceof ColonPropertyDefinitionNode) ||
            (value instanceof CoverInitializedNameNode) ||
            (value instanceof MethodDefinitionNode) ||
            (value instanceof IdentifierReferenceNode));
}

export function isStatementListItemType(value: any): boolean {
    if (value == null)
        return false;
    return ((value instanceof StatementNode) ||
            (value instanceof DeclarationNode));
}

export function isSingleNameBindingType(value: any): boolean {
    if (value == null)
        return false;
    return ((value instanceof BindingIdentifierNode) ||
            (value instanceof SingleNameBindingNode));
}

export function checkNode(value: any): ASTNode | null {
    if ((value === null) || (value instanceof ASTNode))
        return value;
    else
        throw new CastError(value,"ASTNode | null");
}

export function checkExpressionNode(value: any): ExpressionNode | ErrorNode | null {
    if ((value === null) || (value instanceof ExpressionNode) || (value instanceof ErrorNode))
        return value;
    else
        throw new CastError(value,"ASTNode | null");
}

export function checkBindingPropertyListNode(value: any): BindingPropertyListNode | ErrorNode | null {
    if ((value == null) || (value instanceof BindingPropertyListNode) || (value instanceof ErrorNode))
        return value;
    else
        throw new CastError(value,"BindingPropertyListNode | ErrorNode | null");
}

export function checkBindingElementType(value: any): BindingElementType | ErrorNode | null {
    if ((value == null) ||
        // SingleNameBindingType
        (value instanceof BindingIdentifierNode) ||
        (value instanceof SingleNameBindingNode) ||
        // BindingPatternInitNode
        (value instanceof BindingPatternInitNode) ||
        // BindingPatternNode
        (value instanceof BindingPatternNode) ||
        // BindingRestElementNode
        (value instanceof BindingRestElementNode) ||
        // BindingElisionElementNode
        (value instanceof BindingElisionElementNode) ||
        // ElisionNode
        (value instanceof ElisionNode) ||
        // ErrorNode
        (value instanceof ErrorNode))
        return value;
    else
        throw new CastError(value,"BindingElementType | ErrorNode | null");
}

export function checkGenericNode(value: any): ErrorNode | null {
    if ((value === null) || (value instanceof ErrorNode)) // GenericNode is a subclass of ErrorNode, for now
        return value;
    else
        throw new CastError(value,"ASTNode | null");
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
