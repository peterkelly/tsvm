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

export type LiteralPropertyNameType = IdentifierNode | StringLiteralNode | NumericLiteralNode;
export type PropertyNameType = ComputedPropertyNameNode | LiteralPropertyNameType;
export type PropertyDefinitionType = ColonPropertyDefinitionNode | CoverInitializedNameNode |
                                     MethodDefinitionNode | IdentifierReferenceNode;
export type StatementListItemType = StatementNode | DeclarationNode;
export type SingleNameBindingType = BindingIdentifierNode | SingleNameBindingNode;
export type BindingElementType = SingleNameBindingType | BindingPatternInitNode |
                                 BindingPatternNode | BindingRestElementNode |
                                 BindingElisionElementNode | ElisionNode; // FIXME: ElisionNode should not be part of this
export type ArgumentType = ExpressionNode | SpreadElementNode;
export type ForBindingType = BindingIdentifierNode | BindingPatternNode;
export type CatchParameterType = BindingIdentifierNode | BindingPatternNode;
export type BindingPropertyType = SingleNameBindingType | BindingPropertyNode;
export type ClassElementType = MethodDefinitionNode | StaticMethodDefinitionNode | EmptyClassElementNode;
export type ModuleItemType = ImportNode | ExportNode | StatementListItemType;
export type ArrayLiteralItemType = ElisionNode | SpreadElementNode | ExpressionNode;
export type ForCInitType = ExpressionNode | VarNode | LetNode | ConstNode | null;
export type ForInBindingType = ExpressionNode | VarForDeclarationNode | LetForDeclarationNode | ConstForDeclarationNode;
export type ForOfBindingType = ExpressionNode | VarForDeclarationNode | LetForDeclarationNode | ConstForDeclarationNode;

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
    public abstract get children(): ASTNode[];
    public get label(): string { return this.kind; }
}

export abstract class StatementNode extends ASTNode {
    _nominal_type_StatementNode: any;
}

export abstract class BreakableStatementNode extends StatementNode {
    _nominal_type_BreakableStatementNode: any;
}

export abstract class ExpressionNode extends ASTNode {
    _nominal_type_ExpressionNode: any;
}

export abstract class ImportClauseNode extends ASTNode {
    _nominal_type_ImportClauseNode: any;
}

export abstract class ExportNode extends ASTNode {
    _nominal_type_ExportNode: any;
}

export abstract class ImportNode extends ASTNode {
    _nominal_type_ImportNode: any;
}

export abstract class MethodDefinitionNode extends ASTNode {
    _nominal_type_MethodDefinitionNode: any;
}

export abstract class DeclarationNode extends ASTNode {
    _nominal_type_DeclarationNode: any;
}

export abstract class LexicalBindingNode extends ASTNode {
    _nominal_type_LexicalBindingNode: any;
}

export abstract class BindingPatternNode extends ASTNode {
    _nominal_type_BindingPatternNode: any;
}

export abstract class BinaryNode extends ExpressionNode {
    _nominal_type_BinaryNode: any;
    public readonly left: ExpressionNode | ErrorNode;
    public readonly right: ExpressionNode | ErrorNode;
    public readonly _children: ASTNode[];
    public constructor(range: Range, kind: string, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,kind);
        this.left = left;
        this.right = right;
        this._children = [left,right];
    }
    public get children(): ASTNode[] {
        return this._children;
    }
}

// Section 12.1

export class IdentifierReferenceNode extends ExpressionNode {
    _nominal_type_IdentifierReferenceNode: any;
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"IdentifierReference");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return "IdentifierReference("+JSON.stringify(this.value)+")";
        // return this.value;
    }
}

export class BindingIdentifierNode extends ASTNode {
    _nominal_type_BindingIdentifierNode: any;
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"BindingIdentifier");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return "BindingIdentifier("+JSON.stringify(this.value)+")";
        // return this.value;
    }
}

export class LabelIdentifierNode extends ASTNode {
    _nominal_type_LabelIdentifierNode: any;
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"LabelIdentifier");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return "LabelIdentifier("+JSON.stringify(this.value)+")";
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
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return "Identifier("+JSON.stringify(this.value)+")";
        // return this.value;
    }
}

// Section 12.2

export class ThisNode extends ExpressionNode {
    _nominal_type_ThisNode: any;
    public constructor(range: Range) {
        super(range,"This");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class NullLiteralNode extends ExpressionNode {
    _nominal_type_NullLiteralNode: any;
    public constructor(range: Range) {
        super(range,"NullLiteral");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class BooleanLiteralNode extends ExpressionNode {
    _nominal_type_BooleanLiteralNode: any;
    public readonly value: boolean;
    public constructor(range: Range, value: boolean) {
        super(range,"BooleanLiteral");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return this.value ? "true" : "false";
    }
}

export class NumericLiteralNode extends ExpressionNode {
    _nominal_type_NumericLiteralNode: any;
    public readonly value: number;
    public constructor(range: Range, value: number) {
        super(range,"NumericLiteral");
        this.value = value;
    }
    public get children(): ASTNode[] {
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
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        // return "StringLiteral("+JSON.stringify(this.value)+")";
        return JSON.stringify(this.value);
    }
}

// // Section 12.2.5

export class ArrayLiteralNode extends ExpressionNode {
    _nominal_type_ArrayLiteralNode: any;
    private readonly elements: ElementListNode | ErrorNode;
    public constructor(range: Range, elements: ElementListNode | ErrorNode) {
        super(range,"ArrayLiteral");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return [this.elements];
    }
}

export class ElisionNode extends ASTNode {
    _nominal_type_ElisionNode: any;
    public readonly count: number;
    public constructor(range: Range, count: number) {
        super(range,"Elision");
        this.count = count;
    }
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return "Elision("+this.count+")";
    }
}

export class SpreadElementNode extends ASTNode {
    _nominal_type_SpreadElementNode: any;
    public readonly child: ExpressionNode | ErrorNode;
    public constructor(range: Range, child: ExpressionNode | ErrorNode) {
        super(range,"SpreadElement");
        this.child = child;
    }
    public get children(): ASTNode[] {
        return [this.child];
    }
}

// Section 12.2.6

export class ObjectLiteralNode extends ExpressionNode {
    _nominal_type_ObjectLiteralNode: any;
    public readonly properties: PropertyDefinitionListNode | ErrorNode;
    public constructor(range: Range, properties: PropertyDefinitionListNode | ErrorNode) {
        super(range,"ObjectLiteral");
        this.properties = properties;
    }
    public get children(): ASTNode[] {
        return [this.properties];
    }
}

export class ColonPropertyDefinitionNode extends ASTNode {
    _nominal_type_ColonPropertyDefinitionNode: any;
    public readonly name: PropertyNameType | ErrorNode;
    public readonly init: ExpressionNode | ErrorNode;
    public constructor(range: Range, name: PropertyNameType | ErrorNode, init: ExpressionNode | ErrorNode) {
        super(range,"ColonPropertyDefinition");
        this.name = name;
        this.init = init;
    }
    public get children(): ASTNode[] {
        return [this.name,this.init];
    }
}

export class ComputedPropertyNameNode extends ASTNode {
    _nominal_type_ComputedPropertyNameNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"ComputedPropertyName");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class CoverInitializedNameNode extends ASTNode {
    _nominal_type_CoverInitializedNameNode: any;
    public readonly ident: IdentifierReferenceNode | ErrorNode;
    public readonly init: ExpressionNode | ErrorNode;
    public constructor(range: Range, ident: IdentifierReferenceNode | ErrorNode, init: ExpressionNode | ErrorNode) {
        super(range,"CoverInitializedName");
        this.ident = ident;
        this.init = init;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.init];
    }
}

// Section 12.3

export class MemberAccessExprNode extends ExpressionNode {
    _nominal_type_MemberAccessExprNode: any;
    public readonly obj: ExpressionNode | ErrorNode;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, obj: ExpressionNode | ErrorNode, expr: ExpressionNode | ErrorNode) {
        super(range,"MemberAccessExpr");
        this.obj = obj;
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.obj,this.expr];
    }
}

export class MemberAccessIdentNode extends ExpressionNode {
    _nominal_type_MemberAccessIdentNode: any;
    public readonly obj: ExpressionNode | ErrorNode;
    public readonly ident: IdentifierNode | ErrorNode;
    public constructor(range: Range, obj: ExpressionNode | ErrorNode, ident: IdentifierNode | ErrorNode) {
        super(range,"MemberAccessIdent");
        this.obj = obj;
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.obj,this.ident];
    }
}

export class SuperPropertyExprNode extends ExpressionNode {
    _nominal_type_SuperPropertyExprNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"SuperPropertyExpr");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class SuperPropertyIdentNode extends ExpressionNode {
    _nominal_type_SuperPropertyIdentNode: any;
    public readonly ident: IdentifierNode | ErrorNode;
    public constructor(range: Range, ident: IdentifierNode | ErrorNode) {
        super(range,"SuperPropertyIdent");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

export class NewTargetNode extends ExpressionNode {
    _nominal_type_NewTargetNode: any;
    public constructor(range: Range) {
        super(range,"NewTarget");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class NewExpressionNode extends ExpressionNode {
    _nominal_type_NewExpressionNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public readonly args: ArgumentsNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode, args: ArgumentsNode | ErrorNode) {
        super(range,"NewExpression");
        this.expr = expr;
        this.args = args;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.args];
    }
}

export class CallNode extends ExpressionNode {
    _nominal_type_CallNode: any;
    public readonly fun: ExpressionNode | ErrorNode;
    public readonly args: ArgumentsNode | ErrorNode;
    public constructor(range: Range, fun: ExpressionNode | ErrorNode, args: ArgumentsNode | ErrorNode) {
        super(range,"Call");
        this.fun = fun;
        this.args = args;
    }
    public get children(): ASTNode[] {
        return [this.fun,this.args];
    }
}

export class SuperCallNode extends ExpressionNode {
    _nominal_type_SuperCallNode: any;
    public readonly args: ArgumentsNode | ErrorNode;
    public constructor(range: Range, args: ArgumentsNode | ErrorNode) {
        super(range,"SuperCall");
        this.args = args;
    }
    public get children(): ASTNode[] {
        return [this.args];
    }
}

export class ArgumentsNode extends ASTNode {
    _nominal_type_ArgumentsNode: any;
    public readonly items: ArgumentListNode | ErrorNode;
    public constructor(range: Range, items: ArgumentListNode | ErrorNode) {
        super(range,"Arguments");
        this.items = items;
    }
    public get children(): ASTNode[] {
        return [this.items];
    }
}

// Section 12.4

export class PostIncrementNode extends ExpressionNode {
    _nominal_type_PostIncrementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"PostIncrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class PostDecrementNode extends ExpressionNode {
    _nominal_type_PostDecrementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"PostDecrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 12.5

export class DeleteNode extends ExpressionNode {
    _nominal_type_DeleteNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"Delete");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class VoidNode extends ExpressionNode {
    _nominal_type_VoidNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"Void");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class TypeOfNode extends ExpressionNode {
    _nominal_type_TypeOfNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"TypeOf");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class PreIncrementNode extends ExpressionNode {
    _nominal_type_PreIncrementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"PreIncrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class PreDecrementNode extends ExpressionNode {
    _nominal_type_PreDecrementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"PreDecrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryPlusNode extends ExpressionNode {
    _nominal_type_UnaryPlusNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"UnaryPlus");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryMinusNode extends ExpressionNode {
    _nominal_type_UnaryMinusNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"UnaryMinus");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryBitwiseNotNode extends ExpressionNode {
    _nominal_type_UnaryBitwiseNotNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"UnaryBitwiseNot");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryLogicalNotNode extends ExpressionNode {
    _nominal_type_UnaryLogicalNotNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"UnaryLogicalNot");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 12.6

export class MultiplyNode extends BinaryNode {
    _nominal_type_MultiplyNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Multiply",left,right);
    }
}

export class DivideNode extends BinaryNode {
    _nominal_type_DivideNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Divide",left,right);
    }
}

export class ModuloNode extends BinaryNode {
    _nominal_type_ModuloNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Modulo",left,right);
    }
}

// Section 12.7

export class AddNode extends BinaryNode {
    _nominal_type_AddNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Add",left,right);
    }
}

export class SubtractNode extends BinaryNode {
    _nominal_type_SubtractNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Subtract",left,right);
    }
}

// Section 12.8

export class LeftShiftNode extends BinaryNode {
    _nominal_type_LeftShiftNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"LeftShift",left,right);
    }
}

export class SignedRightShiftNode extends BinaryNode {
    _nominal_type_SignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"SignedRightShift",left,right);
    }
}

export class UnsignedRightShiftNode extends BinaryNode {
    _nominal_type_UnsignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"UnsignedRightShift",left,right);
    }
}

// Section 12.9

export class LessThanNode extends BinaryNode {
    _nominal_type_LessThanNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"LessThan",left,right);
    }
}

export class GreaterThanNode extends BinaryNode {
    _nominal_type_GreaterThanNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"GreaterThan",left,right);
    }
}

export class LessEqualNode extends BinaryNode {
    _nominal_type_LessEqualNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"LessEqual",left,right);
    }
}

export class GreaterEqualNode extends BinaryNode {
    _nominal_type_GreaterEqualNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"GreaterEqual",left,right);
    }
}

export class InstanceOfNode extends BinaryNode {
    _nominal_type_InstanceOfNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"InstanceOf",left,right);
    }
}

export class InNode extends BinaryNode {
    _nominal_type_InNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"In",left,right);
    }
}

// Section 12.10

export class AbstractEqualsNode extends BinaryNode {
    _nominal_type_AbstractEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AbstractEquals",left,right);
    }
}

export class AbstractNotEqualsNode extends BinaryNode {
    _nominal_type_AbstractNotEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AbstractNotEquals",left,right);
    }
}

export class StrictEqualsNode extends BinaryNode {
    _nominal_type_StrictEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"StrictEquals",left,right);
    }
}

export class StrictNotEqualsNode extends BinaryNode {
    _nominal_type_StrictNotEqualsNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"StrictNotEquals",left,right);
    }
}

// Section 12.11

export class BitwiseANDNode extends BinaryNode {
    _nominal_type_BitwiseANDNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"BitwiseAND",left,right);
    }
}

export class BitwiseXORNode extends BinaryNode {
    _nominal_type_BitwiseXORNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"BitwiseXOR",left,right);
    }
}

export class BitwiseORNode extends BinaryNode {
    _nominal_type_BitwiseORNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"BitwiseOR",left,right);
    }
}

// Section 12.12

export class LogicalANDNode extends BinaryNode {
    _nominal_type_LogicalANDNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"LogicalAND",left,right);
    }
}

export class LogicalORNode extends BinaryNode {
    _nominal_type_LogicalORNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"LogicalORNode",left,right);
    }
}

// Section 12.13

export class ConditionalNode extends ExpressionNode {
    _nominal_type_ConditionalNode: any;
    public readonly condition: ExpressionNode | ErrorNode;
    public readonly trueExpr: ExpressionNode | ErrorNode;
    public readonly falseExpr: ExpressionNode | ErrorNode;
    public constructor(
        range: Range,
        condition: ExpressionNode | ErrorNode,
        trueExpr: ExpressionNode | ErrorNode,
        falseExpr: ExpressionNode | ErrorNode
    ) {
        super(range,"Conditional");
        this.condition = condition;
        this.trueExpr = trueExpr;
        this.falseExpr = falseExpr;
    }
    public get children(): ASTNode[] {
        return [this.condition,this.trueExpr,this.falseExpr];
    }
}

// Section 12.14

export class AssignNode extends BinaryNode {
    _nominal_type_AssignNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Assign",left,right);
    }
}

export class AssignMultiplyNode extends BinaryNode {
    _nominal_type_AssignMultiplyNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignMultiply",left,right);
    }
}

export class AssignDivideNode extends BinaryNode {
    _nominal_type_AssignDivideNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignDivide",left,right);
    }
}

export class AssignModuloNode extends BinaryNode {
    _nominal_type_AssignModuloNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignModulo",left,right);
    }
}

export class AssignAddNode extends BinaryNode {
    _nominal_type_AssignAddNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignAdd",left,right);
    }
}

export class AssignSubtractNode extends BinaryNode {
    _nominal_type_AssignSubtractNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignSubtract",left,right);
    }
}

export class AssignLeftShiftNode extends BinaryNode {
    _nominal_type_AssignLeftShiftNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignLeftShift",left,right);
    }
}

export class AssignSignedRightShiftNode extends BinaryNode {
    _nominal_type_AssignSignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignSignedRightShift",left,right);
    }
}

export class AssignUnsignedRightShiftNode extends BinaryNode {
    _nominal_type_AssignUnsignedRightShiftNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignUnsignedRightShift",left,right);
    }
}

export class AssignBitwiseANDNode extends BinaryNode {
    _nominal_type_AssignBitwiseANDNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignBitwiseAND",left,right);
    }
}

export class AssignBitwiseXORNode extends BinaryNode {
    _nominal_type_AssignBitwiseXORNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignBitwiseXOR",left,right);
    }
}

export class AssignBitwiseORNode extends BinaryNode {
    _nominal_type_AssignBitwiseORNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"AssignBitwiseOR",left,right);
    }
}


// Section 12.15

export class CommaNode extends BinaryNode {
    _nominal_type_CommaNode: any;
    public constructor(range: Range, left: ExpressionNode | ErrorNode, right: ExpressionNode | ErrorNode) {
        super(range,"Comma",left,right);
    }
}

// Section 13

export class BlockNode extends StatementNode {
    _nominal_type_BlockNode: any;
    public statements: StatementListNode | ErrorNode;
    public constructor(range: Range, statements: StatementListNode | ErrorNode) {
        super(range,"Block");
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return [this.statements];
    }
}

// Section 13.3.1

export class LetNode extends DeclarationNode {
    _nominal_type_LetNode: any;
    public bindings: BindingListNode | ErrorNode;
    public constructor(range: Range, bindings: BindingListNode | ErrorNode) {
        super(range,"Let");
        this.bindings = bindings;
    }
    public get children(): ASTNode[] {
        return [this.bindings];
    }
}

export class ConstNode extends DeclarationNode {
    _nominal_type_ConstNode: any;
    public bindings: BindingListNode | ErrorNode;
    public constructor(range: Range, bindings: BindingListNode | ErrorNode) {
        super(range,"Const");
        this.bindings = bindings;
    }
    public get children(): ASTNode[] {
        return [this.bindings];
    }
}

export class LexicalIdentifierBindingNode extends LexicalBindingNode {
    _nominal_type_LexicalIdentifierBindingNode: any;
    public identifier: BindingIdentifierNode | ErrorNode;
    public initializer: ExpressionNode | ErrorNode;
    public constructor(
        range: Range,
        identifier: BindingIdentifierNode | ErrorNode,
        initializer: ExpressionNode | ErrorNode
    ) {
        super(range,"LexicalIdentifierBinding");
        this.identifier = identifier;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.identifier,this.initializer];
    }
}

export class LexicalPatternBindingNode extends LexicalBindingNode {
    _nominal_type_LexicalPatternBindingNode: any;
    public pattern: BindingPatternNode | ErrorNode;
    public initializer: ExpressionNode | ErrorNode;
    public constructor(
        range: Range,
        pattern: BindingPatternNode | ErrorNode,
        initializer: ExpressionNode | ErrorNode
    ) {
        super(range,"LexicalPatternBinding");
        this.pattern = pattern;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.pattern,this.initializer];
    }
}

// Section 13.3.2

export class VarNode extends StatementNode {
    _nominal_type_VarNode: any;
    public declarations: VariableDeclarationListNode | ErrorNode;
    public constructor(range: Range, declarations: VariableDeclarationListNode | ErrorNode) {
        super(range,"Var");
        this.declarations = declarations;
    }
    public get children(): ASTNode[] {
        return [this.declarations];
    }
}

export class VarIdentifierNode extends ASTNode {
    _nominal_type_VarIdentifierNode: any;
    public identifier: BindingIdentifierNode | ErrorNode;
    public initializer: ExpressionNode | ErrorNode;
    public constructor(
        range: Range,
        identifier: BindingIdentifierNode | ErrorNode,
        initializer: ExpressionNode | ErrorNode
    ) {
        super(range,"VarIdentifier");
        this.identifier = identifier;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.identifier,this.initializer];
    }
}

export class VarPatternNode extends ASTNode {
    _nominal_type_VarPatternNode: any;
    public pattern: BindingPatternNode | ErrorNode;
    public initializer: ExpressionNode | ErrorNode;
    public constructor(
        range: Range,
        pattern: BindingPatternNode | ErrorNode,
        initializer: ExpressionNode | ErrorNode
    ) {
        super(range,"VarPattern");
        this.pattern = pattern;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.pattern,this.initializer];
    }
}

// Section 13.3.3

export class ObjectBindingPatternNode extends BindingPatternNode {
    _nominal_type_ObjectBindingPatternNode: any;
    public readonly properties: BindingPropertyListNode | ErrorNode;
    public constructor(range: Range, properties: BindingPropertyListNode | ErrorNode) {
        super(range,"ObjectBindingPattern");
        this.properties = properties;
    }
    public get children(): ASTNode[] {
        return [this.properties];
    }
}

export class ArrayBindingPatternNode extends BindingPatternNode {
    _nominal_type_ArrayBindingPatternNode: any;
    public readonly elements: BindingElementListNode | ErrorNode;
    public constructor(range: Range, elements: BindingElementListNode | ErrorNode) {
        super(range,"ArrayBindingPattern");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return [this.elements];
    }
}

export class BindingElisionElementNode extends ASTNode {
    _nominal_type_BindingElisionElementNode: any;
    public readonly elision: ElisionNode | ErrorNode;
    public readonly element: BindingElementType | ErrorNode;
    public constructor(range: Range, elision: ElisionNode | ErrorNode, element: BindingElementType | ErrorNode) {
        super(range,"BindingElisionElement");
        this.elision = elision;
        this.element = element;
    }
    public get children(): ASTNode[] {
        return [this.elision,this.element];
    }
}

export class BindingPropertyNode extends ASTNode {
    _nominal_type_BindingPropertyNode: any;
    public readonly name: PropertyNameType | ErrorNode;
    public readonly element: BindingElementType | ErrorNode;
    public constructor(range: Range, name: PropertyNameType | ErrorNode, element: BindingElementType | ErrorNode) {
        super(range,"BindingProperty");
        this.name = name;
        this.element = element;
    }
    public get children(): ASTNode[] {
        return [this.name,this.element];
    }
}

export class BindingPatternInitNode extends ASTNode {
    _nominal_type_BindingPatternInitNode: any;
    public readonly pattern: BindingPatternNode | ErrorNode;
    public readonly init: ExpressionNode | ErrorNode;
    public constructor(
        range: Range,
        pattern: BindingPatternNode | ErrorNode,
        init: ExpressionNode | ErrorNode
    ) {
        super(range,"BindingPatternInit");
        this.pattern = pattern;
        this.init = init;
    }
    public get children(): ASTNode[] {
        return [this.pattern,this.init];
    }
}

export class SingleNameBindingNode extends ASTNode {
    _nominal_type_SingleNameBindingNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode;
    public readonly init: ExpressionNode | ErrorNode;
    public constructor(range: Range, ident: BindingIdentifierNode | ErrorNode, init: ExpressionNode | ErrorNode) {
        super(range,"SingleNameBinding");
        this.ident = ident;
        this.init = init;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.init];
    }
}

export class BindingRestElementNode extends ASTNode {
    _nominal_type_BindingRestElementNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode;
    public constructor(range: Range, ident: BindingIdentifierNode | ErrorNode) {
        super(range,"BindingRestElement");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

// Section 13.4

export class EmptyStatementNode extends StatementNode {
    _nominal_type_EmptyStatementNode: any;
    public constructor(range: Range) {
        super(range,"EmptyStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 13.5

export class ExpressionStatementNode extends StatementNode {
    _nominal_type_ExpressionStatementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"ExpressionStatement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 13.6

export class IfStatementNode extends StatementNode {
    _nominal_type_IfStatementNode: any;
    public readonly condition: ExpressionNode | ErrorNode;
    public readonly trueBranch: StatementNode | ErrorNode;
    public readonly falseBranch: StatementNode | ErrorNode;
    public constructor(
        range: Range,
        condition: ExpressionNode | ErrorNode,
        trueBranch: StatementNode | ErrorNode,
        falseBranch: StatementNode | ErrorNode
    ) {
        super(range,"IfStatement");
        this.condition = condition;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }
    public get children(): ASTNode[] {
        return [this.condition,this.trueBranch,this.falseBranch];
    }
}

// Section 13.7

export class DoStatementNode extends BreakableStatementNode {
    _nominal_type_DoStatementNode: any;
    public readonly body: StatementNode | ErrorNode;
    public readonly condition: ExpressionNode | ErrorNode;
    public constructor(range: Range, body: StatementNode | ErrorNode, condition: ExpressionNode | ErrorNode) {
        super(range,"DoStatement");
        this.body = body;
        this.condition = condition;
    }
    public get children(): ASTNode[] {
        return [this.body,this.condition];
    }
}

export class WhileStatementNode extends BreakableStatementNode {
    _nominal_type_WhileStatementNode: any;
    public readonly condition: ExpressionNode | ErrorNode;
    public readonly body: StatementNode | ErrorNode;
    public constructor(range: Range, condition: ExpressionNode | ErrorNode, body: StatementNode | ErrorNode) {
        super(range,"WhileStatement");
        this.condition = condition;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.condition,this.body];
    }
}

export class ForCNode extends BreakableStatementNode {
    _nominal_type_ForCNode: any;
    public readonly init: ForCInitType | ErrorNode;
    public readonly condition: ExpressionNode | ErrorNode;
    public readonly update: ExpressionNode | ErrorNode;
    public readonly body: StatementNode | ErrorNode;
    public constructor(
        range: Range,
        init: ForCInitType | ErrorNode,
        condition: ExpressionNode | ErrorNode,
        update: ExpressionNode | ErrorNode,
        body: StatementNode | ErrorNode
    ) {
        super(range,"ForC");
        this.init = init;
        this.condition = condition;
        this.update = update;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.init,this.condition,this.update,this.body];
    }
}

export class ForInNode extends BreakableStatementNode {
    _nominal_type_ForInNode: any;
    public readonly binding: ForInBindingType | ErrorNode;
    public readonly expr: ExpressionNode | ErrorNode;
    public readonly body: StatementNode | ErrorNode;
    public constructor(
        range: Range,
        binding: ForInBindingType | ErrorNode,
        expr: ExpressionNode | ErrorNode,
        body: StatementNode | ErrorNode
    ) {
        super(range,"ForIn");
        this.binding = binding;
        this.expr = expr;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.binding,this.expr,this.body];
    }
}

export class ForOfNode extends BreakableStatementNode {
    _nominal_type_ForOfNode: any;
    public readonly binding: ForOfBindingType | ErrorNode;
    public readonly expr: ExpressionNode | ErrorNode;
    public readonly body: StatementNode | ErrorNode;
    public constructor(
        range: Range,
        binding: ForOfBindingType | ErrorNode,
        expr: ExpressionNode | ErrorNode,
        body: StatementNode | ErrorNode
    ) {
        super(range,"ForOf");
        this.binding = binding;
        this.expr = expr;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.binding,this.expr,this.body];
    }
}

export class VarForDeclarationNode extends ASTNode {
    _nominal_type_VarForDeclarationNode: any;
    public readonly binding: ForBindingType | ErrorNode;
    public constructor(range: Range, binding: ForBindingType | ErrorNode) {
        super(range,"VarForDeclaration");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class LetForDeclarationNode extends ASTNode {
    _nominal_type_LetForDeclarationNode: any;
    public readonly binding: ForBindingType | ErrorNode;
    public constructor(range: Range, binding: ForBindingType | ErrorNode) {
        super(range,"LetForDeclaration");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class ConstForDeclarationNode extends ASTNode {
    _nominal_type_ConstForDeclarationNode: any;
    public readonly binding: ForBindingType | ErrorNode;
    public constructor(range: Range, binding: ForBindingType | ErrorNode) {
        super(range,"ConstForDeclaration");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}


// Section 13.8

export class ContinueStatementNode extends StatementNode {
    _nominal_type_ContinueStatementNode: any;
    public readonly labelIdentifier: LabelIdentifierNode | ErrorNode;
    public constructor(range: Range, labelIdentifier: LabelIdentifierNode | ErrorNode) {
        super(range,"ContinueStatement");
        this.labelIdentifier = labelIdentifier;
    }
    public get children(): ASTNode[] {
        return [this.labelIdentifier];
    }
}

// Section 13.9

export class BreakStatementNode extends StatementNode {
    _nominal_type_BreakStatementNode: any;
    public readonly labelIdentifier: LabelIdentifierNode | ErrorNode;
    public constructor(range: Range, labelIdentifier: LabelIdentifierNode | ErrorNode) {
        super(range,"BreakStatement");
        this.labelIdentifier = labelIdentifier;
    }
    public get children(): ASTNode[] {
        return [this.labelIdentifier];
    }
}

// Section 13.10

export class ReturnStatementNode extends StatementNode {
    _nominal_type_ReturnStatementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"ReturnStatement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 13.11

export class WithStatementNode extends StatementNode {
    _nominal_type_WithStatementNode: any;
    public expr: ExpressionNode | ErrorNode;
    public body: StatementNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode, body: StatementNode | ErrorNode) {
        super(range,"WithStatement");
        this.expr = expr;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.body];
    }
}

// Section 13.12

export class SwitchStatementNode extends BreakableStatementNode {
    _nominal_type_SwitchStatementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public readonly cases: CaseClauseListNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode, cases: CaseClauseListNode | ErrorNode) {
        super(range,"SwitchStatement");
        this.expr = expr;
        this.cases = cases;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.cases];
    }
}

export class CaseClauseNode extends ASTNode {
    _nominal_type_CaseClauseNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public readonly statements: StatementListNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode, statements: StatementListNode | ErrorNode) {
        super(range,"CaseClause");
        this.expr = expr;
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.statements];
    }
}

export class DefaultClauseNode extends ASTNode {
    _nominal_type_DefaultClauseNode: any;
    public readonly statements: StatementListNode | ErrorNode;
    public constructor(range: Range, statements: StatementListNode | ErrorNode) {
        super(range,"DefaultClause");
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return [this.statements];
    }
}

// Section 13.13

export class LabelledStatementNode extends StatementNode {
    _nominal_type_LabelledStatementNode: any;
    public readonly ident: LabelIdentifierNode | ErrorNode;
    public readonly item: StatementNode | FunctionDeclarationNode | ErrorNode;
    public constructor(
        range: Range,
        ident: LabelIdentifierNode | ErrorNode,
        item: StatementNode | FunctionDeclarationNode | ErrorNode
    ) {
        super(range,"LabelledStatement");
        this.ident = ident;
        this.item = item;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.item];
    }
}

// Section 13.14

export class ThrowStatementNode extends StatementNode {
    _nominal_type_ThrowStatementNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"ThrowStatement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 13.15

export class TryStatementNode extends StatementNode {
    _nominal_type_TryStatementNode: any;
    public tryNode: BlockNode | ErrorNode;
    public catchNode: CatchNode | ErrorNode;
    public finallyNode: FinallyNode | ErrorNode;
    public constructor(
        range: Range,
        tryNode: BlockNode | ErrorNode,
        catchNode: CatchNode | ErrorNode,
        finallyNode: FinallyNode | ErrorNode
    ) {
        super(range,"TryStatement");
        this.tryNode = tryNode;
        this.catchNode = catchNode;
        this.finallyNode = finallyNode;
    }
    public get children(): ASTNode[] {
        return [this.tryNode,this.catchNode,this.finallyNode];
    }
}

export class CatchNode extends ASTNode {
    _nominal_type_CatchNode: any;
    public readonly param: CatchParameterType | ErrorNode;
    public readonly block: BlockNode | ErrorNode;
    public constructor(range: Range, param: CatchParameterType | ErrorNode, block: BlockNode | ErrorNode) {
        super(range,"Catch");
        this.param = param;
        this.block = block;
    }
    public get children(): ASTNode[] {
        return [this.param,this.block];
    }
}

export class FinallyNode extends ASTNode {
    _nominal_type_FinallyNode: any;
    public readonly block: BlockNode | ErrorNode;
    public constructor(range: Range, block: BlockNode | ErrorNode) {
        super(range,"Finally");
        this.block = block;
    }
    public get children(): ASTNode[] {
        return [this.block];
    }
}

// Section 13.16

export class DebuggerStatementNode extends StatementNode {
    _nominal_type_DebuggerStatementNode: any;
    public constructor(range: Range) {
        super(range,"DebuggerStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// // Section 14.1

export class FunctionDeclarationNode extends DeclarationNode {
    _nominal_type_FunctionDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode; // may be null
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode | ErrorNode,
        params: FormalParameterListNode | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"Function");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

export class FunctionExpressionNode extends ExpressionNode {
    _nominal_type_FunctionExpressionNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode; // may be null
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode | ErrorNode,
        params: FormalParameterListNode | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"FunctionExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

// Section 14.2

export class ArrowFunctionNode extends ExpressionNode {
    _nominal_type_ArrowFunctionNode: any;
    public readonly params: BindingIdentifierNode | FormalParameterListNode | ErrorNode;
    public readonly body: ExpressionNode | StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        params: BindingIdentifierNode | FormalParameterListNode | ErrorNode,
        body: ExpressionNode | StatementListNode | ErrorNode
    ) {
        super(range,"ArrowFunction");
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.params,this.body];
    }
}

// Section 14.3

export class MethodNode extends MethodDefinitionNode {
    _nominal_type_MethodNode: any;
    public readonly name: PropertyNameType | ErrorNode;
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        name: PropertyNameType | ErrorNode,
        params: FormalParameterListNode | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"Method");
        this.name = name;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.params,this.body];
    }
}

export class GetterNode extends MethodDefinitionNode {
    _nominal_type_GetterNode: any;
    public readonly name: PropertyNameType | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(range: Range, name: PropertyNameType | ErrorNode, body: StatementListNode | ErrorNode) {
        super(range,"Getter");
        this.name = name;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.body];
    }
}

export class SetterNode extends MethodDefinitionNode {
    _nominal_type_SetterNode: any;
    public readonly name: PropertyNameType | ErrorNode;
    public readonly param: BindingElementType | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        name: PropertyNameType | ErrorNode,
        param: BindingElementType | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"Setter");
        this.name = name;
        this.param = param;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.param,this.body];
    }
}

// Section 14.4

export class GeneratorMethodNode extends MethodDefinitionNode {
    _nominal_type_GeneratorMethodNode: any;
    public readonly name: PropertyNameType | ErrorNode;
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        name: PropertyNameType | ErrorNode,
        params: FormalParameterListNode | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"GeneratorMethod");
        this.name = name;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.params,this.body];
    }
}

export class GeneratorDeclarationNode extends DeclarationNode {
    _nominal_type_GeneratorDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode;
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode | ErrorNode,
        params: FormalParameterListNode | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"GeneratorDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

export class DefaultGeneratorDeclarationNode extends DeclarationNode {
    _nominal_type_DefaultGeneratorDeclarationNode: any;
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(range: Range, params: FormalParameterListNode | ErrorNode, body: StatementListNode | ErrorNode) {
        super(range,"GeneratorDeclaration");
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.params,this.body];
    }
}

export class GeneratorExpressionNode extends ExpressionNode {
    _nominal_type_GeneratorExpressionNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode;
    public readonly params: FormalParameterListNode | ErrorNode;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(
        range: Range,
        ident: BindingIdentifierNode | ErrorNode,
        params: FormalParameterListNode | ErrorNode,
        body: StatementListNode | ErrorNode
    ) {
        super(range,"GeneratorExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

export class YieldExprNode extends ExpressionNode {
    _nominal_type_YieldExprNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"YieldExpr");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class YieldStarNode extends ExpressionNode {
    _nominal_type_YieldStarNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"YieldStar");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class YieldNothingNode extends ExpressionNode {
    _nominal_type_YieldNothingNode: any;
    public constructor(range: Range) {
        super(range,"YieldNothing");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 14.5

export class ClassDeclarationNode extends DeclarationNode {
    _nominal_type_ClassDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode;
    public readonly tail: ClassTailNode | ErrorNode;
    public constructor(range: Range, ident: BindingIdentifierNode | ErrorNode, tail: ClassTailNode | ErrorNode) {
        super(range,"ClassDeclaration");
        this.ident = ident;
        this.tail = tail;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.tail];
    }
}

export class ClassExpressionNode extends ExpressionNode {
    _nominal_type_ClassExpressionNode: any;
    public readonly ident: BindingIdentifierNode | ErrorNode;
    public readonly tail: ClassTailNode | ErrorNode;
    public constructor(range: Range, ident: BindingIdentifierNode | ErrorNode, tail: ClassTailNode | ErrorNode) {
        super(range,"ClassExpression");
        this.ident = ident;
        this.tail = tail;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.tail];
    }
}

export class ClassTailNode extends ASTNode {
    _nominal_type_ClassTailNode: any;
    public readonly heritage: ExtendsNode | ErrorNode;
    public readonly body: ClassElementListNode | ErrorNode;
    public constructor(range: Range, heritage: ExtendsNode | ErrorNode, body: ClassElementListNode | ErrorNode) {
        super(range,"ClassTail");
        this.heritage = heritage;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.heritage,this.body];
    }
}

export class ExtendsNode extends ASTNode {
    _nominal_type_ExtendsNode: any;
    public readonly expr: ExpressionNode | ErrorNode;
    public constructor(range: Range, expr: ExpressionNode | ErrorNode) {
        super(range,"Extends");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class StaticMethodDefinitionNode extends ASTNode {
    _nominal_type_StaticMethodDefinitionNode: any;
    public readonly method: MethodDefinitionNode | ErrorNode;
    public constructor(range: Range, method: MethodDefinitionNode | ErrorNode) {
        super(range,"StaticMethodDefinition");
        this.method = method;
    }
    public get children(): ASTNode[] {
        return [this.method];
    }
}

export class EmptyClassElementNode extends ASTNode {
    _nominal_type_EmptyClassElementNode: any;
    public constructor(range: Range) {
        super(range,"EmptyClassElement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 15.1

export class ScriptNode extends ASTNode {
    _nominal_type_ScriptNode: any;
    public readonly body: StatementListNode | ErrorNode;
    public constructor(range: Range, body: StatementListNode | ErrorNode) {
        super(range,"Script");
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.body];
    }
}

// Section 15.2

export class ModuleNode extends ASTNode {
    _nominal_type_ModuleNode: any;
    public readonly body: ModuleItemListNode | ErrorNode;
    public constructor(range: Range, body: ModuleItemListNode | ErrorNode) {
        super(range,"Module");
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.body];
    }
}

// Section 15.2.2

export class ImportFromNode extends ImportNode {
    _nominal_type_ImportFromNode: any;
    public readonly importClause: ImportClauseNode | ErrorNode;
    public readonly fromClause: StringLiteralNode | ErrorNode;
    public constructor(range: Range, importClause: ImportClauseNode | ErrorNode, fromClause: StringLiteralNode | ErrorNode) {
        super(range,"ImportFrom");
        this.importClause = importClause;
        this.fromClause = fromClause;
    }
    public get children(): ASTNode[] {
        return [this.importClause,this.fromClause];
    }
}

export class ImportModuleNode extends ImportNode {
    _nominal_type_ImportModuleNode: any;
    public readonly specifier: StringLiteralNode | ErrorNode;
    public constructor(range: Range, specifier: StringLiteralNode | ErrorNode) {
        super(range,"ImportModule");
        this.specifier = specifier;
    }
    public get children(): ASTNode[] {
        return [this.specifier];
    }
}

export class DefaultAndNameSpaceImportsNode extends ImportClauseNode {
    _nominal_type_DefaultAndNameSpaceImportsNode: any;
    public readonly defaultBinding: BindingIdentifierNode | ErrorNode;
    public readonly nameSpaceImport: NameSpaceImportNode | ErrorNode;
    public constructor(
        range: Range,
        defaultBinding: BindingIdentifierNode | ErrorNode,
        nameSpaceImport: NameSpaceImportNode | ErrorNode
    ) {
        super(range,"ImportedDefaultBinding");
        this.defaultBinding = defaultBinding;
        this.nameSpaceImport = nameSpaceImport;
    }
    public get children(): ASTNode[] {
        return [this.defaultBinding,this.nameSpaceImport];
    }
}

export class DefaultAndNamedImportsNode extends ImportClauseNode {
    _nominal_type_DefaultAndNamedImportsNode: any;
    public readonly defaultBinding: BindingIdentifierNode | ErrorNode;
    public readonly namedImports: NamedImportsNode | ErrorNode;
    public constructor(
        range: Range,
        defaultBinding: BindingIdentifierNode | ErrorNode,
        namedImports: NamedImportsNode | ErrorNode
    ) {
        super(range,"ImportedDefaultBinding");
        this.defaultBinding = defaultBinding;
        this.namedImports = namedImports;
    }
    public get children(): ASTNode[] {
        return [this.defaultBinding,this.namedImports];
    }
}

export class DefaultImportNode extends ImportClauseNode {
    _nominal_type_DefaultImportNode: any;
    public readonly binding: BindingIdentifierNode | ErrorNode;
    public constructor(range: Range, binding: BindingIdentifierNode | ErrorNode) {
        super(range,"DefaultImport");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class NameSpaceImportNode extends ImportClauseNode {
    _nominal_type_NameSpaceImportNode: any;
    public readonly binding: BindingIdentifierNode | ErrorNode;
    public constructor(range: Range, binding: BindingIdentifierNode | ErrorNode) {
        super(range,"NameSpaceImport");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class NamedImportsNode extends ImportClauseNode {
    _nominal_type_NamedImportsNode: any;
    public readonly imports: ImportsListNode | ErrorNode;
    public constructor(range: Range, imports: ImportsListNode | ErrorNode) {
        super(range,"NamedImports");
        this.imports = imports;
    }
    public get children(): ASTNode[] {
        return [this.imports];
    }
}

export class ImportSpecifierNode extends ASTNode {
    _nominal_type_ImportSpecifierNode: any;
    public readonly binding: BindingIdentifierNode | ErrorNode;
    public constructor(range: Range, binding: BindingIdentifierNode | ErrorNode) {
        super(range,"ImportSpecifier");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class ImportAsSpecifierNode extends ASTNode {
    _nominal_type_ImportAsSpecifierNode: any;
    public readonly name: IdentifierNode | ErrorNode;
    public readonly binding: BindingIdentifierNode | ErrorNode;
    public constructor(range: Range, name: IdentifierNode | ErrorNode, binding: BindingIdentifierNode | ErrorNode) {
        super(range,"ImportAsSpecifier");
        this.name = name;
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.name,this.binding];
    }
}

// Section 15.2.3

export class ExportDefaultNode extends ExportNode {
    _nominal_type_ExportDefaultNode: any;
    public readonly decl: DeclarationNode | ExpressionNode | ErrorNode;
    public constructor(range: Range, decl: DeclarationNode | ExpressionNode | ErrorNode) {
        super(range,"ExportDefault");
        this.decl = decl;
    }
    public get children(): ASTNode[] {
        return [this.decl];
    }
}

export class ExportStarNode extends ExportNode {
    _nominal_type_ExportStarNode: any;
    public readonly from: StringLiteralNode | ErrorNode;
    public constructor(range: Range, from: StringLiteralNode | ErrorNode) {
        super(range,"ExportStar");
        this.from = from;
    }
    public get children(): ASTNode[] {
        return [this.from];
    }
}

export class ExportPlainNode extends ExportNode {
    _nominal_type_ExportPlainNode: any;
    public readonly clause: ExportClauseNode | ErrorNode;
    public constructor(range: Range, clause: ExportClauseNode | ErrorNode) {
        super(range,"ExportPlain");
        this.clause = clause;
    }
    public get children(): ASTNode[] {
        return [this.clause];
    }
}

export class ExportVariableNode extends ExportNode {
    _nominal_type_ExportVariableNode: any;
    public readonly variable: VarNode | ErrorNode;
    public constructor(range: Range, variable: VarNode | ErrorNode) {
        super(range,"ExportVariable");
        this.variable = variable;
    }
    public get children(): ASTNode[] {
        return [this.variable];
    }
}

export class ExportDeclarationNode extends ExportNode {
    _nominal_type_ExportDeclarationNode: any;
    public readonly decl: DeclarationNode | ErrorNode;
    public constructor(range: Range, decl: DeclarationNode | ErrorNode) {
        super(range,"ExportDeclaration");
        this.decl = decl;
    }
    public get children(): ASTNode[] {
        return [this.decl];
    }
}

export class ExportFromNode extends ExportNode {
    _nominal_type_ExportFromNode: any;
    public readonly exportClause: ExportClauseNode | ErrorNode;
    public readonly fromClause: StringLiteralNode | ErrorNode;
    public constructor(
        range: Range,
        exportClause: ExportClauseNode | ErrorNode,
        fromClause: StringLiteralNode | ErrorNode
    ) {
        super(range,"ExportFrom");
        this.exportClause = exportClause;
        this.fromClause = fromClause;
    }
    public get children(): ASTNode[] {
        return [this.exportClause,this.fromClause];
    }
}

export class ExportClauseNode extends ExportNode {
    _nominal_type_ExportClauseNode: any;
    public readonly items: ExportsListNode | ErrorNode;
    public constructor(range: Range, items: ExportsListNode | ErrorNode) {
        super(range,"ExportClause");
        this.items = items;
    }
    public get children(): ASTNode[] {
        return [this.items];
    }
}

export class ExportNormalSpecifierNode extends ASTNode {
    _nominal_type_ExportNormalSpecifierNode: any;
    public readonly ident: IdentifierNode | ErrorNode;
    public constructor(range: Range, ident: IdentifierNode | ErrorNode) {
        super(range,"ExportNormalSpecifier");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

export class ExportAsSpecifierNode extends ASTNode {
    _nominal_type_ExportAsSpecifierNode: any;
    public readonly ident: IdentifierNode | ErrorNode;
    public readonly asIdent: IdentifierNode | ErrorNode;
    public constructor(range: Range, ident: IdentifierNode | ErrorNode, asIdent: IdentifierNode | ErrorNode) {
        super(range,"ExportAsSpecifier");
        this.ident = ident;
        this.asIdent = asIdent;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.asIdent];
    }
}

export class StatementListNode extends ASTNode {
    _nominal_type_StatementListNode: any;
    public readonly elements: (StatementNode | DeclarationNode | ErrorNode)[];
    public constructor(range: Range, elements: (StatementNode | DeclarationNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class PropertyDefinitionListNode extends ASTNode {
    _nominal_type_PropertyDefinitionListNode: any;
    public readonly elements: (PropertyDefinitionType | ErrorNode)[];
    public constructor(range: Range, elements: (PropertyDefinitionType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class ArgumentListNode extends ASTNode {
    _nominal_type_ArgumentListNode: any;
    public readonly elements: (ArgumentType | ErrorNode)[];
    public constructor(range: Range, elements: (ArgumentType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class BindingListNode extends ASTNode {
    _nominal_type_BindingListNode: any;
    public readonly elements: (LexicalBindingNode | ErrorNode)[];
    public constructor(range: Range, elements: (LexicalBindingNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class VariableDeclarationListNode extends ASTNode {
    _nominal_type_VariableDeclarationListNode: any;
    public readonly elements: (VarIdentifierNode | VarPatternNode | ErrorNode)[];
    public constructor(range: Range, elements: (VarIdentifierNode | VarPatternNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class CaseClauseListNode extends ASTNode {
    _nominal_type_CaseClauseListNode: any;
    public readonly elements: (CaseClauseNode | DefaultClauseNode | ErrorNode)[];
    public constructor(range: Range, elements: (CaseClauseNode | DefaultClauseNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class FormalParameterListNode extends ASTNode {
    _nominal_type_FormalParameterListNode: any;
    public readonly elements: (BindingElementType | BindingRestElementNode | ErrorNode)[];
    public constructor(range: Range, elements: (BindingElementType | BindingRestElementNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class ModuleItemListNode extends ASTNode {
    _nominal_type_ModuleItemListNode: any;
    public readonly elements: (ModuleItemType | ErrorNode)[];
    public constructor(range: Range, elements: (ModuleItemType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class ImportsListNode extends ASTNode {
    _nominal_type_ImportsListNode: any;
    public readonly elements: (ImportAsSpecifierNode | ImportSpecifierNode | ErrorNode)[];
    public constructor(range: Range, elements: (ImportAsSpecifierNode | ImportSpecifierNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class ExportsListNode extends ASTNode {
    _nominal_type_ExportsListNode: any;
    public readonly elements: (ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode)[];
    public constructor(range: Range, elements: (ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class BindingPropertyListNode extends ASTNode {
    _nominal_type_BindingPropertyListNode: any;
    public readonly elements: (BindingPropertyType | ErrorNode)[];
    public constructor(range: Range, elements: (BindingPropertyType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class ElementListNode extends ASTNode {
    _nominal_type_ElementListNode: any;
    public readonly elements: (ArrayLiteralItemType | ErrorNode)[];
    public constructor(range: Range, elements: (ArrayLiteralItemType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class BindingElementListNode extends ASTNode {
    _nominal_type_BindingElementListNode: any;
    public readonly elements: (BindingElementType | ErrorNode)[];
    public constructor(range: Range, elements: (BindingElementType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return this.elements;
    }
}

export class ClassElementListNode extends ASTNode {
    _nominal_type_ClassElementListNode: any;
    public readonly elements: (ClassElementType | ErrorNode)[];
    public constructor(range: Range, elements: (ClassElementType | ErrorNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
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
    public get children(): ASTNode[] {
        return [];
    }
    public get label(): string {
        return "ERROR: "+this.message;
    }
}

export class GenericNode extends ErrorNode {
    _nominal_type_GenericNode: any ;
    public readonly kind: string;
    public readonly _children: ASTNode[];
    public readonly value: any;
    public constructor(range: Range, kind: string, children: any[], value?: any) {
        super(range,"GenericNode");
        this.kind = kind;
        this._children = [];
        for (const child of children) {
            if ((child !== null) && !(child instanceof ASTNode))
                throw new Error(kind+": "+child+" is not an ASTNode");
            this._children.push(child);
        }
        this.value = value;
    }
    public get children(): ASTNode[] {
        return this._children;
    }
    public get label(): string {
        return this.kind;
    }
}

export class ListNode extends GenericNode {
    _nominal_type_ListNode: any;
    public constructor(range: Range, elements: ASTNode[]) {
        super(range,"[]",elements);
    }
}
