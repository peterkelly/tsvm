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
    IdentifierNode,
} from "../parser/ast";
import {
    MethodDefinitionNode,
} from "./functions";

export type LiteralPropertyNameType = IdentifierNode | StringLiteralNode | NumericLiteralNode;
export type PropertyNameType = ComputedPropertyNameNode | LiteralPropertyNameType;
export type PropertyDefinitionType = ColonPropertyDefinitionNode | CoverInitializedNameNode |
                                     MethodDefinitionNode | IdentifierReferenceNode;
export type ArgumentType = ExpressionNode | SpreadElementNode;
export type ArrayLiteralItemType = ElisionNode | SpreadElementNode | ExpressionNode;

// ES6 Chapter 12: ECMAScript Language: Expressions

export abstract class ExpressionNode extends ASTNode {
    _nominal_type_ExpressionNode: any;
}

export abstract class BinaryNode extends ExpressionNode {
    _nominal_type_BinaryNode: any;
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
    _nominal_type_IdentifierReferenceNode: any;
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
}

// ES6 Section 12.2: Primary Expression

// ES6 Section 12.2.1: Semantics

// ES6 Section 12.2.2: The this Keyword

export class ThisNode extends ExpressionNode {
    _nominal_type_ThisNode: any;
    public constructor(range: Range) {
        super(range,"This");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

// ES6 Section 12.2.3: Identifier Reference

// ES6 Section 12.2.4: Literals

export class NullLiteralNode extends ExpressionNode {
    _nominal_type_NullLiteralNode: any;
    public constructor(range: Range) {
        super(range,"NullLiteral");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

export class TrueNode extends ExpressionNode {
    _nominal_type_TrueNode: any;
    public constructor(range: Range) {
        super(range,"True");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

export class FalseNode extends ExpressionNode {
    _nominal_type_FalseNode: any;
    public constructor(range: Range) {
        super(range,"False");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

export class NumericLiteralNode extends ExpressionNode {
    _nominal_type_NumericLiteralNode: any;
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
}

export class StringLiteralNode extends ExpressionNode {
    _nominal_type_StringLiteralNode: any;
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
}

// ES6 Section 12.2.5: Array Initializer

export class ElementListNode extends ASTNode {
    _nominal_type_ElementListNode: any;
    public readonly elements: ArrayLiteralItemType[];
    public constructor(range: Range, elements: ArrayLiteralItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ArrayLiteralNode extends ExpressionNode {
    _nominal_type_ArrayLiteralNode: any;
    private readonly elements: ElementListNode;
    public constructor(range: Range, elements: ElementListNode) {
        super(range,"ArrayLiteral");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return [this.elements];
    }
}

export class ElisionNode extends ASTNode {
    _nominal_type_ElisionNode: any;
    public constructor(range: Range) {
        super(range,"Elision");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

export class SpreadElementNode extends ASTNode {
    _nominal_type_SpreadElementNode: any;
    public readonly child: ExpressionNode;
    public constructor(range: Range, child: ExpressionNode) {
        super(range,"SpreadElement");
        this.child = child;
    }
    public get children(): (ASTNode | null)[] {
        return [this.child];
    }
}

// ES6 Section 12.2.6: Object Initializer

export class PropertyDefinitionListNode extends ASTNode {
    _nominal_type_PropertyDefinitionListNode: any;
    public readonly elements: PropertyDefinitionType[];
    public constructor(range: Range, elements: PropertyDefinitionType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ObjectLiteralNode extends ExpressionNode {
    _nominal_type_ObjectLiteralNode: any;
    public readonly properties: PropertyDefinitionListNode;
    public constructor(range: Range, properties: PropertyDefinitionListNode) {
        super(range,"ObjectLiteral");
        this.properties = properties;
    }
    public get children(): (ASTNode | null)[] {
        return [this.properties];
    }
}

export class ColonPropertyDefinitionNode extends ASTNode {
    _nominal_type_ColonPropertyDefinitionNode: any;
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
}

export class ComputedPropertyNameNode extends ASTNode {
    _nominal_type_ComputedPropertyNameNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ComputedPropertyName");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class CoverInitializedNameNode extends ASTNode {
    _nominal_type_CoverInitializedNameNode: any;
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
}

// ES6 Section 12.2.7: Function Defining Expressions

// ES6 Section 12.2.8: Regular Expression Literals

// ES6 Section 12.2.9: Template Literals

// ES6 Section 12.2.10: The Grouping Operator

// ES6 Section 12.3: Left-Hand-Side Expressions

export class MemberAccessExprNode extends ExpressionNode {
    _nominal_type_MemberAccessExprNode: any;
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
}

export class MemberAccessIdentNode extends ExpressionNode {
    _nominal_type_MemberAccessIdentNode: any;
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
}

export class SuperPropertyExprNode extends ExpressionNode {
    _nominal_type_SuperPropertyExprNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"SuperPropertyExpr");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class SuperPropertyIdentNode extends ExpressionNode {
    _nominal_type_SuperPropertyIdentNode: any;
    public readonly ident: IdentifierNode;
    public constructor(range: Range, ident: IdentifierNode) {
        super(range,"SuperPropertyIdent");
        this.ident = ident;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }
}

export class NewTargetNode extends ExpressionNode {
    _nominal_type_NewTargetNode: any;
    public constructor(range: Range) {
        super(range,"NewTarget");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

export class NewExpressionNode extends ExpressionNode {
    _nominal_type_NewExpressionNode: any;
    public readonly expr: ExpressionNode;
    public readonly args: ArgumentsNode;
    public constructor(range: Range, expr: ExpressionNode, args: ArgumentsNode) {
        super(range,"NewExpression");
        this.expr = expr;
        this.args = args;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr,this.args];
    }
}

export class CallNode extends ExpressionNode {
    _nominal_type_CallNode: any;
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
}

export class SuperCallNode extends ExpressionNode {
    _nominal_type_SuperCallNode: any;
    public readonly args: ArgumentsNode;
    public constructor(range: Range, args: ArgumentsNode) {
        super(range,"SuperCall");
        this.args = args;
    }
    public get children(): (ASTNode | null)[] {
        return [this.args];
    }
}

export class ArgumentListNode extends ASTNode {
    _nominal_type_ArgumentListNode: any;
    public readonly elements: ArgumentType[];
    public constructor(range: Range, elements: ArgumentType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ArgumentsNode extends ASTNode {
    _nominal_type_ArgumentsNode: any;
    public readonly items: ArgumentListNode;
    public constructor(range: Range, items: ArgumentListNode) {
        super(range,"Arguments");
        this.items = items;
    }
    public get children(): (ASTNode | null)[] {
        return [this.items];
    }
}

// ES6 Section 12.4: Postfix Expressions

export class PostIncrementNode extends ExpressionNode {
    _nominal_type_PostIncrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PostIncrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class PostDecrementNode extends ExpressionNode {
    _nominal_type_PostDecrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PostDecrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

// ES6 Section 12.5: Unary Operators

export class DeleteNode extends ExpressionNode {
    _nominal_type_DeleteNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Delete");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class VoidNode extends ExpressionNode {
    _nominal_type_VoidNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Void");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class TypeOfNode extends ExpressionNode {
    _nominal_type_TypeOfNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"TypeOf");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class PreIncrementNode extends ExpressionNode {
    _nominal_type_PreIncrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PreIncrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class PreDecrementNode extends ExpressionNode {
    _nominal_type_PreDecrementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PreDecrement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class UnaryPlusNode extends ExpressionNode {
    _nominal_type_UnaryPlusNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryPlus");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class UnaryMinusNode extends ExpressionNode {
    _nominal_type_UnaryMinusNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryMinus");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class UnaryBitwiseNotNode extends ExpressionNode {
    _nominal_type_UnaryBitwiseNotNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryBitwiseNot");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

export class UnaryLogicalNotNode extends ExpressionNode {
    _nominal_type_UnaryLogicalNotNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryLogicalNot");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

// ES6 Section 12.6: Multiplicative Operators

export class MultiplyNode extends BinaryNode {
    _nominal_type_MultiplyNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Multiply",left,right);
    }
}

export class DivideNode extends BinaryNode {
    _nominal_type_DivideNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Divide",left,right);
    }
}

export class ModuloNode extends BinaryNode {
    _nominal_type_ModuloNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Modulo",left,right);
    }
}

// ES6 Section 12.7: Additive Operators

export class AddNode extends BinaryNode {
    _nominal_type_AddNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Add",left,right);
    }
}

export class SubtractNode extends BinaryNode {
    _nominal_type_SubtractNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Subtract",left,right);
    }
}

// ES6 Section 12.8: Bitwise Shift Operators

export class LeftShiftNode extends BinaryNode {
    _nominal_type_LeftShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LeftShift",left,right);
    }
}

export class SignedRightShiftNode extends BinaryNode {
    _nominal_type_SignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"SignedRightShift",left,right);
    }
}

export class UnsignedRightShiftNode extends BinaryNode {
    _nominal_type_UnsignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"UnsignedRightShift",left,right);
    }
}

// ES6 Section 12.9: Relational Operators

export class LessThanNode extends BinaryNode {
    _nominal_type_LessThanNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LessThan",left,right);
    }
}

export class GreaterThanNode extends BinaryNode {
    _nominal_type_GreaterThanNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"GreaterThan",left,right);
    }
}

export class LessEqualNode extends BinaryNode {
    _nominal_type_LessEqualNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LessEqual",left,right);
    }
}

export class GreaterEqualNode extends BinaryNode {
    _nominal_type_GreaterEqualNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"GreaterEqual",left,right);
    }
}

export class InstanceOfNode extends BinaryNode {
    _nominal_type_InstanceOfNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"InstanceOf",left,right);
    }
}

export class InNode extends BinaryNode {
    _nominal_type_InNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"In",left,right);
    }
}

// ES6 Section 12.10: Equality Operators

export class AbstractEqualsNode extends BinaryNode {
    _nominal_type_AbstractEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AbstractEquals",left,right);
    }
}

export class AbstractNotEqualsNode extends BinaryNode {
    _nominal_type_AbstractNotEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AbstractNotEquals",left,right);
    }
}

export class StrictEqualsNode extends BinaryNode {
    _nominal_type_StrictEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"StrictEquals",left,right);
    }
}

export class StrictNotEqualsNode extends BinaryNode {
    _nominal_type_StrictNotEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"StrictNotEquals",left,right);
    }
}

// ES6 Section 12.11: Binary Bitwise Operators

export class BitwiseANDNode extends BinaryNode {
    _nominal_type_BitwiseANDNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseAND",left,right);
    }
}

export class BitwiseXORNode extends BinaryNode {
    _nominal_type_BitwiseXORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseXOR",left,right);
    }
}

export class BitwiseORNode extends BinaryNode {
    _nominal_type_BitwiseORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseOR",left,right);
    }
}

// ES6 Section 12.12: Binary Logical Operators

export class LogicalANDNode extends BinaryNode {
    _nominal_type_LogicalANDNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LogicalAND",left,right);
    }
}

export class LogicalORNode extends BinaryNode {
    _nominal_type_LogicalORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LogicalOR",left,right);
    }
}

// ES6 Section 12.13: Conditional Operator ( ? : )

export class ConditionalNode extends ExpressionNode {
    _nominal_type_ConditionalNode: any;
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
}

// ES6 Section 12.14: Assignment Operators

export class AssignNode extends BinaryNode {
    _nominal_type_AssignNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Assign",left,right);
    }
}

export class AssignMultiplyNode extends BinaryNode {
    _nominal_type_AssignMultiplyNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignMultiply",left,right);
    }
}

export class AssignDivideNode extends BinaryNode {
    _nominal_type_AssignDivideNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignDivide",left,right);
    }
}

export class AssignModuloNode extends BinaryNode {
    _nominal_type_AssignModuloNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignModulo",left,right);
    }
}

export class AssignAddNode extends BinaryNode {
    _nominal_type_AssignAddNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignAdd",left,right);
    }
}

export class AssignSubtractNode extends BinaryNode {
    _nominal_type_AssignSubtractNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignSubtract",left,right);
    }
}

export class AssignLeftShiftNode extends BinaryNode {
    _nominal_type_AssignLeftShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignLeftShift",left,right);
    }
}

export class AssignSignedRightShiftNode extends BinaryNode {
    _nominal_type_AssignSignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignSignedRightShift",left,right);
    }
}

export class AssignUnsignedRightShiftNode extends BinaryNode {
    _nominal_type_AssignUnsignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignUnsignedRightShift",left,right);
    }
}

export class AssignBitwiseANDNode extends BinaryNode {
    _nominal_type_AssignBitwiseANDNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseAND",left,right);
    }
}

export class AssignBitwiseXORNode extends BinaryNode {
    _nominal_type_AssignBitwiseXORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseXOR",left,right);
    }
}

export class AssignBitwiseORNode extends BinaryNode {
    _nominal_type_AssignBitwiseORNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseOR",left,right);
    }
}

// ES6 Section 12.15: Comma Operator ( , )

export class CommaNode extends BinaryNode {
    _nominal_type_CommaNode: any;
    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Comma",left,right);
    }
}
