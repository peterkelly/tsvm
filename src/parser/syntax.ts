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
    isIdStart,
    isIdChar,
    Parser,
    ParseError
} from "./parser";
import {
    Range,
    ASTNode,
    IdentifierReferenceNode,
    BindingIdentifierNode,
    LabelIdentifierNode,
    IdentifierNode,
    PrimaryExpressionNode,
    CoverParenthesizedExpressionAndArrowParameterListNode,
    ParenthesizedExpressionNode,
    LiteralNode,
    ArrayLiteralNode,
    ElementListNode,
    ElisionNode,
    SpreadElementNode,
    ObjectLiteralNode,
    PropertyDefinitionListNode,
    PropertyDefinitionNode,
    PropertyNameNode,
    LiteralPropertyNameNode,
    ComputedPropertyNameNode,
    CoverInitializedNameNode,
    InitializerNode,
    TemplateLiteralNode,
    TemplateSpansNode,
    TemplateMiddleListNode,
    MemberExpressionNode,
    SuperPropertyNode,
    MetaPropertyNode,
    NewTargetNode,
    NewExpressionNode,
    CallExpressionNode,
    SuperCallNode,
    ArgumentsNode,
    ArgumentListNode,
    LeftHandSideExpressionNode,
    PostfixExpressionNode,
    UnaryExpressionNode,
    MultiplicativeExpressionNode,
    MultiplicativeOperatorNode,
    AdditiveExpressionNode,
    ShiftExpressionNode,
    RelationalExpressionNode,
    EqualityExpressionNode,
    BitwiseANDExpressionNode,
    BitwiseXORExpressionNode,
    BitwiseORExpressionNode,
    LogicalANDExpressionNode,
    LogicalORExpressionNode,
    ConditionalExpressionNode,
    AssignmentExpressionNode,
    AssignmentOperatorNode,
    ExpressionNode,
    StatementNode,
    DeclarationNode,
    HoistableDeclarationNode,
    BreakableStatementNode,
    BlockStatementNode,
    BlockNode,
    StatementListNode,
    StatementListItemNode,
    LexicalDeclarationNode,
    LetOrConstNode,
    BindingListNode,
    LexicalBindingNode,
    VariableStatementNode,
    VariableDeclarationListNode,
    VariableDeclarationNode,
    BindingPatternNode,
    ObjectBindingPatternNode,
    ArrayBindingPatternNode,
    BindingPropertyListNode,
    BindingElementListNode,
    BindingElisionElementNode,
    BindingPropertyNode,
    BindingElementNode,
    SingleNameBindingNode,
    BindingRestElementNode,
    EmptyStatementNode,
    ExpressionStatementNode,
    IfStatementNode,
    IterationStatementNode,
    ForDeclarationNode,
    ForBindingNode,
    ContinueStatementNode,
    BreakStatementNode,
    ReturnStatementNode,
    WithStatementNode,
    SwitchStatementNode,
    CaseBlockNode,
    CaseClausesNode,
    CaseClauseNode,
    DefaultClauseNode,
    LabelledStatementNode,
    LabelledItemNode,
    ThrowStatementNode,
    TryStatementNode,
    CatchNode,
    FinallyNode,
    CatchParameterNode,
    DebuggerStatementNode,
    FunctionDeclarationNode,
    FunctionExpressionNode,
    StrictFormalParametersNode,
    FormalParametersNode,
    FormalParameterListNode,
    FormalsListNode,
    FunctionRestParameterNode,
    FormalParameterNode,
    FunctionBodyNode,
    FunctionStatementListNode,
    ArrowFunctionNode,
    ArrowParametersNode,
    ConciseBodyNode,
    ArrowFormalParametersNode,
    MethodDefinitionNode,
    PropertySetParameterListNode,
    GeneratorMethodNode,
    GeneratorDeclarationNode,
    GeneratorExpressionNode,
    GeneratorBodyNode,
    YieldExpressionNode,
    ClassDeclarationNode,
    ClassExpressionNode,
    ClassTailNode,
    ClassHeritageNode,
    ClassBodyNode,
    ClassElementListNode,
    ClassElementNode,
    ScriptNode,
    ScriptBodyNode,
    ModuleNode,
    ModuleBodyNode,
    ModuleItemListNode,
    ModuleItemNode,
    ImportDeclarationNode,
    ImportClauseNode,
    ImportedDefaultBindingNode,
    NameSpaceImportNode,
    NamedImportsNode,
    FromClauseNode,
    ImportsListNode,
    ImportSpecifierNode,
    ModuleSpecifierNode,
    ImportedBindingNode,
    ExportDeclarationNode,
    ExportClauseNode,
    ExportsListNode,
    ExportSpecifierNode,
} from "./ast";

// Section 12.1

// IdentifierReference

function IdentifierReference(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingIdentifier

function BindingIdentifier(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LabelIdentifier

function LabelIdentifier(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Identifier

function Identifier(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.2

// PrimaryExpression

function PrimaryExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CoverParenthesizedExpressionAndArrowParameterList

function CoverParenthesizedExpressionAndArrowParameterList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ParenthesizedExpression

function ParenthesizedExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.2.4

// Literal

function Literal(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.2.5

// ArrayLiteral

function ArrayLiteral(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ElementList

function ElementList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Elision

function Elision(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// SpreadElement

function SpreadElement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// PropertyDefinitionList

function PropertyDefinitionList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// PropertyDefinition

function PropertyDefinition(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// PropertyName

function PropertyName(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LiteralPropertyName

function LiteralPropertyName(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ComputedPropertyName

function ComputedPropertyName(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CoverInitializedName

function CoverInitializedName(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Initializer

function Initializer(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.2.9

// TemplateLiteral

function TemplateLiteral(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// TemplateSpans

function TemplateSpans(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// TemplateMiddleList

function TemplateMiddleList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.3

// MemberExpression

function MemberExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// SuperProperty

function SuperProperty(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// MetaProperty

function MetaProperty(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// NewTarget

function NewTarget(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// NewExpression

function NewExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CallExpression

function CallExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// SuperCall

function SuperCall(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Arguments

function Arguments(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ArgumentList

function ArgumentList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LeftHandSideExpression

function LeftHandSideExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.4

// PostfixExpression

function PostfixExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.5

// UnaryExpression

function UnaryExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// MultiplicativeOperator

function MultiplicativeOperator(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.7

// AdditiveExpression

function AdditiveExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.8

// ShiftExpression

function ShiftExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.9

// RelationalExpression

function RelationalExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.10

// EqualityExpression

function EqualityExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BitwiseXORExpression

function BitwiseXORExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BitwiseORExpression

function BitwiseORExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LogicalORExpression

function LogicalORExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.13

// ConditionalExpression

function ConditionalExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.14

// AssignmentExpression

function AssignmentExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// AssignmentOperator

function AssignmentOperator(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.15

// Expression

function Expression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13

// Statement

function Statement(p: Parser): ASTNode {
    try { return BlockStatement(p); } catch (e) {}
    try { return VariableStatement(p); } catch (e) {}
    try { return EmptyStatement(p); } catch(e) {}
    try { return ExpressionStatement(p); } catch(e) {}
    try { return IfStatement(p); } catch(e) {}
    try { return BreakableStatement(p); } catch(e) {}
    try { return ContinueStatement(p); } catch (e) {}
    try { return BreakStatement(p); } catch (e) {}
    try { return ReturnStatement(p); } catch (e) {}
    try { return WithStatement(p); } catch (e) {}
    try { return LabelledStatement(p); } catch (e) {}
    try { return ThrowStatement(p); } catch (e) {}
    try { return TryStatement(p); } catch (e) {}
    try { return DebuggerStatement(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected Statement");
}

// Declaration

function Declaration(p: Parser): ASTNode {
    try { return HoistableDeclaration(p); } catch (e) {}
    try { return ClassDeclaration(p); } catch (e) {}
    try { return LexicalDeclaration(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected Declaration");
}

// HoistableDeclaration

function HoistableDeclaration(p: Parser): ASTNode {
    try { return FunctionDeclaration(p); } catch (e) {}
    try { return GeneratorDeclaration(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected HoistableDeclaration");
}

// BreakableStatement

function BreakableStatement(p: Parser): ASTNode {
    try { return IterationStatement(p); } catch (e) {}
    try { return SwitchStatement(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected BreakableStatement");
}

// Section 13.2

// BlockStatement

function BlockStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Block

function Block(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// StatementList

function StatementList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// StatementListItem

function StatementListItem(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LetOrConst

function LetOrConst(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingList

function BindingList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LexicalBinding

function LexicalBinding(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.3.2

// VariableStatement

function VariableStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// VariableDeclarationList

function VariableDeclarationList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// VariableDeclaration

function VariableDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.3.3

// BindingPattern

function BindingPattern(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ObjectBindingPattern

function ObjectBindingPattern(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ArrayBindingPattern

function ArrayBindingPattern(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingPropertyList

function BindingPropertyList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingElementList

function BindingElementList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingElisionElement

function BindingElisionElement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingProperty

function BindingProperty(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingElement

function BindingElement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// SingleNameBinding

function SingleNameBinding(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// BindingRestElement

function BindingRestElement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.4

// EmptyStatement

function EmptyStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.5

// ExpressionStatement

function ExpressionStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.6

// IfStatement

function IfStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.7

// IterationStatement

function IterationStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ForDeclaration

function ForDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ForBinding

function ForBinding(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.8

// ContinueStatement

function ContinueStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.9

// BreakStatement

function BreakStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.10

// ReturnStatement

function ReturnStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.11

// WithStatement

function WithStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.12

// SwitchStatement

function SwitchStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CaseBlock

function CaseBlock(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CaseClauses

function CaseClauses(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CaseClause

function CaseClause(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// DefaultClause

function DefaultClause(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.13

// LabelledStatement

function LabelledStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// LabelledItem

function LabelledItem(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.14

// ThrowStatement

function ThrowStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.15

// TryStatement

function TryStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Catch

function Catch(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Finally

function Finally(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// CatchParameter

function CatchParameter(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 13.16

// DebuggerStatement

function DebuggerStatement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 14.1

// FunctionDeclaration

function FunctionDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FunctionExpression

function FunctionExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// StrictFormalParameters

function StrictFormalParameters(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FormalParameters

function FormalParameters(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FormalParameterList

function FormalParameterList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FormalsList

function FormalsList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FunctionRestParameter

function FunctionRestParameter(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FormalParameter

function FormalParameter(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FunctionBody

function FunctionBody(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FunctionStatementList

function FunctionStatementList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 14.2

// ArrowFunction

function ArrowFunction(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ArrowParameters

function ArrowParameters(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ConciseBody

function ConciseBody(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ArrowFormalParameters

function ArrowFormalParameters(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 14.3

// MethodDefinition

function MethodDefinition(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// PropertySetParameterList

function PropertySetParameterList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 14.4

// GeneratorMethod

function GeneratorMethod(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// GeneratorDeclaration

function GeneratorDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// GeneratorExpression

function GeneratorExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// GeneratorBody

function GeneratorBody(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// YieldExpression

function YieldExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 14.5

// ClassDeclaration

function ClassDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ClassExpression

function ClassExpression(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ClassTail

function ClassTail(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ClassHeritage

function ClassHeritage(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ClassBody

function ClassBody(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ClassElementList

function ClassElementList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ClassElement

function ClassElement(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 15.1

// Script

function Script(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ScriptBody

function ScriptBody(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 15.2

// Module

function Module(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ModuleBody

function ModuleBody(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ModuleItemList

function ModuleItemList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ModuleItem

function ModuleItem(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 15.2.2

// ImportDeclaration

function ImportDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ImportClause

function ImportClause(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// NameSpaceImport

function NameSpaceImport(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// NamedImports

function NamedImports(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// FromClause

function FromClause(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ImportsList

function ImportsList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ImportSpecifier

function ImportSpecifier(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ModuleSpecifier

function ModuleSpecifier(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ImportedBinding

function ImportedBinding(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 15.2.3

// ExportDeclaration

function ExportDeclaration(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ExportClause

function ExportClause(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ExportsList

function ExportsList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// ExportSpecifier

function ExportSpecifier(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME
