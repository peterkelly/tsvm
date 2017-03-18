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
    Empty,
    Completion,
    Reference,
    JSValue,
} from "../runtime/datatypes";
import {
    ExecutionContext,
} from "../runtime/08-03-context";

export class CastError {
    public value: any;
    public typeName: string;

    constructor(value: any, typeName: string) {
        this.value = value;
        this.typeName = typeName;
    }

    public toString(): string {
        return this.value+" is not a "+this.typeName;
    }
}

export class Range {
    public start: number;
    public end: number;

    public constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}

export abstract class ASTNode {
    public range: Range;
    public readonly kind: string;

    public constructor(range: Range, kind: string) {
        this.range = range;
        this.kind = kind;
    }
    public abstract get children(): (ASTNode | null)[];
    public get label(): string { return this.kind; }
}

export abstract class ExpressionNode extends ASTNode {
    public _type_ExpressionNode: any;

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference>;
}

export abstract class StatementListItemNode extends ASTNode {
    public _type_StatementListItemNode: any;

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;

    // ES6 Section 13.2.6: Static Semantics: LexicallyScopedDeclarations
    public abstract lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void;

    // ES6 Section 13.2.11 Static Semantics: VarDeclaredNames
    public abstract varDeclaredNames(out: string[]): void;

    // ES6 Section 13.2.12 Static Semantics: VarScopedDeclarations
    public abstract varScopedDeclarations(out: VarScopedDeclaration[]): void;
}

export abstract class DeclarationNode extends StatementListItemNode implements LexicallyScopedDeclaration {
    public _type_DeclarationNode: any;
    public _interface_LexicallyScopedDeclaration: any;

    // ES6 Section 13.2.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        out.push(this);
    }

    // ES6 Section 13.2.11 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.2.12 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public abstract isConstantDeclaration(): boolean;

    public abstract boundNames(out: string[]): void;

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;
}

export abstract class HoistableDeclarationNode extends DeclarationNode {
    public _type_HoistableDeclarationNode: any;
}

export class BindingIdentifierNode extends ASTNode {
    public _type_BindingIdentifierNode: any;
    public readonly value: string;

    public constructor(range: Range, value: string) {
        super(range,"BindingIdentifier");
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        return "BindingIdentifier("+JSON.stringify(this.value)+")";
        // return this.value;
    }

    // ES6 Section 12.1.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        out.push(this.value);
    }

    public static fromGeneric(node: ASTNode | null): BindingIdentifierNode {
        if ((node === null) || (node.kind !== "BindingIdentifier") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("BindingIdentifier",node);
        return new BindingIdentifierNode(node.range,node.value);
    }
}

export class IdentifierNode extends ASTNode {
    public _type_IdentifierNode: any;
    public readonly value: string;

    public constructor(range: Range, value: string) {
        super(range,"Identifier");
        this.value = value;
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public get label(): string {
        return "Identifier("+JSON.stringify(this.value)+")";
        // return this.value;
    }
    public static fromGeneric(node: ASTNode | null): IdentifierNode {
        if ((node === null) || (node.kind !== "Identifier") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("Identifier",node);
        return new IdentifierNode(node.range,node.value);
    }
}

export class ListNode extends ASTNode {
    public _type_ListNode: any;
    public readonly elements: ASTNode[];

    public constructor(range: Range, elements: ASTNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): ListNode {
        throw new Error("ListNode.fromGeneric not implemented");
    }
}

export class ErrorNode extends ASTNode {
    public _type_ErrorNode: any;
    public readonly message: string;

    public constructor(range: Range, message: string) {
        super(range,"Error");
        this.message = message;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        return "ERROR: "+this.message;
    }

    public static fromGeneric(node: ASTNode | null): ErrorNode {
        throw new Error("ErrorNode.fromGeneric not implemented");
    }
}

export class GenericNode extends ASTNode {
    public _type_GenericNode: any ;
    public readonly _children: ASTNode[];
    public readonly value: any;

    public constructor(range: Range, kind: string, children: any[], value?: any) {
        super(range,kind);
        this._children = [];
        for (const child of children) {
            if ((child !== null) && !(child instanceof ASTNode))
                throw new Error(kind+": "+child+" is not an ASTNode");
            this._children.push(child);
        }
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return this._children;
    }

    public get label(): string {
        return this.kind;
    }
}

export class GenericStringNode extends ASTNode {
    public _type_GenericStringNode: any;
    public readonly value: string;
    public readonly raw: boolean;

    public constructor(range: Range, kind: string, value: string, raw: boolean = false) {
        super(range,kind);
        this.value = value;
        this.raw = raw;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        if (this.raw)
            return JSON.stringify(this.value);
        else
            return this.kind+"("+JSON.stringify(this.value)+")";
    }
}

export class GenericNumberNode extends ASTNode {
    public _type_GenericNumberNode: any;
    public readonly value: number;

    public constructor(range: Range, kind: string, value: number) {
        super(range,kind);
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        return ""+this.value;
    }
}

export class check {

    public static arity(node: ASTNode, arity: number): void {
        if (node.children.length != arity)
            throw new Error(node.kind+" node has "+node.children.length+" children, expected "+arity);
    }

    public static node(node: ASTNode | null, name: string, arity: number): ASTNode {
        if (node === null)
            throw new Error("node is null; expected "+name);
        if (node.kind !== name)
            throw new Error("node is "+node.kind+"; expected "+name);
        if (node.children.length != arity)
            throw new Error("node has "+node.children.length+" children, expected "+arity);
        return node;
    }

    public static nodeNotNull(node: ASTNode | null): ASTNode {
        if (node === null)
            throw new Error("node is null; expected "+name);
        return node;
    }

    public static list(node: ASTNode | null): ListNode {
        if (node === null)
            throw new Error("node is null; expected a list");
        if (!(node instanceof ListNode))
            throw new Error("node is "+node.kind+"; expected a list");
        return node;
    }

}

export class CannotConvertError {
    public readonly desiredType: string;
    public readonly node: ASTNode | null;

    public constructor(desiredType: string, node: ASTNode | null) {
        this.desiredType = desiredType;
        this.node = node;
    }

    public toString(): string {
        if (this.node === null)
            return "Cannot convert null to "+this.desiredType;
        else
            return "Cannot convert "+this.node.kind+" to "+this.desiredType;
    }
}

export interface VarScopedDeclaration {
    _interface_VarScopedDeclaration: any;
    boundNames(out: string[]): void;
    isConstantDeclaration(): boolean;
}

export interface LexicallyScopedDeclaration {
    _interface_LexicallyScopedDeclaration: any;
    boundNames(out: string[]): void;
    isConstantDeclaration(): boolean;
}
