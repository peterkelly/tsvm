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
    b.item(assertLengthIs(oldLength+1));
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.item(popAboveAndSet(0,new IdentifierReferenceNode(ident.range,ident.value)));
    b.item(assertLengthIs(oldLength+1));
    checkNode(b.get(0));
}

// BindingIdentifier

function BindingIdentifier(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier);
    b.item(assertLengthIs(oldLength+1));
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.item(popAboveAndSet(0,new BindingIdentifierNode(ident.range,ident.value)));
    b.item(assertLengthIs(oldLength+1));
    checkNode(b.get(0));
}

// LabelIdentifier

function LabelIdentifier(b: Builder): void {
    const oldLength = b.length;
    b.item(Identifier);
    b.item(assertLengthIs(oldLength+1));
    const ident = checkNode(b.get(0));
    if (ident instanceof IdentifierNode)
        b.item(popAboveAndSet(0,new LabelIdentifierNode(ident.range,ident.value)));
    b.item(assertLengthIs(oldLength+1));
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
            b.item(push(new IdentifierNode(range,value)));
            b.item(assertLengthIs(oldLength+1));
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
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"This",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// PrimaryExpression

function PrimaryExpression(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
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
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            popAboveAndReplace(4,2),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.2.4

// Literal

function Literal(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            NullLiteral,
            BooleanLiteral,
            NumericLiteral,
            StringLiteral,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"NullLiteral",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BooleanLiteral

function BooleanLiteral(b: Builder): void {
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
        b.item(push(new NumericLiteralNode(new Range(start,p.pos),value)));
        b.item(assertLengthIs(oldLength+1));
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
            b.item(push(new StringLiteralNode(new Range(start,p.pos),value)));
            b.item(assertLengthIs(oldLength+1));
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
        b.items([
            pos,
            punctuator("["),
            whitespace,
        ]);

        const elements: ASTNode[] = [];
        const listStart = b.parser.pos;
        let listEnd = b.parser.pos;

        b.items([
            assertLengthIs(oldLength+3),
            opt(items([
                pos,             // 3 = before
                punctuator(","), // 2
                pos,             // 1 = after
                whitespace,      // 0
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
            if (b.parser.lookaheadPunctuator("]")) {
                b.parser.expectPunctuator("]");
                break;
            }

            try {
                b.items([
                    choice([
                        items([
                            pos,             // 3 = before
                            punctuator(","), // 2
                            pos,             // 1 = after
                            whitespace,      // 0
                            assertLengthIs(oldLength+8),
                            popAboveAndMakeNode(3,"Elision",3,1,[]),
                            assertLengthIs(oldLength+5),
                        ]),
                        items([
                            AssignmentExpression,
                            whitespace,
                            opt(items([
                                punctuator(","),
                                whitespace,
                                pop,
                            ])),
                            assertLengthIs(oldLength+7),
                            popAboveAndReplace(2,2),
                            assertLengthIs(oldLength+5),
                        ]),
                        items([
                            SpreadElement,
                            whitespace,
                            opt(items([
                                punctuator(","),
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
            popAboveAndMakeNode(4,"SpreadElement",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
                items([
                    PropertyDefinitionList,
                    whitespace,
                    opt(items([
                        punctuator(","),
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
            punctuator("}"),     // 1
            pos,                 // 0 = end
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ObjectLiteral",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// PropertyDefinitionList

function PropertyDefinitionList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            PropertyDefinition,
            items([
                whitespace,
                punctuator(","),
                whitespace,
                PropertyDefinition,
                popAboveAndReplace(3,0),
            ]),
        );
        b.item(assertLengthIs(oldLength+1));
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ColonPropertyDefinition",6,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// PropertyDefinition

function PropertyDefinition(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            PropertyDefinition_colon,
            CoverInitializedName,
            MethodDefinition,
            IdentifierReference,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// PropertyName

function PropertyName(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            LiteralPropertyName,
            ComputedPropertyName,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// LiteralPropertyName

function LiteralPropertyName(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            IdentifierName,
            StringLiteral,
            NumericLiteral,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ComputedPropertyName",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"CoverInitializedName",4,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+3),
            popAboveAndReplace(2,0),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"NewExpression",6,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// MemberExpression_start

function MemberExpression_start(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            PrimaryExpression,
            SuperProperty,
            MetaProperty,
            MemberExpression_new,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// MemberExpression

function MemberExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            MemberExpression_start,
            repeatChoice([
                items([
                    whitespace,      // 6
                    punctuator("["), // 5
                    whitespace,      // 4
                    Expression,      // 3 = expr
                    whitespace,      // 2
                    punctuator("]"), // 1
                    pos,             // 0 = end
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(7,"MemberAccessExpr",8,0,[7,3]),
                ]),
                items([
                    whitespace,      // 5
                    punctuator("."), // 4
                    whitespace,      // 3
                    IdentifierName,  // 2 = ident
                    pos,             // 1 = end
                    whitespace,      // 0
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
}

// SuperProperty

function SuperProperty(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,              // 8 = start
                    keyword("super"), // 7
                    whitespace,       // 6
                    punctuator("["),  // 5
                    whitespace,       // 4
                    Expression,       // 3 = expr
                    whitespace,       // 2
                    punctuator("]"),  // 1
                    pos,              // 0 = end
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(8,"SuperPropertyExpr",8,0,[3]),
                    assertLengthIs(oldLength+1),
                ]),
                items([
                    pos,              // 6 = start
                    keyword("super"), // 5
                    whitespace,       // 4
                    punctuator("."),  // 3
                    whitespace,       // 2
                    Identifier,       // 1 = ident
                    pos,              // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"SuperPropertyIdent",6,0,[1]),
                    assertLengthIs(oldLength+1),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"NewTarget",6,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// NewExpression

function NewExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                MemberExpression,
                () => {
                    b.items([
                        pos,            // 5 = start
                        keyword("new"), // 4
                        whitespace,     // 3
                        NewExpression,  // 2 = expr
                        value(null),    // 1 = args
                        pos,            // 0 = end
                        assertLengthIs(oldLength+6),
                        popAboveAndMakeNode(5,"NewExpression",5,0,[2,1]),
                    ]);
                },
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// CallExpression_start

function CallExpression_start(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(choice([
            SuperCall,
            items([
                pos,              // 4 = start
                MemberExpression, // 3 = fun
                whitespace,       // 2
                Arguments,        // 1 = args
                pos,              // 0 = end
                assertLengthIs(oldLength+5),
                popAboveAndMakeNode(4,"Call",4,0,[3,1]),
            ]),
        ]));
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
}

// CallExpression

function CallExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            CallExpression_start,
            repeatChoice([
                items([
                    whitespace,      // 2
                    Arguments,       // 1
                    pos,             // 0
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(3,"Call",4,0,[3,1]),
                ]),
                items([
                    whitespace,      // 6
                    punctuator("["), // 5
                    whitespace,      // 4
                    Expression,      // 3 = expr
                    whitespace,      // 2
                    punctuator("]"), // 1
                    pos,             // 0 = end
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(7,"MemberAccessExpr",8,0,[7,3]),
                ]),
                items([
                    whitespace,      // 4
                    punctuator("."), // 3
                    whitespace,      // 2
                    IdentifierName,  // 1 = idname
                    pos,             // 0 = end
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"SuperCall",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Arguments

function Arguments(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.item(choice([
            items([
                pos,             // 6 = start
                punctuator("("), // 5
                whitespace,      // 4
                pos,             // 3 = listpos
                punctuator(")"), // 2
                pos,             // 1 = end
                value(null),     // 0 = will become list
                assertLengthIs(oldLength+7),
                popAboveAndMakeEmptyList(0,3,3),
                popAboveAndMakeNode(6,"Arguments",6,1,[0]),
            ]),
            items([
                pos,             // 6 = start
                punctuator("("), // 5
                whitespace,      // 4
                ArgumentList,    // 3 = args
                whitespace,      // 2
                punctuator(")"), // 1
                pos,             // 0 = end
                assertLengthIs(oldLength+7),
                popAboveAndMakeNode(6,"Arguments",6,0,[3]),
            ]),
        ]));
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
}

// ArgumentList_item

function ArgumentList_item(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                  // 4 = start
                    punctuator("..."),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = expr
                    pos,                  // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"SpreadElement",4,0,[1]),
                ]),
                AssignmentExpression,
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ArgumentList

function ArgumentList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.list(
            ArgumentList_item,
            items([
                whitespace,
                punctuator(","),
                whitespace,
                ArgumentList_item,
                popAboveAndReplace(3,0),
            ]),
        );
        b.item(assertLengthIs(oldLength+1));
        checkNode(b.get(0));
    });
}

// LeftHandSideExpression

function LeftHandSideExpression(b: Builder): void {
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    const oldLength = b.length;
    b.items([
        choice([
            CallExpression,
            NewExpression,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
                items([
                    whitespaceNoNewline,
                    punctuator("++"),
                    pos,
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PostIncrement",4,0,[3]),
                ]),
                items([
                    whitespaceNoNewline,
                    punctuator("--"),
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
}

// Section 12.5

// UnaryExpression

function UnaryExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,               // 4 = start
                    keyword("delete"), // 3
                    whitespace,        // 2
                    UnaryExpression,   // 1 = expr
                    pos,               // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"Delete",4,0,[1]),
                ]),
                items([
                    pos,             // 4 = start
                    keyword("void"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"Void",4,0,[1]),
                ]),
                items([
                    pos,               // 4 = start
                    keyword("typeof"), // 3
                    whitespace,        // 2
                    UnaryExpression,   // 1 = expr
                    pos,               // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"TypeOf",4,0,[1]),
                ]),
                items([
                    pos,              // 4 = start
                    punctuator("++"), // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = expr
                    pos,              // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PreIncrement",4,0,[1]),
                ]),
                items([
                    pos,              // 4 = start
                    punctuator("--"), // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = expr
                    pos,              // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"PreDecrement",4,0,[1]),
                ]),
                items([
                    pos,             // 4 = start
                    punctuator("+"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryPlus",4,0,[1]),
                ]),
                items([
                    pos,             // 4 = start
                    punctuator("-"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryMinus",4,0,[1]),
                ]),
                items([
                    pos,             // 4 = start
                    punctuator("~"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryBitwiseNot",4,0,[1]),
                ]),
                items([
                    pos,             // 4 = start
                    punctuator("!"), // 3
                    whitespace,      // 2
                    UnaryExpression, // 1 = expr
                    pos,             // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"UnaryLogicalNot",4,0,[1]),
                ]),
                PostfixExpression,
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.6

// MultiplicativeExpression

function MultiplicativeExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 6 = start
            UnaryExpression,          // 5 = left
            repeatChoice([
                items([
                    whitespace,       // 4
                    punctuator("*"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                    popAboveAndMakeNode(5,"Multiply",6,0,[5,1]),
                ]),
                items([
                    whitespace,       // 4
                    punctuator("/"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                    popAboveAndMakeNode(5,"Divide",6,0,[5,1]),
                ]),
                items([
                    whitespace,       // 4
                    punctuator("%"),  // 3
                    whitespace,       // 2
                    UnaryExpression,  // 1 = right
                    pos,              // 0 = end
                    popAboveAndMakeNode(5,"Modulo",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.7

// AdditiveExpression

function AdditiveExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                              // 6 = start
            MultiplicativeExpression,         // 5 = left
            repeatChoice([
                items([
                    whitespace,               // 4
                    punctuator("+"),          // 3
                    whitespace,               // 2
                    MultiplicativeExpression, // 1 = right
                    pos,                      // 0 = end
                    popAboveAndMakeNode(5,"Add",6,0,[5,1]),
                ]),
                items([
                    whitespace,               // 4
                    punctuator("-"),          // 3
                    whitespace,               // 2
                    MultiplicativeExpression, // 1 = right
                    pos,                      // 0 = end
                    popAboveAndMakeNode(5,"Subtract",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.8

// ShiftExpression

function ShiftExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                        // 6 = start
            AdditiveExpression,         // 5 = left
            repeatChoice([
                items([
                    whitespace,         // 4
                    punctuator("<<"),   // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                    popAboveAndMakeNode(5,"LeftShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,         // 4
                    punctuator(">>>"),  // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                    popAboveAndMakeNode(5,"UnsignedRightShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,         // 4
                    punctuator(">>"),   // 3
                    whitespace,         // 2
                    AdditiveExpression, // 1 = right
                    pos,                // 0 = end
                    popAboveAndMakeNode(5,"SignedRightShift",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.9

// RelationalExpression

function RelationalExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 6 = start
            ShiftExpression,     // 5 = left
            repeatChoice([
                items([
                    whitespace,       // 4
                    punctuator("<="), // 3
                    whitespace,       // 2
                    ShiftExpression,  // 1 = right
                    pos,              // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"LessEqual",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,       // 4
                    punctuator(">="), // 3
                    whitespace,       // 2
                    ShiftExpression,  // 1 = right
                    pos,              // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"GreaterEqual",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,      // 4
                    punctuator("<"), // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"LessThan",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,      // 4
                    punctuator(">"), // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"GreaterThan",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,            // 4
                    keyword("instanceof"), // 3
                    whitespace,            // 2
                    ShiftExpression,       // 1 = right
                    pos,                   // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"InstanceOf",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,      // 4
                    keyword("in"),   // 3
                    whitespace,      // 2
                    ShiftExpression, // 1 = right
                    pos,             // 0 = end
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
}

// Section 12.10

// EqualityExpression

function EqualityExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                          // 6 = start
            RelationalExpression,         // 5 = left
            repeatChoice([
                items([
                    whitespace,           // 4
                    punctuator("==="),    // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"StrictEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("!=="),    // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"StrictNotEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("=="),     // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(5,"AbstractEquals",6,0,[5,1]),
                    assertLengthIs(oldLength+2),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("!="),     // 3
                    whitespace,           // 2
                    RelationalExpression, // 1 = right
                    pos,                  // 0 = end
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
}

// Section 12.11

// BitwiseANDExpression

function BitwiseANDExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                        // 6 = start
            EqualityExpression,         // 5 = left
            repeat(items([
                whitespace,         // 4
                punctuator("&"),    // 3
                whitespace,         // 2
                EqualityExpression, // 1 = right
                pos,                // 0 = end
                popAboveAndMakeNode(5,"BitwiseAND",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BitwiseXORExpression

function BitwiseXORExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                          // 6 = start
            BitwiseANDExpression,         // 5 = left
            repeat(items([
                whitespace,           // 4
                punctuator("^"),      // 3
                whitespace,           // 2
                BitwiseANDExpression, // 1 = right
                pos,                  // 0 = end
                popAboveAndMakeNode(5,"BitwiseXOR",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BitwiseORExpression

function BitwiseORExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 6 = start
            BitwiseXORExpression,     // 5 = left
            repeat(items([
                whitespace,           // 4
                punctuator("|"),      // 3
                whitespace,           // 2
                BitwiseXORExpression, // 1 = right
                pos,                  // 0 = end
                popAboveAndMakeNode(5,"BitwiseOR",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.12

// LogicalANDExpression

function LogicalANDExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                     // 6 = start
            BitwiseORExpression,     // 5 = left
            repeat(items([
                whitespace,          // 4
                punctuator("&&"),    // 3
                whitespace,          // 2
                BitwiseORExpression, // 1 = right
                pos,                 // 0 = end
                popAboveAndMakeNode(5,"LogicalAND",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// LogicalORExpression

function LogicalORExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                      // 6 = start
            LogicalANDExpression,     // 5 = left
            repeat(items([
                whitespace,           // 4
                punctuator("||"),     // 3
                whitespace,           // 2
                LogicalANDExpression, // 1 = right
                pos,                  // 0 = end
                popAboveAndMakeNode(5,"LogicalOR",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.13

// ConditionalExpression

function ConditionalExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                          // 10 = start
            LogicalORExpression,          // 9 = condition
            choice([
                items([
                    whitespace,           // 8
                    punctuator("?"),      // 7
                    whitespace,           // 6
                    AssignmentExpression, // 5 = trueExpr
                    whitespace,           // 4
                    punctuator(":"),      // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = falseExpr
                    pos,                  // 0 = end
                    popAboveAndMakeNode(9,"Conditional",10,0,[9,5,1]),
                ]),
                () => {},
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 12.14

// AssignmentExpression_plain

function AssignmentExpression_plain(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                          // 6 = start
            LeftHandSideExpression,       // 5 = left
            choice([
                items([
                    whitespace,           // 4
                    punctuator("="),      // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"Assign",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("*="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignMultiply",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("/="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignDivide",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("%="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignModulo",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("+="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignAdd",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("-="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignSubtract",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("<<="),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignLeftShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator(">>="),    // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignSignedRightShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator(">>>="),   // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignUnsignedRightShift",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("&="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignBitwiseAND",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("^="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignBitwiseXOR",6,0,[5,1]),
                ]),
                items([
                    whitespace,           // 4
                    punctuator("|="),     // 3
                    whitespace,           // 2
                    AssignmentExpression, // 1 = right
                    pos,                  // 0 = end
                    popAboveAndMakeNode(5,"AssignBitwiseOR",6,0,[5,1]),
                ]),
            ]),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// AssignmentExpression

function AssignmentExpression(b: Builder): void {
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    const oldLength = b.length;
    b.items([
        choice([
            ArrowFunction,
            AssignmentExpression_plain,
            ConditionalExpression,
            YieldExpression,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// Section 12.15

// Expression

function Expression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 6 = start
            AssignmentExpression, // 5 = left
            repeat(items([
                whitespace,           // 4
                punctuator(","),      // 3
                whitespace,           // 2
                AssignmentExpression, // 1 = right
                pos,                  // 0 = end
                popAboveAndMakeNode(5,"Comma",6,0,[5,1]),
            ])),
            assertLengthIs(oldLength+2),
            popAboveAndReplace(1,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 13

// Statement

function Statement(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
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
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// Declaration

function Declaration(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            HoistableDeclaration,
            ClassDeclaration,
            LexicalDeclaration,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// HoistableDeclaration

function HoistableDeclaration(b: Builder): void {
    b.item(choice([
        FunctionDeclaration,
        GeneratorDeclaration,
    ]));
}

// BreakableStatement

function BreakableStatement(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            IterationStatement,
            SwitchStatement,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
                items([
                    StatementList,
                    whitespace,
                    popAboveAndReplace(1,1),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            punctuator("}"),     // 1
            pos,                 // 0
            popAboveAndMakeNode(5,"Block",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// StatementList

function StatementList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                StatementListItem,
                items([
                    whitespace,
                    StatementListItem,
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// StatementListItem

function StatementListItem(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            Statement,
            Declaration,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// Section 13.3.1

// LexicalDeclaration

function LexicalDeclaration(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,              // 6 = start
                    keyword("let"),   // 5
                    whitespace,       // 4
                    BindingList,      // 3 = bindings
                    whitespace,       // 2
                    punctuator(";"),  // 1
                    pos,              // 0 = end
                    popAboveAndMakeNode(6,"Let",6,0,[3]),
                ]),
                items([
                    pos,              // 6 = start
                    keyword("const"), // 5
                    whitespace,       // 4
                    BindingList,      // 3 = bindings
                    whitespace,       // 2
                    punctuator(";"),  // 1
                    pos,              // 0 = end
                    popAboveAndMakeNode(6,"Const",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BindingList

function BindingList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                LexicalBinding,
                items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    LexicalBinding,
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// LexicalBinding_identifier

function LexicalBinding_identifier(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,               // 3 = start
            BindingIdentifier, // 2 = identifier
            opt(items([        // 1 = initializer
                whitespace,
                Initializer,
                popAboveAndReplace(1,0),
            ])),
            pos,               // 0 = end
            assertLengthIs(oldLength+4),
            popAboveAndMakeNode(3,"LexicalIdentifierBinding",3,0,[2,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"LexicalPatternBinding",4,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// LexicalBinding

function LexicalBinding(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            LexicalBinding_identifier,
            LexicalBinding_pattern,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            popAboveAndMakeNode(6,"Var",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// VariableDeclarationList

function VariableDeclarationList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                VariableDeclaration,
                items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    VariableDeclaration,
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
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
                items([
                    whitespace,
                    Initializer,
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"VarPattern",4,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// VariableDeclaration

function VariableDeclaration(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            VariableDeclaration_identifier,
            VariableDeclaration_pattern,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// Section 13.3.3

// BindingPattern

function BindingPattern(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            ObjectBindingPattern,
            ArrayBindingPattern,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
                items([
                    BindingPropertyList,
                    whitespace,
                    opt(items([
                        punctuator(","),
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
            punctuator("}"),      // 1
            pos,                  // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ObjectBindingPattern",6,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
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
            opt(items([          // 2 = rest
                BindingRestElement,
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            punctuator("]"),     // 1
            pos,                 // 0 = end
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"ArrayBindingPattern",7,0,[4,2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BindingPropertyList

function BindingPropertyList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                BindingProperty,
                items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    BindingProperty,
                    popAboveAndReplace(3,0),
                ])
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BindingElementList

function BindingElementList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                opt(items([
                    pos,
                    punctuator(","),
                    pos,
                    popAboveAndMakeNode(2,"Elision",2,0,[]),
                ])),
                choice([
                    items([
                        whitespace,      // 3
                        pos,             // 2 = before
                        punctuator(","), // 1
                        pos,             // 0 = after
                        popAboveAndMakeNode(3,"Elision",2,0,[]),
                    ]),
                    items([
                        whitespace,
                        BindingElement,
                        opt(items([
                            whitespace,
                            punctuator(","),
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
}

// BindingProperty

function BindingProperty(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,             // 6 = start
                    PropertyName,    // 5 = name
                    whitespace,      // 4
                    punctuator(":"), // 3
                    whitespace,      // 2
                    BindingElement,  // 1 = element
                    pos,             // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"BindingProperty",6,0,[5,1]),
                ]),
                // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
                // and PropertyName will match an identifier at the start of a colon binding
                SingleNameBinding,
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// BindingElement

function BindingElement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                SingleNameBinding,
                items([
                    pos,
                    BindingPattern,
                    choice([
                        items([
                            whitespace,
                            Initializer,
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
}

// SingleNameBinding

function SingleNameBinding(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,
            BindingIdentifier,
            choice([
                items([
                    whitespace,
                    Initializer,
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"BindingRestElement",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"EmptyStatement",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"ExpressionStatement",4,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
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
            opt(items([        // 1 = falseBranch
                whitespace,
                keyword("else"),
                whitespace,
                Statement,
                popAboveAndReplace(3,0),
            ])),
            pos,               // 0 = end
            assertLengthIs(oldLength+12),
            popAboveAndMakeNode(11,"IfStatement",11,0,[6,2,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"DoStatement",14,0,[11,5]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"WhileStatement",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            choice([
                items([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    Expression,
                    whitespace,
                    punctuator(";"),
                    whitespace,
                    popAboveAndReplace(5,3),
                ]),
                items([
                    pos,                     // 7 = start2
                    keyword("var"),          // 6
                    whitespace,              // 5
                    VariableDeclarationList, // 4 = declarations
                    pos,                     // 3 = end
                    whitespace,              // 2
                    punctuator(";"),         // 1
                    whitespace,              // 0
                    popAboveAndMakeNode(7,"Var",7,3,[4]),
                ]),
                items([
                    LexicalDeclaration,
                    whitespace,
                    popAboveAndReplace(1,1),
                ]),
                // initializer part can be empty, but need to distinguish this from an error
                items([
                    punctuator(";"),
                    popAboveAndSet(0,null),
                ]),
            ]),
            assertLengthIs(oldLength+6),
            opt(Expression), // 8 = condition
            whitespace,      // 7
            punctuator(";"), // 6
            whitespace,      // 5
            opt(items([
                Expression,
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            punctuator(")"), // 3
            whitespace,      // 2
            Statement,       // 1 = body
            pos,             // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"ForC",14,0,[9,8,4,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            choice([ // 9 = binding
                items([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    LeftHandSideExpression,
                    popAboveAndReplace(2,0),
                ]),
                items([
                    pos,
                    keyword("var"),
                    whitespace,
                    ForBinding,
                    pos,
                    popAboveAndMakeNode(4,"VarForDeclaration",4,0,[1]),
                ]),
                ForDeclaration,
            ]),
            assertLengthIs(oldLength+6),
            whitespace,                                    // 8
            keyword("in"),                                 // 7
            whitespace,                                    // 6
            Expression,                                    // 5 = expr
            whitespace,                                    // 4
            punctuator(")"),                               // 3
            whitespace,                                    // 2
            Statement,                                     // 1 = body
            pos,                                           // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"ForIn",14,0,[9,5,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            choice([
                items([
                    notKeyword("let"), // FIXME: need tests for this
                    notPunctuator("["), // FIXME: need tests for this
                    LeftHandSideExpression,
                    popAboveAndReplace(2,0),
                ]),
                items([
                    pos,
                    keyword("var"),
                    whitespace,
                    ForBinding,
                    pos,
                    popAboveAndMakeNode(4,"VarForDeclaration",4,0,[1]),
                ]),
                ForDeclaration,
            ]),
            assertLengthIs(oldLength+6),
            whitespace,                                    // 8
            keyword("of"),                                 // 7
            whitespace,                                    // 6
            Expression,                                    // 5 = expr
            whitespace,                                    // 4
            punctuator(")"),                               // 3
            whitespace,                                    // 2
            Statement,                                     // 1 = body
            pos,                                           // 0 = end
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"ForOf",14,0,[9,5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// IterationStatement_for

function IterationStatement_for(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            IterationStatement_for_c,
            IterationStatement_for_in,
            IterationStatement_for_of,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// IterationStatement

function IterationStatement(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            IterationStatement_do,
            IterationStatement_while,
            IterationStatement_for,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// ForDeclaration

function ForDeclaration(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,              // 4 = start
                    keyword("let"),   // 3
                    whitespace,       // 2
                    ForBinding,       // 1 = binding
                    pos,              // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"LetForDeclaration",4,0,[1]),
                ]),
                items([
                    pos,              // 4 = start
                    keyword("const"), // 3
                    whitespace,       // 2
                    ForBinding,       // 1 = binding
                    pos,              // 0 = end
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"ConstForDeclaration",4,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ForBinding

function ForBinding(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            BindingIdentifier,
            BindingPattern, // FIXME: Need test cases for this
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// Section 13.8

// ContinueStatement

function ContinueStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                 // 5 = start
                    keyword("continue"), // 4
                    whitespace,          // 3
                    value(null),         // 2 = null
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"ContinueStatement",5,0,[2]),
                ]),
                items([
                    pos,                 // 6 = start
                    keyword("continue"), // 5
                    whitespaceNoNewline, // 4
                    LabelIdentifier,     // 3 = ident
                    whitespace,          // 2
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ContinueStatement",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 13.9

// BreakStatement

function BreakStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,              // 5 = start
                    keyword("break"), // 4
                    whitespace,       // 3
                    value(null),      // 2 = null
                    punctuator(";"),  // 1
                    pos,              // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"BreakStatement",5,0,[2]),
                ]),
                items([
                    pos,                 // 6 = start
                    keyword("break"),    // 5
                    whitespaceNoNewline, // 4
                    LabelIdentifier,     // 3 = ident
                    whitespace,          // 2
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"BreakStatement",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// Section 13.10

// ReturnStatement

function ReturnStatement(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,               // 5 = start
                    keyword("return"), // 4
                    whitespace,        // 3
                    value(null),       // 2 = null
                    punctuator(";"),   // 1
                    pos,               // 0 = end
                    assertLengthIs(oldLength+6),
                    popAboveAndMakeNode(5,"ReturnStatement",5,0,[2]),
                ]),
                items([
                    pos,                 // 6 = start
                    keyword("return"),   // 5
                    whitespaceNoNewline, // 4
                    Expression,          // 3 = expr
                    whitespace,          // 2
                    punctuator(";"),     // 1
                    pos,                 // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ReturnStatement",6,0,[3]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"WithStatement",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"SwitchStatement",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
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
                CaseClauses,
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            whitespace,      // 2
            punctuator("}"), // 1
            pos,             // 0
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"CaseBlock1",7,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"CaseBlock2",10,0,[7,5,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// CaseBlock

function CaseBlock(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            CaseBlock_1,
            CaseBlock_2,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// CaseClauses

function CaseClauses(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                CaseClause,
                items([
                    whitespace,
                    CaseClause,
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+9),
            popAboveAndMakeNode(8,"CaseClause",8,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// DefaultClause

function DefaultClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                // 7 = start
            keyword("default"), // 6
            whitespace,         // 5
            punctuator(":"),    // 4
            whitespace,         // 3
            StatementList,      // 2 = statements
            pos,                // 1 = end
            whitespace,         // 0
            assertLengthIs(oldLength+8),
            popAboveAndMakeNode(7,"DefaultClause",7,1,[2]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"LabelledStatement",6,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// LabelledItem

function LabelledItem(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            Statement,
            FunctionDeclaration,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ThrowStatement",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
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
                items([
                    whitespace,          // 3
                    value(null),         // 2 = catchBlock
                    Finally,             // 1 = finallyBlock
                ]),
                items([
                    whitespace,          // 3
                    Catch,               // 2 = catchBlock
                    opt(items([          // 1 = finallyBlock
                        whitespace,
                        Finally,
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
            assertLengthIs(oldLength+11),
            popAboveAndMakeNode(10,"Catch",10,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"Finally",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// CatchParameter

function CatchParameter(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            BindingIdentifier,
            BindingPattern,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"DebuggerStatement",4,0,[]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"FunctionDeclaration",16,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+16),
            popAboveAndMakeNode(15,"FunctionDeclaration",15,0,[10,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// FunctionDeclaration

function FunctionDeclaration(b: Builder): void {
    b.item(choice([
        FunctionDeclaration_named,
        FunctionDeclaration_unnamed,
    ]));
}

// FunctionExpression

function FunctionExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                 // 15 = start
            keyword("function"), // 14
            whitespace,          // 13
            opt(items([
                BindingIdentifier,
                whitespace,
                popAboveAndReplace(1,1),
            ])),
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
            assertLengthIs(oldLength+16),
            popAboveAndMakeNode(15,"FunctionExpression",15,0,[12,9,3]),
            assertLengthIs(oldLength+1),
        ]);
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
        b.items([
            choice([
                FormalParameterList,
                items([
                    pos,
                    popAboveAndMakeNode(0,"FormalParameters1",0,0,[]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// FormalParameterList

function FormalParameterList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,                   // 2 = start
                    FunctionRestParameter, // 1 = rest
                    pos,                   // 0 = end
                    assertLengthIs(oldLength+3),
                    popAboveAndMakeNode(2,"FormalParameters2",2,0,[1]),
                ]),
                items([
                    pos,               // 3 = start
                    FormalsList,       // 2 = formals
                    choice([
                        items([
                            whitespace,
                            punctuator(","),
                            whitespace,
                            FunctionRestParameter,
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
}

// FormalsList

function FormalsList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                FormalParameter,
                items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    FormalParameter,
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
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
    b.items([
        choice([
            StatementList,
            items([
                pos,
                popAboveAndMakeEmptyList(0,0,0),
            ])
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ArrowFunction",6,0,[5,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ArrowParameters

function ArrowParameters(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            BindingIdentifier,
            ArrowFormalParameters,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndReplace(4,2),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ConciseBody

function ConciseBody(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            ConciseBody_1,
            ConciseBody_2,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndReplace(4,2),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"Method",14,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+15),
            popAboveAndMakeNode(14,"Getter",14,0,[11,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"Setter",16,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// MethodDefinition

function MethodDefinition(b: Builder): void {
    b.item(choice([
        MethodDefinition_1,
        MethodDefinition_2,
        MethodDefinition_3,
        MethodDefinition_4,
    ]));
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
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"GeneratorMethod",16,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+19),
            popAboveAndMakeNode(18,"GeneratorDeclaration",18,0,[13,9,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+17),
            popAboveAndMakeNode(16,"DefaultGeneratorDeclaration",16,0,[9,3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// GeneratorDeclaration

function GeneratorDeclaration(b: Builder): void {
    b.item(choice([
        GeneratorDeclaration_1,
        GeneratorDeclaration_2,
    ]));
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
            opt(items([
                BindingIdentifier,
                whitespace,
                popAboveAndReplace(1,1),
            ])),
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
            assertLengthIs(oldLength+18),
            popAboveAndMakeNode(17,"GeneratorExpression",17,0,[12,9,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"YieldStar",6,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"YieldExpr",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"YieldNothing",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// YieldExpression

function YieldExpression(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            YieldExpression_1,
            YieldExpression_2,
            YieldExpression_3,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ClassDeclaration",6,0,[3,1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ClassDeclaration",5,0,[2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ClassDeclaration

function ClassDeclaration(b: Builder): void {
    b.item(choice([
        ClassDeclaration_1,
        ClassDeclaration_2,
    ]));
}

// ClassExpression

function ClassExpression(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                  // 5
            keyword("class"),     // 4
            whitespace,           // 3
            opt(items([
                BindingIdentifier,
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            ClassTail,            // 1
            pos,                  // 0
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ClassExpression",5,0,[2,1]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ClassTail

function ClassTail(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            pos,                   // 6 = start
            opt(items([            // 5 = heritage
                ClassHeritage,
                whitespace,
                popAboveAndReplace(1,1),
            ])),
            punctuator("{"),       // 4
            whitespace,            // 3
            choice([               // 2 = body
                items([
                    ClassBody,
                    whitespace,
                    popAboveAndReplace(1,1),
                ]),
                items([
                    pos,
                    popAboveAndMakeEmptyList(0,0,0),
                ]),
            ]),
            punctuator("}"),       // 1
            pos,                   // 0 = end
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ClassTail",6,0,[5,2]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"Extends",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
        b.items([
            list(
                ClassElement,
                items([
                    whitespace,
                    ClassElement,
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+5),
            popAboveAndMakeNode(4,"StaticMethodDefinition",4,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+3),
            popAboveAndMakeNode(2,"EmptyClassElement",2,0,[]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ClassElement

function ClassElement(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            ClassElement_1,
            ClassElement_2,
            ClassElement_3,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// Section 15.1

// Script

function Script(b: Builder): void {
    const oldLength = b.length;
    b.items([
        pos,
        choice([
            ScriptBody,
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
}

// ScriptBody

function ScriptBody(b: Builder): void {
    b.item(StatementList);
}

// Section 15.2

// Module

function Module(b: Builder): void {
    const oldLength = b.length;
    b.items([
        pos,
        choice([
            ModuleBody,
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
}

// ModuleBody

function ModuleBody(b: Builder): void {
    b.item(ModuleItemList);
}

// ModuleItemList

function ModuleItemList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ModuleItem,
                items([
                    whitespace,
                    ModuleItem,
                    popAboveAndReplace(1,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ModuleItem

function ModuleItem(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            ImportDeclaration,
            ExportDeclaration,
            StatementListItem,
        ]),
        assertLengthIs(oldLength+1),
    ]);
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
            assertLengthIs(oldLength+9),
            popAboveAndMakeNode(8,"ImportFrom",8,0,[5,3]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"ImportModule",6,0,[3]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ImportDeclaration

function ImportDeclaration(b: Builder): void {
    const oldLength = b.length;
    b.items([
        choice([
            ImportDeclaration_from,
            ImportDeclaration_module,
        ]),
        assertLengthIs(oldLength+1),
    ]);
    checkNode(b.get(0));
}

// ImportClause

function ImportClause(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                NameSpaceImport,
                NamedImports,
                items([
                    pos,                            // 6 = start
                    ImportedDefaultBinding,         // 5 = defbinding
                    choice([
                        items([
                            whitespace,         // 4
                            punctuator(","),    // 3
                            whitespace,         // 2
                            NameSpaceImport,    // 1 = nsimport
                            pos,                // 0 = end
                            assertLengthIs(oldLength+7),
                            popAboveAndMakeNode(6,"DefaultAndNameSpaceImports",6,0,[5,1]),
                        ]),
                        items([
                            whitespace,         // 4
                            punctuator(","),    // 3
                            whitespace,         // 2
                            NamedImports,       // 1 = nsimports
                            pos,                // 0 = end
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
            assertLengthIs(oldLength+7),
            popAboveAndMakeNode(6,"NameSpaceImport",6,0,[1]),
            assertLengthIs(oldLength+1),
        ]);
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
                items([
                    ImportsList,
                    whitespace,
                    opt(items([
                        punctuator(","),
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
            punctuator("}"),    // 1
            pos,                // 0 = end
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"NamedImports",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+3),
            popAboveAndReplace(2,0),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ImportsList

function ImportsList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ImportSpecifier,
                items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    ImportSpecifier,
                    popAboveAndReplace(3,0),
                ]),
            ),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ImportSpecifier

function ImportSpecifier(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            choice([
                items([
                    pos,             // 6 = start
                    IdentifierName,  // 5 = name
                    whitespace,      // 4
                    keyword("as"),   // 3
                    whitespace,      // 2
                    ImportedBinding, // 1 = binding
                    pos,             // 0 = end
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ImportAsSpecifier",6,0,[5,1]),
                ]),
                items([
                    pos,             // 2 = start
                    ImportedBinding, // 1 = binding
                    pos,             // 0 = end
                    assertLengthIs(oldLength+3),
                    popAboveAndMakeNode(2,"ImportSpecifier",2,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
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
            assertLengthIs(oldLength+3),
            choice([
                items([
                    keyword("default"),                              // 3
                    whitespace,                                      // 2
                    HoistableDeclaration, // 1
                    pos,                                             // 0
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ExportDefault",6,0,[1]),
                ]),
                items([
                    keyword("default"), // 3
                    whitespace,         // 2
                    ClassDeclaration,   // 1
                    pos,                // 0
                    popAboveAndMakeNode(6,"ExportDefault",6,0,[1]),
                ]),
                items([
                    keyword("default"),     // 7
                    whitespace,             // 6
                    notKeyword("function"), // 5 FIXME: need tests for this
                    notKeyword("class"),    // 4 FIXME: need tests for this
                    AssignmentExpression,   // 3
                    whitespace,             // 2
                    punctuator(";"),        // 1
                    pos,                    // 0
                    assertLengthIs(oldLength+11),
                    popAboveAndMakeNode(10,"ExportDefault",10,0,[3]),
                ]),
                items([
                    punctuator("*"), // 5
                    whitespace,      // 4
                    FromClause,      // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(8,"ExportStar",8,0,[3]),
                ]),
                items([
                    ExportClause,    // 5
                    whitespace,      // 4
                    FromClause,      // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                    assertLengthIs(oldLength+9),
                    popAboveAndMakeNode(8,"ExportFrom",8,0,[5,3]),
                ]),
                items([
                    ExportClause,    // 3
                    whitespace,      // 2
                    punctuator(";"), // 1
                    pos,             // 0
                    assertLengthIs(oldLength+7),
                    popAboveAndMakeNode(6,"ExportPlain",6,0,[3]),
                ]),
                items([
                    VariableStatement, // 1
                    pos,               // 0
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"ExportVariable",4,0,[1]),
                ]),
                items([
                    Declaration, // 1
                    pos,         // 0
                    assertLengthIs(oldLength+5),
                    popAboveAndMakeNode(4,"ExportDeclaration",4,0,[1]),
                ]),
            ]),
            assertLengthIs(oldLength+1),
        ]);
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
                items([
                    ExportsList,
                    whitespace,
                    opt(items([
                        punctuator(","),
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
            punctuator("}"),           // 1
            pos,                       // 0
            assertLengthIs(oldLength+6),
            popAboveAndMakeNode(5,"ExportClause",5,0,[2]),
            assertLengthIs(oldLength+1),
        ]);
        checkNode(b.get(0));
    });
}

// ExportsList

function ExportsList(b: Builder): void {
    b.attempt((): void => {
        const oldLength = b.length;
        b.items([
            list(
                ExportSpecifier,
                items([
                    whitespace,
                    punctuator(","),
                    whitespace,
                    ExportSpecifier,
                    popAboveAndReplace(3,0),
                ])
            ),
            assertLengthIs(oldLength+1),
        ]);
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
                items([
                    whitespace,        // 4
                    keyword("as"),     // 3
                    whitespace,        // 2
                    IdentifierName,    // 1
                    pos,               // 0
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
}

export function parseScript(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        Script(b);
        b.item(assertLengthIs(1));
        return checkNode(b.get(0));
    });
}

export function parseModule(p: Parser): ASTNode {
    return p.attempt(() => {
        const b = new Builder(p);
        Module(b);
        b.item(assertLengthIs(1));
        return checkNode(b.get(0));
    });
}
