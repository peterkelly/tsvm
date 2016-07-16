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
    // ArrayBindingPattern1Node,
    // ArrayBindingPattern2Node,
    // ArrayBindingPattern3Node,
    // BindingElisionElementNode,
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
    checkNode,
    checkExpressionNode,
    checkListNode,
    checkGenericNode,
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

// BindingIdentifier

function BindingIdentifier(p: Parser): BindingIdentifierNode | ErrorNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new BindingIdentifierNode(ident.range,ident.value);
}

// LabelIdentifier

function LabelIdentifier(p: Parser): ASTNode {
    const ident = Identifier(p);
    if (ident instanceof ErrorNode)
        return ident;
    else
        return new LabelIdentifierNode(ident.range,ident.value);
}

// IdentifierName

function IdentifierName(p: Parser): ASTNode {
    return Identifier(p);
}

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

// Section 12.2

// This

function This(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// PrimaryExpression

function PrimaryExpression(p: Parser): ASTNode {
    return p.choice<ASTNode>([
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

function ParenthesizedExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            punctuator("("), // 4
            whitespace,      // 3
            Expression,      // 2 = expr
            whitespace,      // 1
            punctuator(")"), // 0
        ]);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(1);
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.2.4

// Literal

function Literal(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        NullLiteral,
        BooleanLiteral,
        NumericLiteral,
        StringLiteral,
    ]);
}

// NullLiteral

function NullLiteral(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

function ArrayLiteral(p: Parser): ASTNode {
    return p.attempt((start) => {
        const b = new Builder(p);
        b.items([
            pos,
            punctuator("["),
            whitespace,
        ]);

        const elements: ASTNode[] = [];
        const listStart = p.pos;
        let listEnd = p.pos;
        let first = true;

        while (!p.lookaheadPunctuator("]")) {
            if (!first) {
                b.items([
                    punctuator(","),
                    whitespace,
                ]);
            }

            b.opt(() => {
                b.items([
                    Elision,
                    whitespace,
                ]);
                b.popAboveAndSet(1,b.get(1));
            });
            b.opt(() => {
                b.choice([
                    () => {
                        b.item(AssignmentExpression);
                    },
                    () => {
                        b.item(SpreadElement);
                    },
                ]);
            });

            const elision = checkNode(b.get(1));

            if (elision != null) {
                elements.push(elision);
                listEnd = elision.range.end;
            }
            const item = checkNode(b.get(0));
            if (item == null)
                break;

            elements.push(item);
            listEnd = p.pos;
            b.item(whitespace);
            first = false;
        }

        p.sequence([
            punctuator("]"),
        ]);

        const list = new ListNode(new Range(listStart,listEnd),elements);
        return new GenericNode(new Range(start,p.pos),"ArrayLiteral",[list]);
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
            p.sequence([
                whitespace,
                punctuator(","),
            ]);
            count++;
        }
        catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
            return new ElisionNode(new Range(start,p.pos),count);
        }
    }
}

// SpreadElement

function SpreadElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,
            punctuator("..."),
            whitespace,
            AssignmentExpression,
            pos,
        ]);
        b.popAboveAndSet(4,makeNode(b,4,0,"SpreadElement",[1]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);             // 5
        b.item(punctuator("{")); // 4
        b.item(whitespace);      // 3
        b.choice([               // 2 = properties
            () => {
                b.item(PropertyDefinitionList);
                b.item(whitespace);
                b.opt(() => {
                    b.item(punctuator(","));
                    b.item(whitespace);
                    b.popAboveAndSet(1,0);
                });
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(p.pos,p.pos),[]));
            },
        ]);
        b.item(punctuator("}")); // 1
        b.item(pos);             // 0 = end
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ObjectLiteral",[2]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// PropertyDefinitionList

function PropertyDefinitionList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(PropertyDefinition);
            },
            () => {
                b.items([
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

// PropertyDefinition_colon

function PropertyDefinition_colon(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// PropertyDefinition

function PropertyDefinition(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        PropertyDefinition_colon,
        CoverInitializedName,
        MethodDefinition,
        IdentifierReference,
    ]);
}

// PropertyName

function PropertyName(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        LiteralPropertyName,
        ComputedPropertyName,
    ]);
}

// LiteralPropertyName

function LiteralPropertyName(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        IdentifierName,
        StringLiteral,
        NumericLiteral,
    ]);
}

// ComputedPropertyName

function ComputedPropertyName(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// CoverInitializedName

function CoverInitializedName(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                 // 4 = start
            IdentifierReference, // 3 = ident
            whitespace,          // 2
            Initializer,         // 1 = init
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"CoverInitializedName",[3,1]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// Initializer

function Initializer(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            punctuator("="),
            whitespace,
            AssignmentExpression,
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(1);
        return checkExpressionNode(b.get(0));
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

function MemberExpression_new(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// MemberExpression_start

function MemberExpression_start(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        PrimaryExpression,
        SuperProperty,
        MetaProperty,
        MemberExpression_new,
    ]);
}

// MemberExpression

function MemberExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);
        b.item(MemberExpression_start);
        b.repeatChoice([
            () => {
                b.items([
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
                b.items([
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

// SuperProperty

function SuperProperty(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// MetaProperty

function MetaProperty(p: Parser): ASTNode {
    return NewTarget(p);
}

// NewTarget

function NewTarget(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// NewExpression

function NewExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.item(MemberExpression);
            },
            () => {
                b.items([
                    pos,            // 4 = start
                    keyword("new"), // 3
                    whitespace,     // 2
                    NewExpression,  // 1 = expr
                    pos,            // 0 = end
                ]);
                b.assertLengthIs(5);
                const start = checkNumber(b.get(4));
                const end = checkNumber(b.get(0));
                const expr = checkExpressionNode(b.get(1));
                b.popAboveAndSet(4,new GenericNode(new Range(start,p.pos),"NewExpression",[expr,null]));
            },
        ]);
        b.assertLengthIs(1);
        return checkExpressionNode(b.get(0));
    });
}

// CallExpression_start

function CallExpression_start(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.item(SuperCall);
            },
            () => {
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// CallExpression

function CallExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);
        b.item(CallExpression_start);
        b.repeatChoice([
            () => {
                b.items([
                    whitespace,      // 2
                    Arguments,       // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(3,makeNode(b,4,0,"Call",[3,1]));
            },
            () => {
                b.items([
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
                b.items([
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

// SuperCall

function SuperCall(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,              // 4 = start
            keyword("super"), // 3
            whitespace,       // 2
            Arguments,        // 1 = args
            pos,              // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"SuperCall",[1]));
        b.assertLengthIs(1);
        return checkExpressionNode(b.get(0));
    });
}

// Arguments

function Arguments(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// ArgumentList_item

function ArgumentList_item(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.item(AssignmentExpression);
            },
        ]);
        b.assertLengthIs(1);
        return checkExpressionNode(b.get(0));
    });
}

// ArgumentList

function ArgumentList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(ArgumentList_item);
            },
            () => {
                b.items([
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

// LeftHandSideExpression

function LeftHandSideExpression(p: Parser): ASTNode {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    return p.choice([
        CallExpression,
        NewExpression,
    ]);
}

// Section 12.4

// PostfixExpression

function PostfixExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);
        b.item(LeftHandSideExpression);
        b.choice([
            () => {
                b.items([
                    whitespaceNoNewline,
                    punctuator("++"),
                    pos,
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"PostIncrement",[3]));
            },
            () => {
                b.items([
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

// Section 12.5

// UnaryExpression

function UnaryExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.item(PostfixExpression);
            },
        ]);
        b.assertLengthIs(1);
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                  // 6 = start
        b.item(UnaryExpression);      // 5 = left
        b.repeatChoice([
            () => {
                b.items([
                    whitespace,       // 4
                    punctuator("*"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Multiply",[5,1]));
            },
            () => {
                b.items([
                    whitespace,       // 4
                    punctuator("/"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Divide",[5,1]));
            },
            () => {
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.7

// AdditiveExpression

function AdditiveExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                          // 6 = start
        b.item(MultiplicativeExpression);     // 5 = left
        b.repeatChoice([
            () => {
                b.items([
                    whitespace,               // 4
                    punctuator("+"),          // 3
                    whitespace,               // 2
                    MultiplicativeExpression, // 1 = right
                    pos,                      // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Add",[5,1]));
            },
            () => {
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.8

// ShiftExpression

function ShiftExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                    // 6 = start
        b.item(AdditiveExpression);     // 5 = left
        b.repeatChoice([
            () => {
                b.items([
                    whitespace,         // 4
                    punctuator("<<"),   // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"LeftShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace,         // 4
                    punctuator(">>>"),  // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"UnsignedRightShift",[5,1]));
            },
            () => {
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.9

// RelationalExpression

function RelationalExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);             // 6 = start
        b.item(ShiftExpression); // 5 = left
        b.repeatChoice([
            () => {
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.10

// EqualityExpression

function EqualityExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                      // 6 = start
        b.item(RelationalExpression);     // 5 = left
        b.repeatChoice([
            () => {
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                // 6 = start
        b.item(EqualityExpression); // 5 = left
        b.repeat(() => {
            b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// BitwiseXORExpression

function BitwiseXORExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                  // 6 = start
        b.item(BitwiseANDExpression); // 5 = left
        b.repeat(() => {
            b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// BitwiseORExpression

function BitwiseORExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                  // 6 = start
        b.item(BitwiseXORExpression); // 5 = left
        b.repeat(() => {
            b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                 // 6 = start
        b.item(BitwiseORExpression); // 5 = left
        b.repeat(() => {
            b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// LogicalORExpression

function LogicalORExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                  // 6 = start
        b.item(LogicalANDExpression); // 5 = left
        b.repeat(() => {
            b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.13

// ConditionalExpression

function ConditionalExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                      // 10 = start
        b.item(LogicalORExpression);      // 9 = condition
        b.choice([
            () => {
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                      // 6 = start
        b.item(LeftHandSideExpression);   // 5 = left
        b.choice([
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("="),      // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"Assign",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("*="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignMultiply",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("/="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignDivide",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("%="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignModulo",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("+="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignAdd",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("-="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignSubtract",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("<<="),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignLeftShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator(">>="),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignSignedRightShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator(">>>="),   // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignUnsignedRightShift",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("&="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseAND",[5,1]));
            },
            () => {
                b.items([
                    whitespace,           // 4
                    punctuator("^="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                ]);
                b.popAboveAndSet(5,makeNode(b,6,0,"AssignBitwiseXOR",[5,1]));
            },
            () => {
                b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// AssignmentExpression

function AssignmentExpression(p: Parser): ASTNode {
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

function Expression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);                  // 6 = start
        b.item(AssignmentExpression); // 5 = left
        b.repeat(() => {
            b.items([
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
        return checkExpressionNode(b.get(0));
    });
}

// Section 13

// Statement

function Statement(p: Parser): ASTNode {
    // return p.choice<StatementNode | ErrorNode>([
    return p.choice<ASTNode>([
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

function Declaration(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        HoistableDeclaration,
        ClassDeclaration,
        LexicalDeclaration,
    ]);
}

// HoistableDeclaration

function HoistableDeclaration(p: Parser, flags?: { Yield?: boolean, Default?: boolean }): ASTNode {
    return p.choice<ASTNode>([
        () => FunctionDeclaration(p,flags),
        () => GeneratorDeclaration(p,flags),
    ]);
}

// BreakableStatement

function BreakableStatement(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        IterationStatement,
        SwitchStatement,
    ]);
}

// Section 13.2

// BlockStatement

function BlockStatement(p: Parser): ASTNode {
    return Block(p);
}

// Block

function Block(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,               // 5
            punctuator("{"),   // 4
            whitespace,        // 3
            () => p.choice([   // 2 = statements
                () => p.seq2([
                    StatementList,
                    whitespace],
                    ([inner,]) => inner),
                () => new ListNode(new Range(p.pos,p.pos),[]),
            ]),
            punctuator("}"),   // 1
            pos,               // 0
        ]);
        b.popAboveAndSet(5,makeNode(b,5,0,"Block",[2]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// StatementList

function StatementList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(StatementListItem);
            },
            () => {
                b.items([
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

// StatementListItem

function StatementListItem(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        Statement,
        Declaration,
    ]);
}

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// BindingList

function BindingList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(LexicalBinding);
            },
            () => {
                b.items([
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

// LexicalBinding_identifier

function LexicalBinding_identifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,               // 3 = start
            BindingIdentifier, // 2 = identifier
            opt(() => p.seq2([ // 1 = initializer
                whitespace,
                Initializer],
                ([,inner]) => inner)),
            pos,               // 0 = end
        ]);
        b.assertLengthIs(4);
        b.popAboveAndSet(3,makeNode(b,3,0,"LexicalIdentifierBinding",[2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// LexicalBinding_pattern

function LexicalBinding_pattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,            // 4 = start
            BindingPattern, // 3 = pattern
            whitespace,     // 2
            Initializer,    // 1 = initializer
            pos,            // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"LexicalPatternBinding",[3,1]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// LexicalBinding

function LexicalBinding(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        LexicalBinding_identifier,
        LexicalBinding_pattern,
    ]);
}

// Section 13.3.2

// VariableStatement

function VariableStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// VariableDeclarationList

function VariableDeclarationList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(VariableDeclaration);
            },
            () => {
                b.items([
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

// VariableDeclaration_identifier

function VariableDeclaration_identifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);
        b.item(BindingIdentifier);
        b.choice([
            () => {
                b.items([
                    whitespace,
                    Initializer,
                    pos,
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarIdentifier",[3,1]));
            },
            () => {
                b.item(value(null));
                b.item(pos);
                b.assertLengthIs(4);
                b.popAboveAndSet(3,makeNode(b,3,0,"VarIdentifier",[2,1]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// VariableDeclaration_pattern

function VariableDeclaration_pattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,            // 4 = start
            BindingPattern, // 3 = pattern
            whitespace,     // 2
            Initializer,    // 1 = initializer
            pos,            // 0 = end
        ]);
        b.assertLengthIs(5);
        b.popAboveAndSet(4,makeNode(b,4,0,"VarPattern",[3,1]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// VariableDeclaration

function VariableDeclaration(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        VariableDeclaration_identifier,
        VariableDeclaration_pattern,
    ]);
}

// Section 13.3.3

// BindingPattern

function BindingPattern(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        ObjectBindingPattern,
        ArrayBindingPattern,
    ]);
}

// ObjectBindingPattern

function ObjectBindingPattern(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);              // 6 = start
        b.item(punctuator("{"));  // 5
        b.item(whitespace);       // 4
        b.item(pos);              // 3
        b.choice([                // 2 = properties
            () => {
                b.item(BindingPropertyList),
                b.item(whitespace),
                b.opt(() => {
                    b.item(punctuator(","));
                    b.item(whitespace);
                    b.popAboveAndSet(1,null);
                });
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(p.pos,p.pos),[]));
            },
        ]);
        b.item(punctuator("}"));  // 1
        b.item(pos);              // 0 = end
        b.assertLengthIs(7);
        const start = checkNumber(b.get(6));
        const end = checkNumber(b.get(0));
        b.popAboveAndSet(6,b.get(2));
        b.assertLengthIs(1);
        const properties = checkListNode(b.get(0));
        return new GenericNode(new Range(start,end),"ObjectBindingPattern",[properties]);
    });
}

// ArrayBindingPattern_1

function ArrayBindingPattern_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                       // 6 = start
            punctuator("["),           // 5
            whitespace,                // 4
            opt(() => p.seq2([         // 3 = elision
                Elision,
                whitespace],
                ([inner,]) => inner)),
            opt(() => p.seq2([         // 2 = rest
                BindingRestElement,
                whitespace],
                ([inner,]) => inner)),
            punctuator("]"),           // 1
            pos,                       // 0 = end
        ]);
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ArrayBindingPattern1",[3,2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ArrayBindingPattern_2

function ArrayBindingPattern_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                // 6 = start
            punctuator("["),    // 5
            whitespace,         // 4
            BindingElementList, // 3 = elements
            whitespace,         // 2
            punctuator("]"),    // 1
            pos,                // 0 = end
        ]);
        b.popAboveAndSet(6,makeNode(b,6,0,"ArrayBindingPattern2",[3]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// ArrayBindingPattern_3

function ArrayBindingPattern_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                // 10 = start
            punctuator("["),    // 9
            whitespace,         // 8
            BindingElementList, // 7 = elements
            whitespace,         // 6
            punctuator(","),    // 5
            whitespace,         // 4
            opt(() => {         // 3 = elision
                return p.seq2([
                    Elision,
                    whitespace],
                    ([inner,]) => inner);
            }),
            opt(() => {         // 2 = rest
                return p.seq2([
                    BindingRestElement,
                    whitespace],
                    ([inner,]) => inner);
            }),
            punctuator("]"),    // 1
            pos,                // 0
        ]);
        b.assertLengthIs(11);
        b.popAboveAndSet(10,makeNode(b,10,0,"ArrayBindingPattern3",[7,3,2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ArrayBindingPattern

function ArrayBindingPattern(p: Parser): ASTNode {
    return p.choice([
        ArrayBindingPattern_1,
        ArrayBindingPattern_2,
        ArrayBindingPattern_3,
    ]);
}

// BindingPropertyList

function BindingPropertyList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(BindingProperty);
            },
            () => {
                b.items([
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

// BindingElementList

function BindingElementList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(BindingElisionElement);
            },
            () => {
                b.items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    BindingElisionElement
                ]);
                b.popAboveAndSet(3,b.get(0));
            },
        );
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// BindingElisionElement

function BindingElisionElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
                    pos,            // 4 = start
                    Elision,        // 3 = elision
                    whitespace,     // 2
                    BindingElement, // 1 = element
                    pos,            // 0 = end
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"BindingElisionElement",[3,1]));
            },
            () => {
                b.item(BindingElement);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// BindingProperty

function BindingProperty(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.item(SingleNameBinding);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// BindingElement

function BindingElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.item(SingleNameBinding);
            },
            () => {
                b.item(pos);
                b.item(BindingPattern);
                b.choice([
                    () => {
                        b.items([
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

// SingleNameBinding

function SingleNameBinding(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);
        b.item(BindingIdentifier);
        b.choice([
            () => {
                b.items([
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

// BindingRestElement

function BindingRestElement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Section 13.4

// EmptyStatement

function EmptyStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        b.items([
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

// Section 13.6

// IfStatement

function IfStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
            opt(() => p.seq4([ // 1 = falseBranch
                whitespace,
                keyword("else"),
                whitespace,
                Statement],
                ([,,,fb]) => fb)),
            pos,               // 0 = end
        ]);
        b.assertLengthIs(12);
        b.popAboveAndSet(11,makeNode(b,11,0,"IfStatement",[6,2,1]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// Section 13.7

// IterationStatement_do

function IterationStatement_do(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// IterationStatement_while

function IterationStatement_while(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// IterationStatement_for_c

function IterationStatement_for_c(p: Parser): ASTNode {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                                                            // 14 = start
            keyword("for"),                                                 // 13
            whitespace,                                                     // 12
            punctuator("("),                                                // 11
            whitespace,                                                     // 10
        ]);
        b.assertLengthIs(5);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
                b.items([
                    LexicalDeclaration,
                    whitespace,
                ]);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                // initializer part can be empty, but need to distinguish this from an error
                b.items([
                    punctuator(";"),
                ]);
                b.popAboveAndSet(0,null);
            },
        ]);
        b.assertLengthIs(6);
        b.items([
            opt(Expression),                                                // 8 = condition
            whitespace,                                                     // 7
            punctuator(";"),                                                // 6
            whitespace,                                                     // 5
            opt(() => p.seq2([Expression,whitespace],([inner,]) => inner)), // 4 = update
            punctuator(")"),                                                // 3
            whitespace,                                                     // 2
            Statement,                                                      // 1 = body
            pos,
        ]);
        b.assertLengthIs(15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForC",[9,8,4,1]));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}

// IterationStatement_for_in

function IterationStatement_for_in(p: Parser): ASTNode {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(5);
        b.choice([ // 9 = binding
            () => {
                b.items([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    LeftHandSideExpression,
                ]);
                b.popAboveAndSet(2,b.get(0));
            },
            () => {
                b.items([
                    pos,
                    keyword("var"),
                    whitespace,
                    ForBinding,
                    pos,
                ]);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarForDeclaration",[1]));
            },
            () => {
                b.item(ForDeclaration);
            }
        ]);
        b.assertLengthIs(6);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// IterationStatement_for_of

function IterationStatement_for_of(p: Parser): ASTNode {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(5);
        b.choice([
            () => {
                b.items([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    LeftHandSideExpression
                ]);
                b.popAboveAndSet(2,b.get(0));
            },
            () => {
                b.items([
                    pos,
                    keyword("var"),
                    whitespace,
                    ForBinding,
                    pos
                ]);
                b.popAboveAndSet(4,makeNode(b,4,0,"VarForDeclaration",[1]));
            },
            () => {
                b.item(ForDeclaration);
            },
        ]);
        b.assertLengthIs(6);
        b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// IterationStatement_for

function IterationStatement_for(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        IterationStatement_for_c,
        IterationStatement_for_in,
        IterationStatement_for_of,
    ]);
}

// IterationStatement

function IterationStatement(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        IterationStatement_do,
        IterationStatement_while,
        IterationStatement_for,
    ]);
}

// ForDeclaration

function ForDeclaration(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
        return checkGenericNode(b.get(0));
    });
}

// ForBinding

function ForBinding(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        BindingIdentifier,
        BindingPattern, // FIXME: Need test cases for this
    ]);
}

// Section 13.8

// ContinueStatement

function ContinueStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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

// Section 13.9

// BreakStatement

function BreakStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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

// Section 13.10

// ReturnStatement

function ReturnStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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

// Section 13.11

// WithStatement

function WithStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Section 13.12

// SwitchStatement

function SwitchStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// CaseBlock_1

function CaseBlock_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,             // 7
            punctuator("{"), // 6
            whitespace,      // 5
            pos,             // 4 = midpos
        ]);
        b.choice([           // 3 = clauses
            () => {
                b.item(CaseClauses);
            },
            () => {
                const midpos = checkNumber(b.get(0));
                b.push(new ListNode(new Range(midpos,midpos),[]));
            },
        ]);
        b.items([
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

// CaseBlock_2

function CaseBlock_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// CaseBlock

function CaseBlock(p: Parser): ASTNode {
    return p.choice([
        CaseBlock_1,
        CaseBlock_2,
    ]);
}

// CaseClauses

function CaseClauses(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(CaseClause);
            },
            () => {
                b.items([
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

// CaseClause

function CaseClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// DefaultClause

function DefaultClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Section 13.13

// LabelledStatement

function LabelledStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// LabelledItem

function LabelledItem(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        Statement,
        FunctionDeclaration,
    ]);
}

// Section 13.14

// ThrowStatement

function ThrowStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Section 13.15

// TryStatement

function TryStatement(p: Parser): ASTNode {
    return p.attempt((start) => {
        const b = new Builder(p);
        b.item(pos);                   // 7 = start
        b.item(keyword("try"));        // 6
        b.item(whitespace);            // 5
        b.item(Block);                 // 4 = tryBlock
        b.choice([
            () => {
                b.item(whitespace);    // 3
                b.item(value(null));   // 2 = catchBlock
                b.item(Finally);       // 1 = finallyBlock
            },
            () => {
                b.item(whitespace);    // 3
                b.item(Catch);         // 2 = catchBlock
                b.opt(() => {          // 1 = finallyBlock
                    b.item(whitespace);
                    b.item(Finally);
                    b.popAboveAndSet(1,b.get(0));
                });
            },
        ]);
        b.item(pos);                   // 0 = end
        b.assertLengthIs(8);
        b.popAboveAndSet(7,makeNode(b,7,0,"TryStatement",[4,2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// Catch

function Catch(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Finally

function Finally(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// CatchParameter

function CatchParameter(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        BindingIdentifier,
        BindingPattern,
    ]);
}

// Section 13.16

// DebuggerStatement

function DebuggerStatement(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// FunctionExpression

function FunctionExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                 // 15 = start
            keyword("function"), // 14
            whitespace,          // 13
            opt(() => p.seq2([   // 12 = ident
                BindingIdentifier,
                whitespace],
                ([inner,]) => inner)),
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

// StrictFormalParameters

function StrictFormalParameters(p: Parser): ASTNode {
    return FormalParameters(p);
}

// FormalParameters

function FormalParameters(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.item(FormalParameterList);
            },
            () => {
                b.item(pos);
                b.popAboveAndSet(0,makeNode(b,0,0,"FormalParameters1",[]));
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// FormalParameterList

function FormalParameterList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
                    pos,                   // 2 = start
                    FunctionRestParameter, // 1 = rest
                    pos,                   // 0 = end
                ]);
                b.assertLengthIs(3);
                b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters2",[1]));
            },
            () => {
                b.item(pos);           // 3 = start
                b.item(FormalsList);   // 2 = formals
                b.choice([
                    () => {
                        b.items([
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
                        b.item(pos);
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

// FormalsList

function FormalsList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(FormalParameter);
            },
            () => {
                b.items([
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
    return p.choice([
        StatementList,
        () => new ListNode(new Range(p.pos,p.pos),[]),
    ]);
}

// Section 14.2

// ArrowFunction

function ArrowFunction(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ArrowParameters

function ArrowParameters(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        BindingIdentifier,
        ArrowFormalParameters,
    ]);
}

// ConciseBody_1

function ConciseBody_1(p: Parser): ASTNode {
    if (p.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    return AssignmentExpression(p);
}

// ConciseBody_2

function ConciseBody_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ConciseBody

function ConciseBody(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        ConciseBody_1,
        ConciseBody_2,
    ]);
}

// ArrowFormalParameters

function ArrowFormalParameters(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// Section 14.3

// MethodDefinition_1

function MethodDefinition_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// MethodDefinition_2

function MethodDefinition_2(p: Parser): ASTNode {
    return GeneratorMethod(p);
}

// MethodDefinition_3

function MethodDefinition_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// MethodDefinition_4

function MethodDefinition_4(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// MethodDefinition

function MethodDefinition(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        MethodDefinition_1,
        MethodDefinition_2,
        MethodDefinition_3,
        MethodDefinition_4,
    ]);
}

// PropertySetParameterList

function PropertySetParameterList(p: Parser): ASTNode {
    return FormalParameter(p);
}

// Section 14.4

// GeneratorMethod

function GeneratorMethod(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// GeneratorDeclaration_1

function GeneratorDeclaration_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// GeneratorDeclaration_2

function GeneratorDeclaration_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// GeneratorExpression

function GeneratorExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                 // 17 = start
            keyword("function"), // 16
            whitespace,          // 15
            punctuator("*"),     // 14
            whitespace,          // 13
        ]);
        b.opt(() => {            // 12 = ident
            b.items([
                BindingIdentifier,
                whitespace,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.items([
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

// GeneratorBody

function GeneratorBody(p: Parser): ASTNode {
    return FunctionBody(p);
}

// YieldExpression_1

function YieldExpression_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// YieldExpression_2

function YieldExpression_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// YieldExpression_3

function YieldExpression_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// YieldExpression

function YieldExpression(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        YieldExpression_1,
        YieldExpression_2,
        YieldExpression_3,
    ]);
}

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ClassDeclaration_2

function ClassDeclaration_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ClassExpression

function ClassExpression(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);              // 5
        b.item(keyword("class")); // 4
        b.item(whitespace);       // 3
        b.opt(() => {             // 2
            b.items([
                BindingIdentifier,
                whitespace,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.item(ClassTail);        // 1
        b.item(pos);              // 0
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassExpression",[2,1]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ClassTail

function ClassTail(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);               // 6 = start
        b.opt(() => {              // 5 = heritage
            b.items([
                ClassHeritage,
                whitespace,
            ]);
            b.popAboveAndSet(1,b.get(1));
        });
        b.item(punctuator("{"));   // 4
        b.item(whitespace);        // 3
        b.choice([                 // 2 = body
            () => {
                b.items([
                    ClassBody,
                    whitespace,
                ]);
                b.popAboveAndSet(1,b.get(1));
            },
            () => {
                b.item(pos);
                b.popAboveAndSet(0,makeEmptyListNode(b,0,0));
            },
        ]);
        b.item(punctuator("}"));   // 1
        b.item(pos);               // 0 = end
        b.assertLengthIs(7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassTail",[5,2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ClassHeritage

function ClassHeritage(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ClassBody

function ClassBody(p: Parser): ASTNode {
    return ClassElementList(p);
}

// ClassElementList

function ClassElementList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(ClassElement);
            },
            () => {
                b.item(whitespace);
                b.item(ClassElement);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ClassElement_1

function ClassElement_1(p: Parser): ASTNode {
    return MethodDefinition(p);
}

// ClassElement_2

function ClassElement_2(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ClassElement_3

function ClassElement_3(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ClassElement

function ClassElement(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        ClassElement_1,
        ClassElement_2,
        ClassElement_3,
    ]);
}

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

// ScriptBody

function ScriptBody(p: Parser): ASTNode {
    return StatementList(p);
}

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

// ModuleBody

function ModuleBody(p: Parser): ASTNode {
    return ModuleItemList(p);
}

// ModuleItemList

function ModuleItemList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(ModuleItem);
            },
            () => {
                b.item(whitespace);
                b.item(ModuleItem);
                b.popAboveAndSet(1,b.get(0));
            },
        );
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ModuleItem

function ModuleItem(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        ImportDeclaration,
        ExportDeclaration,
        StatementListItem,
    ]);
}

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ImportDeclaration_module

function ImportDeclaration_module(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ImportDeclaration

function ImportDeclaration(p: Parser): ASTNode {
    return p.choice<ASTNode>([
        ImportDeclaration_from,
        ImportDeclaration_module,
    ]);
}

// ImportClause

function ImportClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.item(NameSpaceImport);
            },
            () => {
                b.item(NamedImports);
            },
            () => {
                b.item(pos);                    // 6 = start
                b.item(ImportedDefaultBinding); // 5 = defbinding
                b.choice([
                    () => {
                        b.items([
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
                        b.items([
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
                        b.item(pos);
                        b.popAboveAndSet(2,makeNode(b,2,0,"DefaultImport",[1]));
                    },
                ]);
            },
        ]);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ImportedDefaultBinding

function ImportedDefaultBinding(p: Parser): ASTNode {
    return ImportedBinding(p);
}

// NameSpaceImport

function NameSpaceImport(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// NamedImports

function NamedImports(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                // 5 = start
            punctuator("{"),    // 4
            whitespace,         // 3
        ]);
        b.choice([              // 2 = imports
            () => {
                b.items([
                    ImportsList,
                    whitespace,
                    opt(() => p.seq2([punctuator(","),whitespace],() => {})),
                ]);
                b.assertLengthIs(6);
                b.popAboveAndSet(2,b.get(2));
            },
            () => {
                b.push(new ListNode(new Range(p.pos,p.pos),[]));
            },
        ]);
        b.items([
            punctuator("}"),    // 1
            pos,                // 0 = end
        ]);
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"NamedImports",[2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// FromClause

function FromClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
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

// ImportsList

function ImportsList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(ImportSpecifier);
            },
            () => {
                b.items([
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

// ImportSpecifier

function ImportSpecifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.choice([
            () => {
                b.items([
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
                b.items([
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
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,
            keyword("export"),
            whitespace,
        ]);
        b.assertLengthIs(3);
        b.choice([
            () => {
                b.items([
                    keyword("default"),                              // 3
                    whitespace,                                      // 2
                    () => HoistableDeclaration(p,{ Default: true }), // 1
                    pos,                                             // 0
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.items([
                    keyword("default"), // 3
                    whitespace, // 2
                    () => ClassDeclaration(p,{ Default: true }), // 1
                    pos, // 0
                ]);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
                    ExportClause,    // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportPlain",[3]));
            },
            () => {
                b.items([
                    VariableStatement, // 1
                    pos,               // 0
                ]);
                b.assertLengthIs(5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportVariable",[1]));
            },
            () => {
                b.items([
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

// ExportClause

function ExportClause(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.items([
            pos,                       // 5
            punctuator("{"),           // 4
            whitespace,                // 3
        ]);
        b.choice([                     // 2
            () => {
                b.items([
                    ExportsList,
                    whitespace,
                    opt(() => {
                        p.sequence([
                            punctuator(","),
                            whitespace,
                        ]);
                    }),
                ]);
                b.assertLengthIs(6);
                b.popAboveAndSet(2,b.get(2));
                b.assertLengthIs(4);
            },
            () => {
                b.item(pos);
                const curPos = checkNumber(b.get(0));
                b.popAboveAndSet(0,new ListNode(new Range(curPos,curPos),[]));
            },
        ]);
        b.assertLengthIs(4);
        b.items([
            punctuator("}"),           // 1
            pos,                       // 0
        ]);
        b.assertLengthIs(6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ExportClause",[2]));
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

// ExportsList

function ExportsList(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.list(
            () => {
                b.item(ExportSpecifier);
            },
            () => {
                b.items([
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

// ExportSpecifier

function ExportSpecifier(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        b.item(pos);
        b.item(IdentifierName);
        b.choice([
            () => {
                // let asIdent: IdentifierNode | ErrorNode;
                b.items([
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
                b.item(pos);
                b.assertLengthIs(3);
                b.popAboveAndSet(0,makeNode(b,2,0,"ExportNormalSpecifier",[1]));
            },
        ]);
        b.assertLengthIs(3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(1);
        return checkGenericNode(b.get(0));
    });
}
