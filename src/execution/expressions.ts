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
    ExpressionNode,
    IdentifierNode,
    GenericStringNode,
    GenericNumberNode,
    check,
    CannotConvertError,
} from "../parser/ast";
import {
    MethodDefinitionNode,
    FunctionExpressionNode,
    ArrowFunctionNode,
    GeneratorExpressionNode,
    YieldExprNode,
    YieldStarNode,
    YieldNothingNode,
    ClassExpressionNode,
} from "./functions";

export function ExpressionNode_fromGeneric(node: ASTNode | null): ExpressionNode {
    if (node === null)
        throw new CannotConvertError("ExpressionNode",node);
    switch (node.kind) {
        case "Multiply":
            return MultiplyNode.fromGeneric(node);
        case "Divide":
            return DivideNode.fromGeneric(node);
        case "Modulo":
            return ModuloNode.fromGeneric(node);
        case "Add":
            return AddNode.fromGeneric(node);
        case "Subtract":
            return SubtractNode.fromGeneric(node);
        case "LeftShift":
            return LeftShiftNode.fromGeneric(node);
        case "SignedRightShift":
            return SignedRightShiftNode.fromGeneric(node);
        case "UnsignedRightShift":
            return UnsignedRightShiftNode.fromGeneric(node);
        case "LessThan":
            return LessThanNode.fromGeneric(node);
        case "GreaterThan":
            return GreaterThanNode.fromGeneric(node);
        case "LessEqual":
            return LessEqualNode.fromGeneric(node);
        case "GreaterEqual":
            return GreaterEqualNode.fromGeneric(node);
        case "InstanceOf":
            return InstanceOfNode.fromGeneric(node);
        case "In":
            return InNode.fromGeneric(node);
        case "AbstractEquals":
            return AbstractEqualsNode.fromGeneric(node);
        case "AbstractNotEquals":
            return AbstractNotEqualsNode.fromGeneric(node);
        case "StrictEquals":
            return StrictEqualsNode.fromGeneric(node);
        case "StrictNotEquals":
            return StrictNotEqualsNode.fromGeneric(node);
        case "BitwiseAND":
            return BitwiseANDNode.fromGeneric(node);
        case "BitwiseXOR":
            return BitwiseXORNode.fromGeneric(node);
        case "BitwiseOR":
            return BitwiseORNode.fromGeneric(node);
        case "LogicalAND":
            return LogicalANDNode.fromGeneric(node);
        case "LogicalOR":
            return LogicalORNode.fromGeneric(node);
        case "Assign":
            return AssignNode.fromGeneric(node);
        case "AssignMultiply":
            return AssignMultiplyNode.fromGeneric(node);
        case "AssignDivide":
            return AssignDivideNode.fromGeneric(node);
        case "AssignModulo":
            return AssignModuloNode.fromGeneric(node);
        case "AssignAdd":
            return AssignAddNode.fromGeneric(node);
        case "AssignSubtract":
            return AssignSubtractNode.fromGeneric(node);
        case "AssignLeftShift":
            return AssignLeftShiftNode.fromGeneric(node);
        case "AssignSignedRightShift":
            return AssignSignedRightShiftNode.fromGeneric(node);
        case "AssignUnsignedRightShift":
            return AssignUnsignedRightShiftNode.fromGeneric(node);
        case "AssignBitwiseAND":
            return AssignBitwiseANDNode.fromGeneric(node);
        case "AssignBitwiseXOR":
            return AssignBitwiseXORNode.fromGeneric(node);
        case "AssignBitwiseOR":
            return AssignBitwiseORNode.fromGeneric(node);
        case "Comma":
            return CommaNode.fromGeneric(node);
        case "IdentifierReference":
            return IdentifierReferenceNode.fromGeneric(node);
        case "This":
            return ThisNode.fromGeneric(node);
        case "NullLiteral":
            return NullLiteralNode.fromGeneric(node);
        case "True":
            return TrueNode.fromGeneric(node);
        case "False":
            return FalseNode.fromGeneric(node);
        case "NumericLiteral":
            return NumericLiteralNode.fromGeneric(node);
        case "StringLiteral":
            return StringLiteralNode.fromGeneric(node);
        case "ArrayLiteral":
            return ArrayLiteralNode.fromGeneric(node);
        case "ObjectLiteral":
            return ObjectLiteralNode.fromGeneric(node);
        case "MemberAccessExpr":
            return MemberAccessExprNode.fromGeneric(node);
        case "MemberAccessIdent":
            return MemberAccessIdentNode.fromGeneric(node);
        case "SuperPropertyExpr":
            return SuperPropertyExprNode.fromGeneric(node);
        case "SuperPropertyIdent":
            return SuperPropertyIdentNode.fromGeneric(node);
        case "NewTarget":
            return NewTargetNode.fromGeneric(node);
        case "NewExpression":
            return NewExpressionNode.fromGeneric(node);
        case "Call":
            return CallNode.fromGeneric(node);
        case "SuperCall":
            return SuperCallNode.fromGeneric(node);
        case "PostIncrement":
            return PostIncrementNode.fromGeneric(node);
        case "PostDecrement":
            return PostDecrementNode.fromGeneric(node);
        case "Delete":
            return DeleteNode.fromGeneric(node);
        case "Void":
            return VoidNode.fromGeneric(node);
        case "TypeOf":
            return TypeOfNode.fromGeneric(node);
        case "PreIncrement":
            return PreIncrementNode.fromGeneric(node);
        case "PreDecrement":
            return PreDecrementNode.fromGeneric(node);
        case "UnaryPlus":
            return UnaryPlusNode.fromGeneric(node);
        case "UnaryMinus":
            return UnaryMinusNode.fromGeneric(node);
        case "UnaryBitwiseNot":
            return UnaryBitwiseNotNode.fromGeneric(node);
        case "UnaryLogicalNot":
            return UnaryLogicalNotNode.fromGeneric(node);
        case "Conditional":
            return ConditionalNode.fromGeneric(node);
        case "FunctionExpression":
            return FunctionExpressionNode.fromGeneric(node);
        case "ArrowFunction":
            return ArrowFunctionNode.fromGeneric(node);
        case "GeneratorExpression":
            return GeneratorExpressionNode.fromGeneric(node);
        case "YieldExpr":
            return YieldExprNode.fromGeneric(node);
        case "YieldStar":
            return YieldStarNode.fromGeneric(node);
        case "YieldNothing":
            return YieldNothingNode.fromGeneric(node);
        case "ClassExpression":
            return ClassExpressionNode.fromGeneric(node);
        default:
            throw new CannotConvertError("ExpressionNode",node);
    }
}

export type LiteralPropertyNameType = IdentifierNode | StringLiteralNode | NumericLiteralNode;
export const LiteralPropertyNameType = {
    fromGeneric(node: ASTNode | null): LiteralPropertyNameType {
        if (node === null)
            throw new CannotConvertError("LiteralPropertyNameType",node);
        switch (node.kind) {
            case "Identifier":
                return IdentifierNode.fromGeneric(node);
            case "StringLiteral":
                return StringLiteralNode.fromGeneric(node);
            case "NumericLiteral":
                return NumericLiteralNode.fromGeneric(node);
            default:
                throw new CannotConvertError("LiteralPropertyNameType",node);
        }
    }
};

export type PropertyNameType = ComputedPropertyNameNode | LiteralPropertyNameType;
export const PropertyNameType = {
    fromGeneric(node: ASTNode | null): PropertyNameType {
        if (node === null)
            throw new CannotConvertError("PropertyNameType",node);
        switch (node.kind) {
            case "ComputedPropertyName":
                return ComputedPropertyNameNode.fromGeneric(node);
            case "Identifier":
            case "StringLiteral":
            case "NumericLiteral":
                return LiteralPropertyNameType.fromGeneric(node);
            default:
                throw new CannotConvertError("PropertyNameType",node);
        }
    }
};

export type PropertyDefinitionType = ColonPropertyDefinitionNode | CoverInitializedNameNode |
                                     MethodDefinitionNode | IdentifierReferenceNode;
export const PropertyDefinitionType = {
    fromGeneric(node: ASTNode | null): PropertyDefinitionType {
        if (node === null)
            throw new CannotConvertError("PropertyDefinitionType",node);
        switch (node.kind) {
            case "ColonPropertyDefinition":
                return ColonPropertyDefinitionNode.fromGeneric(node);
            case "CoverInitializedName":
                return CoverInitializedNameNode.fromGeneric(node);
            case "IdentifierReference":
                return IdentifierReferenceNode.fromGeneric(node);
            default:
                return MethodDefinitionNode.fromGeneric(node);
        }
    }
};

export type ArgumentType = ExpressionNode | SpreadElementNode;
export const ArgumentType = {
    fromGeneric(node: ASTNode | null): ArgumentType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return SpreadElementNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArgumentType",node);
    }
};

export type ArrayLiteralItemType = ElisionNode | SpreadElementNode | ExpressionNode;
export const ArrayLiteralItemType = {
    fromGeneric(node: ASTNode | null): ArrayLiteralItemType {
        try { return ElisionNode.fromGeneric(node); } catch (e) {}
        try { return SpreadElementNode.fromGeneric(node); } catch (e) {}
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArrayLiteralItemType",node);
    }
};

// ES6 Chapter 12: ECMAScript Language: Expressions

export abstract class BinaryNode extends ExpressionNode {
    public _type_BinaryNode: any;
    public readonly left: ExpressionNode;
    public readonly right: ExpressionNode;
    public readonly _children: ASTNode[];
    public constructor(range: Range, kind: string, left: ExpressionNode, right: ExpressionNode) {
        super(range,kind);
        this.left = left;
        this.right = right;
        this._children = [left,right];
    }
    public get children(): (ASTNode | null)[] {
        return this._children;
    }
}

// ES6 Section 12.1: Identifiers

export class IdentifierReferenceNode extends ExpressionNode {
    public _type_IdentifierReferenceNode: any;
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"IdentifierReference");
        this.value = value;
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public get label(): string {
        return "IdentifierReference("+JSON.stringify(this.value)+")";
        // return this.value;
    }
    public static fromGeneric(node: ASTNode | null): IdentifierReferenceNode {
        if ((node === null) || (node.kind !== "IdentifierReference") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("IdentifierReference",node);
        return new IdentifierReferenceNode(node.range,node.value);
    }
}

// ES6 Section 12.2: Primary Expression

// ES6 Section 12.2.1: Semantics

// ES6 Section 12.2.2: The this Keyword

export class ThisNode extends ExpressionNode {
    public _type_ThisNode: any;
    public constructor(range: Range) {
        super(range,"This");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public static fromGeneric(node: ASTNode | null): ThisNode {
        node = check.node(node,"This",0);
        return new ThisNode(node.range);
    }
}

// ES6 Section 12.2.3: Identifier Reference

// ES6 Section 12.2.4: Literals

export class NullLiteralNode extends ExpressionNode {
    public _type_NullLiteralNode: any;
    public constructor(range: Range) {
        super(range,"NullLiteral");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public static fromGeneric(node: ASTNode | null): NullLiteralNode {
        node = check.node(node,"NullLiteral",0);
        return new NullLiteralNode(node.range);
    }
}

export class TrueNode extends ExpressionNode {
    public _type_TrueNode: any;
    public constructor(range: Range) {
        super(range,"True");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public static fromGeneric(node: ASTNode | null): TrueNode {
        node = check.node(node,"True",0);
        return new TrueNode(node.range);
    }
}

export class FalseNode extends ExpressionNode {
    public _type_FalseNode: any;
    public constructor(range: Range) {
        super(range,"False");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public static fromGeneric(node: ASTNode | null): FalseNode {
        node = check.node(node,"False",0);
        return new FalseNode(node.range);
    }
}

export class NumericLiteralNode extends ExpressionNode {
    public _type_NumericLiteralNode: any;
    public readonly value: number;
    public constructor(range: Range, value: number) {
        super(range,"NumericLiteral");
        this.value = value;
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public get label(): string {
        // return "NumericLiteral("+this.value+")";
        return ""+this.value;
    }
    public static fromGeneric(node: ASTNode | null): NumericLiteralNode {
        if ((node === null) || (node.kind !== "NumericLiteral") || !(node instanceof GenericNumberNode))
            throw new CannotConvertError("NumericLiteral",node);
        return new NumericLiteralNode(node.range,node.value);
    }
}

export class StringLiteralNode extends ExpressionNode {
    public _type_StringLiteralNode: any;
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"StringLiteral");
        this.value = value;
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public get label(): string {
        // return "StringLiteral("+JSON.stringify(this.value)+")";
        return JSON.stringify(this.value);
    }
    public static fromGeneric(node: ASTNode | null): StringLiteralNode {
        if ((node === null) || (node.kind !== "StringLiteral") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("StringLiteral",node);
        return new StringLiteralNode(node.range,node.value);
    }
}

// ES6 Section 12.2.5: Array Initializer

export class ElementListNode extends ASTNode {
    public _type_ElementListNode: any;
    public readonly elements: ArrayLiteralItemType[];
    public constructor(range: Range, elements: ArrayLiteralItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
    public static fromGeneric(node: ASTNode | null): ElementListNode {
        const list = check.list(node);
        const elements: ArrayLiteralItemType[] = [];
        for (const listElement of list.elements)
            elements.push(ArrayLiteralItemType.fromGeneric(listElement));
        return new ElementListNode(list.range,elements);
    }
}

export class ArrayLiteralNode extends ExpressionNode {
    public _type_ArrayLiteralNode: any;
    private readonly elements: ElementListNode;
    public constructor(range: Range, elements: ElementListNode) {
        super(range,"ArrayLiteral");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return [this.elements];
    }
    public static fromGeneric(node: ASTNode | null): ArrayLiteralNode {
        node = check.node(node,"ArrayLiteral",1);
        const elements = ElementListNode.fromGeneric(node.children[0]);
        return new ArrayLiteralNode(node.range,elements);
    }
}

export class ElisionNode extends ASTNode {
    public _type_ElisionNode: any;
    public constructor(range: Range) {
        super(range,"Elision");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public static fromGeneric(node: ASTNode | null): ElisionNode {
        node = check.node(node,"Elision",0);
        return new ElisionNode(node.range);
    }
}

export class SpreadElementNode extends ASTNode {
    public _type_SpreadElementNode: any;
    public readonly child: ExpressionNode;
    public constructor(range: Range, child: ExpressionNode) {
        super(range,"SpreadElement");
        this.child = child;
    }
    public get children(): (ASTNode | null)[] {
        return [this.child];
    }
    public static fromGeneric(node: ASTNode | null): SpreadElementNode {
        node = check.node(node,"SpreadElement",1);
        const child = ExpressionNode_fromGeneric(node.children[0]);
        return new SpreadElementNode(node.range,child);
    }
}

// ES6 Section 12.2.6: Object Initializer

export class PropertyDefinitionListNode extends ASTNode {
    public _type_PropertyDefinitionListNode: any;
    public readonly elements: PropertyDefinitionType[];
    public constructor(range: Range, elements: PropertyDefinitionType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
    public static fromGeneric(node: ASTNode | null): PropertyDefinitionListNode {
        const list = check.list(node);
        const elements: PropertyDefinitionType[] = [];
        for (const listElement of list.elements)
            elements.push(PropertyDefinitionType.fromGeneric(listElement));
        return new PropertyDefinitionListNode(list.range,elements);
    }
}

export class ObjectLiteralNode extends ExpressionNode {
    public _type_ObjectLiteralNode: any;
    public readonly properties: PropertyDefinitionListNode;
    public constructor(range: Range, properties: PropertyDefinitionListNode) {
        super(range,"ObjectLiteral");
        this.properties = properties;
    }
    public get children(): (ASTNode | null)[] {
        return [this.properties];
    }
    public static fromGeneric(node: ASTNode | null): ObjectLiteralNode {
        node = check.node(node,"ObjectLiteral",1);
        const properties = PropertyDefinitionListNode.fromGeneric(node.children[0]);
        return new ObjectLiteralNode(node.range,properties);
    }
}

export class ColonPropertyDefinitionNode extends ASTNode {
    public _type_ColonPropertyDefinitionNode: any;
    public readonly name: PropertyNameType;
    public readonly init: ExpressionNode;
    public constructor(range: Range, name: PropertyNameType, init: ExpressionNode) {
        super(range,"ColonPropertyDefinition");
        this.name = name;
        this.init = init;
    }
    public get children(): (ASTNode | null)[] {
        return [this.name,this.init];
    }
    public static fromGeneric(node: ASTNode | null): ColonPropertyDefinitionNode {
        node = check.node(node,"ColonPropertyDefinition",2);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const init = ExpressionNode_fromGeneric(node.children[1]);
        return new ColonPropertyDefinitionNode(node.range,name,init);
    }
}

export class ComputedPropertyNameNode extends ASTNode {
    public _type_ComputedPropertyNameNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ComputedPropertyName");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): ComputedPropertyNameNode {
        node = check.node(node,"ComputedPropertyName",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new ComputedPropertyNameNode(node.range,expr);
    }
}

export class CoverInitializedNameNode extends ASTNode {
    public _type_CoverInitializedNameNode: any;
    public readonly ident: IdentifierReferenceNode;
    public readonly init: ExpressionNode;
    public constructor(range: Range, ident: IdentifierReferenceNode, init: ExpressionNode) {
        super(range,"CoverInitializedName");
        this.ident = ident;
        this.init = init;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.init];
    }
    public static fromGeneric(node: ASTNode | null): CoverInitializedNameNode {
        node = check.node(node,"CoverInitializedName",2);
        const ident = IdentifierReferenceNode.fromGeneric(node.children[0]);
        const init = ExpressionNode_fromGeneric(node.children[1]);
        return new CoverInitializedNameNode(node.range,ident,init);
    }
}

// ES6 Section 12.2.7: Function Defining Expressions

// ES6 Section 12.2.8: Regular Expression Literals

// ES6 Section 12.2.9: Template Literals

// ES6 Section 12.2.10: The Grouping Operator

// ES6 Section 12.3: Left-Hand-Side Expressions

export class MemberAccessExprNode extends ExpressionNode {
    public _type_MemberAccessExprNode: any;
    public readonly obj: ExpressionNode;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, obj: ExpressionNode, expr: ExpressionNode) {
        super(range,"MemberAccessExpr");
        this.obj = obj;
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.obj,this.expr];
    }
    public static fromGeneric(node: ASTNode | null): MemberAccessExprNode {
        node = check.node(node,"MemberAccessExpr",2);
        const obj = ExpressionNode_fromGeneric(node.children[0]);
        const expr = ExpressionNode_fromGeneric(node.children[1]);
        return new MemberAccessExprNode(node.range,obj,expr);
    }
}

export class MemberAccessIdentNode extends ExpressionNode {
    public _type_MemberAccessIdentNode: any;
    public readonly obj: ExpressionNode;
    public readonly ident: IdentifierNode;
    public constructor(range: Range, obj: ExpressionNode, ident: IdentifierNode) {
        super(range,"MemberAccessIdent");
        this.obj = obj;
        this.ident = ident;
    }
    public get children(): (ASTNode | null)[] {
        return [this.obj,this.ident];
    }
    public static fromGeneric(node: ASTNode | null): MemberAccessIdentNode {
        node = check.node(node,"MemberAccessIdent",2);
        const obj = ExpressionNode_fromGeneric(node.children[0]);
        const ident = IdentifierNode.fromGeneric(node.children[1]);
        return new MemberAccessIdentNode(node.range,obj,ident);
    }
}

export class SuperPropertyExprNode extends ExpressionNode {
    public _type_SuperPropertyExprNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"SuperPropertyExpr");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): SuperPropertyExprNode {
        node = check.node(node,"SuperPropertyExpr",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new SuperPropertyExprNode(node.range,expr);
    }
}

export class SuperPropertyIdentNode extends ExpressionNode {
    public _type_SuperPropertyIdentNode: any;
    public readonly ident: IdentifierNode;
    public constructor(range: Range, ident: IdentifierNode) {
        super(range,"SuperPropertyIdent");
        this.ident = ident;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }
    public static fromGeneric(node: ASTNode | null): SuperPropertyIdentNode {
        node = check.node(node,"SuperPropertyIdent",1);
        const ident = IdentifierNode.fromGeneric(node.children[0]);
        return new SuperPropertyIdentNode(node.range,ident);
    }
}

export class NewTargetNode extends ExpressionNode {
    public _type_NewTargetNode: any;
    public constructor(range: Range) {
        super(range,"NewTarget");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
    public static fromGeneric(node: ASTNode | null): NewTargetNode {
        node = check.node(node,"NewTarget",0);
        return new NewTargetNode(node.range);
    }
}

export class NewExpressionNode extends ExpressionNode {
    public _type_NewExpressionNode: any;
    public readonly expr: ExpressionNode;
    public readonly args: ArgumentsNode | null;
    public constructor(range: Range, expr: ExpressionNode, args: ArgumentsNode | null) {
        super(range,"NewExpression");
        this.expr = expr;
        this.args = args;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr,this.args];
    }
    public static fromGeneric(node: ASTNode | null): NewExpressionNode {
        node = check.node(node,"NewExpression",2);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        const args = (node.children[1] === null) ? null : ArgumentsNode.fromGeneric(node.children[1]);
        return new NewExpressionNode(node.range,expr,args);
    }
}

export class CallNode extends ExpressionNode {
    public _type_CallNode: any;
    public readonly fun: ExpressionNode;
    public readonly args: ArgumentsNode;
    public constructor(range: Range, fun: ExpressionNode, args: ArgumentsNode) {
        super(range,"Call");
        this.fun = fun;
        this.args = args;
    }
    public get children(): (ASTNode | null)[] {
        return [this.fun,this.args];
    }
    public static fromGeneric(node: ASTNode | null): CallNode {
        node = check.node(node,"Call",2);
        const fun = ExpressionNode_fromGeneric(node.children[0]);
        const args = ArgumentsNode.fromGeneric(node.children[1]);
        return new CallNode(node.range,fun,args);
    }
}

export class SuperCallNode extends ExpressionNode {
    public _type_SuperCallNode: any;
    public readonly args: ArgumentsNode;
    public constructor(range: Range, args: ArgumentsNode) {
        super(range,"SuperCall");
        this.args = args;
    }
    public get children(): (ASTNode | null)[] {
        return [this.args];
    }
    public static fromGeneric(node: ASTNode | null): SuperCallNode {
        node = check.node(node,"SuperCall",1);
        const args = ArgumentsNode.fromGeneric(node.children[0]);
        return new SuperCallNode(node.range,args);
    }
}

export class ArgumentListNode extends ASTNode {
    public _type_ArgumentListNode: any;
    public readonly elements: ArgumentType[];
    public constructor(range: Range, elements: ArgumentType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
    public static fromGeneric(node: ASTNode | null): ArgumentListNode {
        const list = check.list(node);
        const elements: ArgumentType[] = [];
        for (const listElement of list.elements)
            elements.push(ArgumentType.fromGeneric(listElement));
        return new ArgumentListNode(list.range,elements);
    }
}

export class ArgumentsNode extends ASTNode {
    public _type_ArgumentsNode: any;
    public readonly items: ArgumentListNode;
    public constructor(range: Range, items: ArgumentListNode) {
        super(range,"Arguments");
        this.items = items;
    }
    public get children(): (ASTNode | null)[] {
        return [this.items];
    }
    public static fromGeneric(node: ASTNode | null): ArgumentsNode {
        node = check.node(node,"Arguments",1);
        const items = ArgumentListNode.fromGeneric(node.children[0]);
        return new ArgumentsNode(node.range,items);
    }
}

// ES6 Section 12.4: Postfix Expressions

export class PostIncrementNode extends ExpressionNode {
    public _type_PostIncrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PostIncrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): PostIncrementNode {
        node = check.node(node,"PostIncrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PostIncrementNode(node.range,expr);
    }
}

export class PostDecrementNode extends ExpressionNode {
    public _type_PostDecrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PostDecrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): PostDecrementNode {
        node = check.node(node,"PostDecrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PostDecrementNode(node.range,expr);
    }
}

// ES6 Section 12.5: Unary Operators

export class DeleteNode extends ExpressionNode {
    public _type_DeleteNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Delete");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): DeleteNode {
        node = check.node(node,"Delete",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new DeleteNode(node.range,expr);
    }
}

export class VoidNode extends ExpressionNode {
    public _type_VoidNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Void");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): VoidNode {
        node = check.node(node,"Void",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new VoidNode(node.range,expr);
    }
}

export class TypeOfNode extends ExpressionNode {
    public _type_TypeOfNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"TypeOf");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): TypeOfNode {
        node = check.node(node,"TypeOf",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new TypeOfNode(node.range,expr);
    }
}

export class PreIncrementNode extends ExpressionNode {
    public _type_PreIncrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PreIncrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): PreIncrementNode {
        node = check.node(node,"PreIncrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PreIncrementNode(node.range,expr);
    }
}

export class PreDecrementNode extends ExpressionNode {
    public _type_PreDecrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PreDecrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): PreDecrementNode {
        node = check.node(node,"PreDecrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PreDecrementNode(node.range,expr);
    }
}

export class UnaryPlusNode extends ExpressionNode {
    public _type_UnaryPlusNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryPlus");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): UnaryPlusNode {
        node = check.node(node,"UnaryPlus",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryPlusNode(node.range,expr);
    }
}

export class UnaryMinusNode extends ExpressionNode {
    public _type_UnaryMinusNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryMinus");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): UnaryMinusNode {
        node = check.node(node,"UnaryMinus",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryMinusNode(node.range,expr);
    }
}

export class UnaryBitwiseNotNode extends ExpressionNode {
    public _type_UnaryBitwiseNotNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryBitwiseNot");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): UnaryBitwiseNotNode {
        node = check.node(node,"UnaryBitwiseNot",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryBitwiseNotNode(node.range,expr);
    }
}

export class UnaryLogicalNotNode extends ExpressionNode {
    public _type_UnaryLogicalNotNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryLogicalNot");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
    public static fromGeneric(node: ASTNode | null): UnaryLogicalNotNode {
        node = check.node(node,"UnaryLogicalNot",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryLogicalNotNode(node.range,expr);
    }
}

// ES6 Section 12.6: Multiplicative Operators

export class MultiplyNode extends BinaryNode {
    public _type_MultiplyNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Multiply",left,right);
    }
    public static fromGeneric(node: ASTNode | null): MultiplyNode {
        node = check.node(node,"Multiply",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new MultiplyNode(node.range,left,right);
    }
}

export class DivideNode extends BinaryNode {
    public _type_DivideNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Divide",left,right);
    }
    public static fromGeneric(node: ASTNode | null): DivideNode {
        node = check.node(node,"Divide",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new DivideNode(node.range,left,right);
    }
}

export class ModuloNode extends BinaryNode {
    public _type_ModuloNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Modulo",left,right);
    }
    public static fromGeneric(node: ASTNode | null): ModuloNode {
        node = check.node(node,"Modulo",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new ModuloNode(node.range,left,right);
    }
}

// ES6 Section 12.7: Additive Operators

export class AddNode extends BinaryNode {
    public _type_AddNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Add",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AddNode {
        node = check.node(node,"Add",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AddNode(node.range,left,right);
    }
}

export class SubtractNode extends BinaryNode {
    public _type_SubtractNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Subtract",left,right);
    }
    public static fromGeneric(node: ASTNode | null): SubtractNode {
        node = check.node(node,"Subtract",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new SubtractNode(node.range,left,right);
    }
}

// ES6 Section 12.8: Bitwise Shift Operators

export class LeftShiftNode extends BinaryNode {
    public _type_LeftShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LeftShift",left,right);
    }
    public static fromGeneric(node: ASTNode | null): LeftShiftNode {
        node = check.node(node,"LeftShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LeftShiftNode(node.range,left,right);
    }
}

export class SignedRightShiftNode extends BinaryNode {
    public _type_SignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"SignedRightShift",left,right);
    }
    public static fromGeneric(node: ASTNode | null): SignedRightShiftNode {
        node = check.node(node,"SignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new SignedRightShiftNode(node.range,left,right);
    }
}

export class UnsignedRightShiftNode extends BinaryNode {
    public _type_UnsignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"UnsignedRightShift",left,right);
    }
    public static fromGeneric(node: ASTNode | null): UnsignedRightShiftNode {
        node = check.node(node,"UnsignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new UnsignedRightShiftNode(node.range,left,right);
    }
}

// ES6 Section 12.9: Relational Operators

export class LessThanNode extends BinaryNode {
    public _type_LessThanNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LessThan",left,right);
    }
    public static fromGeneric(node: ASTNode | null): LessThanNode {
        node = check.node(node,"LessThan",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LessThanNode(node.range,left,right);
    }
}

export class GreaterThanNode extends BinaryNode {
    public _type_GreaterThanNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"GreaterThan",left,right);
    }
    public static fromGeneric(node: ASTNode | null): GreaterThanNode {
        node = check.node(node,"GreaterThan",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new GreaterThanNode(node.range,left,right);
    }
}

export class LessEqualNode extends BinaryNode {
    public _type_LessEqualNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LessEqual",left,right);
    }
    public static fromGeneric(node: ASTNode | null): LessEqualNode {
        node = check.node(node,"LessEqual",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LessEqualNode(node.range,left,right);
    }
}

export class GreaterEqualNode extends BinaryNode {
    public _type_GreaterEqualNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"GreaterEqual",left,right);
    }
    public static fromGeneric(node: ASTNode | null): GreaterEqualNode {
        node = check.node(node,"GreaterEqual",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new GreaterEqualNode(node.range,left,right);
    }
}

export class InstanceOfNode extends BinaryNode {
    public _type_InstanceOfNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"InstanceOf",left,right);
    }
    public static fromGeneric(node: ASTNode | null): InstanceOfNode {
        node = check.node(node,"InstanceOf",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new InstanceOfNode(node.range,left,right);
    }
}

export class InNode extends BinaryNode {
    public _type_InNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"In",left,right);
    }
    public static fromGeneric(node: ASTNode | null): InNode {
        node = check.node(node,"In",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new InNode(node.range,left,right);
    }
}

// ES6 Section 12.10: Equality Operators

export class AbstractEqualsNode extends BinaryNode {
    public _type_AbstractEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AbstractEquals",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AbstractEqualsNode {
        node = check.node(node,"AbstractEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AbstractEqualsNode(node.range,left,right);
    }
}

export class AbstractNotEqualsNode extends BinaryNode {
    public _type_AbstractNotEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AbstractNotEquals",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AbstractNotEqualsNode {
        node = check.node(node,"AbstractNotEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AbstractNotEqualsNode(node.range,left,right);
    }
}

export class StrictEqualsNode extends BinaryNode {
    public _type_StrictEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"StrictEquals",left,right);
    }
    public static fromGeneric(node: ASTNode | null): StrictEqualsNode {
        node = check.node(node,"StrictEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new StrictEqualsNode(node.range,left,right);
    }
}

export class StrictNotEqualsNode extends BinaryNode {
    public _type_StrictNotEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"StrictNotEquals",left,right);
    }
    public static fromGeneric(node: ASTNode | null): StrictNotEqualsNode {
        node = check.node(node,"StrictNotEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new StrictNotEqualsNode(node.range,left,right);
    }
}

// ES6 Section 12.11: Binary Bitwise Operators

export class BitwiseANDNode extends BinaryNode {
    public _type_BitwiseANDNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseAND",left,right);
    }
    public static fromGeneric(node: ASTNode | null): BitwiseANDNode {
        node = check.node(node,"BitwiseAND",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new BitwiseANDNode(node.range,left,right);
    }
}

export class BitwiseXORNode extends BinaryNode {
    public _type_BitwiseXORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseXOR",left,right);
    }
    public static fromGeneric(node: ASTNode | null): BitwiseXORNode {
        node = check.node(node,"BitwiseXOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new BitwiseXORNode(node.range,left,right);
    }
}

export class BitwiseORNode extends BinaryNode {
    public _type_BitwiseORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseOR",left,right);
    }
    public static fromGeneric(node: ASTNode | null): BitwiseORNode {
        node = check.node(node,"BitwiseOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new BitwiseORNode(node.range,left,right);
    }
}

// ES6 Section 12.12: Binary Logical Operators

export class LogicalANDNode extends BinaryNode {
    public _type_LogicalANDNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LogicalAND",left,right);
    }
    public static fromGeneric(node: ASTNode | null): LogicalANDNode {
        node = check.node(node,"LogicalAND",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LogicalANDNode(node.range,left,right);
    }
}

export class LogicalORNode extends BinaryNode {
    public _type_LogicalORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LogicalOR",left,right);
    }
    public static fromGeneric(node: ASTNode | null): LogicalORNode {
        node = check.node(node,"LogicalOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LogicalORNode(node.range,left,right);
    }
}

// ES6 Section 12.13: Conditional Operator ( ? : )

export class ConditionalNode extends ExpressionNode {
    public _type_ConditionalNode: any;
    public readonly condition: ExpressionNode;
    public readonly trueExpr: ExpressionNode;
    public readonly falseExpr: ExpressionNode;
    public constructor(
        range: Range,
        condition: ExpressionNode,
        trueExpr: ExpressionNode,
        falseExpr: ExpressionNode
    ) {
        super(range,"Conditional");
        this.condition = condition;
        this.trueExpr = trueExpr;
        this.falseExpr = falseExpr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.condition,this.trueExpr,this.falseExpr];
    }
    public static fromGeneric(node: ASTNode | null): ConditionalNode {
        node = check.node(node,"Conditional",3);
        const condition = ExpressionNode_fromGeneric(node.children[0]);
        const trueExpr = ExpressionNode_fromGeneric(node.children[1]);
        const falseExpr = ExpressionNode_fromGeneric(node.children[2]);
        return new ConditionalNode(node.range,condition,trueExpr,falseExpr);
    }
}

// ES6 Section 12.14: Assignment Operators

export class AssignNode extends BinaryNode {
    public _type_AssignNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Assign",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignNode {
        node = check.node(node,"Assign",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignNode(node.range,left,right);
    }
}

export class AssignMultiplyNode extends BinaryNode {
    public _type_AssignMultiplyNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignMultiply",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignMultiplyNode {
        node = check.node(node,"AssignMultiply",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignMultiplyNode(node.range,left,right);
    }
}

export class AssignDivideNode extends BinaryNode {
    public _type_AssignDivideNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignDivide",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignDivideNode {
        node = check.node(node,"AssignDivide",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignDivideNode(node.range,left,right);
    }
}

export class AssignModuloNode extends BinaryNode {
    public _type_AssignModuloNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignModulo",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignModuloNode {
        node = check.node(node,"AssignModulo",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignModuloNode(node.range,left,right);
    }
}

export class AssignAddNode extends BinaryNode {
    public _type_AssignAddNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignAdd",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignAddNode {
        node = check.node(node,"AssignAdd",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignAddNode(node.range,left,right);
    }
}

export class AssignSubtractNode extends BinaryNode {
    public _type_AssignSubtractNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignSubtract",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignSubtractNode {
        node = check.node(node,"AssignSubtract",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignSubtractNode(node.range,left,right);
    }
}

export class AssignLeftShiftNode extends BinaryNode {
    public _type_AssignLeftShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignLeftShift",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignLeftShiftNode {
        node = check.node(node,"AssignLeftShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignLeftShiftNode(node.range,left,right);
    }
}

export class AssignSignedRightShiftNode extends BinaryNode {
    public _type_AssignSignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignSignedRightShift",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignSignedRightShiftNode {
        node = check.node(node,"AssignSignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignSignedRightShiftNode(node.range,left,right);
    }
}

export class AssignUnsignedRightShiftNode extends BinaryNode {
    public _type_AssignUnsignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignUnsignedRightShift",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignUnsignedRightShiftNode {
        node = check.node(node,"AssignUnsignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignUnsignedRightShiftNode(node.range,left,right);
    }
}

export class AssignBitwiseANDNode extends BinaryNode {
    public _type_AssignBitwiseANDNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseAND",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignBitwiseANDNode {
        node = check.node(node,"AssignBitwiseAND",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignBitwiseANDNode(node.range,left,right);
    }
}

export class AssignBitwiseXORNode extends BinaryNode {
    public _type_AssignBitwiseXORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseXOR",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignBitwiseXORNode {
        node = check.node(node,"AssignBitwiseXOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignBitwiseXORNode(node.range,left,right);
    }
}

export class AssignBitwiseORNode extends BinaryNode {
    public _type_AssignBitwiseORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseOR",left,right);
    }
    public static fromGeneric(node: ASTNode | null): AssignBitwiseORNode {
        node = check.node(node,"AssignBitwiseOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignBitwiseORNode(node.range,left,right);
    }
}

// ES6 Section 12.15: Comma Operator ( , )

export class CommaNode extends BinaryNode {
    public _type_CommaNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Comma",left,right);
    }
    public static fromGeneric(node: ASTNode | null): CommaNode {
        node = check.node(node,"Comma",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new CommaNode(node.range,left,right);
    }
}
