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
        b.pitems([
            pos,
            keyword("this"),
            pos,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,makeNode(b,2,0,"This",[]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const This_b = bfun(This);

// PrimaryExpression

function PrimaryExpression(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(This),
        // Literal must come before IdentifierReference, since "true", "false", and "null" are not keywords
        bfun(Literal),
        bfun(IdentifierReference),
        bfun(ArrayLiteral),
        bfun(ObjectLiteral),
        bfun(FunctionExpression),
        bfun(ClassExpression),
        bfun(GeneratorExpression),
        // bfun(RegularExpressionLiteral), // TODO
        // bfun(TemplateLiteral), // TODO
        bfun(ParenthesizedExpression),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const PrimaryExpression_b = bfun(PrimaryExpression);

// ParenthesizedExpression

function ParenthesizedExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            punctuator("("), // 4
            whitespace,      // 3
            Expression,      // 2 = expr
            whitespace,      // 1
            punctuator(")"), // 0
        ]);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ParenthesizedExpression_b = bfun(ParenthesizedExpression);

// Section 12.2.4

// Literal

function Literal(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(NullLiteral),
        bfun(BooleanLiteral),
        bfun(NumericLiteral),
        bfun(StringLiteral),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const Literal_b = bfun(Literal);

// NullLiteral

function NullLiteral(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            keyword("null"),
            pos,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,makeNode(b,2,0,"NullLiteral",[]));
        b.assertLengthIs(1);
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

function ArrayLiteral(p: Parser): ASTNode {
    return p.attempt((start): ASTNode => {
        const b = new Builder(p);
        b.pitem(pos);
        b.pitem(punctuator("["));
        b.pitem(whitespace);

        const elements: ASTNode[] = [];
        const listStart = p.pos;
        let listEnd = p.pos;

        b.assertLengthIs(3);

        b.bopt(() => {
            b.pitem(pos);             // 3 = before
            b.pitem(punctuator(",")); // 2
            b.pitem(pos);             // 1 = after
            b.pitem(whitespace);      // 0
            b.assertLengthIs(7);
            b.popAboveAndSet(3,makeNode(b,3,1,"Elision",[]));
        });
        b.assertLengthIs(4);

        const initialElision = checkNode(b.get(0));
        if (initialElision != null) {
            elements.push(initialElision);
            listEnd = initialElision.range.end;
        }

        while (true) {
            b.assertLengthIs(4);
            if (p.lookaheadPunctuator("]")) {
                p.expectPunctuator("]");
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
                        b.assertLengthIs(8);
                        b.popAboveAndSet(3,makeNode(b,3,1,"Elision",[]));
                        b.assertLengthIs(5);
                    },
                    () => {
                        b.pitem(AssignmentExpression);
                        b.pitem(whitespace);
                        b.bopt(() => {
                            b.pitem(punctuator(","));
                            b.pitem(whitespace);
                            b.pop();
                        });
                        b.assertLengthIs(7);
                        b.popAboveAndSet(2,checkNode(b.get(2)));
                        b.assertLengthIs(5);
                    },
                    () => {
                        b.pitem(SpreadElement);
                        b.pitem(whitespace);
                        b.bopt(() => {
                            b.pitem(punctuator(","));
                            b.pitem(whitespace);
                            b.pop();
                        });
                        b.assertLengthIs(7);
                        b.popAboveAndSet(2,checkNode(b.get(2)));
                        b.assertLengthIs(5);
                    },
                ]);
                b.assertLengthIs(5);
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

        b.assertLengthIs(4);
        const list = new ListNode(new Range(listStart,listEnd),elements);
        b.popAboveAndSet(3,new GenericNode(new Range(start,p.pos),"ArrayLiteral",[list]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ArrayLiteral_b = bfun(ArrayLiteral);

// SpreadElement

function SpreadElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            punctuator("..."),
            whitespace,
            AssignmentExpression,
            pos,
        ]);
        b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const SpreadElement_b = bfun(SpreadElement);

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.push(new ListNode(new Range(p.pos,p.pos),[]));
            },
        ]);
        b.pitem(punctuator("}")); // 1
        b.pitem(pos);             // 0 = end
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ObjectLiteral",[2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ObjectLiteral_b = bfun(ObjectLiteral);

// PropertyDefinitionList

function PropertyDefinitionList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const PropertyDefinitionList_b = bfun(PropertyDefinitionList);

// PropertyDefinition_colon

function PropertyDefinition_colon(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                  // 6 = start
            PropertyName,         // 5 = name
            whitespace,           // 4
            punctuator(":"),      // 3
            whitespace,           // 2
            AssignmentExpression, // 1 = init
            pos,                  // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ColonPropertyDefinition",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const PropertyDefinition_colon_b = bfun(PropertyDefinition_colon);

// PropertyDefinition

function PropertyDefinition(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(PropertyDefinition_colon),
        bfun(CoverInitializedName),
        bfun(MethodDefinition),
        bfun(IdentifierReference),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const PropertyDefinition_b = bfun(PropertyDefinition);

// PropertyName

function PropertyName(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(LiteralPropertyName),
        bfun(ComputedPropertyName),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const PropertyName_b = bfun(PropertyName);

// LiteralPropertyName

function LiteralPropertyName(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(IdentifierName),
        bfun(StringLiteral),
        bfun(NumericLiteral),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const LiteralPropertyName_b = bfun(LiteralPropertyName);

// ComputedPropertyName

function ComputedPropertyName(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                  // 6 = start
            punctuator("["),      // 5
            whitespace,           // 4
            AssignmentExpression, // 3 = expr
            whitespace,           // 2
            punctuator("]"),      // 1
            pos,                  // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ComputedPropertyName",[3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ComputedPropertyName_b = bfun(ComputedPropertyName);

// CoverInitializedName

function CoverInitializedName(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                 // 4 = start
            IdentifierReference, // 3 = ident
            whitespace,          // 2
            Initializer,         // 1 = init
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"CoverInitializedName",[3,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CoverInitializedName_b = bfun(CoverInitializedName);

// Initializer

function Initializer(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            punctuator("="),
            whitespace,
            AssignmentExpression,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const Initializer_b = bfun(Initializer);

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
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,              // 6 = start
            keyword("new"),   // 5
            whitespace,       // 4
            MemberExpression, // 3 = expr
            whitespace,       // 2
            Arguments,        // 1 = args
            pos,              // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NewExpression",[3,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const MemberExpression_new_b = bfun(MemberExpression_new);

// MemberExpression_start

function MemberExpression_start(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(PrimaryExpression),
        bfun(SuperProperty),
        bfun(MetaProperty),
        bfun(MemberExpression_new),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const MemberExpression_start_b = bfun(MemberExpression_start);

// MemberExpression

function MemberExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(9);
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
                b.assertLengthIs(8);
                b.popAboveAndSet(6,makeNode(b,7,1,"MemberAccessIdent",[6,2]));
            },
        ]);
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const MemberExpression_b = bfun(MemberExpression);

// SuperProperty

function SuperProperty(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(9);
                b.popAboveAndSet(8,makeNode(b,8,0,"SuperPropertyExpr",[3]));
                b.assertLengthIs(1);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"SuperPropertyIdent",[1]));
                b.assertLengthIs(1);
            }
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const SuperProperty_b = bfun(SuperProperty);

// MetaProperty

function MetaProperty(p: Parser): ASTNode {
    return NewTarget(p);
}

const MetaProperty_b = bfun(MetaProperty);

// NewTarget

function NewTarget(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                  // 6
            keyword("new"),       // 5
            whitespace,           // 4
            punctuator("."),      // 3
            whitespace,           // 2
            identifier("target"), // 1 ("target" is not a reserved word, so we can't use keyword here)
            pos,                  // 0
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NewTarget",[]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const NewTarget_b = bfun(NewTarget);

// NewExpression

function NewExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(5);
                const start = checkNumber(b.get(4));
                const end = checkNumber(b.get(0));
                const expr = checkNode(b.get(1));
                b.popAboveAndSet(4,new GenericNode(new Range(start,p.pos),"NewExpression",[expr,null]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const NewExpression_b = bfun(NewExpression);

// CallExpression_start

function CallExpression_start(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Call",[3,1]));
            },
        ])
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CallExpression_start_b = bfun(CallExpression_start);

// CallExpression

function CallExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitem(pos);
        b.pitem(CallExpression_start);
        b.brepeatChoice([
            () => {
                b.pitems([
                    whitespace,      // 2
                    Arguments,       // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(5);
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
                b.assertLengthIs(9);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"MemberAccessIdent",[5,1]));
            },
            // () => {
            //     // TODO
            //     left = TemplateLiteral(p);
            // },
        ]);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CallExpression_b = bfun(CallExpression);

// SuperCall

function SuperCall(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,              // 4 = start
            keyword("super"), // 3
            whitespace,       // 2
            Arguments,        // 1 = args
            pos,              // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"SuperCall",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const SuperCall_b = bfun(SuperCall);

// Arguments

function Arguments(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(6);
                const start = checkNumber(b.get(5));
                const end = checkNumber(b.get(0));
                const listpos = checkNumber(b.get(2));
                const args = new ListNode(new Range(listpos,listpos),[]);
                b.popAboveAndSet(5,new GenericNode(new Range(start,p.pos),"Arguments",[args]));
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"Arguments",[3]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const Arguments_b = bfun(Arguments);

// ArgumentList_item

function ArgumentList_item(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.bchoice([
            () => {
                b.pitems([
                    pos,                  // 4 = start
                    punctuator("..."),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = expr
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
            },
            () => {
                b.pitem(AssignmentExpression);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ArgumentList_item_b = bfun(ArgumentList_item);

// ArgumentList

function ArgumentList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ArgumentList_b = bfun(ArgumentList);

// LeftHandSideExpression

function LeftHandSideExpression(p: Parser): ASTNode {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    const b = new Builder(p);
    b.bchoice([
        bfun(CallExpression),
        bfun(NewExpression),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const LeftHandSideExpression_b = bfun(LeftHandSideExpression);

// Section 12.4

// PostfixExpression

function PostfixExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitem(pos);
        b.pitem(LeftHandSideExpression);
        b.bchoice([
            () => {
                b.pitems([
                    whitespaceNoNewline,
                    punctuator("++"),
                    pos,
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PostIncrement",[3]));
            },
            () => {
                b.pitems([
                    whitespaceNoNewline,
                    punctuator("--"),
                    pos,
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PostDecrement",[3]));
            },
            () => {
                b.popAboveAndSet(1,b.get(0));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const PostfixExpression_b = bfun(PostfixExpression);

// Section 12.5

// UnaryExpression

function UnaryExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.bchoice([
            () => {
                b.pitems([
                    pos,               // 4 = start
                    keyword("delete"), // 3
                    whitespace,        // 2
                    UnaryExpression,   // 1 = expr
                    pos,               // 0 = end
                ]);
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryLogicalNot",[1]));
            },
            () => {
                b.pitem(PostfixExpression);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const UnaryExpression_b = bfun(UnaryExpression);

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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

        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const MultiplicativeExpression_b = bfun(MultiplicativeExpression);

// Section 12.7

// AdditiveExpression

function AdditiveExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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

        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const AdditiveExpression_b = bfun(AdditiveExpression);

// Section 12.8

// ShiftExpression

function ShiftExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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

        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ShiftExpression_b = bfun(ShiftExpression);

// Section 12.9

// RelationalExpression

function RelationalExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessEqual",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,       // 4
                    punctuator(">="), // 3
                    whitespace,       // 2
                    ShiftExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"GreaterEqual",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    punctuator("<"), // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessThan",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    punctuator(">"), // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"GreaterThan",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,            // 4
                    keyword("instanceof"), // 3
                    whitespace,            // 2
                    ShiftExpression,       // 1 = right
                    pos,                   // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"InstanceOf",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,      // 4
                    keyword("in"),   // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"In",[5,1]));
                b.assertLengthIs(2);
            },
        ]);
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const RelationalExpression_b = bfun(RelationalExpression);

// Section 12.10

// EqualityExpression

function EqualityExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictEquals",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("!=="),    // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictNotEquals",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("=="),     // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"AbstractEquals",[5,1]));
                b.assertLengthIs(2);
            },
            () => {
                b.pitems([
                    whitespace,           // 4
                    punctuator("!="),     // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(5,makeNode(b,6,0,"AbstractNotEquals",[5,1]));
                b.assertLengthIs(2);
            },
        ]);
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const EqualityExpression_b = bfun(EqualityExpression);

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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

        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BitwiseANDExpression_b = bfun(BitwiseANDExpression);

// BitwiseXORExpression

function BitwiseXORExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BitwiseXORExpression_b = bfun(BitwiseXORExpression);

// BitwiseORExpression

function BitwiseORExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BitwiseORExpression_b = bfun(BitwiseORExpression);

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const LogicalANDExpression_b = bfun(LogicalANDExpression);

// LogicalORExpression

function LogicalORExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const LogicalORExpression_b = bfun(LogicalORExpression);

// Section 12.13

// ConditionalExpression

function ConditionalExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ConditionalExpression_b = bfun(ConditionalExpression);

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const AssignmentExpression_plain_b = bfun(AssignmentExpression_plain);

// AssignmentExpression

function AssignmentExpression(p: Parser): ASTNode {
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    const b = new Builder(p);
    b.bchoice([
        bfun(ArrowFunction),
        bfun(AssignmentExpression_plain),
        bfun(ConditionalExpression),
        bfun(YieldExpression),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const AssignmentExpression_b = bfun(AssignmentExpression);

// Section 12.15

// Expression

function Expression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const Expression_b = bfun(Expression);

// Section 13

// Statement

function Statement(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(BlockStatement),
        bfun(VariableStatement),
        bfun(EmptyStatement),
        bfun(ExpressionStatement),
        bfun(IfStatement),
        bfun(BreakableStatement),
        bfun(ContinueStatement),
        bfun(BreakStatement),
        bfun(ReturnStatement),
        bfun(WithStatement),
        bfun(LabelledStatement),
        bfun(ThrowStatement),
        bfun(TryStatement),
        bfun(DebuggerStatement),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const Statement_b = bfun(Statement);

// Declaration

function Declaration(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(HoistableDeclaration),
        bfun(ClassDeclaration),
        bfun(LexicalDeclaration),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const Declaration_b = bfun(Declaration);

// HoistableDeclaration

function HoistableDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(() => FunctionDeclaration(p,flags)),
        bfun(() => GeneratorDeclaration(p,flags)),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const HoistableDeclaration_b = bfun(HoistableDeclaration);

// BreakableStatement

function BreakableStatement(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(IterationStatement),
        bfun(SwitchStatement),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const BreakableStatement_b = bfun(BreakableStatement);

// Section 13.2

// BlockStatement

function BlockStatement(p: Parser): ASTNode {
    return Block(p);
}

const BlockStatement_b = bfun(BlockStatement);

// Block

function Block(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const Block_b = bfun(Block);

// StatementList

function StatementList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const StatementList_b = bfun(StatementList);

// StatementListItem

function StatementListItem(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(Statement),
        bfun(Declaration),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const StatementListItem_b = bfun(StatementListItem);

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const LexicalDeclaration_b = bfun(LexicalDeclaration);

// BindingList

function BindingList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BindingList_b = bfun(BindingList);

// LexicalBinding_identifier

function LexicalBinding_identifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitem(pos);               // 3 = start
        b.pitem(BindingIdentifier); // 2 = identifier
        b.bopt(() => {              // 1 = initializer
            b.pitem(whitespace);
            b.pitem(Initializer);
            b.popAboveAndSet(1,b.get(0));
        });
        b.pitem(pos);               // 0 = end
        b.assertLengthIs(4);
        b.popAboveAndSet(3,makeNode(b,3,0,"LexicalIdentifierBinding",[2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const LexicalBinding_identifier_b = bfun(LexicalBinding_identifier);

// LexicalBinding_pattern

function LexicalBinding_pattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,            // 4 = start
            BindingPattern, // 3 = pattern
            whitespace,     // 2
            Initializer,    // 1 = initializer
            pos,            // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"LexicalPatternBinding",[3,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const LexicalBinding_pattern_b = bfun(LexicalBinding_pattern);

// LexicalBinding

function LexicalBinding(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(LexicalBinding_identifier),
        bfun(LexicalBinding_pattern),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const LexicalBinding_b = bfun(LexicalBinding);

// Section 13.3.2

// VariableStatement

function VariableStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const VariableStatement_b = bfun(VariableStatement);

// VariableDeclarationList

function VariableDeclarationList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const VariableDeclarationList_b = bfun(VariableDeclarationList);

// VariableDeclaration_identifier

function VariableDeclaration_identifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitem(pos);
        b.pitem(BindingIdentifier);
        b.bchoice([
            () => {
                b.pitems([
                    whitespace,
                    Initializer,
                    pos,
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarIdentifier",[3,1]));
            },
            () => {
                b.pitem(value(null));
                b.pitem(pos);
                b.assertLengthIs(4);
                b.popAboveAndSet(3,makeNode(b,3,0,"VarIdentifier",[2,1]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const VariableDeclaration_identifier_b = bfun(VariableDeclaration_identifier);

// VariableDeclaration_pattern

function VariableDeclaration_pattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,            // 4 = start
            BindingPattern, // 3 = pattern
            whitespace,     // 2
            Initializer,    // 1 = initializer
            pos,            // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"VarPattern",[3,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const VariableDeclaration_pattern_b = bfun(VariableDeclaration_pattern);

// VariableDeclaration

function VariableDeclaration(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(VariableDeclaration_identifier),
        bfun(VariableDeclaration_pattern),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const VariableDeclaration_b = bfun(VariableDeclaration);

// Section 13.3.3

// BindingPattern

function BindingPattern(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(ObjectBindingPattern),
        bfun(ArrayBindingPattern),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const BindingPattern_b = bfun(BindingPattern);

// ObjectBindingPattern

function ObjectBindingPattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.push(new ListNode(new Range(p.pos,p.pos),[]));
            },
        ]);
        b.pitem(punctuator("}"));  // 1
        b.pitem(pos);              // 0 = end
        b.assertLengthIs(7);
        const start = checkNumber(b.get(6));
        const end = checkNumber(b.get(0));
        b.popAboveAndSet(6,b.get(2));
        b.assertLengthIs(1);
        const properties = checkListNode(b.get(0));
        return new GenericNode(new Range(start,end),"ObjectBindingPattern",[properties]);
    });
}

const ObjectBindingPattern_b = bfun(ObjectBindingPattern);

// ArrayBindingPattern

function ArrayBindingPattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(8);
        b.popAboveAndSet(7,makeNode(b,7,0,"ArrayBindingPattern",[4,2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ArrayBindingPattern_b = bfun(ArrayBindingPattern);

// BindingPropertyList

function BindingPropertyList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BindingPropertyList_b = bfun(BindingPropertyList);

// BindingElementList

function BindingElementList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BindingElementList_b = bfun(BindingElementList);

// BindingProperty

function BindingProperty(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BindingProperty",[5,1]));
            },
            () => {
                // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
                // and PropertyName will match an identifier at the start of a colon binding
                b.pitem(SingleNameBinding);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BindingProperty_b = bfun(BindingProperty);

// BindingElement

function BindingElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                        b.assertLengthIs(5);
                        b.popAboveAndSet(4,makeNode(b,4,0,"BindingPatternInit",[3,1]));
                    },
                    () => {
                        b.popAboveAndSet(1,b.get(0));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BindingElement_b = bfun(BindingElement);

// SingleNameBinding

function SingleNameBinding(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const SingleNameBinding_b = bfun(SingleNameBinding);

// BindingRestElement

function BindingRestElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,               // 4 = start
            punctuator("..."), // 3
            whitespace,        // 2
            BindingIdentifier, // 1 = ident
            pos,               // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"BindingRestElement",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BindingRestElement_b = bfun(BindingRestElement);

// Section 13.4

// EmptyStatement

function EmptyStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            punctuator(";"),
            pos,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,makeNode(b,2,0,"EmptyStatement",[]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const EmptyStatement_b = bfun(EmptyStatement);

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

    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,             // 4 = start
            Expression,      // 3 = expr
            whitespace,      // 2
            punctuator(";"), // 1
            pos,             // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"ExpressionStatement",[3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ExpressionStatement_b = bfun(ExpressionStatement);

// Section 13.6

// IfStatement

function IfStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(12);
        b.popAboveAndSet(11,makeNode(b,11,0,"IfStatement",[6,2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const IfStatement_b = bfun(IfStatement);

// Section 13.7

// IterationStatement_do

function IterationStatement_do(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"DoStatement",[11,5]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const IterationStatement_do_b = bfun(IterationStatement_do);

// IterationStatement_while

function IterationStatement_while(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WhileStatement",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const IterationStatement_while_b = bfun(IterationStatement_while);

// IterationStatement_for_c

function IterationStatement_for_c(p: Parser): ASTNode {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                                                            // 14 = start
            keyword("for"),                                                 // 13
            whitespace,                                                     // 12
            punctuator("("),                                                // 11
            whitespace,                                                     // 10
        ]);
        b.assertLengthIs(5);
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
        b.assertLengthIs(6);
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
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForC",[9,8,4,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const IterationStatement_for_c_b = bfun(IterationStatement_for_c);

// IterationStatement_for_in

function IterationStatement_for_in(p: Parser): ASTNode {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(5);
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
        b.assertLengthIs(6);
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
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForIn",[9,5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const IterationStatement_for_in_b = bfun(IterationStatement_for_in);

// IterationStatement_for_of

function IterationStatement_for_of(p: Parser): ASTNode {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(5);
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
        b.assertLengthIs(6);
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
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForOf",[9,5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const IterationStatement_for_of_b = bfun(IterationStatement_for_of);

// IterationStatement_for

function IterationStatement_for(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(IterationStatement_for_c),
        bfun(IterationStatement_for_in),
        bfun(IterationStatement_for_of),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const IterationStatement_for_b = bfun(IterationStatement_for);

// IterationStatement

function IterationStatement(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(IterationStatement_do),
        bfun(IterationStatement_while),
        bfun(IterationStatement_for),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const IterationStatement_b = bfun(IterationStatement);

// ForDeclaration

function ForDeclaration(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.bchoice([
            () => {
                b.pitems([
                    pos,              // 4 = start
                    keyword("let"),   // 3
                    whitespace,       // 2
                    ForBinding,       // 1 = binding
                    pos,              // 0 = end
                ]);
                b.assertLengthIs(5);
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
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ConstForDeclaration",[1]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ForDeclaration_b = bfun(ForDeclaration);

// ForBinding

function ForBinding(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(BindingIdentifier),
        bfun(BindingPattern), // FIXME: Need test cases for this
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const ForBinding_b = bfun(ForBinding);

// Section 13.8

// ContinueStatement

function ContinueStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(6);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ContinueStatement",[3]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ContinueStatement_b = bfun(ContinueStatement);

// Section 13.9

// BreakStatement

function BreakStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(6);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BreakStatement",[3]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const BreakStatement_b = bfun(BreakStatement);

// Section 13.10

// ReturnStatement

function ReturnStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(6);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ReturnStatement",[3]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ReturnStatement_b = bfun(ReturnStatement);

// Section 13.11

// WithStatement

function WithStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WithStatement",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const WithStatement_b = bfun(WithStatement);

// Section 13.12

// SwitchStatement

function SwitchStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(11);
        b.popAboveAndSet(10,makeNode(b,10,0,"SwitchStatement",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const SwitchStatement_b = bfun(SwitchStatement);

// CaseBlock_1

function CaseBlock_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(8);
        b.popAboveAndSet(7,makeNode(b,7,0,"CaseBlock1",[3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CaseBlock_1_b = bfun(CaseBlock_1);

// CaseBlock_2

function CaseBlock_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(11);
        b.popAboveAndSet(10,makeNode(b,10,0,"CaseBlock2",[7,5,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CaseBlock_2_b = bfun(CaseBlock_2);

// CaseBlock

function CaseBlock(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(CaseBlock_1),
        bfun(CaseBlock_2),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const CaseBlock_b = bfun(CaseBlock);

// CaseClauses

function CaseClauses(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CaseClauses_b = bfun(CaseClauses);

// CaseClause

function CaseClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(9);
        b.popAboveAndSet(8,makeNode(b,8,0,"CaseClause",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const CaseClause_b = bfun(CaseClause);

// DefaultClause

function DefaultClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                // 6 = start
            keyword("default"), // 5
            whitespace,         // 4
            punctuator(":"),    // 3
            whitespace,         // 2
            StatementList,      // 1 = statements
            whitespace,         // 0
        ]);
        b.assertLengthIs(7);
        const start = checkNumber(b.get(6));
        const statements = checkNode(b.get(1));
        const end = statements.range.end;
        b.popAboveAndSet(6,new GenericNode(new Range(start,end),"DefaultClause",[statements]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const DefaultClause_b = bfun(DefaultClause);

// Section 13.13

// LabelledStatement

function LabelledStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,             // 6 = start
            LabelIdentifier, // 5 = ident
            whitespace,      // 4
            punctuator(":"), // 3
            whitespace,      // 2
            LabelledItem,    // 1 = item
            pos,             // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"LabelledStatement",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const LabelledStatement_b = bfun(LabelledStatement);

// LabelledItem

function LabelledItem(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(Statement),
        bfun(FunctionDeclaration),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const LabelledItem_b = bfun(LabelledItem);

// Section 13.14

// ThrowStatement

function ThrowStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                 // 6 = start
            keyword("throw"),    // 5
            whitespaceNoNewline, // 4
            Expression,          // 3 = expr
            whitespace,          // 2
            punctuator(";"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ThrowStatement",[3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ThrowStatement_b = bfun(ThrowStatement);

// Section 13.15

// TryStatement

function TryStatement(p: Parser): ASTNode {
    return p.attempt((start) => {
        const b = new Builder(p);
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
        b.assertLengthIs(8);
        b.popAboveAndSet(7,makeNode(b,7,0,"TryStatement",[4,2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const TryStatement_b = bfun(TryStatement);

// Catch

function Catch(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(11);
        b.popAboveAndSet(10,makeNode(b,10,0,"Catch",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const Catch_b = bfun(Catch);

// Finally

function Finally(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                // 4
            keyword("finally"), // 3
            whitespace,         // 2
            Block,              // 1
            pos,                // 0
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"Finally",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const Finally_b = bfun(Finally);

// CatchParameter

function CatchParameter(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(BindingIdentifier),
        bfun(BindingPattern),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const CatchParameter_b = bfun(CatchParameter);

// Section 13.16

// DebuggerStatement

function DebuggerStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                 // 4
            keyword("debugger"), // 3
            whitespace,          // 2
            punctuator(";"),     // 1
            pos,                 // 0
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"DebuggerStatement",[]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const DebuggerStatement_b = bfun(DebuggerStatement);

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(17);
        b.popAboveAndSet(16,makeNode(b,16,0,"FunctionDeclaration",[13,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FunctionDeclaration_named_b = bfun(FunctionDeclaration_named);

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionDeclaration",[10,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FunctionDeclaration_unnamed_b = bfun(FunctionDeclaration_unnamed);

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

function FunctionExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionExpression",[12,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FunctionExpression_b = bfun(FunctionExpression);

// StrictFormalParameters

function StrictFormalParameters(p: Parser): ASTNode {
    return FormalParameters(p);
}

const StrictFormalParameters_b = bfun(StrictFormalParameters);

// FormalParameters

function FormalParameters(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.bchoice([
            () => {
                b.pitem(FormalParameterList);
            },
            () => {
                b.pitem(pos);
                b.popAboveAndSet(0,makeNode(b,0,0,"FormalParameters1",[]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FormalParameters_b = bfun(FormalParameters);

// FormalParameterList

function FormalParameterList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.bchoice([
            () => {
                b.pitems([
                    pos,                   // 2 = start
                    FunctionRestParameter, // 1 = rest
                    pos,                   // 0 = end
                ]);
                b.assertLengthIs(3);
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
                        b.assertLengthIs(7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"FormalParameters4",[5,1]));
                    },
                    () => {
                        b.pitem(pos);
                        b.assertLengthIs(3);
                        b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters3",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FormalParameterList_b = bfun(FormalParameterList);

// FormalsList

function FormalsList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FormalsList_b = bfun(FormalsList);

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

function FunctionStatementList(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(StatementList),
        bfun(() => new ListNode(new Range(p.pos,p.pos),[])),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const FunctionStatementList_b = bfun(FunctionStatementList);

// Section 14.2

// ArrowFunction

function ArrowFunction(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                 // 6 = start
            ArrowParameters,     // 5 = params
            whitespaceNoNewline, // 4
            punctuator("=>"),    // 3
            whitespace,          // 2
            ConciseBody,         // 1 = body
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ArrowFunction",[5,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ArrowFunction_b = bfun(ArrowFunction);

// ArrowParameters

function ArrowParameters(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(BindingIdentifier),
        bfun(ArrowFormalParameters),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const ArrowParameters_b = bfun(ArrowParameters);

// ConciseBody_1

function ConciseBody_1(p: Parser): ASTNode {
    if (p.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    return AssignmentExpression(p);
}

const ConciseBody_1_b = bfun(ConciseBody_1);

// ConciseBody_2

function ConciseBody_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            punctuator("{"), // 4
            whitespace,      // 3
            FunctionBody,    // 2
            whitespace,      // 1
            punctuator("}"), // 0
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ConciseBody_2_b = bfun(ConciseBody_2);

// ConciseBody

function ConciseBody(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(ConciseBody_1),
        bfun(ConciseBody_2),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const ConciseBody_b = bfun(ConciseBody);

// ArrowFormalParameters

function ArrowFormalParameters(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            punctuator("("),        // 4
            whitespace,             // 3
            StrictFormalParameters, // 2
            whitespace,             // 1
            punctuator(")"),        // 0
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ArrowFormalParameters_b = bfun(ArrowFormalParameters);

// Section 14.3

// MethodDefinition_1

function MethodDefinition_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Method",[13,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const MethodDefinition_1_b = bfun(MethodDefinition_1);

// MethodDefinition_2

function MethodDefinition_2(p: Parser): ASTNode {
    return GeneratorMethod(p);
}

const MethodDefinition_2_b = bfun(MethodDefinition_2);

// MethodDefinition_3

function MethodDefinition_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Getter",[11,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const MethodDefinition_3_b = bfun(MethodDefinition_3);

// MethodDefinition_4

function MethodDefinition_4(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(17);
        b.popAboveAndSet(16,makeNode(b,16,0,"Setter",[13,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const MethodDefinition_4_b = bfun(MethodDefinition_4);

// MethodDefinition

function MethodDefinition(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(MethodDefinition_1),
        bfun(MethodDefinition_2),
        bfun(MethodDefinition_3),
        bfun(MethodDefinition_4),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const MethodDefinition_b = bfun(MethodDefinition);

// PropertySetParameterList

function PropertySetParameterList(p: Parser): ASTNode {
    return FormalParameter(p);
}

const PropertySetParameterList_b = bfun(PropertySetParameterList);

// Section 14.4

// GeneratorMethod

function GeneratorMethod(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(17);
        b.popAboveAndSet(16,makeNode(b,16,0,"GeneratorMethod",[13,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const GeneratorMethod_b = bfun(GeneratorMethod);

// GeneratorDeclaration_1

function GeneratorDeclaration_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(19);
        b.popAboveAndSet(18,makeNode(b,18,0,"GeneratorDeclaration",[13,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const GeneratorDeclaration_1_b = bfun(GeneratorDeclaration_1);

// GeneratorDeclaration_2

function GeneratorDeclaration_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(17);
        // FIXME: Should be DefaultGeneratorDeclaration
        b.popAboveAndSet(16,makeNode(b,16,0,"DefaultGeneratorDeclaration",[9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const GeneratorDeclaration_2_b = bfun(GeneratorDeclaration_2);

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

function GeneratorExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(18);
        b.popAboveAndSet(17,makeNode(b,17,0,"GeneratorExpression",[12,9,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const GeneratorExpression_b = bfun(GeneratorExpression);

// GeneratorBody

function GeneratorBody(p: Parser): ASTNode {
    return FunctionBody(p);
}

const GeneratorBody_b = bfun(GeneratorBody);

// YieldExpression_1

function YieldExpression_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                  // 6
            keyword("yield"),     // 5
            whitespaceNoNewline,  // 4
            punctuator("*"),      // 3
            whitespace,           // 2
            AssignmentExpression, // 1
            pos,                  // 0
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"YieldStar",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const YieldExpression_1_b = bfun(YieldExpression_1);

// YieldExpression_2

function YieldExpression_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                  // 4
            keyword("yield"),     // 3
            whitespaceNoNewline,  // 2
            AssignmentExpression, // 1
            pos,                  // 0
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"YieldExpr",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const YieldExpression_2_b = bfun(YieldExpression_2);

// YieldExpression_3

function YieldExpression_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            keyword("yield"),
            pos,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,makeNode(b,2,0,"YieldNothing",[]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const YieldExpression_3_b = bfun(YieldExpression_3);

// YieldExpression

function YieldExpression(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(YieldExpression_1),
        bfun(YieldExpression_2),
        bfun(YieldExpression_3),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const YieldExpression_b = bfun(YieldExpression);

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,               // 6 = start
            keyword("class"),  // 5
            whitespace,        // 4
            BindingIdentifier, // 3 = ident
            whitespace,        // 2
            ClassTail,         // 1 = tail
            pos,               // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassDeclaration",[3,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassDeclaration_1_b = bfun(ClassDeclaration_1);

// ClassDeclaration_2

function ClassDeclaration_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,              // 5
            keyword("class"), // 4
            whitespace,       // 3
            value(null),      // 2
            ClassTail,        // 1
            pos,              // 0
        ]);
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassDeclaration",[2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassDeclaration_2_b = bfun(ClassDeclaration_2);

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

function ClassExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassExpression",[2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassExpression_b = bfun(ClassExpression);

// ClassTail

function ClassTail(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassTail",[5,2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassTail_b = bfun(ClassTail);

// ClassHeritage

function ClassHeritage(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,                    // 4 = start
            keyword("extends"),     // 3
            whitespace,             // 2
            LeftHandSideExpression, // 1 = expr
            pos,                    // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"Extends",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassHeritage_b = bfun(ClassHeritage);

// ClassBody

function ClassBody(p: Parser): ASTNode {
    return ClassElementList(p);
}

const ClassBody_b = bfun(ClassBody);

// ClassElementList

function ClassElementList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassElementList_b = bfun(ClassElementList);

// ClassElement_1

function ClassElement_1(p: Parser): ASTNode {
    return MethodDefinition(p);
}

const ClassElement_1_b = bfun(ClassElement_1);

// ClassElement_2

function ClassElement_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            keyword("static"),
            whitespace,
            MethodDefinition,
            pos,
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"StaticMethodDefinition",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassElement_2_b = bfun(ClassElement_2);

// ClassElement_3

function ClassElement_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            punctuator(";"),
            pos,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,makeNode(b,2,0,"EmptyClassElement",[]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ClassElement_3_b = bfun(ClassElement_3);

// ClassElement

function ClassElement(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(ClassElement_1),
        bfun(ClassElement_2),
        bfun(ClassElement_3),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const ClassElement_b = bfun(ClassElement);

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

function ModuleItemList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ModuleItemList_b = bfun(ModuleItemList);

// ModuleItem

function ModuleItem(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(ImportDeclaration),
        bfun(ExportDeclaration),
        bfun(StatementListItem),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const ModuleItem_b = bfun(ModuleItem);

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(9);
        b.popAboveAndSet(8,makeNode(b,8,0,"ImportFrom",[5,3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ImportDeclaration_from_b = bfun(ImportDeclaration_from);

// ImportDeclaration_module

function ImportDeclaration_module(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,               // 6 = start
            keyword("import"), // 5
            whitespace,        // 4
            ModuleSpecifier,   // 3 = specifier
            whitespace,        // 2
            punctuator(";"),   // 1
            pos,               // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ImportModule",[3]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ImportDeclaration_module_b = bfun(ImportDeclaration_module);

// ImportDeclaration

function ImportDeclaration(p: Parser): ASTNode {
    const b = new Builder(p);
    b.bchoice([
        bfun(ImportDeclaration_from),
        bfun(ImportDeclaration_module),
    ]);
    b.assertLengthIs(1);
    return checkNode(b.get(0));
}

const ImportDeclaration_b = bfun(ImportDeclaration);

// ImportClause

function ImportClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                        b.assertLengthIs(7);
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
                        b.assertLengthIs(7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"DefaultAndNamedImports",[5,1]));
                    },
                    () => {
                        b.pitem(pos);
                        b.popAboveAndSet(2,makeNode(b,2,0,"DefaultImport",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ImportClause_b = bfun(ImportClause);

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): ASTNode {
    return ImportedBinding(p);
}

const ImportedDefaultBinding_b = bfun(ImportedDefaultBinding);

// NameSpaceImport

function NameSpaceImport(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,             // 6 = start
            punctuator("*"), // 5
            whitespace,      // 4
            keyword("as"),   // 3
            whitespace,      // 2
            ImportedBinding, // 1 = binding
            pos,             // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NameSpaceImport",[1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const NameSpaceImport_b = bfun(NameSpaceImport);

// NamedImports

function NamedImports(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(6);
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(p.pos,p.pos),[]));
            },
        ]);
        b.pitems([
            punctuator("}"),    // 1
            pos,                // 0 = end
        ]);
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"NamedImports",[2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const NamedImports_b = bfun(NamedImports);

// FromClause

function FromClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            keyword("from"),
            whitespace,
            ModuleSpecifier,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const FromClause_b = bfun(FromClause);

// ImportsList

function ImportsList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ImportsList_b = bfun(ImportsList);

// ImportSpecifier

function ImportSpecifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ImportAsSpecifier",[5,1]));
            },
            () => {
                b.pitems([
                    pos,             // 2 = start
                    ImportedBinding, // 1 = binding
                    pos,             // 0 = end
                ]);
                b.assertLengthIs(3);
                b.popAboveAndSet(2,makeNode(b,2,0,"ImportSpecifier",[1]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ImportSpecifier_b = bfun(ImportSpecifier);

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

function ExportDeclaration(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.pitems([
            pos,
            keyword("export"),
            whitespace,
        ]);
        b.assertLengthIs(3);
        b.bchoice([
            () => {
                b.pitems([
                    keyword("default"),                              // 3
                    whitespace,                                      // 2
                    () => HoistableDeclaration(p,{ Default: true }), // 1
                    pos,                                             // 0
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.pitems([
                    keyword("default"), // 3
                    whitespace, // 2
                    () => ClassDeclaration(p,{ Default: true }), // 1
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
                b.assertLengthIs(11);
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
                b.assertLengthIs(9);
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
                b.assertLengthIs(9);
                b.popAboveAndSet(8,makeNode(b,8,0,"ExportFrom",[5,3]));
            },
            () => {
                b.pitems([
                    ExportClause,    // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportPlain",[3]));
            },
            () => {
                b.pitems([
                    VariableStatement, // 1
                    pos,               // 0
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportVariable",[1]));
            },
            () => {
                b.pitems([
                    Declaration, // 1
                    pos,         // 0
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportDeclaration",[1]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ExportDeclaration_b = bfun(ExportDeclaration);

// ExportClause

function ExportClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(6);
                b.popAboveAndSet(2,b.get(2));
                b.assertLengthIs(4);
            },
            () => {
                b.pitem(pos);
                const curPos = checkNumber(b.get(0));
                b.popAboveAndSet(0,new ListNode(new Range(curPos,curPos),[]));
            },
        ]);
        b.assertLengthIs(4);
        b.pitems([
            punctuator("}"),           // 1
            pos,                       // 0
        ]);
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ExportClause",[2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ExportClause_b = bfun(ExportClause);

// ExportsList

function ExportsList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ExportsList_b = bfun(ExportsList);

// ExportSpecifier

function ExportSpecifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
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
                b.assertLengthIs(7);
                b.popAboveAndSet(4,makeNode(b,6,0,"ExportAsSpecifier",[5,1]));
                b.assertLengthIs(3);
            },
            () => {
                b.pitem(pos);
                b.assertLengthIs(3);
                b.popAboveAndSet(0,makeNode(b,2,0,"ExportNormalSpecifier",[1]));
            },
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

const ExportSpecifier_b = bfun(ExportSpecifier);
