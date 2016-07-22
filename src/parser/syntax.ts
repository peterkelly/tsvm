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
    NumericLiteralNode,
    StringLiteralNode,
    ListNode,
    ErrorNode,
    GenericNode,
} from "./ast";
import {
    Builder,
    Grammar,
    ref,
    list,
    items,
    popAboveAndSet,
    popAboveAndSet2,
    popAboveAndReplace,
    popAboveAndMakeNode,
    popAboveAndMakeEmptyList,
    assertLengthIs,
    push,
    pop,
    opt,
    choice,
    repeat,
    repeatChoice,
    pos,
    value,
    keyword,
    notKeyword,
    identifier,
    whitespace,
    whitespaceNoNewline,
    checkNode,
    checkListNode,
    checkNumber,
    makeNode,
    makeEmptyListNode,
} from "./grammar";

const grm = new Grammar();

// Section 12.1

// IdentifierReference

grm.define("IdentifierReference",(b: Builder): void => {
    const oldLength = b.length;
    b.item(ref("Identifier"));
    b.item(assertLengthIs(oldLength+1));
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.item(popAboveAndSet(0,new IdentifierReferenceNode(ident.range,ident.value)));
    b.item(assertLengthIs(oldLength+1));
    checkNode(b.get(0));
});

// BindingIdentifier

grm.define("BindingIdentifier",(b: Builder): void => {
    const oldLength = b.length;
    b.item(ref("Identifier"));
    b.item(assertLengthIs(oldLength+1));
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.item(popAboveAndSet(0,new BindingIdentifierNode(ident.range,ident.value)));
    b.item(assertLengthIs(oldLength+1));
    checkNode(b.get(0));
});

// LabelIdentifier

grm.define("LabelIdentifier",(b: Builder): void => {
    const oldLength = b.length;
    b.item(ref("Identifier"));
    b.item(assertLengthIs(oldLength+1));
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.item(popAboveAndSet(0,new LabelIdentifierNode(ident.range,ident.value)));
    b.item(assertLengthIs(oldLength+1));
    checkNode(b.get(0));
});

// IdentifierName

grm.define("IdentifierName",(b: Builder): void => {
    b.item(ref("Identifier"));
});

// Identifier

grm.define("Identifier",(b: Builder): void => {
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
            b.item(push(new IdentifierNode(range,value)));
            b.item(assertLengthIs(oldLength+1));
            checkNode(b.get(0));
        }
        else {
            throw new ParseError(p,p.pos,"Expected Identifier");
        }
    });
});

// Section 12.2

// This

grm.define("This",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("this"),
            pos,
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"This",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// PrimaryExpression

grm.define("PrimaryExpression",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("This"),
            // Literal must come before IdentifierReference, since "true", "false", and "null" are not keywords
            ref("Literal"),
            ref("IdentifierReference"),
            ref("ArrayLiteral"),
            ref("ObjectLiteral"),
            ref("FunctionExpression"),
            ref("ClassExpression"),
            ref("GeneratorExpression"),
            // RegularExpressionLiteral_b, // TODO
            // TemplateLiteral_b, // TODO
            ref("ParenthesizedExpression"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ParenthesizedExpression

grm.define("ParenthesizedExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            keyword("("),      // 4
            whitespace,        // 3
            ref("Expression"), // 2 = expr
            whitespace,        // 1
            keyword(")"),      // 0
            popAboveAndReplace(4,2),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.2.4

// Literal

grm.define("Literal",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("NullLiteral"),
            ref("BooleanLiteral"),
            ref("NumericLiteral"),
            ref("StringLiteral"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// NullLiteral

grm.define("NullLiteral",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("null"),
            pos,
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"NullLiteral",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BooleanLiteral

grm.define("BooleanLiteral",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            items([
                pos,
                keyword("true"),
                pos,
                assertLengthIs(oldLength+3),
                popAboveAndMakeNode(2,"True",2,0,[]),
            ]),
            items([
                pos,
                keyword("false"),
                pos,
                assertLengthIs(oldLength+3),
                popAboveAndMakeNode(2,"False",2,0,[]),
            ]),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// NumericLiteral

grm.define("NumericLiteral",(b: Builder): void => {
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
        b.item(push(new NumericLiteralNode(new Range(start,p.pos),value)));
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// StringLiteral

grm.define("StringLiteral",(b: Builder): void => {
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
            b.item(push(new StringLiteralNode(new Range(start,p.pos),value)));
            b.item(assertLengthIs(oldLength+1));
            checkNode(b.get(0));
            return;
        }
        throw new ParseError(p,p.pos,"Invalid string");
    });
});

// Section 12.2.5

// ArrayLiteral

grm.define("ArrayLiteral",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        const start = b.parser.pos;
        b.items([
            pos,
            keyword("["),
            whitespace,
        ]);

        const elements: ASTNode[] = [];
        const listStart = b.parser.pos;
        let listEnd = b.parser.pos;

        b.items([
            assertLengthIs(oldLength+3),
            opt(items([
                pos,          // 3 = before
                keyword(","), // 2
                pos,          // 1 = after
                whitespace,   // 0
                assertLengthIs(oldLength+7),
                popAboveAndMakeNode(3,"Elision",3,1,[]),
            ])),
            assertLengthIs(oldLength+4),
        ]);

        const initialElision = checkNode(b.get(0));
        if (initialElision != null) {
            elements.push(initialElision);
            listEnd = initialElision.range.end;
        }

        while (true) {
            b.item(assertLengthIs(oldLength+4));
            if (b.parser.lookaheadKeyword("]")) {
                b.parser.expectKeyword("]");
                break;
            }

            try {
                b.items([
                    choice([
                        items([
                            pos,          // 3 = before
                            keyword(","), // 2
                            pos,          // 1 = after
                            whitespace,   // 0
                            assertLengthIs(oldLength+8),
                            popAboveAndMakeNode(3,"Elision",3,1,[]),
                            assertLengthIs(oldLength+5),
                        ]),
                        items([
                            ref("AssignmentExpression"),
                            whitespace,
                            opt(items([
                                keyword(","),
                                whitespace,
                                pop,
                            ])),
                            assertLengthIs(oldLength+7),
                            popAboveAndReplace(2,2),
                            assertLengthIs(oldLength+5),
                        ]),
                        items([
                            ref("SpreadElement"),
                            whitespace,
                            opt(items([
                                keyword(","),
                                whitespace,
                                pop,
                            ])),
                            assertLengthIs(oldLength+7),
                            popAboveAndReplace(2,2),
                            assertLengthIs(oldLength+5),
                        ]),
                    ]),
                    assertLengthIs(oldLength+5),
                ]);
                const curItem = checkNode(b.get(0));
                b.item(pop);

                elements.push(curItem);
                listEnd = curItem.range.end;
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                break;
            }
        }

        b.item(assertLengthIs(oldLength+4));
        const list = new ListNode(new Range(listStart,listEnd),elements);
        b.item(popAboveAndSet(3,new GenericNode(new Range(start,b.parser.pos),"ArrayLiteral",[list])));
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// SpreadElement

grm.define("SpreadElement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("..."),
            whitespace,
            ref("AssignmentExpression"),
            pos,
            popAboveAndMakeNode(4,"SpreadElement",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.2.6

// ObjectLiteral

grm.define("ObjectLiteral",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,              // 5
            keyword("{"),     // 4
            whitespace,       // 3
            choice([          // 2 = properties
                items([
                    ref("PropertyDefinitionList"),
                    whitespace,
                    opt(items([
                        keyword(","),
                        whitespace,
                        popAboveAndSet(1,0),
                    ])),
                    popAboveAndReplace(2,2),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            keyword("}"),     // 1
            pos,              // 0 = end
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ObjectLiteral",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// PropertyDefinitionList

grm.define("PropertyDefinitionList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            ref("PropertyDefinition"),
            items([
                whitespace,
                keyword(","),
                whitespace,
                ref("PropertyDefinition"),
                popAboveAndReplace(3,0),
            ]),
        );
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// PropertyDefinition_colon

grm.define("PropertyDefinition_colon",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                         // 6 = start
            ref("PropertyName"),         // 5 = name
            whitespace,                  // 4
            keyword(":"),                // 3
            whitespace,                  // 2
            ref("AssignmentExpression"), // 1 = init
            pos,                         // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ColonPropertyDefinition",6,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// PropertyDefinition

grm.define("PropertyDefinition",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("PropertyDefinition_colon"),
            ref("CoverInitializedName"),
            ref("MethodDefinition"),
            ref("IdentifierReference"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// PropertyName

grm.define("PropertyName",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("LiteralPropertyName"),
            ref("ComputedPropertyName"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// LiteralPropertyName

grm.define("LiteralPropertyName",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("IdentifierName"),
            ref("StringLiteral"),
            ref("NumericLiteral"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ComputedPropertyName

grm.define("ComputedPropertyName",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                         // 6 = start
            keyword("["),                // 5
            whitespace,                  // 4
            ref("AssignmentExpression"), // 3 = expr
            whitespace,                  // 2
            keyword("]"),                // 1
            pos,                         // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ComputedPropertyName",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CoverInitializedName

grm.define("CoverInitializedName",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                        // 4 = start
            ref("IdentifierReference"), // 3 = ident
            whitespace,                 // 2
            ref("Initializer"),         // 1 = init
            pos,                        // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"CoverInitializedName",4,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Initializer

grm.define("Initializer",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            keyword("="),
            whitespace,
            ref("AssignmentExpression"),
            assertLengthIs(oldLength+3),
            popAboveAndReplace(2,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.2.9

function TemplateLiteral(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME
function TemplateSpans(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME
function TemplateMiddleList(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// Section 12.3

// MemberExpression_new

grm.define("MemberExpression_new",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 6 = start
            keyword("new"),          // 5
            whitespace,              // 4
            ref("MemberExpression"), // 3 = expr
            whitespace,              // 2
            ref("Arguments"),        // 1 = args
            pos,                     // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"NewExpression",6,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// MemberExpression_start

grm.define("MemberExpression_start",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("PrimaryExpression"),
            ref("SuperProperty"),
            ref("MetaProperty"),
            ref("MemberExpression_new"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// MemberExpression

grm.define("MemberExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            ref("MemberExpression_start"),
            repeatChoice([
                items([
                    whitespace,            // 6
                    keyword("["),          // 5
                    whitespace,            // 4
                    ref("Expression"),     // 3 = expr
                    whitespace,            // 2
                    keyword("]"),          // 1
                    pos,                   // 0 = end
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(7,"MemberAccessExpr",8,0,[7,3]),
                ]),
                items([
                    whitespace,            // 5
                    keyword("."),          // 4
                    whitespace,            // 3
                    ref("IdentifierName"), // 2 = ident
                    pos,                   // 1 = end
                    whitespace,            // 0
                    assertLengthIs(oldLength+8),
                    popAboveAndMakeNode(6,"MemberAccessIdent",7,1,[6,2]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// SuperProperty

grm.define("SuperProperty",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,               // 8 = start
                    keyword("super"),  // 7
                    whitespace,        // 6
                    keyword("["),      // 5
                    whitespace,        // 4
                    ref("Expression"), // 3 = expr
                    whitespace,        // 2
                    keyword("]"),      // 1
                    pos,               // 0 = end
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(8,"SuperPropertyExpr",8,0,[3]),
                    assertLengthIs(oldLength+1),
                ]),
                items([
                    pos,               // 6 = start
                    keyword("super"),  // 5
                    whitespace,        // 4
                    keyword("."),      // 3
                    whitespace,        // 2
                    ref("Identifier"), // 1 = ident
                    pos,               // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"SuperPropertyIdent",6,0,[1]),
                    assertLengthIs(oldLength+1),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// MetaProperty

grm.define("MetaProperty",(b: Builder): void => {
    b.item(ref("NewTarget"));
});

// NewTarget

grm.define("NewTarget",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 6
            keyword("new"),       // 5
            whitespace,           // 4
            keyword("."),         // 3
            whitespace,           // 2
            identifier("target"), // 1 ("target" is not a reserved word, so we can't use keyword here)
            pos,                  // 0
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"NewTarget",6,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// NewExpression

grm.define("NewExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                ref("MemberExpression"),
                items([
                    pos,                  // 5 = start
                    keyword("new"),       // 4
                    whitespace,           // 3
                    ref("NewExpression"), // 2 = expr
                    value(null),          // 1 = args
                    pos,                  // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"NewExpression",5,0,[2,1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CallExpression_start

grm.define("CallExpression_start",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(choice([
            ref("SuperCall"),
            items([
                pos,                     // 4 = start
                ref("MemberExpression"), // 3 = fun
                whitespace,              // 2
                ref("Arguments"),        // 1 = args
                pos,                     // 0 = end
                assertLengthIs(oldLength+5),
                popAboveAndMakeNode(4,"Call",4,0,[3,1]),
            ]),
        ]));
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// CallExpression

grm.define("CallExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            ref("CallExpression_start"),
            repeatChoice([
                items([
                    whitespace,            // 2
                    ref("Arguments"),      // 1
                    pos,                   // 0
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(3,"Call",4,0,[3,1]),
                ]),
                items([
                    whitespace,            // 6
                    keyword("["),          // 5
                    whitespace,            // 4
                    ref("Expression"),     // 3 = expr
                    whitespace,            // 2
                    keyword("]"),          // 1
                    pos,                   // 0 = end
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(7,"MemberAccessExpr",8,0,[7,3]),
                ]),
                items([
                    whitespace,            // 4
                    keyword("."),          // 3
                    whitespace,            // 2
                    ref("IdentifierName"), // 1 = idname
                    pos,                   // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"MemberAccessIdent",6,0,[5,1]),
                ]),
                // () => {
                //     // TODO
                //     left = TemplateLiteral(p);
                // },
            ]),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// SuperCall

grm.define("SuperCall",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,              // 4 = start
            keyword("super"), // 3
            whitespace,       // 2
            ref("Arguments"), // 1 = args
            pos,              // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"SuperCall",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Arguments

grm.define("Arguments",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(choice([
            items([
                pos,                 // 6 = start
                keyword("("),        // 5
                whitespace,          // 4
                pos,                 // 3 = listpos
                keyword(")"),        // 2
                pos,                 // 1 = end
                value(null),         // 0 = will become list
                assertLengthIs(oldLength+7),
                popAboveAndMakeEmptyList(0,3,3),
                popAboveAndMakeNode(6,"Arguments",6,1,[0]),
            ]),
            items([
                pos,                 // 6 = start
                keyword("("),        // 5
                whitespace,          // 4
                ref("ArgumentList"), // 3 = args
                whitespace,          // 2
                keyword(")"),        // 1
                pos,                 // 0 = end
                assertLengthIs(oldLength+7),
                popAboveAndMakeNode(6,"Arguments",6,0,[3]),
            ]),
        ]));
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// ArgumentList_item

grm.define("ArgumentList_item",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                         // 4 = start
                    keyword("..."),              // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = expr
                    pos,                         // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"SpreadElement",4,0,[1]),
                ]),
                ref("AssignmentExpression"),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ArgumentList

grm.define("ArgumentList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            ref("ArgumentList_item"),
            items([
                whitespace,
                keyword(","),
                whitespace,
                ref("ArgumentList_item"),
                popAboveAndReplace(3,0),
            ]),
        );
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// LeftHandSideExpression

grm.define("LeftHandSideExpression",(b: Builder): void => {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    const oldLength = b.length;
    b.items([
        choice([
            ref("CallExpression"),
            ref("NewExpression"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 12.4

// PostfixExpression

grm.define("PostfixExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            ref("LeftHandSideExpression"),
            choice([
                items([
                    whitespaceNoNewline,
                    keyword("++"),
                    pos,
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PostIncrement",4,0,[3]),
                ]),
                items([
                    whitespaceNoNewline,
                    keyword("--"),
                    pos,
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PostDecrement",4,0,[3]),
                ]),
                popAboveAndReplace(1,0),
            ]),
        ]);
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
});

// Section 12.5

// UnaryExpression

grm.define("UnaryExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                    // 4 = start
                    keyword("delete"),      // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"Delete",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("void"),        // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"Void",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("typeof"),      // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"TypeOf",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("++"),          // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PreIncrement",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("--"),          // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PreDecrement",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("+"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryPlus",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("-"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryMinus",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("~"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryBitwiseNot",4,0,[1]),
                ]),
                items([
                    pos,                    // 4 = start
                    keyword("!"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = expr
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryLogicalNot",4,0,[1]),
                ]),
                ref("PostfixExpression"),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.6

// MultiplicativeExpression

grm.define("MultiplicativeExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                            // 6 = start
            ref("UnaryExpression"),         // 5 = left
            repeatChoice([
                items([
                    whitespace,             // 4
                    keyword("*"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = right
                    pos,                    // 0 = end
                    popAboveAndMakeNode(5,"Multiply",6,0,[5,1]),
                ]),
                items([
                    whitespace,             // 4
                    keyword("/"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = right
                    pos,                    // 0 = end
                    popAboveAndMakeNode(5,"Divide",6,0,[5,1]),
                ]),
                items([
                    whitespace,             // 4
                    keyword("%"),           // 3
                    whitespace,             // 2
                    ref("UnaryExpression"), // 1 = right
                    pos,                    // 0 = end
                    popAboveAndMakeNode(5,"Modulo",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.7

// AdditiveExpression

grm.define("AdditiveExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                     // 6 = start
            ref("MultiplicativeExpression"),         // 5 = left
            repeatChoice([
                items([
                    whitespace,                      // 4
                    keyword("+"),                    // 3
                    whitespace,                      // 2
                    ref("MultiplicativeExpression"), // 1 = right
                    pos,                             // 0 = end
                    popAboveAndMakeNode(5,"Add",6,0,[5,1]),
                ]),
                items([
                    whitespace,                      // 4
                    keyword("-"),                    // 3
                    whitespace,                      // 2
                    ref("MultiplicativeExpression"), // 1 = right
                    pos,                             // 0 = end
                    popAboveAndMakeNode(5,"Subtract",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.8

// ShiftExpression

grm.define("ShiftExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                               // 6 = start
            ref("AdditiveExpression"),         // 5 = left
            repeatChoice([
                items([
                    whitespace,                // 4
                    keyword("<<"),             // 3
                    whitespace,                // 2
                    ref("AdditiveExpression"), // 1 = right
                    pos,                       // 0 = end
                    popAboveAndMakeNode(5,"LeftShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,                // 4
                    keyword(">>>"),            // 3
                    whitespace,                // 2
                    ref("AdditiveExpression"), // 1 = right
                    pos,                       // 0 = end
                    popAboveAndMakeNode(5,"UnsignedRightShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,                // 4
                    keyword(">>"),             // 3
                    whitespace,                // 2
                    ref("AdditiveExpression"), // 1 = right
                    pos,                       // 0 = end
                    popAboveAndMakeNode(5,"SignedRightShift",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.9

// RelationalExpression

grm.define("RelationalExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                            // 6 = start
            ref("ShiftExpression"),         // 5 = left
            repeatChoice([
                items([
                    whitespace,             // 4
                    keyword("<="),          // 3
                    whitespace,             // 2
                    ref("ShiftExpression"), // 1 = right
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"LessEqual",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,             // 4
                    keyword(">="),          // 3
                    whitespace,             // 2
                    ref("ShiftExpression"), // 1 = right
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"GreaterEqual",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,             // 4
                    keyword("<"),           // 3
                    whitespace,             // 2
                    ref("ShiftExpression"), // 1 = right
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"LessThan",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,             // 4
                    keyword(">"),           // 3
                    whitespace,             // 2
                    ref("ShiftExpression"), // 1 = right
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"GreaterThan",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,             // 4
                    keyword("instanceof"),  // 3
                    whitespace,             // 2
                    ref("ShiftExpression"), // 1 = right
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"InstanceOf",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,             // 4
                    keyword("in"),          // 3
                    whitespace,             // 2
                    ref("ShiftExpression"), // 1 = right
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"In",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.10

// EqualityExpression

grm.define("EqualityExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                 // 6 = start
            ref("RelationalExpression"),         // 5 = left
            repeatChoice([
                items([
                    whitespace,                  // 4
                    keyword("==="),              // 3
                    whitespace,                  // 2
                    ref("RelationalExpression"), // 1 = right
                    pos,                         // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"StrictEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("!=="),              // 3
                    whitespace,                  // 2
                    ref("RelationalExpression"), // 1 = right
                    pos,                         // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"StrictNotEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("=="),               // 3
                    whitespace,                  // 2
                    ref("RelationalExpression"), // 1 = right
                    pos,                         // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"AbstractEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("!="),               // 3
                    whitespace,                  // 2
                    ref("RelationalExpression"), // 1 = right
                    pos,                         // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"AbstractNotEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.11

// BitwiseANDExpression

grm.define("BitwiseANDExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                           // 6 = start
            ref("EqualityExpression"),     // 5 = left
            repeat(items([
                whitespace,                // 4
                keyword("&"),              // 3
                whitespace,                // 2
                ref("EqualityExpression"), // 1 = right
                pos,                       // 0 = end
                popAboveAndMakeNode(5,"BitwiseAND",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BitwiseXORExpression

grm.define("BitwiseXORExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                             // 6 = start
            ref("BitwiseANDExpression"),     // 5 = left
            repeat(items([
                whitespace,                  // 4
                keyword("^"),                // 3
                whitespace,                  // 2
                ref("BitwiseANDExpression"), // 1 = right
                pos,                         // 0 = end
                popAboveAndMakeNode(5,"BitwiseXOR",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BitwiseORExpression

grm.define("BitwiseORExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                             // 6 = start
            ref("BitwiseXORExpression"),     // 5 = left
            repeat(items([
                whitespace,                  // 4
                keyword("|"),                // 3
                whitespace,                  // 2
                ref("BitwiseXORExpression"), // 1 = right
                pos,                         // 0 = end
                popAboveAndMakeNode(5,"BitwiseOR",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.12

// LogicalANDExpression

grm.define("LogicalANDExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                            // 6 = start
            ref("BitwiseORExpression"),     // 5 = left
            repeat(items([
                whitespace,                 // 4
                keyword("&&"),              // 3
                whitespace,                 // 2
                ref("BitwiseORExpression"), // 1 = right
                pos,                        // 0 = end
                popAboveAndMakeNode(5,"LogicalAND",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// LogicalORExpression

grm.define("LogicalORExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                             // 6 = start
            ref("LogicalANDExpression"),     // 5 = left
            repeat(items([
                whitespace,                  // 4
                keyword("||"),               // 3
                whitespace,                  // 2
                ref("LogicalANDExpression"), // 1 = right
                pos,                         // 0 = end
                popAboveAndMakeNode(5,"LogicalOR",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.13

// ConditionalExpression

grm.define("ConditionalExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                 // 10 = start
            ref("LogicalORExpression"),          // 9 = condition
            choice([
                items([
                    whitespace,                  // 8
                    keyword("?"),                // 7
                    whitespace,                  // 6
                    ref("AssignmentExpression"), // 5 = trueExpr
                    whitespace,                  // 4
                    keyword(":"),                // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = falseExpr
                    pos,                         // 0 = end
                    popAboveAndMakeNode(9,"Conditional",10,0,[9,5,1]),
                ]),
                items([]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 12.14

// AssignmentExpression_plain

grm.define("AssignmentExpression_plain",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                 // 6 = start
            ref("LeftHandSideExpression"),       // 5 = left
            choice([
                items([
                    whitespace,                  // 4
                    keyword("="),                // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"Assign",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("*="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignMultiply",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("/="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignDivide",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("%="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignModulo",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("+="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignAdd",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("-="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignSubtract",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("<<="),              // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignLeftShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword(">>="),              // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignSignedRightShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword(">>>="),             // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignUnsignedRightShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("&="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignBitwiseAND",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("^="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignBitwiseXOR",6,0,[5,1]),
                ]),
                items([
                    whitespace,                  // 4
                    keyword("|="),               // 3
                    whitespace,                  // 2
                    ref("AssignmentExpression"), // 1 = right
                    pos,                         // 0 = end
                    popAboveAndMakeNode(5,"AssignBitwiseOR",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// AssignmentExpression

grm.define("AssignmentExpression",(b: Builder): void => {
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    const oldLength = b.length;
    b.items([
        choice([
            ref("ArrowFunction"),
            ref("AssignmentExpression_plain"),
            ref("ConditionalExpression"),
            ref("YieldExpression"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 12.15

// Expression

grm.define("Expression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                             // 6 = start
            ref("AssignmentExpression"),     // 5 = left
            repeat(items([
                whitespace,                  // 4
                keyword(","),                // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                popAboveAndMakeNode(5,"Comma",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13

// Statement

grm.define("Statement",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("BlockStatement"),
            ref("VariableStatement"),
            ref("EmptyStatement"),
            ref("ExpressionStatement"),
            ref("IfStatement"),
            ref("BreakableStatement"),
            ref("ContinueStatement"),
            ref("BreakStatement"),
            ref("ReturnStatement"),
            ref("WithStatement"),
            ref("LabelledStatement"),
            ref("ThrowStatement"),
            ref("TryStatement"),
            ref("DebuggerStatement"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Declaration

grm.define("Declaration",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("HoistableDeclaration"),
            ref("ClassDeclaration"),
            ref("LexicalDeclaration"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// HoistableDeclaration

grm.define("HoistableDeclaration",(b: Builder): void => {
    b.item(choice([
        ref("FunctionDeclaration"),
        ref("GeneratorDeclaration"),
    ]));
});

// BreakableStatement

grm.define("BreakableStatement",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("IterationStatement"),
            ref("SwitchStatement"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.2

// BlockStatement

grm.define("BlockStatement",(b: Builder): void => {
    b.item(ref("Block"));
});

// Block

grm.define("Block",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,              // 5
            keyword("{"),     // 4
            whitespace,       // 3
            choice([          // 2 = statements
                items([
                    ref("StatementList"),
                    whitespace,
                    popAboveAndReplace(1,1),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            keyword("}"),     // 1
            pos,              // 0
            popAboveAndMakeNode(5,"Block",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// StatementList

grm.define("StatementList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("StatementListItem"),
                items([
                    whitespace,
                    ref("StatementListItem"),
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// StatementListItem

grm.define("StatementListItem",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("Statement"),
            ref("Declaration"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.3.1

// LexicalDeclaration

grm.define("LexicalDeclaration",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                // 6 = start
                    keyword("let"),     // 5
                    whitespace,         // 4
                    ref("BindingList"), // 3 = bindings
                    whitespace,         // 2
                    keyword(";"),       // 1
                    pos,                // 0 = end
                    popAboveAndMakeNode(6,"Let",6,0,[3]),
                ]),
                items([
                    pos,                // 6 = start
                    keyword("const"),   // 5
                    whitespace,         // 4
                    ref("BindingList"), // 3 = bindings
                    whitespace,         // 2
                    keyword(";"),       // 1
                    pos,                // 0 = end
                    popAboveAndMakeNode(6,"Const",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BindingList

grm.define("BindingList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("LexicalBinding"),
                items([
                    whitespace,
                    keyword(","),
                    whitespace,
                    ref("LexicalBinding"),
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// LexicalBinding_identifier

grm.define("LexicalBinding_identifier",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 3 = start
            ref("BindingIdentifier"), // 2 = identifier
            opt(items([               // 1 = initializer
                whitespace,
                ref("Initializer"),
                popAboveAndReplace(1,0),
            ])),
            pos,                      // 0 = end
            assertLengthIs(oldLength+4),
            popAboveAndMakeNode(3,"LexicalIdentifierBinding",3,0,[2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// LexicalBinding_pattern

grm.define("LexicalBinding_pattern",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                   // 4 = start
            ref("BindingPattern"), // 3 = pattern
            whitespace,            // 2
            ref("Initializer"),    // 1 = initializer
            pos,                   // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"LexicalPatternBinding",4,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// LexicalBinding

grm.define("LexicalBinding",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("LexicalBinding_identifier"),
            ref("LexicalBinding_pattern"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.3.2

// VariableStatement

grm.define("VariableStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                            // 6 = start
            keyword("var"),                 // 5
            whitespace,                     // 4
            ref("VariableDeclarationList"), // 3 = declarations
            whitespace,                     // 2
            keyword(";"),                   // 1
            pos,                            // 0 = end
            popAboveAndMakeNode(6,"Var",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// VariableDeclarationList

grm.define("VariableDeclarationList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("VariableDeclaration"),
                items([
                    whitespace,
                    keyword(","),
                    whitespace,
                    ref("VariableDeclaration"),
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// VariableDeclaration_identifier

grm.define("VariableDeclaration_identifier",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            ref("BindingIdentifier"),
            choice([
                items([
                    whitespace,
                    ref("Initializer"),
                    pos,
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"VarIdentifier",4,0,[3,1]),
                ]),
                items([
                    value(null),
                    pos,
                    assertLengthIs(oldLength+4),
                    popAboveAndMakeNode(3,"VarIdentifier",3,0,[2,1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// VariableDeclaration_pattern

grm.define("VariableDeclaration_pattern",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                   // 4 = start
            ref("BindingPattern"), // 3 = pattern
            whitespace,            // 2
            ref("Initializer"),    // 1 = initializer
            pos,                   // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"VarPattern",4,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// VariableDeclaration

grm.define("VariableDeclaration",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("VariableDeclaration_identifier"),
            ref("VariableDeclaration_pattern"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.3.3

// BindingPattern

grm.define("BindingPattern",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("ObjectBindingPattern"),
            ref("ArrayBindingPattern"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ObjectBindingPattern

grm.define("ObjectBindingPattern",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 6 = start
            keyword("{"),      // 5
            whitespace,        // 4
            pos,               // 3
            choice([           // 2 = properties
                items([
                    ref("BindingPropertyList"),
                    whitespace,
                    opt(items([
                        keyword(","),
                        whitespace,
                        popAboveAndSet(1,null),
                    ])),
                    popAboveAndReplace(2,2),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ])
            ]),
            keyword("}"),      // 1
            pos,               // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ObjectBindingPattern",6,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ArrayBindingPattern

grm.define("ArrayBindingPattern",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                       // 7 = start
            keyword("["),              // 6
            whitespace,                // 5
            ref("BindingElementList"), // 4 = elements
            whitespace,                // 3
            opt(items([                // 2 = rest
                ref("BindingRestElement"),
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            keyword("]"),              // 1
            pos,                       // 0 = end
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"ArrayBindingPattern",7,0,[4,2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BindingPropertyList

grm.define("BindingPropertyList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("BindingProperty"),
                items([
                    whitespace,
                    keyword(","),
                    whitespace,
                    ref("BindingProperty"),
                    popAboveAndReplace(3,0),
                ])
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BindingElementList

grm.define("BindingElementList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                opt(items([
                    pos,
                    keyword(","),
                    pos,
                    popAboveAndMakeNode(2,"Elision",2,0,[]),
                ])),
                choice([
                    items([
                        whitespace,   // 3
                        pos,          // 2 = before
                        keyword(","), // 1
                        pos,          // 0 = after
                        popAboveAndMakeNode(3,"Elision",2,0,[]),
                    ]),
                    items([
                        whitespace,
                        ref("BindingElement"),
                        opt(items([
                            whitespace,
                            keyword(","),
                            pop,
                        ])),
                        popAboveAndReplace(2,1),
                    ]),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BindingProperty

grm.define("BindingProperty",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                   // 6 = start
                    ref("PropertyName"),   // 5 = name
                    whitespace,            // 4
                    keyword(":"),          // 3
                    whitespace,            // 2
                    ref("BindingElement"), // 1 = element
                    pos,                   // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"BindingProperty",6,0,[5,1]),
                ]),
                // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
                // and PropertyName will match an identifier at the start of a colon binding
                ref("SingleNameBinding"),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BindingElement

grm.define("BindingElement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                ref("SingleNameBinding"),
                items([
                    pos,
                    ref("BindingPattern"),
                    choice([
                        items([
                            whitespace,
                            ref("Initializer"),
                            pos,
                            assertLengthIs(oldLength+5),
                            popAboveAndMakeNode(4,"BindingPatternInit",4,0,[3,1]),
                        ]),
                        popAboveAndReplace(1,0),
                    ]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// SingleNameBinding

grm.define("SingleNameBinding",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            ref("BindingIdentifier"),
            choice([
                items([
                    whitespace,
                    ref("Initializer"),
                    pos,
                    popAboveAndMakeNode(2,"SingleNameBinding",4,0,[3,1]),
                ]),
                items([
                    value(null),
                    popAboveAndReplace(0,1),
                ])
            ]),
            assertLengthIs(oldLength+3),
            popAboveAndReplace(2,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// BindingRestElement

grm.define("BindingRestElement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 4 = start
            keyword("..."),           // 3
            whitespace,               // 2
            ref("BindingIdentifier"), // 1 = ident
            pos,                      // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"BindingRestElement",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.4

// EmptyStatement

grm.define("EmptyStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword(";"),
            pos,
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"EmptyStatement",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.5

// ExpressionStatement

grm.define("ExpressionStatement",(b: Builder): void => {
    const p = b.parser;
    const start2 = p.pos;

    // Lookahead not in one of the four sequences <{> <function> <class> <let [>

    if (p.lookaheadKeyword("{") || p.lookaheadKeyword("function") || p.lookaheadKeyword("class"))
        throw new ParseIgnore();

    if (p.matchKeyword("let")) {
        p.skipWhitespace();
        if (p.matchKeyword("[")) {
            p.pos = start2;
            throw new ParseIgnore();
        }
    }
    p.pos = start2;

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 4 = start
            ref("Expression"), // 3 = expr
            whitespace,        // 2
            keyword(";"),      // 1
            pos,               // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"ExpressionStatement",4,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.6

// IfStatement

grm.define("IfStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 11 = start
            keyword("if"),     // 10
            whitespace,        // 9
            keyword("("),      // 8
            whitespace,        // 7
            ref("Expression"), // 6 = condition
            whitespace,        // 5
            keyword(")"),      // 4
            whitespace,        // 3
            ref("Statement"),  // 2 = trueBranch
            opt(items([        // 1 = falseBranch
                whitespace,
                keyword("else"),
                whitespace,
                ref("Statement"),
                popAboveAndReplace(3,0),
            ])),
            pos,               // 0 = end
            assertLengthIs(oldLength+12),
            popAboveAndMakeNode(11,"IfStatement",11,0,[6,2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.7

// IterationStatement_do

grm.define("IterationStatement_do",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 14
            keyword("do"),     // 13
            whitespace,        // 12
            ref("Statement"),  // 11 = body
            whitespace,        // 10
            keyword("while"),  // 9
            whitespace,        // 8
            keyword("("),      // 7
            whitespace,        // 6
            ref("Expression"), // 5 = condition
            whitespace,        // 4
            keyword(")"),      // 3
            whitespace,        // 2
            keyword(";"),      // 1 = end
            pos,               // 0 = start
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"DoStatement",14,0,[11,5]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// IterationStatement_while

grm.define("IterationStatement_while",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                // 10 = start
            keyword("while"),   // 9
            whitespace,         // 8
            keyword("("),       // 7
            whitespace,         // 6
            ref("Expression"),  // 5 = condition
            whitespace,         // 4
            keyword(")"),       // 3
            whitespace,         // 2
            ref("Statement"),   // 1 = body
            pos,                // 0 = end
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"WhileStatement",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// IterationStatement_for_c

grm.define("IterationStatement_for_c",(b: Builder): void => {
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                                    // 14 = start
            keyword("for"),                         // 13
            whitespace,                             // 12
            keyword("("),                           // 11
            whitespace,                             // 10
            assertLengthIs(oldLength+5),
            choice([
                items([
                    notKeyword("let"), // FIXME: need tests for this
                    notKeyword("["), // FIXME: need tests for this
                    ref("Expression"),
                    whitespace,
                    keyword(";"),
                    whitespace,
                    popAboveAndReplace(5,3),
                ]),
                items([
                    pos,                            // 7 = start2
                    keyword("var"),                 // 6
                    whitespace,                     // 5
                    ref("VariableDeclarationList"), // 4 = declarations
                    pos,                            // 3 = end
                    whitespace,                     // 2
                    keyword(";"),                   // 1
                    whitespace,                     // 0
                    popAboveAndMakeNode(7,"Var",7,3,[4]),
                ]),
                items([
                    ref("LexicalDeclaration"),
                    whitespace,
                    popAboveAndReplace(1,1),
                ]),
                // initializer part can be empty, but need to distinguish this from an error
                items([
                    keyword(";"),
                    popAboveAndSet(0,null),
                ]),
            ]),
            assertLengthIs(oldLength+6),
            opt(ref("Expression")), // 8 = condition
            whitespace,             // 7
            keyword(";"),           // 6
            whitespace,             // 5
            opt(items([
                ref("Expression"),
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            keyword(")"),           // 3
            whitespace,             // 2
            ref("Statement"),       // 1 = body
            pos,                    // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"ForC",14,0,[9,8,4,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// IterationStatement_for_in

grm.define("IterationStatement_for_in",(b: Builder): void => {
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                       // 14 = start
            keyword("for"),            // 13
            whitespace,                // 12
            keyword("("),              // 11
            whitespace,                // 10
            assertLengthIs(oldLength+5),
            choice([                   // 9 = binding
                items([
                    notKeyword("let"), // FIXME: need tests for this
                    notKeyword("["), // FIXME: need tests for this
                    ref("LeftHandSideExpression"),
                    popAboveAndReplace(2,0),
                ]),
                items([
                    pos,
                    keyword("var"),
                    whitespace,
                    ref("ForBinding"),
                    pos,
                    popAboveAndMakeNode(4,"VarForDeclaration",4,0,[1]),
                ]),
                ref("ForDeclaration"),
            ]),
            assertLengthIs(oldLength+6),
            whitespace,                // 8
            keyword("in"),             // 7
            whitespace,                // 6
            ref("Expression"),         // 5 = expr
            whitespace,                // 4
            keyword(")"),              // 3
            whitespace,                // 2
            ref("Statement"),          // 1 = body
            pos,                       // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"ForIn",14,0,[9,5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// IterationStatement_for_of

grm.define("IterationStatement_for_of",(b: Builder): void => {
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                       // 14 = start
            keyword("for"),            // 13
            whitespace,                // 12
            keyword("("),              // 11
            whitespace,                // 10
            assertLengthIs(oldLength+5),
            choice([                   // 9
                items([
                    notKeyword("let"), // FIXME: need tests for this
                    notKeyword("["), // FIXME: need tests for this
                    ref("LeftHandSideExpression"),
                    popAboveAndReplace(2,0),
                ]),
                items([
                    pos,
                    keyword("var"),
                    whitespace,
                    ref("ForBinding"),
                    pos,
                    popAboveAndMakeNode(4,"VarForDeclaration",4,0,[1]),
                ]),
                ref("ForDeclaration"),
            ]),
            assertLengthIs(oldLength+6),
            whitespace,                // 8
            keyword("of"),             // 7
            whitespace,                // 6
            ref("Expression"),         // 5 = expr
            whitespace,                // 4
            keyword(")"),              // 3
            whitespace,                // 2
            ref("Statement"),          // 1 = body
            pos,                       // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"ForOf",14,0,[9,5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// IterationStatement_for

grm.define("IterationStatement_for",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("IterationStatement_for_c"),
            ref("IterationStatement_for_in"),
            ref("IterationStatement_for_of"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// IterationStatement

grm.define("IterationStatement",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("IterationStatement_do"),
            ref("IterationStatement_while"),
            ref("IterationStatement_for"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ForDeclaration

grm.define("ForDeclaration",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,               // 4 = start
                    keyword("let"),    // 3
                    whitespace,        // 2
                    ref("ForBinding"), // 1 = binding
                    pos,               // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"LetForDeclaration",4,0,[1]),
                ]),
                items([
                    pos,               // 4 = start
                    keyword("const"),  // 3
                    whitespace,        // 2
                    ref("ForBinding"), // 1 = binding
                    pos,               // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"ConstForDeclaration",4,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ForBinding

grm.define("ForBinding",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("BindingIdentifier"),
            ref("BindingPattern"), // FIXME: Need test cases for this
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.8

// ContinueStatement

grm.define("ContinueStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                    // 5 = start
                    keyword("continue"),    // 4
                    whitespace,             // 3
                    value(null),            // 2 = null
                    keyword(";"),           // 1
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"ContinueStatement",5,0,[2]),
                ]),
                items([
                    pos,                    // 6 = start
                    keyword("continue"),    // 5
                    whitespaceNoNewline,    // 4
                    ref("LabelIdentifier"), // 3 = ident
                    whitespace,             // 2
                    keyword(";"),           // 1
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ContinueStatement",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.9

// BreakStatement

grm.define("BreakStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                    // 5 = start
                    keyword("break"),       // 4
                    whitespace,             // 3
                    value(null),            // 2 = null
                    keyword(";"),           // 1
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"BreakStatement",5,0,[2]),
                ]),
                items([
                    pos,                    // 6 = start
                    keyword("break"),       // 5
                    whitespaceNoNewline,    // 4
                    ref("LabelIdentifier"), // 3 = ident
                    whitespace,             // 2
                    keyword(";"),           // 1
                    pos,                    // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"BreakStatement",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.10

// ReturnStatement

grm.define("ReturnStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                 // 5 = start
                    keyword("return"),   // 4
                    whitespace,          // 3
                    value(null),         // 2 = null
                    keyword(";"),        // 1
                    pos,                 // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"ReturnStatement",5,0,[2]),
                ]),
                items([
                    pos,                 // 6 = start
                    keyword("return"),   // 5
                    whitespaceNoNewline, // 4
                    ref("Expression"),   // 3 = expr
                    whitespace,          // 2
                    keyword(";"),        // 1
                    pos,                 // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ReturnStatement",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.11

// WithStatement

grm.define("WithStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 10 = start
            keyword("with"),   // 9
            whitespace,        // 8
            keyword("("),      // 7
            whitespace,        // 6
            ref("Expression"), // 5 = expr
            whitespace,        // 4
            keyword(")"),      // 3
            whitespace,        // 2
            ref("Statement"),  // 1 = body
            pos,               // 0 = end
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"WithStatement",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.12

// SwitchStatement

grm.define("SwitchStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 10 = start
            keyword("switch"), // 9
            whitespace,        // 8
            keyword("("),      // 7
            whitespace,        // 6
            ref("Expression"), // 5 = expr
            whitespace,        // 4
            keyword(")"),      // 3
            whitespace,        // 2
            ref("CaseBlock"),  // 1 = cases
            pos,               // 0 = end
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"SwitchStatement",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CaseBlock_1

grm.define("CaseBlock_1",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,          // 7
            keyword("{"), // 6
            whitespace,   // 5
            pos,          // 4 = midpos
            choice([      // 3 = clauses
                ref("CaseClauses"),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            whitespace,   // 2
            keyword("}"), // 1
            pos,          // 0
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"CaseBlock1",7,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CaseBlock_2

grm.define("CaseBlock_2",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 10 = start
            keyword("{"),            // 9
            whitespace,              // 8
            opt(ref("CaseClauses")), // 7 = clauses1
            whitespace,              // 6
            ref("DefaultClause"),    // 5 = defaultClause
            whitespace,              // 4
            opt(ref("CaseClauses")), // 3 = clauses2
            whitespace,              // 2
            keyword("}"),            // 1
            pos,                     // 0 = end
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"CaseBlock2",10,0,[7,5,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CaseBlock

grm.define("CaseBlock",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("CaseBlock_1"),
            ref("CaseBlock_2"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// CaseClauses

grm.define("CaseClauses",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("CaseClause"),
                items([
                    whitespace,
                    ref("CaseClause"),
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CaseClause

grm.define("CaseClause",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 8 = start
            keyword("case"),      // 7
            whitespace,           // 6
            ref("Expression"),    // 5 = expr
            whitespace,           // 4
            keyword(":"),         // 3
            whitespace,           // 2
            ref("StatementList"), // 1 = statements
            pos,                  // 0 = end
            assertLengthIs(oldLength+9),
            popAboveAndMakeNode(8,"CaseClause",8,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// DefaultClause

grm.define("DefaultClause",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 7 = start
            keyword("default"),   // 6
            whitespace,           // 5
            keyword(":"),         // 4
            whitespace,           // 3
            ref("StatementList"), // 2 = statements
            pos,                  // 1 = end
            whitespace,           // 0
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"DefaultClause",7,1,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.13

// LabelledStatement

grm.define("LabelledStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                    // 6 = start
            ref("LabelIdentifier"), // 5 = ident
            whitespace,             // 4
            keyword(":"),           // 3
            whitespace,             // 2
            ref("LabelledItem"),    // 1 = item
            pos,                    // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"LabelledStatement",6,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// LabelledItem

grm.define("LabelledItem",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("Statement"),
            ref("FunctionDeclaration"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.14

// ThrowStatement

grm.define("ThrowStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 6 = start
            keyword("throw"),    // 5
            whitespaceNoNewline, // 4
            ref("Expression"),   // 3 = expr
            whitespace,          // 2
            keyword(";"),        // 1
            pos,                 // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ThrowStatement",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 13.15

// TryStatement

grm.define("TryStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                         // 7 = start
            keyword("try"),              // 6
            whitespace,                  // 5
            ref("Block"),                // 4 = tryBlock
            choice([
                items([
                    whitespace,          // 3
                    value(null),         // 2 = catchBlock
                    ref("Finally"),      // 1 = finallyBlock
                ]),
                items([
                    whitespace,          // 3
                    ref("Catch"),        // 2 = catchBlock
                    opt(items([          // 1 = finallyBlock
                        whitespace,
                        ref("Finally"),
                        popAboveAndReplace(1,0),
                    ])),
                ]),
            ]),
            pos,                         // 0 = end
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"TryStatement",7,0,[4,2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Catch

grm.define("Catch",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                   // 10 = start
            keyword("catch"),      // 9
            whitespace,            // 8
            keyword("("),          // 7
            whitespace,            // 6
            ref("CatchParameter"), // 5 = param
            whitespace,            // 4
            keyword(")"),          // 3
            whitespace,            // 2
            ref("Block"),          // 1 = block
            pos,                   // 0 = end
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"Catch",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Finally

grm.define("Finally",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                // 4
            keyword("finally"), // 3
            whitespace,         // 2
            ref("Block"),       // 1
            pos,                // 0
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"Finally",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// CatchParameter

grm.define("CatchParameter",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("BindingIdentifier"),
            ref("BindingPattern"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 13.16

// DebuggerStatement

grm.define("DebuggerStatement",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 4
            keyword("debugger"), // 3
            whitespace,          // 2
            keyword(";"),        // 1
            pos,                 // 0
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"DebuggerStatement",4,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 14.1

// FunctionDeclaration_named

grm.define("FunctionDeclaration_named",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 16 = start
            keyword("function"),      // 15
            whitespace,               // 14
            ref("BindingIdentifier"), // 13 = ident
            whitespace,               // 12
            keyword("("),             // 11
            whitespace,               // 10
            ref("FormalParameters"),  // 9 = params
            whitespace,               // 8
            keyword(")"),             // 7
            whitespace,               // 6
            keyword("{"),             // 5
            whitespace,               // 4
            ref("FunctionBody"),      // 3 = body
            whitespace,               // 2
            keyword("}"),             // 1
            pos,                      // 0 = end
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"FunctionDeclaration",16,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// FunctionDeclaration_unnamed

grm.define("FunctionDeclaration_unnamed",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 15 = start
            keyword("function"),     // 14
            whitespace,              // 13
            keyword("("),            // 12
            whitespace,              // 11
            value(null),             // 10 = null
            ref("FormalParameters"), // 9 = params
            whitespace,              // 8
            keyword(")"),            // 7
            whitespace,              // 6
            keyword("{"),            // 5
            whitespace,              // 4
            ref("FunctionBody"),     // 3 = body
            whitespace,              // 2
            keyword("}"),            // 1
            pos,                     // 0 = end
            assertLengthIs(oldLength+16),
            popAboveAndMakeNode(15,"FunctionDeclaration",15,0,[10,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// FunctionDeclaration

grm.define("FunctionDeclaration",(b: Builder): void => {
    b.item(choice([
        ref("FunctionDeclaration_named"),
        ref("FunctionDeclaration_unnamed"),
    ]));
});

// FunctionExpression

grm.define("FunctionExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 15 = start
            keyword("function"),     // 14
            whitespace,              // 13
            opt(items([
                ref("BindingIdentifier"),
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            keyword("("),            // 11
            whitespace,              // 10
            ref("FormalParameters"), // 9 = params
            whitespace,              // 8
            keyword(")"),            // 7
            whitespace,              // 6
            keyword("{"),            // 5
            whitespace,              // 4
            ref("FunctionBody"),     // 3 = body
            whitespace,              // 2
            keyword("}"),            // 1
            pos,                     // 0 = end
            assertLengthIs(oldLength+16),
            popAboveAndMakeNode(15,"FunctionExpression",15,0,[12,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// StrictFormalParameters

grm.define("StrictFormalParameters",(b: Builder): void => {
    b.item(ref("FormalParameters"));
});

// FormalParameters

grm.define("FormalParameters",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                ref("FormalParameterList"),
                items([
                    pos,
                    popAboveAndMakeNode(0,"FormalParameters1",0,0,[]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// FormalParameterList

grm.define("FormalParameterList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                          // 2 = start
                    ref("FunctionRestParameter"), // 1 = rest
                    pos,                          // 0 = end
                    assertLengthIs(oldLength+3),
                    popAboveAndMakeNode(2,"FormalParameters2",2,0,[1]),
                ]),
                items([
                    pos,                // 3 = start
                    ref("FormalsList"), // 2 = formals
                    choice([
                        items([
                            whitespace,
                            keyword(","),
                            whitespace,
                            ref("FunctionRestParameter"),
                            pos,
                            assertLengthIs(oldLength+7),
                            popAboveAndMakeNode(6,"FormalParameters4",6,0,[5,1]),
                        ]),
                        items([
                            pos,
                            assertLengthIs(oldLength+3),
                            popAboveAndMakeNode(2,"FormalParameters3",2,0,[1]),
                        ]),
                    ]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
    });
});

// FormalsList

grm.define("FormalsList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("FormalParameter"),
                items([
                    whitespace,
                    keyword(","),
                    whitespace,
                    ref("FormalParameter"),
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// FunctionRestParameter

grm.define("FunctionRestParameter",(b: Builder): void => {
    b.item(ref("BindingRestElement"));
});

// FormalParameter

grm.define("FormalParameter",(b: Builder): void => {
    b.item(ref("BindingElement"));
});

// FunctionBody

grm.define("FunctionBody",(b: Builder): void => {
    b.item(ref("FunctionStatementList"));
});

// FunctionStatementList

grm.define("FunctionStatementList",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("StatementList"),
            items([
                pos,
                popAboveAndMakeEmptyList(0,0,0),
            ])
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 14.2

// ArrowFunction

grm.define("ArrowFunction",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                    // 6 = start
            ref("ArrowParameters"), // 5 = params
            whitespaceNoNewline,    // 4
            keyword("=>"),          // 3
            whitespace,             // 2
            ref("ConciseBody"),     // 1 = body
            pos,                    // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ArrowFunction",6,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ArrowParameters

grm.define("ArrowParameters",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("BindingIdentifier"),
            ref("ArrowFormalParameters"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ConciseBody_1

grm.define("ConciseBody_1",(b: Builder): void => {
    if (b.parser.lookaheadKeyword("{"))
        throw new ParseIgnore();
    b.item(ref("AssignmentExpression"));
});

// ConciseBody_2

grm.define("ConciseBody_2",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            keyword("{"),        // 4
            whitespace,          // 3
            ref("FunctionBody"), // 2
            whitespace,          // 1
            keyword("}"),        // 0
            assertLengthIs(oldLength+5),
            popAboveAndReplace(4,2),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ConciseBody

grm.define("ConciseBody",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("ConciseBody_1"),
            ref("ConciseBody_2"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ArrowFormalParameters

grm.define("ArrowFormalParameters",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            keyword("("),                  // 4
            whitespace,                    // 3
            ref("StrictFormalParameters"), // 2
            whitespace,                    // 1
            keyword(")"),                  // 0
            assertLengthIs(oldLength+5),
            popAboveAndReplace(4,2),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// Section 14.3

// MethodDefinition_1

grm.define("MethodDefinition_1",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                           // 14 = start
            ref("PropertyName"),           // 13 = name
            whitespace,                    // 12
            keyword("("),                  // 11
            whitespace,                    // 10
            ref("StrictFormalParameters"), // 9 = params
            whitespace,                    // 8
            keyword(")"),                  // 7
            whitespace,                    // 6
            keyword("{"),                  // 5
            whitespace,                    // 4
            ref("FunctionBody"),           // 3 = body
            whitespace,                    // 2
            keyword("}"),                  // 1
            pos,                           // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"Method",14,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// MethodDefinition_2

grm.define("MethodDefinition_2",(b: Builder): void => {
    b.item(ref("GeneratorMethod"));
});

// MethodDefinition_3

grm.define("MethodDefinition_3",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 14 = start
            identifier("get"),   // 13 "get" is not a reserved word, so we can't use keyword here
            whitespace,          // 12
            ref("PropertyName"), // 11 = name
            whitespace,          // 10
            keyword("("),        // 9
            whitespace,          // 8
            keyword(")"),        // 7
            whitespace,          // 6
            keyword("{"),        // 5
            whitespace,          // 4
            ref("FunctionBody"), // 3 = body
            whitespace,          // 2
            keyword("}"),        // 1
            pos,                 // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"Getter",14,0,[11,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// MethodDefinition_4

grm.define("MethodDefinition_4",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                             // 16 = start
            identifier("set"),               // 15
            whitespace,                      // 14
            ref("PropertyName"),             // 13 = name
            whitespace,                      // 12
            keyword("("),                    // 11
            whitespace,                      // 10
            ref("PropertySetParameterList"), // 9 = param
            whitespace,                      // 8
            keyword(")"),                    // 7
            whitespace,                      // 6
            keyword("{"),                    // 5
            whitespace,                      // 4
            ref("FunctionBody"),             // 3 = body
            whitespace,                      // 2
            keyword("}"),                    // 1
            pos,                             // 0 = end
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"Setter",16,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// MethodDefinition

grm.define("MethodDefinition",(b: Builder): void => {
    b.item(choice([
        ref("MethodDefinition_1"),
        ref("MethodDefinition_2"),
        ref("MethodDefinition_3"),
        ref("MethodDefinition_4"),
    ]));
});

// PropertySetParameterList

grm.define("PropertySetParameterList",(b: Builder): void => {
    b.item(ref("FormalParameter"));
});

// Section 14.4

// GeneratorMethod

grm.define("GeneratorMethod",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                           // 16 = start
            keyword("*"),                  // 15
            whitespace,                    // 14
            ref("PropertyName"),           // 13 = name
            whitespace,                    // 12
            keyword("("),                  // 11
            whitespace,                    // 10
            ref("StrictFormalParameters"), // 9 = params
            whitespace,                    // 8
            keyword(")"),                  // 7
            whitespace,                    // 6
            keyword("{"),                  // 5
            whitespace,                    // 4
            ref("GeneratorBody"),          // 3 = body
            whitespace,                    // 2
            keyword("}"),                  // 1
            pos,                           // 0 = end
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"GeneratorMethod",16,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// GeneratorDeclaration_1

grm.define("GeneratorDeclaration_1",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 18 = start
            keyword("function"),      // 17
            whitespace,               // 16
            keyword("*"),             // 15
            whitespace,               // 14
            ref("BindingIdentifier"), // 13 = ident
            whitespace,               // 12
            keyword("("),             // 11
            whitespace,               // 10
            ref("FormalParameters"),  // 9 = params
            whitespace,               // 8
            keyword(")"),             // 7
            whitespace,               // 6
            keyword("{"),             // 5
            whitespace,               // 4
            ref("GeneratorBody"),     // 3 = body
            whitespace,               // 2
            keyword("}"),             // 1
            pos,                      // 0 = end
            assertLengthIs(oldLength+19),
            popAboveAndMakeNode(18,"GeneratorDeclaration",18,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// GeneratorDeclaration_2

grm.define("GeneratorDeclaration_2",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 16 = start
            keyword("function"),     // 15
            whitespace,              // 14
            keyword("*"),            // 13
            whitespace,              // 12
            keyword("("),            // 11
            whitespace,              // 10
            ref("FormalParameters"), // 9 = params
            whitespace,              // 8
            keyword(")"),            // 7
            whitespace,              // 6
            keyword("{"),            // 5
            whitespace,              // 4
            ref("GeneratorBody"),    // 3 = body
            whitespace,              // 2
            keyword("}"),            // 1
            pos,                     // 0 = end
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"DefaultGeneratorDeclaration",16,0,[9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// GeneratorDeclaration

grm.define("GeneratorDeclaration",(b: Builder): void => {
    b.item(choice([
        ref("GeneratorDeclaration_1"),
        ref("GeneratorDeclaration_2"),
    ]));
});

// GeneratorExpression

grm.define("GeneratorExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 17 = start
            keyword("function"),     // 16
            whitespace,              // 15
            keyword("*"),            // 14
            whitespace,              // 13
            opt(items([
                ref("BindingIdentifier"),
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            keyword("("),            // 11
            whitespace,              // 10
            ref("FormalParameters"), // 9 = params
            whitespace,              // 8
            keyword(")"),            // 7
            whitespace,              // 6
            keyword("{"),            // 5
            whitespace,              // 4
            ref("GeneratorBody"),    // 3 = body
            whitespace,              // 2
            keyword("}"),            // 1
            pos,                     // 0 = end
            assertLengthIs(oldLength+18),
            popAboveAndMakeNode(17,"GeneratorExpression",17,0,[12,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// GeneratorBody

grm.define("GeneratorBody",(b: Builder): void => {
    b.item(ref("FunctionBody"));
});

// YieldExpression_1

grm.define("YieldExpression_1",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                         // 6
            keyword("yield"),            // 5
            whitespaceNoNewline,         // 4
            keyword("*"),                // 3
            whitespace,                  // 2
            ref("AssignmentExpression"), // 1
            pos,                         // 0
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"YieldStar",6,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// YieldExpression_2

grm.define("YieldExpression_2",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                         // 4
            keyword("yield"),            // 3
            whitespaceNoNewline,         // 2
            ref("AssignmentExpression"), // 1
            pos,                         // 0
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"YieldExpr",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// YieldExpression_3

grm.define("YieldExpression_3",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("yield"),
            pos,
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"YieldNothing",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// YieldExpression

grm.define("YieldExpression",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("YieldExpression_1"),
            ref("YieldExpression_2"),
            ref("YieldExpression_3"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 14.5

// ClassDeclaration_1

grm.define("ClassDeclaration_1",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 6 = start
            keyword("class"),         // 5
            whitespace,               // 4
            ref("BindingIdentifier"), // 3 = ident
            whitespace,               // 2
            ref("ClassTail"),         // 1 = tail
            pos,                      // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ClassDeclaration",6,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassDeclaration_2

grm.define("ClassDeclaration_2",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,              // 5
            keyword("class"), // 4
            whitespace,       // 3
            value(null),      // 2
            ref("ClassTail"), // 1
            pos,              // 0
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ClassDeclaration",5,0,[2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassDeclaration

grm.define("ClassDeclaration",(b: Builder): void => {
    b.item(choice([
        ref("ClassDeclaration_1"),
        ref("ClassDeclaration_2"),
    ]));
});

// ClassExpression

grm.define("ClassExpression",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 5
            keyword("class"),     // 4
            whitespace,           // 3
            opt(items([
                ref("BindingIdentifier"),
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            ref("ClassTail"),     // 1
            pos,                  // 0
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ClassExpression",5,0,[2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassTail

grm.define("ClassTail",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                // 6 = start
            opt(items([         // 5 = heritage
                ref("ClassHeritage"),
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            keyword("{"),       // 4
            whitespace,         // 3
            choice([            // 2 = body
                items([
                    ref("ClassBody"),
                    whitespace,
                    popAboveAndReplace(1,1),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            keyword("}"),       // 1
            pos,                // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ClassTail",6,0,[5,2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassHeritage

grm.define("ClassHeritage",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                           // 4 = start
            keyword("extends"),            // 3
            whitespace,                    // 2
            ref("LeftHandSideExpression"), // 1 = expr
            pos,                           // 0 = end
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"Extends",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassBody

grm.define("ClassBody",(b: Builder): void => {
    b.item(ref("ClassElementList"));
});

// ClassElementList

grm.define("ClassElementList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("ClassElement"),
                items([
                    whitespace,
                    ref("ClassElement"),
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassElement_1

grm.define("ClassElement_1",(b: Builder): void => {
    b.item(ref("MethodDefinition"));
});

// ClassElement_2

grm.define("ClassElement_2",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("static"),
            whitespace,
            ref("MethodDefinition"),
            pos,
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"StaticMethodDefinition",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassElement_3

grm.define("ClassElement_3",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword(";"),
            pos,
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"EmptyClassElement",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ClassElement

grm.define("ClassElement",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("ClassElement_1"),
            ref("ClassElement_2"),
            ref("ClassElement_3"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 15.1

// Script

grm.define("Script",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        pos,
        choice([
            ref("ScriptBody"),
            items([
                pos,
                popAboveAndMakeEmptyList(0,0,0),
            ])
        ]),
        assertLengthIs(oldLength+2),
        pos,
        assertLengthIs(oldLength+3),
        popAboveAndMakeNode(2,"Script",2,0,[1]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ScriptBody

grm.define("ScriptBody",(b: Builder): void => {
    b.item(ref("StatementList"));
});

// Section 15.2

// Module

grm.define("Module",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        pos,
        choice([
            ref("ModuleBody"),
            items([
                pos,
                popAboveAndMakeEmptyList(0,0,0),
            ])
        ]),
        assertLengthIs(oldLength+2),
        pos,
        assertLengthIs(oldLength+3),
        popAboveAndMakeNode(2,"Module",2,0,[1]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ModuleBody

grm.define("ModuleBody",(b: Builder): void => {
    b.item(ref("ModuleItemList"));
});

// ModuleItemList

grm.define("ModuleItemList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("ModuleItem"),
                items([
                    whitespace,
                    ref("ModuleItem"),
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ModuleItem

grm.define("ModuleItem",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("ImportDeclaration"),
            ref("ExportDeclaration"),
            ref("StatementListItem"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// Section 15.2.2

// ImportDeclaration_from

grm.define("ImportDeclaration_from",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 8 = start
            keyword("import"),   // 7
            whitespace,          // 6
            ref("ImportClause"), // 5 = importClause
            whitespace,          // 4
            ref("FromClause"),   // 3 = fromClause
            whitespace,          // 2
            keyword(";"),        // 1
            pos,                 // 0 = end
            assertLengthIs(oldLength+9),
            popAboveAndMakeNode(8,"ImportFrom",8,0,[5,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ImportDeclaration_module

grm.define("ImportDeclaration_module",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                    // 6 = start
            keyword("import"),      // 5
            whitespace,             // 4
            ref("ModuleSpecifier"), // 3 = specifier
            whitespace,             // 2
            keyword(";"),           // 1
            pos,                    // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ImportModule",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ImportDeclaration

grm.define("ImportDeclaration",(b: Builder): void => {
    const oldLength = b.length;
    b.items([
        choice([
            ref("ImportDeclaration_from"),
            ref("ImportDeclaration_module"),
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
});

// ImportClause

grm.define("ImportClause",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                ref("NameSpaceImport"),
                ref("NamedImports"),
                items([
                    pos,                            // 6 = start
                    ref("ImportedDefaultBinding"),  // 5 = defbinding
                    choice([
                        items([
                            whitespace,             // 4
                            keyword(","),           // 3
                            whitespace,             // 2
                            ref("NameSpaceImport"), // 1 = nsimport
                            pos,                    // 0 = end
                            assertLengthIs(oldLength+7),
                            popAboveAndMakeNode(6,"DefaultAndNameSpaceImports",6,0,[5,1]),
                        ]),
                        items([
                            whitespace,             // 4
                            keyword(","),           // 3
                            whitespace,             // 2
                            ref("NamedImports"),    // 1 = nsimports
                            pos,                    // 0 = end
                            assertLengthIs(oldLength+7),
                            popAboveAndMakeNode(6,"DefaultAndNamedImports",6,0,[5,1]),
                        ]),
                        items([
                            pos,
                            popAboveAndMakeNode(2,"DefaultImport",2,0,[1]),
                        ]),
                    ]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ImportedDefaultBinding

grm.define("ImportedDefaultBinding",(b: Builder): void => {
    b.item(ref("ImportedBinding"));
});

// NameSpaceImport

grm.define("NameSpaceImport",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                    // 6 = start
            keyword("*"),           // 5
            whitespace,             // 4
            keyword("as"),          // 3
            whitespace,             // 2
            ref("ImportedBinding"), // 1 = binding
            pos,                    // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"NameSpaceImport",6,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// NamedImports

grm.define("NamedImports",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 5 = start
            keyword("{"),      // 4
            whitespace,        // 3
            choice([           // 2 = imports
                items([
                    ref("ImportsList"),
                    whitespace,
                    opt(items([
                        keyword(","),
                        whitespace,
                        pop,
                    ])),
                    assertLengthIs(oldLength+6),
                    popAboveAndReplace(2,2),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ])
            ]),
            keyword("}"),      // 1
            pos,               // 0 = end
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"NamedImports",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// FromClause

grm.define("FromClause",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            keyword("from"),
            whitespace,
            ref("ModuleSpecifier"),
            assertLengthIs(oldLength+3),
            popAboveAndReplace(2,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ImportsList

grm.define("ImportsList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("ImportSpecifier"),
                items([
                    whitespace,
                    keyword(","),
                    whitespace,
                    ref("ImportSpecifier"),
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ImportSpecifier

grm.define("ImportSpecifier",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                     // 6 = start
                    ref("IdentifierName"),   // 5 = name
                    whitespace,              // 4
                    keyword("as"),           // 3
                    whitespace,              // 2
                    ref("ImportedBinding"),  // 1 = binding
                    pos,                     // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ImportAsSpecifier",6,0,[5,1]),
                ]),
                items([
                    pos,                     // 2 = start
                    ref("ImportedBinding"),  // 1 = binding
                    pos,                     // 0 = end
                    assertLengthIs(oldLength+3),
                    popAboveAndMakeNode(2,"ImportSpecifier",2,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ModuleSpecifier

grm.define("ModuleSpecifier",(b: Builder): void => {
    b.item(ref("StringLiteral"));
});

// ImportedBinding

grm.define("ImportedBinding",(b: Builder): void => {
    b.item(ref("BindingIdentifier"));
});

// Section 15.2.3

// ExportDeclaration

grm.define("ExportDeclaration",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            keyword("export"),
            whitespace,
            assertLengthIs(oldLength+3),
            choice([
                items([
                    keyword("default"),          // 3
                    whitespace,                  // 2
                    ref("HoistableDeclaration"), // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ExportDefault",6,0,[1]),
                ]),
                items([
                    keyword("default"),          // 3
                    whitespace,                  // 2
                    ref("ClassDeclaration"),     // 1
                    pos,                         // 0
                    popAboveAndMakeNode(6,"ExportDefault",6,0,[1]),
                ]),
                items([
                    keyword("default"),          // 7
                    whitespace,                  // 6
                    notKeyword("function"),      // 5 FIXME: need tests for this
                    notKeyword("class"),         // 4 FIXME: need tests for this
                    ref("AssignmentExpression"), // 3
                    whitespace,                  // 2
                    keyword(";"),                // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+11),
                    popAboveAndMakeNode(10,"ExportDefault",10,0,[3]),
                ]),
                items([
                    keyword("*"),                // 5
                    whitespace,                  // 4
                    ref("FromClause"),           // 3
                    whitespace,                  // 2
                    keyword(";"),                // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(8,"ExportStar",8,0,[3]),
                ]),
                items([
                    ref("ExportClause"),         // 5
                    whitespace,                  // 4
                    ref("FromClause"),           // 3
                    whitespace,                  // 2
                    keyword(";"),                // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(8,"ExportFrom",8,0,[5,3]),
                ]),
                items([
                    ref("ExportClause"),         // 3
                    whitespace,                  // 2
                    keyword(";"),                // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ExportPlain",6,0,[3]),
                ]),
                items([
                    ref("VariableStatement"),    // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"ExportVariable",4,0,[1]),
                ]),
                items([
                    ref("Declaration"),          // 1
                    pos,                         // 0
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"ExportDeclaration",4,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ExportClause

grm.define("ExportClause",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,             // 5
            keyword("{"),    // 4
            whitespace,      // 3
            choice([         // 2
                items([
                    ref("ExportsList"),
                    whitespace,
                    opt(items([
                        keyword(","),
                        whitespace,
                        pop,
                    ])),
                    assertLengthIs(oldLength+6),
                    popAboveAndReplace(2,2),
                    assertLengthIs(oldLength+4),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            keyword("}"),    // 1
            pos,             // 0
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ExportClause",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ExportsList

grm.define("ExportsList",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ref("ExportSpecifier"),
                items([
                    whitespace,
                    keyword(","),
                    whitespace,
                    ref("ExportSpecifier"),
                    popAboveAndReplace(3,0),
                ])
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

// ExportSpecifier

grm.define("ExportSpecifier",(b: Builder): void => {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            ref("IdentifierName"),
            choice([
                items([
                    whitespace,            // 4
                    keyword("as"),         // 3
                    whitespace,            // 2
                    ref("IdentifierName"), // 1
                    pos,                   // 0
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(4,"ExportAsSpecifier",6,0,[5,1]),
                    assertLengthIs(oldLength+3),
                ]),
                items([
                    pos,
                    assertLengthIs(oldLength+3),
                    popAboveAndMakeNode(0,"ExportNormalSpecifier",2,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+3),
            popAboveAndReplace(2,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
});

export function parseScript(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(grm,p);
        ref("Script")(b);
        b.item(assertLengthIs(1));
        return checkNode(b.get(0));
    });
}

export function parseModule(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(grm,p);
        ref("Module")(b);
        b.item(assertLengthIs(1));
        return checkNode(b.get(0));
    });
}
