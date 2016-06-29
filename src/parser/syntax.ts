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
    isKeyword,
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
    ArrayLiteralNode,
    ElisionNode,
    SpreadElementNode,
    ObjectLiteralNode,
    ColonPropertyDefinitionNode,
    ComputedPropertyNameNode,
    CoverInitializedNameNode,
    MemberAccessExprNode,
    MemberAccessIdentNode,
    SuperPropertyExprNode,
    SuperPropertyIdentNode,
    NewTargetNode,
    NewExpressionNode,
    CallNode,
    SuperCallNode,
    ArgumentsNode,
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
    BlockNode,
    LetNode,
    ConstNode,
    LexicalIdentifierBindingNode,
    LexicalPatternBindingNode,
    VarNode,
    VarIdentifierNode,
    VarPatternNode,
    ObjectBindingPatternNode,
    ArrayBindingPatternNode,
    BindingElisionElementNode,
    BindingPropertyNode,
    BindingPatternInitNode,
    SingleNameBindingNode,
    BindingRestElementNode,
    EmptyStatementNode,
    ExpressionStatementNode,
    IfStatementNode,
    DoStatementNode,
    WhileStatementNode,
    ForCNode,
    ForInNode,
    ForOfNode,
    VarForDeclarationNode,
    LetForDeclarationNode,
    ConstForDeclarationNode,
    ContinueStatementNode,
    BreakStatementNode,
    ReturnStatementNode,
    WithStatementNode,
    SwitchStatementNode,
    CaseClauseNode,
    DefaultClauseNode,
    LabelledStatementNode,
    ThrowStatementNode,
    TryStatementNode,
    CatchNode,
    FinallyNode,
    DebuggerStatementNode,
    FunctionDeclarationNode,
    FunctionExpressionNode,
    ArrowFunctionNode,
    MethodNode,
    GetterNode,
    SetterNode,
    GeneratorMethodNode,
    GeneratorDeclarationNode,
    DefaultGeneratorDeclarationNode,
    GeneratorExpressionNode,
    YieldExprNode,
    YieldStarNode,
    YieldNothingNode,
    ClassDeclarationNode,
    ClassExpressionNode,
    ClassTailNode,
    ExtendsNode,
    StaticMethodDefinitionNode,
    EmptyClassElementNode,
    ScriptNode,
    ModuleNode,
    ImportFromNode,
    ImportModuleNode,
    DefaultAndNameSpaceImportsNode,
    DefaultAndNamedImportsNode,
    DefaultImportNode,
    NameSpaceImportNode,
    NamedImportsNode,
    ImportNormalSpecifierNode,
    ImportSpecifierNode,
    ImportAsSpecifierNode,
    ExportDefaultNode,
    ExportStarNode,
    ExportVariableNode,
    ExportDeclarationNode,
    ExportFromNode,
    ExportClauseNode,
    ExportNormalSpecifierNode,
    ExportAsSpecifierNode,
    ListNode,
    ErrorNode,
} from "./ast";

function keyword(str: string): ((p: Parser) => void) {
    return (p: Parser): void => p.expectKeyword(str);
}

function punctuator(str: string): (p: Parser) => void {
    return (p: Parser): void => p.expectPunctuator(str);
}

function whitespace(p: Parser): void {
    p.skipWhitespace();
}

function whitespaceNoNewline(p: Parser): void {
    p.skipWhitespaceNoNewline();
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
    return p.attempt((start): IdentifierNode => {
        if ((p.cur != null) && isIdStart(p.cur)) {
            p.next();
            while ((p.cur != null) && isIdChar(p.cur))
                p.next();
            const range = new Range(start,p.pos);
            const value = p.text.substring(range.start,range.end);
            if (isKeyword(value))
                throw new ParseError(p,p.pos,"Keyword "+JSON.stringify(value)+" used where identifier expected");
            return new IdentifierNode(range,value);
        }
        else {
            throw new ParseError(p,p.pos,"Expected Identifier");
        }
    });
}

// Section 12.2

// PrimaryExpression

function PrimaryExpression(p: Parser): ASTNode {

    function This(p: Parser): ASTNode {
        const start = p.pos;
        p.sequence([
            keyword("this"),
        ]);
        const range = new Range(start,p.pos);
        return new ThisNode(range);
    }

    try { return This(p); } catch (e) {}
    // Literal must come before IdentifierReference, since "true", "false", and "null" are not keywords
    try { return Literal(p); } catch (e) {}
    try { return IdentifierReference(p); } catch (e) {}
    try { return ArrayLiteral(p); } catch (e) {}
    try { return ObjectLiteral(p); } catch (e) {}
    try { return FunctionExpression(p); } catch (e) {}
    try { return ClassExpression(p); } catch (e) {}
    try { return GeneratorExpression(p); } catch (e) {}
    // try { return RegularExpressionLiteral(p); } catch (e) {} // TODO
    // try { return TemplateLiteral(p); } catch (e) {} // TODO
    try { return ParenthesizedExpression(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected PrimaryExpression");
}

// ParenthesizedExpression

function ParenthesizedExpression(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode;
    p.sequence([
        punctuator("("),
        whitespace,
        () => expr = Expression(p),
        whitespace,
        punctuator(")"),
    ]);
    expr.range = new Range(start,p.pos);
    return expr;
}

// Section 12.2.4

// Literal

function Literal(p: Parser): ASTNode {
    try { return NullLiteral(p); } catch (e) {}
    try { return BooleanLiteral(p); } catch (e) {}
    try { return NumericLiteral(p); } catch (e) {}
    try { return StringLiteral(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected null, true, false, number, or string");
}

// NullLiteral

function NullLiteral(p: Parser): ASTNode {
    const start = p.pos;
    p.sequence([
        keyword("null"),
    ]);
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
    return p.attempt((start): ASTNode => {
        while ((p.cur != null) && (p.cur >= "0") && (p.cur <= "9"))
            p.next();
        if (p.pos == start)
            throw new ParseError(p,p.pos,"Expected number");
        if (p.cur == ".") {
            p.next();
            const postDecimal = p.pos;
            while ((p.cur != null) && (p.cur >= "0") && (p.cur <= "9"))
                p.next();
            if (p.pos == postDecimal)
                throw new ParseError(p,p.pos,"Invalid number");
        }
        const value = parseFloat(p.text.substring(start,p.pos));
        return new NumericLiteralNode(new Range(start,p.pos),value);
    });
}

// StringLiteral

function StringLiteral(p: Parser): ASTNode {
    // TODO: Complete string literal syntax according to spec
    return p.attempt((start): ASTNode => {
        if ((p.cur == "\"") || (p.cur == "'")) {
            const quote = p.cur;
            p.next();
            let value = "";
            while (true) {
                if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "\"")) {
                    value += "\"";
                    p.pos += 2;
                }
                else if ((p.pos+1 < p.len) && (p.text[p.pos] == "\\") && (p.text[p.pos+1] == "'")) {
                    value += "'";
                    p.pos += 2;
                }
                else if ((p.pos < p.len) && (p.text[p.pos] == "\"") && (quote == "\"")) {
                    p.pos++;
                    break;
                }
                else if ((p.pos < p.len) && (p.text[p.pos] == "'") && (quote == "'")) {
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
    });
}

// Section 12.2.5

// ArrayLiteral

function ArrayLiteral(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        p.sequence([
            punctuator("["),
            whitespace,
        ]);

        const elements: ASTNode[] = [];
        const listStart = p.pos;
        let listEnd = p.pos;
        let first = true;

        while (!p.lookaheadPunctuator("]")) {
            if (!first) {
                p.sequence([
                    punctuator(","),
                    whitespace,
                ]);
            }

            const elision = p.opt((start2): ASTNode => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = Elision(p),
                    whitespace,
                ]);
                return inner;
            });

            if (elision != null)
                elements.push(elision);

            let item: ASTNode = null;
            try { item = AssignmentExpression(p); } catch (e) {}
            try { item = SpreadElement(p); } catch (e) {}
            if (item == null)
                break;
            elements.push(item);
            listEnd = p.pos;
            p.sequence([
                whitespace,
            ]);
            first = false;
        }

        p.sequence([
            punctuator("]"),
        ]);

        const list = new ListNode(new Range(listStart,listEnd),elements);
        return new ArrayLiteralNode(new Range(start,p.pos),list);
    });
}

// Elision

function Elision(p: Parser): ASTNode {
    // FIXME: Protect against infinite loops in all "list" functions like these by ensuring that
    // the current position has advanced by at least 1 in each iteration
    const start = p.pos;
    p.sequence([
        punctuator(","),
    ]);
    let count = 1;
    while (true) {
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                    punctuator(","),
                ]);
                count++;
            });
        }
        catch (e) {
            return new ElisionNode(new Range(start,p.pos),count);
        }
    }
}

// SpreadElement

function SpreadElement(p: Parser): ASTNode {
    const start = p.pos;
    let assign: ASTNode;
    p.sequence([
        punctuator("..."),
        whitespace,
        () => assign = AssignmentExpression(p),
    ]);
    return new SpreadElementNode(new Range(start,p.pos),assign);
}

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(p: Parser): ASTNode {
    const start = p.pos;
    let properties: ASTNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => properties = p.opt((start2: number): ASTNode => {
            let inner: ASTNode;
            p.sequence([
                () => inner = PropertyDefinitionList(p),
                whitespace,
                () => p.opt((): void => {
                    p.sequence([
                        punctuator(","),
                        whitespace,
                    ]);
                }),
            ]);
            return inner;
        }),
        punctuator("}"),
    ]);
    if (properties == null)
        properties = new ListNode(new Range(start,p.pos),[]);
    return new ObjectLiteralNode(new Range(start,p.pos),properties);
}

// PropertyDefinitionList

function PropertyDefinitionList(p: Parser): ASTNode {
    const start = p.pos;
    const properties: ASTNode[] = [];
    properties.push(PropertyDefinition(p));
    while (true) {
        try {
            p.attempt(() => {
                let defn: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => defn = PropertyDefinition(p),
                ]);
                properties.push(defn);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),properties);
        }
    }
}

// PropertyDefinition_colon

function PropertyDefinition_colon(p: Parser): ASTNode {
    const start = p.pos;
    let name: ASTNode;
    let init: ASTNode;
    p.sequence([
        () => name = PropertyName(p),
        whitespace,
        punctuator(":"),
        whitespace,
        () => init = AssignmentExpression(p),
    ]);
    return new ColonPropertyDefinitionNode(new Range(start,p.pos),name,init);
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
    let expr: ASTNode;
    p.sequence([
        punctuator("["),
        whitespace,
        () => expr = AssignmentExpression(p),
        whitespace,
        punctuator("]"),
    ]);
    return new ComputedPropertyNameNode(new Range(start,p.pos),expr);
}

// CoverInitializedName

function CoverInitializedName(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode;
    let init: ASTNode;
    p.sequence([
        () => ident = IdentifierReference(p),
        whitespace,
        () => init = Initializer(p),
    ]);
    return new CoverInitializedNameNode(new Range(start,p.pos),ident,init);
}

// Initializer

function Initializer(p: Parser): ASTNode {
    p.sequence([
        punctuator("="),
        whitespace,
    ]);
    return AssignmentExpression(p);
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
    let expr: ASTNode;
    let args: ASTNode;
    p.sequence([
        keyword("new"),
        whitespace,
        () => expr = MemberExpression(p),
        whitespace,
        () => args = Arguments(p),
    ]);
    return new NewExpressionNode(new Range(start,p.pos),expr,args);
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
    return p.attempt((start): ASTNode => {
        let left = MemberExpression_start(p);
        while (true) {
            try {
                p.attempt(() => {
                    p.sequence([
                        whitespace,
                    ]);
                    if (p.matchPunctuator("[")) {
                        let expr: ASTNode;
                        p.sequence([
                            whitespace,
                            () => expr = Expression(p),
                            whitespace,
                            punctuator("]"),
                        ]);
                        left = new MemberAccessExprNode(new Range(start,p.pos),left,expr);
                    }
                    else if (p.matchPunctuator(".")) {
                        let ident: IdentifierNode;
                        p.sequence([
                            whitespace,
                            () => ident = IdentifierName(p),
                            whitespace,
                        ]);
                        left = new MemberAccessIdentNode(new Range(start,p.pos),left,ident);
                    }
                    else {
                        // FIXME: TemplateLiteral
                        throw new ParseError(p,p.pos,"No more parts to MemberExpression");
                    }
                });
            }
            catch (e) {
                return left;
            }
        }
    });
}

// SuperProperty

function SuperProperty(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        p.sequence([
            keyword("super"),
            whitespace,
        ]);
        if (p.matchPunctuator("[")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = Expression(p),
                whitespace,
                punctuator("]"),
            ]);
            return new SuperPropertyExprNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator(".")) {
            let ident: IdentifierNode;
            p.sequence([
                whitespace,
                () => ident = Identifier(p),
            ]);
            return new SuperPropertyIdentNode(new Range(start,p.pos),ident);
        }
        else {
            throw new ParseError(p,p.pos,"Expected SuperProperty");
        }
    });
}

// MetaProperty

function MetaProperty(p: Parser): ASTNode {
    return NewTarget(p);
}

// NewTarget

function NewTarget(p: Parser): ASTNode {
    const start = p.pos;
    let target: IdentifierNode;
    p.sequence([
        keyword("new"),
        whitespace,
        punctuator("."),
        whitespace,
        () => {
            // "target" is not a reserved word, so we can't use expectKeyword here
            target = Identifier(p);
            if (target.value != "target")
                throw new ParseError(p,p.pos,"Expected target");
        },
    ]);
    return new NewTargetNode(new Range(start,p.pos));
}

// NewExpression

function NewExpression(p: Parser): ASTNode {
    try { return MemberExpression(p); } catch (e) {}
    const result = p.opt((start: number): ASTNode => {
        let expr: ASTNode;
        p.sequence([
            keyword("new"),
            whitespace,
            () => expr = NewExpression(p),
        ]);
        return new NewExpressionNode(new Range(start,p.pos),expr,null);
    });
    if (result != null)
        return result;
    else
        throw new ParseError(p,p.pos,"Expected MemberExpression or new");
}

// CallExpression_start

function CallExpression_start(p: Parser): ASTNode {
    try { return SuperCall(p); } catch (e) {}

    return p.attempt((start): ASTNode => {
        let fun: ASTNode;
        let args: ASTNode;
        p.sequence([
            () => fun = MemberExpression(p),
            whitespace,
            () => args = Arguments(p),
        ]);
        return new CallNode(new Range(start,p.pos),fun,args);
    });
}

// CallExpression

function CallExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = CallExpression_start(p);
    while (true) {
        try {
            p.attempt(() => {
                let right = p.opt(() => {
                    let args: ASTNode;
                    p.sequence([
                        whitespace,
                        () => args = Arguments(p),
                    ]);
                    return args;
                });
                if (right != null) {
                    left = new CallNode(new Range(start,p.pos),left,right);
                    return;
                }

                right = p.opt(() => {
                    let innerRight: ASTNode;
                    p.sequence([
                        whitespace,
                        punctuator("["),
                        whitespace,
                        () => innerRight = Expression(p),
                        whitespace,
                        punctuator("]"),
                    ]);
                    return innerRight;
                });
                if (right != null) {
                    left = new MemberAccessExprNode(new Range(start,p.pos),left,right);
                    return;
                }

                right = p.opt(() => {
                    let idname: IdentifierNode;
                    p.sequence([
                        punctuator("."),
                        whitespace,
                        () => idname = IdentifierName(p),
                    ]);
                    return idname;
                });
                if (right != null) {
                    left = new MemberAccessIdentNode(new Range(start,p.pos),left,right);
                    return;
                }

                // try {
                //     left = TemplateLiteral(p);
                //     continue;
                // }
                // catch (e) {}

                throw new ParseIgnore();
            });
        }
        catch (e) {
            return left;
        }
    }
}

// SuperCall

function SuperCall(p: Parser): ASTNode {
    const start = p.pos;
    let args: ASTNode;
    p.sequence([
        keyword("super"),
        whitespace,
        () => args = Arguments(p),
    ]);
    return new SuperCallNode(new Range(start,p.pos),args);
}

// Arguments

function Arguments(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            p.sequence([
                punctuator("("),
                whitespace,
                punctuator(")"),
            ]);
            const args = new ListNode(new Range(start,p.pos),[]);
            return new ArgumentsNode(new Range(start,p.pos),args);
        },
        (start: number): ASTNode => {
            let args: ASTNode;
            p.sequence([
                punctuator("("),
                whitespace,
                () => args = ArgumentList(p),
                whitespace,
                punctuator(")"),
            ]);
            return new ArgumentsNode(new Range(start,p.pos),args);
        },
    ]);
}

// ArgumentList_item

function ArgumentList_item(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            let expr: ASTNode;
            p.sequence([
                punctuator("..."),
                whitespace,
                () => expr = AssignmentExpression(p),
            ]);
            return new SpreadElementNode(new Range(start,p.pos),expr);
        },
        (start: number): ASTNode => {
            return AssignmentExpression(p);
        },
    ]);
}

// ArgumentList

function ArgumentList(p: Parser): ASTNode {
    const start = p.pos;
    const items: ASTNode[] = [];
    items.push(ArgumentList_item(p));
    while (true) {
        try {
            p.attempt(() => {
                let arg: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => arg = ArgumentList_item(p),
                ]);
                items.push(arg);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),items);
        }
    }
}

// LeftHandSideExpression

function LeftHandSideExpression(p: Parser): ASTNode {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    try { return CallExpression(p); } catch (e) {}
    try { return NewExpression(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected LeftHandSideExpression");
}

// Section 12.4

// PostfixExpression

function PostfixExpression(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        const expr = LeftHandSideExpression(p);
        const start2 = p.pos;

        p.sequence([
            whitespaceNoNewline,
        ]);
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
    });
}

// Section 12.5

// UnaryExpression

function UnaryExpression(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        if (p.matchKeyword("delete")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new DeleteNode(new Range(start,p.pos),expr);
        }
        else if (p.matchKeyword("void")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new VoidNode(new Range(start,p.pos),expr);
        }
        else if (p.matchKeyword("typeof")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new TypeOfNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("++")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new PreIncrementNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("--")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new PreDecrementNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("+")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryPlusNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("-")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryMinusNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("~")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryBitwiseNotNode(new Range(start,p.pos),expr);
        }
        else if (p.matchPunctuator("!")) {
            let expr: ASTNode;
            p.sequence([
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryLogicalNotNode(new Range(start,p.pos),expr);
        }
        else {
            return PostfixExpression(p);
        }
    });
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = UnaryExpression(p);
    while (true) {
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("*")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = UnaryExpression(p),
                    ]);
                    left = new MultiplyNode(new Range(start,p.pos),left,right);
                }
                else if (p.lookaheadPunctuator("/")) {
                    let right: ASTNode;
                    p.sequence([
                        punctuator("/"),
                        whitespace,
                        () => right = UnaryExpression(p),
                    ]);
                    left = new DivideNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator("%")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = UnaryExpression(p),
                    ]);
                    left = new ModuloNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("+")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = MultiplicativeExpression(p),
                    ]);
                    left = new AddNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator("-")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = MultiplicativeExpression(p),
                    ]);
                    left = new SubtractNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("<<")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = AdditiveExpression(p),
                    ]);
                    left = new LeftShiftNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator(">>>")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = AdditiveExpression(p),
                    ]);
                    left = new UnsignedRightShiftNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator(">>")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = AdditiveExpression(p),
                    ]);
                    left = new SignedRightShiftNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("<=")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new LessEqualNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator(">=")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new GreaterEqualNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator("<")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new LessThanNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator(">")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new GreaterThanNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchKeyword("instanceof")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new InstanceOfNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchKeyword("in")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new InNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("===")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new StrictEqualsNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator("!==")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new StrictNotEqualsNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator("==")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new AbstractEqualsNode(new Range(start,p.pos),left,right);
                }
                else if (p.matchPunctuator("!=")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new AbstractNotEqualsNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("&")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = EqualityExpression(p),
                    ]);
                    left = new BitwiseANDNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
            return left;
        }
    }
}

// BitwiseXORExpression

function BitwiseXORExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = BitwiseANDExpression(p);
    while (true) {
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("^")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = BitwiseANDExpression(p),
                    ]);
                    left = new BitwiseXORNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
            return left;
        }
    }
}

// BitwiseORExpression

function BitwiseORExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = BitwiseXORExpression(p);
    while (true) {
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("|")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = BitwiseXORExpression(p),
                    ]);
                    left = new BitwiseORNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("&&")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = BitwiseORExpression(p),
                    ]);
                    left = new LogicalANDNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
            return left;
        }
    }
}

// LogicalORExpression

function LogicalORExpression(p: Parser): ASTNode {
    const start = p.pos;
    let left = LogicalANDExpression(p);
    while (true) {
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                ]);
                if (p.matchPunctuator("||")) {
                    let right: ASTNode;
                    p.sequence([
                        whitespace,
                        () => right = LogicalANDExpression(p),
                    ]);
                    left = new LogicalORNode(new Range(start,p.pos),left,right);
                }
                else {
                    throw new ParseIgnore();
                }
            });
        }
        catch (e) {
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
        return p.attempt(() => {
            let trueExpr: ASTNode;
            let falseExpr: ASTNode;
            p.sequence([
                whitespace,
                punctuator("?"),
                whitespace,
                () => trueExpr = AssignmentExpression(p),
                whitespace,
                punctuator(":"),
                whitespace,
                () => falseExpr = AssignmentExpression(p),
            ]);
            return new ConditionalNode(new Range(start,p.pos),condition,trueExpr,falseExpr);
        });
    }
    catch (e) {
        return condition;
    }
}

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        const left = LeftHandSideExpression(p);
        p.sequence([
            whitespace,
        ]);
        if (p.matchPunctuator("=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("*=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignMultiplyNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("/=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignDivideNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("%=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignModuloNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("+=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignAddNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("-=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignSubtractNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("<<=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignLeftShiftNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator(">>=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignSignedRightShiftNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator(">>>=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignUnsignedRightShiftNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("&=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignBitwiseANDNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("^=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignBitwiseXORNode(new Range(start,p.pos),left,right);
        }
        else if (p.matchPunctuator("|=")) {
            let right: ASTNode;
            p.sequence([
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            return new AssignBitwiseORNode(new Range(start,p.pos),left,right);
        }
        else {
            throw new ParseError(p,p.pos,"Invalid assignment expression");
        }
    });
}

// AssignmentExpression

function AssignmentExpression(p: Parser): ASTNode {
    // FIXME: Some of the match calls here will not work, because they will be caught by
    // expressions further down, e.g. * will match instead of *=. We need a matchToken() method
    // which knows about all the tokens and only checks the longest one.

    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    try { return ArrowFunction(p); } catch (e) {}
    try { return AssignmentExpression_plain(p); } catch (e) {}
    try { return ConditionalExpression(p); } catch (e) {}
    try { return YieldExpression(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected AssignmentExpression");
}

// Section 12.15

// Expression

function Expression(p: Parser): ASTNode {
    const start = p.pos;
    let left = AssignmentExpression(p);
    while (true) {
        try {
            p.attempt(() => {
                let right: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                left = new CommaNode(new Range(start,p.pos),left,right);
            });
        }
        catch (e) {
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

function HoistableDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    try { return FunctionDeclaration(p,flags); } catch (e) {}
    try { return GeneratorDeclaration(p,flags); } catch (e) {}
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
    return p.attempt((start): ASTNode => {
        let statements: ASTNode;
        p.sequence([
            punctuator("{"),
            whitespace,
            () => statements = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = StatementList(p),
                    whitespace,
                ]);
                return inner;
            }),
        ]);
        if (statements == null)
            statements = new ListNode(new Range(p.pos,p.pos),[]);
        p.sequence([
            punctuator("}"),
        ]);
        return new BlockNode(new Range(start,p.pos),statements);
    });
}

// StatementList

function StatementList(p: Parser): ASTNode {
    const start = p.pos;
    const statements: ASTNode[] = [];
    statements.push(StatementListItem(p));
    while (true) {
        try {
            let stmt: ASTNode;
            p.sequence([
                whitespace,
                () => stmt = StatementListItem(p),
            ]);
            statements.push(stmt);
        }
        catch (e) {
            p.sequence([
                whitespace,
            ]);
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
    return p.attempt((start): ASTNode => {
        if (p.matchKeyword("let")) {
            let bindings: ASTNode;
            p.sequence([
                whitespace,
                () => bindings = BindingList(p),
                whitespace,
                punctuator(";"),
            ]);
            return new LetNode(new Range(start,p.pos),bindings);
        }
        else if (p.matchKeyword("const")) {
            let bindings: ASTNode;
            p.sequence([
                whitespace,
                () => bindings = BindingList(p),
                whitespace,
                punctuator(";"),
            ]);
            return new ConstNode(new Range(start,p.pos),bindings);
        }
        else {
            throw new ParseError(p,p.pos,"Expected let or const");
        }
    });
}

// BindingList

function BindingList(p: Parser): ASTNode {
    const start = p.pos;
    const bindings: ASTNode[] = [];
    bindings.push(LexicalBinding(p));
    while (true) {
        try {
            p.attempt(() => {
                let lexbnd: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => lexbnd = LexicalBinding(p),
                ]);
                bindings.push(lexbnd);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),bindings);
        }
    }
}

// LexicalBinding_identifier

function LexicalBinding_identifier(p: Parser): ASTNode {
    const start = p.pos;
    let identifier: ASTNode;
    let initializer: ASTNode;
    p.sequence([
        () => identifier = BindingIdentifier(p),
        whitespace,
        () => initializer = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                () => inner = Initializer(p),
                whitespace,
            ]);
            return inner;
        }),
    ]);
    return new LexicalIdentifierBindingNode(new Range(start,p.pos),identifier,initializer);
}

// LexicalBinding_pattern

function LexicalBinding_pattern(p: Parser): ASTNode {
    const start = p.pos;
    let pattern: ASTNode;
    let initializer: ASTNode;
    p.sequence([
        () => pattern = BindingPattern(p),
        whitespace,
        () => initializer = Initializer(p),
    ]);
    return new LexicalPatternBindingNode(new Range(start,p.pos),pattern,initializer);
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
    let declarations: ASTNode;
    p.sequence([
        keyword("var"),
        whitespace,
        () => declarations = VariableDeclarationList(p),
        whitespace,
        punctuator(";"),
    ]);
    return new VarNode(new Range(start,p.pos),declarations);
}

// VariableDeclarationList

function VariableDeclarationList(p: Parser): ASTNode {
    const start = p.pos;
    const declarations: ASTNode[] = [];
    declarations.push(VariableDeclaration(p));
    while (true) {
        try {
            p.attempt(() => {
                let decl: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => decl = VariableDeclaration(p),
                ]);
                declarations.push(decl);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),declarations);
        }
    }
}

// VariableDeclaration_identifier

function VariableDeclaration_identifier(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        const identifier = BindingIdentifier(p);
        return p.choice([
            () => {
                let initializer: ASTNode;
                p.sequence([
                    whitespace,
                    () => initializer = Initializer(p),
                ]);
                return new VarIdentifierNode(new Range(start,p.pos),identifier,initializer);
            },
            () => {
                return new VarIdentifierNode(new Range(start,p.pos),identifier,null);
            }
        ]);
    });
}

// VariableDeclaration_pattern

function VariableDeclaration_pattern(p: Parser): ASTNode {
    const start = p.pos;
    let pattern: ASTNode;
    let initializer: ASTNode;
    p.sequence([
        () => pattern = BindingPattern(p),
        whitespace,
        () => initializer = Initializer(p),
    ]);
    return new VarPatternNode(new Range(start,p.pos),pattern,initializer);
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
    let properties: ASTNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => properties = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                () => inner = BindingPropertyList(p),
                whitespace,
                () => p.opt(() => {
                    p.sequence([
                        punctuator(","),
                        whitespace,
                    ]);
                }),
            ]);
            return inner;
        }),
        punctuator("}"),
    ]);
    if (properties == null)
        properties = new ListNode(new Range(start,p.pos),[]);
    return new ObjectBindingPatternNode(new Range(start,p.pos),properties);
}

// ArrayBindingPattern_1

function ArrayBindingPattern_1(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        let elision: ASTNode;
        let rest: ASTNode;
        p.sequence([
            punctuator("["),
            whitespace,
            () => elision = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = Elision(p),
                    whitespace,
                ]);
                return inner;
            }),
            () => rest = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = BindingRestElement(p),
                    whitespace,
                ]);
                return inner;
            }),
            punctuator("]"),
        ]);

        const array: ASTNode[] = [];
        if (elision != null)
            array.push(elision);
        if (rest != null)
            array.push(rest);

        const elements = new ListNode(new Range(start,p.pos),array);
        return new ArrayBindingPatternNode(new Range(start,p.pos),elements);
    });
}

// ArrayBindingPattern_2

function ArrayBindingPattern_2(p: Parser): ASTNode {
    const start = p.pos;
    let elements: ListNode;
    p.sequence([
        punctuator("["),
        whitespace,
        () => elements = BindingElementList(p),
        whitespace,
        punctuator("]"),
    ]);
    return new ArrayBindingPatternNode(new Range(start,p.pos),elements);
}

// ArrayBindingPattern_3

function ArrayBindingPattern_3(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        let elements: ListNode;
        let elision: ASTNode;
        let rest: ASTNode;
        p.sequence([
            punctuator("["),
            whitespace,
            () => elements = BindingElementList(p),
            whitespace,
            punctuator(","),
            whitespace,
            () => elision = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = Elision(p),
                    whitespace,
                ]);
                return inner;
            }),
            () => rest = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = BindingRestElement(p),
                    whitespace,
                ]);
                return inner;
            }),
            punctuator("]"),
        ]);

        const array: ASTNode[] = [].concat(elements.elements);
        if (elision != null)
            array.push(elision);
        if (rest != null)
            array.push(rest);

        const allElements = new ListNode(new Range(start,p.pos),array);
        return new ArrayBindingPatternNode(new Range(start,p.pos),allElements);
    });
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
        try {
            p.attempt(() => {
                let prop: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => prop = BindingProperty(p),
                ]);
                properties.push(prop);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),properties);
        }
    }
}

// BindingElementList

function BindingElementList(p: Parser): ListNode {
    const start = p.pos;
    const elements: ASTNode[] = [];
    elements.push(BindingElisionElement(p));
    while (true) {
        try {
            p.attempt(() => {
                let elem: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => elem = BindingElisionElement(p),
                ]);
                elements.push(elem);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// BindingElisionElement

function BindingElisionElement(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            let elision: ASTNode;
            let element: ASTNode;
            p.sequence([
                () => elision = Elision(p),
                whitespace,
                () => element = BindingElement(p),
            ]);
            return new BindingElisionElementNode(new Range(start,p.pos),elision,element);
        },
        (start: number): ASTNode => {
            return BindingElement(p);
        },
    ]);
}

// BindingProperty

function BindingProperty(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            let name: ASTNode;
            let element: ASTNode;
            p.sequence([
                () => name = PropertyName(p),
                whitespace,
                punctuator(":"),
                whitespace,
                () => element = BindingElement(p),
            ]);
            return new BindingPropertyNode(new Range(start,p.pos),name,element);
        },
        (start: number): ASTNode => {
            // This has to come after the colon version above, since both SingleNameBinding and
            // PropertyName will match an identifier at the start of a colon binding
            return SingleNameBinding(p);
        },
    ]);
}

// BindingElement

function BindingElement(p: Parser): ASTNode {
    try { return SingleNameBinding(p); } catch (e) {}

    return p.attempt((start): ASTNode => {
        const pattern = BindingPattern(p);
        return p.choice([
            () => {
                let init: ASTNode;
                p.sequence([
                    whitespace,
                    () => init = Initializer(p),
                ]);
                return new BindingPatternInitNode(new Range(start,p.pos),pattern,init);
            },
            () => {
                return pattern;
            },
        ]);
    });
}

// SingleNameBinding

function SingleNameBinding(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        const ident = BindingIdentifier(p);
        return p.choice([
            () => {
                let init: ASTNode;
                p.sequence([
                    whitespace,
                    () => init = Initializer(p),
                ]);
                return new SingleNameBindingNode(new Range(start,p.pos),ident,init);
            },
            () => {
                return ident;
            },
        ])
    });
}

// BindingRestElement

function BindingRestElement(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode;
    p.sequence([
        punctuator("..."),
        whitespace,
        () => ident = BindingIdentifier(p),
    ]);
    return new BindingRestElementNode(new Range(start,p.pos),ident);
}

// Section 13.4

// EmptyStatement

function EmptyStatement(p: Parser): ASTNode {
    const start = p.pos;
    p.sequence([
        punctuator(";"),
    ]);
    return new EmptyStatementNode(new Range(start,p.pos));
}

// Section 13.5

// ExpressionStatement

function ExpressionStatement(p: Parser): ASTNode {
    const start2 = p.pos;

    // Lookahead not in one of the four sequences <{> <function> <class> <let [>

    if (p.lookaheadPunctuator("{") || p.lookaheadKeyword("function") || p.lookaheadKeyword("class"))
        throw new ParseIgnore();

    if (p.matchKeyword("let")) {
        p.sequence([
            whitespace,
        ]);
        if (p.matchPunctuator("[")) {
            p.pos = start2;
            throw new ParseIgnore();
        }
    }
    p.pos = start2;

    return p.attempt((start) => {
        let expr: ASTNode;
        p.sequence([
            () => expr = Expression(p),
            whitespace,
            punctuator(";"),
        ]);
        return new ExpressionStatementNode(new Range(start,p.pos),expr);
    });
}

// Section 13.6

// IfStatement

function IfStatement(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        let condition: ASTNode;
        let trueBranch: ASTNode;
        p.sequence([
            keyword("if"),
            whitespace,
            punctuator("("),
            whitespace,
            () => condition = Expression(p),
            whitespace,
            punctuator(")"),
            whitespace,
            () => trueBranch = Statement(p),
        ]);

        return p.choice([
            () => {
                let falseBranch: ASTNode;
                p.sequence([
                    whitespace,
                    keyword("else"),
                    whitespace,
                    () => falseBranch = Statement(p),
                ]);
                return new IfStatementNode(new Range(start,p.pos),condition,trueBranch,falseBranch);
            },
            () => {
                return new IfStatementNode(new Range(start,p.pos),condition,trueBranch,null);
            },
        ]);
    });
}

// Section 13.7

// IterationStatement_do

function IterationStatement_do(p: Parser): ASTNode {
    const start = p.pos;
    let body: ASTNode = null;
    let condition: ASTNode = null;
    p.sequence([
        keyword("do"),
        whitespace,
        () => body = Statement(p),
        whitespace,
        keyword("while"),
        whitespace,
        punctuator("("),
        whitespace,
        () => condition = Expression(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator(";"),
    ]);
    return new DoStatementNode(new Range(start,p.pos),body,condition);
}

// IterationStatement_while

function IterationStatement_while(p: Parser): ASTNode {
    const start = p.pos;
    let condition: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("while"),
        whitespace,
        punctuator("("),
        whitespace,
        () => condition = Expression(p),
        whitespace,
        punctuator(")"),
        whitespace,
        () => body = Statement(p),
    ]);
    return new WhileStatementNode(new Range(start,p.pos),condition,body);
}

// IterationStatement_for_c

function IterationStatement_for_c(p: Parser): ASTNode {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    return p.attempt((start): ASTNode => {

        p.sequence([
            keyword("for"),
            whitespace,
            punctuator("("),
            whitespace,
        ]);

        const start2 = p.pos;

        let init: ASTNode = null;

        if (!p.lookaheadKeyword("let") && !p.lookaheadPunctuator("[")) {
            init = p.opt(() => {
                let innerInit: ASTNode = null;

                p.sequence([
                    () => innerInit = Expression(p),
                    whitespace,
                    punctuator(";"),
                    whitespace,
                ]);

                return innerInit;
            });
        }

        if (init == null) {
            init = p.opt(() => {
                let declarations: ASTNode = null;
                let inner: ASTNode = null;
                p.sequence([
                    keyword("var"),
                    whitespace,
                    () => {
                        declarations = VariableDeclarationList(p);
                        inner = new VarNode(new Range(start,p.pos),declarations);
                    },
                    whitespace,
                    punctuator(";"),
                    whitespace,
                ]);
                return inner;
            });
        }

       if (init == null) {
           init = p.opt(() => {
               let inner: ASTNode = null;
               p.sequence([
                   () => inner = LexicalDeclaration(p),
                   whitespace,
               ]);
               return inner;
           });
       }

        if (init == null) {
            // initializer part can be empty, but need to distinguish this from an error
            p.sequence([
                punctuator(";"),
            ]);
        }

        const condition = p.opt(() => {
            return Expression(p);
        });

        p.sequence([
            whitespace,
            punctuator(";"),
            whitespace,
        ]);

        const update = p.opt(() => {
            let inner: ASTNode = null;
            p.sequence([
                () => inner = Expression(p),
                whitespace,
            ]);
            return inner;
        });

        p.sequence([
            punctuator(")"),
            whitespace,
        ]);

        const body = Statement(p);
        const range = new Range(start,p.pos);
        return new ForCNode(range,init,condition,update,body);
    });
}

// IterationStatement_for_in

function IterationStatement_for_in(p: Parser): ASTNode {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    return p.attempt((start): ASTNode => {
        let binding: ASTNode = null;

        p.sequence([
            keyword("for"),
            whitespace,
            punctuator("("),
            whitespace,
        ]);

        const start2 = p.pos;
        if (!p.lookaheadKeyword("let") && !p.lookaheadPunctuator("[")) {
            binding = p.opt(() => {
                return LeftHandSideExpression(p);
            });
        }

        if (binding == null) {
            binding = p.opt(() => {
                let bindingInner: ASTNode = null;
                p.sequence([
                    keyword("var"),
                    whitespace,
                    () => bindingInner = ForBinding(p),
                ]);
                return new VarForDeclarationNode(new Range(start2,p.pos),bindingInner);
            });
        }

        if (binding == null) {
            binding = p.opt(() => {
                return ForDeclaration(p);
            });
        }

        if (binding == null)
            throw new ParseError(p,p.pos,"Expected for-in binding");

        let expr: ASTNode = null;
        let body: ASTNode = null;

        p.sequence([
            whitespace,
            keyword("in"),
            whitespace,
            () => expr = Expression(p),
            whitespace,
            punctuator(")"),
            whitespace,
            () => body = Statement(p),
        ]);

        return new ForInNode(new Range(start,p.pos),binding,expr,body);
    });
}

// IterationStatement_for_of

function IterationStatement_for_of(p: Parser): ASTNode {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    return p.attempt((start): ASTNode => {
        let binding: ASTNode = null;

        p.sequence([
            keyword("for"),
            whitespace,
            punctuator("("),
            whitespace,
        ]);

        const start2 = p.pos;
        if (!p.lookaheadKeyword("let") && !p.lookaheadPunctuator("[")) {
            binding = p.opt(() => {
                return LeftHandSideExpression(p);
            });
        }

        if (binding == null) {
            binding = p.opt(() => {
                let bindingInner: ASTNode = null;
                p.sequence([
                    keyword("var"),
                    whitespace,
                    () => bindingInner = ForBinding(p),
                ]);
                return new VarForDeclarationNode(new Range(start2,p.pos),bindingInner);
            });
        }

        if (binding == null) {
            binding = p.opt(() => {
                return ForDeclaration(p);
            });
        }

        if (binding == null)
            throw new ParseError(p,p.pos,"Expected for-in binding");

        let expr: ASTNode = null;
        let body: ASTNode = null;

        p.sequence([
            whitespace,
            keyword("of"),
            whitespace,
            () => expr = Expression(p),
            whitespace,
            punctuator(")"),
            whitespace,
            () => body = Statement(p),
        ]);

        return new ForOfNode(new Range(start,p.pos),binding,expr,body);
    });
}

// IterationStatement_for

function IterationStatement_for(p: Parser): ASTNode {
    try { return IterationStatement_for_c(p); } catch (e) {}
    try { return IterationStatement_for_in(p); } catch (e) {}
    try { return IterationStatement_for_of(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected for statement");
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
    return p.attempt((start): ASTNode => {
        if (p.matchKeyword("let")) {
            let binding: ASTNode = null;
            p.sequence([
                whitespace,
                () => binding = ForBinding(p),
            ]);
            return new LetForDeclarationNode(new Range(start,p.pos),binding);
        }
        else if (p.matchKeyword("const")) {
            let binding: ASTNode = null;
            p.sequence([
                whitespace,
                () => binding = ForBinding(p),
            ]);
            return new ConstForDeclarationNode(new Range(start,p.pos),binding);
        }
        else {
            throw new ParseError(p,p.pos,"Expected let or const");
        }
    });
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
    return p.choice([
        (start: number): ASTNode => {
            p.sequence([
                keyword("continue"),
                whitespace,
                punctuator(";"),
            ]);
            return new ContinueStatementNode(new Range(start,p.pos),null);
        },
        (start: number): ASTNode => {
            let labelIdentifier: ASTNode = null;
            p.sequence([
                keyword("continue"),
                whitespaceNoNewline,
                () => labelIdentifier = LabelIdentifier(p),
                whitespace,
                punctuator(";"),
            ]);
            return new ContinueStatementNode(new Range(start,p.pos),labelIdentifier);
        },
    ]);
}

// Section 13.9

// BreakStatement

function BreakStatement(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            p.sequence([
                keyword("break"),
                whitespace,
                punctuator(";"),
            ]);
            return new BreakStatementNode(new Range(start,p.pos),null);
        },
        (start: number): ASTNode => {
            let labelIdentifier: ASTNode = null;
            p.sequence([
                keyword("break"),
                whitespaceNoNewline,
                () => labelIdentifier = LabelIdentifier(p),
                whitespace,
                punctuator(";"),
            ]);
            return new BreakStatementNode(new Range(start,p.pos),labelIdentifier);
        },
    ]);
}

// Section 13.10

// ReturnStatement

function ReturnStatement(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            p.sequence([
                keyword("return"),
                whitespace,
                punctuator(";"),
            ]);
            return new ReturnStatementNode(new Range(start,p.pos),null);
        },
        (start: number): ASTNode => {
            let expr: ASTNode = null;
            p.sequence([
                keyword("return"),
                whitespaceNoNewline,
                () => expr = Expression(p),
                whitespace,
                punctuator(";"),
            ]);
            return new ReturnStatementNode(new Range(start,p.pos),expr);
        },
    ]);
}

// Section 13.11

// WithStatement

function WithStatement(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("with"),
        whitespace,
        punctuator("("),
        whitespace,
        () => expr = Expression(p),
        whitespace,
        punctuator(")"),
        whitespace,
        () => body = Statement(p),
    ]);
    return new WithStatementNode(new Range(start,p.pos),expr,body);
}

// Section 13.12

// SwitchStatement

function SwitchStatement(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode = null;
    let cases: ASTNode = null;
    p.sequence([
        keyword("switch"),
        whitespace,
        punctuator("("),
        whitespace,
        () => expr = Expression(p),
        whitespace,
        punctuator(")"),
        whitespace,
        () => cases = CaseBlock(p),
    ]);
    return new SwitchStatementNode(new Range(start,p.pos),expr,cases);
}

// CaseBlock_1

function CaseBlock_1(p: Parser): ASTNode {
    const start = p.pos;
    let clauses: ASTNode = null;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => { try { clauses = CaseClauses(p); } catch (e) {} },
        whitespace,
        punctuator("}"),
    ]);
    if (clauses == null)
        clauses = new ListNode(new Range(start,p.pos),[]);
    return clauses;
}

// CaseBlock_2

function CaseBlock_2(p: Parser): ASTNode {
    const start = p.pos;
    let clauses1: ASTNode[] = [];
    let clauses2: ASTNode[] = [];
    let defaultClause: ASTNode = null;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => { try { clauses1 = CaseClauses(p).elements; } catch (e) {} },
        whitespace,
        () => defaultClause = DefaultClause(p),
        whitespace,
        () => { try { clauses2 = CaseClauses(p).elements; } catch (e) {} },
        whitespace,
        punctuator("}"),
    ]);
    const combined = [].concat(clauses1,defaultClause,clauses2);
    return new ListNode(new Range(start,p.pos),combined);
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
        try {
            p.attempt(() => {
                clauses.push(CaseClause(p));
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),clauses);
        }
    }
}

// CaseClause

function CaseClause(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode = null;
    let statements: ASTNode = null;
    p.sequence([
        keyword("case"),
        whitespace,
        () => expr = Expression(p),
        whitespace,
        punctuator(":"),
        whitespace,
        () => statements = StatementList(p),
    ]);
    return new CaseClauseNode(new Range(start,p.pos),expr,statements);
}

// DefaultClause

function DefaultClause(p: Parser): ASTNode {
    const start = p.pos;
    let statements: ASTNode = null;
    p.sequence([
        keyword("default"),
        whitespace,
        punctuator(":"),
        whitespace,
        () => statements = StatementList(p),
    ]);
    return new DefaultClauseNode(new Range(start,p.pos),statements);
}

// Section 13.13

// LabelledStatement

function LabelledStatement(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode = null;
    let item: ASTNode = null;
    p.sequence([
        () => ident = LabelIdentifier(p),
        whitespace,
        punctuator(":"),
        whitespace,
        () => item = LabelledItem(p),
    ]);
    return new LabelledStatementNode(new Range(start,p.pos),ident,item);
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
    let expr: ASTNode = null;
    p.sequence([
        keyword("throw"),
        whitespaceNoNewline,
        () => expr = Expression(p),
        whitespace,
        punctuator(";"),
    ]);
    return new ThrowStatementNode(new Range(start,p.pos),expr);
}

// Section 13.15

// TryStatement

function TryStatement(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        let tryBlock: ASTNode = null;
        let catchBlock: ASTNode = null;
        let finallyBlock: ASTNode = null;

        p.sequence([
            keyword("try"),
            whitespace,
            () => tryBlock = Block(p),
        ]);

        finallyBlock = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                whitespace,
                () => inner = Finally(p),
            ]);
            return inner;
        });

        if (finallyBlock == null) {
            p.sequence([
                whitespace,
                () => catchBlock = Catch(p),
                () => finallyBlock = p.opt(() => {
                    let inner: ASTNode;
                    p.sequence([
                        whitespace,
                        () => inner = Finally(p),
                    ]);
                    return inner;
                }),
            ]);
        }

        return new TryStatementNode(new Range(start,p.pos),tryBlock,catchBlock,finallyBlock);
    });
}

// Catch

function Catch(p: Parser): ASTNode {
    const start = p.pos;
    let param: ASTNode = null;
    let block: ASTNode = null;
    p.sequence([
        keyword("catch"),
        whitespace,
        punctuator("("),
        whitespace,
        () => param = CatchParameter(p),
        whitespace,
        punctuator(")"),
        whitespace,
        () => block = Block(p),
    ]);
    return new CatchNode(new Range(start,p.pos),param,block);
}

// Finally

function Finally(p: Parser): ASTNode {
    const start = p.pos;
    let block: ASTNode = null;
    p.sequence([
        keyword("finally"),
        whitespace,
        () => block = Block(p),
    ]);
    return new FinallyNode(new Range(start,p.pos),block);
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
    p.sequence([
        keyword("debugger"),
        whitespace,
        punctuator(";"),
    ]);
    return new DebuggerStatementNode(new Range(start,p.pos));
}

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode = null;
    let params: ListNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        () => ident = BindingIdentifier(p),
        whitespace,
        punctuator("("),
        whitespace,
        () => params = FormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new FunctionDeclarationNode(new Range(start,p.pos),ident,params,body);
}

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed(p: Parser): ASTNode {
    const start = p.pos;
    let params: ListNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        punctuator("("),
        whitespace,
        () => params = FormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new FunctionDeclarationNode(new Range(start,p.pos),null,params,body);
}

// FunctionDeclaration

function FunctionDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try { return FunctionDeclaration_named(p); } catch (e) {}
    if (flags.Default)
        try { return FunctionDeclaration_unnamed(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected FunctionDeclaration");
}

// FunctionExpression

function FunctionExpression(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode = null;
    let params: ListNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        () => ident = p.opt(() => {
            let inner: ASTNode = null;
            p.sequence([
                () => inner = BindingIdentifier(p),
                whitespace,
            ]);
            return inner;
        }),
        punctuator("("),
        whitespace,
        () => params = FormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new FunctionExpressionNode(new Range(start,p.pos),ident,params,body);
}

// StrictFormalParameters

function StrictFormalParameters(p: Parser): ASTNode {
    return FormalParameters(p);
}

// FormalParameters

function FormalParameters(p: Parser): ListNode {
    try { return FormalParameterList(p); } catch (e) {}
    return new ListNode(new Range(p.pos,p.pos),[]);
}

// FormalParameterList

function FormalParameterList(p: Parser): ListNode {
    const start = p.pos;
    return p.choice([
        (start: number): ListNode => {
            const rest = FunctionRestParameter(p);
            return new ListNode(new Range(start,p.pos),[rest]);
        },
        (start: number): ListNode => {
            const formals = FormalsList(p);

            return p.choice([
                () => {
                    let elements: ASTNode[] = null;
                    p.sequence([
                        whitespace,
                        punctuator(","),
                        whitespace,
                        () => {
                            const rest = FunctionRestParameter(p);
                            elements = formals.elements;
                            elements.push(rest);
                        },
                    ]);
                    return new ListNode(new Range(start,p.pos),elements);
                },
                () => {
                    return formals;
                },
            ]);
        },
    ]);
}

// FormalsList

function FormalsList(p: Parser): ListNode {
    const start = p.pos;
    const elements: ASTNode[] = [];
    elements.push(FormalParameter(p));
    while (true) {
        try {
            p.attempt(() => {
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                ]);
                elements.push(FormalParameter(p));
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// FunctionRestParameter

function FunctionRestParameter(p: Parser): ASTNode {
    return BindingRestElement(p);
}

// FormalParameter

function FormalParameter(p: Parser): ASTNode {
    return BindingElement(p);
}

// FunctionBody

function FunctionBody(p: Parser): ASTNode {
    return FunctionStatementList(p);
}

// FunctionStatementList

function FunctionStatementList(p: Parser): ASTNode {
    try { return StatementList(p); } catch (e) {}
    return new ListNode(new Range(p.pos,p.pos),[]);
}

// Section 14.2

// ArrowFunction

function ArrowFunction(p: Parser): ASTNode {
    const start = p.pos;
    let params: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        () => params = ArrowParameters(p),
        whitespaceNoNewline,
        punctuator("=>"),
        whitespace,
        () => body = ConciseBody(p),
    ]);
    return new ArrowFunctionNode(new Range(start,p.pos),params,body);
}

// ArrowParameters

function ArrowParameters(p: Parser): ASTNode {
    try { return BindingIdentifier(p); } catch (e) {}
    try { return ArrowFormalParameters(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ArrowParameters");
}

// ConciseBody_1

function ConciseBody_1(p: Parser): ASTNode {
    if (p.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    return AssignmentExpression(p);
}

// ConciseBody_2

function ConciseBody_2(p: Parser): ASTNode {
    let body: ASTNode = null;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return body;
}

// ConciseBody

function ConciseBody(p: Parser): ASTNode {
    try { return ConciseBody_1(p); } catch (e) {}
    try { return ConciseBody_2(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ConciseBody");
}

// ArrowFormalParameters

function ArrowFormalParameters(p: Parser): ASTNode {
    let params: ASTNode = null;
    p.sequence([
        punctuator("("),
        whitespace,
        () => params = StrictFormalParameters(p),
        whitespace,
        punctuator(")"),
    ]);
    return params;
}

// Section 14.3

// MethodDefinition_1

function MethodDefinition_1(p: Parser): ASTNode {
    const start = p.pos;
    let name: ASTNode = null;
    let params: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        () => name = PropertyName(p),
        whitespace,
        punctuator("("),
        whitespace,
        () => params = StrictFormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new MethodNode(new Range(start,p.pos),name,params,body);
}

// MethodDefinition_2

function MethodDefinition_2(p: Parser): ASTNode {
    return GeneratorMethod(p);
}

// MethodDefinition_3

function MethodDefinition_3(p: Parser): ASTNode {
    const start = p.pos;
    // "get" is not a reserved word, so we can't use expectKeyword here
    let name: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        () => {
            const getIdent = Identifier(p);
            if (getIdent.value != "get")
                throw new ParseIgnore();
        },
        whitespace,
        () => name = PropertyName(p),
        whitespace,
        punctuator("("),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new GetterNode(new Range(start,p.pos),name,body);
}

// MethodDefinition_4

function MethodDefinition_4(p: Parser): ASTNode {
    const start = p.pos;
    // "set" is not a reserved word, so we can't use expectKeyword here
    let name: ASTNode = null;
    let param: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        () => {
            const setIdent = Identifier(p);
            if (setIdent.value != "set")
                throw new ParseIgnore();
        },
        whitespace,
        () => name = PropertyName(p),
        whitespace,
        punctuator("("),
        whitespace,
        () => param = PropertySetParameterList(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = FunctionBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new SetterNode(new Range(start,p.pos),name,param,body);
}

// MethodDefinition

function MethodDefinition(p: Parser): ASTNode {
    try { return MethodDefinition_1(p); } catch (e) {}
    try { return MethodDefinition_2(p); } catch (e) {}
    try { return MethodDefinition_3(p); } catch (e) {}
    try { return MethodDefinition_4(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected MethodDefinition");
}

// PropertySetParameterList

function PropertySetParameterList(p: Parser): ASTNode {
    return FormalParameter(p);
}

// Section 14.4

// GeneratorMethod

function GeneratorMethod(p: Parser): ASTNode {
    const start = p.pos;
    let name: ASTNode = null;
    let params: ASTNode = null;
    let body: ASTNode = null;
    p.sequence([
        punctuator("*"),
        whitespace,
        () => name = PropertyName(p),
        whitespace,
        punctuator("("),
        whitespace,
        () => params = StrictFormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = GeneratorBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new GeneratorMethodNode(new Range(start,p.pos),name,params,body);
}

// GeneratorDeclaration_1

function GeneratorDeclaration_1(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode = null;
    let params: ListNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        punctuator("*"),
        whitespace,
        () => ident = BindingIdentifier(p),
        whitespace,
        punctuator("("),
        whitespace,
        () => params = FormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = GeneratorBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new GeneratorDeclarationNode(new Range(start,p.pos),ident,params,body);
}

// GeneratorDeclaration_2

function GeneratorDeclaration_2(p: Parser): ASTNode {
    const start = p.pos;
    let params: ListNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        punctuator("*"),
        whitespace,
        punctuator("("),
        whitespace,
        () => params = FormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = GeneratorBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new DefaultGeneratorDeclarationNode(new Range(start,p.pos),params,body);
}

// GeneratorDeclaration

function GeneratorDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try { return GeneratorDeclaration_1(p); } catch (e) {}
    if (flags.Default)
        try { return GeneratorDeclaration_2(p); } catch (e) {} // FIXME: default only
    throw new ParseError(p,p.pos,"Expected GeneratorDeclaration");
}

// GeneratorExpression

function GeneratorExpression(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode = null;
    let params: ListNode = null;
    let body: ASTNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        punctuator("*"),
        whitespace,
        () => ident = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                () => inner = BindingIdentifier(p),
                whitespace,
            ]);
            return inner;
        }),
        punctuator("("),
        whitespace,
        () => params = FormalParameters(p),
        whitespace,
        punctuator(")"),
        whitespace,
        punctuator("{"),
        whitespace,
        () => body = GeneratorBody(p),
        whitespace,
        punctuator("}"),
    ]);
    return new GeneratorExpressionNode(new Range(start,p.pos),ident,params,body);
}

// GeneratorBody

function GeneratorBody(p: Parser): ASTNode {
    return FunctionBody(p);
}

// YieldExpression_1

function YieldExpression_1(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode;
    p.sequence([
        keyword("yield"),
        whitespaceNoNewline,
        punctuator("*"),
        whitespace,
        () => expr = AssignmentExpression(p),
    ]);
    return new YieldStarNode(new Range(start,p.pos),expr);
}

// YieldExpression_2

function YieldExpression_2(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode;
    p.sequence([
        keyword("yield"),
        whitespaceNoNewline,
        () => expr = AssignmentExpression(p),
    ]);
    return new YieldExprNode(new Range(start,p.pos),expr);
}

// YieldExpression_3

function YieldExpression_3(p: Parser): ASTNode {
    const start = p.pos;
    p.sequence([
        keyword("yield"),
    ]);
    return new YieldNothingNode(new Range(start,p.pos));
}

// YieldExpression

function YieldExpression(p: Parser): ASTNode {
    try { return YieldExpression_1(p); } catch (e) {}
    try { return YieldExpression_2(p); } catch (e) {}
    try { return YieldExpression_3(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected YieldExpression");
}

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode;
    let tail: ASTNode;
    p.sequence([
        keyword("class"),
        whitespace,
        () => ident = BindingIdentifier(p),
        whitespace,
        () => tail = ClassTail(p),
    ]);
    return new ClassDeclarationNode(new Range(start,p.pos),ident,tail);
}

// ClassDeclaration_2

function ClassDeclaration_2(p: Parser): ASTNode {
    const start = p.pos;
    let tail: ASTNode;
    p.sequence([
        keyword("class"),
        whitespace,
        () => tail = ClassTail(p),
    ]);
    return new ClassDeclarationNode(new Range(start,p.pos),null,tail);
}

// ClassDeclaration

function ClassDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try { return ClassDeclaration_1(p); } catch (e) {}
    if (flags.Default)
        try { return ClassDeclaration_2(p); } catch (e) {} // FIXME: default only
    throw new ParseError(p,p.pos,"Expected ClassDeclaration");
}

// ClassExpression

function ClassExpression(p: Parser): ASTNode {
    const start = p.pos;
    let ident: ASTNode;
    let tail: ASTNode;
    p.sequence([
        keyword("class"),
        whitespace,
        () => ident = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                () => inner = BindingIdentifier(p),
                whitespace,
            ]);
            return inner;
        }),
        () => tail = ClassTail(p),
    ]);
    return new ClassExpressionNode(new Range(start,p.pos),ident,tail);
}

// ClassTail

function ClassTail(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        let heritage: ASTNode;
        let body: ASTNode;

        p.sequence([
            () => heritage = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = ClassHeritage(p),
                    whitespace,
                ]);
                return inner;
            }),
            punctuator("{"),
            whitespace,
        ]);

        const start2 = p.pos;

        p.sequence([
            () => body = p.opt(() => {
                let inner: ASTNode;
                p.sequence([
                    () => inner = ClassBody(p),
                    whitespace,
                ]);
                return inner;
            }),
            punctuator("}"),
        ]);

        if (body == null)
            body = new ListNode(new Range(start2,start2),[]);
        return new ClassTailNode(new Range(start,p.pos),heritage,body);
    });
}

// ClassHeritage

function ClassHeritage(p: Parser): ASTNode {
    const start = p.pos;
    let expr: ASTNode;
    p.sequence([
        keyword("extends"),
        whitespace,
        () => expr = LeftHandSideExpression(p),
    ]);
    return new ExtendsNode(new Range(start,p.pos),expr);
}

// ClassBody

function ClassBody(p: Parser): ASTNode {
    return ClassElementList(p);
}

// ClassElementList

function ClassElementList(p: Parser): ASTNode {
    const start = p.pos;
    const elements: ASTNode[] = [];
    elements.push(ClassElement(p));
    while (true) {
        try {
            p.attempt(() => {
                let elem: ASTNode;
                p.sequence([
                    whitespace,
                    () => elem = ClassElement(p),
                ]);
                elements.push(elem);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// ClassElement_1

function ClassElement_1(p: Parser): ASTNode {
    return MethodDefinition(p);
}

// ClassElement_2

function ClassElement_2(p: Parser): ASTNode {
    const start = p.pos;
    let method: ASTNode;
    p.sequence([
        keyword("static"),
        whitespace,
        () => method = MethodDefinition(p),
    ]);
    return new StaticMethodDefinitionNode(new Range(start,p.pos),method);
}

// ClassElement_3

function ClassElement_3(p: Parser): ASTNode {
    const start = p.pos;
    p.sequence([
        punctuator(";"),
    ]);
    return new EmptyClassElementNode(new Range(start,p.pos));
}

// ClassElement

function ClassElement(p: Parser): ASTNode {
    try { return ClassElement_1(p); } catch (e) {}
    try { return ClassElement_2(p); } catch (e) {}
    try { return ClassElement_3(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ClassElement");
}

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

export function Module(p: Parser): ASTNode {
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
        try {
            p.attempt(() => {
                let mod: ASTNode;
                p.sequence([
                    whitespace,
                    () => mod = ModuleItem(p),
                ]);
                items.push(mod);
            });
        }
        catch (e) {
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
    let importClause: ASTNode;
    let fromClause: ASTNode;
    p.sequence([
        keyword("import"),
        whitespace,
        () => importClause = ImportClause(p),
        whitespace,
        () => fromClause = FromClause(p),
        whitespace,
        punctuator(";"),
    ]);
    return new ImportFromNode(new Range(start,p.pos),importClause,fromClause);
}

// ImportDeclaration_module

function ImportDeclaration_module(p: Parser): ASTNode {
    const start = p.pos;
    let specifier: ASTNode;
    p.sequence([
        keyword("import"),
        whitespace,
        () => specifier = ModuleSpecifier(p),
        whitespace,
        punctuator(";"),
    ]);
    return new ImportModuleNode(new Range(start,p.pos),specifier);
}

// ImportDeclaration

function ImportDeclaration(p: Parser): ASTNode {
    try { return ImportDeclaration_from(p); } catch (e) {}
    try { return ImportDeclaration_module(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected ImportDeclaration");
}

// ImportClause

function ImportClause(p: Parser): ASTNode {
    return p.choice([
        (): ASTNode => {
            return NameSpaceImport(p);
        },
        (): ASTNode => {
            return NamedImports(p);
        },
        (start: number): ASTNode => {
            const defaultBinding = ImportedDefaultBinding(p);
            return p.choice([
                (): ASTNode => {
                    let nameSpaceImport: ASTNode;
                    p.sequence([
                        whitespace,
                        punctuator(","),
                        whitespace,
                        () => nameSpaceImport = NameSpaceImport(p),
                    ]);
                    return new DefaultAndNameSpaceImportsNode(new Range(start,p.pos),defaultBinding,nameSpaceImport);
                },
                (): ASTNode => {
                    let namedImports: ASTNode;
                    p.sequence([
                        whitespace,
                        punctuator(","),
                        whitespace,
                        () => namedImports = NamedImports(p),
                    ]);
                    return new DefaultAndNamedImportsNode(new Range(start,p.pos),defaultBinding,namedImports);
                },
                (): ASTNode => {
                    return new DefaultImportNode(new Range(start,p.pos),defaultBinding);
                },
            ]);
        },
    ]);
}

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): ASTNode {
    return ImportedBinding(p);
}

// NameSpaceImport

function NameSpaceImport(p: Parser): ASTNode {
    const start = p.pos;
    let binding: ASTNode;
    p.sequence([
        punctuator("*"),
        whitespace,
        keyword("as"),
        whitespace,
        () => binding = ImportedBinding(p),
    ]);
    return new NameSpaceImportNode(new Range(start,p.pos),binding);
}

// NamedImports

function NamedImports(p: Parser): ASTNode {
    const start = p.pos;
    let imports: ASTNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => imports = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                () => inner = ImportsList(p),
                whitespace,
                () => p.opt(() => {
                    p.sequence([
                        punctuator(","),
                        whitespace,
                    ]);
                }),
            ]);
            return inner;
        }),
        punctuator("}"),
    ]);
    if (imports == null)
        imports = new ListNode(new Range(start,p.pos),[]);
    return new NamedImportsNode(new Range(start,p.pos),imports);
}

// FromClause

function FromClause(p: Parser): ASTNode {
    p.sequence([
        keyword("from"),
        whitespace,
    ]);
    return ModuleSpecifier(p);
}

// ImportsList

function ImportsList(p: Parser): ASTNode {
    const start = p.pos;
    const imports: ASTNode[] = [];
    imports.push(ImportSpecifier(p));
    while (true) {
        try {
            p.attempt(() => {
                let specifier: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => specifier = ImportSpecifier(p),
                ]);
                imports.push(specifier);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),imports);
        }
    }
}

// ImportSpecifier

function ImportSpecifier(p: Parser): ASTNode {
    return p.choice([
        (start: number): ASTNode => {
            let name: IdentifierNode;
            let binding: ASTNode;
            p.sequence([
                () => name = IdentifierName(p),
                whitespace,
                keyword("as"),
                whitespace,
                () => binding = ImportedBinding(p),
            ]);
            return new ImportAsSpecifierNode(new Range(start,p.pos),name,binding);
        },
        (start: number): ASTNode => {
            let binding: ASTNode;
            p.sequence([
                () => binding = ImportedBinding(p),
            ]);
            return new ImportSpecifierNode(new Range(start,p.pos),binding);
        },
    ]);
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
    return p.attempt((start): ASTNode => {
        p.sequence([
            keyword("export"),
            whitespace,
        ]);

        if (p.matchKeyword("default")) {
            p.sequence([
                whitespace,
            ]);

            // FIXME: Not sure about the order of these
            try {
                const node = HoistableDeclaration(p,{ Default: true });
                return new ExportDefaultNode(new Range(node.range.start,node.range.end),node);
            } catch (e) { }

            try {
                const node = ClassDeclaration(p,{ Default: true });
                return new ExportDefaultNode(new Range(node.range.start,node.range.end),node);
            } catch (e) { }

            if (!p.lookaheadKeyword("function") && !p.lookaheadKeyword("class")) {
                try {
                    const node = AssignmentExpression(p);
                    return new ExportDefaultNode(new Range(node.range.start,node.range.end),node);
                } catch (e) {}
            }
        }
        else if (p.matchPunctuator("*")) {
            let from: ASTNode;
            p.sequence([
                whitespace,
                () => from = FromClause(p),
                whitespace,
                punctuator(";"),
            ]);
            return new ExportStarNode(new Range(start,p.pos),from);
        }
        else {
            return p.choice([
                (start2: number): ASTNode => {
                    let exportClause: ASTNode;
                    let fromClause: ASTNode;
                    p.sequence([
                        () => exportClause = ExportClause(p),
                        whitespace,
                        () => fromClause = FromClause(p),
                        whitespace,
                        punctuator(";"),
                    ]);
                    return new ExportFromNode(new Range(start,p.pos),exportClause,fromClause);
                },
                (start2: number): ASTNode => {
                    let exportClause: ASTNode;
                    p.sequence([
                        () => exportClause = ExportClause(p),
                        whitespace,
                        punctuator(";"),
                    ]);
                    return exportClause;
                },
                (start2: number): ASTNode => {
                    const node = VariableStatement(p);
                    return new ExportVariableNode(new Range(node.range.start,node.range.end),node);
                },
                (start2: number): ASTNode => {
                    const node = Declaration(p);
                    return new ExportDeclarationNode(new Range(node.range.start,node.range.end),node);
                },
            ]);
        }
        throw new ParseError(p,p.pos,"Expected ExportDeclaration");
    });
}

// ExportClause

function ExportClause(p: Parser): ASTNode {
    const start = p.pos;
    let exports: ASTNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => exports = p.opt(() => {
            let inner: ASTNode;
            p.sequence([
                () => inner = ExportsList(p),
                whitespace,
                () => p.opt(() => {
                    p.sequence([
                        punctuator(","),
                        whitespace,
                    ]);
                }),
            ]);
            return inner;
        }),
        punctuator("}"),
    ]);
    if (exports == null)
        exports = new ListNode(new Range(start,p.pos),[]);
    return new ExportClauseNode(new Range(start,p.pos),exports);
}

// ExportsList

function ExportsList(p: Parser): ASTNode {
    const start = p.pos;
    const exports: ASTNode[] = [];
    exports.push(ExportSpecifier(p));
    while (true) {
        try {
            p.attempt(() => {
                let specifier: ASTNode;
                p.sequence([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    () => specifier = ExportSpecifier(p),
                ]);
                exports.push(specifier);
            });
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),exports);
        }
    }
}

// ExportSpecifier

function ExportSpecifier(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        const ident = IdentifierName(p);
        return p.choice([
            (start2: number): ASTNode => {
                let asIdent: IdentifierNode;
                p.sequence([
                    whitespace,
                    keyword("as"),
                    whitespace,
                    () => asIdent = IdentifierName(p),
                ]);
                return new ExportAsSpecifierNode(new Range(start,p.pos),ident,asIdent);
            },
            (start2: number): ASTNode => {
                return new ExportNormalSpecifierNode(new Range(start,p.pos),ident);
            },
        ]);
    });
}
