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


export class BinaryNode extends ASTNode {
    _nominal_type_BinaryNode: any;
    public readonly left: ASTNode;
    public readonly right: ASTNode;
    public readonly _children: ASTNode[];
    public constructor(range: Range, kind: string, left: ASTNode, right: ASTNode) {
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

export class IdentifierReferenceNode extends ASTNode {
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

export class ThisNode extends ASTNode {
    _nominal_type_ThisNode: any;
    public constructor(range: Range) {
        super(range,"This");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class CoverExpr1Node extends ASTNode {
    _nominal_type_CoverExpr1Node: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"CoverExpr1");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class CoverExpr2Node extends ASTNode {
    _nominal_type_CoverExpr2Node: any;
    public constructor(range: Range) {
        super(range,"CoverExpr2");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class CoverExpr3Node extends ASTNode {
    _nominal_type_CoverExpr3Node: any;
    public readonly ident: ASTNode;
    public constructor(range: Range, ident: ASTNode) {
        super(range,"CoverExpr3");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

export class CoverExpr4Node extends ASTNode {
    _nominal_type_CoverExpr4Node: any;
    public readonly expr: ASTNode;
    public readonly ident: ASTNode;
    public constructor(range: Range, expr: ASTNode, ident: ASTNode) {
        super(range,"CoverExpr4");
        this.expr = expr;
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.ident];
    }
}

export class NullLiteralNode extends ASTNode {
    _nominal_type_NullLiteralNode: any;
    public constructor(range: Range) {
        super(range,"NullLiteral");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class BooleanLiteralNode extends ASTNode {
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

export class NumericLiteralNode extends ASTNode {
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
export class StringLiteralNode extends ASTNode {
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

export class ArrayLiteralNode extends ASTNode {
    _nominal_type_ArrayLiteralNode: any;
    private readonly elements: ASTNode;
    public constructor(range: Range, elements: ASTNode) {
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
    public readonly child: ASTNode;
    public constructor(range: Range, child: ASTNode) {
        super(range,"SpreadElement");
        this.child = child;
    }
    public get children(): ASTNode[] {
        return [this.child];
    }
}

// Section 12.2.6

export class ObjectLiteralNode extends ASTNode {
    _nominal_type_ObjectLiteralNode: any;
    public readonly properties: ASTNode;
    public constructor(range: Range, properties: ASTNode) {
        super(range,"ObjectLiteral");
        this.properties = properties;
    }
    public get children(): ASTNode[] {
        return [this.properties];
    }
}

export class ColonPropertyDefinitionNode extends ASTNode {
    _nominal_type_ColonPropertyDefinitionNode: any;
    public readonly name: ASTNode;
    public readonly init: ASTNode;
    public constructor(range: Range, name: ASTNode, init: ASTNode) {
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
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"ComputedPropertyName");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class CoverInitializedNameNode extends ASTNode {
    _nominal_type_CoverInitializedNameNode: any;
    public readonly ident: ASTNode;
    public readonly init: ASTNode;
    public constructor(range: Range, ident: ASTNode, init: ASTNode) {
        super(range,"CoverInitializedName");
        this.ident = ident;
        this.init = init;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.init];
    }
}

// Section 12.3

export class MemberAccessExprNode extends ASTNode {
    _nominal_type_MemberAccessExprNode: any;
    public readonly obj: ASTNode;
    public readonly expr: ASTNode;
    public constructor(range: Range, obj: ASTNode, expr: ASTNode) {
        super(range,"MemberAccessExpr");
        this.obj = obj;
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.obj,this.expr];
    }
}

export class MemberAccessIdentNode extends ASTNode {
    _nominal_type_MemberAccessIdentNode: any;
    public readonly obj: ASTNode;
    public readonly ident: ASTNode;
    public constructor(range: Range, obj: ASTNode, ident: ASTNode) {
        super(range,"MemberAccessIdent");
        this.obj = obj;
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.obj,this.ident];
    }
}

export class SuperPropertyExprNode extends ASTNode {
    _nominal_type_SuperPropertyExprNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"SuperPropertyExpr");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class SuperPropertyIdentNode extends ASTNode {
    _nominal_type_SuperPropertyIdentNode: any;
    public readonly ident: ASTNode;
    public constructor(range: Range, ident: ASTNode) {
        super(range,"SuperPropertyIdent");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

export class NewTargetNode extends ASTNode {
    _nominal_type_NewTargetNode: any;
    public constructor(range: Range) {
        super(range,"NewTarget");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class NewExpressionNode extends ASTNode {
    _nominal_type_NewExpressionNode: any;
    public readonly expr: ASTNode;
    public readonly args: ASTNode;
    public constructor(range: Range, expr: ASTNode, args: ASTNode) {
        super(range,"NewExpression");
        this.expr = expr;
        this.args = args;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.args];
    }
}

export class CallNode extends ASTNode {
    _nominal_type_CallNode: any;
    public readonly fun: ASTNode;
    public readonly args: ASTNode;
    public constructor(range: Range, fun: ASTNode, args: ASTNode) {
        super(range,"Call");
        this.fun = fun;
        this.args = args;
    }
    public get children(): ASTNode[] {
        return [this.fun,this.args];
    }
}

export class SuperCallNode extends ASTNode {
    _nominal_type_SuperCallNode: any;
    public readonly args: ASTNode;
    public constructor(range: Range, args: ASTNode) {
        super(range,"SuperCall");
        this.args = args;
    }
    public get children(): ASTNode[] {
        return [this.args];
    }
}

export class ArgumentsNode extends ASTNode {
    _nominal_type_ArgumentsNode: any;
    public readonly items: ASTNode;
    public constructor(range: Range, items: ASTNode) {
        super(range,"Arguments");
        this.items = items;
    }
    public get children(): ASTNode[] {
        return [this.items];
    }
}

// Section 12.4

export class PostIncrementNode extends ASTNode {
    _nominal_type_PostIncrementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"PostIncrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class PostDecrementNode extends ASTNode {
    _nominal_type_PostDecrementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"PostDecrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 12.5

export class DeleteNode extends ASTNode {
    _nominal_type_DeleteNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"Delete");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class VoidNode extends ASTNode {
    _nominal_type_VoidNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"Void");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class TypeOfNode extends ASTNode {
    _nominal_type_TypeOfNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"TypeOf");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class PreIncrementNode extends ASTNode {
    _nominal_type_PreIncrementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"PreIncrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class PreDecrementNode extends ASTNode {
    _nominal_type_PreDecrementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"PreDecrement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryPlusNode extends ASTNode {
    _nominal_type_UnaryPlusNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"UnaryPlus");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryMinusNode extends ASTNode {
    _nominal_type_UnaryMinusNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"UnaryMinus");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryBitwiseNotNode extends ASTNode {
    _nominal_type_UnaryBitwiseNotNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"UnaryBitwiseNot");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class UnaryLogicalNotNode extends ASTNode {
    _nominal_type_UnaryLogicalNotNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
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
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Multiply",left,right);
    }
}

export class DivideNode extends BinaryNode {
    _nominal_type_DivideNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Divide",left,right);
    }
}

export class ModuloNode extends BinaryNode {
    _nominal_type_ModuloNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Modulo",left,right);
    }
}

// Section 12.7

export class AddNode extends BinaryNode {
    _nominal_type_AddNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Add",left,right);
    }
}

export class SubtractNode extends BinaryNode {
    _nominal_type_SubtractNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Subtract",left,right);
    }
}

// Section 12.8

export class LeftShiftNode extends BinaryNode {
    _nominal_type_LeftShiftNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LeftShift",left,right);
    }
}

export class SignedRightShiftNode extends BinaryNode {
    _nominal_type_SignedRightShiftNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"SignedRightShift",left,right);
    }
}

export class UnsignedRightShiftNode extends BinaryNode {
    _nominal_type_UnsignedRightShiftNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"UnsignedRightShift",left,right);
    }
}

// Section 12.9

export class LessThanNode extends BinaryNode {
    _nominal_type_LessThanNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LessThan",left,right);
    }
}

export class GreaterThanNode extends BinaryNode {
    _nominal_type_GreaterThanNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"GreaterThan",left,right);
    }
}

export class LessEqualNode extends BinaryNode {
    _nominal_type_LessEqualNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LessEqual",left,right);
    }
}

export class GreaterEqualNode extends BinaryNode {
    _nominal_type_GreaterEqualNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"GreaterEqual",left,right);
    }
}

export class InstanceOfNode extends BinaryNode {
    _nominal_type_InstanceOfNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"InstanceOf",left,right);
    }
}

export class InNode extends BinaryNode {
    _nominal_type_InNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"In",left,right);
    }
}

// Section 12.10

export class AbstractEqualsNode extends BinaryNode {
    _nominal_type_AbstractEqualsNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AbstractEquals",left,right);
    }
}

export class AbstractNotEqualsNode extends BinaryNode {
    _nominal_type_AbstractNotEqualsNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AbstractNotEquals",left,right);
    }
}

export class StrictEqualsNode extends BinaryNode {
    _nominal_type_StrictEqualsNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"StrictEquals",left,right);
    }
}

export class StrictNotEqualsNode extends BinaryNode {
    _nominal_type_StrictNotEqualsNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"StrictNotEquals",left,right);
    }
}

// Section 12.11

export class BitwiseANDNode extends BinaryNode {
    _nominal_type_BitwiseANDNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"BitwiseAND",left,right);
    }
}

export class BitwiseXORNode extends BinaryNode {
    _nominal_type_BitwiseXORNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"BitwiseXOR",left,right);
    }
}

export class BitwiseORNode extends BinaryNode {
    _nominal_type_BitwiseORNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"BitwiseOR",left,right);
    }
}

// Section 12.12

export class LogicalANDNode extends BinaryNode {
    _nominal_type_LogicalANDNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LogicalAND",left,right);
    }
}

export class LogicalORNode extends BinaryNode {
    _nominal_type_LogicalORNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LogicalORNode",left,right);
    }
}

// Section 12.13

export class ConditionalNode extends ASTNode {
    _nominal_type_ConditionalNode: any;
    public readonly condition: ASTNode;
    public readonly trueExpr: ASTNode;
    public readonly falseExpr: ASTNode;
    public constructor(range: Range, condition: ASTNode, trueExpr: ASTNode, falseExpr: ASTNode) {
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
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Assign",left,right);
    }
}

export class AssignMultiplyNode extends BinaryNode {
    _nominal_type_AssignMultiplyNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignMultiply",left,right);
    }
}

export class AssignDivideNode extends BinaryNode {
    _nominal_type_AssignDivideNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignDivide",left,right);
    }
}

export class AssignModuloNode extends BinaryNode {
    _nominal_type_AssignModuloNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignModulo",left,right);
    }
}

export class AssignAddNode extends BinaryNode {
    _nominal_type_AssignAddNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignAdd",left,right);
    }
}

export class AssignSubtractNode extends BinaryNode {
    _nominal_type_AssignSubtractNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignSubtract",left,right);
    }
}

export class AssignLeftShiftNode extends BinaryNode {
    _nominal_type_AssignLeftShiftNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignLeftShift",left,right);
    }
}

export class AssignSignedRightShiftNode extends BinaryNode {
    _nominal_type_AssignSignedRightShiftNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignSignedRightShift",left,right);
    }
}

export class AssignUnsignedRightShiftNode extends BinaryNode {
    _nominal_type_AssignUnsignedRightShiftNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignUnsignedRightShift",left,right);
    }
}

export class AssignBitwiseANDNode extends BinaryNode {
    _nominal_type_AssignBitwiseANDNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignBitwiseAND",left,right);
    }
}

export class AssignBitwiseXORNode extends BinaryNode {
    _nominal_type_AssignBitwiseXORNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignBitwiseXOR",left,right);
    }
}

export class AssignBitwiseORNode extends BinaryNode {
    _nominal_type_AssignBitwiseORNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignBitwiseOR",left,right);
    }
}


// Section 12.15

export class CommaNode extends BinaryNode {
    _nominal_type_CommaNode: any;
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Comma",left,right);
    }
}

// Section 13

export class BlockNode extends ASTNode {
    _nominal_type_BlockNode: any;
    public statements: ASTNode;
    public constructor(range: Range, statements: ASTNode) {
        super(range,"Block");
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return [this.statements];
    }
}

// Section 13.3.1

export class LetNode extends ASTNode {
    _nominal_type_LetNode: any;
    public bindings: ASTNode;
    public constructor(range: Range, bindings: ASTNode) {
        super(range,"Let");
        this.bindings = bindings;
    }
    public get children(): ASTNode[] {
        return [this.bindings];
    }
}

export class ConstNode extends ASTNode {
    _nominal_type_ConstNode: any;
    public bindings: ASTNode;
    public constructor(range: Range, bindings: ASTNode) {
        super(range,"Const");
        this.bindings = bindings;
    }
    public get children(): ASTNode[] {
        return [this.bindings];
    }
}

export class LexicalIdentifierBindingNode extends ASTNode {
    _nominal_type_LexicalIdentifierBindingNode: any;
    public identifier: ASTNode;
    public initializer: ASTNode;
    public constructor(range: Range, identifier: ASTNode, initializer: ASTNode) {
        super(range,"LexicalIdentifierBinding");
        this.identifier = identifier;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.identifier,this.initializer];
    }
}

export class LexicalPatternBindingNode extends ASTNode {
    _nominal_type_LexicalPatternBindingNode: any;
    public pattern: ASTNode;
    public initializer: ASTNode;
    public constructor(range: Range, pattern: ASTNode, initializer: ASTNode) {
        super(range,"LexicalPatternBinding");
        this.pattern = pattern;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.pattern,this.initializer];
    }
}

// Section 13.3.2

export class VarNode extends ASTNode {
    _nominal_type_VarNode: any;
    public declarations: ASTNode;
    public constructor(range: Range, declarations: ASTNode) {
        super(range,"Var");
        this.declarations = declarations;
    }
    public get children(): ASTNode[] {
        return [this.declarations];
    }
}

export class VarIdentifierNode extends ASTNode {
    _nominal_type_VarIdentifierNode: any;
    public identifier: ASTNode;
    public initializer: ASTNode;
    public constructor(range: Range, identifier: ASTNode, initializer: ASTNode) {
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
    public pattern: ASTNode;
    public initializer: ASTNode;
    public constructor(range: Range, pattern: ASTNode, initializer: ASTNode) {
        super(range,"VarPattern");
        this.pattern = pattern;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.pattern,this.initializer];
    }
}

// Section 13.3.3

export class ObjectBindingPatternNode extends ASTNode {
    _nominal_type_ObjectBindingPatternNode: any;
    public readonly properties: ASTNode;
    public constructor(range: Range, properties: ASTNode) {
        super(range,"ObjectBindingPattern");
        this.properties = properties;
    }
    public get children(): ASTNode[] {
        return [this.properties];
    }
}

export class ArrayBindingPatternNode extends ASTNode {
    _nominal_type_ArrayBindingPatternNode: any;
    public readonly elements: ASTNode;
    public constructor(range: Range, elements: ASTNode) {
        super(range,"ArrayBindingPattern");
        this.elements = elements;
    }
    public get children(): ASTNode[] {
        return [this.elements];
    }
}

export class BindingElisionElementNode extends ASTNode {
    _nominal_type_BindingElisionElementNode: any;
    public readonly elision: ASTNode;
    public readonly element: ASTNode;
    public constructor(range: Range, elision: ASTNode, element: ASTNode) {
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
    public readonly name: ASTNode;
    public readonly element: ASTNode;
    public constructor(range: Range, name: ASTNode, element: ASTNode) {
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
    public readonly pattern: ASTNode;
    public readonly init: ASTNode;
    public constructor(range: Range, pattern: ASTNode, init: ASTNode) {
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
    public readonly ident: ASTNode;
    public readonly init: ASTNode;
    public constructor(range: Range, ident: ASTNode, init: ASTNode) {
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
    public readonly ident: ASTNode;
    public constructor(range: Range, ident: ASTNode) {
        super(range,"BindingRestElement");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

// Section 13.4

export class EmptyStatementNode extends ASTNode {
    _nominal_type_EmptyStatementNode: any;
    public constructor(range: Range) {
        super(range,"EmptyStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 13.5

export class ExpressionStatementNode extends ASTNode {
    _nominal_type_ExpressionStatementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"ExpressionStatement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 13.6

export class IfStatementNode extends ASTNode {
    _nominal_type_IfStatementNode: any;
    public readonly condition: ASTNode;
    public readonly trueBranch: ASTNode;
    public readonly falseBranch: ASTNode;
    public constructor(range: Range, condition: ASTNode, trueBranch: ASTNode, falseBranch: ASTNode) {
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

export class DoStatementNode extends ASTNode {
    _nominal_type_DoStatementNode: any;
    public readonly body: ASTNode;
    public readonly condition: ASTNode;
    public constructor(range: Range, body: ASTNode, condition: ASTNode) {
        super(range,"DoStatement");
        this.body = body;
        this.condition = condition;
    }
    public get children(): ASTNode[] {
        return [this.body,this.condition];
    }
}

export class WhileStatementNode extends ASTNode {
    _nominal_type_WhileStatementNode: any;
    public readonly body: ASTNode;
    public readonly condition: ASTNode;
    public constructor(range: Range, condition: ASTNode, body: ASTNode) {
        super(range,"WhileStatement");
        this.condition = condition;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.condition,this.body];
    }
}

export class ForCNode extends ASTNode {
    _nominal_type_ForCNode: any;
    public readonly init: ASTNode;
    public readonly condition: ASTNode;
    public readonly update: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, init: ASTNode, condition: ASTNode, update: ASTNode, body: ASTNode) {
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

export class ForInNode extends ASTNode {
    _nominal_type_ForInNode: any;
    public readonly binding: ASTNode;
    public readonly expr: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, binding: ASTNode, expr: ASTNode, body: ASTNode) {
        super(range,"ForIn");
        this.binding = binding;
        this.expr = expr;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.binding,this.expr,this.body];
    }
}

export class ForOfNode extends ASTNode {
    _nominal_type_ForOfNode: any;
    public readonly binding: ASTNode;
    public readonly expr: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, binding: ASTNode, expr: ASTNode, body: ASTNode) {
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
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"VarForDeclaration");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class LetForDeclarationNode extends ASTNode {
    _nominal_type_LetForDeclarationNode: any;
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"LetForDeclaration");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class ConstForDeclarationNode extends ASTNode {
    _nominal_type_ConstForDeclarationNode: any;
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"ConstForDeclaration");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}


// Section 13.8

export class ContinueStatementNode extends ASTNode {
    _nominal_type_ContinueStatementNode: any;
    public readonly labelIdentifier: ASTNode;
    public constructor(range: Range, labelIdentifier: ASTNode) {
        super(range,"ContinueStatement");
        this.labelIdentifier = labelIdentifier;
    }
    public get children(): ASTNode[] {
        return [this.labelIdentifier];
    }
}

// Section 13.9

export class BreakStatementNode extends ASTNode {
    _nominal_type_BreakStatementNode: any;
    public readonly labelIdentifier: ASTNode;
    public constructor(range: Range, labelIdentifier: ASTNode) {
        super(range,"BreakStatement");
        this.labelIdentifier = labelIdentifier;
    }
    public get children(): ASTNode[] {
        return [this.labelIdentifier];
    }
}

// Section 13.10

export class ReturnStatementNode extends ASTNode {
    _nominal_type_ReturnStatementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"ReturnStatement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 13.11

export class WithStatementNode extends ASTNode {
    _nominal_type_WithStatementNode: any;
    public expr: ASTNode;
    public body: ASTNode;
    public constructor(range: Range, expr: ASTNode, body: ASTNode) {
        super(range,"WithStatement");
        this.expr = expr;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.expr,this.body];
    }
}

// Section 13.12

export class SwitchStatementNode extends ASTNode {
    _nominal_type_SwitchStatementNode: any;
    public readonly expr: ASTNode;
    public readonly cases: ASTNode;
    public constructor(range: Range, expr: ASTNode, cases: ASTNode) {
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
    public readonly expr: ASTNode;
    public readonly statements: ASTNode;
    public constructor(range: Range, expr: ASTNode, statements: ASTNode) {
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
    public readonly statements: ASTNode;
    public constructor(range: Range, statements: ASTNode) {
        super(range,"DefaultClause");
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return [this.statements];
    }
}

// Section 13.13

export class LabelledStatementNode extends ASTNode {
    _nominal_type_LabelledStatementNode: any;
    public readonly ident: ASTNode;
    public readonly item: ASTNode;
    public constructor(range: Range, ident: ASTNode, item: ASTNode) {
        super(range,"LabelledStatement");
        this.ident = ident;
        this.item = item;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.item];
    }
}

// Section 13.14

export class ThrowStatementNode extends ASTNode {
    _nominal_type_ThrowStatementNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"ThrowStatement");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

// Section 13.15

export class TryStatementNode extends ASTNode {
    _nominal_type_TryStatementNode: any;
    public tryNode: ASTNode;
    public catchNode: ASTNode;
    public finallyNode: ASTNode;
    public constructor(range: Range, tryNode: ASTNode, catchNode: ASTNode, finallyNode: ASTNode) {
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
    public readonly param: ASTNode;
    public readonly block: ASTNode;
    public constructor(range: Range, param: ASTNode, block: ASTNode) {
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
    public readonly block: ASTNode;
    public constructor(range: Range, block: ASTNode) {
        super(range,"Finally");
        this.block = block;
    }
    public get children(): ASTNode[] {
        return [this.block];
    }
}

// Section 13.16

export class DebuggerStatementNode extends ASTNode {
    _nominal_type_DebuggerStatementNode: any;
    public constructor(range: Range) {
        super(range,"DebuggerStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// // Section 14.1

export class FunctionDeclarationNode extends ASTNode {
    _nominal_type_FunctionDeclarationNode: any;
    public readonly ident: ASTNode; // may be null
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, ident: ASTNode, params: ASTNode, body: ASTNode) {
        super(range,"Function");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

export class FunctionExpressionNode extends ASTNode {
    _nominal_type_FunctionExpressionNode: any;
    public readonly ident: ASTNode; // may be null
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, ident: ASTNode, params: ASTNode, body: ASTNode) {
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

export class ArrowFunctionNode extends ASTNode {
    _nominal_type_ArrowFunctionNode: any;
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, params: ASTNode, body: ASTNode) {
        super(range,"ArrowFunction");
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.params,this.body];
    }
}

// Section 14.3

export class MethodNode extends ASTNode {
    _nominal_type_MethodNode: any;
    public readonly name: ASTNode;
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, name: ASTNode, params: ASTNode, body: ASTNode) {
        super(range,"Method");
        this.name = name;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.params,this.body];
    }
}

export class GetterNode extends ASTNode {
    _nominal_type_GetterNode: any;
    public readonly name: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, name: ASTNode, body: ASTNode) {
        super(range,"Getter");
        this.name = name;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.body];
    }
}

export class SetterNode extends ASTNode {
    _nominal_type_SetterNode: any;
    public readonly name: ASTNode;
    public readonly param: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, name: ASTNode, param: ASTNode, body: ASTNode) {
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

export class GeneratorMethodNode extends ASTNode {
    _nominal_type_GeneratorMethodNode: any;
    public readonly name: ASTNode;
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, name: ASTNode, params: ASTNode, body: ASTNode) {
        super(range,"GeneratorMethod");
        this.name = name;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.name,this.params,this.body];
    }
}

export class GeneratorDeclarationNode extends ASTNode {
    _nominal_type_GeneratorDeclarationNode: any;
    public readonly ident: ASTNode;
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, ident: ASTNode, params: ASTNode, body: ASTNode) {
        super(range,"GeneratorDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

export class DefaultGeneratorDeclarationNode extends ASTNode {
    _nominal_type_DefaultGeneratorDeclarationNode: any;
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, params: ASTNode, body: ASTNode) {
        super(range,"GeneratorDeclaration");
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.params,this.body];
    }
}

export class GeneratorExpressionNode extends ASTNode {
    _nominal_type_GeneratorExpressionNode: any;
    public readonly ident: ASTNode;
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, ident: ASTNode, params: ASTNode, body: ASTNode) {
        super(range,"GeneratorExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

export class YieldExprNode extends ASTNode {
    _nominal_type_YieldExprNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"YieldExpr");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class YieldStarNode extends ASTNode {
    _nominal_type_YieldStarNode: any;
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"YieldStar");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class YieldNothingNode extends ASTNode {
    _nominal_type_YieldNothingNode: any;
    public constructor(range: Range) {
        super(range,"YieldNothing");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 14.5

export class ClassDeclarationNode extends ASTNode {
    _nominal_type_ClassDeclarationNode: any;
    public readonly ident: ASTNode;
    public readonly tail: ASTNode;
    public constructor(range: Range, ident: ASTNode, tail: ASTNode) {
        super(range,"ClassDeclaration");
        this.ident = ident;
        this.tail = tail;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.tail];
    }
}

export class ClassExpressionNode extends ASTNode {
    _nominal_type_ClassExpressionNode: any;
    public readonly ident: ASTNode;
    public readonly tail: ASTNode;
    public constructor(range: Range, ident: ASTNode, tail: ASTNode) {
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
    public readonly heritage: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, heritage: ASTNode, body: ASTNode) {
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
    public readonly expr: ASTNode;
    public constructor(range: Range, expr: ASTNode) {
        super(range,"Extends");
        this.expr = expr;
    }
    public get children(): ASTNode[] {
        return [this.expr];
    }
}

export class StaticMethodDefinitionNode extends ASTNode {
    _nominal_type_StaticMethodDefinitionNode: any;
    public readonly method: ASTNode;
    public constructor(range: Range, method: ASTNode) {
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
    public readonly body: ASTNode;
    public constructor(range: Range, body: ASTNode) {
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
    public readonly body: ASTNode;
    public constructor(range: Range, body: ASTNode) {
        super(range,"Module");
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.body];
    }
}

// Section 15.2.2

export class ImportFromNode extends ASTNode {
    _nominal_type_ImportFromNode: any;
    public readonly importClause: ASTNode;
    public readonly fromClause: ASTNode;
    public constructor(range: Range, importClause: ASTNode, fromClause: ASTNode) {
        super(range,"ImportFrom");
        this.importClause = importClause;
        this.fromClause = fromClause;
    }
    public get children(): ASTNode[] {
        return [this.importClause,this.fromClause];
    }
}

export class ImportModuleNode extends ASTNode {
    _nominal_type_ImportModuleNode: any;
    public readonly specifier: ASTNode;
    public constructor(range: Range, specifier: ASTNode) {
        super(range,"ImportModule");
        this.specifier = specifier;
    }
    public get children(): ASTNode[] {
        return [this.specifier];
    }
}

export class DefaultAndNameSpaceImportsNode extends ASTNode {
    _nominal_type_DefaultAndNameSpaceImportsNode: any;
    public readonly defaultBinding: ASTNode;
    public readonly nameSpaceImport: ASTNode;
    public constructor(range: Range, defaultBinding: ASTNode, nameSpaceImport: ASTNode) {
        super(range,"ImportedDefaultBinding");
        this.defaultBinding = defaultBinding;
        this.nameSpaceImport = nameSpaceImport;
    }
    public get children(): ASTNode[] {
        return [this.defaultBinding,this.nameSpaceImport];
    }
}

export class DefaultAndNamedImportsNode extends ASTNode {
    _nominal_type_DefaultAndNamedImportsNode: any;
    public readonly defaultBinding: ASTNode;
    public readonly namedImports: ASTNode;
    public constructor(range: Range, defaultBinding: ASTNode, namedImports: ASTNode) {
        super(range,"ImportedDefaultBinding");
        this.defaultBinding = defaultBinding;
        this.namedImports = namedImports;
    }
    public get children(): ASTNode[] {
        return [this.defaultBinding,this.namedImports];
    }
}

export class DefaultImportNode extends ASTNode {
    _nominal_type_DefaultImportNode: any;
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"DefaultImport");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class NameSpaceImportNode extends ASTNode {
    _nominal_type_NameSpaceImportNode: any;
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"NameSpaceImport");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class NamedImportsNode extends ASTNode {
    _nominal_type_NamedImportsNode: any;
    public readonly imports: ASTNode;
    public constructor(range: Range, imports: ASTNode) {
        super(range,"NamedImports");
        this.imports = imports;
    }
    public get children(): ASTNode[] {
        return [this.imports];
    }
}

export class ImportNormalSpecifierNode extends ASTNode {
    _nominal_type_ImportNormalSpecifierNode: any;
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"ImportNormalSpecifier");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class ImportSpecifierNode extends ASTNode {
    _nominal_type_ImportSpecifierNode: any;
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"ImportSpecifier");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class ImportAsSpecifierNode extends ASTNode {
    _nominal_type_ImportAsSpecifierNode: any;
    public readonly name: ASTNode;
    public readonly binding: ASTNode;
    public constructor(range: Range, name: ASTNode, binding: ASTNode) {
        super(range,"ImportAsSpecifier");
        this.name = name;
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.name,this.binding];
    }
}

// Section 15.2.3

export class ExportDefaultNode extends ASTNode {
    _nominal_type_ExportDefaultNode: any;
    public readonly decl: ASTNode;
    public constructor(range: Range, decl: ASTNode) {
        super(range,"ExportDefault");
        this.decl = decl;
    }
    public get children(): ASTNode[] {
        return [this.decl];
    }
}

export class ExportStarNode extends ASTNode {
    _nominal_type_ExportStarNode: any;
    public readonly from: ASTNode;
    public constructor(range: Range, from: ASTNode) {
        super(range,"ExportStar");
        this.from = from;
    }
    public get children(): ASTNode[] {
        return [this.from];
    }
}

export class ExportVariableNode extends ASTNode {
    _nominal_type_ExportVariableNode: any;
    public readonly variable: ASTNode;
    public constructor(range: Range, variable: ASTNode) {
        super(range,"ExportVariable");
        this.variable = variable;
    }
    public get children(): ASTNode[] {
        return [this.variable];
    }
}

export class ExportDeclarationNode extends ASTNode {
    _nominal_type_ExportDeclarationNode: any;
    public readonly decl: ASTNode;
    public constructor(range: Range, decl: ASTNode) {
        super(range,"ExportDeclaration");
        this.decl = decl;
    }
    public get children(): ASTNode[] {
        return [this.decl];
    }
}

export class ExportFromNode extends ASTNode {
    _nominal_type_ExportFromNode: any;
    public readonly exportClause: ASTNode;
    public readonly fromClause: ASTNode;
    public constructor(range: Range, exportClause: ASTNode, fromClause: ASTNode) {
        super(range,"ExportFrom");
        this.exportClause = exportClause;
        this.fromClause = fromClause;
    }
    public get children(): ASTNode[] {
        return [this.exportClause,this.fromClause];
    }
}

export class ExportClauseNode extends ASTNode {
    _nominal_type_ExportClauseNode: any;
    public readonly items: ASTNode;
    public constructor(range: Range, items: ASTNode) {
        super(range,"ExportClause");
        this.items = items;
    }
    public get children(): ASTNode[] {
        return [this.items];
    }
}

export class ExportNormalSpecifierNode extends ASTNode {
    _nominal_type_ExportNormalSpecifierNode: any;
    public readonly ident: ASTNode;
    public constructor(range: Range, ident: ASTNode) {
        super(range,"ExportNormalSpecifier");
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.ident];
    }
}

export class ExportAsSpecifierNode extends ASTNode {
    _nominal_type_ExportAsSpecifierNode: any;
    public readonly ident: ASTNode;
    public readonly asIdent: ASTNode;
    public constructor(range: Range, ident: ASTNode, asIdent: ASTNode) {
        super(range,"ExportAsSpecifier");
        this.ident = ident;
        this.asIdent = asIdent;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.asIdent];
    }
}

export class ListNode extends ASTNode {
    _nominal_type_ListNode: any;
    public readonly elements: ASTNode[];
    public constructor(range: Range, elements: ASTNode[]) {
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
