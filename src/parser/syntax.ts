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
    ParseError,
    ParseIgnore,
} from "./parser";
import {
    Range,
    ASTNode,
    IdentifierReferenceNode,
    BindingIdentifierNode,
    LabelIdentifierNode,
    IdentifierNode,
    ThisNode,
    CoverExpr1Node,
    CoverExpr2Node,
    CoverExpr3Node,
    CoverExpr4Node,
    NullLiteralNode,
    BooleanLiteralNode,
    NumericLiteralNode,
    StringLiteralNode,
    // CoverParenthesizedExpressionAndArrowParameterListNode,
    // ParenthesizedExpressionNode,
    // LiteralNode,
    ArrayLiteralNode,
    ElisionNode,
    SpreadElementNode,
    ObjectLiteralNode,
    // PropertyDefinitionListNode,
    // PropertyDefinitionNode,
    ColonPropertyDefinitionNode,
    // PropertyNameNode,
    // LiteralPropertyNameNode,
    ComputedPropertyNameNode,
    CoverInitializedNameNode,
    // InitializerNode,
    // TemplateLiteralNode,
    // TemplateSpansNode,
    // TemplateMiddleListNode,
    // MemberExpressionNode,
    MemberAccessExprNode,
    MemberAccessIdentNode,
    SuperPropertyNode,
    // MetaPropertyNode,
    NewTargetNode,
    NewExpressionNode,
    CallNode,
    SuperCallNode,
    ArgumentsNode,
    // ArgumentListNode,
    // LeftHandSideExpressionNode,
    PostIncrementNode,
    PostDecrementNode,
    DeleteNode,
    VoidNode,
    TypeOfNode,
    PreIncrementNode,
    PreDecrementNode,
    UnaryPlusNode,
    UnaryMinusNode,
    UnaryBitwiseNotNode,
    UnaryLogicalNotNode,
    MultiplyNode,
    DivideNode,
    ModuloNode,
    AddNode,
    SubtractNode,
    LeftShiftNode,
    SignedRightShiftNode,
    UnsignedRightShiftNode,
    LessThanNode,
    GreaterThanNode,
    LessEqualNode,
    GreaterEqualNode,
    InstanceOfNode,
    InNode,
    AbstractEqualsNode,
    AbstractNotEqualsNode,
    StrictEqualsNode,
    StrictNotEqualsNode,
    BitwiseANDNode,
    BitwiseXORNode,
    BitwiseORNode,
    LogicalANDNode,
    LogicalORNode,
    ConditionalNode,
    AssignNode,
    AssignMultiplyNode,
    AssignDivideNode,
    AssignModuloNode,
    AssignAddNode,
    AssignSubtractNode,
    AssignLeftShiftNode,
    AssignSignedRightShiftNode,
    AssignUnsignedRightShiftNode,
    AssignBitwiseANDNode,
    AssignBitwiseXORNode,
    AssignBitwiseORNode,
    CommaNode,
    // StatementNode,
    // DeclarationNode,
    // HoistableDeclarationNode,
    // BreakableStatementNode,
    BlockNode,
    LetNode,
    ConstNode,
    LexicalIdentifierBindingNode,
    LexicalPatternBindingNode,
    // VariableStatementNode,
    // VariableDeclarationListNode,
    // VariableDeclarationNode,
    VarNode,
    VarIdentifierBindingNode,
    VarPatternBindingNode,
    // BindingPatternNode,
    ObjectBindingPatternNode,
    ArrayBindingPattern1Node,
    ArrayBindingPattern2Node,
    ArrayBindingPattern3Node,
    // BindingPropertyListNode,
    // BindingElementListNode,
    BindingElisionElementNode,
    BindingPropertyNode,
    BindingPatternInitNode,
    SingleNameBindingNode,
    BindingRestElementNode,
    EmptyStatementNode,
    ExpressionStatementNode,
    IfStatementNode,
    // IterationStatementNode,
    DoStatementNode,
    WhileStatementNode,
    ForStatementNode,
    LetForDeclarationNode,
    ConstForDeclarationNode,
    // ForBindingNode,
    ContinueStatementNode,
    BreakStatementNode,
    ReturnStatementNode,
    WithStatementNode,
    SwitchStatementNode,
    // CaseBlockNode,
    // CaseClausesNode,
    CaseClauseNode,
    DefaultClauseNode,
    LabelledStatementNode,
    ThrowStatementNode,
    TryStatementNode,
    CatchNode,
    FinallyNode,
    DebuggerStatementNode,
    FunctionNode,
    // FunctionExpressionNode,
    // StrictFormalParametersNode,
    // FormalParametersNode,
    // FormalParameterListNode,
    // FormalsListNode,
    // FunctionRestParameterNode,
    // FormalParameterNode,
    // FunctionBodyNode,
    // FunctionStatementListNode,
    // ArrowFunctionNode,
    // ArrowParametersNode,
    // ConciseBodyNode,
    // ArrowFormalParametersNode,
    // MethodDefinitionNode,
    // PropertySetParameterListNode,
    // GeneratorMethodNode,
    // GeneratorDeclarationNode,
    // GeneratorExpressionNode,
    // GeneratorBodyNode,
    // YieldExpressionNode,
    // ClassDeclarationNode,
    // ClassExpressionNode,
    // ClassTailNode,
    // ClassHeritageNode,
    // ClassBodyNode,
    // ClassElementListNode,
    // ClassElementNode,
    ScriptNode,
    // ScriptBodyNode,
    ModuleNode,
    ImportFromNode,
    ImportModuleNode,
    // ImportClauseNode,
    // ImportedDefaultBindingNode,
    DefaultAndNameSpaceImportsNode,
    DefaultAndNamedImportsNode,
    NameSpaceImportNode,
    NamedImportsNode,
    // FromClauseNode,
    ImportNormalSpecifierNode,
    ImportAsSpecifierNode,
    // ImportsListNode,
    // ImportSpecifierNode,
    // ModuleSpecifierNode,
    // ImportedBindingNode,
    // ExportDeclarationNode,
    ExportFromNode,
    ExportClauseNode,
    ExportNormalSpecifierNode,
    ExportAsSpecifierNode,
    ListNode,
    ErrorNode,
} from "./ast";

// CoverParenthesizedExpressionAndArrowParameterList_1

function CoverParenthesizedExpressionAndArrowParameterList_1(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("(");
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        return new CoverExpr1Node(new Range(start,p.pos),expr);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CoverParenthesizedExpressionAndArrowParameterList_2

function CoverParenthesizedExpressionAndArrowParameterList_2(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("(");
        p.skipWhitespace();
        p.expectPunctuator(")");
        return new CoverExpr2Node(new Range(start,p.pos));
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CoverParenthesizedExpressionAndArrowParameterList_3

function CoverParenthesizedExpressionAndArrowParameterList_3(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("(");
        p.skipWhitespace();
        p.expectPunctuator("...");
        p.skipWhitespace();
        const ident = BindingIdentifier(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        return new CoverExpr3Node(new Range(start,p.pos),ident);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CoverParenthesizedExpressionAndArrowParameterList_4

function CoverParenthesizedExpressionAndArrowParameterList_4(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("(");
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(",");
        p.skipWhitespace();
        p.expectPunctuator("...");
        p.skipWhitespace();
        const ident = BindingIdentifier(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        return new CoverExpr3Node(new Range(start,p.pos),ident);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CoverParenthesizedExpressionAndArrowParameterList

function CoverParenthesizedExpressionAndArrowParameterList(p: Parser): ASTNode {
    try { return CoverParenthesizedExpressionAndArrowParameterList_1(p); } catch (e) {}
    try { return CoverParenthesizedExpressionAndArrowParameterList_2(p); } catch (e) {}
    try { return CoverParenthesizedExpressionAndArrowParameterList_3(p); } catch (e) {}
    try { return CoverParenthesizedExpressionAndArrowParameterList_4(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected CoverParenthesizedExpressionAndArrowParameterList");
}

// Section 12.1

// IdentifierReference

function IdentifierReference(p: Parser): ASTNode {
    const ident = Identifier(p);
    return new IdentifierReferenceNode(ident.range,ident.value);
}

// BindingIdentifier

function BindingIdentifier(p: Parser): ASTNode {
    const ident = Identifier(p);
    return new BindingIdentifierNode(ident.range,ident.value);
}

// LabelIdentifier

function LabelIdentifier(p: Parser): ASTNode {
    const ident = Identifier(p);
    return new LabelIdentifierNode(ident.range,ident.value);
}

// IdentifierName

function IdentifierName(p: Parser): IdentifierNode {
    return Identifier(p);
}

// Identifier

function Identifier(p: Parser): IdentifierNode {
    const start = p.pos;
    try {
        if ((p.cur != null) && isIdStart(p.cur)) {
            p.next();
            while ((p.cur != null) && isIdChar(p.cur))
                p.next();
            const range = new Range(start,p.pos);
            return new IdentifierNode(range,p.text.substring(range.start,range.end));
        }
        else {
            throw new ParseError(p,p.pos,"Expected Identifier");
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.2

// PrimaryExpression

function PrimaryExpression(p: Parser): ASTNode {

    function This(p: Parser): ASTNode {
        const start = p.pos;
        p.expectKeyword("this");
        const range = new Range(start,p.pos);
        return new ThisNode(range);
    }

    try { return This(p); } catch (e) {}
    try { return IdentifierReference(p); } catch (e) {}
    try { return Literal(p); } catch (e) {}
    try { return ArrayLiteral(p); } catch (e) {}
    try { return ObjectLiteral(p); } catch (e) {}
    try { return FunctionExpression(p); } catch (e) {}
    try { return ClassExpression(p); } catch (e) {}
    try { return GeneratorExpression(p); } catch (e) {}
    // try { return RegularExpressionLiteral(p); } catch (e) {} // TODO
    // try { return TemplateLiteral(p); } catch (e) {} // TODO
    try { return CoverParenthesizedExpressionAndArrowParameterList(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected PrimaryExpression");
}

// ParenthesizedExpression

function ParenthesizedExpression(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("(");
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");

        expr.range = new Range(start,p.pos);
        return expr;
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.2.4

// Literal

function Literal(p: Parser): ASTNode {
    const start = p.pos;
    try {
        if (p.matchKeyword("null")) {
            return new NullLiteralNode(new Range(start,p.pos));
        }
        else if (p.matchKeyword("true")) {
            return new BooleanLiteralNode(new Range(start,p.pos),true);
        }
        else if (p.matchKeyword("false")) {
            return new BooleanLiteralNode(new Range(start,p.pos),false);
        }
        return null; // FIXME
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// NullLiteral

function NullLiteral(p: Parser): ASTNode {
    const start = p.pos;
    p.expectKeyword("null");
    return new NullLiteralNode(new Range(start,p.pos));
}

// BooleanLiteral

function BooleanLiteral(p: Parser): ASTNode {
    const start = p.pos;
    if (p.matchKeyword("true"))
        return new BooleanLiteralNode(new Range(start,p.pos),true);
    if (p.matchKeyword("false"))
        return new BooleanLiteralNode(new Range(start,p.pos),false);
    throw new ParseError(p,p.pos,"Expected BooleanLiteral");
}

// NumericLiteral

function NumericLiteral(p: Parser): ASTNode {
    // TODO: Complete numeric literal syntax according to spec
    const start = p.pos;
    try {
        while ((p.cur != null) && (p.cur >= "0") && (p.cur != "9"))
            p.next();
        if (p.pos == start)
            throw new ParseError(p,p.pos,"Expected number");
        if (p.cur == ".") {
            p.next();
            const postDecimal = p.pos;
            while ((p.cur != null) && (p.cur >= "0") && (p.cur != "9"))
                p.next();
            if (p.pos == postDecimal)
                throw new ParseError(p,p.pos,"Invalid number");
        }
        const value = parseFloat(p.text.substring(start,p.pos));
        return new NumericLiteralNode(new Range(start,p.pos),value);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// StringLiteral

function StringLiteral(p: Parser): ASTNode {
    // TODO: Complete string literal syntax according to spec
    const start = p.pos;
    try {
        if (p.cur == "\"") {
            p.next();
            let value = "";
            while (true) {
                if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "\"")) {
                    value += "\"";
                    p.pos += 2;
                }
                else if ((p.pos < p.len) && (p.text[p.pos] == "\"")) {
                    p.pos++;
                    break;
                }
                else if (p.pos < p.len) {
                    value += p.text[p.pos];
                    p.pos++;
                }
                else {
                    throw new ParseError(p,p.pos,"Unterminated string");
                }
            }
            return new StringLiteralNode(new Range(start,p.pos),value);
        }
        throw new ParseError(p,p.pos,"Invalid string");
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.2.5

// ArrayLiteral

function ArrayLiteral(p: Parser): ASTNode {
    // TODO: Support elisions
    const start = p.pos;
    try {
        p.expectPunctuator("[");
        p.skipWhitespace();
        const contents = ElementList(p);
        p.skipWhitespace();
        p.expectPunctuator("]");
        return new ArrayLiteralNode(new Range(start,p.pos),contents);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ElementList

function ElementList(p: Parser): ASTNode {
    // TODO: Support elisions
    const start = p.pos;
    try {
        const elements: ASTNode[] = [];
        while (true) {
            let item: ASTNode = null;
            try { item = AssignmentExpression(p); } catch (e) {}
            try { item = SpreadElement(p); } catch (e) {}
            if (item == null)
                return new ListNode(new Range(start,p.pos),elements);
            elements.push(item);
            const start2 = p.pos;
            try {
                p.skipWhitespace();
                p.expectPunctuator(",");
                p.skipWhitespace();
                try { item = AssignmentExpression(p); } catch (e) {}
                try { item = SpreadElement(p); } catch (e) {}
                if (item == null)
                    throw new ParseIgnore();
                elements.push(item);
            }
            catch (e) {
                p.pos = start2;
                return new ListNode(new Range(start,p.pos),elements);
            }
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Elision

function Elision(p: Parser): ASTNode {
    const start = p.pos;
    p.expectPunctuator(",");
    let count = 1;
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            count++;
        }
        catch (e) {
            p.pos = start2;
            return new ElisionNode(new Range(start,p.pos),count);
        }
    }
}

// SpreadElement

function SpreadElement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("...");
        const assign = AssignmentExpression(p);
        return new SpreadElementNode(new Range(start,p.pos),assign);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("{");
        p.skipWhitespace();

        let properties: ASTNode = null;

        const start2 = p.pos;
        try {
            properties = PropertyDefinitionList(p);
            p.skipWhitespace();

            const start3 = p.pos;
            try {
                p.expectPunctuator(",");
                p.skipWhitespace();
            }
            catch (e) {
                p.pos = start3;
            }
        }
        catch (e) {
            p.pos = start2;
        }

        p.expectPunctuator("}");

        if (properties == null)
            properties = new ListNode(new Range(start,p.pos),[]);
        return new ObjectLiteralNode(new Range(start,p.pos),properties);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// PropertyDefinitionList

function PropertyDefinitionList(p: Parser): ASTNode {
    const start = p.pos;
    const properties: ASTNode[] = [];
    properties.push(PropertyDefinition(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            properties.push(PropertyDefinition(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),properties);
        }
    }
}

// PropertyDefinition_colon

function PropertyDefinition_colon(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const name = PropertyName(p);
        p.skipWhitespace();
        p.expectPunctuator(":");
        p.skipWhitespace();
        const init = AssignmentExpression(p);
        return new ColonPropertyDefinitionNode(new Range(start,p.pos),name,init);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// PropertyDefinition

function PropertyDefinition(p: Parser): ASTNode {
    const start = p.pos;
    try { return PropertyDefinition_colon(p); } catch (e) {}
    try { return CoverInitializedName(p); } catch (e) {}
    try { return MethodDefinition(p); } catch (e) {}
    try { return IdentifierReference(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected PropertyDefinition");
}

// PropertyName

function PropertyName(p: Parser): ASTNode {
    try { return LiteralPropertyName(p); } catch (e) {}
    try { return ComputedPropertyName(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected identifier, string, number, or computed name");
}

// LiteralPropertyName

function LiteralPropertyName(p: Parser): ASTNode {
    try { return IdentifierName(p); } catch (e) {}
    try { return StringLiteral(p); } catch (e) {}
    try { return NumericLiteral(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected identifier, string, or number");
}

// ComputedPropertyName

function ComputedPropertyName(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("{");
        p.skipWhitespace();
        const expr = AssignmentExpression(p);
        p.skipWhitespace();
        p.expectPunctuator("}");
        return new ComputedPropertyNameNode(new Range(start,p.pos),expr);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CoverInitializedName

function CoverInitializedName(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const ident = IdentifierReference(p);
        p.skipWhitespace();
        const init = Initializer(p);
        return new CoverInitializedNameNode(new Range(start,p.pos),ident,init);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Initializer

function Initializer(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("=");
        p.skipWhitespace();
        return AssignmentExpression(p);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.2.9

// TemplateLiteral

function TemplateLiteral(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// TemplateSpans

function TemplateSpans(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// TemplateMiddleList

function TemplateMiddleList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.3

// MemberExpression_new

function MemberExpression_new(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("new");
        p.skipWhitespace();
        const expr = MemberExpression(p);
        p.skipWhitespace();
        const args = Arguments(p);
        return new NewExpressionNode(new Range(start,p.pos),expr,args);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// MemberExpression_start

function MemberExpression_start(p: Parser): ASTNode {
    try { return PrimaryExpression(p); } catch (e) {}
    try { return SuperProperty(p); } catch (e) {}
    try { return MetaProperty(p); } catch (e) {}
    try { return MemberExpression_new(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected MemberExpression");
}

// MemberExpression

function MemberExpression(p: Parser): ASTNode {
    const start = p.pos;
    try {
        let left = MemberExpression_start(p);
        while (true) {
            const start2 = p.pos;
            try {
                p.skipWhitespace();
                if (p.matchPunctuator("[")) {
                    p.skipWhitespace();
                    const expr = Expression(p);
                    p.skipWhitespace();
                    p.expectPunctuator("]");
                    left = new MemberAccessExprNode(new Range(start,p.pos),left,expr);
                }
                else if (p.matchPunctuator(".")) {
                    p.skipWhitespace();
                    const ident = IdentifierName(p);
                    p.skipWhitespace();
                    left = new MemberAccessIdentNode(new Range(start,p.pos),left,ident);
                }
                else {
                    // FIXME: TemplateLiteral
                    throw new ParseError(p,p.pos,"No more parts to MemberExpression");
                }
            }
            catch (e) {
                p.pos = start2;
                return left;
            }
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// SuperProperty

function SuperProperty(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("super");
        p.skipWhitespace();
        if (p.matchPunctuator(".")) {
            p.skipWhitespace();
            const ident = Identifier(p);
            return new SuperPropertyNode(new Range(start,p.pos),ident);
        }
        else if (p.matchPunctuator("[")) {
            p.skipWhitespace();
            const expr = Expression(p);
            p.skipWhitespace();
            p.expectPunctuator("]");
            return new SuperPropertyNode(new Range(start,p.pos),expr);
        }
        else {
            throw new ParseError(p,p.pos,"Expected SuperProperty");
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// MetaProperty

function MetaProperty(p: Parser): ASTNode {
    return NewTarget(p);
}

// NewTarget

function NewTarget(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("super");
        p.skipWhitespace();
        p.expectPunctuator(".");
        p.skipWhitespace();
        p.expectKeyword("target");
        return new NewTargetNode(new Range(start,p.pos));
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// NewExpression

function NewExpression(p: Parser): ASTNode {
    const start = p.pos;
    try {
        if (p.matchPunctuator("new")) {
            p.skipWhitespace();
            return MemberExpression(p);
        }
        else {
            return MemberExpression(p);
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CallExpression_start

function CallExpression_start(p: Parser): ASTNode {
    try { return SuperCall(p); } catch (e) {}

    const start = p.pos;
    try {
        const fun = MemberExpression(p);
        p.skipWhitespace();
        const args = Arguments(p);
        return new CallNode(new Range(start,p.pos),fun,args);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CallExpression

function CallExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = CallExpression_start(p);
    while (true) {
        const start2 = p.pos;
        try {
            try {
                p.skipWhitespace();
                const right = Arguments(p);
                left = new CallNode(new Range(start,p.pos),left,right);
                continue;
            }
            catch (e) {
                p.pos = start2;
            }

            try {
                p.skipWhitespace();
                p.expectPunctuator("[");
                p.skipWhitespace();
                const right = Expression(p);
                p.skipWhitespace();
                p.expectPunctuator("]");
                left = new MemberAccessExprNode(new Range(start,p.pos),left,right);
                continue;
            }
            catch (e) {
                p.pos = start2;
            }

            try {
                p.expectPunctuator(".");
                p.skipWhitespace();
                const right = IdentifierName(p);
                left = new MemberAccessIdentNode(new Range(start,p.pos),left,right);
                continue;
            }
            catch (e) {
                p.pos = start2;
            }

            try {
                left = TemplateLiteral(p);
                continue;
            }
            catch (e) {}

            throw new ParseIgnore();
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// SuperCall

function SuperCall(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("super");
        p.skipWhitespace();
        const args = Arguments(p);
        throw new SuperCallNode(new Range(start,p.pos),args);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}


// Arguments

function Arguments(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("(");
        p.skipWhitespace();
        p.expectPunctuator(")");
        const args = new ListNode(new Range(start,p.pos),[]);
        return new ArgumentsNode(new Range(start,p.pos),args);
    }
    catch (e) {
        p.pos = start;
    }

    try {
        p.expectPunctuator("(")
        p.skipWhitespace();
        const args = ArgumentList(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        return new ArgumentsNode(new Range(start,p.pos),args);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ArgumentList_item

function ArgumentList_item(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("...");
        p.skipWhitespace();
        const expr = AssignmentExpression(p);
        return new SpreadElementNode(new Range(start,p.pos),expr);
    }
    catch (e) {
        p.pos = start;
    }

    return AssignmentExpression(p);
}

// ArgumentList

function ArgumentList(p: Parser): ASTNode {
    const start = p.pos;
    const items: ASTNode[] = [];
    items.push(ArgumentList_item(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            items.push(ArgumentList_item(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),items);
        }
    }
}

// LeftHandSideExpression

function LeftHandSideExpression(p: Parser): ASTNode {
    // TODO: The following is just a hack to get us to primary expressions
    return PrimaryExpression(p);
}

// Section 12.4

// PostfixExpression

function PostfixExpression(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const expr = LeftHandSideExpression(p);
        const start2 = p.pos;

        p.skipWhitespaceNoNewline();
        if (p.matchPunctuator("++")) {
            return new PostIncrementNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("--")) {
            return new PostDecrementNode(new Range(start,p.pos),expr);
        }
        else {
            p.pos = start2;
            return expr;
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.5

// UnaryExpression

function UnaryExpression(p: Parser): ASTNode {
    const start = p.pos;
    try {
        if (p.matchKeyword("delete")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new DeleteNode(new Range(start,p.pos),expr);
        }
        else if (p.matchKeyword("void")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new VoidNode(new Range(start,p.pos),expr);
        }
        else if (p.matchKeyword("typeof")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new TypeOfNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("++")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new PreIncrementNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("--")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new PreDecrementNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("+")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new UnaryPlusNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("-")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new UnaryMinusNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("~")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new UnaryBitwiseNotNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("!")) {
            p.skipWhitespace();
            const expr = UnaryExpression(p);
            return new UnaryLogicalNotNode(new Range(start,p.pos),expr);
        }
        else {
            return PrimaryExpression(p);
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = UnaryExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("*")) {
                p.skipWhitespace();
                const right = UnaryExpression(p);
                left = new DivideNode(new Range(start,p.pos),left,right);
            }
            else if (p.lookaheadPunctuator("/")) {
                p.expectPunctuator("/");
                p.skipWhitespace();
                const right = UnaryExpression(p);
                left = new MultiplyNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator("%")) {
                p.skipWhitespace();
                const right = UnaryExpression(p);
                left = new ModuloNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.7

// AdditiveExpression

function AdditiveExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = MultiplicativeExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("+")) {
                p.skipWhitespace();
                const right = MultiplicativeExpression(p);
                left = new AddNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator("-")) {
                p.skipWhitespace();
                const right = MultiplicativeExpression(p);
                left = new SubtractNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.8

// ShiftExpression

function ShiftExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = AdditiveExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("<<")) {
                p.skipWhitespace();
                const right = AdditiveExpression(p);
                left = new LeftShiftNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator(">>>")) {
                p.skipWhitespace();
                const right = AdditiveExpression(p);
                left = new UnsignedRightShiftNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator(">>")) {
                p.skipWhitespace();
                const right = AdditiveExpression(p);
                left = new SignedRightShiftNode(new Range(start,p.pos),left,right);
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.9

// RelationalExpression

function RelationalExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = ShiftExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("<=")) {
                p.skipWhitespace();
                const right = ShiftExpression(p);
                left = new LessEqualNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator(">=")) {
                p.skipWhitespace();
                const right = ShiftExpression(p);
                left = new GreaterEqualNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator("<")) {
                p.skipWhitespace();
                const right = ShiftExpression(p);
                left = new LessThanNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator(">")) {
                p.skipWhitespace();
                const right = ShiftExpression(p);
                left = new GreaterThanNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchKeyword("instanceof")) {
                p.skipWhitespace();
                const right = ShiftExpression(p);
                left = new InstanceOfNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchKeyword("in")) {
                p.skipWhitespace();
                const right = ShiftExpression(p);
                left = new InNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.10

// EqualityExpression

function EqualityExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = RelationalExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("===")) {
                p.skipWhitespace();
                const right = RelationalExpression(p);
                left = new StrictEqualsNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator("!==")) {
                p.skipWhitespace();
                const right = RelationalExpression(p);
                left = new StrictNotEqualsNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator("==")) {
                p.skipWhitespace();
                const right = RelationalExpression(p);
                left = new AbstractEqualsNode(new Range(start,p.pos),left,right);
            }
            else if (p.matchPunctuator("!=")) {
                p.skipWhitespace();
                const right = RelationalExpression(p);
                left = new AbstractNotEqualsNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = EqualityExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("&")) {
                p.skipWhitespace();
                const right = EqualityExpression(p);
                left = new BitwiseANDNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// BitwiseXORExpression

function BitwiseXORExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = BitwiseANDExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("^")) {
                p.skipWhitespace();
                const right = BitwiseANDExpression(p);
                left = new BitwiseXORNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// BitwiseORExpression

function BitwiseORExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = BitwiseXORExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("|")) {
                p.skipWhitespace();
                const right = BitwiseXORExpression(p);
                left = new BitwiseORNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = BitwiseORExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("&&")) {
                p.skipWhitespace();
                const right = BitwiseORExpression(p);
                left = new LogicalANDNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// LogicalORExpression

function LogicalORExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = LogicalANDExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            if (p.matchPunctuator("||")) {
                p.skipWhitespace();
                const right = LogicalANDExpression(p);
                left = new LogicalORNode(new Range(start,p.pos),left,right);
            }
            else {
                throw new ParseIgnore();
            }
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

// Section 12.13

// ConditionalExpression

function ConditionalExpression(p: Parser): ASTNode {
    const start = p.pos;
    let condition = LogicalORExpression(p);
    try {
        p.skipWhitespace();
        p.expectPunctuator("?");
        p.skipWhitespace();
        const trueExpr = AssignmentExpression(p);
        p.skipWhitespace();
        const falseExpr = AssignmentExpression(p);
        return new ConditionalNode(new Range(start,p.pos),condition,trueExpr,falseExpr);
    }
    catch (e) {
        p.pos = start;
        return condition;
    }
}

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const left = LeftHandSideExpression(p);
        p.skipWhitespace();
        if (p.matchPunctuator("*=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignMultiplyNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("/=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignDivideNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("%=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignModuloNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("+=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignAddNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("-=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignSubtractNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("<<=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignLeftShiftNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator(">>=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignSignedRightShiftNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator(">>>=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignUnsignedRightShiftNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("&=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignBitwiseANDNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("^=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignBitwiseXORNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("|=")) {
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            return new AssignBitwiseORNode(new Range(start,p.pos),left,right);
        }
        else {
            throw new ParseError(p,p.pos,"Invalid assignment expression");
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// AssignmentExpression

function AssignmentExpression(p: Parser): ASTNode {
    // FIXME: Some of the match calls here will not work, because they will be caught by
    // expressions further down, e.g. * will match instead of *=. We need a matchToken() method
    // which knows about all the tokens and only checks the longest one.
    try { return AssignmentExpression_plain(p); } catch (e) {}
    try { return ConditionalExpression(p); } catch (e) {}
    try { return YieldExpression(p); } catch (e) {}
    try { return ArrowFunction(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected AssignmentExpression");
}

// Section 12.15

// Expression

function Expression(p: Parser): ASTNode {
    const start = p.pos;
    let left = AssignmentExpression(p);
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            const right = AssignmentExpression(p);
            left = new CommaNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            p.pos = start2;
            return left;
        }
    }
}

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

function BlockStatement(p: Parser): ASTNode {
    return Block(p);
}

// Block

function Block(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("{");
        p.skipWhitespace();
        const statements = StatementList(p);
        p.skipWhitespace();
        p.expectPunctuator("}");
        return new BlockNode(new Range(start,p.pos),statements);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// StatementList

function StatementList(p: Parser): ASTNode {
    const start = p.pos;
    const statements: ASTNode[] = [];
    statements.push(StatementListItem(p));
    while (true) {
        try {
            statements.push(StatementListItem(p));
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),statements);
        }
    }
}

// StatementListItem

function StatementListItem(p: Parser): ASTNode {
    try { return Statement(p); } catch (e) {}
    try { return Declaration(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected Statement or Declaration");
}

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(p: Parser): ASTNode {
    const start = p.pos;
    try {
        if (p.matchKeyword("let")) {
            p.skipWhitespace();
            const bindings = BindingList(p);
            return new LetNode(new Range(start,p.pos),bindings);
        }
        else if (p.matchKeyword("const")) {
            p.skipWhitespace();
            const bindings = BindingList(p);
            return new ConstNode(new Range(start,p.pos),bindings);
        }
        else {
            throw new ParseError(p,p.pos,"Expected let or const");
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// BindingList

function BindingList(p: Parser): ASTNode {
    const start = p.pos;
    const bindings: ASTNode[] = [];
    bindings.push(LexicalBinding(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            bindings.push(LexicalBinding(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),bindings);
        }
    }
}

// LexicalBinding_identifier

function LexicalBinding_identifier(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const identifier = BindingIdentifier(p);
        const initializer = Initializer(p);
        return new LexicalIdentifierBindingNode(new Range(start,p.pos),identifier,initializer);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// LexicalBinding_pattern

function LexicalBinding_pattern(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const pattern = BindingPattern(p);
        const initializer = Initializer(p);
        return new LexicalPatternBindingNode(new Range(start,p.pos),pattern,initializer);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// LexicalBinding

function LexicalBinding(p: Parser): ASTNode {
    try { return LexicalBinding_identifier(p); } catch (e) {}
    try { return LexicalBinding_pattern(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected LexicalBinding");
}

// Section 13.3.2

// VariableStatement

function VariableStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("var");
        const declarations = VariableDeclarationList(p);
        return new VarNode(new Range(start,p.pos),declarations);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// VariableDeclarationList

function VariableDeclarationList(p: Parser): ASTNode {
    const start = p.pos;
    const declarations: ASTNode[] = [];
    declarations.push(VariableDeclaration(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            declarations.push(VariableDeclaration(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),declarations);
        }
    }
}

// VariableDeclaration_identifier

function VariableDeclaration_identifier(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const identifier = BindingIdentifier(p);
        const initializer = Initializer(p);
        return new VarIdentifierBindingNode(new Range(start,p.pos),identifier,initializer);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// VariableDeclaration_pattern

function VariableDeclaration_pattern(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const pattern = BindingPattern(p);
        const initializer = Initializer(p);
        return new VarPatternBindingNode(new Range(start,p.pos),pattern,initializer);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// VariableDeclaration

function VariableDeclaration(p: Parser): ASTNode {
    try { return VariableDeclaration_identifier(p); } catch (e) {}
    try { return VariableDeclaration_pattern(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected VariableDeclaration");
}

// Section 13.3.3

// BindingPattern

function BindingPattern(p: Parser): ASTNode {
    try { return ObjectBindingPattern(p); } catch (e) {}
    try { return ArrayBindingPattern(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected BindingPattern");
}

// ObjectBindingPattern

function ObjectBindingPattern(p: Parser): ASTNode {
    const start = p.pos;
    try {
        let properties: ASTNode = null;
        p.expectPunctuator("{");
        p.skipWhitespace();

        const start2 = p.pos;
        try {
            properties = BindingPropertyList(p);
            p.skipWhitespace();

            const start3 = p.pos;
            try {
                p.expectPunctuator(",");
                p.skipWhitespace();
            }
            catch (e) {
                p.pos = start3;
            }
        }
        catch (e) {
            p.pos = start2;
        }

        p.expectPunctuator("}");
        if (properties = null)
            properties = new ListNode(new Range(start,p.pos),[]);
        return new ObjectBindingPatternNode(new Range(start,p.pos),properties);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ArrayBindingPattern_1

function ArrayBindingPattern_1(p: Parser): ASTNode {
    const start = p.pos;
    try {
        let elision: ASTNode = null;
        let rest: ASTNode = null;
        p.expectPunctuator("[]");
        p.skipWhitespace();

        const start2 = p.pos;
        try {
            elision = Elision(p);
            p.skipWhitespace();
        }
        catch (e) {
            p.pos = start2;
        }

        const start3 = p.pos;
        try {
            rest = BindingRestElement(p);
            p.skipWhitespace();
        }
        catch (e) {
            p.pos = start3;
        }

        p.expectPunctuator("]");

        return new ArrayBindingPattern1Node(new Range(start,p.pos),elision,rest);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ArrayBindingPattern_2

function ArrayBindingPattern_2(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("[]");
        p.skipWhitespace();
        const elements = BindingElementList(p);
        p.skipWhitespace();
        p.expectPunctuator("]");
        return new ArrayBindingPattern2Node(new Range(start,p.pos),elements);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ArrayBindingPattern_3

function ArrayBindingPattern_3(p: Parser): ASTNode {
    const start = p.pos;
    try {
        let elision: ASTNode = null;
        let rest: ASTNode = null;
        p.expectPunctuator("[");
        p.skipWhitespace();
        const elements = BindingElementList(p);
        p.skipWhitespace();
        p.expectPunctuator(",");
        p.skipWhitespace();

        const start2 = p.pos;
        try {
            elision = Elision(p);
            p.skipWhitespace();
        }
        catch (e) {
            p.pos = start2;
        }

        const start3 = p.pos;
        try {
            rest = BindingRestElement(p);
            p.skipWhitespace();
        }
        catch (e) {
            p.pos = start3;
        }

        p.expectPunctuator("]");
        return new ArrayBindingPattern3Node(new Range(start,p.pos),elements,elision,rest);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ArrayBindingPattern

function ArrayBindingPattern(p: Parser): ASTNode {
    try { return ArrayBindingPattern_1(p); } catch (e) {}
    try { return ArrayBindingPattern_2(p); } catch (e) {}
    try { return ArrayBindingPattern_3(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ArrayBindingPattern");
}

// BindingPropertyList

function BindingPropertyList(p: Parser): ASTNode {
    const start = p.pos;
    const properties: ASTNode[] = [];
    properties.push(BindingProperty(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            properties.push(BindingProperty(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),properties);
        }
    }
}

// BindingElementList

function BindingElementList(p: Parser): ASTNode {
    const start = p.pos;
    const elements: ASTNode[] = [];
    elements.push(BindingElisionElement(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            elements.push(BindingElisionElement(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// BindingElisionElement

function BindingElisionElement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const elision = Elision(p);
        p.skipWhitespace();
        const element = BindingElement(p);
        return new BindingElisionElementNode(new Range(start,p.pos),elision,element);
    }
    catch (e) {
        p.pos = start;
    }

    return BindingElement(p);
}

// BindingProperty

function BindingProperty(p: Parser): ASTNode {
    try { return SingleNameBinding(p); } catch (e) {}

    const start = p.pos;
    try {
        const name = PropertyName(p);
        p.skipWhitespace();
        const element = BindingElement(p);
        return new BindingPropertyNode(new Range(start,p.pos),name,element);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// BindingElement

function BindingElement(p: Parser): ASTNode {
    try { return SingleNameBinding(p); } catch (e) {}

    const start = p.pos;
    try {
        const pattern = BindingPattern(p);
        p.skipWhitespace();
        const init = Initializer(p);
        return new BindingPatternInitNode(new Range(start,p.pos),pattern,init);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// SingleNameBinding

function SingleNameBinding(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const ident = BindingIdentifier(p);
        p.skipWhitespace();
        const init = Initializer(p);
        return new SingleNameBindingNode(new Range(start,p.pos),ident,init);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// BindingRestElement

function BindingRestElement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("...");
        p.skipWhitespace();
        const ident = BindingIdentifier(p);
        return new BindingRestElementNode(new Range(start,p.pos),ident);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.4

// EmptyStatement

function EmptyStatement(p: Parser): ASTNode {
    const start = p.pos;
    p.expectPunctuator(";");
    return new EmptyStatementNode(new Range(start,p.pos));
}

// Section 13.5

// ExpressionStatement

function ExpressionStatement(p: Parser): ASTNode {
    if (p.lookaheadKeyword("function") || p.lookaheadKeyword("class") || p.lookaheadKeyword("let") || p.lookaheadPunctuator("["))
        throw new ParseIgnore();
    const start = p.pos;
    try {
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new ExpressionStatementNode(new Range(start,p.pos),expr);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.6

// IfStatement

function IfStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("if");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const condition = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        const trueBranch = Statement(p);

        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator("else");
            p.skipWhitespace();
            const falseBranch = Statement(p);
            return new IfStatementNode(new Range(start,p.pos),condition,trueBranch,falseBranch);
        }
        catch (e) {
            p.pos = start2;
            return new IfStatementNode(new Range(start,p.pos),condition,trueBranch,null);
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.7

// IterationStatement_do

function IterationStatement_do(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("do");
        p.skipWhitespace();
        const body = Statement(p);
        p.skipWhitespace();
        p.expectKeyword("while");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const condition = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new DoStatementNode(new Range(start,p.pos),body,condition);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// IterationStatement_while

function IterationStatement_while(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("while");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const condition = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        const body = Statement(p);
        return new WhileStatementNode(new Range(start,p.pos),condition,body);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// IterationStatement_for

function IterationStatement_for(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("for");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();

        // TODO: This only supports the C-style for syntax (init; condition; update), not in/of
        // TODO: Need to handle cases of let, var at start
        let init: ASTNode = null;
        let condition: ASTNode = null;
        let update: ASTNode = null;

        try { init = Expression(p); } catch (e) {}
        p.skipWhitespace();
        p.expectPunctuator(";");
        p.skipWhitespace();
        try { condition = Expression(p); } catch (e) {}
        p.skipWhitespace();
        p.expectPunctuator(";");
        p.skipWhitespace();
        try { update = Expression(p); } catch (e) {}
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        const body = Statement(p);

        const range = new Range(start,p.pos);
        return new ForStatementNode(range,init,condition,update,body);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// IterationStatement

function IterationStatement(p: Parser): ASTNode {
    if (p.lookaheadKeyword("do"))
        return IterationStatement_do(p);
    else if (p.lookaheadKeyword("while"))
        return IterationStatement_while(p);
    else if (p.lookaheadKeyword("for"))
        return IterationStatement_for(p);
    else
        throw new ParseError(p,p.pos,"Expected do, while, or for");
}

// ForDeclaration

function ForDeclaration(p: Parser): ASTNode {
    const start = p.pos;
    try {
        if (p.matchKeyword("let")) {
            p.skipWhitespace();
            const binding = ForBinding(p);
            return new LetForDeclarationNode(new Range(start,p.pos),binding);
        }
        else if (p.matchKeyword("const")) {
            p.skipWhitespace();
            const binding = ForBinding(p);
            return new ConstForDeclarationNode(new Range(start,p.pos),binding);
        }
        else {
            throw new ParseError(p,p.pos,"Expected let or const");
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ForBinding

function ForBinding(p: Parser): ASTNode {
    try { return BindingIdentifier(p); } catch (e) {}
    try { return BindingPattern(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected BindingIdentifier or BindingPattern");
}

// Section 13.8

// ContinueStatement

function ContinueStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("continue");
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new ContinueStatementNode(new Range(start,p.pos),null);
    }
    catch (e) {
        p.pos = start;
    }

    try {
        p.expectKeyword("continue");
        p.skipWhitespaceNoNewline();
        const labelIdentifier = LabelIdentifier(p);
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new ContinueStatementNode(new Range(start,p.pos),labelIdentifier);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.9

// BreakStatement

function BreakStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("break");
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new BreakStatementNode(new Range(start,p.pos),null);
    }
    catch (e) {
        p.pos = start;
    }

    try {
        p.expectKeyword("break");
        p.skipWhitespaceNoNewline();
        const labelIdentifier = LabelIdentifier(p);
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new BreakStatementNode(new Range(start,p.pos),labelIdentifier);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.10

// ReturnStatement

function ReturnStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("return");
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new ReturnStatementNode(new Range(start,p.pos),null);
    }
    catch (e) {
        p.pos = start;
    }

    try {
        p.expectKeyword("return");
        p.skipWhitespaceNoNewline();
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new ReturnStatementNode(new Range(start,p.pos),expr);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.11

// WithStatement

function WithStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("with");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        const body = Statement(p);
        return new WithStatementNode(new Range(start,p.pos),expr,body);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.12

// SwitchStatement

function SwitchStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("switch");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        const cases = CaseBlock(p);
        return new SwitchStatementNode(new Range(start,p.pos),expr,cases);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CaseBlock_1

function CaseBlock_1(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("{");
        p.skipWhitespace();
        let clauses: ASTNode = null;
        try { clauses = CaseClauses(p); } catch (e) {}
        p.skipWhitespace();
        p.expectPunctuator("}");
        if (clauses == null)
            clauses = new ListNode(new Range(start,p.pos),[]);
        return clauses;
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CaseBlock_2

function CaseBlock_2(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const start = p.pos;
        try {
            p.expectPunctuator("{");
            p.skipWhitespace();
            let clauses1: ASTNode[] = [];
            let clauses2: ASTNode[] = [];
            try { clauses1 = CaseClauses(p).elements; } catch (e) {}
            p.skipWhitespace();
            const defaultClause = DefaultClause(p);
            p.skipWhitespace();
            try { clauses2 = CaseClauses(p).elements; } catch (e) {}
            p.skipWhitespace();
            p.expectPunctuator("}");

            const combined = [].concat(clauses1,defaultClause,clauses2);
            return new ListNode(new Range(start,p.pos),combined);
        }
        catch (e) {
            p.pos = start;
            throw e;
        }
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CaseBlock

function CaseBlock(p: Parser): ASTNode {
    try { return CaseBlock_1(p); } catch (e) {}
    try { return CaseBlock_2(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected CaseBlock");
}

// CaseClauses

function CaseClauses(p: Parser): ListNode {
    const start = p.pos;
    const clauses: ASTNode[] = [];
    clauses.push(CaseClause(p));
    while (true) {
        const start2 = p.pos;
        try {
            clauses.push(CaseClause(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),clauses);
        }
    }
}

// CaseClause

function CaseClause(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("case");
        p.skipWhitespace();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(":");
        p.skipWhitespace();
        const statements = StatementList(p);
        return new CaseClauseNode(new Range(start,p.pos),expr,statements);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// DefaultClause

function DefaultClause(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("default");
        p.skipWhitespace();
        p.expectPunctuator(":");
        p.skipWhitespace();
        const statements = StatementList(p);
        return new DefaultClauseNode(new Range(start,p.pos),statements);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.13

// LabelledStatement

function LabelledStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const ident = LabelIdentifier(p);
        p.skipWhitespace();
        const item = LabelledItem(p);
        return new LabelledStatementNode(new Range(start,p.pos),ident,item);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// LabelledItem

function LabelledItem(p: Parser): ASTNode {
    try { return Statement(p); } catch (e) {}
    try { return FunctionDeclaration(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected Statement or FunctionDeclaration");
}

// Section 13.14

// ThrowStatement

function ThrowStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("throw");
        p.skipWhitespaceNoNewline();
        const expr = Expression(p);
        p.skipWhitespace();
        p.expectPunctuator(";");
        return new ThrowStatementNode(new Range(start,p.pos),expr);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 13.15

// TryStatement

function TryStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("try");
        p.skipWhitespace();
        const tryBlock = Block(p);
        let catchBlock: ASTNode = null;
        let finallyBlock: ASTNode = null;

        const start2 = p.pos;
        try {
            p.skipWhitespace();
            finallyBlock = Finally(p);
        }
        catch (e) {
            p.pos = start2;
        }

        if (finallyBlock == null) {
            p.skipWhitespace();
            catchBlock = Catch(p);

            const start3 = p.pos;
            try {
                p.skipWhitespace();
                finallyBlock = Finally(p);
            }
            catch (e) {
                p.pos = start3;
            }
        }

        return new TryStatementNode(new Range(start,p.pos),tryBlock,catchBlock,finallyBlock);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Catch

function Catch(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("catch");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const param = CatchParameter(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        const block = Block(p);
        return new CatchNode(new Range(start,p.pos),param,block);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Finally

function Finally(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("finally");
        p.skipWhitespace();
        const block = Block(p);
        return new FinallyNode(new Range(start,p.pos),block);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// CatchParameter

function CatchParameter(p: Parser): ASTNode {
    try { return BindingIdentifier(p); } catch (e) {}
    try { return BindingPattern(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected BindingIdentifier or BindingPattern");
}

// Section 13.16

// DebuggerStatement

function DebuggerStatement(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("debugger");
        return new DebuggerStatementNode(new Range(start,p.pos));
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("function");
        p.skipWhitespace();
        const ident = BindingIdentifier(p);
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const params = FormalParameters(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        p.expectPunctuator("{");
        p.skipWhitespace();
        const body = FunctionBody(p);
        p.skipWhitespace();
        p.expectPunctuator("}");
        return new FunctionNode(new Range(start,p.pos),ident,params,body);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("function");
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const params = FormalParameters(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        p.expectPunctuator("{");
        p.skipWhitespace();
        const body = FunctionBody(p);
        p.skipWhitespace();
        p.expectPunctuator("}");
        return new FunctionNode(new Range(start,p.pos),null,params,body);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// FunctionDeclaration

function FunctionDeclaration(p: Parser): ASTNode {
    try { return FunctionDeclaration_named(p); } catch (e) {}
    try { return FunctionDeclaration_unnamed(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected FunctionDeclaration");
}

// FunctionExpression

function FunctionExpression(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("function");
        p.skipWhitespace();
        let ident: ASTNode = null;
        try { ident = BindingIdentifier(p); p.skipWhitespace() } catch (e) {}
        p.skipWhitespace();
        p.expectPunctuator("(");
        p.skipWhitespace();
        const params = FormalParameters(p);
        p.skipWhitespace();
        p.expectPunctuator(")");
        p.skipWhitespace();
        p.expectPunctuator("{");
        p.skipWhitespace();
        const body = FunctionBody(p);
        p.skipWhitespace();
        p.expectPunctuator("}");
        return new FunctionNode(new Range(start,p.pos),null,params,body);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

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

export function Script(p: Parser): ASTNode {
    const start = p.pos;
    let body: ASTNode = null;
    try { body = ScriptBody(p); } catch (e) {}
    if (body == null)
        body = new ListNode(new Range(start,p.pos),[]);
    return new ScriptNode(new Range(start,p.pos),body);
}

// ScriptBody

function ScriptBody(p: Parser): ASTNode {
    return StatementList(p);
}

// Section 15.2

// Module

function Module(p: Parser): ASTNode {
    const start = p.pos;
    let body: ASTNode = null;
    try { body = ModuleBody(p); } catch (e) {}
    if (body == null)
        body = new ListNode(new Range(start,p.pos),[]);
    return new ModuleNode(new Range(start,p.pos),body);
}

// ModuleBody

function ModuleBody(p: Parser): ASTNode {
    return ModuleItemList(p);
}

// ModuleItemList

function ModuleItemList(p: Parser): ASTNode {
    const start = p.pos;
    const items: ASTNode[] = [];
    items.push(ModuleItem(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            items.push(ModuleItem(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),items);
        }
    }
}

// ModuleItem

function ModuleItem(p: Parser): ASTNode {
    try { return ImportDeclaration(p); } catch (e) {}
    try { return ExportDeclaration(p); } catch (e) {}
    try { return StatementListItem(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ModuleItem");
}

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("import");
        p.skipWhitespace();
        const importClause = ImportClause(p);
        p.skipWhitespace();
        const fromClause = FromClause(p);
        return new ImportFromNode(new Range(start,p.pos),importClause,fromClause);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ImportDeclaration_module

function ImportDeclaration_module(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("import");
        p.skipWhitespace();
        const specifier = ModuleSpecifier(p);
        return new ImportModuleNode(new Range(start,p.pos),specifier);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ImportDeclaration

function ImportDeclaration(p: Parser): ASTNode {
    try { return ImportDeclaration_from(p); } catch (e) {}
    try { return ImportDeclaration_module(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ImportDeclaration");
}

// ImportClause

function ImportClause(p: Parser): ASTNode {
    try { return NameSpaceImport(p); } catch (e) {}
    try { return NamedImports(p); } catch (e) {}

    const start = p.pos;
    try {
        const defaultBinding = ImportedDefaultBinding(p);

        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            const nameSpaceImport = NameSpaceImport(p);
            return new DefaultAndNameSpaceImportsNode(new Range(start,p.pos),defaultBinding,nameSpaceImport);
        }
        catch (e) {
            p.pos = start2;
        }

        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            const namedImports = NamedImports(p);
            return new DefaultAndNamedImportsNode(new Range(start,p.pos),defaultBinding,namedImports);
        }
        catch (e) {
            p.pos = start2;
        }

        return NameSpaceImport(p);
    }
    catch (e) {
        p.pos = start;
    }
}

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): ASTNode {
    return ImportedBinding(p);
}

// NameSpaceImport

function NameSpaceImport(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("*");
        p.skipWhitespace();
        p.expectKeyword("as");
        p.skipWhitespace();
        const binding = ImportedBinding(p);
        return new NameSpaceImportNode(new Range(start,p.pos),binding);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// NamedImports

function NamedImports(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("{");
        p.skipWhitespace();
        let imports: ASTNode = null;

        const start2 = p.pos;
        try {
            imports = ImportsList(p);
            p.skipWhitespace();

            const start3 = p.pos;
            try {
                p.expectPunctuator(",");
                p.skipWhitespace();
            }
            catch (e) {
                p.pos = start3;
            }
        }
        catch (e) {
            p.pos = start2;
        }

        p.expectPunctuator("}");
        if (imports == null)
            imports = new ListNode(new Range(start,p.pos),[]);
        return new NamedImportsNode(new Range(start,p.pos),imports);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// FromClause

function FromClause(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectPunctuator("from");
        return ModuleSpecifier(p);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ImportsList

function ImportsList(p: Parser): ASTNode {
    const start = p.pos;
    const imports: ASTNode[] = [];
    imports.push(ImportSpecifier(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            imports.push(ImportSpecifier(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),imports);
        }
    }
}

// ImportSpecifier

function ImportSpecifier(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const name = IdentifierName(p);
        p.skipWhitespace();
        p.expectKeyword("as");
        p.skipWhitespace();
        const binding = ImportedBinding(p);
        return new ImportAsSpecifierNode(new Range(start,p.pos),name,binding);
    }
    catch (e) {
        p.pos = start;
    }

    try {
        return ImportedBinding(p);
    }
    catch (e) {
        p.pos = start;
    }

    throw new ParseError(p,p.pos,"Expected ImportSpecifier");
}

// ModuleSpecifier

function ModuleSpecifier(p: Parser): ASTNode {
    return StringLiteral(p);
}

// ImportedBinding

function ImportedBinding(p: Parser): ASTNode {
    return BindingIdentifier(p);
}

// Section 15.2.3

// ExportDeclaration

function ExportDeclaration(p: Parser): ASTNode {
    const start = p.pos;
    try {
        p.expectKeyword("export");
        p.skipWhitespace();

        if (p.matchKeyword("default")) {
            p.skipWhitespace();

            // FIXME: Not sure about the order of these
            try { return HoistableDeclaration(p); } catch (e) {}
            try { return ClassDeclaration(p); } catch (e) {}
            if (!p.lookaheadKeyword("function") && !p.lookaheadKeyword("class"))
                try { return AssignmentExpression(p); } catch (e) {}
        }
        else if (p.matchPunctuator("*")) {
            p.skipWhitespace();
            const fromClause = FromClause(p);
            p.skipWhitespace();
            p.expectPunctuator(";");
            return fromClause;
        }
        else {
            const start2 = p.pos;

            try {
                const exportClause = ExportClause(p);
                p.skipWhitespace();
                const fromClause = FromClause(p);
                p.skipWhitespace();
                p.expectPunctuator(";");
                return new ExportFromNode(new Range(start,p.pos),exportClause,fromClause);
            }
            catch (e) {
                p.pos = start2;
            }

            try {
                const exportClause = ExportClause(p);
                p.skipWhitespace();
                p.expectPunctuator(";");
                return exportClause;
            }
            catch (e) {
                p.pos = start2;
            }

            try { return VariableStatement(p); } catch (e) {}
            try { return Declaration(p); } catch (e) {}
        }
        throw new ParseError(p,p.pos,"Expected ExportDeclaration");
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ExportClause

function ExportClause(p: Parser): ASTNode {
    const start = p.pos;
    try {
        let exports: ASTNode = null;

        p.expectPunctuator("{");
        p.skipWhitespace();

        const start2 = p.pos;
        try {
            exports = ExportsList(p);
            p.skipWhitespace();

            const start3 = p.pos;
            try {
                p.expectPunctuator(",");
                p.skipWhitespace();
            }
            catch (e) {
                p.pos = start3;
            }
        }
        catch (e) {
            p.pos = start2;
        }

        p.expectPunctuator("}");
        if (exports == null)
            exports = new ListNode(new Range(start,p.pos),[]);
        return new ExportClauseNode(new Range(start,p.pos),exports);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}

// ExportsList

function ExportsList(p: Parser): ASTNode {
    const start = p.pos;
    const exports: ASTNode[] = [];
    exports.push(ExportSpecifier(p));
    while (true) {
        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator(",");
            p.skipWhitespace();
            exports.push(ExportSpecifier(p));
        }
        catch (e) {
            p.pos = start2;
            return new ListNode(new Range(start,p.pos),exports);
        }
    }
}

// ExportSpecifier

function ExportSpecifier(p: Parser): ASTNode {
    const start = p.pos;
    try {
        const ident = IdentifierName(p);

        const start2 = p.pos;
        try {
            p.skipWhitespace();
            p.expectPunctuator("as");
            p.skipWhitespace();
            const asIdent = IdentifierName(p);
            return new ExportAsSpecifierNode(new Range(start,p.pos),ident,asIdent);
        }
        catch (e) {
            p.pos = start2;
        }

        return new ExportNormalSpecifierNode(new Range(start,p.pos),ident);
    }
    catch (e) {
        p.pos = start;
        throw e;
    }
}
