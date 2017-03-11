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
    Range,
    ASTNode,
    ExpressionNode,
    DeclarationNode,
    HoistableDeclarationNode,
    BindingIdentifierNode,
    check,
    CannotConvertError,
} from "../parser/ast";
import {
    ExpressionNode_fromGeneric,
    PropertyNameType,
} from "./expressions";
import {
    StatementListNode,
    BindingElementType,
    BindingRestElementNode,
} from "./statements";
import {
    Empty,
    Completion,
    Reference,
    JSValue,
} from "../runtime/datatypes";
import {
    ExecutionContext,
} from "../runtime/08-03-context";

export type FormalParameterListItemType = BindingElementType | BindingRestElementNode;
export const FormalParameterListItemType = {
    fromGeneric(node: ASTNode | null): FormalParameterListItemType {
        try { return BindingElementType.fromGeneric(node); } catch (e) {}
        try { return BindingRestElementNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("FormalParameterListItemType",node);
    }
};

export abstract class ClassElementNode extends ASTNode {
    public _type_ClassElementNode: any;

    public static fromGeneric(node: ASTNode | null): ClassElementNode {
        if (node === null)
            throw new CannotConvertError("ClassElementNode",node);
        switch (node.kind) {
            case "Method":
            case "Getter":
            case "Setter":
            case "GeneratorMethod":
                return MethodDefinitionNode.fromGeneric(node);
            case "StaticMethodDefinition":
                return StaticMethodDefinitionNode.fromGeneric(node);
            case "EmptyClassElement":
                return EmptyClassElementNode.fromGeneric(node);
            default:
                throw new CannotConvertError("ClassElementNode",node);
        }
    }
}

// ES6 Chapter 14: ECMAScript Language: Functions and Classes

// ES6 Section 14.1: Function Definitions

export class FormalParameterListNode extends ASTNode {
    public _type_FormalParameterListNode: any;
    public readonly elements: FormalParameterListItemType[];

    public constructor(range: Range, elements: FormalParameterListItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): FormalParameterListNode {
        const list = check.list(node);
        const elements: FormalParameterListItemType[] = [];
        for (const listElement of list.elements)
            elements.push(FormalParameterListItemType.fromGeneric(listElement));
        return new FormalParameterListNode(list.range,elements);
    }
}

export class FunctionDeclarationNode extends HoistableDeclarationNode {
    public _type_FunctionDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
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

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("FunctionDeclarationNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): FunctionDeclarationNode {
        node = check.node(node,"FunctionDeclaration",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new FunctionDeclarationNode(node.range,ident,params,body);
    }
}

export class FunctionExpressionNode extends ExpressionNode {
    public _type_FunctionExpressionNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
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

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("FunctionExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): FunctionExpressionNode {
        node = check.node(node,"FunctionExpression",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new FunctionExpressionNode(node.range,ident,params,body);
    }
}

export abstract class FormalParametersNode extends ASTNode {
    public _type_FormalParametersNode: any;

    public static fromGeneric(node: ASTNode | null): FormalParametersNode {
        if (node === null)
            throw new CannotConvertError("FormalParametersNode",node);
        switch (node.kind) {
            case "FormalParameters1":
                return FormalParameters1Node.fromGeneric(node);
            case "FormalParameters2":
                return FormalParameters2Node.fromGeneric(node);
            case "FormalParameters3":
                return FormalParameters3Node.fromGeneric(node);
            case "FormalParameters4":
                return FormalParameters4Node.fromGeneric(node);
            default:
                throw new CannotConvertError("FormalParametersNode",node);
        }
    }
}

export class FormalParameters1Node extends FormalParametersNode {
    public _type_FormalParameters1Node: any;

    public constructor(range: Range) {
        super(range,"FormalParameters1");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters1Node {
        node = check.node(node,"FormalParameters1",0);
        return new FormalParameters1Node(node.range);
    }
}

export class FormalParameters2Node extends FormalParametersNode {
    public _type_FormalParameters2Node: any;
    public readonly rest: BindingRestElementNode;

    public constructor(range: Range, rest: BindingRestElementNode) {
        super(range,"FormalParameters2");
        this.rest = rest;
    }

    public get children(): (ASTNode | null)[] {
        return [this.rest];
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters2Node {
        node = check.node(node,"FormalParameters2",1);
        const rest = BindingRestElementNode.fromGeneric(node.children[0]);
        return new FormalParameters2Node(node.range,rest);
    }
}

export class FormalParameters3Node extends FormalParametersNode {
    public _type_FormalParameters3Node: any;
    public readonly elements: FormalParameterListNode;

    public constructor(range: Range, elements: FormalParameterListNode) {
        super(range,"FormalParameters3");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return [this.elements];
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters3Node {
        node = check.node(node,"FormalParameters3",1);
        const elements = FormalParameterListNode.fromGeneric(node.children[0]);
        return new FormalParameters3Node(node.range,elements);
    }
}

export class FormalParameters4Node extends FormalParametersNode {
    public _type_FormalParameters4Node: any;
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

    public static fromGeneric(node: ASTNode | null): FormalParameters4Node {
        node = check.node(node,"FormalParameters4",2);
        const elements = FormalParameterListNode.fromGeneric(node.children[0]);
        const rest = BindingRestElementNode.fromGeneric(node.children[1]);
        return new FormalParameters4Node(node.range,elements,rest);
    }
}

// ES6 Section 14.2: Arrow Function Definitions

type ArrowFunctionParamsType = BindingIdentifierNode | FormalParametersNode;
const ArrowFunctionParamsType = {
    fromGeneric(node: ASTNode | null): ArrowFunctionParamsType {
        try { return BindingIdentifierNode.fromGeneric(node); } catch (e) {}
        try { return FormalParametersNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArrowFunctionParamsType",node);
    }
};

type ArrowFunctionBodyType = ExpressionNode | StatementListNode;
const ArrowFunctionBodyType = {
    fromGeneric(node: ASTNode | null): ArrowFunctionBodyType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return StatementListNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArrowFunctionBodyType",node);
    }
};

export class ArrowFunctionNode extends ExpressionNode {
    public _type_ArrowFunctionNode: any;
    public readonly params: ArrowFunctionParamsType;
    public readonly body: ArrowFunctionBodyType;

    public constructor(
        range: Range,
        params: ArrowFunctionParamsType,
        body: ArrowFunctionBodyType
    ) {
        super(range,"ArrowFunction");
        this.params = params;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.params,this.body];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ArrowFunctionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ArrowFunctionNode {
        node = check.node(node,"ArrowFunction",2);
        const params = ArrowFunctionParamsType.fromGeneric(node.children[0]);
        const body = ArrowFunctionBodyType.fromGeneric(node.children[1]);
        return new ArrowFunctionNode(node.range,params,body);
    }
}

// ES6 Section 14.3: Method Definitions

export abstract class MethodDefinitionNode extends ClassElementNode {
    public _type_MethodDefinitionNode: any;

    public static fromGeneric(node: ASTNode | null): MethodDefinitionNode {
        if (node === null)
            throw new CannotConvertError("MethodDefinitionNode",node);
        switch (node.kind) {
            case "Method":
                return MethodNode.fromGeneric(node);
            case "Getter":
                return GetterNode.fromGeneric(node);
            case "Setter":
                return SetterNode.fromGeneric(node);
            case "GeneratorMethod":
                return GeneratorMethodNode.fromGeneric(node);
            default:
                throw new CannotConvertError("MethodDefinitionNode",node);
        }
    }
}

export class MethodNode extends MethodDefinitionNode {
    public _type_MethodNode: any;
    public readonly name: PropertyNameType;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        name: PropertyNameType,
        params: FormalParametersNode,
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

    public static fromGeneric(node: ASTNode | null): MethodNode {
        node = check.node(node,"Method",3);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new MethodNode(node.range,name,params,body);
    }
}

export class GetterNode extends MethodDefinitionNode {
    public _type_GetterNode: any;
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

    public static fromGeneric(node: ASTNode | null): GetterNode {
        node = check.node(node,"Getter",2);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const body = StatementListNode.fromGeneric(node.children[1]);
        return new GetterNode(node.range,name,body);
    }
}

export class SetterNode extends MethodDefinitionNode {
    public _type_SetterNode: any;
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

    public static fromGeneric(node: ASTNode | null): SetterNode {
        node = check.node(node,"Setter",3);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const param = BindingElementType.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new SetterNode(node.range,name,param,body);
    }
}

// ES6 Section 14.4: Generator Function Definitions

export class GeneratorMethodNode extends MethodDefinitionNode {
    public _type_GeneratorMethodNode: any;
    public readonly name: PropertyNameType;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        name: PropertyNameType,
        params: FormalParametersNode,
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

    public static fromGeneric(node: ASTNode | null): GeneratorMethodNode {
        node = check.node(node,"GeneratorMethod",3);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new GeneratorMethodNode(node.range,name,params,body);
    }
}

export class GeneratorDeclarationNode extends HoistableDeclarationNode {
    public _type_GeneratorDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
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

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("GeneratorDeclarationNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GeneratorDeclarationNode {
        node = check.node(node,"GeneratorDeclaration",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new GeneratorDeclarationNode(node.range,ident,params,body);
    }
}

export class GeneratorExpressionNode extends ExpressionNode {
    public _type_GeneratorExpressionNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
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

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("GeneratorExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GeneratorExpressionNode {
        node = check.node(node,"GeneratorExpression",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new GeneratorExpressionNode(node.range,ident,params,body);
    }
}

export class YieldExprNode extends ExpressionNode {
    public _type_YieldExprNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"YieldExpr");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("YieldExprNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): YieldExprNode {
        node = check.node(node,"YieldExpr",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new YieldExprNode(node.range,expr);
    }
}

export class YieldStarNode extends ExpressionNode {
    public _type_YieldStarNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"YieldStar");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("YieldStarNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): YieldStarNode {
        node = check.node(node,"YieldStar",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new YieldStarNode(node.range,expr);
    }
}

export class YieldNothingNode extends ExpressionNode {
    public _type_YieldNothingNode: any;

    public constructor(range: Range) {
        super(range,"YieldNothing");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("YieldNothingNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): YieldNothingNode {
        node = check.node(node,"YieldNothing",0);
        return new YieldNothingNode(node.range);
    }
}

// ES6 Section 14.5: Class Definitions

export class ClassElementListNode extends ASTNode {
    public _type_ClassElementListNode: any;
    public readonly elements: ClassElementNode[];

    public constructor(range: Range, elements: ClassElementNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): ClassElementListNode {
        const list = check.list(node);
        const elements: ClassElementNode[] = [];
        for (const listElement of list.elements)
            elements.push(ClassElementNode.fromGeneric(listElement));
        return new ClassElementListNode(list.range,elements);
    }
}

export class ClassDeclarationNode extends DeclarationNode {
    public _type_ClassDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly tail: ClassTailNode;

    public constructor(range: Range, ident: BindingIdentifierNode | null, tail: ClassTailNode) {
        super(range,"ClassDeclaration");
        this.ident = ident;
        this.tail = tail;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.tail];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ClassDeclarationNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ClassDeclarationNode {
        node = check.node(node,"ClassDeclaration",2);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const tail = ClassTailNode.fromGeneric(node.children[1]);
        return new ClassDeclarationNode(node.range,ident,tail);
    }
}

export class ClassExpressionNode extends ExpressionNode {
    public _type_ClassExpressionNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly tail: ClassTailNode;

    public constructor(range: Range, ident: BindingIdentifierNode | null, tail: ClassTailNode) {
        super(range,"ClassExpression");
        this.ident = ident;
        this.tail = tail;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.tail];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ClassExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ClassExpressionNode {
        node = check.node(node,"ClassExpression",2);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const tail = ClassTailNode.fromGeneric(node.children[1]);
        return new ClassExpressionNode(node.range,ident,tail);
    }
}

export class ClassTailNode extends ASTNode {
    public _type_ClassTailNode: any;
    public readonly heritage: ExtendsNode | null;
    public readonly body: ClassElementListNode;

    public constructor(range: Range, heritage: ExtendsNode | null, body: ClassElementListNode) {
        super(range,"ClassTail");
        this.heritage = heritage;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.heritage,this.body];
    }

    public static fromGeneric(node: ASTNode | null): ClassTailNode {
        node = check.node(node,"ClassTail",2);
        const heritage = (node.children[0] === null) ? null : ExtendsNode.fromGeneric(node.children[0]);
        const body = ClassElementListNode.fromGeneric(node.children[1]);
        return new ClassTailNode(node.range,heritage,body);
    }
}

export class ExtendsNode extends ASTNode {
    public _type_ExtendsNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Extends");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public static fromGeneric(node: ASTNode | null): ExtendsNode {
        node = check.node(node,"Extends",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new ExtendsNode(node.range,expr);
    }
}

export class StaticMethodDefinitionNode extends ClassElementNode {
    public _type_StaticMethodDefinitionNode: any;
    public readonly method: MethodDefinitionNode;

    public constructor(range: Range, method: MethodDefinitionNode) {
        super(range,"StaticMethodDefinition");
        this.method = method;
    }

    public get children(): (ASTNode | null)[] {
        return [this.method];
    }

    public static fromGeneric(node: ASTNode | null): StaticMethodDefinitionNode {
        node = check.node(node,"StaticMethodDefinition",1);
        const method = MethodDefinitionNode.fromGeneric(node.children[0]);
        return new StaticMethodDefinitionNode(node.range,method);
    }
}

export class EmptyClassElementNode extends ClassElementNode {
    public _type_EmptyClassElementNode: any;

    public constructor(range: Range) {
        super(range,"EmptyClassElement");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public static fromGeneric(node: ASTNode | null): EmptyClassElementNode {
        node = check.node(node,"EmptyClassElement",0);
        return new EmptyClassElementNode(node.range);
    }
}

// ES6 Section 14.6: Tail Position Calls
