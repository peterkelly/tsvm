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
    public readonly range: Range;
    public readonly kind: string;
    public constructor(range: Range, kind: string) {
        this.range = range;
        this.kind = kind;
    }
    public abstract get children(): ASTNode[];
    public get label(): string { return this.kind; }
}

// TODO
export class IdentifierReferenceNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"IdentifierReference");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingIdentifierNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingIdentifier");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LabelIdentifierNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LabelIdentifier");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class IdentifierNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Identifier");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class PrimaryExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"PrimaryExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CoverParenthesizedExpressionAndArrowParameterListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CoverParenthesizedExpressionAndArrowParameterList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ParenthesizedExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ParenthesizedExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LiteralNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Literal");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArrayLiteralNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ArrayLiteral");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ElementListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ElementList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ElisionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Elision");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class SpreadElementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"SpreadElement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ObjectLiteralNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ObjectLiteral");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class PropertyDefinitionListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"PropertyDefinitionList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class PropertyDefinitionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"PropertyDefinition");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class PropertyNameNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"PropertyName");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LiteralPropertyNameNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LiteralPropertyName");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ComputedPropertyNameNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ComputedPropertyName");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CoverInitializedNameNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CoverInitializedName");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class InitializerNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Initializer");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class TemplateLiteralNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"TemplateLiteral");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class TemplateSpansNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"TemplateSpans");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class TemplateMiddleListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"TemplateMiddleList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class MemberExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"MemberExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class SuperPropertyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"SuperProperty");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class MetaPropertyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"MetaProperty");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class NewTargetNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"NewTarget");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class NewExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"NewExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CallExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CallExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class SuperCallNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"SuperCall");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArgumentsNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Arguments");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArgumentListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ArgumentList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LeftHandSideExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LeftHandSideExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class PostfixExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"PostfixExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class UnaryExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"UnaryExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class MultiplicativeExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"MultiplicativeExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class MultiplicativeOperatorNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"MultiplicativeOperator");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class AdditiveExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"AdditiveExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ShiftExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ShiftExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class RelationalExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"RelationalExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class EqualityExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"EqualityExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BitwiseANDExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BitwiseANDExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BitwiseXORExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BitwiseXORExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BitwiseORExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BitwiseORExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LogicalANDExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LogicalANDExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LogicalORExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LogicalORExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ConditionalExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ConditionalExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class AssignmentExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"AssignmentExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class AssignmentOperatorNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"AssignmentOperator");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Expression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class StatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Statement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class DeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Declaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class HoistableDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"HoistableDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BreakableStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BreakableStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BlockStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BlockStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BlockNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Block");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class StatementListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"StatementList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class StatementListItemNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"StatementListItem");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LexicalDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LexicalDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LetOrConstNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LetOrConst");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LexicalBindingNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LexicalBinding");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class VariableStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"VariableStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class VariableDeclarationListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"VariableDeclarationList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class VariableDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"VariableDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingPatternNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingPattern");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ObjectBindingPatternNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ObjectBindingPattern");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArrayBindingPatternNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ArrayBindingPattern");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingPropertyListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingPropertyList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingElementListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingElementList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingElisionElementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingElisionElement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingPropertyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingProperty");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingElementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingElement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class SingleNameBindingNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"SingleNameBinding");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BindingRestElementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BindingRestElement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class EmptyStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"EmptyStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ExpressionStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ExpressionStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class IfStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"IfStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class IterationStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"IterationStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ForDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ForDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ForBindingNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ForBinding");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ContinueStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ContinueStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class BreakStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"BreakStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ReturnStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ReturnStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class WithStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"WithStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class SwitchStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"SwitchStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CaseBlockNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CaseBlock");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CaseClausesNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CaseClauses");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CaseClauseNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CaseClause");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class DefaultClauseNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"DefaultClause");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LabelledStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LabelledStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class LabelledItemNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"LabelledItem");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ThrowStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ThrowStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class TryStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"TryStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CatchNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Catch");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FinallyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Finally");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class CatchParameterNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"CatchParameter");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class DebuggerStatementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"DebuggerStatement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FunctionDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FunctionDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FunctionExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FunctionExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class StrictFormalParametersNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"StrictFormalParameters");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FormalParametersNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FormalParameters");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FormalParameterListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FormalParameterList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FormalsListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FormalsList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FunctionRestParameterNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FunctionRestParameter");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FormalParameterNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FormalParameter");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FunctionBodyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FunctionBody");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FunctionStatementListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FunctionStatementList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArrowFunctionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ArrowFunction");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArrowParametersNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ArrowParameters");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ConciseBodyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ConciseBody");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ArrowFormalParametersNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ArrowFormalParameters");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class MethodDefinitionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"MethodDefinition");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class PropertySetParameterListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"PropertySetParameterList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class GeneratorMethodNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"GeneratorMethod");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class GeneratorDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"GeneratorDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class GeneratorExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"GeneratorExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class GeneratorBodyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"GeneratorBody");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class YieldExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"YieldExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassExpressionNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassExpression");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassTailNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassTail");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassHeritageNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassHeritage");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassBodyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassBody");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassElementListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassElementList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ClassElementNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ClassElement");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ScriptNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Script");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ScriptBodyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ScriptBody");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ModuleNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"Module");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ModuleBodyNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ModuleBody");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ModuleItemListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ModuleItemList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ModuleItemNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ModuleItem");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ImportDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ImportDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ImportClauseNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ImportClause");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ImportedDefaultBindingNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ImportedDefaultBinding");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class NameSpaceImportNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"NameSpaceImport");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class NamedImportsNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"NamedImports");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class FromClauseNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"FromClause");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ImportsListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ImportsList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ImportSpecifierNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ImportSpecifier");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ModuleSpecifierNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ModuleSpecifier");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ImportedBindingNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ImportedBinding");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ExportDeclarationNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ExportDeclaration");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ExportClauseNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ExportClause");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ExportsListNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ExportsList");
    }
    public get children(): ASTNode[] {
        return [];
    }
}

// TODO
export class ExportSpecifierNode extends ASTNode {
    public constructor(range: Range) {
        super(range,"ExportSpecifier");
    }
    public get children(): ASTNode[] {
        return [];
    }
}
