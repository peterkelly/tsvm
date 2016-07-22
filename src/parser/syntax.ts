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
    not,
    ref,
    list,
    items,
    popAboveAndSet,
    popAboveAndSet2,
    spliceReplace,
    spliceNode,
    spliceEmptyListNode,
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

grm.define("This",
    items([
        pos,
        keyword("this"),
        pos,
        spliceNode(2,"This",2,0,[]),
    ]));

// PrimaryExpression

grm.define("PrimaryExpression",
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
    ]));

// ParenthesizedExpression

grm.define("ParenthesizedExpression",
    items([
        keyword("("),      // 4
        whitespace,        // 3
        ref("Expression"), // 2 = expr
        whitespace,        // 1
        keyword(")"),      // 0
        spliceReplace(4,2),
    ]));

// Section 12.2.4

// Literal

grm.define("Literal",
    choice([
        ref("NullLiteral"),
        ref("BooleanLiteral"),
        ref("NumericLiteral"),
        ref("StringLiteral"),
    ]));

// NullLiteral

grm.define("NullLiteral",
    items([
        pos,
        keyword("null"),
        pos,
        spliceNode(2,"NullLiteral",2,0,[]),
    ]));

// BooleanLiteral

grm.define("BooleanLiteral",
    choice([
        items([
            pos,
            keyword("true"),
            pos,
            spliceNode(2,"True",2,0,[]),
        ]),
        items([
            pos,
            keyword("false"),
            pos,
            spliceNode(2,"False",2,0,[]),
        ]),
    ]));

// NumericLiteral

grm.define("NumericLiteral",(b: Builder): void => {
    // TODO: Complete numeric literal syntax according to spec
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
});

// StringLiteral

grm.define("StringLiteral",(b: Builder): void => {
    // TODO: Complete string literal syntax according to spec
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
        checkNode(b.get(0));
        return;
    }
    throw new ParseError(p,p.pos,"Invalid string");
});

// Section 12.2.5

// ArrayLiteral

grm.define("ArrayLiteral",
    items([
        pos,             // 5 = start
        keyword("["),    // 4
        whitespace,      // 3
        list(            // 2 = list
            (b: Builder): void => {
                b.push(null);
            },
            (b: Builder): void => {
                b.choice([
                    items([
                        pos,          // 3 = before
                        keyword(","), // 2
                        pos,          // 1 = after
                        whitespace,   // 0
                        spliceNode(3,"Elision",3,1,[]),
                    ]),
                    items([
                        ref("AssignmentExpression"),
                        whitespace,
                        opt(items([
                            keyword(","),
                            whitespace,
                            pop,
                        ])),
                        spliceReplace(2,2),
                    ]),
                    items([
                        ref("SpreadElement"),
                        whitespace,
                        opt(items([
                            keyword(","),
                            whitespace,
                            pop,
                        ])),
                        spliceReplace(2,2),
                    ]),
                ]);
            }
        ),
        keyword("]"),    // 1
        pos,             // 0 = end
        spliceNode(5,"ArrayLiteral",5,0,[2]),
    ]));

// SpreadElement

grm.define("SpreadElement",
    items([
        pos,
        keyword("..."),
        whitespace,
        ref("AssignmentExpression"),
        pos,
        spliceNode(4,"SpreadElement",4,0,[1]),
    ]));

// Section 12.2.6

// ObjectLiteral

grm.define("ObjectLiteral",
    items([
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
                spliceReplace(2,2),
            ]),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        keyword("}"),     // 1
        pos,              // 0 = end
        spliceNode(5,"ObjectLiteral",5,0,[2]),
    ]));

// PropertyDefinitionList

grm.define("PropertyDefinitionList",
    list(
        ref("PropertyDefinition"),
        items([
            whitespace,
            keyword(","),
            whitespace,
            ref("PropertyDefinition"),
            spliceReplace(3,0),
        ])
    ));

// PropertyDefinition_colon

grm.define("PropertyDefinition_colon",
    items([
        pos,                         // 6 = start
        ref("PropertyName"),         // 5 = name
        whitespace,                  // 4
        keyword(":"),                // 3
        whitespace,                  // 2
        ref("AssignmentExpression"), // 1 = init
        pos,                         // 0 = end
        spliceNode(6,"ColonPropertyDefinition",6,0,[5,1]),
    ]));

// PropertyDefinition

grm.define("PropertyDefinition",
    choice([
        ref("PropertyDefinition_colon"),
        ref("CoverInitializedName"),
        ref("MethodDefinition"),
        ref("IdentifierReference"),
    ]));

// PropertyName

grm.define("PropertyName",
    choice([
        ref("LiteralPropertyName"),
        ref("ComputedPropertyName"),
    ]));

// LiteralPropertyName

grm.define("LiteralPropertyName",
    choice([
        ref("IdentifierName"),
        ref("StringLiteral"),
        ref("NumericLiteral"),
    ]));

// ComputedPropertyName

grm.define("ComputedPropertyName",
    items([
        pos,                         // 6 = start
        keyword("["),                // 5
        whitespace,                  // 4
        ref("AssignmentExpression"), // 3 = expr
        whitespace,                  // 2
        keyword("]"),                // 1
        pos,                         // 0 = end
        spliceNode(6,"ComputedPropertyName",6,0,[3]),
    ]));

// CoverInitializedName

grm.define("CoverInitializedName",
    items([
        pos,                        // 4 = start
        ref("IdentifierReference"), // 3 = ident
        whitespace,                 // 2
        ref("Initializer"),         // 1 = init
        pos,                        // 0 = end
        spliceNode(4,"CoverInitializedName",4,0,[3,1]),
    ]));

// Initializer

grm.define("Initializer",
    items([
        keyword("="),
        whitespace,
        ref("AssignmentExpression"),
        spliceReplace(2,0),
    ]));

// Section 12.2.9

// TemplateLiteral

function TemplateLiteral(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// TemplateSpans

function TemplateSpans(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// TemplateMiddleList

function TemplateMiddleList(b: Builder): void { throw new ParseError(b.parser,b.parser.pos,"Not implemented"); } // FIXME

// Section 12.3

// MemberExpression_new

grm.define("MemberExpression_new",
    items([
        pos,                     // 6 = start
        keyword("new"),          // 5
        whitespace,              // 4
        ref("MemberExpression"), // 3 = expr
        whitespace,              // 2
        ref("Arguments"),        // 1 = args
        pos,                     // 0 = end
        spliceNode(6,"NewExpression",6,0,[3,1]),
    ]));

// MemberExpression_start

grm.define("MemberExpression_start",
    choice([
        ref("PrimaryExpression"),
        ref("SuperProperty"),
        ref("MetaProperty"),
        ref("MemberExpression_new"),
    ]));

// MemberExpression

grm.define("MemberExpression",
    items([
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
                spliceNode(7,"MemberAccessExpr",8,0,[7,3]),
            ]),
            items([
                whitespace,            // 5
                keyword("."),          // 4
                whitespace,            // 3
                ref("IdentifierName"), // 2 = ident
                pos,                   // 1 = end
                whitespace,            // 0
                spliceNode(6,"MemberAccessIdent",7,1,[6,2]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// SuperProperty

grm.define("SuperProperty",
    items([
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
                spliceNode(8,"SuperPropertyExpr",8,0,[3]),
            ]),
            items([
                pos,               // 6 = start
                keyword("super"),  // 5
                whitespace,        // 4
                keyword("."),      // 3
                whitespace,        // 2
                ref("Identifier"), // 1 = ident
                pos,               // 0 = end
                spliceNode(6,"SuperPropertyIdent",6,0,[1]),
            ]),
        ]),
    ]));

// MetaProperty

grm.define("MetaProperty",
    ref("NewTarget"));

// NewTarget

grm.define("NewTarget",
    items([
        pos,                  // 6
        keyword("new"),       // 5
        whitespace,           // 4
        keyword("."),         // 3
        whitespace,           // 2
        identifier("target"), // 1 ("target" is not a reserved word, so we can't use keyword here)
        pos,                  // 0
        spliceNode(6,"NewTarget",6,0,[]),
    ]));

// NewExpression

grm.define("NewExpression",
    choice([
        ref("MemberExpression"),
        items([
            pos,                  // 5 = start
            keyword("new"),       // 4
            whitespace,           // 3
            ref("NewExpression"), // 2 = expr
            value(null),          // 1 = args
            pos,                  // 0 = end
            spliceNode(5,"NewExpression",5,0,[2,1]),
        ]),
    ]));

// CallExpression_start

grm.define("CallExpression_start",
    choice([
        ref("SuperCall"),
        items([
            pos,                     // 4 = start
            ref("MemberExpression"), // 3 = fun
            whitespace,              // 2
            ref("Arguments"),        // 1 = args
            pos,                     // 0 = end
            spliceNode(4,"Call",4,0,[3,1]),
        ]),
    ]));

// CallExpression

grm.define("CallExpression",
    items([
        pos,
        ref("CallExpression_start"),
        repeatChoice([
            items([
                whitespace,            // 2
                ref("Arguments"),      // 1
                pos,                   // 0
                spliceNode(3,"Call",4,0,[3,1]),
            ]),
            items([
                whitespace,            // 6
                keyword("["),          // 5
                whitespace,            // 4
                ref("Expression"),     // 3 = expr
                whitespace,            // 2
                keyword("]"),          // 1
                pos,                   // 0 = end
                spliceNode(7,"MemberAccessExpr",8,0,[7,3]),
            ]),
            items([
                whitespace,            // 4
                keyword("."),          // 3
                whitespace,            // 2
                ref("IdentifierName"), // 1 = idname
                pos,                   // 0 = end
                spliceNode(5,"MemberAccessIdent",6,0,[5,1]),
            ]),
            // () => {
            //     // TODO
            //     left = TemplateLiteral(p);
            // },
        ]),
        spliceReplace(1,0),
    ]));

// SuperCall

grm.define("SuperCall",
    items([
        pos,              // 4 = start
        keyword("super"), // 3
        whitespace,       // 2
        ref("Arguments"), // 1 = args
        pos,              // 0 = end
        spliceNode(4,"SuperCall",4,0,[1]),
    ]));

// Arguments

grm.define("Arguments",
    choice([
        items([
            pos,                 // 6 = start
            keyword("("),        // 5
            whitespace,          // 4
            pos,                 // 3 = listpos
            keyword(")"),        // 2
            pos,                 // 1 = end
            value(null),         // 0 = will become list
            spliceEmptyListNode(0,3,3),
            spliceNode(6,"Arguments",6,1,[0]),
        ]),
        items([
            pos,                 // 6 = start
            keyword("("),        // 5
            whitespace,          // 4
            ref("ArgumentList"), // 3 = args
            whitespace,          // 2
            keyword(")"),        // 1
            pos,                 // 0 = end
            spliceNode(6,"Arguments",6,0,[3]),
        ]),
    ]));

// ArgumentList_item

grm.define("ArgumentList_item",
    choice([
        items([
            pos,                         // 4 = start
            keyword("..."),              // 3
            whitespace,                  // 2
            ref("AssignmentExpression"), // 1 = expr
            pos,                         // 0 = end
            spliceNode(4,"SpreadElement",4,0,[1]),
        ]),
        ref("AssignmentExpression"),
    ]));

// ArgumentList

grm.define("ArgumentList",
    list(
        ref("ArgumentList_item"),
        items([
            whitespace,
            keyword(","),
            whitespace,
            ref("ArgumentList_item"),
            spliceReplace(3,0),
        ])
    ));

// LeftHandSideExpression

grm.define("LeftHandSideExpression",
    // CallExpression has to come before NewExpression, because the latter can be satisfied by
    // MemberExpression, which is a prefix of the former
    choice([
        ref("CallExpression"),
        ref("NewExpression"),
    ]));

// Section 12.4

// PostfixExpression

grm.define("PostfixExpression",
    items([
        pos,
        ref("LeftHandSideExpression"),
        choice([
            items([
                whitespaceNoNewline,
                keyword("++"),
                pos,
                spliceNode(4,"PostIncrement",4,0,[3]),
            ]),
            items([
                whitespaceNoNewline,
                keyword("--"),
                pos,
                spliceNode(4,"PostDecrement",4,0,[3]),
            ]),
            spliceReplace(1,0),
        ]),
    ]));

// Section 12.5

// UnaryExpression

grm.define("UnaryExpression",
    choice([
        items([
            pos,                    // 4 = start
            keyword("delete"),      // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"Delete",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("void"),        // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"Void",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("typeof"),      // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"TypeOf",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("++"),          // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"PreIncrement",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("--"),          // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"PreDecrement",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("+"),           // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"UnaryPlus",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("-"),           // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"UnaryMinus",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("~"),           // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"UnaryBitwiseNot",4,0,[1]),
        ]),
        items([
            pos,                    // 4 = start
            keyword("!"),           // 3
            whitespace,             // 2
            ref("UnaryExpression"), // 1 = expr
            pos,                    // 0 = end
            spliceNode(4,"UnaryLogicalNot",4,0,[1]),
        ]),
        ref("PostfixExpression"),
    ]));

// Section 12.6

// MultiplicativeExpression

grm.define("MultiplicativeExpression",
    items([
        pos,                            // 6 = start
        ref("UnaryExpression"),         // 5 = left
        repeatChoice([
            items([
                whitespace,             // 4
                keyword("*"),           // 3
                whitespace,             // 2
                ref("UnaryExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"Multiply",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword("/"),           // 3
                whitespace,             // 2
                ref("UnaryExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"Divide",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword("%"),           // 3
                whitespace,             // 2
                ref("UnaryExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"Modulo",6,0,[5,1]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// Section 12.7

// AdditiveExpression

grm.define("AdditiveExpression",
    items([
        pos,                                     // 6 = start
        ref("MultiplicativeExpression"),         // 5 = left
        repeatChoice([
            items([
                whitespace,                      // 4
                keyword("+"),                    // 3
                whitespace,                      // 2
                ref("MultiplicativeExpression"), // 1 = right
                pos,                             // 0 = end
                spliceNode(5,"Add",6,0,[5,1]),
            ]),
            items([
                whitespace,                      // 4
                keyword("-"),                    // 3
                whitespace,                      // 2
                ref("MultiplicativeExpression"), // 1 = right
                pos,                             // 0 = end
                spliceNode(5,"Subtract",6,0,[5,1]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// Section 12.8

// ShiftExpression

grm.define("ShiftExpression",
    items([
        pos,                               // 6 = start
        ref("AdditiveExpression"),         // 5 = left
        repeatChoice([
            items([
                whitespace,                // 4
                keyword("<<"),             // 3
                whitespace,                // 2
                ref("AdditiveExpression"), // 1 = right
                pos,                       // 0 = end
                spliceNode(5,"LeftShift",6,0,[5,1]),
            ]),
            items([
                whitespace,                // 4
                keyword(">>>"),            // 3
                whitespace,                // 2
                ref("AdditiveExpression"), // 1 = right
                pos,                       // 0 = end
                spliceNode(5,"UnsignedRightShift",6,0,[5,1]),
            ]),
            items([
                whitespace,                // 4
                keyword(">>"),             // 3
                whitespace,                // 2
                ref("AdditiveExpression"), // 1 = right
                pos,                       // 0 = end
                spliceNode(5,"SignedRightShift",6,0,[5,1]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// Section 12.9

// RelationalExpression

grm.define("RelationalExpression",
    items([
        pos,                            // 6 = start
        ref("ShiftExpression"),         // 5 = left
        repeatChoice([
            items([
                whitespace,             // 4
                keyword("<="),          // 3
                whitespace,             // 2
                ref("ShiftExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"LessEqual",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword(">="),          // 3
                whitespace,             // 2
                ref("ShiftExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"GreaterEqual",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword("<"),           // 3
                whitespace,             // 2
                ref("ShiftExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"LessThan",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword(">"),           // 3
                whitespace,             // 2
                ref("ShiftExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"GreaterThan",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword("instanceof"),  // 3
                whitespace,             // 2
                ref("ShiftExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"InstanceOf",6,0,[5,1]),
            ]),
            items([
                whitespace,             // 4
                keyword("in"),          // 3
                whitespace,             // 2
                ref("ShiftExpression"), // 1 = right
                pos,                    // 0 = end
                spliceNode(5,"In",6,0,[5,1]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// Section 12.10

// EqualityExpression

grm.define("EqualityExpression",
    items([
        pos,                                 // 6 = start
        ref("RelationalExpression"),         // 5 = left
        repeatChoice([
            items([
                whitespace,                  // 4
                keyword("==="),              // 3
                whitespace,                  // 2
                ref("RelationalExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"StrictEquals",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("!=="),              // 3
                whitespace,                  // 2
                ref("RelationalExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"StrictNotEquals",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("=="),               // 3
                whitespace,                  // 2
                ref("RelationalExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AbstractEquals",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("!="),               // 3
                whitespace,                  // 2
                ref("RelationalExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AbstractNotEquals",6,0,[5,1]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// Section 12.11

// BitwiseANDExpression

grm.define("BitwiseANDExpression",
    items([
        pos,                           // 6 = start
        ref("EqualityExpression"),     // 5 = left
        repeat(items([
            whitespace,                // 4
            keyword("&"),              // 3
            whitespace,                // 2
            ref("EqualityExpression"), // 1 = right
            pos,                       // 0 = end
            spliceNode(5,"BitwiseAND",6,0,[5,1]),
        ])),
        spliceReplace(1,0),
    ]));

// BitwiseXORExpression

grm.define("BitwiseXORExpression",
    items([
        pos,                             // 6 = start
        ref("BitwiseANDExpression"),     // 5 = left
        repeat(items([
            whitespace,                  // 4
            keyword("^"),                // 3
            whitespace,                  // 2
            ref("BitwiseANDExpression"), // 1 = right
            pos,                         // 0 = end
            spliceNode(5,"BitwiseXOR",6,0,[5,1]),
        ])),
        spliceReplace(1,0),
    ]));

// BitwiseORExpression

grm.define("BitwiseORExpression",
    items([
        pos,                             // 6 = start
        ref("BitwiseXORExpression"),     // 5 = left
        repeat(items([
            whitespace,                  // 4
            keyword("|"),                // 3
            whitespace,                  // 2
            ref("BitwiseXORExpression"), // 1 = right
            pos,                         // 0 = end
            spliceNode(5,"BitwiseOR",6,0,[5,1]),
        ])),
        spliceReplace(1,0),
    ]));

// Section 12.12

// LogicalANDExpression

grm.define("LogicalANDExpression",
    items([
        pos,                            // 6 = start
        ref("BitwiseORExpression"),     // 5 = left
        repeat(items([
            whitespace,                 // 4
            keyword("&&"),              // 3
            whitespace,                 // 2
            ref("BitwiseORExpression"), // 1 = right
            pos,                        // 0 = end
            spliceNode(5,"LogicalAND",6,0,[5,1]),
        ])),
        spliceReplace(1,0),
    ]));

// LogicalORExpression

grm.define("LogicalORExpression",
    items([
        pos,                             // 6 = start
        ref("LogicalANDExpression"),     // 5 = left
        repeat(items([
            whitespace,                  // 4
            keyword("||"),               // 3
            whitespace,                  // 2
            ref("LogicalANDExpression"), // 1 = right
            pos,                         // 0 = end
            spliceNode(5,"LogicalOR",6,0,[5,1]),
        ])),
        spliceReplace(1,0),
    ]));

// Section 12.13

// ConditionalExpression

grm.define("ConditionalExpression",
    items([
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
                spliceNode(9,"Conditional",10,0,[9,5,1]),
            ]),
            items([]),
        ]),
        spliceReplace(1,0),
    ]));

// Section 12.14

// AssignmentExpression_plain

grm.define("AssignmentExpression_plain",
    items([
        pos,                                 // 6 = start
        ref("LeftHandSideExpression"),       // 5 = left
        choice([
            items([
                whitespace,                  // 4
                keyword("="),                // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"Assign",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("*="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignMultiply",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("/="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignDivide",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("%="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignModulo",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("+="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignAdd",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("-="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignSubtract",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("<<="),              // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignLeftShift",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword(">>="),              // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignSignedRightShift",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword(">>>="),             // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignUnsignedRightShift",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("&="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignBitwiseAND",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("^="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignBitwiseXOR",6,0,[5,1]),
            ]),
            items([
                whitespace,                  // 4
                keyword("|="),               // 3
                whitespace,                  // 2
                ref("AssignmentExpression"), // 1 = right
                pos,                         // 0 = end
                spliceNode(5,"AssignBitwiseOR",6,0,[5,1]),
            ]),
        ]),
        spliceReplace(1,0),
    ]));

// AssignmentExpression

grm.define("AssignmentExpression",
    // ArrowFunction comes first, to avoid the formal parameter list being matched as an expression
    // const oldLength = b.length;
    choice([
        ref("ArrowFunction"),
        ref("AssignmentExpression_plain"),
        ref("ConditionalExpression"),
        ref("YieldExpression"),
    ]));

// Section 12.15

// Expression

grm.define("Expression",
    items([
        pos,                             // 6 = start
        ref("AssignmentExpression"),     // 5 = left
        repeat(items([
            whitespace,                  // 4
            keyword(","),                // 3
            whitespace,                  // 2
            ref("AssignmentExpression"), // 1 = right
            pos,                         // 0 = end
            spliceNode(5,"Comma",6,0,[5,1]),
        ])),
        spliceReplace(1,0),
    ]));

// Section 13

// Statement

grm.define("Statement",
    choice([
        ref("ExpressionStatement"),
        ref("BlockStatement"),
        ref("VariableStatement"),
        ref("EmptyStatement"),
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
    ]));

// Declaration

grm.define("Declaration",
    choice([
        ref("HoistableDeclaration"),
        ref("ClassDeclaration"),
        ref("LexicalDeclaration"),
    ]));

// HoistableDeclaration

grm.define("HoistableDeclaration",
    choice([
        ref("FunctionDeclaration"),
        ref("GeneratorDeclaration"),
    ]));

// BreakableStatement

grm.define("BreakableStatement",
    choice([
        ref("IterationStatement"),
        ref("SwitchStatement"),
    ]));

// Section 13.2

// BlockStatement

grm.define("BlockStatement",
    ref("Block"));

// Block

grm.define("Block",
    items([
        pos,              // 5
        keyword("{"),     // 4
        whitespace,       // 3
        choice([          // 2 = statements
            items([
                ref("StatementList"),
                whitespace,
                spliceReplace(1,1),
            ]),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        keyword("}"),     // 1
        pos,              // 0
        spliceNode(5,"Block",5,0,[2]),
    ]));

// StatementList

grm.define("StatementList",
    list(
        ref("StatementListItem"),
        items([
            whitespace,
            ref("StatementListItem"),
            spliceReplace(1,0),
        ])
    ));

// StatementListItem

grm.define("StatementListItem",
    choice([
        ref("Statement"),
        ref("Declaration"),
    ]));

// Section 13.3.1

// LexicalDeclaration

grm.define("LexicalDeclaration",
    choice([
        items([
            pos,                // 6 = start
            keyword("let"),     // 5
            whitespace,         // 4
            ref("BindingList"), // 3 = bindings
            whitespace,         // 2
            keyword(";"),       // 1
            pos,                // 0 = end
            spliceNode(6,"Let",6,0,[3]),
        ]),
        items([
            pos,                // 6 = start
            keyword("const"),   // 5
            whitespace,         // 4
            ref("BindingList"), // 3 = bindings
            whitespace,         // 2
            keyword(";"),       // 1
            pos,                // 0 = end
            spliceNode(6,"Const",6,0,[3]),
        ]),
    ]));

// BindingList

grm.define("BindingList",
    list(
        ref("LexicalBinding"),
        items([
            whitespace,
            keyword(","),
            whitespace,
            ref("LexicalBinding"),
            spliceReplace(3,0),
        ])
    ));

// LexicalBinding_identifier

grm.define("LexicalBinding_identifier",
    items([
        pos,                      // 3 = start
        ref("BindingIdentifier"), // 2 = identifier
        opt(items([               // 1 = initializer
            whitespace,
            ref("Initializer"),
            spliceReplace(1,0),
        ])),
        pos,                      // 0 = end
        spliceNode(3,"LexicalIdentifierBinding",3,0,[2,1]),
    ]));

// LexicalBinding_pattern

grm.define("LexicalBinding_pattern",
    items([
        pos,                   // 4 = start
        ref("BindingPattern"), // 3 = pattern
        whitespace,            // 2
        ref("Initializer"),    // 1 = initializer
        pos,                   // 0 = end
        spliceNode(4,"LexicalPatternBinding",4,0,[3,1]),
    ]));

// LexicalBinding

grm.define("LexicalBinding",
    choice([
        ref("LexicalBinding_identifier"),
        ref("LexicalBinding_pattern"),
    ]));

// Section 13.3.2

// VariableStatement

grm.define("VariableStatement",
    items([
        pos,                            // 6 = start
        keyword("var"),                 // 5
        whitespace,                     // 4
        ref("VariableDeclarationList"), // 3 = declarations
        whitespace,                     // 2
        keyword(";"),                   // 1
        pos,                            // 0 = end
        spliceNode(6,"Var",6,0,[3]),
    ]));

// VariableDeclarationList

grm.define("VariableDeclarationList",
    items([
        list(
            ref("VariableDeclaration"),
            items([
                whitespace,
                keyword(","),
                whitespace,
                ref("VariableDeclaration"),
                spliceReplace(3,0),
            ])
        ),
    ]));

// VariableDeclaration_identifier

grm.define("VariableDeclaration_identifier",
    items([
        pos,
        ref("BindingIdentifier"),
        choice([
            items([
                whitespace,
                ref("Initializer"),
                pos,
                spliceNode(4,"VarIdentifier",4,0,[3,1]),
            ]),
            items([
                value(null),
                pos,
                spliceNode(3,"VarIdentifier",3,0,[2,1]),
            ]),
        ]),
    ]));

// VariableDeclaration_pattern

grm.define("VariableDeclaration_pattern",
    items([
        pos,                   // 4 = start
        ref("BindingPattern"), // 3 = pattern
        whitespace,            // 2
        ref("Initializer"),    // 1 = initializer
        pos,                   // 0 = end
        spliceNode(4,"VarPattern",4,0,[3,1]),
    ]));

// VariableDeclaration

grm.define("VariableDeclaration",
    choice([
        ref("VariableDeclaration_identifier"),
        ref("VariableDeclaration_pattern"),
    ]));

// Section 13.3.3

// BindingPattern

grm.define("BindingPattern",
    choice([
        ref("ObjectBindingPattern"),
        ref("ArrayBindingPattern"),
    ]));

// ObjectBindingPattern

grm.define("ObjectBindingPattern",
    items([
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
                spliceReplace(2,2),
            ]),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        keyword("}"),      // 1
        pos,               // 0 = end
        spliceNode(6,"ObjectBindingPattern",6,0,[2]),
    ]));

// ArrayBindingPattern

grm.define("ArrayBindingPattern",
    items([
        pos,                       // 7 = start
        keyword("["),              // 6
        whitespace,                // 5
        ref("BindingElementList"), // 4 = elements
        whitespace,                // 3
        opt(items([                // 2 = rest
            ref("BindingRestElement"),
            whitespace,
            spliceReplace(1,1),
        ])),
        keyword("]"),              // 1
        pos,                       // 0 = end
        spliceNode(7,"ArrayBindingPattern",7,0,[4,2]),
    ]));

// BindingPropertyList

grm.define("BindingPropertyList",
    items([
        list(
            ref("BindingProperty"),
            items([
                whitespace,
                keyword(","),
                whitespace,
                ref("BindingProperty"),
                spliceReplace(3,0),
            ])
        ),
    ]));

// BindingElementList

grm.define("BindingElementList",
    items([
        list(
            opt(items([
                pos,
                keyword(","),
                pos,
                spliceNode(2,"Elision",2,0,[]),
            ])),
            choice([
                items([
                    whitespace,   // 3
                    pos,          // 2 = before
                    keyword(","), // 1
                    pos,          // 0 = after
                    spliceNode(3,"Elision",2,0,[]),
                ]),
                items([
                    whitespace,
                    ref("BindingElement"),
                    opt(items([
                        whitespace,
                        keyword(","),
                        pop,
                    ])),
                    spliceReplace(2,1),
                ]),
            ])
        ),
    ]));

// BindingProperty

grm.define("BindingProperty",
    items([
        choice([
            items([
                pos,                   // 6 = start
                ref("PropertyName"),   // 5 = name
                whitespace,            // 4
                keyword(":"),          // 3
                whitespace,            // 2
                ref("BindingElement"), // 1 = element
                pos,                   // 0 = end
                spliceNode(6,"BindingProperty",6,0,[5,1]),
            ]),
            // SingleNameBinding has to come after the colon version above, since both SingleNameBinding
            // and PropertyName will match an identifier at the start of a colon binding
            ref("SingleNameBinding"),
        ]),
    ]));

// BindingElement

grm.define("BindingElement",
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
                    spliceNode(4,"BindingPatternInit",4,0,[3,1]),
                ]),
                spliceReplace(1,0),
            ]),
        ]),
    ]));

// SingleNameBinding

grm.define("SingleNameBinding",
    items([
        pos,
        ref("BindingIdentifier"),
        choice([
            items([
                whitespace,
                ref("Initializer"),
                pos,
                spliceNode(2,"SingleNameBinding",4,0,[3,1]),
            ]),
            items([
                value(null),
                spliceReplace(0,1),
            ]),
        ]),
        spliceReplace(2,0),
    ]));

// BindingRestElement

grm.define("BindingRestElement",
    items([
        pos,                      // 4 = start
        keyword("..."),           // 3
        whitespace,               // 2
        ref("BindingIdentifier"), // 1 = ident
        pos,                      // 0 = end
        spliceNode(4,"BindingRestElement",4,0,[1]),
    ]));

// Section 13.4

// EmptyStatement

grm.define("EmptyStatement",
    items([
        pos,
        keyword(";"),
        pos,
        spliceNode(2,"EmptyStatement",2,0,[]),
    ]));

// Section 13.5

// ExpressionStatement

grm.define("ExpressionStatement",
    items([
        not(keyword("{")),
        not(keyword("function")),
        not(keyword("class")),
        not(items([
            keyword("let"),
            whitespace,
            keyword("["),
        ])),
        pos,               // 4 = start
        ref("Expression"), // 3 = expr
        whitespace,        // 2
        keyword(";"),      // 1
        pos,               // 0 = end
        spliceNode(4,"ExpressionStatement",4,0,[3]),
    ]));

// Section 13.6

// IfStatement

grm.define("IfStatement",
    items([
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
            spliceReplace(3,0),
        ])),
        pos,               // 0 = end
        spliceNode(11,"IfStatement",11,0,[6,2,1]),
    ]));

// Section 13.7

// IterationStatement_do

grm.define("IterationStatement_do",
    items([
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
        spliceNode(14,"DoStatement",14,0,[11,5]),
    ]));

// IterationStatement_while

grm.define("IterationStatement_while",
    items([
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
        spliceNode(10,"WhileStatement",10,0,[5,1]),
    ]));

// IterationStatement_for_c

grm.define("IterationStatement_for_c",
    // for ( [lookahead ∉ {let [}] Expression-opt ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( var VariableDeclarationList          ; Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]
    // for ( LexicalDeclaration                     Expression-opt ; Expression-opt ) Statement[?Yield, ?Return]

    items([
        pos,                                    // 14 = start
        keyword("for"),                         // 13
        whitespace,                             // 12
        keyword("("),                           // 11
        whitespace,                             // 10
        choice([
            items([
                not(keyword("let")), // FIXME: need tests for this
                not(keyword("[")), // FIXME: need tests for this
                ref("Expression"),              // 3 = expr
                whitespace,                     // 2
                keyword(";"),                   // 1
                whitespace,                     // 0
                spliceReplace(3,3),
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
                spliceNode(7,"Var",7,3,[4]),
            ]),
            items([
                ref("LexicalDeclaration"),
                whitespace,
                spliceReplace(1,1),
            ]),
            // initializer part can be empty, but need to distinguish this from an error
            items([
                keyword(";"),
                popAboveAndSet(0,null),
            ]),
        ]),
        opt(ref("Expression")), // 8 = condition
        whitespace,             // 7
        keyword(";"),           // 6
        whitespace,             // 5
        opt(items([
            ref("Expression"),
            whitespace,
            spliceReplace(1,1),
        ])),
        keyword(")"),           // 3
        whitespace,             // 2
        ref("Statement"),       // 1 = body
        pos,                    // 0 = end
        spliceNode(14,"ForC",14,0,[9,8,4,1]),
    ]));

// IterationStatement_for_in

grm.define("IterationStatement_for_in",
    // for ( [lookahead ∉ {let [}] LeftHandSideExpression in Expression )             Statement[?Yield, ?Return]
    // for ( var ForBinding                               in Expression )             Statement[?Yield, ?Return]
    // for ( ForDeclaration                               in Expression )             Statement[?Yield, ?Return]

    items([
        pos,                       // 14 = start
        keyword("for"),            // 13
        whitespace,                // 12
        keyword("("),              // 11
        whitespace,                // 10
        choice([                   // 9 = binding
            items([
                not(keyword("let")), // FIXME: need tests for this
                not(keyword("[")), // FIXME: need tests for this
                ref("LeftHandSideExpression"),
            ]),
            items([
                pos,
                keyword("var"),
                whitespace,
                ref("ForBinding"),
                pos,
                spliceNode(4,"VarForDeclaration",4,0,[1]),
            ]),
            ref("ForDeclaration"),
        ]),
        whitespace,                // 8
        keyword("in"),             // 7
        whitespace,                // 6
        ref("Expression"),         // 5 = expr
        whitespace,                // 4
        keyword(")"),              // 3
        whitespace,                // 2
        ref("Statement"),          // 1 = body
        pos,                       // 0 = end
        spliceNode(14,"ForIn",14,0,[9,5,1]),
    ]));

// IterationStatement_for_of

grm.define("IterationStatement_for_of",
    // for ( [lookahead ≠ let ] LeftHandSideExpression    of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( var ForBinding                               of AssignmentExpression )   Statement[?Yield, ?Return]
    // for ( ForDeclaration                               of AssignmentExpression )   Statement[?Yield, ?Return]

    items([
        pos,                       // 14 = start
        keyword("for"),            // 13
        whitespace,                // 12
        keyword("("),              // 11
        whitespace,                // 10
        choice([                   // 9
            items([
                not(keyword("let")), // FIXME: need tests for this
                not(keyword("[")), // FIXME: need tests for this
                ref("LeftHandSideExpression"),
            ]),
            items([
                pos,
                keyword("var"),
                whitespace,
                ref("ForBinding"),
                pos,
                spliceNode(4,"VarForDeclaration",4,0,[1]),
            ]),
            ref("ForDeclaration"),
        ]),
        whitespace,                // 8
        keyword("of"),             // 7
        whitespace,                // 6
        ref("Expression"),         // 5 = expr
        whitespace,                // 4
        keyword(")"),              // 3
        whitespace,                // 2
        ref("Statement"),          // 1 = body
        pos,                       // 0 = end
        spliceNode(14,"ForOf",14,0,[9,5,1]),
    ]));

// IterationStatement_for

grm.define("IterationStatement_for",
    choice([
        ref("IterationStatement_for_c"),
        ref("IterationStatement_for_in"),
        ref("IterationStatement_for_of"),
    ]));

// IterationStatement

grm.define("IterationStatement",
    choice([
        ref("IterationStatement_do"),
        ref("IterationStatement_while"),
        ref("IterationStatement_for"),
    ]));

// ForDeclaration

grm.define("ForDeclaration",
    items([
        choice([
            items([
                pos,               // 4 = start
                keyword("let"),    // 3
                whitespace,        // 2
                ref("ForBinding"), // 1 = binding
                pos,               // 0 = end
                spliceNode(4,"LetForDeclaration",4,0,[1]),
            ]),
            items([
                pos,               // 4 = start
                keyword("const"),  // 3
                whitespace,        // 2
                ref("ForBinding"), // 1 = binding
                pos,               // 0 = end
                spliceNode(4,"ConstForDeclaration",4,0,[1]),
            ]),
        ]),
    ]));

// ForBinding

grm.define("ForBinding",
    choice([
        ref("BindingIdentifier"),
        ref("BindingPattern"), // FIXME: Need test cases for this
    ]));

// Section 13.8

// ContinueStatement

grm.define("ContinueStatement",
    items([
        choice([
            items([
                pos,                    // 5 = start
                keyword("continue"),    // 4
                whitespace,             // 3
                value(null),            // 2 = null
                keyword(";"),           // 1
                pos,                    // 0 = end
                spliceNode(5,"ContinueStatement",5,0,[2]),
            ]),
            items([
                pos,                    // 6 = start
                keyword("continue"),    // 5
                whitespaceNoNewline,    // 4
                ref("LabelIdentifier"), // 3 = ident
                whitespace,             // 2
                keyword(";"),           // 1
                pos,                    // 0 = end
                spliceNode(6,"ContinueStatement",6,0,[3]),
            ]),
        ]),
    ]));

// Section 13.9

// BreakStatement

grm.define("BreakStatement",
    items([
        choice([
            items([
                pos,                    // 5 = start
                keyword("break"),       // 4
                whitespace,             // 3
                value(null),            // 2 = null
                keyword(";"),           // 1
                pos,                    // 0 = end
                spliceNode(5,"BreakStatement",5,0,[2]),
            ]),
            items([
                pos,                    // 6 = start
                keyword("break"),       // 5
                whitespaceNoNewline,    // 4
                ref("LabelIdentifier"), // 3 = ident
                whitespace,             // 2
                keyword(";"),           // 1
                pos,                    // 0 = end
                spliceNode(6,"BreakStatement",6,0,[3]),
            ]),
        ]),
    ]));

// Section 13.10

// ReturnStatement

grm.define("ReturnStatement",
    items([
        choice([
            items([
                pos,                 // 5 = start
                keyword("return"),   // 4
                whitespace,          // 3
                value(null),         // 2 = null
                keyword(";"),        // 1
                pos,                 // 0 = end
                spliceNode(5,"ReturnStatement",5,0,[2]),
            ]),
            items([
                pos,                 // 6 = start
                keyword("return"),   // 5
                whitespaceNoNewline, // 4
                ref("Expression"),   // 3 = expr
                whitespace,          // 2
                keyword(";"),        // 1
                pos,                 // 0 = end
                spliceNode(6,"ReturnStatement",6,0,[3]),
            ]),
        ]),
    ]));

// Section 13.11

// WithStatement

grm.define("WithStatement",
    items([
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
        spliceNode(10,"WithStatement",10,0,[5,1]),
    ]));

// Section 13.12

// SwitchStatement

grm.define("SwitchStatement",
    items([
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
        spliceNode(10,"SwitchStatement",10,0,[5,1]),
    ]));

// CaseBlock_1

grm.define("CaseBlock_1",
    items([
        pos,          // 7
        keyword("{"), // 6
        whitespace,   // 5
        pos,          // 4 = midpos
        choice([      // 3 = clauses
            ref("CaseClauses"),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        whitespace,   // 2
        keyword("}"), // 1
        pos,          // 0
        spliceNode(7,"CaseBlock1",7,0,[3]),
    ]));

// CaseBlock_2

grm.define("CaseBlock_2",
    items([
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
        spliceNode(10,"CaseBlock2",10,0,[7,5,3]),
    ]));

// CaseBlock

grm.define("CaseBlock",
    choice([
        ref("CaseBlock_1"),
        ref("CaseBlock_2"),
    ]));

// CaseClauses

grm.define("CaseClauses",
    list(
        ref("CaseClause"),
        items([
            whitespace,
            ref("CaseClause"),
            spliceReplace(1,0),
        ])
    ));

// CaseClause

grm.define("CaseClause",
    items([
        pos,                  // 8 = start
        keyword("case"),      // 7
        whitespace,           // 6
        ref("Expression"),    // 5 = expr
        whitespace,           // 4
        keyword(":"),         // 3
        whitespace,           // 2
        ref("StatementList"), // 1 = statements
        pos,                  // 0 = end
        spliceNode(8,"CaseClause",8,0,[5,1]),
    ]));

// DefaultClause

grm.define("DefaultClause",
    items([
        pos,                  // 7 = start
        keyword("default"),   // 6
        whitespace,           // 5
        keyword(":"),         // 4
        whitespace,           // 3
        ref("StatementList"), // 2 = statements
        pos,                  // 1 = end
        whitespace,           // 0
        spliceNode(7,"DefaultClause",7,1,[2]),
    ]));

// Section 13.13

// LabelledStatement

grm.define("LabelledStatement",
    items([
        pos,                    // 6 = start
        ref("LabelIdentifier"), // 5 = ident
        whitespace,             // 4
        keyword(":"),           // 3
        whitespace,             // 2
        ref("LabelledItem"),    // 1 = item
        pos,                    // 0 = end
        spliceNode(6,"LabelledStatement",6,0,[5,1]),
    ]));

// LabelledItem

grm.define("LabelledItem",
    choice([
        ref("Statement"),
        ref("FunctionDeclaration"),
    ]));

// Section 13.14

// ThrowStatement

grm.define("ThrowStatement",
    items([
        pos,                 // 6 = start
        keyword("throw"),    // 5
        whitespaceNoNewline, // 4
        ref("Expression"),   // 3 = expr
        whitespace,          // 2
        keyword(";"),        // 1
        pos,                 // 0 = end
        spliceNode(6,"ThrowStatement",6,0,[3]),
    ]));

// Section 13.15

// TryStatement

grm.define("TryStatement",
    items([
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
                    spliceReplace(1,0),
                ])),
            ]),
        ]),
        pos,                         // 0 = end
        spliceNode(7,"TryStatement",7,0,[4,2,1]),
    ]));

// Catch

grm.define("Catch",
    items([
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
        spliceNode(10,"Catch",10,0,[5,1]),
    ]));

// Finally

grm.define("Finally",
    items([
        pos,                // 4
        keyword("finally"), // 3
        whitespace,         // 2
        ref("Block"),       // 1
        pos,                // 0
        spliceNode(4,"Finally",4,0,[1]),
    ]));

// CatchParameter

grm.define("CatchParameter",
    choice([
        ref("BindingIdentifier"),
        ref("BindingPattern"),
    ]));

// Section 13.16

// DebuggerStatement

grm.define("DebuggerStatement",
    items([
        pos,                 // 4
        keyword("debugger"), // 3
        whitespace,          // 2
        keyword(";"),        // 1
        pos,                 // 0
        spliceNode(4,"DebuggerStatement",4,0,[]),
    ]));

// Section 14.1

// FunctionDeclaration_named

grm.define("FunctionDeclaration_named",
    items([
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
        spliceNode(16,"FunctionDeclaration",16,0,[13,9,3]),
    ]));

// FunctionDeclaration_unnamed

grm.define("FunctionDeclaration_unnamed",
    items([
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
        spliceNode(15,"FunctionDeclaration",15,0,[10,9,3]),
    ]));

// FunctionDeclaration

grm.define("FunctionDeclaration",
    choice([
        ref("FunctionDeclaration_named"),
        ref("FunctionDeclaration_unnamed"),
    ]));

// FunctionExpression

grm.define("FunctionExpression",
    items([
        pos,                     // 15 = start
        keyword("function"),     // 14
        whitespace,              // 13
        opt(items([
            ref("BindingIdentifier"),
            whitespace,
            spliceReplace(1,1),
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
        spliceNode(15,"FunctionExpression",15,0,[12,9,3]),
    ]));

// StrictFormalParameters

grm.define("StrictFormalParameters",
    ref("FormalParameters"));

// FormalParameters

grm.define("FormalParameters",
    choice([
        ref("FormalParameterList"),
        items([
            pos,
            spliceNode(0,"FormalParameters1",0,0,[]),
        ]),
    ]));

// FormalParameterList

grm.define("FormalParameterList",
    choice([
        items([
            pos,                          // 2 = start
            ref("FunctionRestParameter"), // 1 = rest
            pos,                          // 0 = end
            spliceNode(2,"FormalParameters2",2,0,[1]),
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
                    spliceNode(6,"FormalParameters4",6,0,[5,1]),
                ]),
                items([
                    pos,
                    spliceNode(2,"FormalParameters3",2,0,[1]),
                ]),
            ]),
        ]),
    ]));

// FormalsList

grm.define("FormalsList",
    list(
        ref("FormalParameter"),
        items([
            whitespace,
            keyword(","),
            whitespace,
            ref("FormalParameter"),
            spliceReplace(3,0),
        ])
    ));

// FunctionRestParameter

grm.define("FunctionRestParameter",
    ref("BindingRestElement"));

// FormalParameter

grm.define("FormalParameter",
    ref("BindingElement"));

// FunctionBody

grm.define("FunctionBody",
    ref("FunctionStatementList"));

// FunctionStatementList

grm.define("FunctionStatementList",
    choice([
        ref("StatementList"),
        items([
            pos,
            spliceEmptyListNode(0,0,0),
        ]),
    ]));

// Section 14.2

// ArrowFunction

grm.define("ArrowFunction",
    items([
        pos,                    // 6 = start
        ref("ArrowParameters"), // 5 = params
        whitespaceNoNewline,    // 4
        keyword("=>"),          // 3
        whitespace,             // 2
        ref("ConciseBody"),     // 1 = body
        pos,                    // 0 = end
        spliceNode(6,"ArrowFunction",6,0,[5,1]),
    ]));

// ArrowParameters

grm.define("ArrowParameters",
    choice([
        ref("BindingIdentifier"),
        ref("ArrowFormalParameters"),
    ]));

// ConciseBody_1

grm.define("ConciseBody_1",
    items([
        not(keyword("{")),
        ref("AssignmentExpression"),
    ]));

// ConciseBody_2

grm.define("ConciseBody_2",
    items([
        keyword("{"),        // 4
        whitespace,          // 3
        ref("FunctionBody"), // 2
        whitespace,          // 1
        keyword("}"),        // 0
        spliceReplace(4,2),
    ]));

// ConciseBody

grm.define("ConciseBody",
    choice([
        ref("ConciseBody_1"),
        ref("ConciseBody_2"),
    ]));

// ArrowFormalParameters

grm.define("ArrowFormalParameters",
    items([
        keyword("("),                  // 4
        whitespace,                    // 3
        ref("StrictFormalParameters"), // 2
        whitespace,                    // 1
        keyword(")"),                  // 0
        spliceReplace(4,2),
    ]));

// Section 14.3

// MethodDefinition_1

grm.define("MethodDefinition_1",
    items([
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
        spliceNode(14,"Method",14,0,[13,9,3]),
    ]));

// MethodDefinition_2

grm.define("MethodDefinition_2",
    ref("GeneratorMethod"));

// MethodDefinition_3

grm.define("MethodDefinition_3",
    items([
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
        spliceNode(14,"Getter",14,0,[11,3]),
    ]));

// MethodDefinition_4

grm.define("MethodDefinition_4",
    items([
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
        spliceNode(16,"Setter",16,0,[13,9,3]),
    ]));

// MethodDefinition

grm.define("MethodDefinition",
    choice([
        ref("MethodDefinition_1"),
        ref("MethodDefinition_2"),
        ref("MethodDefinition_3"),
        ref("MethodDefinition_4"),
    ]));

// PropertySetParameterList

grm.define("PropertySetParameterList",
    ref("FormalParameter"));

// Section 14.4

// GeneratorMethod

grm.define("GeneratorMethod",
    items([
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
        spliceNode(16,"GeneratorMethod",16,0,[13,9,3]),
    ]));

// GeneratorDeclaration_1

grm.define("GeneratorDeclaration_1",
    items([
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
        spliceNode(18,"GeneratorDeclaration",18,0,[13,9,3]),
    ]));

// GeneratorDeclaration_2

grm.define("GeneratorDeclaration_2",
    items([
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
        spliceNode(16,"DefaultGeneratorDeclaration",16,0,[9,3]),
    ]));

// GeneratorDeclaration

grm.define("GeneratorDeclaration",
    choice([
        ref("GeneratorDeclaration_1"),
        ref("GeneratorDeclaration_2"),
    ]));

// GeneratorExpression

grm.define("GeneratorExpression",
    items([
        pos,                     // 17 = start
        keyword("function"),     // 16
        whitespace,              // 15
        keyword("*"),            // 14
        whitespace,              // 13
        opt(items([
            ref("BindingIdentifier"),
            whitespace,
            spliceReplace(1,1),
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
        spliceNode(17,"GeneratorExpression",17,0,[12,9,3]),
    ]));

// GeneratorBody

grm.define("GeneratorBody",
    ref("FunctionBody"));

// YieldExpression_1

grm.define("YieldExpression_1",
    items([
        pos,                         // 6
        keyword("yield"),            // 5
        whitespaceNoNewline,         // 4
        keyword("*"),                // 3
        whitespace,                  // 2
        ref("AssignmentExpression"), // 1
        pos,                         // 0
        spliceNode(6,"YieldStar",6,0,[1]),
    ]));

// YieldExpression_2

grm.define("YieldExpression_2",
    items([
        pos,                         // 4
        keyword("yield"),            // 3
        whitespaceNoNewline,         // 2
        ref("AssignmentExpression"), // 1
        pos,                         // 0
        spliceNode(4,"YieldExpr",4,0,[1]),
    ]));

// YieldExpression_3

grm.define("YieldExpression_3",
    items([
        pos,
        keyword("yield"),
        pos,
        spliceNode(2,"YieldNothing",2,0,[]),
    ]));

// YieldExpression

grm.define("YieldExpression",
    choice([
        ref("YieldExpression_1"),
        ref("YieldExpression_2"),
        ref("YieldExpression_3"),
    ]));

// Section 14.5

// ClassDeclaration_1

grm.define("ClassDeclaration_1",
    items([
        pos,                      // 6 = start
        keyword("class"),         // 5
        whitespace,               // 4
        ref("BindingIdentifier"), // 3 = ident
        whitespace,               // 2
        ref("ClassTail"),         // 1 = tail
        pos,                      // 0 = end
        spliceNode(6,"ClassDeclaration",6,0,[3,1]),
    ]));

// ClassDeclaration_2

grm.define("ClassDeclaration_2",
    items([
        pos,              // 5
        keyword("class"), // 4
        whitespace,       // 3
        value(null),      // 2
        ref("ClassTail"), // 1
        pos,              // 0
        spliceNode(5,"ClassDeclaration",5,0,[2,1]),
    ]));

// ClassDeclaration

grm.define("ClassDeclaration",
    choice([
        ref("ClassDeclaration_1"),
        ref("ClassDeclaration_2"),
    ]));

// ClassExpression

grm.define("ClassExpression",
    items([
        pos,                  // 5
        keyword("class"),     // 4
        whitespace,           // 3
        opt(items([
            ref("BindingIdentifier"),
            whitespace,
            spliceReplace(1,1),
        ])),
        ref("ClassTail"),     // 1
        pos,                  // 0
        spliceNode(5,"ClassExpression",5,0,[2,1]),
    ]));

// ClassTail

grm.define("ClassTail",
    items([
        pos,                // 6 = start
        opt(items([         // 5 = heritage
            ref("ClassHeritage"),
            whitespace,
            spliceReplace(1,1),
        ])),
        keyword("{"),       // 4
        whitespace,         // 3
        choice([            // 2 = body
            items([
                ref("ClassBody"),
                whitespace,
                spliceReplace(1,1),
            ]),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        keyword("}"),       // 1
        pos,                // 0 = end
        spliceNode(6,"ClassTail",6,0,[5,2]),
    ]));

// ClassHeritage

grm.define("ClassHeritage",
    items([
        pos,                           // 4 = start
        keyword("extends"),            // 3
        whitespace,                    // 2
        ref("LeftHandSideExpression"), // 1 = expr
        pos,                           // 0 = end
        spliceNode(4,"Extends",4,0,[1]),
    ]));

// ClassBody

grm.define("ClassBody",
    ref("ClassElementList"));

// ClassElementList

grm.define("ClassElementList",
    list(
        ref("ClassElement"),
        items([
            whitespace,
            ref("ClassElement"),
            spliceReplace(1,0),
        ])
    ));

// ClassElement_1

grm.define("ClassElement_1",
    ref("MethodDefinition"));

// ClassElement_2

grm.define("ClassElement_2",
    items([
        pos,
        keyword("static"),
        whitespace,
        ref("MethodDefinition"),
        pos,
        spliceNode(4,"StaticMethodDefinition",4,0,[1]),
    ]));

// ClassElement_3

grm.define("ClassElement_3",
    items([
        pos,
        keyword(";"),
        pos,
        spliceNode(2,"EmptyClassElement",2,0,[]),
    ]));

// ClassElement

grm.define("ClassElement",
    choice([
        ref("ClassElement_1"),
        ref("ClassElement_2"),
        ref("ClassElement_3"),
    ]));

// Section 15.1

// Script

grm.define("Script",
    items([
        pos,
        choice([
            ref("ScriptBody"),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        pos,
        spliceNode(2,"Script",2,0,[1]),
    ]));

// ScriptBody

grm.define("ScriptBody",
    ref("StatementList"));

// Section 15.2

// Module

grm.define("Module",
    items([
        pos,
        choice([
            ref("ModuleBody"),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        pos,
        spliceNode(2,"Module",2,0,[1]),
    ]));

// ModuleBody

grm.define("ModuleBody",
    ref("ModuleItemList"));

// ModuleItemList

grm.define("ModuleItemList",
    list(
        ref("ModuleItem"),
        items([
            whitespace,
            ref("ModuleItem"),
            spliceReplace(1,0),
        ])
    ));

// ModuleItem

grm.define("ModuleItem",
    choice([
        ref("ImportDeclaration"),
        ref("ExportDeclaration"),
        ref("StatementListItem"),
    ]));

// Section 15.2.2

// ImportDeclaration_from

grm.define("ImportDeclaration_from",
    items([
        pos,                 // 8 = start
        keyword("import"),   // 7
        whitespace,          // 6
        ref("ImportClause"), // 5 = importClause
        whitespace,          // 4
        ref("FromClause"),   // 3 = fromClause
        whitespace,          // 2
        keyword(";"),        // 1
        pos,                 // 0 = end
        spliceNode(8,"ImportFrom",8,0,[5,3]),
    ]));

// ImportDeclaration_module

grm.define("ImportDeclaration_module",
    items([
        pos,                    // 6 = start
        keyword("import"),      // 5
        whitespace,             // 4
        ref("ModuleSpecifier"), // 3 = specifier
        whitespace,             // 2
        keyword(";"),           // 1
        pos,                    // 0 = end
        spliceNode(6,"ImportModule",6,0,[3]),
    ]));

// ImportDeclaration

grm.define("ImportDeclaration",
    choice([
        ref("ImportDeclaration_from"),
        ref("ImportDeclaration_module"),
    ]));

// ImportClause

grm.define("ImportClause",
    items([
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
                        spliceNode(6,"DefaultAndNameSpaceImports",6,0,[5,1]),
                    ]),
                    items([
                        whitespace,             // 4
                        keyword(","),           // 3
                        whitespace,             // 2
                        ref("NamedImports"),    // 1 = nsimports
                        pos,                    // 0 = end
                        spliceNode(6,"DefaultAndNamedImports",6,0,[5,1]),
                    ]),
                    items([
                        pos,
                        spliceNode(2,"DefaultImport",2,0,[1]),
                    ]),
                ]),
            ]),
        ]),
    ]));

// ImportedDefaultBinding

grm.define("ImportedDefaultBinding",
    ref("ImportedBinding"));

// NameSpaceImport

grm.define("NameSpaceImport",
    items([
        pos,                    // 6 = start
        keyword("*"),           // 5
        whitespace,             // 4
        keyword("as"),          // 3
        whitespace,             // 2
        ref("ImportedBinding"), // 1 = binding
        pos,                    // 0 = end
        spliceNode(6,"NameSpaceImport",6,0,[1]),
    ]));

// NamedImports

grm.define("NamedImports",
    items([
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
                spliceReplace(2,2),
            ]),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        keyword("}"),      // 1
        pos,               // 0 = end
        spliceNode(5,"NamedImports",5,0,[2]),
    ]));

// FromClause

grm.define("FromClause",
    items([
        keyword("from"),
        whitespace,
        ref("ModuleSpecifier"),
        spliceReplace(2,0),
    ]));

// ImportsList

grm.define("ImportsList",
    list(
        ref("ImportSpecifier"),
        items([
            whitespace,
            keyword(","),
            whitespace,
            ref("ImportSpecifier"),
            spliceReplace(3,0),
        ])
    ));

// ImportSpecifier

grm.define("ImportSpecifier",
    items([
        choice([
            items([
                pos,                     // 6 = start
                ref("IdentifierName"),   // 5 = name
                whitespace,              // 4
                keyword("as"),           // 3
                whitespace,              // 2
                ref("ImportedBinding"),  // 1 = binding
                pos,                     // 0 = end
                spliceNode(6,"ImportAsSpecifier",6,0,[5,1]),
            ]),
            items([
                pos,                     // 2 = start
                ref("ImportedBinding"),  // 1 = binding
                pos,                     // 0 = end
                spliceNode(2,"ImportSpecifier",2,0,[1]),
            ]),
        ]),
    ]));

// ModuleSpecifier

grm.define("ModuleSpecifier",
    ref("StringLiteral"));

// ImportedBinding

grm.define("ImportedBinding",
    ref("BindingIdentifier"));

// Section 15.2.3

// ExportDeclaration

grm.define("ExportDeclaration",
    items([
        pos,
        keyword("export"),
        whitespace,
        choice([
            items([
                keyword("default"),          // 3
                whitespace,                  // 2
                ref("HoistableDeclaration"), // 1
                pos,                         // 0
                spliceNode(6,"ExportDefault",6,0,[1]),
            ]),
            items([
                keyword("default"),          // 3
                whitespace,                  // 2
                ref("ClassDeclaration"),     // 1
                pos,                         // 0
                spliceNode(6,"ExportDefault",6,0,[1]),
            ]),
            items([
                keyword("default"),          // 5
                whitespace,                  // 4
                not(keyword("function")),    // FIXME: need tests for this
                not(keyword("class")),       // FIXME: need tests for this
                ref("AssignmentExpression"), // 3
                whitespace,                  // 2
                keyword(";"),                // 1
                pos,                         // 0
                spliceNode(8,"ExportDefault",8,0,[3]),
            ]),
            items([
                keyword("*"),                // 5
                whitespace,                  // 4
                ref("FromClause"),           // 3
                whitespace,                  // 2
                keyword(";"),                // 1
                pos,                         // 0
                spliceNode(8,"ExportStar",8,0,[3]),
            ]),
            items([
                ref("ExportClause"),         // 5
                whitespace,                  // 4
                ref("FromClause"),           // 3
                whitespace,                  // 2
                keyword(";"),                // 1
                pos,                         // 0
                spliceNode(8,"ExportFrom",8,0,[5,3]),
            ]),
            items([
                ref("ExportClause"),         // 3
                whitespace,                  // 2
                keyword(";"),                // 1
                pos,                         // 0
                spliceNode(6,"ExportPlain",6,0,[3]),
            ]),
            items([
                ref("VariableStatement"),    // 1
                pos,                         // 0
                spliceNode(4,"ExportVariable",4,0,[1]),
            ]),
            items([
                ref("Declaration"),          // 1
                pos,                         // 0
                spliceNode(4,"ExportDeclaration",4,0,[1]),
            ]),
        ]),
    ]));

// ExportClause

grm.define("ExportClause",
    items([
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
                spliceReplace(2,2),
            ]),
            items([
                pos,
                spliceEmptyListNode(0,0,0),
            ]),
        ]),
        keyword("}"),    // 1
        pos,             // 0
        spliceNode(5,"ExportClause",5,0,[2]),
    ]));

// ExportsList

grm.define("ExportsList",
    list(
        ref("ExportSpecifier"),
        items([
            whitespace,
            keyword(","),
            whitespace,
            ref("ExportSpecifier"),
            spliceReplace(3,0),
        ])
    ));

// ExportSpecifier

grm.define("ExportSpecifier",
    items([
        pos,
        ref("IdentifierName"),
        choice([
            items([
                whitespace,            // 4
                keyword("as"),         // 3
                whitespace,            // 2
                ref("IdentifierName"), // 1
                pos,                   // 0
                spliceNode(4,"ExportAsSpecifier",6,0,[5,1]),
            ]),
            items([
                pos,
                spliceNode(0,"ExportNormalSpecifier",2,0,[1]),
            ]),
        ]),
        spliceReplace(2,0),
    ]));

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
