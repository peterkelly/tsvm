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

export abstract class DeclarationNode extends ASTNode {
    _nominal_type_DeclarationNode: any;
}

export class BindingIdentifierNode extends ASTNode {
    _nominal_type_BindingIdentifierNode: any;
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
}

export class IdentifierNode extends ASTNode {
    _nominal_type_IdentifierNode: any;
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
}

export class ListNode extends ASTNode {
    _nominal_type_ListNode: any;
    public readonly elements: ASTNode[];
    public constructor(range: Range, elements: ASTNode[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ErrorNode extends ASTNode {
    _nominal_type_ErrorNode: any;
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
}

export class GenericNode extends ASTNode {
    _nominal_type_GenericNode: any ;
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
    _nominal_type_GenericStringNode: any;
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
    _nominal_type_GenericNumberNode: any;
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
