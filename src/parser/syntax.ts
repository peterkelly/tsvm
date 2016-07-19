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
    ParseFailure,
    ParseError,
    ParseIgnore,
} from "./parser";
import {
    LiteralPropertyNameType,
    PropertyNameType,
    PropertyDefinitionType,
    StatementListItemType,
    SingleNameBindingType,
    BindingPatternNode,
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

    // ImportClauseNode,
    // ExportNode,
    // ImportNode,
    // MethodDefinitionNode,
    // DeclarationNode,
    // LexicalBindingNode,

    CastError,
    Range,
    ASTNode,
    // StatementNode,
    // BreakableStatementNode,
    ExpressionNode,
    IdentifierReferenceNode,
    BindingIdentifierNode,
    LabelIdentifierNode,
    IdentifierNode,
    // ThisNode,
    // NullLiteralNode,
    BooleanLiteralNode,
    NumericLiteralNode,
    StringLiteralNode,
    // ArrayLiteralNode,
    ElisionNode,
    // SpreadElementNode,
    // ObjectLiteralNode,
    // ColonPropertyDefinitionNode,
    // ComputedPropertyNameNode,
    // CoverInitializedNameNode,
    // MemberAccessExprNode,
    // MemberAccessIdentNode,
    // SuperPropertyExprNode,
    // SuperPropertyIdentNode,
    // NewTargetNode,
    // NewExpressionNode,
    // CallNode,
    // SuperCallNode,
    // ArgumentsNode,
    // PostIncrementNode,
    // PostDecrementNode,
    // DeleteNode,
    // VoidNode,
    // TypeOfNode,
    // PreIncrementNode,
    // PreDecrementNode,
    // UnaryPlusNode,
    // UnaryMinusNode,
    // UnaryBitwiseNotNode,
    // UnaryLogicalNotNode,
    // MultiplyNode,
    // DivideNode,
    // ModuloNode,
    // AddNode,
    // SubtractNode,
    // LeftShiftNode,
    // SignedRightShiftNode,
    // UnsignedRightShiftNode,
    // LessThanNode,
    // GreaterThanNode,
    // LessEqualNode,
    // GreaterEqualNode,
    // InstanceOfNode,
    // InNode,
    // AbstractEqualsNode,
    // AbstractNotEqualsNode,
    // StrictEqualsNode,
    // StrictNotEqualsNode,
    // BitwiseANDNode,
    // BitwiseXORNode,
    // BitwiseORNode,
    // LogicalANDNode,
    // LogicalORNode,
    // ConditionalNode,
    // AssignNode,
    // AssignMultiplyNode,
    // AssignDivideNode,
    // AssignModuloNode,
    // AssignAddNode,
    // AssignSubtractNode,
    // AssignLeftShiftNode,
    // AssignSignedRightShiftNode,
    // AssignUnsignedRightShiftNode,
    // AssignBitwiseANDNode,
    // AssignBitwiseXORNode,
    // AssignBitwiseORNode,
    // CommaNode,
    // BlockNode,
    // LetNode,
    // ConstNode,
    // LexicalIdentifierBindingNode,
    // LexicalPatternBindingNode,
    // VarNode,
    // VarIdentifierNode,
    // VarPatternNode,
    // ObjectBindingPatternNode,
    // ArrayBindingPatternNode,
    // BindingPropertyNode,
    // BindingPatternInitNode,
    // SingleNameBindingNode,
    // BindingRestElementNode,
    // EmptyStatementNode,
    // ExpressionStatementNode,
    // IfStatementNode,
    // DoStatementNode,
    // WhileStatementNode,
    // ForCNode,
    // ForInNode,
    // ForOfNode,
    // VarForDeclarationNode,
    // LetForDeclarationNode,
    // ConstForDeclarationNode,
    // ContinueStatementNode,
    // BreakStatementNode,
    // ReturnStatementNode,
    // WithStatementNode,
    // SwitchStatementNode,
    // CaseBlockNode,
    // CaseBlock1Node,
    // CaseBlock2Node,
    // CaseClauseNode,
    // DefaultClauseNode,
    // LabelledStatementNode,
    // ThrowStatementNode,
    // TryStatementNode,
    // CatchNode,
    // FinallyNode,
    // DebuggerStatementNode,
    // FunctionDeclarationNode,
    // FunctionExpressionNode,
    // FormalParametersNode,
    // FormalParameters1Node,
    // FormalParameters2Node,
    // FormalParameters3Node,
    // FormalParameters4Node,
    // ArrowFunctionNode,
    // MethodNode,
    // GetterNode,
    // SetterNode,
    // GeneratorMethodNode,
    // GeneratorDeclarationNode,
    // DefaultGeneratorDeclarationNode,
    // GeneratorExpressionNode,
    // YieldExprNode,
    // YieldStarNode,
    // YieldNothingNode,
    // ClassDeclarationNode,
    // ClassExpressionNode,
    // ClassTailNode,
    // ExtendsNode,
    // StaticMethodDefinitionNode,
    // EmptyClassElementNode,
    ScriptNode,
    ModuleNode,
    // ImportFromNode,
    // ImportModuleNode,
    // DefaultAndNameSpaceImportsNode,
    // DefaultAndNamedImportsNode,
    // DefaultImportNode,
    // NameSpaceImportNode,
    // NamedImportsNode,
    // ImportSpecifierNode,
    // ImportAsSpecifierNode,
    // ExportDefaultNode,
    // ExportStarNode,
    // ExportPlainNode,
    // ExportVariableNode,
    // ExportDeclarationNode,
    // ExportFromNode,
    // ExportClauseNode,
    // ExportNormalSpecifierNode,
    // ExportAsSpecifierNode,
    ListNode,
    ErrorNode,
    GenericNode,
} from "./ast";
import {
    Builder,
    opt,
    pos,
    value,
    keyword,
    punctuator,
    notKeyword,
    notPunctuator,
    identifier,
    whitespace,
    whitespaceNoNewline,
    bfun,
    pfun,
    checkNode,
    checkListNode,
    checkNumber,
    makeNode,
    makeEmptyListNode,
} from "./grammar";

// Section 12.1

// IdentifierReference

function IdentifierReference(p: Parser): ASTNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new IdentifierReferenceNode(ident.range,ident.value);
}

const IdentifierReference_b = bfun(IdentifierReference);

// BindingIdentifier

function BindingIdentifier(p: Parser): BindingIdentifierNode | ErrorNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new BindingIdentifierNode(ident.range,ident.value);
}

const BindingIdentifier_b = bfun(BindingIdentifier);

// LabelIdentifier

function LabelIdentifier(p: Parser): ASTNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new LabelIdentifierNode(ident.range,ident.value);
}

const LabelIdentifier_b = bfun(LabelIdentifier);

// IdentifierName

function IdentifierName(p: Parser): ASTNode {
    return Identifier(p);
}

const IdentifierName_b = bfun(IdentifierName);

// Identifier

export function Identifier(p: Parser): IdentifierNode | ErrorNode {
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

const Identifier_b = bfun(Identifier);

// Section 12.2

// This

function This(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        const oldLength = b.length;
        b.pitems([
            pos,
            keyword("this"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"This",[]));
        b.assertLengthIs(oldLength+1);
        return checkNode(b.get(0));
    });
}

const This_b = bfun(This);

// PrimaryExpression

function PrimaryExpression(p: Parser): ASTNode {
    const b = new Builder(p);
    const oldLength = b.length;
    b.bchoice([
        This_b,
        // Literal must come before IdentifierReference, since "true", "false", and "null" are not keywords
        Literal_b,
        IdentifierReference_b,
        ArrayLiteral_b,
        ObjectLiteral_b,
        FunctionExpression_b,
        ClassExpression_b,
        GeneratorExpression_b,
        // RegularExpressionLiteral_b, // TODO
        // TemplateLiteral_b, // TODO
        ParenthesizedExpression_b,
    ]);
    b.assertLengthIs(oldLength+1);
    return checkNode(b.get(0));
}

const PrimaryExpression_b = bfun(PrimaryExpression);

// ParenthesizedExpression

function ParenthesizedExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        const oldLength = b.length;
        b.pitems([
            punctuator("("), // 4
            whitespace,      // 3
            Expression,      // 2 = expr
            whitespace,      // 1
            punctuator(")"), // 0
        ]);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        return checkNode(b.get(0));
    });
}

const ParenthesizedExpression_b = bfun(ParenthesizedExpression);

// Section 12.2.4

// Literal

function Literal(p: Parser): ASTNode {
    const b = new Builder(p);
    const oldLength = b.length;
    b.bchoice([
        NullLiteral_b,
        BooleanLiteral_b,
        NumericLiteral_b,
        StringLiteral_b,
    ]);
    b.assertLengthIs(oldLength+1);
    return checkNode(b.get(0));
}

const Literal_b = bfun(Literal);

// NullLiteral

function NullLiteral(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        const oldLength = b.length;
        b.pitems([
            pos,
            keyword("null"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"NullLiteral",[]));
        b.assertLengthIs(oldLength+1);
        return checkNode(b.get(0));
    });
}

const NullLiteral_b = bfun(NullLiteral);

// BooleanLiteral

function BooleanLiteral(p: Parser): ASTNode {
    const start = p.pos;
    if (p.matchKeyword("true"))
        return new BooleanLiteralNode(new Range(start,p.pos),true);
    if (p.matchKeyword("false"))
        return new BooleanLiteralNode(new Range(start,p.pos),false);
    throw new ParseError(p,p.pos,"Expected BooleanLiteral");
}

const BooleanLiteral_b = bfun(BooleanLiteral);

// NumericLiteral

function NumericLiteral(p: Parser): ASTNode {
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

const NumericLiteral_b = bfun(NumericLiteral);

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

const StringLiteral_b = bfun(StringLiteral);

// Section 12.2.5

// ArrayLiteral

function ArrayLiteral_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        const start = b.parser.pos;
        b.pitem(pos);
        b.pitem(punctuator("["));
        b.pitem(whitespace);

        const elements: ASTNode[] = [];
        const listStart = b.parser.pos;
        let listEnd = b.parser.pos;

        b.assertLengthIs(oldLength+3);

        b.bopt(() => {
            b.pitem(pos);             // 3 = before
            b.pitem(punctuator(",")); // 2
            b.pitem(pos);             // 1 = after
            b.pitem(whitespace);      // 0
            b.assertLengthIs(oldLength+7);
            b.popAboveAndSet(3,makeNode(b,3,1,"Elision",[]));
        });
        b.assertLengthIs(oldLength+4);

        const initialElision = checkNode(b.get(0));
        if (initialElision != null) {
            elements.push(initialElision);
            listEnd = initialElision.range.end;
        }

        while (true) {
            b.assertLengthIs(oldLength+4);
            if (b.parser.lookaheadPunctuator("]")) {
                b.parser.expectPunctuator("]");
                break;
            }

            try {
                b.bchoice([
                    () => {
                        b.pitems([
                            pos,             // 3 = before
                            punctuator(","), // 2
                            pos,             // 1 = after
                            whitespace,      // 0
                        ]);
                        b.assertLengthIs(oldLength+8);
                        b.popAboveAndSet(3,makeNode(b,3,1,"Elision",[]));
                        b.assertLengthIs(oldLength+5);
                    },
                    () => {
                        b.pitem(AssignmentExpression);
                        b.pitem(whitespace);
                        b.bopt(() => {
                            b.pitem(punctuator(","));
                            b.pitem(whitespace);
                            b.pop();
                        });
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(2,checkNode(b.get(2)));
                        b.assertLengthIs(oldLength+5);
                    },
                    () => {
                        b.pitem(SpreadElement);
                        b.pitem(whitespace);
                        b.bopt(() => {
                            b.pitem(punctuator(","));
                            b.pitem(whitespace);
                            b.pop();
                        });
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(2,checkNode(b.get(2)));
                        b.assertLengthIs(oldLength+5);
                    },
                ]);
                b.assertLengthIs(oldLength+5);
                const item = checkNode(b.get(0));
                b.pop();

                elements.push(item);
                listEnd = item.range.end;
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                break;
            }
        }

        b.assertLengthIs(oldLength+4);
        const list = new ListNode(new Range(listStart,listEnd),elements);
        b.popAboveAndSet(3,new GenericNode(new Range(start,b.parser.pos),"ArrayLiteral",[list]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ArrayLiteral = pfun(ArrayLiteral_b);

// SpreadElement

function SpreadElement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,
            punctuator("..."),
            whitespace,
            AssignmentExpression,
            pos,
        ]);
        b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const SpreadElement = pfun(SpreadElement_b);

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);             // 5
        b.pitem(punctuator("{")); // 4
        b.pitem(whitespace);      // 3
        b.bchoice([               // 2 = properties
            () => {
                b.pitem(PropertyDefinitionList);
                b.pitem(whitespace);
                b.bopt(() => {
                    b.pitem(punctuator(","));
                    b.pitem(whitespace);
                    b.popAboveAndSet(1,0);
                });
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
            },
        ]);
        b.pitem(punctuator("}")); // 1
        b.pitem(pos);             // 0 = end
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ObjectLiteral",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ObjectLiteral = pfun(ObjectLiteral_b);

// PropertyDefinitionList

function PropertyDefinitionList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(PropertyDefinition);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    PropertyDefinition,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const PropertyDefinitionList = pfun(PropertyDefinitionList_b);

// PropertyDefinition_colon

function PropertyDefinition_colon_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                  // 6 = start
            PropertyName,         // 5 = name
            whitespace,           // 4
            punctuator(":"),      // 3
            whitespace,           // 2
            AssignmentExpression, // 1 = init
            pos,                  // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ColonPropertyDefinition",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const PropertyDefinition_colon = pfun(PropertyDefinition_colon_b);

// PropertyDefinition

function PropertyDefinition_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        PropertyDefinition_colon_b,
        CoverInitializedName_b,
        MethodDefinition_b,
        IdentifierReference_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const PropertyDefinition = pfun(PropertyDefinition_b);

// PropertyName

function PropertyName_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        LiteralPropertyName_b,
        ComputedPropertyName_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const PropertyName = pfun(PropertyName_b);

// LiteralPropertyName

function LiteralPropertyName_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        IdentifierName_b,
        StringLiteral_b,
        NumericLiteral_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const LiteralPropertyName = pfun(LiteralPropertyName_b);

// ComputedPropertyName

function ComputedPropertyName_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                  // 6 = start
            punctuator("["),      // 5
            whitespace,           // 4
            AssignmentExpression, // 3 = expr
            whitespace,           // 2
            punctuator("]"),      // 1
            pos,                  // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ComputedPropertyName",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ComputedPropertyName = pfun(ComputedPropertyName_b);

// CoverInitializedName

function CoverInitializedName_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 4 = start
            IdentifierReference, // 3 = ident
            whitespace,          // 2
            Initializer,         // 1 = init
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"CoverInitializedName",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CoverInitializedName = pfun(CoverInitializedName_b);

// Initializer

function Initializer_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            punctuator("="),
            whitespace,
            AssignmentExpression,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const Initializer = pfun(Initializer_b);

// Section 12.2.9

// TemplateLiteral

function TemplateLiteral(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// TemplateSpans

function TemplateSpans(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// TemplateMiddleList

function TemplateMiddleList(p: Parser): ASTNode { throw new ParseError(p,p.pos,"Not implemented"); } // FIXME

// Section 12.3

// MemberExpression_new

function MemberExpression_new_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,              // 6 = start
            keyword("new"),   // 5
            whitespace,       // 4
            MemberExpression, // 3 = expr
            whitespace,       // 2
            Arguments,        // 1 = args
            pos,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NewExpression",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const MemberExpression_new = pfun(MemberExpression_new_b);

// MemberExpression_start

function MemberExpression_start_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        PrimaryExpression_b,
        SuperProperty_b,
        MetaProperty_b,
        MemberExpression_new_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const MemberExpression_start = pfun(MemberExpression_start_b);

// MemberExpression

function MemberExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);
        b.pitem(MemberExpression_start);
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,      // 6
                    punctuator("["), // 5
                    whitespace,      // 4
                    Expression,      // 3 = expr
                    whitespace,      // 2
                    punctuator("]"), // 1
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(7,makeNode(b,8,0,"MemberAccessExpr",[7,3]));
            },
            () => {
                b.pitems([
                    whitespace,      // 5
                    punctuator("."), // 4
                    whitespace,      // 3
                    IdentifierName,  // 2 = ident
                    pos,             // 1 = end
                    whitespace,      // 0
                ]);
                b.assertLengthIs(oldLength+8);
                b.popAboveAndSet(6,makeNode(b,7,1,"MemberAccessIdent",[6,2]));
            },
        ]);
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const MemberExpression = pfun(MemberExpression_b);

// SuperProperty

function SuperProperty_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,              // 8 = start
                    keyword("super"), // 7
                    whitespace,       // 6
                    punctuator("["),  // 5
                    whitespace,       // 4
                    Expression,       // 3 = expr
                    whitespace,       // 2
                    punctuator("]"),  // 1
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"SuperPropertyExpr",[3]));
                b.assertLengthIs(oldLength+1);
            },
            () => {
                b.pitems([
                    pos,              // 6 = start
                    keyword("super"), // 5
                    whitespace,       // 4
                    punctuator("."),  // 3
                    whitespace,       // 2
                    Identifier,       // 1 = ident
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"SuperPropertyIdent",[1]));
                b.assertLengthIs(oldLength+1);
            }
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const SuperProperty = pfun(SuperProperty_b);

// MetaProperty

function MetaProperty(p: Parser): ASTNode {
    return NewTarget(p);
}

const MetaProperty_b = bfun(MetaProperty);

// NewTarget

function NewTarget_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                  // 6
            keyword("new"),       // 5
            whitespace,           // 4
            punctuator("."),      // 3
            whitespace,           // 2
            identifier("target"), // 1 ("target" is not a reserved word, so we can't use keyword here)
            pos,                  // 0
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NewTarget",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const NewTarget = pfun(NewTarget_b);

// NewExpression

function NewExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitem(MemberExpression);
            },
            () => {
                b.pitems([
                    pos,            // 4 = start
                    keyword("new"), // 3
                    whitespace,     // 2
                    NewExpression,  // 1 = expr
                    pos,            // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                const start = checkNumber(b.get(4));
                const end = checkNumber(b.get(0));
                const expr = checkNode(b.get(1));
                b.popAboveAndSet(4,new GenericNode(new Range(start,b.parser.pos),"NewExpression",[expr,null]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const NewExpression = pfun(NewExpression_b);

// CallExpression_start

function CallExpression_start_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitem(SuperCall);
            },
            () => {
                b.pitems([
                    pos,              // 4 = start
                    MemberExpression, // 3 = fun
                    whitespace,       // 2
                    Arguments,        // 1 = args
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Call",[3,1]));
            },
        ])
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CallExpression_start = pfun(CallExpression_start_b);

// CallExpression

function CallExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);
        b.pitem(CallExpression_start);
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,      // 2
                    Arguments,       // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(3,makeNode(b,4,0,"Call",[3,1]));
            },
            () => {
                b.pitems([
                    whitespace,      // 6
                    punctuator("["), // 5
                    whitespace,      // 4
                    Expression,      // 3 = expr
                    whitespace,      // 2
                    punctuator("]"), // 1
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(7,makeNode(b,8,0,"MemberAccessExpr",[7,3]));
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    punctuator("."), // 3
                    whitespace,      // 2
                    IdentifierName,  // 1 = idname
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"MemberAccessIdent",[5,1]));
            },
            // () => {
            //     // TODO
            //     left = TemplateLiteral(p);
            // },
        ]);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CallExpression = pfun(CallExpression_b);

// SuperCall

function SuperCall_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,              // 4 = start
            keyword("super"), // 3
            whitespace,       // 2
            Arguments,        // 1 = args
            pos,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"SuperCall",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const SuperCall = pfun(SuperCall_b);

// Arguments

function Arguments_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,             // 5 = start
                    punctuator("("), // 4
                    whitespace,      // 3
                    pos,             // 2 = listpos
                    punctuator(")"), // 1
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                const start = checkNumber(b.get(5));
                const end = checkNumber(b.get(0));
                const listpos = checkNumber(b.get(2));
                const args = new ListNode(new Range(listpos,listpos),[]);
                b.popAboveAndSet(5,new GenericNode(new Range(start,b.parser.pos),"Arguments",[args]));
            },
            () => {
                b.pitems([
                    pos,             // 6 = start
                    punctuator("("), // 5
                    whitespace,      // 4
                    ArgumentList,    // 3 = args
                    whitespace,      // 2
                    punctuator(")"), // 1
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"Arguments",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const Arguments = pfun(Arguments_b);

// ArgumentList_item

function ArgumentList_item_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,                  // 4 = start
                    punctuator("..."),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = expr
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
            },
            () => {
                b.pitem(AssignmentExpression);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ArgumentList_item = pfun(ArgumentList_item_b);

// ArgumentList

function ArgumentList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(ArgumentList_item);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    ArgumentList_item,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ArgumentList = pfun(ArgumentList_b);

// LeftHandSideExpression

function LeftHandSideExpression_b(b: Builder): void {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    const oldLength = b.length;
    b.bchoice([
        CallExpression_b,
        NewExpression_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const LeftHandSideExpression = pfun(LeftHandSideExpression_b);

// Section 12.4

// PostfixExpression

function PostfixExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);
        b.pitem(LeftHandSideExpression);
        b.bchoice([
            () => {
                b.pitems([
                    whitespaceNoNewline,
                    punctuator("++"),
                    pos,
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PostIncrement",[3]));
            },
            () => {
                b.pitems([
                    whitespaceNoNewline,
                    punctuator("--"),
                    pos,
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PostDecrement",[3]));
            },
            () => {
                b.popAboveAndSet(1,b.get(0));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const PostfixExpression = pfun(PostfixExpression_b);

// Section 12.5

// UnaryExpression

function UnaryExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,               // 4 = start
                    keyword("delete"), // 3
                    whitespace,        // 2
                    UnaryExpression,   // 1 = expr
                    pos,               // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Delete",[1]));
            },
            () => {
                b.pitems([
                    pos,             // 4 = start
                    keyword("void"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Void",[1]));
            },
            () => {
                b.pitems([
                    pos,               // 4 = start
                    keyword("typeof"), // 3
                    whitespace,        // 2
                    UnaryExpression,   // 1 = expr
                    pos,               // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"TypeOf",[1]));
            },
            () => {
                b.pitems([
                    pos,              // 4 = start
                    punctuator("++"), // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = expr
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PreIncrement",[1]));
            },
            () => {
                b.pitems([
                    pos,              // 4 = start
                    punctuator("--"), // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = expr
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PreDecrement",[1]));
            },
            () => {
                b.pitems([
                    pos,             // 4 = start
                    punctuator("+"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryPlus",[1]));
            },
            () => {
                b.pitems([
                    pos,             // 4 = start
                    punctuator("-"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryMinus",[1]));
            },
            () => {
                b.pitems([
                    pos,             // 4 = start
                    punctuator("~"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryBitwiseNot",[1]));
            },
            () => {
                b.pitems([
                    pos,             // 4 = start
                    punctuator("!"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryLogicalNot",[1]));
            },
            () => {
                b.pitem(PostfixExpression);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const UnaryExpression = pfun(UnaryExpression_b);

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                  // 6 = start
        b.pitem(UnaryExpression);      // 5 = left
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,       // 4
                    punctuator("*"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Multiply",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,       // 4
                    punctuator("/"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Divide",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,       // 4
                    punctuator("%"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Modulo",[5,1]));
            },
        ]);

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const MultiplicativeExpression = pfun(MultiplicativeExpression_b);

// Section 12.7

// AdditiveExpression

function AdditiveExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                          // 6 = start
        b.pitem(MultiplicativeExpression);     // 5 = left
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,               // 4
                    punctuator("+"),          // 3
                    whitespace,               // 2
                    MultiplicativeExpression, // 1 = right
                    pos,                      // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Add",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,               // 4
                    punctuator("-"),          // 3
                    whitespace,               // 2
                    MultiplicativeExpression, // 1 = right
                    pos,                      // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Subtract",[5,1]));
            }]);

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const AdditiveExpression = pfun(AdditiveExpression_b);

// Section 12.8

// ShiftExpression

function ShiftExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                    // 6 = start
        b.pitem(AdditiveExpression);     // 5 = left
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,         // 4
                    punctuator("<<"),   // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"LeftShift",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,         // 4
                    punctuator(">>>"),  // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"UnsignedRightShift",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,         // 4
                    punctuator(">>"),   // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"SignedRightShift",[5,1]));
            },
        ]);

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ShiftExpression = pfun(ShiftExpression_b);

// Section 12.9

// RelationalExpression

function RelationalExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);             // 6 = start
        b.pitem(ShiftExpression); // 5 = left
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,       // 4
                    punctuator("<="), // 3
                    whitespace,       // 2
                    ShiftExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessEqual",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,       // 4
                    punctuator(">="), // 3
                    whitespace,       // 2
                    ShiftExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"GreaterEqual",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    punctuator("<"), // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessThan",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    punctuator(">"), // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"GreaterThan",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,            // 4
                    keyword("instanceof"), // 3
                    whitespace,            // 2
                    ShiftExpression,       // 1 = right
                    pos,                   // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"InstanceOf",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    keyword("in"),   // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"In",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
        ]);
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const RelationalExpression = pfun(RelationalExpression_b);

// Section 12.10

// EqualityExpression

function EqualityExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                      // 6 = start
        b.pitem(RelationalExpression);     // 5 = left
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("==="),    // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("!=="),    // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictNotEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("=="),     // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"AbstractEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("!="),     // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"AbstractNotEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
        ]);
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const EqualityExpression = pfun(EqualityExpression_b);

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                // 6 = start
        b.pitem(EqualityExpression); // 5 = left
        b.brepeat(() => {
            b.pitems([
                whitespace,         // 4
                punctuator("&"),    // 3
                whitespace,         // 2
                EqualityExpression, // 1 = right
                pos,                // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"BitwiseAND",[5,1]));
        });

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BitwiseANDExpression = pfun(BitwiseANDExpression_b);

// BitwiseXORExpression

function BitwiseXORExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                  // 6 = start
        b.pitem(BitwiseANDExpression); // 5 = left
        b.brepeat(() => {
            b.pitems([
                whitespace,           // 4
                punctuator("^"),      // 3
                whitespace,           // 2
                BitwiseANDExpression, // 1 = right
                pos,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"BitwiseXOR",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BitwiseXORExpression = pfun(BitwiseXORExpression_b);

// BitwiseORExpression

function BitwiseORExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                  // 6 = start
        b.pitem(BitwiseXORExpression); // 5 = left
        b.brepeat(() => {
            b.pitems([
                whitespace,           // 4
                punctuator("|"),      // 3
                whitespace,           // 2
                BitwiseXORExpression, // 1 = right
                pos,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"BitwiseOR",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BitwiseORExpression = pfun(BitwiseORExpression_b);

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                 // 6 = start
        b.pitem(BitwiseORExpression); // 5 = left
        b.brepeat(() => {
            b.pitems([
                whitespace,          // 4
                punctuator("&&"),    // 3
                whitespace,          // 2
                BitwiseORExpression, // 1 = right
                pos,                 // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"LogicalAND",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const LogicalANDExpression = pfun(LogicalANDExpression_b);

// LogicalORExpression

function LogicalORExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                  // 6 = start
        b.pitem(LogicalANDExpression); // 5 = left
        b.brepeat(() => {
            b.pitems([
                whitespace,           // 4
                punctuator("||"),     // 3
                whitespace,           // 2
                LogicalANDExpression, // 1 = right
                pos,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"LogicalOR",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const LogicalORExpression = pfun(LogicalORExpression_b);

// Section 12.13

// ConditionalExpression

function ConditionalExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                      // 10 = start
        b.pitem(LogicalORExpression);      // 9 = condition
        b.bchoice([
            () => {
                b.pitems([
                    whitespace,           // 8
                    punctuator("?"),      // 7
                    whitespace,           // 6
                    AssignmentExpression, // 5 = trueExpr
                    whitespace,           // 4
                    punctuator(":"),      // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = falseExpr
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(9,makeNode(b,10,0,"Conditional",[9,5,1]));
            },
            () => {},
        ]);
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ConditionalExpression = pfun(ConditionalExpression_b);

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                      // 6 = start
        b.pitem(LeftHandSideExpression);   // 5 = left
        b.bchoice([
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("="),      // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Assign",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("*="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignMultiply",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("/="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignDivide",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("%="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignModulo",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("+="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignAdd",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("-="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignSubtract",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("<<="),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignLeftShift",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator(">>="),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignSignedRightShift",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator(">>>="),   // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignUnsignedRightShift",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("&="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseAND",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("^="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseXOR",[5,1]));
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("|="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseOR",[5,1]));
            },
        ])
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const AssignmentExpression_plain = pfun(AssignmentExpression_plain_b);

// AssignmentExpression

function AssignmentExpression_b(b: Builder): void {
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    const oldLength = b.length;
    b.bchoice([
        ArrowFunction_b,
        AssignmentExpression_plain_b,
        ConditionalExpression_b,
        YieldExpression_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const AssignmentExpression = pfun(AssignmentExpression_b);

// Section 12.15

// Expression

function Expression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                  // 6 = start
        b.pitem(AssignmentExpression); // 5 = left
        b.brepeat(() => {
            b.pitems([
                whitespace,           // 4
                punctuator(","),      // 3
                whitespace,           // 2
                AssignmentExpression, // 1 = right
                pos,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"Comma",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const Expression = pfun(Expression_b);

// Section 13

// Statement

function Statement_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        BlockStatement_b,
        VariableStatement_b,
        EmptyStatement_b,
        ExpressionStatement_b,
        IfStatement_b,
        BreakableStatement_b,
        ContinueStatement_b,
        BreakStatement_b,
        ReturnStatement_b,
        WithStatement_b,
        LabelledStatement_b,
        ThrowStatement_b,
        TryStatement_b,
        DebuggerStatement_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const Statement = pfun(Statement_b);

// Declaration

function Declaration_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        HoistableDeclaration_b,
        ClassDeclaration_b,
        LexicalDeclaration_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const Declaration = pfun(Declaration_b);

// HoistableDeclaration

function HoistableDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    const b = new Builder(p);
    const oldLength = b.length;
    b.bchoice([
        bfun(() => FunctionDeclaration(p,flags)),
        bfun(() => GeneratorDeclaration(p,flags)),
    ]);
    b.assertLengthIs(oldLength+1);
    return checkNode(b.get(0));
}

const HoistableDeclaration_b = bfun(HoistableDeclaration);

// BreakableStatement

function BreakableStatement_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        IterationStatement_b,
        SwitchStatement_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const BreakableStatement = pfun(BreakableStatement_b);

// Section 13.2

// BlockStatement

function BlockStatement(p: Parser): ASTNode {
    return Block(p);
}

const BlockStatement_b = bfun(BlockStatement);

// Block

function Block_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);             // 5
        b.pitem(punctuator("{")); // 4
        b.pitem(whitespace);      // 3
        b.bchoice([               // 2 = statements
            () => {
                b.pitem(StatementList);
                b.pitem(whitespace);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                b.pitem(pos);
                const position = checkNumber(b.get(0));
                b.popAboveAndSet(0,new ListNode(new Range(position,position),[]));
            },
        ]);
        b.pitem(punctuator("}")); // 1
        b.pitem(pos);             // 0
        b.popAboveAndSet(5,makeNode(b,5,0,"Block",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const Block = pfun(Block_b);

// StatementList

function StatementList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(StatementListItem);
            },
            () => {
                b.pitems([
                    whitespace,
                    StatementListItem,
                ]);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const StatementList = pfun(StatementList_b);

// StatementListItem

function StatementListItem_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        Statement_b,
        Declaration_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const StatementListItem = pfun(StatementListItem_b);

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,              // 6 = start
                    keyword("let"),   // 5
                    whitespace,       // 4
                    BindingList,      // 3 = bindings
                    whitespace,       // 2
                    punctuator(";"),  // 1
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"Let",[3]));
            },
            () => {
                b.pitems([
                    pos,              // 6 = start
                    keyword("const"), // 5
                    whitespace,       // 4
                    BindingList,      // 3 = bindings
                    whitespace,       // 2
                    punctuator(";"),  // 1
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"Const",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const LexicalDeclaration = pfun(LexicalDeclaration_b);

// BindingList

function BindingList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(LexicalBinding);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    LexicalBinding,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BindingList = pfun(BindingList_b);

// LexicalBinding_identifier

function LexicalBinding_identifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);               // 3 = start
        b.pitem(BindingIdentifier); // 2 = identifier
        b.bopt(() => {              // 1 = initializer
            b.pitem(whitespace);
            b.pitem(Initializer);
            b.popAboveAndSet(1,b.get(0));
        });
        b.pitem(pos);               // 0 = end
        b.assertLengthIs(oldLength+4);
        b.popAboveAndSet(3,makeNode(b,3,0,"LexicalIdentifierBinding",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const LexicalBinding_identifier = pfun(LexicalBinding_identifier_b);

// LexicalBinding_pattern

function LexicalBinding_pattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,            // 4 = start
            BindingPattern, // 3 = pattern
            whitespace,     // 2
            Initializer,    // 1 = initializer
            pos,            // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"LexicalPatternBinding",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const LexicalBinding_pattern = pfun(LexicalBinding_pattern_b);

// LexicalBinding

function LexicalBinding_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        LexicalBinding_identifier_b,
        LexicalBinding_pattern_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const LexicalBinding = pfun(LexicalBinding_b);

// Section 13.3.2

// VariableStatement

function VariableStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                     // 6 = start
            keyword("var"),          // 5
            whitespace,              // 4
            VariableDeclarationList, // 3 = declarations
            whitespace,              // 2
            punctuator(";"),         // 1
            pos,                     // 0 = end
        ]);
        b.popAboveAndSet(6,makeNode(b,6,0,"Var",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const VariableStatement = pfun(VariableStatement_b);

// VariableDeclarationList

function VariableDeclarationList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(VariableDeclaration);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    VariableDeclaration,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const VariableDeclarationList = pfun(VariableDeclarationList_b);

// VariableDeclaration_identifier

function VariableDeclaration_identifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);
        b.pitem(BindingIdentifier);
        b.bchoice([
            () => {
                b.pitems([
                    whitespace,
                    Initializer,
                    pos,
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarIdentifier",[3,1]));
            },
            () => {
                b.pitem(value(null));
                b.pitem(pos);
                b.assertLengthIs(oldLength+4);
                b.popAboveAndSet(3,makeNode(b,3,0,"VarIdentifier",[2,1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const VariableDeclaration_identifier = pfun(VariableDeclaration_identifier_b);

// VariableDeclaration_pattern

function VariableDeclaration_pattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,            // 4 = start
            BindingPattern, // 3 = pattern
            whitespace,     // 2
            Initializer,    // 1 = initializer
            pos,            // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"VarPattern",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const VariableDeclaration_pattern = pfun(VariableDeclaration_pattern_b);

// VariableDeclaration

function VariableDeclaration_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        VariableDeclaration_identifier_b,
        VariableDeclaration_pattern_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const VariableDeclaration = pfun(VariableDeclaration_b);

// Section 13.3.3

// BindingPattern

function BindingPattern_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        ObjectBindingPattern_b,
        ArrayBindingPattern_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const BindingPattern = pfun(BindingPattern_b);

// ObjectBindingPattern

function ObjectBindingPattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);              // 6 = start
        b.pitem(punctuator("{"));  // 5
        b.pitem(whitespace);       // 4
        b.pitem(pos);              // 3
        b.bchoice([                // 2 = properties
            () => {
                b.pitem(BindingPropertyList),
                b.pitem(whitespace),
                b.bopt(() => {
                    b.pitem(punctuator(","));
                    b.pitem(whitespace);
                    b.popAboveAndSet(1,null);
                });
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
            },
        ]);
        b.pitem(punctuator("}"));  // 1
        b.pitem(pos);              // 0 = end
        b.assertLengthIs(oldLength+7);
        const start = checkNumber(b.get(6));
        const end = checkNumber(b.get(0));
        b.popAboveAndSet(6,b.get(2));
        b.assertLengthIs(oldLength+1);
        const properties = checkListNode(b.get(0));
        b.popAboveAndSet(0,new GenericNode(new Range(start,end),"ObjectBindingPattern",[properties]));
        checkNode(b.get(0));
    });
}

const ObjectBindingPattern = pfun(ObjectBindingPattern_b);

// ArrayBindingPattern

function ArrayBindingPattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 7 = start
            punctuator("["),     // 6
            whitespace,          // 5
            BindingElementList,  // 4 = elements
            whitespace,          // 3
        ]);
        b.bopt(() => {            // 2 = rest
            b.pitem(BindingRestElement);
            b.pitem(whitespace);
            b.popAboveAndSet(1,b.get(1));
        });
        b.pitems([
            punctuator("]"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"ArrayBindingPattern",[4,2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ArrayBindingPattern = pfun(ArrayBindingPattern_b);

// BindingPropertyList

function BindingPropertyList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(BindingProperty);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    BindingProperty,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BindingPropertyList = pfun(BindingPropertyList_b);

// BindingElementList

function BindingElementList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.bopt(() => {
                    b.pitem(pos);
                    b.pitem(punctuator(","));
                    b.pitem(pos);
                    b.popAboveAndSet(2,makeNode(b,2,0,"Elision",[]));
                });
            },
            () => {
                b.bchoice([
                    () => {
                        b.pitems([
                            whitespace,      // 3
                            pos,             // 2 = before
                            punctuator(","), // 1
                            pos,             // 0 = after
                        ]);
                        b.popAboveAndSet(3,makeNode(b,2,0,"Elision",[]));
                    },
                    () => {
                        b.pitem(whitespace);
                        b.pitem(BindingElement);
                        b.bopt(() => {
                            b.pitem(whitespace);
                            b.pitem(punctuator(","));
                            b.pop();
                        });
                        b.popAboveAndSet(2,b.get(1));
                    },
                ])
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BindingElementList = pfun(BindingElementList_b);

// BindingProperty

function BindingProperty_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,             // 6 = start
                    PropertyName,    // 5 = name
                    whitespace,      // 4
                    punctuator(":"), // 3
                    whitespace,      // 2
                    BindingElement,  // 1 = element
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BindingProperty",[5,1]));
            },
            () => {
                // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
                // and PropertyName will match an identifier at the start of a colon binding
                b.pitem(SingleNameBinding);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BindingProperty = pfun(BindingProperty_b);

// BindingElement

function BindingElement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitem(SingleNameBinding);
            },
            () => {
                b.pitem(pos);
                b.pitem(BindingPattern);
                b.bchoice([
                    () => {
                        b.pitems([
                            whitespace,
                            Initializer,
                            pos,
                        ]);
                        b.assertLengthIs(oldLength+5);
                        b.popAboveAndSet(4,makeNode(b,4,0,"BindingPatternInit",[3,1]));
                    },
                    () => {
                        b.popAboveAndSet(1,b.get(0));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BindingElement = pfun(BindingElement_b);

// SingleNameBinding

function SingleNameBinding_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);
        b.pitem(BindingIdentifier);
        b.bchoice([
            () => {
                b.pitems([
                    whitespace,
                    Initializer,
                    pos,
                ]);
                b.popAboveAndSet(2,makeNode(b,4,0,"SingleNameBinding",[3,1]));
            },
            () => {
                b.push(b.get(0));
            },
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const SingleNameBinding = pfun(SingleNameBinding_b);

// BindingRestElement

function BindingRestElement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 4 = start
            punctuator("..."), // 3
            whitespace,        // 2
            BindingIdentifier, // 1 = ident
            pos,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"BindingRestElement",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BindingRestElement = pfun(BindingRestElement_b);

// Section 13.4

// EmptyStatement

function EmptyStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,
            punctuator(";"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"EmptyStatement",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const EmptyStatement = pfun(EmptyStatement_b);

// Section 13.5

// ExpressionStatement

function ExpressionStatement_b(b: Builder): void {
    const p = b.parser;
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

    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,             // 4 = start
            Expression,      // 3 = expr
            whitespace,      // 2
            punctuator(";"), // 1
            pos,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"ExpressionStatement",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ExpressionStatement = pfun(ExpressionStatement_b);

// Section 13.6

// IfStatement

function IfStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 11 = start
            keyword("if"),     // 10
            whitespace,        // 9
            punctuator("("),   // 8
            whitespace,        // 7
            Expression,        // 6 = condition
            whitespace,        // 5
            punctuator(")"),   // 4
            whitespace,        // 3
            Statement,         // 2 = trueBranch
        ]);
        b.bopt(() => {          // 1 = falseBranch
            b.pitems([
                whitespace,
                keyword("else"),
                whitespace,
                Statement,
            ]);
            b.popAboveAndSet(3,b.get(0));
        });
        b.pitem(pos);           // 0 = end
        b.assertLengthIs(oldLength+12);
        b.popAboveAndSet(11,makeNode(b,11,0,"IfStatement",[6,2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const IfStatement = pfun(IfStatement_b);

// Section 13.7

// IterationStatement_do

function IterationStatement_do_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,              // 14
            keyword("do"),    // 13
            whitespace,       // 12
            Statement,        // 11 = body
            whitespace,       // 10
            keyword("while"), // 9
            whitespace,       // 8
            punctuator("("),  // 7
            whitespace,       // 6
            Expression,       // 5 = condition
            whitespace,       // 4
            punctuator(")"),  // 3
            whitespace,       // 2
            punctuator(";"),  // 1 = end
            pos,              // 0 = start
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"DoStatement",[11,5]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const IterationStatement_do = pfun(IterationStatement_do_b);

// IterationStatement_while

function IterationStatement_while_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                // 10 = start
            keyword("while"),   // 9
            whitespace,         // 8
            punctuator("("),    // 7
            whitespace,         // 6
            Expression,         // 5 = condition
            whitespace,         // 4
            punctuator(")"),    // 3
            whitespace,         // 2
            Statement,          // 1 = body
            pos,                // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WhileStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const IterationStatement_while = pfun(IterationStatement_while_b);

// IterationStatement_for_c

function IterationStatement_for_c_b(b: Builder): void {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                                                            // 14 = start
            keyword("for"),                                                 // 13
            whitespace,                                                     // 12
            punctuator("("),                                                // 11
            whitespace,                                                     // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.bchoice([
            () => {
                b.pitems([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    Expression,
                    whitespace,
                    punctuator(";"),
                    whitespace
                ]);
                b.popAboveAndSet(5,b.get(3));
            },
            () => {
                b.pitems([
                    pos,                     // 7 = start2
                    keyword("var"),          // 6
                    whitespace,              // 5
                    VariableDeclarationList, // 4 = declarations
                    pos,                     // 3 = end
                    whitespace,              // 2
                    punctuator(";"),         // 1
                    whitespace,              // 0
                ]);
                b.popAboveAndSet(7,makeNode(b,7,3,"Var",[4]));
            },
            () => {
                b.pitems([
                    LexicalDeclaration,
                    whitespace,
                ]);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                // initializer part can be empty, but need to distinguish this from an error
                b.pitems([
                    punctuator(";"),
                ]);
                b.popAboveAndSet(0,null);
            },
        ]);
        b.assertLengthIs(oldLength+6);
        b.pitem(opt(Expression)); // 8 = condition
        b.pitem(whitespace);      // 7
        b.pitem(punctuator(";")); // 6
        b.pitem(whitespace);      // 5
        b.bopt(() => {            // 4 = update
            b.pitem(Expression);
            b.pitem(whitespace);
            b.popAboveAndSet(1,b.get(1));
        });
        b.pitem(punctuator(")")); // 3
        b.pitem(whitespace);      // 2
        b.pitem(Statement);       // 1 = body
        b.pitem(pos);             // 0 = end
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForC",[9,8,4,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const IterationStatement_for_c = pfun(IterationStatement_for_c_b);

// IterationStatement_for_in

function IterationStatement_for_in_b(b: Builder): void {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.bchoice([ // 9 = binding
            () => {
                b.pitems([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    LeftHandSideExpression,
                ]);
                b.popAboveAndSet(2,b.get(0));
            },
            () => {
                b.pitems([
                    pos,
                    keyword("var"),
                    whitespace,
                    ForBinding,
                    pos,
                ]);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarForDeclaration",[1]));
            },
            () => {
                b.pitem(ForDeclaration);
            }
        ]);
        b.assertLengthIs(oldLength+6);
        b.pitems([
            whitespace,                                    // 8
            keyword("in"),                                 // 7
            whitespace,                                    // 6
            Expression,                                    // 5 = expr
            whitespace,                                    // 4
            punctuator(")"),                               // 3
            whitespace,                                    // 2
            Statement,                                     // 1 = body
            pos,                                           // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForIn",[9,5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const IterationStatement_for_in = pfun(IterationStatement_for_in_b);

// IterationStatement_for_of

function IterationStatement_for_of_b(b: Builder): void {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.bchoice([
            () => {
                b.pitems([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    LeftHandSideExpression
                ]);
                b.popAboveAndSet(2,b.get(0));
            },
            () => {
                b.pitems([
                    pos,
                    keyword("var"),
                    whitespace,
                    ForBinding,
                    pos
                ]);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarForDeclaration",[1]));
            },
            () => {
                b.pitem(ForDeclaration);
            },
        ]);
        b.assertLengthIs(oldLength+6);
        b.pitems([
            whitespace,                                    // 8
            keyword("of"),                                 // 7
            whitespace,                                    // 6
            Expression,                                    // 5 = expr
            whitespace,                                    // 4
            punctuator(")"),                               // 3
            whitespace,                                    // 2
            Statement,                                     // 1 = body
            pos,                                           // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForOf",[9,5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const IterationStatement_for_of = pfun(IterationStatement_for_of_b);

// IterationStatement_for

function IterationStatement_for_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        IterationStatement_for_c_b,
        IterationStatement_for_in_b,
        IterationStatement_for_of_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const IterationStatement_for = pfun(IterationStatement_for_b);

// IterationStatement

function IterationStatement_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        IterationStatement_do_b,
        IterationStatement_while_b,
        IterationStatement_for_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const IterationStatement = pfun(IterationStatement_b);

// ForDeclaration

function ForDeclaration_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,              // 4 = start
                    keyword("let"),   // 3
                    whitespace,       // 2
                    ForBinding,       // 1 = binding
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"LetForDeclaration",[1]));
            },
            () => {
                b.pitems([
                    pos,              // 4 = start
                    keyword("const"), // 3
                    whitespace,       // 2
                    ForBinding,       // 1 = binding
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ConstForDeclaration",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ForDeclaration = pfun(ForDeclaration_b);

// ForBinding

function ForBinding_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        BindingIdentifier_b,
        BindingPattern_b, // FIXME: Need test cases for this
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const ForBinding = pfun(ForBinding_b);

// Section 13.8

// ContinueStatement

function ContinueStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,                 // 5 = start
                    keyword("continue"), // 4
                    whitespace,          // 3
                    value(null),         // 2 = null
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(5,makeNode(b,5,0,"ContinueStatement",[2]));
            },
            () => {
                b.pitems([
                    pos,                 // 6 = start
                    keyword("continue"), // 5
                    whitespaceNoNewline, // 4
                    LabelIdentifier,     // 3 = ident
                    whitespace,          // 2
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ContinueStatement",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ContinueStatement = pfun(ContinueStatement_b);

// Section 13.9

// BreakStatement

function BreakStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,              // 5 = start
                    keyword("break"), // 4
                    whitespace,       // 3
                    value(null),      // 2 = null
                    punctuator(";"),  // 1
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(5,makeNode(b,5,0,"BreakStatement",[2]));
            },
            () => {
                b.pitems([
                    pos,                 // 6 = start
                    keyword("break"),    // 5
                    whitespaceNoNewline, // 4
                    LabelIdentifier,     // 3 = ident
                    whitespace,          // 2
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BreakStatement",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const BreakStatement = pfun(BreakStatement_b);

// Section 13.10

// ReturnStatement

function ReturnStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,               // 5 = start
                    keyword("return"), // 4
                    whitespace,        // 3
                    value(null),       // 2 = null
                    punctuator(";"),   // 1
                    pos,               // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(5,makeNode(b,5,0,"ReturnStatement",[2]));
            },
            () => {
                b.pitems([
                    pos,                 // 6 = start
                    keyword("return"),   // 5
                    whitespaceNoNewline, // 4
                    Expression,          // 3 = expr
                    whitespace,          // 2
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ReturnStatement",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ReturnStatement = pfun(ReturnStatement_b);

// Section 13.11

// WithStatement

function WithStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,             // 10 = start
            keyword("with"), // 9
            whitespace,      // 8
            punctuator("("), // 7
            whitespace,      // 6
            Expression,      // 5 = expr
            whitespace,      // 4
            punctuator(")"), // 3
            whitespace,      // 2
            Statement,       // 1 = body
            pos,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WithStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const WithStatement = pfun(WithStatement_b);

// Section 13.12

// SwitchStatement

function SwitchStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 10 = start
            keyword("switch"), // 9
            whitespace,        // 8
            punctuator("("),   // 7
            whitespace,        // 6
            Expression,        // 5 = expr
            whitespace,        // 4
            punctuator(")"),   // 3
            whitespace,        // 2
            CaseBlock,         // 1 = cases
            pos,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"SwitchStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const SwitchStatement = pfun(SwitchStatement_b);

// CaseBlock_1

function CaseBlock_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,             // 7
            punctuator("{"), // 6
            whitespace,      // 5
            pos,             // 4 = midpos
        ]);
        b.bchoice([           // 3 = clauses
            () => {
                b.pitem(CaseClauses);
            },
            () => {
                const midpos = checkNumber(b.get(0));
                b.push(new ListNode(new Range(midpos,midpos),[]));
            },
        ]);
        b.pitems([
            whitespace,      // 2
            punctuator("}"), // 1
            pos,             // 0
        ]);
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"CaseBlock1",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CaseBlock_1 = pfun(CaseBlock_1_b);

// CaseBlock_2

function CaseBlock_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,              // 10 = start
            punctuator("{"),  // 9
            whitespace,       // 8
            opt(CaseClauses), // 7 = clauses1
            whitespace,       // 6
            DefaultClause,    // 5 = defaultClause
            whitespace,       // 4
            opt(CaseClauses), // 3 = clauses2
            whitespace,       // 2
            punctuator("}"),  // 1
            pos,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"CaseBlock2",[7,5,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CaseBlock_2 = pfun(CaseBlock_2_b);

// CaseBlock

function CaseBlock_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        CaseBlock_1_b,
        CaseBlock_2_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const CaseBlock = pfun(CaseBlock_b);

// CaseClauses

function CaseClauses_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(CaseClause);
            },
            () => {
                b.pitems([
                    whitespace,
                    CaseClause,
                ]);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CaseClauses = pfun(CaseClauses_b);

// CaseClause

function CaseClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,             // 8 = start
            keyword("case"), // 7
            whitespace,      // 6
            Expression,      // 5 = expr
            whitespace,      // 4
            punctuator(":"), // 3
            whitespace,      // 2
            StatementList,   // 1 = statements
            pos,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+9);
        b.popAboveAndSet(8,makeNode(b,8,0,"CaseClause",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const CaseClause = pfun(CaseClause_b);

// DefaultClause

function DefaultClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                // 6 = start
            keyword("default"), // 5
            whitespace,         // 4
            punctuator(":"),    // 3
            whitespace,         // 2
            StatementList,      // 1 = statements
            whitespace,         // 0
        ]);
        b.assertLengthIs(oldLength+7);
        const start = checkNumber(b.get(6));
        const statements = checkNode(b.get(1));
        const end = statements.range.end;
        b.popAboveAndSet(6,new GenericNode(new Range(start,end),"DefaultClause",[statements]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const DefaultClause = pfun(DefaultClause_b);

// Section 13.13

// LabelledStatement

function LabelledStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,             // 6 = start
            LabelIdentifier, // 5 = ident
            whitespace,      // 4
            punctuator(":"), // 3
            whitespace,      // 2
            LabelledItem,    // 1 = item
            pos,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"LabelledStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const LabelledStatement = pfun(LabelledStatement_b);

// LabelledItem

function LabelledItem_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        Statement_b,
        FunctionDeclaration_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const LabelledItem = pfun(LabelledItem_b);

// Section 13.14

// ThrowStatement

function ThrowStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 6 = start
            keyword("throw"),    // 5
            whitespaceNoNewline, // 4
            Expression,          // 3 = expr
            whitespace,          // 2
            punctuator(";"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ThrowStatement",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ThrowStatement = pfun(ThrowStatement_b);

// Section 13.15

// TryStatement

function TryStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);                   // 7 = start
        b.pitem(keyword("try"));        // 6
        b.pitem(whitespace);            // 5
        b.pitem(Block);                 // 4 = tryBlock
        b.bchoice([
            () => {
                b.pitem(whitespace);    // 3
                b.pitem(value(null));   // 2 = catchBlock
                b.pitem(Finally);       // 1 = finallyBlock
            },
            () => {
                b.pitem(whitespace);    // 3
                b.pitem(Catch);         // 2 = catchBlock
                b.bopt(() => {          // 1 = finallyBlock
                    b.pitem(whitespace);
                    b.pitem(Finally);
                    b.popAboveAndSet(1,b.get(0));
                });
            },
        ]);
        b.pitem(pos);                   // 0 = end
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"TryStatement",[4,2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const TryStatement = pfun(TryStatement_b);

// Catch

function Catch_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,              // 10 = start
            keyword("catch"), // 9
            whitespace,       // 8
            punctuator("("),  // 7
            whitespace,       // 6
            CatchParameter,   // 5 = param
            whitespace,       // 4
            punctuator(")"),  // 3
            whitespace,       // 2
            Block,            // 1 = block
            pos,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"Catch",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const Catch = pfun(Catch_b);

// Finally

function Finally_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                // 4
            keyword("finally"), // 3
            whitespace,         // 2
            Block,              // 1
            pos,                // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"Finally",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const Finally = pfun(Finally_b);

// CatchParameter

function CatchParameter_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        BindingIdentifier_b,
        BindingPattern_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const CatchParameter = pfun(CatchParameter_b);

// Section 13.16

// DebuggerStatement

function DebuggerStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 4
            keyword("debugger"), // 3
            whitespace,          // 2
            punctuator(";"),     // 1
            pos,                 // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"DebuggerStatement",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const DebuggerStatement = pfun(DebuggerStatement_b);

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 16 = start
            keyword("function"), // 15
            whitespace,          // 14
            BindingIdentifier,   // 13 = ident
            whitespace,          // 12
            punctuator("("),     // 11
            whitespace,          // 10
            FormalParameters,    // 9 = params
            whitespace,          // 8
            punctuator(")"),     // 7
            whitespace,          // 6
            punctuator("{"),     // 5
            whitespace,          // 4
            FunctionBody,        // 3 = body
            whitespace,          // 2
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"FunctionDeclaration",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const FunctionDeclaration_named = pfun(FunctionDeclaration_named_b);

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 15 = start
            keyword("function"), // 14
            whitespace,          // 13
            punctuator("("),     // 12
            whitespace,          // 11
            value(null),         // 10 = null
            FormalParameters,    // 9 = params
            whitespace,          // 8
            punctuator(")"),     // 7
            whitespace,          // 6
            punctuator("{"),     // 5
            whitespace,          // 4
            FunctionBody,        // 3 = body
            whitespace,          // 2
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionDeclaration",[10,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const FunctionDeclaration_unnamed = pfun(FunctionDeclaration_unnamed_b);

// FunctionDeclaration

function FunctionDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try {
        return FunctionDeclaration_named(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (flags.Default) {
        try {
            return FunctionDeclaration_unnamed(p);
        } catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
        }
    }
    throw new ParseError(p,p.pos,"Expected FunctionDeclaration");
}

const FunctionDeclaration_b = bfun(FunctionDeclaration);

// FunctionExpression

function FunctionExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 15 = start
            keyword("function"), // 14
            whitespace,          // 13
        ]);
        b.bopt(() => {
            b.pitem(BindingIdentifier);
            b.pitem(whitespace);
            b.popAboveAndSet(1,b.get(1));
        });
        b.pitems([
            punctuator("("),     // 11
            whitespace,          // 10
            FormalParameters,    // 9 = params
            whitespace,          // 8
            punctuator(")"),     // 7
            whitespace,          // 6
            punctuator("{"),     // 5
            whitespace,          // 4
            FunctionBody,        // 3 = body
            whitespace,          // 2
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionExpression",[12,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const FunctionExpression = pfun(FunctionExpression_b);

// StrictFormalParameters

function StrictFormalParameters(p: Parser): ASTNode {
    return FormalParameters(p);
}

const StrictFormalParameters_b = bfun(StrictFormalParameters);

// FormalParameters

function FormalParameters_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitem(FormalParameterList);
            },
            () => {
                b.pitem(pos);
                b.popAboveAndSet(0,makeNode(b,0,0,"FormalParameters1",[]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const FormalParameters = pfun(FormalParameters_b);

// FormalParameterList

function FormalParameterList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,                   // 2 = start
                    FunctionRestParameter, // 1 = rest
                    pos,                   // 0 = end
                ]);
                b.assertLengthIs(oldLength+3);
                b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters2",[1]));
            },
            () => {
                b.pitem(pos);           // 3 = start
                b.pitem(FormalsList);   // 2 = formals
                b.bchoice([
                    () => {
                        b.pitems([
                            whitespace,
                            punctuator(","),
                            whitespace,
                            FunctionRestParameter,
                            pos,
                        ]);
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"FormalParameters4",[5,1]));
                    },
                    () => {
                        b.pitem(pos);
                        b.assertLengthIs(oldLength+3);
                        b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters3",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
    });
}

const FormalParameterList = pfun(FormalParameterList_b);

// FormalsList

function FormalsList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(FormalParameter);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    FormalParameter,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const FormalsList = pfun(FormalsList_b);

// FunctionRestParameter

function FunctionRestParameter(p: Parser): ASTNode {
    return BindingRestElement(p);
}

const FunctionRestParameter_b = bfun(FunctionRestParameter);

// FormalParameter

function FormalParameter(p: Parser): ASTNode {
    return BindingElement(p);
}

const FormalParameter_b = bfun(FormalParameter);

// FunctionBody

function FunctionBody(p: Parser): ASTNode {
    return FunctionStatementList(p);
}

const FunctionBody_b = bfun(FunctionBody);

// FunctionStatementList

function FunctionStatementList_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        StatementList_b,
        bfun(() => new ListNode(new Range(b.parser.pos,b.parser.pos),[])),
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const FunctionStatementList = pfun(FunctionStatementList_b);

// Section 14.2

// ArrowFunction

function ArrowFunction_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 6 = start
            ArrowParameters,     // 5 = params
            whitespaceNoNewline, // 4
            punctuator("=>"),    // 3
            whitespace,          // 2
            ConciseBody,         // 1 = body
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ArrowFunction",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ArrowFunction = pfun(ArrowFunction_b);

// ArrowParameters

function ArrowParameters_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        BindingIdentifier_b,
        ArrowFormalParameters_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const ArrowParameters = pfun(ArrowParameters_b);

// ConciseBody

function ConciseBody_1(p: Parser): ASTNode {
    if (p.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    return AssignmentExpression(p);
}

const ConciseBody_1_b = bfun(ConciseBody_1);

// ConciseBody_2

function ConciseBody_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            punctuator("{"), // 4
            whitespace,      // 3
            FunctionBody,    // 2
            whitespace,      // 1
            punctuator("}"), // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ConciseBody_2 = pfun(ConciseBody_2_b);

// ConciseBody

function ConciseBody_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        ConciseBody_1_b,
        ConciseBody_2_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const ConciseBody = pfun(ConciseBody_b);

// ArrowFormalParameters

function ArrowFormalParameters_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            punctuator("("),        // 4
            whitespace,             // 3
            StrictFormalParameters, // 2
            whitespace,             // 1
            punctuator(")"),        // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ArrowFormalParameters = pfun(ArrowFormalParameters_b);

// Section 14.3

// MethodDefinition_1

function MethodDefinition_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                    // 14 = start
            PropertyName,           // 13 = name
            whitespace,             // 12
            punctuator("("),        // 11
            whitespace,             // 10
            StrictFormalParameters, // 9 = params
            whitespace,             // 8
            punctuator(")"),        // 7
            whitespace,             // 6
            punctuator("{"),        // 5
            whitespace,             // 4
            FunctionBody,           // 3 = body
            whitespace,             // 2
            punctuator("}"),        // 1
            pos,                    // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Method",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const MethodDefinition_1 = pfun(MethodDefinition_1_b);

// MethodDefinition_2

function MethodDefinition_2(p: Parser): ASTNode {
    return GeneratorMethod(p);
}

const MethodDefinition_2_b = bfun(MethodDefinition_2);

// MethodDefinition_3

function MethodDefinition_3_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 14 = start
            identifier("get"), // 13 "get" is not a reserved word, so we can't use keyword here
            whitespace,        // 12
            PropertyName,      // 11 = name
            whitespace,        // 10
            punctuator("("),   // 9
            whitespace,        // 8
            punctuator(")"),   // 7
            whitespace,        // 6
            punctuator("{"),   // 5
            whitespace,        // 4
            FunctionBody,      // 3 = body
            whitespace,        // 2
            punctuator("}"),   // 1
            pos,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Getter",[11,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const MethodDefinition_3 = pfun(MethodDefinition_3_b);

// MethodDefinition_4

function MethodDefinition_4_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                      // 16 = start
            identifier("set"),        // 15
            whitespace,               // 14
            PropertyName,             // 13 = name
            whitespace,               // 12
            punctuator("("),          // 11
            whitespace,               // 10
            PropertySetParameterList, // 9 = param
            whitespace,               // 8
            punctuator(")"),          // 7
            whitespace,               // 6
            punctuator("{"),          // 5
            whitespace,               // 4
            FunctionBody,             // 3 = body
            whitespace,               // 2
            punctuator("}"),          // 1
            pos,                      // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"Setter",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const MethodDefinition_4 = pfun(MethodDefinition_4_b);

// MethodDefinition

function MethodDefinition_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        MethodDefinition_1_b,
        MethodDefinition_2_b,
        MethodDefinition_3_b,
        MethodDefinition_4_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const MethodDefinition = pfun(MethodDefinition_b);

// PropertySetParameterList

function PropertySetParameterList(p: Parser): ASTNode {
    return FormalParameter(p);
}

const PropertySetParameterList_b = bfun(PropertySetParameterList);

// Section 14.4

// GeneratorMethod

function GeneratorMethod_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                    // 16 = start
            punctuator("*"),        // 15
            whitespace,             // 14
            PropertyName,           // 13 = name
            whitespace,             // 12
            punctuator("("),        // 11
            whitespace,             // 10
            StrictFormalParameters, // 9 = params
            whitespace,             // 8
            punctuator(")"),        // 7
            whitespace,             // 6
            punctuator("{"),        // 5
            whitespace,             // 4
            GeneratorBody,          // 3 = body
            whitespace,             // 2
            punctuator("}"),        // 1
            pos,                    // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"GeneratorMethod",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const GeneratorMethod = pfun(GeneratorMethod_b);

// GeneratorDeclaration_1

function GeneratorDeclaration_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 18 = start
            keyword("function"), // 17
            whitespace,          // 16
            punctuator("*"),     // 15
            whitespace,          // 14
            BindingIdentifier,   // 13 = ident
            whitespace,          // 12
            punctuator("("),     // 11
            whitespace,          // 10
            FormalParameters,    // 9 = params
            whitespace,          // 8
            punctuator(")"),     // 7
            whitespace,          // 6
            punctuator("{"),     // 5
            whitespace,          // 4
            GeneratorBody,       // 3 = body
            whitespace,          // 2
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+19);
        b.popAboveAndSet(18,makeNode(b,18,0,"GeneratorDeclaration",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const GeneratorDeclaration_1 = pfun(GeneratorDeclaration_1_b);

// GeneratorDeclaration_2

function GeneratorDeclaration_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 16 = start
            keyword("function"), // 15
            whitespace,          // 14
            punctuator("*"),     // 13
            whitespace,          // 12
            punctuator("("),     // 11
            whitespace,          // 10
            FormalParameters,    // 9 = params
            whitespace,          // 8
            punctuator(")"),     // 7
            whitespace,          // 6
            punctuator("{"),     // 5
            whitespace,          // 4
            GeneratorBody,       // 3 = body
            whitespace,          // 2
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        // FIXME: Should be DefaultGeneratorDeclaration
        b.popAboveAndSet(16,makeNode(b,16,0,"DefaultGeneratorDeclaration",[9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const GeneratorDeclaration_2 = pfun(GeneratorDeclaration_2_b);

// GeneratorDeclaration

function GeneratorDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try {
        return GeneratorDeclaration_1(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (flags.Default) {
        try {
            return GeneratorDeclaration_2(p);
        } catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
        }
    }
    throw new ParseError(p,p.pos,"Expected GeneratorDeclaration");
}

const GeneratorDeclaration_b = bfun(GeneratorDeclaration);

// GeneratorExpression

function GeneratorExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                 // 17 = start
            keyword("function"), // 16
            whitespace,          // 15
            punctuator("*"),     // 14
            whitespace,          // 13
        ]);
        b.bopt(() => {            // 12 = ident
            b.pitems([
                BindingIdentifier,
                whitespace,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.pitems([
            punctuator("("),     // 11
            whitespace,          // 10
            FormalParameters,    // 9 = params
            whitespace,          // 8
            punctuator(")"),     // 7
            whitespace,          // 6
            punctuator("{"),     // 5
            whitespace,          // 4
            GeneratorBody,       // 3 = body
            whitespace,          // 2
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+18);
        b.popAboveAndSet(17,makeNode(b,17,0,"GeneratorExpression",[12,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const GeneratorExpression = pfun(GeneratorExpression_b);

// GeneratorBody

function GeneratorBody(p: Parser): ASTNode {
    return FunctionBody(p);
}

const GeneratorBody_b = bfun(GeneratorBody);

// YieldExpression_1

function YieldExpression_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                  // 6
            keyword("yield"),     // 5
            whitespaceNoNewline,  // 4
            punctuator("*"),      // 3
            whitespace,           // 2
            AssignmentExpression, // 1
            pos,                  // 0
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"YieldStar",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const YieldExpression_1 = pfun(YieldExpression_1_b);

// YieldExpression_2

function YieldExpression_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                  // 4
            keyword("yield"),     // 3
            whitespaceNoNewline,  // 2
            AssignmentExpression, // 1
            pos,                  // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"YieldExpr",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const YieldExpression_2 = pfun(YieldExpression_2_b);

// YieldExpression_3

function YieldExpression_3_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,
            keyword("yield"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"YieldNothing",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const YieldExpression_3 = pfun(YieldExpression_3_b);

// YieldExpression

function YieldExpression_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        YieldExpression_1_b,
        YieldExpression_2_b,
        YieldExpression_3_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const YieldExpression = pfun(YieldExpression_b);

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 6 = start
            keyword("class"),  // 5
            whitespace,        // 4
            BindingIdentifier, // 3 = ident
            whitespace,        // 2
            ClassTail,         // 1 = tail
            pos,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassDeclaration",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassDeclaration_1 = pfun(ClassDeclaration_1_b);

// ClassDeclaration_2

function ClassDeclaration_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,              // 5
            keyword("class"), // 4
            whitespace,       // 3
            value(null),      // 2
            ClassTail,        // 1
            pos,              // 0
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassDeclaration",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassDeclaration_2 = pfun(ClassDeclaration_2_b);

// ClassDeclaration

function ClassDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try {
        return ClassDeclaration_1(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (flags.Default) {
        try {
            return ClassDeclaration_2(p);
        } catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
        }
    }
    throw new ParseError(p,p.pos,"Expected ClassDeclaration");
}

const ClassDeclaration_b = bfun(ClassDeclaration);

// ClassExpression

function ClassExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);              // 5
        b.pitem(keyword("class")); // 4
        b.pitem(whitespace);       // 3
        b.bopt(() => {             // 2
            b.pitems([
                BindingIdentifier,
                whitespace,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.pitem(ClassTail);        // 1
        b.pitem(pos);              // 0
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassExpression",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassExpression = pfun(ClassExpression_b);

// ClassTail

function ClassTail_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);               // 6 = start
        b.bopt(() => {              // 5 = heritage
            b.pitems([
                ClassHeritage,
                whitespace,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.pitem(punctuator("{"));   // 4
        b.pitem(whitespace);        // 3
        b.bchoice([                 // 2 = body
            () => {
                b.pitems([
                    ClassBody,
                    whitespace,
                ]);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                b.pitem(pos);
                b.popAboveAndSet(0,makeEmptyListNode(b,0,0));
            },
        ]);
        b.pitem(punctuator("}"));   // 1
        b.pitem(pos);               // 0 = end
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassTail",[5,2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassTail = pfun(ClassTail_b);

// ClassHeritage

function ClassHeritage_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                    // 4 = start
            keyword("extends"),     // 3
            whitespace,             // 2
            LeftHandSideExpression, // 1 = expr
            pos,                    // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"Extends",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassHeritage = pfun(ClassHeritage_b);

// ClassBody

function ClassBody(p: Parser): ASTNode {
    return ClassElementList(p);
}

const ClassBody_b = bfun(ClassBody);

// ClassElementList

function ClassElementList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(ClassElement);
            },
            () => {
                b.pitem(whitespace);
                b.pitem(ClassElement);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassElementList = pfun(ClassElementList_b);

// ClassElement_1

function ClassElement_1(p: Parser): ASTNode {
    return MethodDefinition(p);
}

const ClassElement_1_b = bfun(ClassElement_1);

// ClassElement_2

function ClassElement_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,
            keyword("static"),
            whitespace,
            MethodDefinition,
            pos,
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"StaticMethodDefinition",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassElement_2 = pfun(ClassElement_2_b);

// ClassElement_3

function ClassElement_3_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,
            punctuator(";"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"EmptyClassElement",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ClassElement_3 = pfun(ClassElement_3_b);

// ClassElement

function ClassElement_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        ClassElement_1_b,
        ClassElement_2_b,
        ClassElement_3_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const ClassElement = pfun(ClassElement_b);

// Section 15.1

// Script

export function Script(p: Parser): ScriptNode | ErrorNode {
    const start = p.pos;
    let body: ASTNode = null;
    try {
        body = ScriptBody(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (body == null)
        body = new ListNode(new Range(start,p.pos),[]);
    return new ScriptNode(new Range(start,p.pos),body);
}

const Script_b = bfun(Script);

// ScriptBody

function ScriptBody(p: Parser): ASTNode {
    return StatementList(p);
}

const ScriptBody_b = bfun(ScriptBody);

// Section 15.2

// Module

export function Module(p: Parser): ModuleNode | ErrorNode {
    const start = p.pos;
    let body: ASTNode = null;
    try {
        body = ModuleBody(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (body == null)
        body = new ListNode(new Range(start,p.pos),[]);
    return new ModuleNode(new Range(start,p.pos),body);
}

const Module_b = bfun(Module);

// ModuleBody

function ModuleBody(p: Parser): ASTNode {
    return ModuleItemList(p);
}

const ModuleBody_b = bfun(ModuleBody);

// ModuleItemList

function ModuleItemList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(ModuleItem);
            },
            () => {
                b.pitem(whitespace);
                b.pitem(ModuleItem);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ModuleItemList = pfun(ModuleItemList_b);

// ModuleItem

function ModuleItem_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        ImportDeclaration_b,
        ExportDeclaration_b,
        StatementListItem_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const ModuleItem = pfun(ModuleItem_b);

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 8 = start
            keyword("import"), // 7
            whitespace,        // 6
            ImportClause,      // 5 = importClause
            whitespace,        // 4
            FromClause,        // 3 = fromClause
            whitespace,        // 2
            punctuator(";"),   // 1
            pos,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+9);
        b.popAboveAndSet(8,makeNode(b,8,0,"ImportFrom",[5,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ImportDeclaration_from = pfun(ImportDeclaration_from_b);

// ImportDeclaration_module

function ImportDeclaration_module_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,               // 6 = start
            keyword("import"), // 5
            whitespace,        // 4
            ModuleSpecifier,   // 3 = specifier
            whitespace,        // 2
            punctuator(";"),   // 1
            pos,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ImportModule",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ImportDeclaration_module = pfun(ImportDeclaration_module_b);

// ImportDeclaration

function ImportDeclaration_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        ImportDeclaration_from_b,
        ImportDeclaration_module_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

const ImportDeclaration = pfun(ImportDeclaration_b);

// ImportClause

function ImportClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitem(NameSpaceImport);
            },
            () => {
                b.pitem(NamedImports);
            },
            () => {
                b.pitem(pos);                    // 6 = start
                b.pitem(ImportedDefaultBinding); // 5 = defbinding
                b.bchoice([
                    () => {
                        b.pitems([
                            whitespace,         // 4
                            punctuator(","),    // 3
                            whitespace,         // 2
                            NameSpaceImport,    // 1 = nsimport
                            pos,                // 0 = end
                        ]);
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"DefaultAndNameSpaceImports",[5,1]));
                    },
                    () => {
                        b.pitems([
                            whitespace,         // 4
                            punctuator(","),    // 3
                            whitespace,         // 2
                            NamedImports,       // 1 = nsimports
                            pos,                // 0 = end
                        ]);
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"DefaultAndNamedImports",[5,1]));
                    },
                    () => {
                        b.pitem(pos);
                        b.popAboveAndSet(2,makeNode(b,2,0,"DefaultImport",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ImportClause = pfun(ImportClause_b);

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): ASTNode {
    return ImportedBinding(p);
}

const ImportedDefaultBinding_b = bfun(ImportedDefaultBinding);

// NameSpaceImport

function NameSpaceImport_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,             // 6 = start
            punctuator("*"), // 5
            whitespace,      // 4
            keyword("as"),   // 3
            whitespace,      // 2
            ImportedBinding, // 1 = binding
            pos,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NameSpaceImport",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const NameSpaceImport = pfun(NameSpaceImport_b);

// NamedImports

function NamedImports_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                // 5 = start
            punctuator("{"),    // 4
            whitespace,         // 3
        ]);
        b.bchoice([              // 2 = imports
            () => {
                b.pitem(ImportsList);
                b.pitem(whitespace);
                b.bopt(() => {
                    b.pitem(punctuator(","));
                    b.pitem(whitespace);
                    b.pop();
                });
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
            },
        ]);
        b.pitems([
            punctuator("}"),    // 1
            pos,                // 0 = end
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"NamedImports",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const NamedImports = pfun(NamedImports_b);

// FromClause

function FromClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            keyword("from"),
            whitespace,
            ModuleSpecifier,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const FromClause = pfun(FromClause_b);

// ImportsList

function ImportsList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(ImportSpecifier);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    ImportSpecifier,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ImportsList = pfun(ImportsList_b);

// ImportSpecifier

function ImportSpecifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.pitems([
                    pos,             // 6 = start
                    IdentifierName,  // 5 = name
                    whitespace,      // 4
                    keyword("as"),   // 3
                    whitespace,      // 2
                    ImportedBinding, // 1 = binding
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ImportAsSpecifier",[5,1]));
            },
            () => {
                b.pitems([
                    pos,             // 2 = start
                    ImportedBinding, // 1 = binding
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+3);
                b.popAboveAndSet(2,makeNode(b,2,0,"ImportSpecifier",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ImportSpecifier = pfun(ImportSpecifier_b);

// ModuleSpecifier

function ModuleSpecifier(p: Parser): ASTNode {
    return StringLiteral(p);
}

const ModuleSpecifier_b = bfun(ModuleSpecifier);

// ImportedBinding

function ImportedBinding(p: Parser): ASTNode {
    return BindingIdentifier(p);
}

const ImportedBinding_b = bfun(ImportedBinding);

// Section 15.2.3

// ExportDeclaration

function ExportDeclaration_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,
            keyword("export"),
            whitespace,
        ]);
        b.assertLengthIs(oldLength+3);
        b.bchoice([
            () => {
                b.pitems([
                    keyword("default"),                              // 3
                    whitespace,                                      // 2
                    () => HoistableDeclaration(b.parser,{ Default: true }), // 1
                    pos,                                             // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.pitems([
                    keyword("default"), // 3
                    whitespace, // 2
                    () => ClassDeclaration(b.parser,{ Default: true }), // 1
                    pos, // 0
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.pitems([
                    keyword("default"), // 7
                    whitespace, // 6
                    notKeyword("function"), // 5 FIXME: need tests for this
                    notKeyword("class"), // 4 FIXME: need tests for this
                    AssignmentExpression, // 3
                    whitespace, // 2
                    punctuator(";"), // 1
                    pos, // 0
                ]);
                b.assertLengthIs(oldLength+11);
                b.popAboveAndSet(10,makeNode(b,10,0,"ExportDefault",[3]));
            },
            () => {
                b.pitems([
                    punctuator("*"), // 5
                    whitespace,      // 4
                    FromClause,      // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"ExportStar",[3]));
            },
            () => {
                b.pitems([
                    ExportClause,    // 5
                    whitespace,      // 4
                    FromClause,      // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"ExportFrom",[5,3]));
            },
            () => {
                b.pitems([
                    ExportClause,    // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportPlain",[3]));
            },
            () => {
                b.pitems([
                    VariableStatement, // 1
                    pos,               // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportVariable",[1]));
            },
            () => {
                b.pitems([
                    Declaration, // 1
                    pos,         // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportDeclaration",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ExportDeclaration = pfun(ExportDeclaration_b);

// ExportClause

function ExportClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitems([
            pos,                       // 5
            punctuator("{"),           // 4
            whitespace,                // 3
        ]);
        b.bchoice([                     // 2
            () => {
                b.pitem(ExportsList);
                b.pitem(whitespace);
                b.bopt(() => {
                    b.pitem(punctuator(","));
                    b.pitem(whitespace);
                    b.pop();
                });
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(2,b.get(2));
                b.assertLengthIs(oldLength+4);
            },
            () => {
                b.pitem(pos);
                const curPos = checkNumber(b.get(0));
                b.popAboveAndSet(0,new ListNode(new Range(curPos,curPos),[]));
            },
        ]);
        b.assertLengthIs(oldLength+4);
        b.pitems([
            punctuator("}"),           // 1
            pos,                       // 0
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ExportClause",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ExportClause = pfun(ExportClause_b);

// ExportsList

function ExportsList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.pitem(ExportSpecifier);
            },
            () => {
                b.pitems([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    ExportSpecifier,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ExportsList = pfun(ExportsList_b);

// ExportSpecifier

function ExportSpecifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.pitem(pos);
        b.pitem(IdentifierName);
        b.bchoice([
            () => {
                // let asIdent: IdentifierNode | ErrorNode;
                b.pitems([
                    whitespace,        // 4
                    keyword("as"),     // 3
                    whitespace,        // 2
                    IdentifierName,    // 1
                    pos,               // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(4,makeNode(b,6,0,"ExportAsSpecifier",[5,1]));
                b.assertLengthIs(oldLength+3);
            },
            () => {
                b.pitem(pos);
                b.assertLengthIs(oldLength+3);
                b.popAboveAndSet(0,makeNode(b,2,0,"ExportNormalSpecifier",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

const ExportSpecifier = pfun(ExportSpecifier_b);
