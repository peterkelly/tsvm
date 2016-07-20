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
    opt_b,
    pos,
    pos_b,
    value,
    value_b,
    keyword,
    keyword_b,
    punctuator,
    punctuator_b,
    notKeyword,
    notKeyword_b,
    notPunctuator,
    notPunctuator_b,
    identifier,
    identifier_b,
    whitespace,
    whitespace_b,
    whitespaceNoNewline,
    whitespaceNoNewline_b,
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

function IdentifierReference_b(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier_b);
    b.assertLengthIs(oldLength+1);
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.popAboveAndSet(0,new IdentifierReferenceNode(ident.range,ident.value));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// BindingIdentifier

function BindingIdentifier_b(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier_b);
    b.assertLengthIs(oldLength+1);
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.popAboveAndSet(0,new BindingIdentifierNode(ident.range,ident.value));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// LabelIdentifier

function LabelIdentifier_b(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier_b);
    b.assertLengthIs(oldLength+1);
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.popAboveAndSet(0,new LabelIdentifierNode(ident.range,ident.value));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// IdentifierName

function IdentifierName_b(b: Builder): void {
    b.item(Identifier_b);
}

// Identifier

export function Identifier_b(b: Builder): void {
    b.attempt((): void => {
        const p = b.parser;
        const start = p.pos;
        const oldLength = b.length;
        if ((p.cur != null) && isIdStart(p.cur)) {
            p.next();
            while ((p.cur != null) && isIdChar(p.cur))
                p.next();
            const range = new Range(start,p.pos);
            const value = p.text.substring(range.start,range.end);
            if (isKeyword(value))
                throw new ParseError(p,p.pos,"Keyword "+JSON.stringify(value)+" used where identifier expected");
            b.push(new IdentifierNode(range,value));
            b.assertLengthIs(oldLength+1);
            checkNode(b.get(0));
        }
        else {
            throw new ParseError(p,p.pos,"Expected Identifier");
        }
    });
}

// Section 12.2

// This

function This_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            keyword_b("this"),
            pos_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"This",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// PrimaryExpression

function PrimaryExpression_b(b: Builder): void {
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
    checkNode(b.get(0));
}

// ParenthesizedExpression

function ParenthesizedExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            punctuator_b("("), // 4
            whitespace_b,      // 3
            Expression_b,      // 2 = expr
            whitespace_b,      // 1
            punctuator_b(")"), // 0
        ]);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.2.4

// Literal

function Literal_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        NullLiteral_b,
        BooleanLiteral_b,
        NumericLiteral_b,
        StringLiteral_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// NullLiteral

function NullLiteral_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            keyword_b("null"),
            pos_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"NullLiteral",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BooleanLiteral

function BooleanLiteral_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        () => {
            b.items([
                pos_b,
                keyword_b("true"),
                pos_b,
            ]);
            b.assertLengthIs(oldLength+3);
            const start = checkNumber(b.get(2));
            const end = checkNumber(b.get(0));
            b.popAboveAndSet(2,new BooleanLiteralNode(new Range(start,end),true));
        },
        () => {
            b.items([
                pos_b,
                keyword_b("false"),
                pos_b,
            ]);
            b.assertLengthIs(oldLength+3);
            const start = checkNumber(b.get(2));
            const end = checkNumber(b.get(0));
            b.popAboveAndSet(2,new BooleanLiteralNode(new Range(start,end),false));
        },
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// NumericLiteral

function NumericLiteral_b(b: Builder): void {
    // TODO: Complete numeric literal syntax according to spec
    b.attempt((): void => {
        const oldLength = b.length;
        const p = b.parser;
        const start = p.pos;
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
        b.push(new NumericLiteralNode(new Range(start,p.pos),value));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// StringLiteral

function StringLiteral_b(b: Builder): void {
    // TODO: Complete string literal syntax according to spec
    b.attempt((): void => {
        const oldLength = b.length;
        const p = b.parser;
        const start = p.pos;
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
            b.push(new StringLiteralNode(new Range(start,p.pos),value));
            b.assertLengthIs(oldLength+1);
            checkNode(b.get(0));
            return;
        }
        throw new ParseError(p,p.pos,"Invalid string");
    });
}

// Section 12.2.5

// ArrayLiteral

function ArrayLiteral_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        const start = b.parser.pos;
        b.item(pos_b);
        b.item(punctuator_b("["));
        b.item(whitespace_b);

        const elements: ASTNode[] = [];
        const listStart = b.parser.pos;
        let listEnd = b.parser.pos;

        b.assertLengthIs(oldLength+3);

        b.bopt(() => {
            b.item(pos_b);             // 3 = before
            b.item(punctuator_b(",")); // 2
            b.item(pos_b);             // 1 = after
            b.item(whitespace_b);      // 0
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
                        b.items([
                            pos_b,             // 3 = before
                            punctuator_b(","), // 2
                            pos_b,             // 1 = after
                            whitespace_b,      // 0
                        ]);
                        b.assertLengthIs(oldLength+8);
                        b.popAboveAndSet(3,makeNode(b,3,1,"Elision",[]));
                        b.assertLengthIs(oldLength+5);
                    },
                    () => {
                        b.item(AssignmentExpression_b);
                        b.item(whitespace_b);
                        b.bopt(() => {
                            b.item(punctuator_b(","));
                            b.item(whitespace_b);
                            b.pop();
                        });
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(2,checkNode(b.get(2)));
                        b.assertLengthIs(oldLength+5);
                    },
                    () => {
                        b.item(SpreadElement_b);
                        b.item(whitespace_b);
                        b.bopt(() => {
                            b.item(punctuator_b(","));
                            b.item(whitespace_b);
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

// SpreadElement

function SpreadElement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            punctuator_b("..."),
            whitespace_b,
            AssignmentExpression_b,
            pos_b,
        ]);
        b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);             // 5
        b.item(punctuator_b("{")); // 4
        b.item(whitespace_b);      // 3
        b.bchoice([               // 2 = properties
            () => {
                b.item(PropertyDefinitionList_b);
                b.item(whitespace_b);
                b.bopt(() => {
                    b.item(punctuator_b(","));
                    b.item(whitespace_b);
                    b.popAboveAndSet(1,0);
                });
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
            },
        ]);
        b.item(punctuator_b("}")); // 1
        b.item(pos_b);             // 0 = end
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ObjectLiteral",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// PropertyDefinitionList

function PropertyDefinitionList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(PropertyDefinition_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    PropertyDefinition_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// PropertyDefinition_colon

function PropertyDefinition_colon_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                  // 6 = start
            PropertyName_b,         // 5 = name
            whitespace_b,           // 4
            punctuator_b(":"),      // 3
            whitespace_b,           // 2
            AssignmentExpression_b, // 1 = init
            pos_b,                  // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ColonPropertyDefinition",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// ComputedPropertyName

function ComputedPropertyName_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                  // 6 = start
            punctuator_b("["),      // 5
            whitespace_b,           // 4
            AssignmentExpression_b, // 3 = expr
            whitespace_b,           // 2
            punctuator_b("]"),      // 1
            pos_b,                  // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ComputedPropertyName",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CoverInitializedName

function CoverInitializedName_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 4 = start
            IdentifierReference_b, // 3 = ident
            whitespace_b,          // 2
            Initializer_b,         // 1 = init
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"CoverInitializedName",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Initializer

function Initializer_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            punctuator_b("="),
            whitespace_b,
            AssignmentExpression_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
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

function MemberExpression_new_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,              // 6 = start
            keyword_b("new"),   // 5
            whitespace_b,       // 4
            MemberExpression_b, // 3 = expr
            whitespace_b,       // 2
            Arguments_b,        // 1 = args
            pos_b,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NewExpression",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// MemberExpression

function MemberExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);
        b.item(MemberExpression_start_b);
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,      // 6
                    punctuator_b("["), // 5
                    whitespace_b,      // 4
                    Expression_b,      // 3 = expr
                    whitespace_b,      // 2
                    punctuator_b("]"), // 1
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(7,makeNode(b,8,0,"MemberAccessExpr",[7,3]));
            },
            () => {
                b.items([
                    whitespace_b,      // 5
                    punctuator_b("."), // 4
                    whitespace_b,      // 3
                    IdentifierName_b,  // 2 = ident
                    pos_b,             // 1 = end
                    whitespace_b,      // 0
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

// SuperProperty

function SuperProperty_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,              // 8 = start
                    keyword_b("super"), // 7
                    whitespace_b,       // 6
                    punctuator_b("["),  // 5
                    whitespace_b,       // 4
                    Expression_b,       // 3 = expr
                    whitespace_b,       // 2
                    punctuator_b("]"),  // 1
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"SuperPropertyExpr",[3]));
                b.assertLengthIs(oldLength+1);
            },
            () => {
                b.items([
                    pos_b,              // 6 = start
                    keyword_b("super"), // 5
                    whitespace_b,       // 4
                    punctuator_b("."),  // 3
                    whitespace_b,       // 2
                    Identifier_b,       // 1 = ident
                    pos_b,              // 0 = end
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

// MetaProperty

function MetaProperty_b(b: Builder): void {
    b.item(NewTarget_b);
}

// NewTarget

function NewTarget_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                  // 6
            keyword_b("new"),       // 5
            whitespace_b,           // 4
            punctuator_b("."),      // 3
            whitespace_b,           // 2
            identifier_b("target"), // 1 ("target" is not a reserved word, so we can't use keyword here)
            pos_b,                  // 0
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NewTarget",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// NewExpression

function NewExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.item(MemberExpression_b);
            },
            () => {
                b.items([
                    pos_b,            // 4 = start
                    keyword_b("new"), // 3
                    whitespace_b,     // 2
                    NewExpression_b,  // 1 = expr
                    pos_b,            // 0 = end
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

// CallExpression_start

function CallExpression_start_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.item(SuperCall_b);
            },
            () => {
                b.items([
                    pos_b,              // 4 = start
                    MemberExpression_b, // 3 = fun
                    whitespace_b,       // 2
                    Arguments_b,        // 1 = args
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Call",[3,1]));
            },
        ])
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CallExpression

function CallExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);
        b.item(CallExpression_start_b);
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,      // 2
                    Arguments_b,       // 1
                    pos_b,             // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(3,makeNode(b,4,0,"Call",[3,1]));
            },
            () => {
                b.items([
                    whitespace_b,      // 6
                    punctuator_b("["), // 5
                    whitespace_b,      // 4
                    Expression_b,      // 3 = expr
                    whitespace_b,      // 2
                    punctuator_b("]"), // 1
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(7,makeNode(b,8,0,"MemberAccessExpr",[7,3]));
            },
            () => {
                b.items([
                    whitespace_b,      // 4
                    punctuator_b("."), // 3
                    whitespace_b,      // 2
                    IdentifierName_b,  // 1 = idname
                    pos_b,             // 0 = end
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

// SuperCall

function SuperCall_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,              // 4 = start
            keyword_b("super"), // 3
            whitespace_b,       // 2
            Arguments_b,        // 1 = args
            pos_b,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"SuperCall",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Arguments

function Arguments_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,             // 5 = start
                    punctuator_b("("), // 4
                    whitespace_b,      // 3
                    pos_b,             // 2 = listpos
                    punctuator_b(")"), // 1
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                const start = checkNumber(b.get(5));
                const end = checkNumber(b.get(0));
                const listpos = checkNumber(b.get(2));
                const args = new ListNode(new Range(listpos,listpos),[]);
                b.popAboveAndSet(5,new GenericNode(new Range(start,b.parser.pos),"Arguments",[args]));
            },
            () => {
                b.items([
                    pos_b,             // 6 = start
                    punctuator_b("("), // 5
                    whitespace_b,      // 4
                    ArgumentList_b,    // 3 = args
                    whitespace_b,      // 2
                    punctuator_b(")"), // 1
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"Arguments",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ArgumentList_item

function ArgumentList_item_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,                  // 4 = start
                    punctuator_b("..."),    // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = expr
                    pos_b,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
            },
            () => {
                b.item(AssignmentExpression_b);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ArgumentList

function ArgumentList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(ArgumentList_item_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    ArgumentList_item_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 12.4

// PostfixExpression

function PostfixExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);
        b.item(LeftHandSideExpression_b);
        b.bchoice([
            () => {
                b.items([
                    whitespaceNoNewline_b,
                    punctuator_b("++"),
                    pos_b,
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PostIncrement",[3]));
            },
            () => {
                b.items([
                    whitespaceNoNewline_b,
                    punctuator_b("--"),
                    pos_b,
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

// Section 12.5

// UnaryExpression

function UnaryExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,               // 4 = start
                    keyword_b("delete"), // 3
                    whitespace_b,        // 2
                    UnaryExpression_b,   // 1 = expr
                    pos_b,               // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Delete",[1]));
            },
            () => {
                b.items([
                    pos_b,             // 4 = start
                    keyword_b("void"), // 3
                    whitespace_b,      // 2
                    UnaryExpression_b, // 1 = expr
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Void",[1]));
            },
            () => {
                b.items([
                    pos_b,               // 4 = start
                    keyword_b("typeof"), // 3
                    whitespace_b,        // 2
                    UnaryExpression_b,   // 1 = expr
                    pos_b,               // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"TypeOf",[1]));
            },
            () => {
                b.items([
                    pos_b,              // 4 = start
                    punctuator_b("++"), // 3
                    whitespace_b,       // 2
                    UnaryExpression_b,  // 1 = expr
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PreIncrement",[1]));
            },
            () => {
                b.items([
                    pos_b,              // 4 = start
                    punctuator_b("--"), // 3
                    whitespace_b,       // 2
                    UnaryExpression_b,  // 1 = expr
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PreDecrement",[1]));
            },
            () => {
                b.items([
                    pos_b,             // 4 = start
                    punctuator_b("+"), // 3
                    whitespace_b,      // 2
                    UnaryExpression_b, // 1 = expr
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryPlus",[1]));
            },
            () => {
                b.items([
                    pos_b,             // 4 = start
                    punctuator_b("-"), // 3
                    whitespace_b,      // 2
                    UnaryExpression_b, // 1 = expr
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryMinus",[1]));
            },
            () => {
                b.items([
                    pos_b,             // 4 = start
                    punctuator_b("~"), // 3
                    whitespace_b,      // 2
                    UnaryExpression_b, // 1 = expr
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryBitwiseNot",[1]));
            },
            () => {
                b.items([
                    pos_b,             // 4 = start
                    punctuator_b("!"), // 3
                    whitespace_b,      // 2
                    UnaryExpression_b, // 1 = expr
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"UnaryLogicalNot",[1]));
            },
            () => {
                b.item(PostfixExpression_b);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                  // 6 = start
        b.item(UnaryExpression_b);      // 5 = left
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,       // 4
                    punctuator_b("*"),  // 3
                    whitespace_b,       // 2
                    UnaryExpression_b,  // 1 = right
                    pos_b,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Multiply",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,       // 4
                    punctuator_b("/"),  // 3
                    whitespace_b,       // 2
                    UnaryExpression_b,  // 1 = right
                    pos_b,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Divide",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,       // 4
                    punctuator_b("%"),  // 3
                    whitespace_b,       // 2
                    UnaryExpression_b,  // 1 = right
                    pos_b,              // 0 = end
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

// Section 12.7

// AdditiveExpression

function AdditiveExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                          // 6 = start
        b.item(MultiplicativeExpression_b);     // 5 = left
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,               // 4
                    punctuator_b("+"),          // 3
                    whitespace_b,               // 2
                    MultiplicativeExpression_b, // 1 = right
                    pos_b,                      // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Add",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,               // 4
                    punctuator_b("-"),          // 3
                    whitespace_b,               // 2
                    MultiplicativeExpression_b, // 1 = right
                    pos_b,                      // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Subtract",[5,1]));
            }]);

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.8

// ShiftExpression

function ShiftExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                    // 6 = start
        b.item(AdditiveExpression_b);     // 5 = left
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,         // 4
                    punctuator_b("<<"),   // 3
                    whitespace_b,         // 2
                    AdditiveExpression_b, // 1 = right
                    pos_b,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"LeftShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,         // 4
                    punctuator_b(">>>"),  // 3
                    whitespace_b,         // 2
                    AdditiveExpression_b, // 1 = right
                    pos_b,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"UnsignedRightShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,         // 4
                    punctuator_b(">>"),   // 3
                    whitespace_b,         // 2
                    AdditiveExpression_b, // 1 = right
                    pos_b,                // 0 = end
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

// Section 12.9

// RelationalExpression

function RelationalExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);             // 6 = start
        b.item(ShiftExpression_b); // 5 = left
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,       // 4
                    punctuator_b("<="), // 3
                    whitespace_b,       // 2
                    ShiftExpression_b,  // 1 = right
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessEqual",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,       // 4
                    punctuator_b(">="), // 3
                    whitespace_b,       // 2
                    ShiftExpression_b,  // 1 = right
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"GreaterEqual",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,      // 4
                    punctuator_b("<"), // 3
                    whitespace_b,      // 2
                    ShiftExpression_b, // 1 = right
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessThan",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,      // 4
                    punctuator_b(">"), // 3
                    whitespace_b,      // 2
                    ShiftExpression_b, // 1 = right
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"GreaterThan",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,            // 4
                    keyword_b("instanceof"), // 3
                    whitespace_b,            // 2
                    ShiftExpression_b,       // 1 = right
                    pos_b,                   // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"InstanceOf",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,      // 4
                    keyword_b("in"),   // 3
                    whitespace_b,      // 2
                    ShiftExpression_b, // 1 = right
                    pos_b,             // 0 = end
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

// Section 12.10

// EqualityExpression

function EqualityExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                      // 6 = start
        b.item(RelationalExpression_b);     // 5 = left
        b.brepeatChoice([
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("==="),    // 3
                    whitespace_b,           // 2
                    RelationalExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("!=="),    // 3
                    whitespace_b,           // 2
                    RelationalExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictNotEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("=="),     // 3
                    whitespace_b,           // 2
                    RelationalExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"AbstractEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("!="),     // 3
                    whitespace_b,           // 2
                    RelationalExpression_b, // 1 = right
                    pos_b,                  // 0 = end
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

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                // 6 = start
        b.item(EqualityExpression_b); // 5 = left
        b.brepeat(() => {
            b.items([
                whitespace_b,         // 4
                punctuator_b("&"),    // 3
                whitespace_b,         // 2
                EqualityExpression_b, // 1 = right
                pos_b,                // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"BitwiseAND",[5,1]));
        });

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BitwiseXORExpression

function BitwiseXORExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                  // 6 = start
        b.item(BitwiseANDExpression_b); // 5 = left
        b.brepeat(() => {
            b.items([
                whitespace_b,           // 4
                punctuator_b("^"),      // 3
                whitespace_b,           // 2
                BitwiseANDExpression_b, // 1 = right
                pos_b,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"BitwiseXOR",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BitwiseORExpression

function BitwiseORExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                  // 6 = start
        b.item(BitwiseXORExpression_b); // 5 = left
        b.brepeat(() => {
            b.items([
                whitespace_b,           // 4
                punctuator_b("|"),      // 3
                whitespace_b,           // 2
                BitwiseXORExpression_b, // 1 = right
                pos_b,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"BitwiseOR",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                 // 6 = start
        b.item(BitwiseORExpression_b); // 5 = left
        b.brepeat(() => {
            b.items([
                whitespace_b,          // 4
                punctuator_b("&&"),    // 3
                whitespace_b,          // 2
                BitwiseORExpression_b, // 1 = right
                pos_b,                 // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"LogicalAND",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LogicalORExpression

function LogicalORExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                  // 6 = start
        b.item(LogicalANDExpression_b); // 5 = left
        b.brepeat(() => {
            b.items([
                whitespace_b,           // 4
                punctuator_b("||"),     // 3
                whitespace_b,           // 2
                LogicalANDExpression_b, // 1 = right
                pos_b,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"LogicalOR",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.13

// ConditionalExpression

function ConditionalExpression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                      // 10 = start
        b.item(LogicalORExpression_b);      // 9 = condition
        b.bchoice([
            () => {
                b.items([
                    whitespace_b,           // 8
                    punctuator_b("?"),      // 7
                    whitespace_b,           // 6
                    AssignmentExpression_b, // 5 = trueExpr
                    whitespace_b,           // 4
                    punctuator_b(":"),      // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = falseExpr
                    pos_b,                  // 0 = end
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

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                      // 6 = start
        b.item(LeftHandSideExpression_b);   // 5 = left
        b.bchoice([
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("="),      // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Assign",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("*="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignMultiply",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("/="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignDivide",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("%="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignModulo",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("+="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignAdd",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("-="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignSubtract",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("<<="),    // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignLeftShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b(">>="),    // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignSignedRightShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b(">>>="),   // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignUnsignedRightShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("&="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseAND",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("^="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseXOR",[5,1]));
            },
            () => {
                b.items([
                    whitespace_b,           // 4
                    punctuator_b("|="),     // 3
                    whitespace_b,           // 2
                    AssignmentExpression_b, // 1 = right
                    pos_b,                  // 0 = end
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

// Section 12.15

// Expression

function Expression_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                  // 6 = start
        b.item(AssignmentExpression_b); // 5 = left
        b.brepeat(() => {
            b.items([
                whitespace_b,           // 4
                punctuator_b(","),      // 3
                whitespace_b,           // 2
                AssignmentExpression_b, // 1 = right
                pos_b,                  // 0 = end
            ]);
            b.popAboveAndSet(5,makeNode(b,6,0,"Comma",[5,1]));
        });
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 13.2

// BlockStatement

function BlockStatement_b(b: Builder): void {
    b.item(Block_b);
}

const BlockStatement = pfun(BlockStatement_b);

// Block

function Block_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);             // 5
        b.item(punctuator_b("{")); // 4
        b.item(whitespace_b);      // 3
        b.bchoice([               // 2 = statements
            () => {
                b.item(StatementList_b);
                b.item(whitespace_b);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                b.item(pos_b);
                const position = checkNumber(b.get(0));
                b.popAboveAndSet(0,new ListNode(new Range(position,position),[]));
            },
        ]);
        b.item(punctuator_b("}")); // 1
        b.item(pos_b);             // 0
        b.popAboveAndSet(5,makeNode(b,5,0,"Block",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// StatementList

function StatementList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(StatementListItem_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    StatementListItem_b,
                ]);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,              // 6 = start
                    keyword_b("let"),   // 5
                    whitespace_b,       // 4
                    BindingList_b,      // 3 = bindings
                    whitespace_b,       // 2
                    punctuator_b(";"),  // 1
                    pos_b,              // 0 = end
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"Let",[3]));
            },
            () => {
                b.items([
                    pos_b,              // 6 = start
                    keyword_b("const"), // 5
                    whitespace_b,       // 4
                    BindingList_b,      // 3 = bindings
                    whitespace_b,       // 2
                    punctuator_b(";"),  // 1
                    pos_b,              // 0 = end
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"Const",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingList

function BindingList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(LexicalBinding_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    LexicalBinding_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LexicalBinding_identifier

function LexicalBinding_identifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);               // 3 = start
        b.item(BindingIdentifier_b); // 2 = identifier
        b.bopt(() => {              // 1 = initializer
            b.item(whitespace_b);
            b.item(Initializer_b);
            b.popAboveAndSet(1,b.get(0));
        });
        b.item(pos_b);               // 0 = end
        b.assertLengthIs(oldLength+4);
        b.popAboveAndSet(3,makeNode(b,3,0,"LexicalIdentifierBinding",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LexicalBinding_pattern

function LexicalBinding_pattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,            // 4 = start
            BindingPattern_b, // 3 = pattern
            whitespace_b,     // 2
            Initializer_b,    // 1 = initializer
            pos_b,            // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"LexicalPatternBinding",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 13.3.2

// VariableStatement

function VariableStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                     // 6 = start
            keyword_b("var"),          // 5
            whitespace_b,              // 4
            VariableDeclarationList_b, // 3 = declarations
            whitespace_b,              // 2
            punctuator_b(";"),         // 1
            pos_b,                     // 0 = end
        ]);
        b.popAboveAndSet(6,makeNode(b,6,0,"Var",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// VariableDeclarationList

function VariableDeclarationList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(VariableDeclaration_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    VariableDeclaration_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// VariableDeclaration_identifier

function VariableDeclaration_identifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);
        b.item(BindingIdentifier_b);
        b.bchoice([
            () => {
                b.items([
                    whitespace_b,
                    Initializer_b,
                    pos_b,
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarIdentifier",[3,1]));
            },
            () => {
                b.item(value_b(null));
                b.item(pos_b);
                b.assertLengthIs(oldLength+4);
                b.popAboveAndSet(3,makeNode(b,3,0,"VarIdentifier",[2,1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// VariableDeclaration_pattern

function VariableDeclaration_pattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,            // 4 = start
            BindingPattern_b, // 3 = pattern
            whitespace_b,     // 2
            Initializer_b,    // 1 = initializer
            pos_b,            // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"VarPattern",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// ObjectBindingPattern

function ObjectBindingPattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);              // 6 = start
        b.item(punctuator_b("{"));  // 5
        b.item(whitespace_b);       // 4
        b.item(pos_b);              // 3
        b.bchoice([                // 2 = properties
            () => {
                b.item(BindingPropertyList_b),
                b.item(whitespace_b),
                b.bopt(() => {
                    b.item(punctuator_b(","));
                    b.item(whitespace_b);
                    b.popAboveAndSet(1,null);
                });
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
            },
        ]);
        b.item(punctuator_b("}"));  // 1
        b.item(pos_b);              // 0 = end
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

// ArrayBindingPattern

function ArrayBindingPattern_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 7 = start
            punctuator_b("["),     // 6
            whitespace_b,          // 5
            BindingElementList_b,  // 4 = elements
            whitespace_b,          // 3
        ]);
        b.bopt(() => {            // 2 = rest
            b.item(BindingRestElement_b);
            b.item(whitespace_b);
            b.popAboveAndSet(1,b.get(1));
        });
        b.items([
            punctuator_b("]"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"ArrayBindingPattern",[4,2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingPropertyList

function BindingPropertyList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(BindingProperty_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    BindingProperty_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingElementList

function BindingElementList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.bopt(() => {
                    b.item(pos_b);
                    b.item(punctuator_b(","));
                    b.item(pos_b);
                    b.popAboveAndSet(2,makeNode(b,2,0,"Elision",[]));
                });
            },
            () => {
                b.bchoice([
                    () => {
                        b.items([
                            whitespace_b,      // 3
                            pos_b,             // 2 = before
                            punctuator_b(","), // 1
                            pos_b,             // 0 = after
                        ]);
                        b.popAboveAndSet(3,makeNode(b,2,0,"Elision",[]));
                    },
                    () => {
                        b.item(whitespace_b);
                        b.item(BindingElement_b);
                        b.bopt(() => {
                            b.item(whitespace_b);
                            b.item(punctuator_b(","));
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

// BindingProperty

function BindingProperty_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,             // 6 = start
                    PropertyName_b,    // 5 = name
                    whitespace_b,      // 4
                    punctuator_b(":"), // 3
                    whitespace_b,      // 2
                    BindingElement_b,  // 1 = element
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BindingProperty",[5,1]));
            },
            () => {
                // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
                // and PropertyName will match an identifier at the start of a colon binding
                b.item(SingleNameBinding_b);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingElement

function BindingElement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.item(SingleNameBinding_b);
            },
            () => {
                b.item(pos_b);
                b.item(BindingPattern_b);
                b.bchoice([
                    () => {
                        b.items([
                            whitespace_b,
                            Initializer_b,
                            pos_b,
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

// SingleNameBinding

function SingleNameBinding_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);
        b.item(BindingIdentifier_b);
        b.bchoice([
            () => {
                b.items([
                    whitespace_b,
                    Initializer_b,
                    pos_b,
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

// BindingRestElement

function BindingRestElement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 4 = start
            punctuator_b("..."), // 3
            whitespace_b,        // 2
            BindingIdentifier_b, // 1 = ident
            pos_b,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"BindingRestElement",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.4

// EmptyStatement

function EmptyStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            punctuator_b(";"),
            pos_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"EmptyStatement",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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
        b.items([
            pos_b,             // 4 = start
            Expression_b,      // 3 = expr
            whitespace_b,      // 2
            punctuator_b(";"), // 1
            pos_b,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"ExpressionStatement",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.6

// IfStatement

function IfStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 11 = start
            keyword_b("if"),     // 10
            whitespace_b,        // 9
            punctuator_b("("),   // 8
            whitespace_b,        // 7
            Expression_b,        // 6 = condition
            whitespace_b,        // 5
            punctuator_b(")"),   // 4
            whitespace_b,        // 3
            Statement_b,         // 2 = trueBranch
        ]);
        b.bopt(() => {          // 1 = falseBranch
            b.items([
                whitespace_b,
                keyword_b("else"),
                whitespace_b,
                Statement_b,
            ]);
            b.popAboveAndSet(3,b.get(0));
        });
        b.item(pos_b);           // 0 = end
        b.assertLengthIs(oldLength+12);
        b.popAboveAndSet(11,makeNode(b,11,0,"IfStatement",[6,2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.7

// IterationStatement_do

function IterationStatement_do_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,              // 14
            keyword_b("do"),    // 13
            whitespace_b,       // 12
            Statement_b,        // 11 = body
            whitespace_b,       // 10
            keyword_b("while"), // 9
            whitespace_b,       // 8
            punctuator_b("("),  // 7
            whitespace_b,       // 6
            Expression_b,       // 5 = condition
            whitespace_b,       // 4
            punctuator_b(")"),  // 3
            whitespace_b,       // 2
            punctuator_b(";"),  // 1 = end
            pos_b,              // 0 = start
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"DoStatement",[11,5]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_while

function IterationStatement_while_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                // 10 = start
            keyword_b("while"),   // 9
            whitespace_b,         // 8
            punctuator_b("("),    // 7
            whitespace_b,         // 6
            Expression_b,         // 5 = condition
            whitespace_b,         // 4
            punctuator_b(")"),    // 3
            whitespace_b,         // 2
            Statement_b,          // 1 = body
            pos_b,                // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WhileStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for_c

function IterationStatement_for_c_b(b: Builder): void {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                                                            // 14 = start
            keyword_b("for"),                                                 // 13
            whitespace_b,                                                     // 12
            punctuator_b("("),                                                // 11
            whitespace_b,                                                     // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.bchoice([
            () => {
                b.items([
                    notKeyword_b("let"), // FIXME: need tests for this
                    notPunctuator_b("["), // FIXME: need tests for this
                    Expression_b,
                    whitespace_b,
                    punctuator_b(";"),
                    whitespace_b,
                ]);
                b.popAboveAndSet(5,b.get(3));
            },
            () => {
                b.items([
                    pos_b,                     // 7 = start2
                    keyword_b("var"),          // 6
                    whitespace_b,              // 5
                    VariableDeclarationList_b, // 4 = declarations
                    pos_b,                     // 3 = end
                    whitespace_b,              // 2
                    punctuator_b(";"),         // 1
                    whitespace_b,              // 0
                ]);
                b.popAboveAndSet(7,makeNode(b,7,3,"Var",[4]));
            },
            () => {
                b.items([
                    LexicalDeclaration_b,
                    whitespace_b,
                ]);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                // initializer part can be empty, but need to distinguish this from an error
                b.items([
                    punctuator_b(";"),
                ]);
                b.popAboveAndSet(0,null);
            },
        ]);
        b.assertLengthIs(oldLength+6);
        b.item(opt_b(Expression_b)); // 8 = condition
        b.item(whitespace_b);      // 7
        b.item(punctuator_b(";")); // 6
        b.item(whitespace_b);      // 5
        b.bopt(() => {            // 4 = update
            b.item(Expression_b);
            b.item(whitespace_b);
            b.popAboveAndSet(1,b.get(1));
        });
        b.item(punctuator_b(")")); // 3
        b.item(whitespace_b);      // 2
        b.item(Statement_b);       // 1 = body
        b.item(pos_b);             // 0 = end
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForC",[9,8,4,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for_in

function IterationStatement_for_in_b(b: Builder): void {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                                           // 14 = start
            keyword_b("for"),                                // 13
            whitespace_b,                                    // 12
            punctuator_b("("),                               // 11
            whitespace_b,                                    // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.bchoice([ // 9 = binding
            () => {
                b.items([
                    notKeyword_b("let"), // FIXME: need tests for this
                    notPunctuator_b("["), // FIXME: need tests for this
                    LeftHandSideExpression_b,
                ]);
                b.popAboveAndSet(2,b.get(0));
            },
            () => {
                b.items([
                    pos_b,
                    keyword_b("var"),
                    whitespace_b,
                    ForBinding_b,
                    pos_b,
                ]);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarForDeclaration",[1]));
            },
            () => {
                b.item(ForDeclaration_b);
            }
        ]);
        b.assertLengthIs(oldLength+6);
        b.items([
            whitespace_b,                                    // 8
            keyword_b("in"),                                 // 7
            whitespace_b,                                    // 6
            Expression_b,                                    // 5 = expr
            whitespace_b,                                    // 4
            punctuator_b(")"),                               // 3
            whitespace_b,                                    // 2
            Statement_b,                                     // 1 = body
            pos_b,                                           // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForIn",[9,5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for_of

function IterationStatement_for_of_b(b: Builder): void {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                                           // 14 = start
            keyword_b("for"),                                // 13
            whitespace_b,                                    // 12
            punctuator_b("("),                               // 11
            whitespace_b,                                    // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.bchoice([
            () => {
                b.items([
                    notKeyword_b("let"), // FIXME: need tests for this
                    notPunctuator_b("["), // FIXME: need tests for this
                    LeftHandSideExpression_b,
                ]);
                b.popAboveAndSet(2,b.get(0));
            },
            () => {
                b.items([
                    pos_b,
                    keyword_b("var"),
                    whitespace_b,
                    ForBinding_b,
                    pos_b,
                ]);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarForDeclaration",[1]));
            },
            () => {
                b.item(ForDeclaration_b);
            },
        ]);
        b.assertLengthIs(oldLength+6);
        b.items([
            whitespace_b,                                    // 8
            keyword_b("of"),                                 // 7
            whitespace_b,                                    // 6
            Expression_b,                                    // 5 = expr
            whitespace_b,                                    // 4
            punctuator_b(")"),                               // 3
            whitespace_b,                                    // 2
            Statement_b,                                     // 1 = body
            pos_b,                                           // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForOf",[9,5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// ForDeclaration

function ForDeclaration_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,              // 4 = start
                    keyword_b("let"),   // 3
                    whitespace_b,       // 2
                    ForBinding_b,       // 1 = binding
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"LetForDeclaration",[1]));
            },
            () => {
                b.items([
                    pos_b,              // 4 = start
                    keyword_b("const"), // 3
                    whitespace_b,       // 2
                    ForBinding_b,       // 1 = binding
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ConstForDeclaration",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 13.8

// ContinueStatement

function ContinueStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,                 // 5 = start
                    keyword_b("continue"), // 4
                    whitespace_b,          // 3
                    value_b(null),         // 2 = null
                    punctuator_b(";"),     // 1
                    pos_b,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(5,makeNode(b,5,0,"ContinueStatement",[2]));
            },
            () => {
                b.items([
                    pos_b,                 // 6 = start
                    keyword_b("continue"), // 5
                    whitespaceNoNewline_b, // 4
                    LabelIdentifier_b,     // 3 = ident
                    whitespace_b,          // 2
                    punctuator_b(";"),     // 1
                    pos_b,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ContinueStatement",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.9

// BreakStatement

function BreakStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,              // 5 = start
                    keyword_b("break"), // 4
                    whitespace_b,       // 3
                    value_b(null),      // 2 = null
                    punctuator_b(";"),  // 1
                    pos_b,              // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(5,makeNode(b,5,0,"BreakStatement",[2]));
            },
            () => {
                b.items([
                    pos_b,                 // 6 = start
                    keyword_b("break"),    // 5
                    whitespaceNoNewline_b, // 4
                    LabelIdentifier_b,     // 3 = ident
                    whitespace_b,          // 2
                    punctuator_b(";"),     // 1
                    pos_b,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BreakStatement",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.10

// ReturnStatement

function ReturnStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,               // 5 = start
                    keyword_b("return"), // 4
                    whitespace_b,        // 3
                    value_b(null),       // 2 = null
                    punctuator_b(";"),   // 1
                    pos_b,               // 0 = end
                ]);
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(5,makeNode(b,5,0,"ReturnStatement",[2]));
            },
            () => {
                b.items([
                    pos_b,                 // 6 = start
                    keyword_b("return"),   // 5
                    whitespaceNoNewline_b, // 4
                    Expression_b,          // 3 = expr
                    whitespace_b,          // 2
                    punctuator_b(";"),     // 1
                    pos_b,                 // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ReturnStatement",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.11

// WithStatement

function WithStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,             // 10 = start
            keyword_b("with"), // 9
            whitespace_b,      // 8
            punctuator_b("("), // 7
            whitespace_b,      // 6
            Expression_b,      // 5 = expr
            whitespace_b,      // 4
            punctuator_b(")"), // 3
            whitespace_b,      // 2
            Statement_b,       // 1 = body
            pos_b,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WithStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.12

// SwitchStatement

function SwitchStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 10 = start
            keyword_b("switch"), // 9
            whitespace_b,        // 8
            punctuator_b("("),   // 7
            whitespace_b,        // 6
            Expression_b,        // 5 = expr
            whitespace_b,        // 4
            punctuator_b(")"),   // 3
            whitespace_b,        // 2
            CaseBlock_b,         // 1 = cases
            pos_b,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"SwitchStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CaseBlock_1

function CaseBlock_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,             // 7
            punctuator_b("{"), // 6
            whitespace_b,      // 5
            pos_b,             // 4 = midpos
        ]);
        b.bchoice([           // 3 = clauses
            () => {
                b.item(CaseClauses_b);
            },
            () => {
                const midpos = checkNumber(b.get(0));
                b.push(new ListNode(new Range(midpos,midpos),[]));
            },
        ]);
        b.items([
            whitespace_b,      // 2
            punctuator_b("}"), // 1
            pos_b,             // 0
        ]);
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"CaseBlock1",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CaseBlock_2

function CaseBlock_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,              // 10 = start
            punctuator_b("{"),  // 9
            whitespace_b,       // 8
            opt_b(CaseClauses_b), // 7 = clauses1
            whitespace_b,       // 6
            DefaultClause_b,    // 5 = defaultClause
            whitespace_b,       // 4
            opt_b(CaseClauses_b), // 3 = clauses2
            whitespace_b,       // 2
            punctuator_b("}"),  // 1
            pos_b,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"CaseBlock2",[7,5,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// CaseClauses

function CaseClauses_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(CaseClause_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    CaseClause_b,
                ]);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CaseClause

function CaseClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,             // 8 = start
            keyword_b("case"), // 7
            whitespace_b,      // 6
            Expression_b,      // 5 = expr
            whitespace_b,      // 4
            punctuator_b(":"), // 3
            whitespace_b,      // 2
            StatementList_b,   // 1 = statements
            pos_b,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+9);
        b.popAboveAndSet(8,makeNode(b,8,0,"CaseClause",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// DefaultClause

function DefaultClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                // 6 = start
            keyword_b("default"), // 5
            whitespace_b,         // 4
            punctuator_b(":"),    // 3
            whitespace_b,         // 2
            StatementList_b,      // 1 = statements
            whitespace_b,         // 0
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

// Section 13.13

// LabelledStatement

function LabelledStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,             // 6 = start
            LabelIdentifier_b, // 5 = ident
            whitespace_b,      // 4
            punctuator_b(":"), // 3
            whitespace_b,      // 2
            LabelledItem_b,    // 1 = item
            pos_b,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"LabelledStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 13.14

// ThrowStatement

function ThrowStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 6 = start
            keyword_b("throw"),    // 5
            whitespaceNoNewline_b, // 4
            Expression_b,          // 3 = expr
            whitespace_b,          // 2
            punctuator_b(";"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ThrowStatement",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.15

// TryStatement

function TryStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);                   // 7 = start
        b.item(keyword_b("try"));        // 6
        b.item(whitespace_b);            // 5
        b.item(Block_b);                 // 4 = tryBlock
        b.bchoice([
            () => {
                b.item(whitespace_b);    // 3
                b.item(value_b(null));   // 2 = catchBlock
                b.item(Finally_b);       // 1 = finallyBlock
            },
            () => {
                b.item(whitespace_b);    // 3
                b.item(Catch_b);         // 2 = catchBlock
                b.bopt(() => {          // 1 = finallyBlock
                    b.item(whitespace_b);
                    b.item(Finally_b);
                    b.popAboveAndSet(1,b.get(0));
                });
            },
        ]);
        b.item(pos_b);                   // 0 = end
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"TryStatement",[4,2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Catch

function Catch_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,              // 10 = start
            keyword_b("catch"), // 9
            whitespace_b,       // 8
            punctuator_b("("),  // 7
            whitespace_b,       // 6
            CatchParameter_b,   // 5 = param
            whitespace_b,       // 4
            punctuator_b(")"),  // 3
            whitespace_b,       // 2
            Block_b,            // 1 = block
            pos_b,              // 0 = end
        ]);
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"Catch",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Finally

function Finally_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                // 4
            keyword_b("finally"), // 3
            whitespace_b,         // 2
            Block_b,              // 1
            pos_b,                // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"Finally",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 13.16

// DebuggerStatement

function DebuggerStatement_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 4
            keyword_b("debugger"), // 3
            whitespace_b,          // 2
            punctuator_b(";"),     // 1
            pos_b,                 // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"DebuggerStatement",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 16 = start
            keyword_b("function"), // 15
            whitespace_b,          // 14
            BindingIdentifier_b,   // 13 = ident
            whitespace_b,          // 12
            punctuator_b("("),     // 11
            whitespace_b,          // 10
            FormalParameters_b,    // 9 = params
            whitespace_b,          // 8
            punctuator_b(")"),     // 7
            whitespace_b,          // 6
            punctuator_b("{"),     // 5
            whitespace_b,          // 4
            FunctionBody_b,        // 3 = body
            whitespace_b,          // 2
            punctuator_b("}"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"FunctionDeclaration",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 15 = start
            keyword_b("function"), // 14
            whitespace_b,          // 13
            punctuator_b("("),     // 12
            whitespace_b,          // 11
            value_b(null),         // 10 = null
            FormalParameters_b,    // 9 = params
            whitespace_b,          // 8
            punctuator_b(")"),     // 7
            whitespace_b,          // 6
            punctuator_b("{"),     // 5
            whitespace_b,          // 4
            FunctionBody_b,        // 3 = body
            whitespace_b,          // 2
            punctuator_b("}"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionDeclaration",[10,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FunctionDeclaration

function FunctionDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try {
        return pfun(FunctionDeclaration_named_b)(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (flags.Default) {
        try {
            return pfun(FunctionDeclaration_unnamed_b)(p);
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
        b.items([
            pos_b,                 // 15 = start
            keyword_b("function"), // 14
            whitespace_b,          // 13
        ]);
        b.bopt(() => {
            b.item(BindingIdentifier_b);
            b.item(whitespace_b);
            b.popAboveAndSet(1,b.get(1));
        });
        b.items([
            punctuator_b("("),     // 11
            whitespace_b,          // 10
            FormalParameters_b,    // 9 = params
            whitespace_b,          // 8
            punctuator_b(")"),     // 7
            whitespace_b,          // 6
            punctuator_b("{"),     // 5
            whitespace_b,          // 4
            FunctionBody_b,        // 3 = body
            whitespace_b,          // 2
            punctuator_b("}"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionExpression",[12,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// StrictFormalParameters

function StrictFormalParameters_b(b: Builder): void {
    b.item(FormalParameters_b);
}

// FormalParameters

function FormalParameters_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.item(FormalParameterList_b);
            },
            () => {
                b.item(pos_b);
                b.popAboveAndSet(0,makeNode(b,0,0,"FormalParameters1",[]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FormalParameterList

function FormalParameterList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,                   // 2 = start
                    FunctionRestParameter_b, // 1 = rest
                    pos_b,                   // 0 = end
                ]);
                b.assertLengthIs(oldLength+3);
                b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters2",[1]));
            },
            () => {
                b.item(pos_b);           // 3 = start
                b.item(FormalsList_b);   // 2 = formals
                b.bchoice([
                    () => {
                        b.items([
                            whitespace_b,
                            punctuator_b(","),
                            whitespace_b,
                            FunctionRestParameter_b,
                            pos_b,
                        ]);
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"FormalParameters4",[5,1]));
                    },
                    () => {
                        b.item(pos_b);
                        b.assertLengthIs(oldLength+3);
                        b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters3",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
    });
}

// FormalsList

function FormalsList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(FormalParameter_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    FormalParameter_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FunctionRestParameter

function FunctionRestParameter_b(b: Builder): void {
    b.item(BindingRestElement_b);
}

// FormalParameter

function FormalParameter_b(b: Builder): void {
    b.item(BindingElement_b);
}

// FunctionBody

function FunctionBody_b(b: Builder): void {
    b.item(FunctionStatementList_b);
}

const FunctionBody = pfun(FunctionBody_b);

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

// Section 14.2

// ArrowFunction

function ArrowFunction_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 6 = start
            ArrowParameters_b,     // 5 = params
            whitespaceNoNewline_b, // 4
            punctuator_b("=>"),    // 3
            whitespace_b,          // 2
            ConciseBody_b,         // 1 = body
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ArrowFunction",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// ConciseBody_1

function ConciseBody_1_b(b: Builder): void {
    if (b.parser.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    b.item(AssignmentExpression_b);
}

// ConciseBody_2

function ConciseBody_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            punctuator_b("{"), // 4
            whitespace_b,      // 3
            FunctionBody_b,    // 2
            whitespace_b,      // 1
            punctuator_b("}"), // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// ArrowFormalParameters

function ArrowFormalParameters_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            punctuator_b("("),        // 4
            whitespace_b,             // 3
            StrictFormalParameters_b, // 2
            whitespace_b,             // 1
            punctuator_b(")"),        // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 14.3

// MethodDefinition_1

function MethodDefinition_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                    // 14 = start
            PropertyName_b,           // 13 = name
            whitespace_b,             // 12
            punctuator_b("("),        // 11
            whitespace_b,             // 10
            StrictFormalParameters_b, // 9 = params
            whitespace_b,             // 8
            punctuator_b(")"),        // 7
            whitespace_b,             // 6
            punctuator_b("{"),        // 5
            whitespace_b,             // 4
            FunctionBody_b,           // 3 = body
            whitespace_b,             // 2
            punctuator_b("}"),        // 1
            pos_b,                    // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Method",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// MethodDefinition_2

function MethodDefinition_2(p: Parser): ASTNode {
    return pfun(GeneratorMethod_b)(p);
}

// MethodDefinition_3

function MethodDefinition_3_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 14 = start
            identifier_b("get"), // 13 "get" is not a reserved word, so we can't use keyword here
            whitespace_b,        // 12
            PropertyName_b,      // 11 = name
            whitespace_b,        // 10
            punctuator_b("("),   // 9
            whitespace_b,        // 8
            punctuator_b(")"),   // 7
            whitespace_b,        // 6
            punctuator_b("{"),   // 5
            whitespace_b,        // 4
            FunctionBody_b,      // 3 = body
            whitespace_b,        // 2
            punctuator_b("}"),   // 1
            pos_b,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Getter",[11,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// MethodDefinition_4

function MethodDefinition_4_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                      // 16 = start
            identifier_b("set"),        // 15
            whitespace_b,               // 14
            PropertyName_b,             // 13 = name
            whitespace_b,               // 12
            punctuator_b("("),          // 11
            whitespace_b,               // 10
            PropertySetParameterList_b, // 9 = param
            whitespace_b,               // 8
            punctuator_b(")"),          // 7
            whitespace_b,               // 6
            punctuator_b("{"),          // 5
            whitespace_b,               // 4
            FunctionBody_b,             // 3 = body
            whitespace_b,               // 2
            punctuator_b("}"),          // 1
            pos_b,                      // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"Setter",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// MethodDefinition

function MethodDefinition_b(b: Builder): void {
    const oldLength = b.length;
    b.bchoice([
        MethodDefinition_1_b,
        bfun(MethodDefinition_2),
        MethodDefinition_3_b,
        MethodDefinition_4_b,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// PropertySetParameterList

function PropertySetParameterList_b(b: Builder): void {
    b.item(FormalParameter_b);
}

// Section 14.4

// GeneratorMethod

function GeneratorMethod_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                    // 16 = start
            punctuator_b("*"),        // 15
            whitespace_b,             // 14
            PropertyName_b,           // 13 = name
            whitespace_b,             // 12
            punctuator_b("("),        // 11
            whitespace_b,             // 10
            StrictFormalParameters_b, // 9 = params
            whitespace_b,             // 8
            punctuator_b(")"),        // 7
            whitespace_b,             // 6
            punctuator_b("{"),        // 5
            whitespace_b,             // 4
            bfun(GeneratorBody),          // 3 = body
            whitespace_b,             // 2
            punctuator_b("}"),        // 1
            pos_b,                    // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"GeneratorMethod",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration_1

function GeneratorDeclaration_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 18 = start
            keyword_b("function"), // 17
            whitespace_b,          // 16
            punctuator_b("*"),     // 15
            whitespace_b,          // 14
            BindingIdentifier_b,   // 13 = ident
            whitespace_b,          // 12
            punctuator_b("("),     // 11
            whitespace_b,          // 10
            FormalParameters_b,    // 9 = params
            whitespace_b,          // 8
            punctuator_b(")"),     // 7
            whitespace_b,          // 6
            punctuator_b("{"),     // 5
            whitespace_b,          // 4
            bfun(GeneratorBody),       // 3 = body
            whitespace_b,          // 2
            punctuator_b("}"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+19);
        b.popAboveAndSet(18,makeNode(b,18,0,"GeneratorDeclaration",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration_2

function GeneratorDeclaration_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                 // 16 = start
            keyword_b("function"), // 15
            whitespace_b,          // 14
            punctuator_b("*"),     // 13
            whitespace_b,          // 12
            punctuator_b("("),     // 11
            whitespace_b,          // 10
            FormalParameters_b,    // 9 = params
            whitespace_b,          // 8
            punctuator_b(")"),     // 7
            whitespace_b,          // 6
            punctuator_b("{"),     // 5
            whitespace_b,          // 4
            bfun(GeneratorBody),       // 3 = body
            whitespace_b,          // 2
            punctuator_b("}"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+17);
        // FIXME: Should be DefaultGeneratorDeclaration
        b.popAboveAndSet(16,makeNode(b,16,0,"DefaultGeneratorDeclaration",[9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration

function GeneratorDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try {
        return pfun(GeneratorDeclaration_1_b)(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (flags.Default) {
        try {
            return pfun(GeneratorDeclaration_2_b)(p);
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
        b.items([
            pos_b,                 // 17 = start
            keyword_b("function"), // 16
            whitespace_b,          // 15
            punctuator_b("*"),     // 14
            whitespace_b,          // 13
        ]);
        b.bopt(() => {            // 12 = ident
            b.items([
                BindingIdentifier_b,
                whitespace_b,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.items([
            punctuator_b("("),     // 11
            whitespace_b,          // 10
            FormalParameters_b,    // 9 = params
            whitespace_b,          // 8
            punctuator_b(")"),     // 7
            whitespace_b,          // 6
            punctuator_b("{"),     // 5
            whitespace_b,          // 4
            bfun(GeneratorBody),       // 3 = body
            whitespace_b,          // 2
            punctuator_b("}"),     // 1
            pos_b,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+18);
        b.popAboveAndSet(17,makeNode(b,17,0,"GeneratorExpression",[12,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorBody

function GeneratorBody(p: Parser): ASTNode {
    return FunctionBody(p);
}

// YieldExpression_1

function YieldExpression_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                  // 6
            keyword_b("yield"),     // 5
            whitespaceNoNewline_b,  // 4
            punctuator_b("*"),      // 3
            whitespace_b,           // 2
            AssignmentExpression_b, // 1
            pos_b,                  // 0
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"YieldStar",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// YieldExpression_2

function YieldExpression_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                  // 4
            keyword_b("yield"),     // 3
            whitespaceNoNewline_b,  // 2
            AssignmentExpression_b, // 1
            pos_b,                  // 0
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"YieldExpr",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// YieldExpression_3

function YieldExpression_3_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            keyword_b("yield"),
            pos_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"YieldNothing",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 6 = start
            keyword_b("class"),  // 5
            whitespace_b,        // 4
            BindingIdentifier_b, // 3 = ident
            whitespace_b,        // 2
            ClassTail_b,         // 1 = tail
            pos_b,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassDeclaration",[3,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassDeclaration_2

function ClassDeclaration_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,              // 5
            keyword_b("class"), // 4
            whitespace_b,       // 3
            value_b(null),      // 2
            ClassTail_b,        // 1
            pos_b,              // 0
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassDeclaration",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassDeclaration

function ClassDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    if (flags === undefined)
        flags = {};
    try {
        return pfun(ClassDeclaration_1_b)(p);
    } catch (e) {
        if (!(e instanceof ParseFailure))
            throw e;
    }
    if (flags.Default) {
        try {
            return pfun(ClassDeclaration_2_b)(p);
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
        b.item(pos_b);              // 5
        b.item(keyword_b("class")); // 4
        b.item(whitespace_b);       // 3
        b.bopt(() => {             // 2
            b.items([
                BindingIdentifier_b,
                whitespace_b,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.item(ClassTail_b);        // 1
        b.item(pos_b);              // 0
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassExpression",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassTail

function ClassTail_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);               // 6 = start
        b.bopt(() => {              // 5 = heritage
            b.items([
                ClassHeritage_b,
                whitespace_b,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.item(punctuator_b("{"));   // 4
        b.item(whitespace_b);        // 3
        b.bchoice([                 // 2 = body
            () => {
                b.items([
                    ClassBody_b,
                    whitespace_b,
                ]);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                b.item(pos_b);
                b.popAboveAndSet(0,makeEmptyListNode(b,0,0));
            },
        ]);
        b.item(punctuator_b("}"));   // 1
        b.item(pos_b);               // 0 = end
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassTail",[5,2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassHeritage

function ClassHeritage_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                    // 4 = start
            keyword_b("extends"),     // 3
            whitespace_b,             // 2
            LeftHandSideExpression_b, // 1 = expr
            pos_b,                    // 0 = end
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"Extends",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassBody

function ClassBody_b(b: Builder): void {
    b.item(ClassElementList_b);
}

// ClassElementList

function ClassElementList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(ClassElement_b);
            },
            () => {
                b.item(whitespace_b);
                b.item(ClassElement_b);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassElement_1

function ClassElement_1_b(b: Builder): void {
    b.item(MethodDefinition_b);
}

// ClassElement_2

function ClassElement_2_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            keyword_b("static"),
            whitespace_b,
            MethodDefinition_b,
            pos_b,
        ]);
        b.assertLengthIs(oldLength+5);
        b.popAboveAndSet(4,makeNode(b,4,0,"StaticMethodDefinition",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassElement_3

function ClassElement_3_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            punctuator_b(";"),
            pos_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"EmptyClassElement",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 15.1

// Script

export function Script_b(b: Builder): void {
    const oldLength = b.length;
    b.item(pos_b);
    b.bchoice([
        () => {
            b.item(ScriptBody_b);
        },
        () => {
            const start = checkNumber(b.get(0));
            b.push(new ListNode(new Range(start,start),[]));
        },
    ]);
    b.assertLengthIs(oldLength+2);
    b.item(pos_b);
    b.assertLengthIs(oldLength+3);
    const start = checkNumber(b.get(2));
    const end = checkNumber(b.get(0));
    const body = checkNode(b.get(1));
    b.popAboveAndSet(2,new ScriptNode(new Range(start,end),body));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

export const Script = pfun(Script_b);

// ScriptBody

function ScriptBody_b(b: Builder): void {
    b.item(StatementList_b);
}

// Section 15.2

// Module

export function Module_b(b: Builder): void {
    const oldLength = b.length;
    b.item(pos_b);
    b.bchoice([
        () => {
            b.item(ModuleBody_b);
        },
        () => {
            const start = checkNumber(b.get(0));
            b.push(new ListNode(new Range(start,start),[]));
        },
    ]);
    b.assertLengthIs(oldLength+2);
    b.item(pos_b);
    b.assertLengthIs(oldLength+3);
    const start = checkNumber(b.get(2));
    const end = checkNumber(b.get(0));
    const body = checkNode(b.get(1));
    b.popAboveAndSet(2,new ModuleNode(new Range(start,end),body));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

export const Module = pfun(Module_b);

// ModuleBody

function ModuleBody_b(b: Builder): void {
    b.item(ModuleItemList_b);
}

// ModuleItemList

function ModuleItemList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(ModuleItem_b);
            },
            () => {
                b.item(whitespace_b);
                b.item(ModuleItem_b);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 8 = start
            keyword_b("import"), // 7
            whitespace_b,        // 6
            ImportClause_b,      // 5 = importClause
            whitespace_b,        // 4
            FromClause_b,        // 3 = fromClause
            whitespace_b,        // 2
            punctuator_b(";"),   // 1
            pos_b,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+9);
        b.popAboveAndSet(8,makeNode(b,8,0,"ImportFrom",[5,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportDeclaration_module

function ImportDeclaration_module_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,               // 6 = start
            keyword_b("import"), // 5
            whitespace_b,        // 4
            ModuleSpecifier_b,   // 3 = specifier
            whitespace_b,        // 2
            punctuator_b(";"),   // 1
            pos_b,               // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ImportModule",[3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

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

// ImportClause

function ImportClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.item(NameSpaceImport_b);
            },
            () => {
                b.item(NamedImports_b);
            },
            () => {
                b.item(pos_b);                    // 6 = start
                b.item(ImportedDefaultBinding_b); // 5 = defbinding
                b.bchoice([
                    () => {
                        b.items([
                            whitespace_b,         // 4
                            punctuator_b(","),    // 3
                            whitespace_b,         // 2
                            NameSpaceImport_b,    // 1 = nsimport
                            pos_b,                // 0 = end
                        ]);
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"DefaultAndNameSpaceImports",[5,1]));
                    },
                    () => {
                        b.items([
                            whitespace_b,         // 4
                            punctuator_b(","),    // 3
                            whitespace_b,         // 2
                            NamedImports_b,       // 1 = nsimports
                            pos_b,                // 0 = end
                        ]);
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(6,makeNode(b,6,0,"DefaultAndNamedImports",[5,1]));
                    },
                    () => {
                        b.item(pos_b);
                        b.popAboveAndSet(2,makeNode(b,2,0,"DefaultImport",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportedDefaultBinding

function ImportedDefaultBinding_b(b: Builder): void {
    b.item(ImportedBinding_b);
}

// NameSpaceImport

function NameSpaceImport_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,             // 6 = start
            punctuator_b("*"), // 5
            whitespace_b,      // 4
            keyword_b("as"),   // 3
            whitespace_b,      // 2
            ImportedBinding_b, // 1 = binding
            pos_b,             // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"NameSpaceImport",[1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// NamedImports

function NamedImports_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                // 5 = start
            punctuator_b("{"),    // 4
            whitespace_b,         // 3
        ]);
        b.bchoice([              // 2 = imports
            () => {
                b.item(ImportsList_b);
                b.item(whitespace_b);
                b.bopt(() => {
                    b.item(punctuator_b(","));
                    b.item(whitespace_b);
                    b.pop();
                });
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
            },
        ]);
        b.items([
            punctuator_b("}"),    // 1
            pos_b,                // 0 = end
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"NamedImports",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FromClause

function FromClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            keyword_b("from"),
            whitespace_b,
            ModuleSpecifier_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportsList

function ImportsList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(ImportSpecifier_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    ImportSpecifier_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportSpecifier

function ImportSpecifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.bchoice([
            () => {
                b.items([
                    pos_b,             // 6 = start
                    IdentifierName_b,  // 5 = name
                    whitespace_b,      // 4
                    keyword_b("as"),   // 3
                    whitespace_b,      // 2
                    ImportedBinding_b, // 1 = binding
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ImportAsSpecifier",[5,1]));
            },
            () => {
                b.items([
                    pos_b,             // 2 = start
                    ImportedBinding_b, // 1 = binding
                    pos_b,             // 0 = end
                ]);
                b.assertLengthIs(oldLength+3);
                b.popAboveAndSet(2,makeNode(b,2,0,"ImportSpecifier",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ModuleSpecifier

function ModuleSpecifier_b(b: Builder): void {
    b.item(StringLiteral_b);
}

const ModuleSpecifier = pfun(ModuleSpecifier_b);

// ImportedBinding

function ImportedBinding_b(b: Builder): void {
    b.item(BindingIdentifier_b);
}

// Section 15.2.3

// ExportDeclaration

function ExportDeclaration_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,
            keyword_b("export"),
            whitespace_b,
        ]);
        b.assertLengthIs(oldLength+3);
        b.bchoice([
            () => {
                b.items([
                    keyword_b("default"),                              // 3
                    whitespace_b,                                      // 2
                    bfun(() => HoistableDeclaration(b.parser,{ Default: true })), // 1
                    pos_b,                                             // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.items([
                    keyword_b("default"), // 3
                    whitespace_b, // 2
                    bfun(() => ClassDeclaration(b.parser,{ Default: true })), // 1
                    pos_b, // 0
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.items([
                    keyword_b("default"), // 7
                    whitespace_b, // 6
                    notKeyword_b("function"), // 5 FIXME: need tests for this
                    notKeyword_b("class"), // 4 FIXME: need tests for this
                    AssignmentExpression_b, // 3
                    whitespace_b, // 2
                    punctuator_b(";"), // 1
                    pos_b, // 0
                ]);
                b.assertLengthIs(oldLength+11);
                b.popAboveAndSet(10,makeNode(b,10,0,"ExportDefault",[3]));
            },
            () => {
                b.items([
                    punctuator_b("*"), // 5
                    whitespace_b,      // 4
                    FromClause_b,      // 3
                    whitespace_b,      // 2
                    punctuator_b(";"), // 1
                    pos_b,             // 0
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"ExportStar",[3]));
            },
            () => {
                b.items([
                    ExportClause_b,    // 5
                    whitespace_b,      // 4
                    FromClause_b,      // 3
                    whitespace_b,      // 2
                    punctuator_b(";"), // 1
                    pos_b,             // 0
                ]);
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"ExportFrom",[5,3]));
            },
            () => {
                b.items([
                    ExportClause_b,    // 3
                    whitespace_b,      // 2
                    punctuator_b(";"), // 1
                    pos_b,             // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportPlain",[3]));
            },
            () => {
                b.items([
                    VariableStatement_b, // 1
                    pos_b,               // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportVariable",[1]));
            },
            () => {
                b.items([
                    Declaration_b, // 1
                    pos_b,         // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportDeclaration",[1]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ExportClause

function ExportClause_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos_b,                       // 5
            punctuator_b("{"),           // 4
            whitespace_b,                // 3
        ]);
        b.bchoice([                     // 2
            () => {
                b.item(ExportsList_b);
                b.item(whitespace_b);
                b.bopt(() => {
                    b.item(punctuator_b(","));
                    b.item(whitespace_b);
                    b.pop();
                });
                b.assertLengthIs(oldLength+6);
                b.popAboveAndSet(2,b.get(2));
                b.assertLengthIs(oldLength+4);
            },
            () => {
                b.item(pos_b);
                const curPos = checkNumber(b.get(0));
                b.popAboveAndSet(0,new ListNode(new Range(curPos,curPos),[]));
            },
        ]);
        b.assertLengthIs(oldLength+4);
        b.items([
            punctuator_b("}"),           // 1
            pos_b,                       // 0
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ExportClause",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ExportsList

function ExportsList_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.item(ExportSpecifier_b);
            },
            () => {
                b.items([
                    whitespace_b,
                    punctuator_b(","),
                    whitespace_b,
                    ExportSpecifier_b,
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ExportSpecifier

function ExportSpecifier_b(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos_b);
        b.item(IdentifierName_b);
        b.bchoice([
            () => {
                // let asIdent: IdentifierNode | ErrorNode;
                b.items([
                    whitespace_b,        // 4
                    keyword_b("as"),     // 3
                    whitespace_b,        // 2
                    IdentifierName_b,    // 1
                    pos_b,               // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(4,makeNode(b,6,0,"ExportAsSpecifier",[5,1]));
                b.assertLengthIs(oldLength+3);
            },
            () => {
                b.item(pos_b);
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
