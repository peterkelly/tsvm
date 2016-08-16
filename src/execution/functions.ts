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
    Range,
    ASTNode,
    DeclarationNode,
    BindingIdentifierNode,
} from "../parser/ast";
import {
    PropertyNameType,
    ExpressionNode,
} from "./expressions";
import {
    StatementListNode,
    BindingElementType,
    BindingRestElementNode,
} from "./statements";

export type ClassElementType = MethodDefinitionNode | StaticMethodDefinitionNode | EmptyClassElementNode;

// ES6 Chapter 14: ECMAScript Language: Functions and Classes

// ES6 Section 14.1: Function Definitions

export class FormalParameterListNode extends ASTNode {
    _nominal_type_FormalParameterListNode: any;
    public readonly elements: (BindingElementType | BindingRestElementNode)[];
    public constructor(range: Range, elements: (BindingElementType | BindingRestElementNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class FunctionDeclarationNode extends DeclarationNode {
    _nominal_type_FunctionDeclarationNode: any;
    public readonly ident: BindingIdentifierNode; // may be null
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode,
        params: FormalParameterListNode,
        body: StatementListNode
    ) {
        super(range,"FunctionDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }
}

export class FunctionExpressionNode extends ExpressionNode {
    _nominal_type_FunctionExpressionNode: any;
    public readonly ident: BindingIdentifierNode; // may be null
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode,
        params: FormalParameterListNode,
        body: StatementListNode
    ) {
        super(range,"FunctionExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }
}

export abstract class FormalParametersNode extends ASTNode {
    _nominal_type_FormalParametersNode: any;
}

export class FormalParameters1Node extends FormalParametersNode {
    _nominal_type_FormalParameters1Node: any;
    public constructor(range: Range) {
        super(range,"FormalParameters1");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

export class FormalParameters2Node extends FormalParametersNode {
    _nominal_type_FormalParameters2Node: any;
    public readonly rest: BindingRestElementNode;
    public constructor(range: Range, rest: BindingRestElementNode) {
        super(range,"FormalParameters2");
        this.rest = rest;
    }
    public get children(): (ASTNode | null)[] {
        return [this.rest];
    }
}

export class FormalParameters3Node extends FormalParametersNode {
    _nominal_type_FormalParameters3Node: any;
    public readonly elements: FormalParameterListNode;
    public constructor(range: Range, elements: FormalParameterListNode) {
        super(range,"FormalParameters3");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return [this.elements];
    }
}

export class FormalParameters4Node extends FormalParametersNode {
    _nominal_type_FormalParameters4Node: any;
    public readonly elements: FormalParameterListNode;
    public readonly rest: BindingRestElementNode;
    public constructor(range: Range, elements: FormalParameterListNode, rest: BindingRestElementNode) {
        super(range,"FormalParameters4");
        this.elements = elements;
        this.rest = rest;
    }
    public get children(): (ASTNode | null)[] {
        return [this.elements,this.rest];
    }
}

// ES6 Section 14.2: Arrow Function Definitions

export class ArrowFunctionNode extends ExpressionNode {
    _nominal_type_ArrowFunctionNode: any;
    public readonly params: BindingIdentifierNode | FormalParameterListNode;
    public readonly body: ExpressionNode | StatementListNode;
    public constructor(
        range: Range,
        params: BindingIdentifierNode | FormalParameterListNode,
        body: ExpressionNode | StatementListNode
    ) {
        super(range,"ArrowFunction");
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.params,this.body];
    }
}

// ES6 Section 14.3: Method Definitions

export abstract class MethodDefinitionNode extends ASTNode {
    _nominal_type_MethodDefinitionNode: any;
}

export class MethodNode extends MethodDefinitionNode {
    _nominal_type_MethodNode: any;
    public readonly name: PropertyNameType;
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        name: PropertyNameType,
        params: FormalParameterListNode,
        body: StatementListNode
    ) {
        super(range,"Method");
        this.name = name;
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.name,this.params,this.body];
    }
}

export class GetterNode extends MethodDefinitionNode {
    _nominal_type_GetterNode: any;
    public readonly name: PropertyNameType;
    public readonly body: StatementListNode;
    public constructor(range: Range, name: PropertyNameType, body: StatementListNode) {
        super(range,"Getter");
        this.name = name;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.name,this.body];
    }
}

export class SetterNode extends MethodDefinitionNode {
    _nominal_type_SetterNode: any;
    public readonly name: PropertyNameType;
    public readonly param: BindingElementType;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        name: PropertyNameType,
        param: BindingElementType,
        body: StatementListNode
    ) {
        super(range,"Setter");
        this.name = name;
        this.param = param;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.name,this.param,this.body];
    }
}

// ES6 Section 14.4: Generator Function Definitions

export class GeneratorMethodNode extends MethodDefinitionNode {
    _nominal_type_GeneratorMethodNode: any;
    public readonly name: PropertyNameType;
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        name: PropertyNameType,
        params: FormalParameterListNode,
        body: StatementListNode
    ) {
        super(range,"GeneratorMethod");
        this.name = name;
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.name,this.params,this.body];
    }
}

export class GeneratorDeclarationNode extends DeclarationNode {
    _nominal_type_GeneratorDeclarationNode: any;
    public readonly ident: BindingIdentifierNode;
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode,
        params: FormalParameterListNode,
        body: StatementListNode
    ) {
        super(range,"GeneratorDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }
}

export class DefaultGeneratorDeclarationNode extends DeclarationNode {
    _nominal_type_DefaultGeneratorDeclarationNode: any;
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(range: Range, params: FormalParameterListNode, body: StatementListNode) {
        super(range,"DefaultGeneratorDeclaration");
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.params,this.body];
    }
}

export class GeneratorExpressionNode extends ExpressionNode {
    _nominal_type_GeneratorExpressionNode: any;
    public readonly ident: BindingIdentifierNode;
    public readonly params: FormalParameterListNode;
    public readonly body: StatementListNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode,
        params: FormalParameterListNode,
        body: StatementListNode
    ) {
        super(range,"GeneratorExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }
}

export class YieldExprNode extends ExpressionNode {
    _nominal_type_YieldExprNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"YieldExpr");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class YieldStarNode extends ExpressionNode {
    _nominal_type_YieldStarNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"YieldStar");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class YieldNothingNode extends ExpressionNode {
    _nominal_type_YieldNothingNode: any;
    public constructor(range: Range) {
        super(range,"YieldNothing");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

// ES6 Section 14.5: Class Definitions

export class ClassElementListNode extends ASTNode {
    _nominal_type_ClassElementListNode: any;
    public readonly elements: ClassElementType[];
    public constructor(range: Range, elements: ClassElementType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ClassDeclarationNode extends DeclarationNode {
    _nominal_type_ClassDeclarationNode: any;
    public readonly ident: BindingIdentifierNode;
    public readonly tail: ClassTailNode;
    public constructor(range: Range, ident: BindingIdentifierNode, tail: ClassTailNode) {
        super(range,"ClassDeclaration");
        this.ident = ident;
        this.tail = tail;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.tail];
    }
}

export class ClassExpressionNode extends ExpressionNode {
    _nominal_type_ClassExpressionNode: any;
    public readonly ident: BindingIdentifierNode;
    public readonly tail: ClassTailNode;
    public constructor(range: Range, ident: BindingIdentifierNode, tail: ClassTailNode) {
        super(range,"ClassExpression");
        this.ident = ident;
        this.tail = tail;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.tail];
    }
}

export class ClassTailNode extends ASTNode {
    _nominal_type_ClassTailNode: any;
    public readonly heritage: ExtendsNode;
    public readonly body: ClassElementListNode;
    public constructor(range: Range, heritage: ExtendsNode, body: ClassElementListNode) {
        super(range,"ClassTail");
        this.heritage = heritage;
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.heritage,this.body];
    }
}

export class ExtendsNode extends ASTNode {
    _nominal_type_ExtendsNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Extends");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class StaticMethodDefinitionNode extends ASTNode {
    _nominal_type_StaticMethodDefinitionNode: any;
    public readonly method: MethodDefinitionNode;
    public constructor(range: Range, method: MethodDefinitionNode) {
        super(range,"StaticMethodDefinition");
        this.method = method;
    }
    public get children(): (ASTNode | null)[] {
        return [this.method];
    }
}

export class EmptyClassElementNode extends ASTNode {
    _nominal_type_EmptyClassElementNode: any;
    public constructor(range: Range) {
        super(range,"EmptyClassElement");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

// ES6 Section 14.6: Tail Position Calls
