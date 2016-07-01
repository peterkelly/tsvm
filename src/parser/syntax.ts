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
    LiteralPropertyNameType,
    PropertyNameType,
    PropertyDefinitionType,
    StatementListItemType,
    SingleNameBindingType,
    BindingPatternType,
    BindingElementType,
    ArgumentType,
    ForBindingType,
    CatchParameterType,
    BindingPropertyType,
    ClassElementType,
    ModuleItemType,
    ArrayLiteralItemType,
    ForCInitType,
    ForInBindingType,
    ForOfBindingType,

    ImportClauseNode,
    ExportNode,
    ImportNode,
    MethodDefinitionNode,
    DeclarationNode,

    Range,
    ASTNode,
    StatementNode,
    BreakableStatementNode,
    ExpressionNode,
    IdentifierReferenceNode,
    BindingIdentifierNode,
    LabelIdentifierNode,
    IdentifierNode,
    ThisNode,
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

function notKeyword(str: string) {
    return (p: Parser): void => {
        if (p.lookaheadKeyword(str))
            throw new ParseError(p,p.pos,"Unexpected "+str);
    };
}

function notPunctuator(str: string) {
    return (p: Parser): void => {
        if (p.lookaheadPunctuator(str))
            throw new ParseError(p,p.pos,"Unexpected "+str);
    };
}

function identifier(str: string) {
    return (p: Parser): void => {
        const ident = Identifier(p);
        if (ident instanceof ErrorNode)
            throw new ParseError(p,p.pos,"Expected "+str);
        if (ident.value != str)
            throw new ParseError(p,p.pos,"Expected "+str);
    };
}

function whitespace(p: Parser): void {
    p.skipWhitespace();
}

function whitespaceNoNewline(p: Parser): void {
    p.skipWhitespaceNoNewline();
}

// Section 12.1

// IdentifierReference

function IdentifierReference(p: Parser): IdentifierReferenceNode | ErrorNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new IdentifierReferenceNode(ident.range,ident.value);
}

// BindingIdentifier

function BindingIdentifier(p: Parser): BindingIdentifierNode | ErrorNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new BindingIdentifierNode(ident.range,ident.value);
}

// LabelIdentifier

function LabelIdentifier(p: Parser): LabelIdentifierNode | ErrorNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new LabelIdentifierNode(ident.range,ident.value);
}

// IdentifierName

function IdentifierName(p: Parser): IdentifierNode | ErrorNode {
    return Identifier(p);
}

// Identifier

function Identifier(p: Parser): IdentifierNode | ErrorNode {
    return p.attempt((start) => {
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

function PrimaryExpression(p: Parser): ExpressionNode | ErrorNode {

    function This(p: Parser): ThisNode | ErrorNode {
        const start = p.pos;
        p.sequence([
            keyword("this"),
        ]);
        const range = new Range(start,p.pos);
        return new ThisNode(range);
    }

    return p.choice<ExpressionNode | ErrorNode>([
    // return p.choice([
        This,
        // Literal must come before IdentifierReference, since "true", "false", and "null" are not keywords
        Literal,
        IdentifierReference,
        ArrayLiteral,
        ObjectLiteral,
        FunctionExpression,
        ClassExpression,
        GeneratorExpression,
        // RegularExpressionLiteral, // TODO
        // TemplateLiteral, // TODO
        ParenthesizedExpression,
    ]);
}

// ParenthesizedExpression

function ParenthesizedExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
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

function Literal(p: Parser): ExpressionNode | ErrorNode {
    return p.choice<ExpressionNode | ErrorNode>([
        NullLiteral,
        BooleanLiteral,
        NumericLiteral,
        StringLiteral,
    ]);
}

// NullLiteral

function NullLiteral(p: Parser): NullLiteralNode | ErrorNode {
    const start = p.pos;
    p.sequence([
        keyword("null"),
    ]);
    return new NullLiteralNode(new Range(start,p.pos));
}

// BooleanLiteral

function BooleanLiteral(p: Parser): BooleanLiteralNode | ErrorNode {
    const start = p.pos;
    if (p.matchKeyword("true"))
        return new BooleanLiteralNode(new Range(start,p.pos),true);
    if (p.matchKeyword("false"))
        return new BooleanLiteralNode(new Range(start,p.pos),false);
    throw new ParseError(p,p.pos,"Expected BooleanLiteral");
}

// NumericLiteral

function NumericLiteral(p: Parser): NumericLiteralNode | ErrorNode {
    // TODO: Complete numeric literal syntax according to spec
    return p.attempt((start) => {
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

function StringLiteral(p: Parser): StringLiteralNode | ErrorNode {
    // TODO: Complete string literal syntax according to spec
    return p.attempt((start) => {
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

function ArrayLiteral(p: Parser): ArrayLiteralNode | ErrorNode {
    return p.attempt((start): ArrayLiteralNode | ErrorNode => {
        p.sequence([
            punctuator("["),
            whitespace,
        ]);

        const elements: (ArrayLiteralItemType | ErrorNode)[] = [];
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

            const elision = p.opt(() => {
                let inner: ElisionNode | ErrorNode;
                p.sequence([
                    () => inner = Elision(p),
                    whitespace,
                ]);
                return inner;
            });

            if (elision != null)
                elements.push(elision);

            let item: ArrayLiteralItemType | ErrorNode = null;
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

function Elision(p: Parser): ElisionNode | ErrorNode {
    // FIXME: Protect against infinite loops in all "list" functions like these by ensuring that
    // the current position has advanced by at least 1 in each iteration
    const start = p.pos;
    p.sequence([
        punctuator(","),
    ]);
    let count = 1;
    while (true) {
        try {
            p.sequence([
                whitespace,
                punctuator(","),
            ]);
            count++;
        }
        catch (e) {
            return new ElisionNode(new Range(start,p.pos),count);
        }
    }
}

// SpreadElement

function SpreadElement(p: Parser): SpreadElementNode | ErrorNode {
    const start = p.pos;
    let assign: ExpressionNode | ErrorNode;
    p.sequence([
        punctuator("..."),
        whitespace,
        () => assign = AssignmentExpression(p),
    ]);
    return new SpreadElementNode(new Range(start,p.pos),assign);
}

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(p: Parser): ObjectLiteralNode | ErrorNode {
    const start = p.pos;
    let properties: ListNode | ErrorNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => properties = p.opt(() => {
            let inner: ListNode | ErrorNode;
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

function PropertyDefinitionList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const properties: (PropertyDefinitionType | ErrorNode)[] = [];
    properties.push(PropertyDefinition(p));
    while (true) {
        try {
            let defn: PropertyDefinitionType | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => defn = PropertyDefinition(p),
            ]);
            properties.push(defn);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),properties);
        }
    }
}

// PropertyDefinition_colon

function PropertyDefinition_colon(p: Parser): ColonPropertyDefinitionNode | ErrorNode {
    const start = p.pos;
    let name: PropertyNameType | ErrorNode;
    let init: ExpressionNode | ErrorNode;
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

function PropertyDefinition(p: Parser): PropertyDefinitionType | ErrorNode {
    return p.choice<PropertyDefinitionType | ErrorNode>([
        PropertyDefinition_colon,
        CoverInitializedName,
        MethodDefinition,
        IdentifierReference,
    ]);
}

// PropertyName

function PropertyName(p: Parser): PropertyNameType | ErrorNode {
    return p.choice<PropertyNameType | ErrorNode>([
        LiteralPropertyName,
        ComputedPropertyName,
    ]);
}

// LiteralPropertyName

function LiteralPropertyName(p: Parser): LiteralPropertyNameType | ErrorNode {
    return p.choice<LiteralPropertyNameType | ErrorNode>([
        IdentifierName,
        StringLiteral,
        NumericLiteral,
    ]);
}

// ComputedPropertyName

function ComputedPropertyName(p: Parser): ComputedPropertyNameNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
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

function CoverInitializedName(p: Parser): CoverInitializedNameNode | ErrorNode {
    const start = p.pos;
    let ident: IdentifierReferenceNode | ErrorNode;
    let init: ExpressionNode | ErrorNode;
    p.sequence([
        () => ident = IdentifierReference(p),
        whitespace,
        () => init = Initializer(p),
    ]);
    return new CoverInitializedNameNode(new Range(start,p.pos),ident,init);
}

// Initializer

function Initializer(p: Parser): ExpressionNode | ErrorNode {
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

function MemberExpression_new(p: Parser): NewExpressionNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
    let args: ArgumentsNode | ErrorNode;
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

function MemberExpression_start(p: Parser): ExpressionNode | ErrorNode {
    return p.choice<ExpressionNode | ErrorNode>([
        PrimaryExpression,
        SuperProperty,
        MetaProperty,
        MemberExpression_new,
    ]);
}

// MemberExpression

function MemberExpression(p: Parser): ExpressionNode | ErrorNode {
    return p.attempt((start) => {
        let left = MemberExpression_start(p);
        while (true) {
            try {
                p.choice([
                    () => {
                        let expr: ExpressionNode | ErrorNode;
                        p.sequence([
                            whitespace,
                            punctuator("["),
                            whitespace,
                            () => expr = Expression(p),
                            whitespace,
                            punctuator("]"),
                        ]);
                        left = new MemberAccessExprNode(new Range(start,p.pos),left,expr);
                    },
                    () => {
                        let ident: IdentifierNode | ErrorNode;
                        p.sequence([
                            whitespace,
                            punctuator("."),
                            whitespace,
                            () => ident = IdentifierName(p),
                            whitespace,
                        ]);
                        left = new MemberAccessIdentNode(new Range(start,p.pos),left,ident);
                    },
                ]);
            }
            catch (e) {
                return left;
            }
        }
    });
}

// SuperProperty

function SuperProperty(p: Parser): SuperPropertyExprNode | SuperPropertyIdentNode | ErrorNode {
    return p.choice<SuperPropertyExprNode | SuperPropertyIdentNode | ErrorNode>([
        () => {
            const start = p.pos;
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                keyword("super"),
                whitespace,
                punctuator("["),
                whitespace,
                () => expr = Expression(p),
                whitespace,
                punctuator("]"),
            ]);
            return new SuperPropertyExprNode(new Range(start,p.pos),expr);
        },
        () => {
            const start = p.pos;
            let ident: IdentifierNode | ErrorNode;
            p.sequence([
                keyword("super"),
                whitespace,
                punctuator("."),
                whitespace,
                () => ident = Identifier(p),
            ]);
            return new SuperPropertyIdentNode(new Range(start,p.pos),ident);
        },
    ]);
}

// MetaProperty

function MetaProperty(p: Parser): NewTargetNode | ErrorNode {
    return NewTarget(p);
}

// NewTarget

function NewTarget(p: Parser): NewTargetNode | ErrorNode {
    const start = p.pos;
    let target: IdentifierNode | ErrorNode;
    p.sequence([
        keyword("new"),
        whitespace,
        punctuator("."),
        whitespace,
        () => {
            // "target" is not a reserved word, so we can't use expectKeyword here
            target = Identifier(p);
            if (target instanceof ErrorNode)
                throw new ParseError(p,p.pos,"Expected target");
            else if (target.value != "target")
                throw new ParseError(p,p.pos,"Expected target");
        },
    ]);
    return new NewTargetNode(new Range(start,p.pos));
}

// NewExpression

function NewExpression(p: Parser): ExpressionNode | ErrorNode {
    return p.choice<ExpressionNode | ErrorNode>([
        MemberExpression,
        () => {
            const start = p.pos;
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                keyword("new"),
                whitespace,
                () => expr = NewExpression(p),
            ]);
            return new NewExpressionNode(new Range(start,p.pos),expr,null);
        },
    ]);
}

// CallExpression_start

function CallExpression_start(p: Parser): ExpressionNode | ErrorNode {
    return p.choice<ExpressionNode | ErrorNode>([
        SuperCall,
        () => {
            const start = p.pos;
            let fun: ExpressionNode | ErrorNode;
            let args: ArgumentsNode | ErrorNode;
            p.sequence([
                () => fun = MemberExpression(p),
                whitespace,
                () => args = Arguments(p),
            ]);
            return new CallNode(new Range(start,p.pos),fun,args);
        },
    ]);
}

// CallExpression

function CallExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = CallExpression_start(p);
    while (true) {
        try {
            p.choice([
                () => {
                    let args: ArgumentsNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        () => args = Arguments(p),
                    ]);
                    left = new CallNode(new Range(start,p.pos),left,args);
                },
                () => {
                    let expr: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("["),
                        whitespace,
                        () => expr = Expression(p),
                        whitespace,
                        punctuator("]"),
                    ]);
                    left = new MemberAccessExprNode(new Range(start,p.pos),left,expr);
                },
                () => {
                    let idname: IdentifierNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("."),
                        whitespace,
                        () => idname = IdentifierName(p),
                    ]);
                    left = new MemberAccessIdentNode(new Range(start,p.pos),left,idname);
                },
                // () => {
                //     // TODO
                //     left = TemplateLiteral(p);
                // },
            ]);
        }
        catch (e) {
            return left;
        }
    }
}

// SuperCall

function SuperCall(p: Parser): SuperCallNode | ErrorNode {
    const start = p.pos;
    let args: ArgumentsNode | ErrorNode;
    p.sequence([
        keyword("super"),
        whitespace,
        () => args = Arguments(p),
    ]);
    return new SuperCallNode(new Range(start,p.pos),args);
}

// Arguments

function Arguments(p: Parser): ArgumentsNode | ErrorNode {
    return p.choice<ArgumentsNode | ErrorNode>([
        () => {
            const start = p.pos;
            p.sequence([
                punctuator("("),
                whitespace,
                punctuator(")"),
            ]);
            const args = new ListNode(new Range(start,p.pos),[]);
            return new ArgumentsNode(new Range(start,p.pos),args);
        },
        () => {
            const start = p.pos;
            let args: ListNode | ErrorNode;
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

function ArgumentList_item(p: Parser): ArgumentType | ErrorNode {
    return p.choice<ArgumentType | ErrorNode>([
        () => {
            const start = p.pos;
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("..."),
                whitespace,
                () => expr = AssignmentExpression(p),
            ]);
            return new SpreadElementNode(new Range(start,p.pos),expr);
        },
        AssignmentExpression,
    ]);
}

// ArgumentList

function ArgumentList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const items: (ArgumentType | ErrorNode)[] = [];
    items.push(ArgumentList_item(p));
    while (true) {
        try {
            let arg: ArgumentType | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => arg = ArgumentList_item(p),
            ]);
            items.push(arg);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),items);
        }
    }
}

// LeftHandSideExpression

function LeftHandSideExpression(p: Parser): ExpressionNode | ErrorNode {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    return p.choice([
        CallExpression,
        NewExpression,
    ]);
}

// Section 12.4

// PostfixExpression

function PostfixExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
    let result: ExpressionNode | ErrorNode;
    p.sequence([
        () => expr = LeftHandSideExpression(p),
        () => result = p.choice<ExpressionNode | ErrorNode>([
            () => {
                p.sequence([
                    whitespaceNoNewline,
                    punctuator("++"),
                ]);
                return new PostIncrementNode(new Range(start,p.pos),expr);
            },
            () => {
                p.sequence([
                    whitespaceNoNewline,
                    punctuator("--"),
                ]);
                return new PostDecrementNode(new Range(start,p.pos),expr);
            },
            () => expr,
        ]),
    ]);
    return result;
}

// Section 12.5

// UnaryExpression

function UnaryExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    return p.choice([
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                keyword("delete"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new DeleteNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                keyword("void"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new VoidNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                keyword("typeof"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new TypeOfNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("++"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new PreIncrementNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("--"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new PreDecrementNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("+"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryPlusNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("-"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryMinusNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("~"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryBitwiseNotNode(new Range(start,p.pos),expr);
        },
        () => {
            let expr: ExpressionNode | ErrorNode;
            p.sequence([
                punctuator("!"),
                whitespace,
                () => expr = UnaryExpression(p),
            ]);
            return new UnaryLogicalNotNode(new Range(start,p.pos),expr);
        },
        PostfixExpression,
    ]);
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = UnaryExpression(p);
    while (true) {
        try {
            p.choice([
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("*"),
                        whitespace,
                        () => right = UnaryExpression(p),
                    ]);
                    left = new MultiplyNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("/"),
                        whitespace,
                        () => right = UnaryExpression(p),
                    ]);
                    left = new DivideNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("%"),
                        whitespace,
                        () => right = UnaryExpression(p),
                    ]);
                    left = new ModuloNode(new Range(start,p.pos),left,right);
                },
            ]);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.7

// AdditiveExpression

function AdditiveExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = MultiplicativeExpression(p);
    while (true) {
        try {
            p.choice([
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("+"),
                        whitespace,
                        () => right = MultiplicativeExpression(p),
                    ]);
                    left = new AddNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("-"),
                        whitespace,
                        () => right = MultiplicativeExpression(p),
                    ]);
                    left = new SubtractNode(new Range(start,p.pos),left,right);
                },
            ]);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.8

// ShiftExpression

function ShiftExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = AdditiveExpression(p);
    while (true) {
        try {
            p.choice([
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("<<"),
                        whitespace,
                        () => right = AdditiveExpression(p),
                    ]);
                    left = new LeftShiftNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator(">>>"),
                        whitespace,
                        () => right = AdditiveExpression(p),
                    ]);
                    left = new UnsignedRightShiftNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator(">>"),
                        whitespace,
                        () => right = AdditiveExpression(p),
                    ]);
                    left = new SignedRightShiftNode(new Range(start,p.pos),left,right);
                },
            ]);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.9

// RelationalExpression

function RelationalExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = ShiftExpression(p);
    while (true) {
        try {
            p.choice([
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("<="),
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new LessEqualNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator(">="),
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new GreaterEqualNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("<"),
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new LessThanNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator(">"),
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new GreaterThanNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        keyword("instanceof"),
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new InstanceOfNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        keyword("in"),
                        whitespace,
                        () => right = ShiftExpression(p),
                    ]);
                    left = new InNode(new Range(start,p.pos),left,right);
                },
            ]);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.10

// EqualityExpression

function EqualityExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = RelationalExpression(p);
    while (true) {
        try {
            p.choice([
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("==="),
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new StrictEqualsNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("!=="),
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new StrictNotEqualsNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("=="),
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new AbstractEqualsNode(new Range(start,p.pos),left,right);
                },
                () => {
                    let right: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator("!="),
                        whitespace,
                        () => right = RelationalExpression(p),
                    ]);
                    left = new AbstractNotEqualsNode(new Range(start,p.pos),left,right);
                },
            ]);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = EqualityExpression(p);
    while (true) {
        try {
            let right: ExpressionNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator("&"),
                whitespace,
                () => right = EqualityExpression(p),
            ]);
            left = new BitwiseANDNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            return left;
        }
    }
}

// BitwiseXORExpression

function BitwiseXORExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = BitwiseANDExpression(p);
    while (true) {
        try {
            let right: ExpressionNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator("^"),
                whitespace,
                () => right = BitwiseANDExpression(p),
            ]);
            left = new BitwiseXORNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            return left;
        }
    }
}

// BitwiseORExpression

function BitwiseORExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = BitwiseXORExpression(p);
    while (true) {
        try {
            let right: ExpressionNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator("|"),
                whitespace,
                () => right = BitwiseXORExpression(p),
            ]);
            left = new BitwiseORNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = BitwiseORExpression(p);
    while (true) {
        try {
            let right: ExpressionNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator("&&"),
                whitespace,
                () => right = BitwiseORExpression(p),
            ]);
            left = new LogicalANDNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            return left;
        }
    }
}

// LogicalORExpression

function LogicalORExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = LogicalANDExpression(p);
    while (true) {
        try {
            let right: ExpressionNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator("||"),
                whitespace,
                () => right = LogicalANDExpression(p),
            ]);
            left = new LogicalORNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 12.13

// ConditionalExpression

function ConditionalExpression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let condition = LogicalORExpression(p);
    return p.choice([
        () => {
            let trueExpr: ExpressionNode | ErrorNode;
            let falseExpr: ExpressionNode | ErrorNode;
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
        },
        () => condition,
    ]);
}

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left: ExpressionNode | ErrorNode;
    let result: ExpressionNode | ErrorNode;
    p.sequence([
        () => left = LeftHandSideExpression(p),
        () => result = p.choice<ExpressionNode | ErrorNode>([
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("*="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignMultiplyNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("/="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignDivideNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("%="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignModuloNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("+="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignAddNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("-="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignSubtractNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("<<="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignLeftShiftNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator(">>="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignSignedRightShiftNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator(">>>="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignUnsignedRightShiftNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("&="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignBitwiseANDNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("^="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignBitwiseXORNode(new Range(start,p.pos),left,right);
            },
            () => {
                let right: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    punctuator("|="),
                    whitespace,
                    () => right = AssignmentExpression(p),
                ]);
                return new AssignBitwiseORNode(new Range(start,p.pos),left,right);
            },
        ]),
    ]);
    return result;
}

// AssignmentExpression

function AssignmentExpression(p: Parser): ExpressionNode | ErrorNode {
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    return p.choice([
        ArrowFunction,
        AssignmentExpression_plain,
        ConditionalExpression,
        YieldExpression,
    ]);
}

// Section 12.15

// Expression

function Expression(p: Parser): ExpressionNode | ErrorNode {
    const start = p.pos;
    let left = AssignmentExpression(p);
    while (true) {
        try {
            let right: ExpressionNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => right = AssignmentExpression(p),
            ]);
            left = new CommaNode(new Range(start,p.pos),left,right);
        }
        catch (e) {
            return left;
        }
    }
}

// Section 13

// Statement

function Statement(p: Parser): StatementNode | ErrorNode {
    // return p.choice<StatementNode | ErrorNode>([
    return p.choice<StatementNode | ErrorNode>([
        BlockStatement,
        VariableStatement,
        EmptyStatement,
        ExpressionStatement,
        IfStatement,
        BreakableStatement,
        ContinueStatement,
        BreakStatement,
        ReturnStatement,
        WithStatement,
        LabelledStatement,
        ThrowStatement,
        TryStatement,
        DebuggerStatement,
    ]);
}

// Declaration

function Declaration(p: Parser): DeclarationNode | ErrorNode {
    return p.choice<DeclarationNode | ErrorNode>([
        HoistableDeclaration,
        ClassDeclaration,
        LexicalDeclaration,
    ]);
}

// HoistableDeclaration

function HoistableDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): DeclarationNode | ErrorNode {
    return p.choice<DeclarationNode | ErrorNode>([
        () => FunctionDeclaration(p,flags),
        () => GeneratorDeclaration(p,flags),
    ]);
}

// BreakableStatement

function BreakableStatement(p: Parser): BreakableStatementNode | ErrorNode {
    return p.choice<BreakableStatementNode | ErrorNode>([
        IterationStatement,
        SwitchStatement,
    ]);
}

// Section 13.2

// BlockStatement

function BlockStatement(p: Parser): BlockNode | ErrorNode {
    return Block(p);
}

// Block

function Block(p: Parser): BlockNode | ErrorNode {
    const start = p.pos;
    let statements: ListNode | ErrorNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => statements = p.choice([
            () => {
                let inner: ListNode | ErrorNode;
                p.sequence([
                    () => inner = StatementList(p),
                    whitespace,
                ]);
                return inner;
            },
            () => new ListNode(new Range(p.pos,p.pos),[]),
        ]),
        punctuator("}"),
    ]);
    return new BlockNode(new Range(start,p.pos),statements);
}

// StatementList

function StatementList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const statements: (StatementListItemType | ErrorNode)[] = [];
    statements.push(StatementListItem(p));
    while (true) {
        try {
            let stmt: StatementListItemType | ErrorNode;
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

function StatementListItem(p: Parser): StatementListItemType | ErrorNode {
    return p.choice<StatementListItemType | ErrorNode>([
        Statement,
        Declaration,
    ]);
}

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(p: Parser): DeclarationNode | ErrorNode {
    return p.choice<DeclarationNode | ErrorNode>([
        () => {
            const start = p.pos;
            let bindings: ListNode | ErrorNode;
            p.sequence([
                keyword("let"),
                whitespace,
                () => bindings = BindingList(p),
                whitespace,
                punctuator(";"),
            ]);
            return new LetNode(new Range(start,p.pos),bindings);
        },
        () => {
            const start = p.pos;
            let bindings: ListNode | ErrorNode;
            p.sequence([
                keyword("const"),
                whitespace,
                () => bindings = BindingList(p),
                whitespace,
                punctuator(";"),
            ]);
            return new ConstNode(new Range(start,p.pos),bindings);
        },
    ]);
}

// BindingList

function BindingList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const bindings: (LexicalIdentifierBindingNode | LexicalPatternBindingNode | ErrorNode)[] = [];
    bindings.push(LexicalBinding(p));
    while (true) {
        try {
            let lexbnd: LexicalIdentifierBindingNode | LexicalPatternBindingNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => lexbnd = LexicalBinding(p),
            ]);
            bindings.push(lexbnd);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),bindings);
        }
    }
}

// LexicalBinding_identifier

function LexicalBinding_identifier(p: Parser): LexicalIdentifierBindingNode | ErrorNode {
    const start = p.pos;
    let identifier: BindingIdentifierNode | ErrorNode;
    let initializer: ExpressionNode | ErrorNode;
    p.sequence([
        () => identifier = BindingIdentifier(p),
        whitespace,
        () => initializer = p.opt(() => {
            let inner: ExpressionNode | ErrorNode;
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

function LexicalBinding_pattern(p: Parser): LexicalPatternBindingNode | ErrorNode {
    const start = p.pos;
    let pattern: ObjectBindingPatternNode | ArrayBindingPatternNode | ErrorNode;
    let initializer: ExpressionNode | ErrorNode;
    p.sequence([
        () => pattern = BindingPattern(p),
        whitespace,
        () => initializer = Initializer(p),
    ]);
    return new LexicalPatternBindingNode(new Range(start,p.pos),pattern,initializer);
}

// LexicalBinding

function LexicalBinding(p: Parser): LexicalIdentifierBindingNode | LexicalPatternBindingNode | ErrorNode {
    return p.choice<LexicalIdentifierBindingNode | LexicalPatternBindingNode | ErrorNode>([
        LexicalBinding_identifier,
        LexicalBinding_pattern,
    ]);
}

// Section 13.3.2

// VariableStatement

function VariableStatement(p: Parser): VarNode | ErrorNode {
    const start = p.pos;
    let declarations: ListNode | ErrorNode;
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

function VariableDeclarationList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const declarations: (VarIdentifierNode | VarPatternNode | ErrorNode)[] = [];
    declarations.push(VariableDeclaration(p));
    while (true) {
        try {
            let decl: VarIdentifierNode | VarPatternNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => decl = VariableDeclaration(p),
            ]);
            declarations.push(decl);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),declarations);
        }
    }
}

// VariableDeclaration_identifier

function VariableDeclaration_identifier(p: Parser): VarIdentifierNode | ErrorNode {
    let identifier: BindingIdentifierNode | ErrorNode;
    let result: VarIdentifierNode;
    const start = p.pos;
    p.sequence([
        () => identifier = BindingIdentifier(p),
        () => result = p.choice([
            () => {
                let initializer: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    () => initializer = Initializer(p),
                ]);
                return new VarIdentifierNode(new Range(start,p.pos),identifier,initializer);
            },
            () => {
                return new VarIdentifierNode(new Range(start,p.pos),identifier,null);
            }
        ]),
    ]);
    return result;
}

// VariableDeclaration_pattern

function VariableDeclaration_pattern(p: Parser): VarPatternNode | ErrorNode {
    const start = p.pos;
    let pattern: ObjectBindingPatternNode | ArrayBindingPatternNode | ErrorNode;
    let initializer: ExpressionNode | ErrorNode;
    p.sequence([
        () => pattern = BindingPattern(p),
        whitespace,
        () => initializer = Initializer(p),
    ]);
    return new VarPatternNode(new Range(start,p.pos),pattern,initializer);
}

// VariableDeclaration

function VariableDeclaration(p: Parser): VarIdentifierNode | VarPatternNode | ErrorNode {
    return p.choice<VarIdentifierNode | VarPatternNode | ErrorNode>([
        VariableDeclaration_identifier,
        VariableDeclaration_pattern,
    ]);
}

// Section 13.3.3

// BindingPattern

function BindingPattern(p: Parser): BindingPatternType | ErrorNode {
    return p.choice<BindingPatternType | ErrorNode>([
        ObjectBindingPattern,
        ArrayBindingPattern,
    ]);
}

// ObjectBindingPattern

function ObjectBindingPattern(p: Parser): ObjectBindingPatternNode | ErrorNode {
    const start = p.pos;
    let properties: ListNode | ErrorNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => properties = p.choice([
            () => {
                let inner: ListNode | ErrorNode;
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
            },
            () => new ListNode(new Range(start,p.pos),[]),
        ]),
        punctuator("}"),
    ]);
    return new ObjectBindingPatternNode(new Range(start,p.pos),properties);
}

// ArrayBindingPattern_1

function ArrayBindingPattern_1(p: Parser): ArrayBindingPatternNode | ErrorNode {
    const start = p.pos;
    let elision: ElisionNode | ErrorNode;
    let rest: BindingRestElementNode | ErrorNode;
    p.sequence([
        punctuator("["),
        whitespace,
        () => elision = p.opt(() => {
            let inner: ElisionNode | ErrorNode;
            p.sequence([
                () => inner = Elision(p),
                whitespace,
            ]);
            return inner;
        }),
        () => rest = p.opt(() => {
            let inner: BindingRestElementNode | ErrorNode;
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
}

// ArrayBindingPattern_2

function ArrayBindingPattern_2(p: Parser): ArrayBindingPatternNode | ErrorNode {
    const start = p.pos;
    let elements: ListNode | ErrorNode;
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

function ArrayBindingPattern_3(p: Parser): ArrayBindingPatternNode | ErrorNode {
    const start = p.pos;
    let elements: ListNode | ErrorNode;
    let elision: ElisionNode | ErrorNode;
    let rest: BindingRestElementNode | ErrorNode;
    p.sequence([
        punctuator("["),
        whitespace,
        () => elements = BindingElementList(p),
        whitespace,
        punctuator(","),
        whitespace,
        () => elision = p.opt(() => {
            let inner: ElisionNode | ErrorNode;
            p.sequence([
                () => inner = Elision(p),
                whitespace,
            ]);
            return inner;
        }),
        () => rest = p.opt(() => {
            let inner: BindingRestElementNode | ErrorNode;
            p.sequence([
                () => inner = BindingRestElement(p),
                whitespace,
            ]);
            return inner;
        }),
        punctuator("]"),
    ]);

    let array: ASTNode[] = [];
    if (!(elements instanceof ErrorNode))
        array = array.concat(elements.elements);
    if (elision != null)
        array.push(elision);
    if (rest != null)
        array.push(rest);

    const allElements = new ListNode(new Range(start,p.pos),array);
    return new ArrayBindingPatternNode(new Range(start,p.pos),allElements);
}

// ArrayBindingPattern

function ArrayBindingPattern(p: Parser): ArrayBindingPatternNode | ErrorNode {
    return p.choice([
        ArrayBindingPattern_1,
        ArrayBindingPattern_2,
        ArrayBindingPattern_3,
    ]);
}

// BindingPropertyList

function BindingPropertyList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const properties: (BindingPropertyType | ErrorNode)[] = [];
    properties.push(BindingProperty(p));
    while (true) {
        try {
            let prop: BindingPropertyType | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => prop = BindingProperty(p),
            ]);
            properties.push(prop);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),properties);
        }
    }
}

// BindingElementList

function BindingElementList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const elements: (BindingElementType | ErrorNode)[] = [];
    elements.push(BindingElisionElement(p));
    while (true) {
        try {
            let elem: BindingElementType | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => elem = BindingElisionElement(p),
            ]);
            elements.push(elem);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// BindingElisionElement

function BindingElisionElement(p: Parser): BindingElementType | ErrorNode {
    return p.choice<BindingElementType | ErrorNode>([
        () => {
            const start = p.pos;
            let elision: ElisionNode | ErrorNode;
            let element: BindingElementType | ErrorNode;
            p.sequence([
                () => elision = Elision(p),
                whitespace,
                () => element = BindingElement(p),
            ]);
            return new BindingElisionElementNode(new Range(start,p.pos),elision,element);
        },
        BindingElement,
    ]);
}

// BindingProperty

function BindingProperty(p: Parser): BindingPropertyType | ErrorNode {
    return p.choice<BindingPropertyType | ErrorNode>([
        () => {
            const start = p.pos;
            let name: PropertyNameType | ErrorNode;
            let element: BindingElementType | ErrorNode;
            p.sequence([
                () => name = PropertyName(p),
                whitespace,
                punctuator(":"),
                whitespace,
                () => element = BindingElement(p),
            ]);
            return new BindingPropertyNode(new Range(start,p.pos),name,element);
        },
        // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
        // and PropertyName will match an identifier at the start of a colon binding
        SingleNameBinding,
    ]);
}

// BindingElement

function BindingElement(p: Parser): BindingElementType | ErrorNode {
    return p.choice<BindingElementType | ErrorNode>([
        SingleNameBinding,
        () => {
            const start = p.pos;
            const pattern = BindingPattern(p);
            return p.choice<BindingElementType | ErrorNode>([
                () => {
                    let init: ExpressionNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        () => init = Initializer(p),
                    ]);
                    return new BindingPatternInitNode(new Range(start,p.pos),pattern,init);
                },
                () => pattern,
            ]);
        },
    ]);
}

// SingleNameBinding

function SingleNameBinding(p: Parser): SingleNameBindingType | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode;
    let result: SingleNameBindingType | ErrorNode;
    p.sequence([
        () => ident = BindingIdentifier(p),
        () => result = p.choice<BindingIdentifierNode | SingleNameBindingNode | ErrorNode>([
            () => {
                let init: ExpressionNode | ErrorNode;
                p.sequence([
                    whitespace,
                    () => init = Initializer(p),
                ]);
                return new SingleNameBindingNode(new Range(start,p.pos),ident,init);
            },
            () => ident,
        ]),
    ]);
    return result;
}

// BindingRestElement

function BindingRestElement(p: Parser): BindingRestElementNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode;
    p.sequence([
        punctuator("..."),
        whitespace,
        () => ident = BindingIdentifier(p),
    ]);
    return new BindingRestElementNode(new Range(start,p.pos),ident);
}

// Section 13.4

// EmptyStatement

function EmptyStatement(p: Parser): EmptyStatementNode | ErrorNode {
    const start = p.pos;
    p.sequence([
        punctuator(";"),
    ]);
    return new EmptyStatementNode(new Range(start,p.pos));
}

// Section 13.5

// ExpressionStatement

function ExpressionStatement(p: Parser): ExpressionStatementNode | ErrorNode {
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

    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
    p.sequence([
        () => expr = Expression(p),
        whitespace,
        punctuator(";"),
    ]);
    return new ExpressionStatementNode(new Range(start,p.pos),expr);
}

// Section 13.6

// IfStatement

function IfStatement(p: Parser): IfStatementNode | ErrorNode {
    const start = p.pos;
    let condition: ExpressionNode | ErrorNode;
    let trueBranch: StatementNode | ErrorNode;
    let falseBranch: StatementNode | ErrorNode;
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
        () => falseBranch = p.opt(() => {
            let fb: StatementNode | ErrorNode;
            p.sequence([
                whitespace,
                keyword("else"),
                whitespace,
                () => fb = Statement(p),
            ]);
            return fb;
        }),
    ]);
    return new IfStatementNode(new Range(start,p.pos),condition,trueBranch,falseBranch);
}

// Section 13.7

// IterationStatement_do

function IterationStatement_do(p: Parser): DoStatementNode | ErrorNode {
    const start = p.pos;
    let body: StatementNode | ErrorNode = null;
    let condition: ExpressionNode | ErrorNode = null;
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

function IterationStatement_while(p: Parser): WhileStatementNode | ErrorNode {
    const start = p.pos;
    let condition: ExpressionNode | ErrorNode = null;
    let body: StatementNode | ErrorNode = null;
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

function IterationStatement_for_c(p: Parser): ForCNode | ErrorNode {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    const start = p.pos;
    let init: ForCInitType | ErrorNode;
    let condition: ExpressionNode | ErrorNode;
    let update: ExpressionNode | ErrorNode;
    let body: StatementNode | ErrorNode;
    p.sequence([
        keyword("for"),
        whitespace,
        punctuator("("),
        whitespace,
        () => init = p.choice<ForCInitType | ErrorNode>([
            () => {
                let inner: ExpressionNode | ErrorNode = null;
                p.sequence([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    () => inner = Expression(p),
                    whitespace,
                    punctuator(";"),
                    whitespace,
                ]);
                return inner;
            },
            () => {
                const start2 = p.pos;
                let inner: VarNode | ErrorNode;
                p.sequence([
                    keyword("var"),
                    whitespace,
                    () => {
                        const declarations = VariableDeclarationList(p);
                        inner = new VarNode(new Range(start2,p.pos),declarations);
                    },
                    whitespace,
                    punctuator(";"),
                    whitespace,
                ]);
                return inner;
            },
            () => {
               let inner: DeclarationNode | ErrorNode = null;
               p.sequence([
                   () => inner = LexicalDeclaration(p),
                   whitespace,
               ]);
               return inner;
           },
           () => {
                // initializer part can be empty, but need to distinguish this from an error
                p.sequence([
                    punctuator(";"),
                ]);
                return null;
            }
        ]),
        () => condition = p.opt(() => {
            return Expression(p);
        }),
        whitespace,
        punctuator(";"),
        whitespace,
        () => update = p.opt(() => {
            let inner: ExpressionNode | ErrorNode;
            p.sequence([
                () => inner = Expression(p),
                whitespace,
            ]);
            return inner;
        }),
        punctuator(")"),
        whitespace,
        () => body = Statement(p),
    ]);
    return new ForCNode(new Range(start,p.pos),init,condition,update,body);
}

// IterationStatement_for_in

function IterationStatement_for_in(p: Parser): ForInNode | ErrorNode {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    const start = p.pos;
    let binding: ForInBindingType | ErrorNode;
    let expr: ExpressionNode | ErrorNode;
    let body: StatementNode | ErrorNode;
    p.sequence([
        keyword("for"),
        whitespace,
        punctuator("("),
        whitespace,
        () => binding = p.choice<ForInBindingType | ErrorNode>([
            () => {
                let inner: ExpressionNode | ErrorNode;
                p.sequence([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    () => inner = LeftHandSideExpression(p),
                ]);
                return inner;
            },
            () => {
                const start2 = p.pos;
                let inner: ForBindingType | ErrorNode;
                p.sequence([
                    keyword("var"),
                    whitespace,
                    () => inner = ForBinding(p),
                ]);
                return new VarForDeclarationNode(new Range(start2,p.pos),inner);
            },
            ForDeclaration,
        ]),
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
}

// IterationStatement_for_of

function IterationStatement_for_of(p: Parser): ForOfNode | ErrorNode {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    const start = p.pos;
    let binding: ForOfBindingType | ErrorNode;
    let expr: ExpressionNode | ErrorNode;
    let body: StatementNode | ErrorNode;
    p.sequence([
        keyword("for"),
        whitespace,
        punctuator("("),
        whitespace,
        () => binding = p.choice<ForOfBindingType | ErrorNode>([
            () => {
                let inner: ExpressionNode | ErrorNode;
                p.sequence([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    () => inner = LeftHandSideExpression(p),
                ]);
                return inner;
            },
            () => {
                const start2 = p.pos;
                let inner: ForBindingType | ErrorNode;
                p.sequence([
                    keyword("var"),
                    whitespace,
                    () => inner = ForBinding(p),
                ]);
                return new VarForDeclarationNode(new Range(start2,p.pos),inner);
            },
            ForDeclaration,
        ]),
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
}

// IterationStatement_for

function IterationStatement_for(p: Parser): BreakableStatementNode | ErrorNode {
    return p.choice<BreakableStatementNode | ErrorNode>([
        IterationStatement_for_c,
        IterationStatement_for_in,
        IterationStatement_for_of,
    ]);
}

// IterationStatement

function IterationStatement(p: Parser): BreakableStatementNode | ErrorNode {
    return p.choice<BreakableStatementNode | ErrorNode>([
        IterationStatement_do,
        IterationStatement_while,
        IterationStatement_for,
    ]);
}

// ForDeclaration

function ForDeclaration(p: Parser): LetForDeclarationNode | ConstForDeclarationNode | ErrorNode {
    return p.choice<LetForDeclarationNode | ConstForDeclarationNode | ErrorNode>([
        () => {
            const start = p.pos;
            let binding: ForBindingType | ErrorNode;
            p.sequence([
                keyword("let"),
                whitespace,
                () => binding = ForBinding(p),
            ]);
            return new LetForDeclarationNode(new Range(start,p.pos),binding);
        },
        () => {
            const start = p.pos;
            let binding: ForBindingType | ErrorNode;
            p.sequence([
                keyword("const"),
                whitespace,
                () => binding = ForBinding(p),
            ]);
            return new ConstForDeclarationNode(new Range(start,p.pos),binding);
        },
    ]);
}

// ForBinding

function ForBinding(p: Parser): ForBindingType | ErrorNode {
    return p.choice<ForBindingType | ErrorNode>([
        BindingIdentifier,
        BindingPattern, // FIXME: Need test cases for this
    ]);
}

// Section 13.8

// ContinueStatement

function ContinueStatement(p: Parser): ContinueStatementNode | ErrorNode {
    return p.choice<ContinueStatementNode | ErrorNode>([
        () => {
            const start = p.pos;
            p.sequence([
                keyword("continue"),
                whitespace,
                punctuator(";"),
            ]);
            return new ContinueStatementNode(new Range(start,p.pos),null);
        },
        () => {
            const start = p.pos;
            let labelIdentifier: LabelIdentifierNode | ErrorNode = null;
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

function BreakStatement(p: Parser): BreakStatementNode | ErrorNode {
    return p.choice<BreakStatementNode | ErrorNode>([
        () => {
            const start = p.pos;
            p.sequence([
                keyword("break"),
                whitespace,
                punctuator(";"),
            ]);
            return new BreakStatementNode(new Range(start,p.pos),null);
        },
        () => {
            const start = p.pos;
            let labelIdentifier: LabelIdentifierNode | ErrorNode = null;
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

function ReturnStatement(p: Parser): ReturnStatementNode | ErrorNode {
    return p.choice<ReturnStatementNode | ErrorNode>([
        () => {
            const start = p.pos;
            p.sequence([
                keyword("return"),
                whitespace,
                punctuator(";"),
            ]);
            return new ReturnStatementNode(new Range(start,p.pos),null);
        },
        () => {
            const start = p.pos;
            let expr: ExpressionNode | ErrorNode = null;
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

function WithStatement(p: Parser): WithStatementNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode = null;
    let body: StatementNode | ErrorNode = null;
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

function SwitchStatement(p: Parser): SwitchStatementNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode = null;
    let cases: ListNode | ErrorNode = null;
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

function CaseBlock_1(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    let clauses: ListNode | ErrorNode = null;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => clauses = p.choice([
            CaseClauses,
            () => new ListNode(new Range(start,p.pos),[]),
        ]),
        whitespace,
        punctuator("}"),
    ]);
    return clauses;
}

// CaseBlock_2

function CaseBlock_2(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    let clauses1: ListNode | ErrorNode;
    let clauses2: ListNode | ErrorNode;
    let defaultClause: DefaultClauseNode | ErrorNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => clauses1 = p.opt(CaseClauses),
        whitespace,
        () => defaultClause = DefaultClause(p),
        whitespace,
        () => clauses2 = p.opt(CaseClauses),
        whitespace,
        punctuator("}"),
    ]);
    let elements1: ASTNode[] = [];
    let elements2: ASTNode[] = [];
    if (clauses1 != null) {
        if (clauses1 instanceof ErrorNode)
            elements1 = [clauses1];
        else
            elements1 = clauses1.elements;
    }
    if (clauses2 != null) {
        if (clauses2 instanceof ErrorNode)
            elements2 = [clauses2];
        else
            elements2 = clauses2.elements;
    }
    const combined = [].concat(elements1,defaultClause,elements2);
    return new ListNode(new Range(start,p.pos),combined);
}

// CaseBlock

function CaseBlock(p: Parser): ListNode | ErrorNode {
    return p.choice([
        CaseBlock_1,
        CaseBlock_2,
    ]);
}

// CaseClauses

function CaseClauses(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const clauses: (CaseClauseNode | ErrorNode)[] = [];
    clauses.push(CaseClause(p));
    while (true) {
        try {
            let clause: CaseClauseNode | ErrorNode;
            p.sequence([
                () => clause = CaseClause(p),
            ]);
            clauses.push(clause);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),clauses);
        }
    }
}

// CaseClause

function CaseClause(p: Parser): CaseClauseNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode = null;
    let statements: ListNode | ErrorNode = null;
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

function DefaultClause(p: Parser): DefaultClauseNode | ErrorNode {
    const start = p.pos;
    let statements: ListNode | ErrorNode = null;
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

function LabelledStatement(p: Parser): LabelledStatementNode | ErrorNode {
    const start = p.pos;
    let ident: LabelIdentifierNode | ErrorNode = null;
    let item: StatementNode | FunctionDeclarationNode | ErrorNode = null;
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

function LabelledItem(p: Parser): StatementNode | FunctionDeclarationNode | ErrorNode {
    return p.choice<StatementNode | FunctionDeclarationNode | ErrorNode>([
        Statement,
        FunctionDeclaration,
    ]);
}

// Section 13.14

// ThrowStatement

function ThrowStatement(p: Parser): ThrowStatementNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode = null;
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

function TryStatement(p: Parser): TryStatementNode | ErrorNode {
    return p.attempt((start) => {
        let tryBlock: BlockNode | ErrorNode;
        let catchBlock: CatchNode | ErrorNode;
        let finallyBlock: FinallyNode | ErrorNode;

        p.sequence([
            keyword("try"),
            whitespace,
            () => tryBlock = Block(p),
        ]);

        finallyBlock = p.opt(() => {
            let inner: FinallyNode | ErrorNode;
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
                    let inner: FinallyNode | ErrorNode;
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

function Catch(p: Parser): CatchNode | ErrorNode {
    const start = p.pos;
    let param: CatchParameterType | ErrorNode;
    let block: BlockNode | ErrorNode = null;
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

function Finally(p: Parser): FinallyNode | ErrorNode {
    const start = p.pos;
    let block: BlockNode | ErrorNode = null;
    p.sequence([
        keyword("finally"),
        whitespace,
        () => block = Block(p),
    ]);
    return new FinallyNode(new Range(start,p.pos),block);
}

// CatchParameter

function CatchParameter(p: Parser): CatchParameterType | ErrorNode {
    return p.choice<CatchParameterType | ErrorNode>([
        BindingIdentifier,
        BindingPattern,
    ]);
}

// Section 13.16

// DebuggerStatement

function DebuggerStatement(p: Parser): DebuggerStatementNode | ErrorNode {
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

function FunctionDeclaration_named(p: Parser): FunctionDeclarationNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode = null;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
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

function FunctionDeclaration_unnamed(p: Parser): FunctionDeclarationNode | ErrorNode {
    const start = p.pos;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
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

function FunctionDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): FunctionDeclarationNode | ErrorNode {
    if (flags === undefined)
        flags = {};
    try { return FunctionDeclaration_named(p); } catch (e) {}
    if (flags.Default)
        try { return FunctionDeclaration_unnamed(p); } catch (e) {}
    throw new ParseError(p,p.pos,"Expected FunctionDeclaration");
}

// FunctionExpression

function FunctionExpression(p: Parser): FunctionExpressionNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode = null;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        () => ident = p.opt(() => {
            let inner: BindingIdentifierNode | ErrorNode = null;
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

function StrictFormalParameters(p: Parser): ListNode | ErrorNode {
    return FormalParameters(p);
}

// FormalParameters

function FormalParameters(p: Parser): ListNode | ErrorNode {
    return p.choice([
        FormalParameterList,
        () => new ListNode(new Range(p.pos,p.pos),[]),
    ]);
}

// FormalParameterList

function FormalParameterList(p: Parser): ListNode | ErrorNode {
    return p.choice([
        (): ListNode | ErrorNode => {
            const start = p.pos;
            const rest = FunctionRestParameter(p);
            return new ListNode(new Range(start,p.pos),[rest]);
        },
        (): ListNode | ErrorNode => {
            const start = p.pos;
            const formals = FormalsList(p);
            return p.choice([
                (): ListNode | ErrorNode => {
                    let elements: ASTNode[] = null;
                    p.sequence([
                        whitespace,
                        punctuator(","),
                        whitespace,
                        () => {
                            const rest = FunctionRestParameter(p);
                            if (formals instanceof ErrorNode)
                                elements = [formals];
                            else
                                elements = formals.elements;
                            elements.push(rest);
                        },
                    ]);
                    return new ListNode(new Range(start,p.pos),elements);
                },
                (): ListNode | ErrorNode => formals,
            ]);
        },
    ]);
}

// FormalsList

function FormalsList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const elements: (BindingElementType | ErrorNode)[] = [];
    elements.push(FormalParameter(p));
    while (true) {
        try {
            let param: BindingElementType | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => param = FormalParameter(p),
            ]);
            elements.push(param);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// FunctionRestParameter

function FunctionRestParameter(p: Parser): BindingRestElementNode | ErrorNode {
    return BindingRestElement(p);
}

// FormalParameter

function FormalParameter(p: Parser): BindingElementType | ErrorNode {
    return BindingElement(p);
}

// FunctionBody

function FunctionBody(p: Parser): ListNode | ErrorNode {
    return FunctionStatementList(p);
}

// FunctionStatementList

function FunctionStatementList(p: Parser): ListNode | ErrorNode {
    return p.choice([
        StatementList,
        () => new ListNode(new Range(p.pos,p.pos),[]),
    ]);
}

// Section 14.2

// ArrowFunction

function ArrowFunction(p: Parser): ArrowFunctionNode | ErrorNode {
    const start = p.pos;
    let params: BindingIdentifierNode | ListNode | ErrorNode = null;
    let body: ExpressionNode | ListNode | ErrorNode = null;
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

function ArrowParameters(p: Parser): BindingIdentifierNode | ListNode | ErrorNode {
    return p.choice<BindingIdentifierNode | ListNode | ErrorNode>([
        BindingIdentifier,
        ArrowFormalParameters,
    ]);
}

// ConciseBody_1

function ConciseBody_1(p: Parser): ExpressionNode | ErrorNode {
    if (p.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    return AssignmentExpression(p);
}

// ConciseBody_2

function ConciseBody_2(p: Parser): ListNode | ErrorNode {
    let body: ListNode | ErrorNode = null;
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

function ConciseBody(p: Parser): ExpressionNode | ListNode | ErrorNode {
    return p.choice<ExpressionNode | ListNode | ErrorNode>([
        ConciseBody_1,
        ConciseBody_2,
    ]);
}

// ArrowFormalParameters

function ArrowFormalParameters(p: Parser): ListNode | ErrorNode {
    let params: ListNode | ErrorNode = null;
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

function MethodDefinition_1(p: Parser): MethodNode | ErrorNode {
    const start = p.pos;
    let name: PropertyNameType | ErrorNode = null;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
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

function MethodDefinition_2(p: Parser): GeneratorMethodNode | ErrorNode {
    return GeneratorMethod(p);
}

// MethodDefinition_3

function MethodDefinition_3(p: Parser): GetterNode | ErrorNode {
    const start = p.pos;
    // "get" is not a reserved word, so we can't use expectKeyword here
    let name: PropertyNameType | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
    p.sequence([
        identifier("get"),
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

function MethodDefinition_4(p: Parser): SetterNode | ErrorNode {
    const start = p.pos;
    // "set" is not a reserved word, so we can't use expectKeyword here
    let name: PropertyNameType | ErrorNode = null;
    let param: BindingElementType | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
    p.sequence([
        identifier("set"),
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

function MethodDefinition(p: Parser): MethodDefinitionNode | ErrorNode {
    return p.choice<MethodDefinitionNode | ErrorNode>([
        MethodDefinition_1,
        MethodDefinition_2,
        MethodDefinition_3,
        MethodDefinition_4,
    ]);
}

// PropertySetParameterList

function PropertySetParameterList(p: Parser): BindingElementType | ErrorNode {
    return FormalParameter(p);
}

// Section 14.4

// GeneratorMethod

function GeneratorMethod(p: Parser): GeneratorMethodNode | ErrorNode {
    const start = p.pos;
    let name: PropertyNameType | ErrorNode = null;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
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

function GeneratorDeclaration_1(p: Parser): GeneratorDeclarationNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode = null;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
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

function GeneratorDeclaration_2(p: Parser): DefaultGeneratorDeclarationNode | ErrorNode {
    const start = p.pos;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
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

function GeneratorDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): DeclarationNode | ErrorNode {
    if (flags === undefined)
        flags = {};
    try { return GeneratorDeclaration_1(p); } catch (e) {}
    if (flags.Default)
        try { return GeneratorDeclaration_2(p); } catch (e) {} // FIXME: default only
    throw new ParseError(p,p.pos,"Expected GeneratorDeclaration");
}

// GeneratorExpression

function GeneratorExpression(p: Parser): GeneratorExpressionNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode;
    let params: ListNode | ErrorNode = null;
    let body: ListNode | ErrorNode = null;
    p.sequence([
        keyword("function"),
        whitespace,
        punctuator("*"),
        whitespace,
        () => ident = p.opt(() => {
            let inner: BindingIdentifierNode | ErrorNode;
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

function GeneratorBody(p: Parser): ListNode | ErrorNode {
    return FunctionBody(p);
}

// YieldExpression_1

function YieldExpression_1(p: Parser): YieldStarNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
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

function YieldExpression_2(p: Parser): YieldExprNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
    p.sequence([
        keyword("yield"),
        whitespaceNoNewline,
        () => expr = AssignmentExpression(p),
    ]);
    return new YieldExprNode(new Range(start,p.pos),expr);
}

// YieldExpression_3

function YieldExpression_3(p: Parser): YieldNothingNode | ErrorNode {
    const start = p.pos;
    p.sequence([
        keyword("yield"),
    ]);
    return new YieldNothingNode(new Range(start,p.pos));
}

// YieldExpression

function YieldExpression(p: Parser): ExpressionNode | ErrorNode {
    return p.choice<ExpressionNode | ErrorNode>([
        YieldExpression_1,
        YieldExpression_2,
        YieldExpression_3,
    ]);
}

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1(p: Parser): ClassDeclarationNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode;
    let tail: ClassTailNode | ErrorNode;
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

function ClassDeclaration_2(p: Parser): ClassDeclarationNode | ErrorNode {
    const start = p.pos;
    let tail: ClassTailNode | ErrorNode;
    p.sequence([
        keyword("class"),
        whitespace,
        () => tail = ClassTail(p),
    ]);
    return new ClassDeclarationNode(new Range(start,p.pos),null,tail);
}

// ClassDeclaration

function ClassDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ClassDeclarationNode | ErrorNode {
    if (flags === undefined)
        flags = {};
    try { return ClassDeclaration_1(p); } catch (e) {}
    if (flags.Default)
        try { return ClassDeclaration_2(p); } catch (e) {} // FIXME: default only
    throw new ParseError(p,p.pos,"Expected ClassDeclaration");
}

// ClassExpression

function ClassExpression(p: Parser): ClassExpressionNode | ErrorNode {
    const start = p.pos;
    let ident: BindingIdentifierNode | ErrorNode;
    let tail: ClassTailNode | ErrorNode;
    p.sequence([
        keyword("class"),
        whitespace,
        () => ident = p.opt(() => {
            let inner: BindingIdentifierNode | ErrorNode;
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

function ClassTail(p: Parser): ClassTailNode | ErrorNode {
    const start = p.pos;
    let heritage: ExtendsNode | ErrorNode;
    let body: ListNode | ErrorNode;
    p.sequence([
        () => heritage = p.opt(() => {
            let inner: ExtendsNode | ErrorNode;
            p.sequence([
                () => inner = ClassHeritage(p),
                whitespace,
            ]);
            return inner;
        }),
        punctuator("{"),
        whitespace,
        () => body = p.choice([
            () => {
                const start2 = p.pos;
                let inner: ListNode | ErrorNode;
                p.sequence([
                    () => inner = ClassBody(p),
                    whitespace,
                ]);
                return inner;
            },
            () => {
                return new ListNode(new Range(p.pos,p.pos),[]);
            },
        ]),
        punctuator("}"),
    ]);
    return new ClassTailNode(new Range(start,p.pos),heritage,body);
}

// ClassHeritage

function ClassHeritage(p: Parser): ExtendsNode | ErrorNode {
    const start = p.pos;
    let expr: ExpressionNode | ErrorNode;
    p.sequence([
        keyword("extends"),
        whitespace,
        () => expr = LeftHandSideExpression(p),
    ]);
    return new ExtendsNode(new Range(start,p.pos),expr);
}

// ClassBody

function ClassBody(p: Parser): ListNode | ErrorNode {
    return ClassElementList(p);
}

// ClassElementList

function ClassElementList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const elements: (ClassElementType | ErrorNode)[] = [];
    elements.push(ClassElement(p));
    while (true) {
        try {
            let elem: ClassElementType | ErrorNode;
            p.sequence([
                whitespace,
                () => elem = ClassElement(p),
            ]);
            elements.push(elem);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),elements);
        }
    }
}

// ClassElement_1

function ClassElement_1(p: Parser): MethodDefinitionNode | ErrorNode {
    return MethodDefinition(p);
}

// ClassElement_2

function ClassElement_2(p: Parser): StaticMethodDefinitionNode | ErrorNode {
    const start = p.pos;
    let method: MethodDefinitionNode | ErrorNode;
    p.sequence([
        keyword("static"),
        whitespace,
        () => method = MethodDefinition(p),
    ]);
    return new StaticMethodDefinitionNode(new Range(start,p.pos),method);
}

// ClassElement_3

function ClassElement_3(p: Parser): EmptyClassElementNode | ErrorNode {
    const start = p.pos;
    p.sequence([
        punctuator(";"),
    ]);
    return new EmptyClassElementNode(new Range(start,p.pos));
}

// ClassElement

function ClassElement(p: Parser): ClassElementType | ErrorNode {
    return p.choice<ClassElementType | ErrorNode>([
        ClassElement_1,
        ClassElement_2,
        ClassElement_3,
    ]);
}

// Section 15.1

// Script

export function Script(p: Parser): ScriptNode | ErrorNode {
    const start = p.pos;
    let body: ListNode | ErrorNode = null;
    try { body = ScriptBody(p); } catch (e) {}
    if (body == null)
        body = new ListNode(new Range(start,p.pos),[]);
    return new ScriptNode(new Range(start,p.pos),body);
}

// ScriptBody

function ScriptBody(p: Parser): ListNode | ErrorNode {
    return StatementList(p);
}

// Section 15.2

// Module

export function Module(p: Parser): ModuleNode | ErrorNode {
    const start = p.pos;
    let body: ListNode | ErrorNode = null;
    try { body = ModuleBody(p); } catch (e) {}
    if (body == null)
        body = new ListNode(new Range(start,p.pos),[]);
    return new ModuleNode(new Range(start,p.pos),body);
}

// ModuleBody

function ModuleBody(p: Parser): ListNode | ErrorNode {
    return ModuleItemList(p);
}

// ModuleItemList

function ModuleItemList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const items: (ModuleItemType | ErrorNode)[] = [];
    items.push(ModuleItem(p));
    while (true) {
        try {
            let mod: ModuleItemType | ErrorNode;
            p.sequence([
                whitespace,
                () => mod = ModuleItem(p),
            ]);
            items.push(mod);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),items);
        }
    }
}

// ModuleItem

function ModuleItem(p: Parser): ModuleItemType | ErrorNode {
    return p.choice<ModuleItemType | ErrorNode>([
        ImportDeclaration,
        ExportDeclaration,
        StatementListItem,
    ]);
}

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from(p: Parser): ImportFromNode | ErrorNode {
    const start = p.pos;
    let importClause: ImportClauseNode | ErrorNode;
    let fromClause: StringLiteralNode | ErrorNode;
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

function ImportDeclaration_module(p: Parser): ImportModuleNode | ErrorNode {
    const start = p.pos;
    let specifier: StringLiteralNode | ErrorNode;
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

function ImportDeclaration(p: Parser): ImportNode | ErrorNode {
    return p.choice<ImportNode | ErrorNode>([
        ImportDeclaration_from,
        ImportDeclaration_module,
    ]);
}

// ImportClause

function ImportClause(p: Parser): ImportClauseNode | ErrorNode {
    return p.choice<ImportClauseNode | ErrorNode>([
        NameSpaceImport,
        NamedImports,
        () => {
            const start = p.pos;
            const defaultBinding = ImportedDefaultBinding(p);
            return p.choice<ImportClauseNode | ErrorNode>([
                () => {
                    let nameSpaceImport: NameSpaceImportNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator(","),
                        whitespace,
                        () => nameSpaceImport = NameSpaceImport(p),
                    ]);
                    return new DefaultAndNameSpaceImportsNode(new Range(start,p.pos),defaultBinding,nameSpaceImport);
                },
                () => {
                    let namedImports: NamedImportsNode | ErrorNode;
                    p.sequence([
                        whitespace,
                        punctuator(","),
                        whitespace,
                        () => namedImports = NamedImports(p),
                    ]);
                    return new DefaultAndNamedImportsNode(new Range(start,p.pos),defaultBinding,namedImports);
                },
                () => {
                    return new DefaultImportNode(new Range(start,p.pos),defaultBinding);
                },
            ]);
        },
    ]);
}

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): BindingIdentifierNode | ErrorNode {
    return ImportedBinding(p);
}

// NameSpaceImport

function NameSpaceImport(p: Parser): NameSpaceImportNode | ErrorNode {
    const start = p.pos;
    let binding: BindingIdentifierNode | ErrorNode;
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

function NamedImports(p: Parser): NamedImportsNode | ErrorNode {
    const start = p.pos;
    let imports: ListNode | ErrorNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => imports = p.choice([
            () => {
                let inner: ListNode | ErrorNode;
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
            },
            () => {
                return new ListNode(new Range(start,p.pos),[]);
            },
        ]),
        punctuator("}"),
    ]);
    return new NamedImportsNode(new Range(start,p.pos),imports);
}

// FromClause

function FromClause(p: Parser): StringLiteralNode | ErrorNode {
    p.sequence([
        keyword("from"),
        whitespace,
    ]);
    return ModuleSpecifier(p);
}

// ImportsList

function ImportsList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const imports: (ImportAsSpecifierNode | ImportSpecifierNode | ErrorNode)[] = [];
    imports.push(ImportSpecifier(p));
    while (true) {
        try {
            let specifier: ImportAsSpecifierNode | ImportSpecifierNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => specifier = ImportSpecifier(p),
            ]);
            imports.push(specifier);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),imports);
        }
    }
}

// ImportSpecifier

function ImportSpecifier(p: Parser): ImportAsSpecifierNode | ImportSpecifierNode | ErrorNode {
    return p.choice<ImportAsSpecifierNode | ImportSpecifierNode | ErrorNode>([
        () => {
            const start = p.pos;
            let name: IdentifierNode | ErrorNode;
            let binding: BindingIdentifierNode | ErrorNode;
            p.sequence([
                () => name = IdentifierName(p),
                whitespace,
                keyword("as"),
                whitespace,
                () => binding = ImportedBinding(p),
            ]);
            return new ImportAsSpecifierNode(new Range(start,p.pos),name,binding);
        },
        () => {
            const start = p.pos;
            let binding: BindingIdentifierNode | ErrorNode;
            p.sequence([
                () => binding = ImportedBinding(p),
            ]);
            return new ImportSpecifierNode(new Range(start,p.pos),binding);
        },
    ]);
}

// ModuleSpecifier

function ModuleSpecifier(p: Parser): StringLiteralNode | ErrorNode {
    return StringLiteral(p);
}

// ImportedBinding

function ImportedBinding(p: Parser): BindingIdentifierNode | ErrorNode {
    return BindingIdentifier(p);
}

// Section 15.2.3

// ExportDeclaration

function ExportDeclaration(p: Parser): ExportNode | ErrorNode {
    return p.attempt((start) => {
        p.sequence([
            keyword("export"),
            whitespace,
        ]);

        return p.choice<ExportNode | ErrorNode>([
            () => {
                let node: DeclarationNode | ErrorNode;
                p.sequence([
                    keyword("default"),
                    whitespace,
                    () => node = HoistableDeclaration(p,{ Default: true }),
                ]);
                return new ExportDefaultNode(new Range(node.range.start,node.range.end),node);
            },
            () => {
                let node: ClassDeclarationNode | ErrorNode;
                p.sequence([
                    keyword("default"),
                    whitespace,
                    () => node = ClassDeclaration(p,{ Default: true }),
                ]);
                return new ExportDefaultNode(new Range(node.range.start,node.range.end),node);
            },
            () => {
                let node: ExpressionNode | ErrorNode;
                p.sequence([
                    keyword("default"),
                    whitespace,
                    notKeyword("function"), // FIXME: need tests for this
                    notKeyword("class"), // FIXME: need tests for this
                    () => node = AssignmentExpression(p),
                ]);
                return new ExportDefaultNode(new Range(node.range.start,node.range.end),node);
            },
            () => {
                let res: ExportNode | ErrorNode;
                p.sequence([
                    punctuator("*"),
                    () => {
                        let from: StringLiteralNode | ErrorNode;
                        p.sequence([
                            whitespace,
                            () => from = FromClause(p),
                            whitespace,
                            punctuator(";"),
                        ]);
                        res = new ExportStarNode(new Range(start,p.pos),from);
                    },
                ]);
                return res;
            },
            () => {
                let exportClause: ExportClauseNode | ErrorNode;
                let fromClause: StringLiteralNode | ErrorNode;
                p.sequence([
                    () => exportClause = ExportClause(p),
                    whitespace,
                    () => fromClause = FromClause(p),
                    whitespace,
                    punctuator(";"),
                ]);
                return new ExportFromNode(new Range(start,p.pos),exportClause,fromClause);
            },
            () => {
                let exportClause: ExportClauseNode | ErrorNode;
                p.sequence([
                    () => exportClause = ExportClause(p),
                    whitespace,
                    punctuator(";"),
                ]);
                return exportClause;
            },
            () => {
                let node: VarNode | ErrorNode;
                p.sequence([
                    () => node = VariableStatement(p),
                ]);
                return new ExportVariableNode(new Range(node.range.start,node.range.end),node);
            },
            () => {
                let node: DeclarationNode | ErrorNode;
                p.sequence([
                    () => node = Declaration(p),
                ]);
                return new ExportDeclarationNode(new Range(node.range.start,node.range.end),node);
            },
        ]);
    });
}

// ExportClause

function ExportClause(p: Parser): ExportClauseNode | ErrorNode {
    const start = p.pos;
    let exports: ListNode | ErrorNode;
    p.sequence([
        punctuator("{"),
        whitespace,
        () => exports = p.choice([
            () => {
                let inner: ListNode | ErrorNode;
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
            },
            () => new ListNode(new Range(start,p.pos),[]),
        ]),
        punctuator("}"),
    ]);
    return new ExportClauseNode(new Range(start,p.pos),exports);
}

// ExportsList

function ExportsList(p: Parser): ListNode | ErrorNode {
    const start = p.pos;
    const exports: (ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode)[] = [];
    exports.push(ExportSpecifier(p));
    while (true) {
        try {
            let specifier: ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode;
            p.sequence([
                whitespace,
                punctuator(","),
                whitespace,
                () => specifier = ExportSpecifier(p),
            ]);
            exports.push(specifier);
        }
        catch (e) {
            return new ListNode(new Range(start,p.pos),exports);
        }
    }
}

// ExportSpecifier

function ExportSpecifier(p: Parser): ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode {
    const start = p.pos;
    let ident: IdentifierNode | ErrorNode;
    let result: ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode;
    p.sequence([
        () => ident = IdentifierName(p),
        () => result = p.choice<ExportAsSpecifierNode | ExportNormalSpecifierNode | ErrorNode>([
            () => {
                let asIdent: IdentifierNode | ErrorNode;
                p.sequence([
                    whitespace,
                    keyword("as"),
                    whitespace,
                    () => asIdent = IdentifierName(p),
                ]);
                return new ExportAsSpecifierNode(new Range(start,p.pos),ident,asIdent);
            },
            () => {
                return new ExportNormalSpecifierNode(new Range(start,p.pos),ident);
            },
        ]),
    ]);
    return result;
}
