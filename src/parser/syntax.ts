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
    CastError,
    Range,
    ASTNode,
    IdentifierReferenceNode,
    BindingIdentifierNode,
    LabelIdentifierNode,
    IdentifierNode,
    BooleanLiteralNode,
    NumericLiteralNode,
    StringLiteralNode,
    ListNode,
    ErrorNode,
    GenericNode,
} from "./ast";
import {
    Builder,
    opt,
    choice,
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
    checkListNode,
    checkNumber,
    makeNode,
    makeEmptyListNode,
} from "./grammar";

// Section 12.1

// IdentifierReference

function IdentifierReference(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier);
    b.assertLengthIs(oldLength+1);
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.popAboveAndSet(0,new IdentifierReferenceNode(ident.range,ident.value));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// BindingIdentifier

function BindingIdentifier(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier);
    b.assertLengthIs(oldLength+1);
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.popAboveAndSet(0,new BindingIdentifierNode(ident.range,ident.value));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// LabelIdentifier

function LabelIdentifier(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier);
    b.assertLengthIs(oldLength+1);
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.popAboveAndSet(0,new LabelIdentifierNode(ident.range,ident.value));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// IdentifierName

function IdentifierName(b: Builder): void {
    b.item(Identifier);
}

// Identifier

export function Identifier(b: Builder): void {
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

function This(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("this"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"This",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// PrimaryExpression

function PrimaryExpression(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        This,
        // Literal must come before IdentifierReference, since "true", "false", and "null" are not keywords
        Literal,
        IdentifierReference,
        ArrayLiteral,
        ObjectLiteral,
        FunctionExpression,
        ClassExpression,
        GeneratorExpression,
        // RegularExpressionLiteral_b, // TODO
        // TemplateLiteral_b, // TODO
        ParenthesizedExpression,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ParenthesizedExpression

function ParenthesizedExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            punctuator("("), // 4
            whitespace,      // 3
            Expression,      // 2 = expr
            whitespace,      // 1
            punctuator(")"), // 0
        ]);
        b.popAboveAndSet(4,b.get(2));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.2.4

// Literal

function Literal(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        NullLiteral,
        BooleanLiteral,
        NumericLiteral,
        StringLiteral,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// NullLiteral

function NullLiteral(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("null"),
            pos,
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,makeNode(b,2,0,"NullLiteral",[]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BooleanLiteral

function BooleanLiteral(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        () => {
            b.items([
                pos,
                keyword("true"),
                pos,
            ]);
            b.assertLengthIs(oldLength+3);
            const start = checkNumber(b.get(2));
            const end = checkNumber(b.get(0));
            b.popAboveAndSet(2,new BooleanLiteralNode(new Range(start,end),true));
        },
        () => {
            b.items([
                pos,
                keyword("false"),
                pos,
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

function NumericLiteral(b: Builder): void {
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

function StringLiteral(b: Builder): void {
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

function ArrayLiteral(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        const start = b.parser.pos;
        b.item(pos);
        b.item(punctuator("["));
        b.item(whitespace);

        const elements: ASTNode[] = [];
        const listStart = b.parser.pos;
        let listEnd = b.parser.pos;

        b.assertLengthIs(oldLength+3);

        b.opt(() => {
            b.item(pos);             // 3 = before
            b.item(punctuator(",")); // 2
            b.item(pos);             // 1 = after
            b.item(whitespace);      // 0
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
                b.choice([
                    () => {
                        b.items([
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
                        b.item(AssignmentExpression);
                        b.item(whitespace);
                        b.opt(() => {
                            b.item(punctuator(","));
                            b.item(whitespace);
                            b.pop();
                        });
                        b.assertLengthIs(oldLength+7);
                        b.popAboveAndSet(2,checkNode(b.get(2)));
                        b.assertLengthIs(oldLength+5);
                    },
                    () => {
                        b.item(SpreadElement);
                        b.item(whitespace);
                        b.opt(() => {
                            b.item(punctuator(","));
                            b.item(whitespace);
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

function SpreadElement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 12.2.6

// ObjectLiteral

function ObjectLiteral(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 5
            punctuator("{"),     // 4
            whitespace,          // 3
            choice([             // 2 = properties
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
                    b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
                },
            ]),
            punctuator("}"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ObjectLiteral",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// PropertyDefinitionList

function PropertyDefinitionList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// PropertyDefinition_colon

function PropertyDefinition_colon(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// PropertyDefinition

function PropertyDefinition(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        PropertyDefinition_colon,
        CoverInitializedName,
        MethodDefinition,
        IdentifierReference,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// PropertyName

function PropertyName(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        LiteralPropertyName,
        ComputedPropertyName,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// LiteralPropertyName

function LiteralPropertyName(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        IdentifierName,
        StringLiteral,
        NumericLiteral,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ComputedPropertyName

function ComputedPropertyName(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// CoverInitializedName

function CoverInitializedName(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Initializer

function Initializer(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 12.2.9

// TemplateLiteral

function TemplateLiteral(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// TemplateSpans

function TemplateSpans(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// TemplateMiddleList

function TemplateMiddleList(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// Section 12.3

// MemberExpression_new

function MemberExpression_new(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// MemberExpression_start

function MemberExpression_start(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        PrimaryExpression,
        SuperProperty,
        MetaProperty,
        MemberExpression_new,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// MemberExpression

function MemberExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+9);
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

function SuperProperty(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"SuperPropertyExpr",[3]));
                b.assertLengthIs(oldLength+1);
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

function MetaProperty(b: Builder): void {
    b.item(NewTarget);
}

// NewTarget

function NewTarget(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// NewExpression

function NewExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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

function CallExpression_start(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"Call",[3,1]));
            },
        ])
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CallExpression

function CallExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos);
        b.item(CallExpression_start);
        b.repeatChoice([
            () => {
                b.items([
                    whitespace,      // 2
                    Arguments,       // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(oldLength+5);
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
                b.assertLengthIs(oldLength+9);
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

function SuperCall(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Arguments

function Arguments(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+6);
                const start = checkNumber(b.get(5));
                const end = checkNumber(b.get(0));
                const listpos = checkNumber(b.get(2));
                const args = new ListNode(new Range(listpos,listpos),[]);
                b.popAboveAndSet(5,new GenericNode(new Range(start,b.parser.pos),"Arguments",[args]));
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
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"Arguments",[3]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ArgumentList_item

function ArgumentList_item(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.items([
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
                b.item(AssignmentExpression);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ArgumentList

function ArgumentList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LeftHandSideExpression

function LeftHandSideExpression(b: Builder): void {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    const oldLength = b.length;
    b.choice([
        CallExpression,
        NewExpression,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 12.4

// PostfixExpression

function PostfixExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            LeftHandSideExpression,
            choice([
                () => {
                    b.items([
                        whitespaceNoNewline,
                        punctuator("++"),
                        pos,
                    ]);
                    b.assertLengthIs(oldLength+5);
                    b.popAboveAndSet(4,makeNode(b,4,0,"PostIncrement",[3]));
                },
                () => {
                    b.items([
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
            ]),
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.5

// UnaryExpression

function UnaryExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.item(PostfixExpression);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.7

// AdditiveExpression

function AdditiveExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.8

// ShiftExpression

function ShiftExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.9

// RelationalExpression

function RelationalExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"LessEqual",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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
                b.items([
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

// Section 12.10

// EqualityExpression

function EqualityExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(5,makeNode(b,6,0,"StrictEquals",[5,1]));
                b.assertLengthIs(oldLength+2);
            },
            () => {
                b.items([
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
                b.items([
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
                b.items([
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

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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

        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BitwiseXORExpression

function BitwiseXORExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BitwiseORExpression

function BitwiseORExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LogicalORExpression

function LogicalORExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.13

// ConditionalExpression

function ConditionalExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                              // 10 = start
            LogicalORExpression,              // 9 = condition
            choice([
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
            ]),
        ]);
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                              // 6 = start
            LeftHandSideExpression,           // 5 = left
            choice([
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
            ]),
        ]);
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// AssignmentExpression

function AssignmentExpression(b: Builder): void {
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    const oldLength = b.length;
    b.choice([
        ArrowFunction,
        AssignmentExpression_plain,
        ConditionalExpression,
        YieldExpression,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 12.15

// Expression

function Expression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+2);
        b.popAboveAndSet(1,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13

// Statement

function Statement(b: Builder): void {
    const oldLength = b.length;
    b.choice([
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
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Declaration

function Declaration(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        HoistableDeclaration,
        ClassDeclaration,
        LexicalDeclaration,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// HoistableDeclaration

function HoistableDeclaration(b: Builder): void {
    b.choice([
        FunctionDeclaration,
        GeneratorDeclaration,
    ]);
}

// BreakableStatement

function BreakableStatement(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        IterationStatement,
        SwitchStatement,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.2

// BlockStatement

function BlockStatement(b: Builder): void {
    b.item(Block);
}

// Block

function Block(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 5
            punctuator("{"),     // 4
            whitespace,          // 3
            choice([             // 2 = statements
                () => {
                    b.item(StatementList);
                    b.item(whitespace);
                    b.popAboveAndSet(1,b.get(1));
                },
                () => {
                    b.item(pos);
                    const position = checkNumber(b.get(0));
                    b.popAboveAndSet(0,new ListNode(new Range(position,position),[]));
                },
            ]),
            punctuator("}"),     // 1
            pos,                 // 0
        ]);
        b.popAboveAndSet(5,makeNode(b,5,0,"Block",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// StatementList

function StatementList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// StatementListItem

function StatementListItem(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        Statement,
        Declaration,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingList

function BindingList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LexicalBinding_identifier

function LexicalBinding_identifier(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(pos);               // 3 = start
        b.item(BindingIdentifier); // 2 = identifier
        b.opt(() => {              // 1 = initializer
            b.item(whitespace);
            b.item(Initializer);
            b.popAboveAndSet(1,b.get(0));
        });
        b.item(pos);               // 0 = end
        b.assertLengthIs(oldLength+4);
        b.popAboveAndSet(3,makeNode(b,3,0,"LexicalIdentifierBinding",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// LexicalBinding_pattern

function LexicalBinding_pattern(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// LexicalBinding

function LexicalBinding(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        LexicalBinding_identifier,
        LexicalBinding_pattern,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.3.2

// VariableStatement

function VariableStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// VariableDeclarationList

function VariableDeclarationList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// VariableDeclaration_identifier

function VariableDeclaration_identifier(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            BindingIdentifier,
            choice([
                () => {
                    b.items([
                        whitespace,
                        Initializer,
                        pos,
                    ]);
                    b.assertLengthIs(oldLength+5);
                    b.popAboveAndSet(4,makeNode(b,4,0,"VarIdentifier",[3,1]));
                },
                () => {
                    b.item(value(null));
                    b.item(pos);
                    b.assertLengthIs(oldLength+4);
                    b.popAboveAndSet(3,makeNode(b,3,0,"VarIdentifier",[2,1]));
                },
            ]),
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// VariableDeclaration_pattern

function VariableDeclaration_pattern(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// VariableDeclaration

function VariableDeclaration(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        VariableDeclaration_identifier,
        VariableDeclaration_pattern,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.3.3

// BindingPattern

function BindingPattern(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        ObjectBindingPattern,
        ArrayBindingPattern,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ObjectBindingPattern

function ObjectBindingPattern(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 6 = start
            punctuator("{"),      // 5
            whitespace,           // 4
            pos,                  // 3
            choice([              // 2 = properties
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
                    b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
                },
            ]),
        ]);
        b.item(punctuator("}"));  // 1
        b.item(pos);              // 0 = end
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

function ArrayBindingPattern(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 7 = start
            punctuator("["),     // 6
            whitespace,          // 5
            BindingElementList,  // 4 = elements
            whitespace,          // 3
        ]);
        b.opt(() => {            // 2 = rest
            b.item(BindingRestElement);
            b.item(whitespace);
            b.popAboveAndSet(1,b.get(1));
        });
        b.items([
            punctuator("]"),     // 1
            pos,                 // 0 = end
        ]);
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"ArrayBindingPattern",[4,2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingPropertyList

function BindingPropertyList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingElementList

function BindingElementList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            () => {
                b.opt(() => {
                    b.item(pos);
                    b.item(punctuator(","));
                    b.item(pos);
                    b.popAboveAndSet(2,makeNode(b,2,0,"Elision",[]));
                });
            },
            () => {
                b.choice([
                    () => {
                        b.items([
                            whitespace,      // 3
                            pos,             // 2 = before
                            punctuator(","), // 1
                            pos,             // 0 = after
                        ]);
                        b.popAboveAndSet(3,makeNode(b,2,0,"Elision",[]));
                    },
                    () => {
                        b.item(whitespace);
                        b.item(BindingElement);
                        b.opt(() => {
                            b.item(whitespace);
                            b.item(punctuator(","));
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

function BindingProperty(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"BindingProperty",[5,1]));
            },
            () => {
                // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
                // and PropertyName will match an identifier at the start of a colon binding
                b.item(SingleNameBinding);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingElement

function BindingElement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.item(SingleNameBinding);
            },
            () => {
                b.items([
                    pos,
                    BindingPattern,
                    choice([
                        () => {
                            b.items([
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
                    ]),
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// SingleNameBinding

function SingleNameBinding(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            BindingIdentifier,
            choice([
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
            ]),
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// BindingRestElement

function BindingRestElement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 13.4

// EmptyStatement

function EmptyStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 13.5

// ExpressionStatement

function ExpressionStatement(b: Builder): void {
    const p = b.parser;
    const start2 = p.pos;

    // Lookahead not in one of the four sequences <{> <function> <class> <let [>

    if (p.lookaheadPunctuator("{") || p.lookaheadKeyword("function") || p.lookaheadKeyword("class"))
        throw new ParseIgnore();

    if (p.matchKeyword("let")) {
        p.skipWhitespace();
        if (p.matchPunctuator("[")) {
            p.pos = start2;
            throw new ParseIgnore();
        }
    }
    p.pos = start2;

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 13.6

// IfStatement

function IfStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        ]);
        b.opt(() => {          // 1 = falseBranch
            b.items([
                whitespace,
                keyword("else"),
                whitespace,
                Statement,
            ]);
            b.popAboveAndSet(3,b.get(0));
        });
        b.item(pos);           // 0 = end
        b.assertLengthIs(oldLength+12);
        b.popAboveAndSet(11,makeNode(b,11,0,"IfStatement",[6,2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.7

// IterationStatement_do

function IterationStatement_do(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"DoStatement",[11,5]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_while

function IterationStatement_while(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WhileStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for_c

function IterationStatement_for_c(b: Builder): void {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                                            // 14 = start
            keyword("for"),                                                 // 13
            whitespace,                                                     // 12
            punctuator("("),                                                // 11
            whitespace,                                                     // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.choice([
            () => {
                b.items([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    Expression,
                    whitespace,
                    punctuator(";"),
                    whitespace,
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
        b.assertLengthIs(oldLength+6);
        b.item(opt(Expression)); // 8 = condition
        b.item(whitespace);      // 7
        b.item(punctuator(";")); // 6
        b.item(whitespace);      // 5
        b.opt(() => {            // 4 = update
            b.item(Expression);
            b.item(whitespace);
            b.popAboveAndSet(1,b.get(1));
        });
        b.item(punctuator(")")); // 3
        b.item(whitespace);      // 2
        b.item(Statement);       // 1 = body
        b.item(pos);             // 0 = end
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForC",[9,8,4,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for_in

function IterationStatement_for_in(b: Builder): void {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(oldLength+5);
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
        b.assertLengthIs(oldLength+6);
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
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForIn",[9,5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for_of

function IterationStatement_for_of(b: Builder): void {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                           // 14 = start
            keyword("for"),                                // 13
            whitespace,                                    // 12
            punctuator("("),                               // 11
            whitespace,                                    // 10
        ]);
        b.assertLengthIs(oldLength+5);
        b.choice([
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
            },
        ]);
        b.assertLengthIs(oldLength+6);
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
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"ForOf",[9,5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// IterationStatement_for

function IterationStatement_for(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        IterationStatement_for_c,
        IterationStatement_for_in,
        IterationStatement_for_of,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// IterationStatement

function IterationStatement(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        IterationStatement_do,
        IterationStatement_while,
        IterationStatement_for,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ForDeclaration

function ForDeclaration(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.items([
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
                b.items([
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

// ForBinding

function ForBinding(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        BindingIdentifier,
        BindingPattern, // FIXME: Need test cases for this
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.8

// ContinueStatement

function ContinueStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+6);
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

function BreakStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+6);
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

function ReturnStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+6);
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

function WithStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"WithStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Section 13.12

// SwitchStatement

function SwitchStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"SwitchStatement",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CaseBlock_1

function CaseBlock_1(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,             // 7
            punctuator("{"), // 6
            whitespace,      // 5
            pos,             // 4 = midpos
            choice([           // 3 = clauses
                () => {
                    b.item(CaseClauses);
                },
                () => {
                    const midpos = checkNumber(b.get(0));
                    b.push(new ListNode(new Range(midpos,midpos),[]));
                },
            ]),
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

// CaseBlock_2

function CaseBlock_2(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"CaseBlock2",[7,5,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CaseBlock

function CaseBlock(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        CaseBlock_1,
        CaseBlock_2,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// CaseClauses

function CaseClauses(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// CaseClause

function CaseClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+9);
        b.popAboveAndSet(8,makeNode(b,8,0,"CaseClause",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// DefaultClause

function DefaultClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 13.13

// LabelledStatement

function LabelledStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// LabelledItem

function LabelledItem(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        Statement,
        FunctionDeclaration,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.14

// ThrowStatement

function ThrowStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 13.15

// TryStatement

function TryStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                         // 7 = start
            keyword("try"),              // 6
            whitespace,                  // 5
            Block,                       // 4 = tryBlock
            choice([
                () => {
                    b.item(whitespace);  // 3
                    b.item(value(null)); // 2 = catchBlock
                    b.item(Finally);     // 1 = finallyBlock
                },
                () => {
                    b.item(whitespace);  // 3
                    b.item(Catch);       // 2 = catchBlock
                    b.opt(() => {        // 1 = finallyBlock
                        b.item(whitespace);
                        b.item(Finally);
                        b.popAboveAndSet(1,b.get(0));
                    });
                },
            ]),
            pos,                         // 0 = end
        ]);
        b.assertLengthIs(oldLength+8);
        b.popAboveAndSet(7,makeNode(b,7,0,"TryStatement",[4,2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Catch

function Catch(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+11);
        b.popAboveAndSet(10,makeNode(b,10,0,"Catch",[5,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// Finally

function Finally(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// CatchParameter

function CatchParameter(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        BindingIdentifier,
        BindingPattern,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 13.16

// DebuggerStatement

function DebuggerStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 14.1

// FunctionDeclaration_named

function FunctionDeclaration_named(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"FunctionDeclaration",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FunctionDeclaration_unnamed

function FunctionDeclaration_unnamed(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+16);
        b.popAboveAndSet(15,makeNode(b,15,0,"FunctionDeclaration",[10,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FunctionDeclaration

function FunctionDeclaration(b: Builder): void {
    b.choice([
        FunctionDeclaration_named,
        FunctionDeclaration_unnamed,
    ]);
}

// FunctionExpression

function FunctionExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 15 = start
            keyword("function"), // 14
            whitespace,          // 13
        ]);
        b.opt(() => {
            b.item(BindingIdentifier);
            b.item(whitespace);
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

// StrictFormalParameters

function StrictFormalParameters(b: Builder): void {
    b.item(FormalParameters);
}

// FormalParameters

function FormalParameters(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.item(FormalParameterList);
            },
            () => {
                b.item(pos);
                b.popAboveAndSet(0,makeNode(b,0,0,"FormalParameters1",[]));
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FormalParameterList

function FormalParameterList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.items([
                    pos,                   // 2 = start
                    FunctionRestParameter, // 1 = rest
                    pos,                   // 0 = end
                ]);
                b.assertLengthIs(oldLength+3);
                b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters2",[1]));
            },
            () => {
                b.items([
                    pos,               // 3 = start
                    FormalsList,       // 2 = formals
                    choice([
                        () => {
                            b.items([
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
                            b.item(pos);
                            b.assertLengthIs(oldLength+3);
                            b.popAboveAndSet(2,makeNode(b,2,0,"FormalParameters3",[1]));
                        },
                    ]),
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
    });
}

// FormalsList

function FormalsList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FunctionRestParameter

function FunctionRestParameter(b: Builder): void {
    b.item(BindingRestElement);
}

// FormalParameter

function FormalParameter(b: Builder): void {
    b.item(BindingElement);
}

// FunctionBody

function FunctionBody(b: Builder): void {
    b.item(FunctionStatementList);
}

// FunctionStatementList

function FunctionStatementList(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        StatementList,
        () => b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[])),
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 14.2

// ArrowFunction

function ArrowFunction(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ArrowParameters

function ArrowParameters(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        BindingIdentifier,
        ArrowFormalParameters,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ConciseBody_1

function ConciseBody_1(b: Builder): void {
    if (b.parser.lookaheadPunctuator("{"))
        throw new ParseIgnore();
    b.item(AssignmentExpression);
}

// ConciseBody_2

function ConciseBody_2(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ConciseBody

function ConciseBody(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        ConciseBody_1,
        ConciseBody_2,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ArrowFormalParameters

function ArrowFormalParameters(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// Section 14.3

// MethodDefinition_1

function MethodDefinition_1(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Method",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// MethodDefinition_2

function MethodDefinition_2(b: Builder): void {
    b.item(GeneratorMethod);
}

// MethodDefinition_3

function MethodDefinition_3(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+15);
        b.popAboveAndSet(14,makeNode(b,14,0,"Getter",[11,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// MethodDefinition_4

function MethodDefinition_4(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"Setter",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// MethodDefinition

function MethodDefinition(b: Builder): void {
    b.choice([
        MethodDefinition_1,
        MethodDefinition_2,
        MethodDefinition_3,
        MethodDefinition_4,
    ]);
}

// PropertySetParameterList

function PropertySetParameterList(b: Builder): void {
    b.item(FormalParameter);
}

// Section 14.4

// GeneratorMethod

function GeneratorMethod(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+17);
        b.popAboveAndSet(16,makeNode(b,16,0,"GeneratorMethod",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration_1

function GeneratorDeclaration_1(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+19);
        b.popAboveAndSet(18,makeNode(b,18,0,"GeneratorDeclaration",[13,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration_2

function GeneratorDeclaration_2(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+17);
        // FIXME: Should be DefaultGeneratorDeclaration
        b.popAboveAndSet(16,makeNode(b,16,0,"DefaultGeneratorDeclaration",[9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration

function GeneratorDeclaration(b: Builder): void {
    b.choice([
        GeneratorDeclaration_1,
        GeneratorDeclaration_2,
    ]);
}

// GeneratorExpression

function GeneratorExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+18);
        b.popAboveAndSet(17,makeNode(b,17,0,"GeneratorExpression",[12,9,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// GeneratorBody

function GeneratorBody(b: Builder): void {
    b.item(FunctionBody);
}

// YieldExpression_1

function YieldExpression_1(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// YieldExpression_2

function YieldExpression_2(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// YieldExpression_3

function YieldExpression_3(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// YieldExpression

function YieldExpression(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        YieldExpression_1,
        YieldExpression_2,
        YieldExpression_3,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 14.5

// ClassDeclaration_1

function ClassDeclaration_1(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ClassDeclaration_2

function ClassDeclaration_2(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ClassDeclaration

function ClassDeclaration(b: Builder): void {
    b.choice([
        ClassDeclaration_1,
        ClassDeclaration_2,
    ]);
}

// ClassExpression

function ClassExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ClassExpression",[2,1]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassTail

function ClassTail(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                   // 6 = start
            opt(() => {            // 5 = heritage
                b.items([
                    ClassHeritage,
                    whitespace,
                ]);
                b.popAboveAndSet(1,b.get(1));
            }),
            punctuator("{"),       // 4
            whitespace,            // 3
            choice([               // 2 = body
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
            ]),
            punctuator("}"),       // 1
            pos,                   // 0 = end
        ]);
        b.assertLengthIs(oldLength+7);
        b.popAboveAndSet(6,makeNode(b,6,0,"ClassTail",[5,2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassHeritage

function ClassHeritage(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ClassBody

function ClassBody(b: Builder): void {
    b.item(ClassElementList);
}

// ClassElementList

function ClassElementList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ClassElement_1

function ClassElement_1(b: Builder): void {
    b.item(MethodDefinition);
}

// ClassElement_2

function ClassElement_2(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ClassElement_3

function ClassElement_3(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ClassElement

function ClassElement(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        ClassElement_1,
        ClassElement_2,
        ClassElement_3,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 15.1

// Script

function Script(b: Builder): void {
    const oldLength = b.length;
    b.item(pos);
    b.choice([
        () => {
            b.item(ScriptBody);
        },
        () => {
            const start = checkNumber(b.get(0));
            b.push(new ListNode(new Range(start,start),[]));
        },
    ]);
    b.assertLengthIs(oldLength+2);
    b.item(pos);
    b.assertLengthIs(oldLength+3);
    b.popAboveAndSet(2,makeNode(b,2,0,"Script",[1]));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ScriptBody

function ScriptBody(b: Builder): void {
    b.item(StatementList);
}

// Section 15.2

// Module

function Module(b: Builder): void {
    const oldLength = b.length;
    b.item(pos);
    b.choice([
        () => {
            b.item(ModuleBody);
        },
        () => {
            const start = checkNumber(b.get(0));
            b.push(new ListNode(new Range(start,start),[]));
        },
    ]);
    b.assertLengthIs(oldLength+2);
    b.item(pos);
    b.assertLengthIs(oldLength+3);
    b.popAboveAndSet(2,makeNode(b,2,0,"Module",[1]));
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ModuleBody

function ModuleBody(b: Builder): void {
    b.item(ModuleItemList);
}

// ModuleItemList

function ModuleItemList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ModuleItem

function ModuleItem(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        ImportDeclaration,
        ExportDeclaration,
        StatementListItem,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// Section 15.2.2

// ImportDeclaration_from

function ImportDeclaration_from(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+9);
        b.popAboveAndSet(8,makeNode(b,8,0,"ImportFrom",[5,3]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportDeclaration_module

function ImportDeclaration_module(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ImportDeclaration

function ImportDeclaration(b: Builder): void {
    const oldLength = b.length;
    b.choice([
        ImportDeclaration_from,
        ImportDeclaration_module,
    ]);
    b.assertLengthIs(oldLength+1);
    checkNode(b.get(0));
}

// ImportClause

function ImportClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.choice([
            () => {
                b.item(NameSpaceImport);
            },
            () => {
                b.item(NamedImports);
            },
            () => {
                b.items([
                    pos,                            // 6 = start
                    ImportedDefaultBinding,         // 5 = defbinding
                    choice([
                        () => {
                            b.items([
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
                            b.items([
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
                            b.item(pos);
                            b.popAboveAndSet(2,makeNode(b,2,0,"DefaultImport",[1]));
                        },
                    ]),
                ]);
            },
        ]);
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportedDefaultBinding

function ImportedDefaultBinding(b: Builder): void {
    b.item(ImportedBinding);
}

// NameSpaceImport

function NameSpaceImport(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// NamedImports

function NamedImports(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                // 5 = start
            punctuator("{"),    // 4
            whitespace,         // 3
            choice([            // 2 = imports
                () => {
                    b.item(ImportsList);
                    b.item(whitespace);
                    b.opt(() => {
                        b.item(punctuator(","));
                        b.item(whitespace);
                        b.pop();
                    });
                    b.assertLengthIs(oldLength+6);
                    b.popAboveAndSet(2,b.get(2));
                },
                () => {
                    b.push(new ListNode(new Range(b.parser.pos,b.parser.pos),[]));
                },
            ]),
            punctuator("}"),    // 1
            pos,                // 0 = end
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"NamedImports",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// FromClause

function FromClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
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

// ImportsList

function ImportsList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ImportSpecifier

function ImportSpecifier(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ImportAsSpecifier",[5,1]));
            },
            () => {
                b.items([
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

// ModuleSpecifier

function ModuleSpecifier(b: Builder): void {
    b.item(StringLiteral);
}

// ImportedBinding

function ImportedBinding(b: Builder): void {
    b.item(BindingIdentifier);
}

// Section 15.2.3

// ExportDeclaration

function ExportDeclaration(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("export"),
            whitespace,
        ]);
        b.assertLengthIs(oldLength+3);
        b.choice([
            () => {
                b.items([
                    keyword("default"),                              // 3
                    whitespace,                                      // 2
                    HoistableDeclaration, // 1
                    pos,                                             // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportDefault",[1]));
            },
            () => {
                b.items([
                    keyword("default"), // 3
                    whitespace, // 2
                    ClassDeclaration, // 1
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
                b.assertLengthIs(oldLength+11);
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
                b.assertLengthIs(oldLength+9);
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
                b.assertLengthIs(oldLength+9);
                b.popAboveAndSet(8,makeNode(b,8,0,"ExportFrom",[5,3]));
            },
            () => {
                b.items([
                    ExportClause,    // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                ]);
                b.assertLengthIs(oldLength+7);
                b.popAboveAndSet(6,makeNode(b,6,0,"ExportPlain",[3]));
            },
            () => {
                b.items([
                    VariableStatement, // 1
                    pos,               // 0
                ]);
                b.assertLengthIs(oldLength+5);
                b.popAboveAndSet(4,makeNode(b,4,0,"ExportVariable",[1]));
            },
            () => {
                b.items([
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

// ExportClause

function ExportClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                       // 5
            punctuator("{"),           // 4
            whitespace,                // 3
            choice([                   // 2
                () => {
                    b.item(ExportsList);
                    b.item(whitespace);
                    b.opt(() => {
                        b.item(punctuator(","));
                        b.item(whitespace);
                        b.pop();
                    });
                    b.assertLengthIs(oldLength+6);
                    b.popAboveAndSet(2,b.get(2));
                    b.assertLengthIs(oldLength+4);
                },
                () => {
                    b.item(pos);
                    const curPos = checkNumber(b.get(0));
                    b.popAboveAndSet(0,new ListNode(new Range(curPos,curPos),[]));
                },
            ]),
            punctuator("}"),           // 1
            pos,                       // 0
        ]);
        b.assertLengthIs(oldLength+6);
        b.popAboveAndSet(5,makeNode(b,5,0,"ExportClause",[2]));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ExportsList

function ExportsList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
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
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

// ExportSpecifier

function ExportSpecifier(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            IdentifierName,
            choice([
                () => {
                    b.items([
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
                    b.item(pos);
                    b.assertLengthIs(oldLength+3);
                    b.popAboveAndSet(0,makeNode(b,2,0,"ExportNormalSpecifier",[1]));
                },
            ]),
        ]);
        b.assertLengthIs(oldLength+3);
        b.popAboveAndSet(2,b.get(0));
        b.assertLengthIs(oldLength+1);
        checkNode(b.get(0));
    });
}

export function parseScript(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        Script(b);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}

export function parseModule(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        Module(b);
        b.assertLengthIs(1);
        return checkNode(b.get(0));
    });
}
