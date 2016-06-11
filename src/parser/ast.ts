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
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"IdentifierReference");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class BindingIdentifierNode extends ASTNode {
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"BindingIdentifier");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class LabelIdentifierNode extends ASTNode {
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"LabelIdentifier");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class IdentifierNode extends ASTNode {
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"Identifier");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 12.2

export class ThisNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"This");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// // TODO
// export class CoverParenthesizedExpressionAndArrowParameterListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"CoverParenthesizedExpressionAndArrowParameterList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ParenthesizedExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ParenthesizedExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 12.2.4
//
// TODO

export class NullLiteralNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"NullLiteral");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class BooleanLiteralNode extends ASTNode {
    public readonly value: boolean;
    public constructor(range: Range, value: boolean) {
        super(range,"BooleanLiteral");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class NumericLiteralNode extends ASTNode {
    public readonly value: number;
    public constructor(range: Range, value: number) {
        super(range,"NumericLiteral");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}
export class StringLiteralNode extends ASTNode {
    public readonly value: string;
    public constructor(range: Range, value: string) {
        super(range,"StringLiteral");
        this.value = value;
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// // Section 12.2.5

export class ArrayLiteralNode extends ASTNode {
    private readonly contents: ASTNode[];
    public constructor(range: Range, contents: ASTNode[]) {
        super(range,"ArrayLiteral");
        this.contents = contents;
    }
    public get children(): ASTNode[] {
        return this.contents;
    }
}

// // TODO
// export class ElementListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ElementList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ElisionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"Elision");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }

export class SpreadElementNode extends ASTNode {
    public readonly child: ASTNode;
    public constructor(range: Range, child: ASTNode) {
        super(range,"SpreadElement");
        this.child = child;
    }
    public get children(): ASTNode[] {
        return [this.child];
    }
}

// // Section 12.2.6
//
// // TODO
// export class ObjectLiteralNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ObjectLiteral");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class PropertyDefinitionListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"PropertyDefinitionList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class PropertyDefinitionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"PropertyDefinition");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class PropertyNameNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"PropertyName");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class LiteralPropertyNameNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"LiteralPropertyName");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ComputedPropertyNameNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ComputedPropertyName");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class CoverInitializedNameNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"CoverInitializedName");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class InitializerNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"Initializer");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 12.2.9
//
// // TODO
// export class TemplateLiteralNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"TemplateLiteral");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class TemplateSpansNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"TemplateSpans");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class TemplateMiddleListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"TemplateMiddleList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 12.3

export class MemberAccessExprNode extends ASTNode {
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
    public readonly obj: ASTNode;
    public readonly ident: string;
    public constructor(range: Range, obj: ASTNode, ident: string) {
        super(range,"MemberAccessIdent");
        this.obj = obj;
        this.ident = ident;
    }
    public get children(): ASTNode[] {
        return [this.obj];
    }
}

export class SuperPropertyNode extends ASTNode {
    public readonly member: ASTNode;
    public constructor(range: Range, member: ASTNode) {
        super(range,"SuperProperty");
        this.member = member;
    }
    public get children(): ASTNode[] {
        return [this.member];
    }
}

// // TODO
// export class MetaPropertyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"MetaProperty");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//

export class NewTargetNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"NewTarget");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

export class NewExpressionNode extends ASTNode {
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

// // TODO
// export class CallExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"CallExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class SuperCallNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"SuperCall");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ArgumentsNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"Arguments");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ArgumentListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ArgumentList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class LeftHandSideExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"LeftHandSideExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 12.4

export class PostIncrementNode extends ASTNode {
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
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Multiply",left,right);
    }
}

export class DivideNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Divide",left,right);
    }
}

export class ModuloNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Modulo",left,right);
    }
}

// Section 12.7

export class AddNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Add",left,right);
    }
}

export class SubtractNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Subtract",left,right);
    }
}

// Section 12.8

export class LeftShiftNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LeftShift",left,right);
    }
}

export class SignedRightShiftNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"SignedRightShift",left,right);
    }
}

export class UnsignedRightShiftNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"UnsignedRightShift",left,right);
    }
}

// Section 12.9

export class LessThanNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LessThan",left,right);
    }
}

export class GreaterThanNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"GreaterThan",left,right);
    }
}

export class LessEqualNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LessEqual",left,right);
    }
}

export class GreaterEqualNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"GreaterEqual",left,right);
    }
}

export class InstanceOfNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"InstanceOf",left,right);
    }
}

export class InNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"In",left,right);
    }
}

// Section 12.10

export class AbstractEqualsNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AbstractEquals",left,right);
    }
}

export class AbstractNotEqualsNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AbstractNotEquals",left,right);
    }
}

export class StrictEqualsNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"StrictEquals",left,right);
    }
}

export class StrictNotEqualsNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"StrictNotEquals",left,right);
    }
}

// Section 12.11

export class BitwiseANDNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"BitwiseAND",left,right);
    }
}

export class BitwiseXORNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"BitwiseXOR",left,right);
    }
}

export class BitwiseORNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"BitwiseOR",left,right);
    }
}

// Section 12.12

export class LogicalANDNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LogicalAND",left,right);
    }
}

export class LogicalORNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"LogicalORNode",left,right);
    }
}

// Section 12.13

export class ConditionalNode extends ASTNode {
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
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Assign",left,right);
    }
}

export class AssignMultiplyNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignMultiply",left,right);
    }
}

export class AssignDivideNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignDivide",left,right);
    }
}

export class AssignModuloNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignModulo",left,right);
    }
}

export class AssignAddNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignAdd",left,right);
    }
}

export class AssignSubtractNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignSubtract",left,right);
    }
}

export class AssignLeftShiftNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignLeftShift",left,right);
    }
}

export class AssignSignedRightShiftNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignSignedRightShift",left,right);
    }
}

export class AssignUnsignedRightShiftNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignUnsignedRightShift",left,right);
    }
}

export class AssignBitwiseANDNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignBitwiseAND",left,right);
    }
}

export class AssignBitwiseXORNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignBitwiseXOR",left,right);
    }
}

export class AssignBitwiseORNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"AssignBitwiseOR",left,right);
    }
}


// Section 12.15

export class CommaNode extends BinaryNode {
    public constructor(range: Range, left: ASTNode, right: ASTNode) {
        super(range,"Comma",left,right);
    }
}

// // Section 13
//
// // TODO
// export class StatementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"Statement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class DeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"Declaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class HoistableDeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"HoistableDeclaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BreakableStatementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BreakableStatement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 13.2
//
// // TODO
// export class BlockStatementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BlockStatement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//

export class BlockNode extends ASTNode {
    public statements: ASTNode[];
    public constructor(range: Range, statements: ASTNode[]) {
        super(range,"Block");
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return this.statements;
    }
}

// // TODO
// export class StatementListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"StatementList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class StatementListItemNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"StatementListItem");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// Section 13.3.1

export class LetNode extends ASTNode {
    public bindings: ASTNode[];
    public constructor(range: Range, bindings: ASTNode[]) {
        super(range,"LetNode");
        this.bindings = bindings;
    }
    public get children(): ASTNode[] {
        return this.bindings;
    }
}

export class ConstNode extends ASTNode {
    public bindings: ASTNode[];
    public constructor(range: Range, bindings: ASTNode[]) {
        super(range,"Const");
        this.bindings = bindings;
    }
    public get children(): ASTNode[] {
        return this.bindings;
    }
}

export class LexicalIdentifierBindingNode extends ASTNode {
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
    public declarations: ASTNode[];
    public constructor(range: Range, declarations: ASTNode[]) {
        super(range,"Var");
        this.declarations = declarations;
    }
    public get children(): ASTNode[] {
        return this.declarations;
    }
}

export class VarIdentifierBindingNode extends ASTNode {
    public identifier: ASTNode;
    public initializer: ASTNode;
    public constructor(range: Range, identifier: ASTNode, initializer: ASTNode) {
        super(range,"VarIdentifierBinding");
        this.identifier = identifier;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.identifier,this.initializer];
    }
}

export class VarPatternBindingNode extends ASTNode {
    public pattern: ASTNode;
    public initializer: ASTNode;
    public constructor(range: Range, pattern: ASTNode, initializer: ASTNode) {
        super(range,"VarPatternBinding");
        this.pattern = pattern;
        this.initializer = initializer;
    }
    public get children(): ASTNode[] {
        return [this.pattern,this.initializer];
    }
}

// // TODO
// export class VariableDeclarationListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"VariableDeclarationList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class VariableDeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"VariableDeclaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 13.3.3
//
// // TODO
// export class BindingPatternNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingPattern");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ObjectBindingPatternNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ObjectBindingPattern");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ArrayBindingPatternNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ArrayBindingPattern");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BindingPropertyListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingPropertyList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BindingElementListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingElementList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BindingElisionElementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingElisionElement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BindingPropertyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingProperty");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BindingElementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingElement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class SingleNameBindingNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"SingleNameBinding");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class BindingRestElementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"BindingRestElement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// Section 13.4

export class EmptyStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"EmptyStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// Section 13.5

export class ExpressionStatementNode extends ASTNode {
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

export class ForStatementNode extends ASTNode {
    public readonly init: ASTNode;
    public readonly condition: ASTNode;
    public readonly update: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, init: ASTNode, condition: ASTNode, update: ASTNode, body: ASTNode) {
        super(range,"ForStatement");
        this.init = init;
        this.condition = condition;
        this.update = update;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.init,this.condition,this.update,this.body];
    }
}

//
// // TODO
// export class ForDeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ForDeclaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ForBindingNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ForBinding");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// Section 13.8

export class ContinueStatementNode extends ASTNode {
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
    public readonly expr: ASTNode;
    public readonly cases: ASTNode[];
    private readonly _children: ASTNode[];
    public constructor(range: Range, expr: ASTNode, cases: ASTNode[]) {
        super(range,"SwitchStatement");
        this.expr = expr;
        this.cases = cases;
    }
    public get children(): ASTNode[] {
        return [this.expr].concat(this.cases);
    }
}

// // TODO
// export class CaseBlockNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"CaseBlock");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class CaseClausesNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"CaseClauses");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }

export class CaseClauseNode extends ASTNode {
    public readonly expr: ASTNode;
    public readonly statements: ASTNode[];
    public constructor(range: Range, expr: ASTNode, statements: ASTNode[]) {
        super(range,"CaseClause");
        this.expr = expr;
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return [this.expr].concat(this.statements);
    }
}

export class DefaultClauseNode extends ASTNode {
    public readonly statements: ASTNode[];
    public constructor(range: Range, statements: ASTNode[]) {
        super(range,"DefaultClause");
        this.statements = statements;
    }
    public get children(): ASTNode[] {
        return this.statements;
    }
}

// Section 13.13

export class LabelledStatementNode extends ASTNode {
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

// TODO
export class TryStatementNode extends ASTNode {
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
    public constructor(range: Range) {
        super(range,"DebuggerStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// // Section 14.1

export class FunctionNode extends ASTNode {
    public readonly ident: ASTNode; // may be null
    public readonly params: ASTNode;
    public readonly body: ASTNode;
    public constructor(range: Range, ident: ASTNode, params: ASTNode, body: ASTNode) {
        super(range,"NamedFunctionDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }
    public get children(): ASTNode[] {
        return [this.ident,this.params,this.body];
    }
}

// // TODO
// export class FunctionExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FunctionExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class StrictFormalParametersNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"StrictFormalParameters");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FormalParametersNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FormalParameters");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FormalParameterListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FormalParameterList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FormalsListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FormalsList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FunctionRestParameterNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FunctionRestParameter");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FormalParameterNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FormalParameter");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FunctionBodyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FunctionBody");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class FunctionStatementListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FunctionStatementList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 14.2
//
// // TODO
// export class ArrowFunctionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ArrowFunction");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ArrowParametersNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ArrowParameters");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ConciseBodyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ConciseBody");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ArrowFormalParametersNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ArrowFormalParameters");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 14.3
//
// // TODO
// export class MethodDefinitionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"MethodDefinition");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class PropertySetParameterListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"PropertySetParameterList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 14.4
//
// // TODO
// export class GeneratorMethodNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"GeneratorMethod");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class GeneratorDeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"GeneratorDeclaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class GeneratorExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"GeneratorExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class GeneratorBodyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"GeneratorBody");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class YieldExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"YieldExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 14.5
//
// // TODO
// export class ClassDeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassDeclaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ClassExpressionNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassExpression");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ClassTailNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassTail");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ClassHeritageNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassHeritage");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ClassBodyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassBody");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ClassElementListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassElementList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ClassElementNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ClassElement");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }

// Section 15.1

export class ScriptNode extends ASTNode {
    public readonly body: ASTNode[];
    public constructor(range: Range, body: ASTNode[]) {
        super(range,"Script");
        this.body = body;
    }
    public get children(): ASTNode[] {
        return this.body;
    }
}

// // TODO
// export class ScriptBodyNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ScriptBody");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 15.2

export class ModuleNode extends ASTNode {
    public readonly body: ASTNode[];
    public constructor(range: Range, body: ASTNode[]) {
        super(range,"Module");
        this.body = body;
    }
    public get children(): ASTNode[] {
        return this.body;
    }
}

// Section 15.2.2

export class ImportFromNode extends ASTNode {
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
    public readonly specifier: ASTNode;
    public constructor(range: Range, specifier: ASTNode) {
        super(range,"ImportModule");
        this.specifier = specifier;
    }
    public get children(): ASTNode[] {
        return [this.specifier];
    }
}

// // TODO
// export class ImportClauseNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ImportClause");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }

export class DefaultAndNameSpaceImportsNode extends ASTNode {
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

export class NameSpaceImportNode extends ASTNode {
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
    public readonly imports: ASTNode[];
    public constructor(range: Range, imports: ASTNode[]) {
        super(range,"NamedImports");
        this.imports = imports;
    }
    public get children(): ASTNode[] {
        return this.imports;
    }
}

// // TODO
// export class FromClauseNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"FromClause");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//


export class ImportNormalSpecifierNode extends ASTNode {
    public readonly binding: ASTNode;
    public constructor(range: Range, binding: ASTNode) {
        super(range,"ImportNormalSpecifier");
        this.binding = binding;
    }
    public get children(): ASTNode[] {
        return [this.binding];
    }
}

export class ImportAsSpecifierNode extends ASTNode {
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


// // TODO
// export class ImportsListNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ImportsList");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ImportSpecifierNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ImportSpecifier");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ModuleSpecifierNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ModuleSpecifier");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // TODO
// export class ImportedBindingNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ImportedBinding");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }
//
// // Section 15.2.3
//
// // TODO
// export class ExportDeclarationNode extends ASTNode {
//     public constructor(range: Range) {
//         super(range,"ExportDeclaration");
//     }
//     public get children(): ASTNode[] {
//         return [];
//     }
// }

export class ExportFromNode extends ASTNode {
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
    public readonly items: ASTNode[];
    public constructor(range: Range, items: ASTNode[]) {
        super(range,"ExportClause");
        this.items = items;
    }
    public get children(): ASTNode[] {
        return this.items;
    }
}

export class ExportNormalSpecifierNode extends ASTNode {
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
