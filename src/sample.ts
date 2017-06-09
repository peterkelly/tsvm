// Copyright 2016-2017 Peter Kelly <peter@pmkelly.net>
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
    Parser,
    ParseFailure,
    ParseError,
    ParseIgnore,
} from "./parser/parser";
import {
    CastError,
    Range,
    ASTNode,
    ListNode,
    ErrorNode,
    GenericNode,
    GenericStringNode,
    GenericNumberNode,
} from "./parser/ast";
import {
    Builder,
    Grammar,
    empty,
    not,
    ref,
    list,
    sequence,
    spliceNull,
    spliceReplace,
    spliceNode,
    spliceStringNode,
    spliceNumberNode,
    spliceEmptyListNode,
    pop,
    opt,
    choice,
    repeat,
    pos,
    value,
    keyword,
    identifier,
    whitespace,
    whitespaceNoNewline,
    identifier_token,
    numeric_literal_token,
    string_literal_token,
} from "./parser/grammar";

export const grm = new Grammar();

// grm.define("NUMBER", numeric_literal_token());
// grm.define("IDENT", identifier_token());

// grm.define("STRING", string_literal_token());

// Primary        = NUMBER | IDENT | "(" Expression ")"

grm.define("Primary",
    choice([
        keyword("NUMBER"),
        keyword("IDENT"),
        sequence([
            keyword("("),
            ref("Expression"),
            keyword(")"),
            spliceReplace(2, 1),
        ]),
    ]));

//
// Multiplicative = Primary
//                    ( "*" Multiplicative |
//                      "/" Multiplicative |
//                      "%" Multiplicative)*

grm.define("Multiplicative",
    sequence([
        ref("Primary"),
        repeat(
            choice([
                sequence([
                    keyword("*"),
                    ref("Multiplicative"),
                    spliceNode(2, "Mul", -1, -1, [2, 0]),
                ]),
                sequence([
                    keyword("/"),
                    ref("Multiplicative"),
                    spliceNode(2, "Div", -1, -1, [2, 0]),
                ]),
                sequence([
                    keyword("%"),
                    ref("Multiplicative"),
                    spliceNode(2, "Mod", -1, -1, [2, 0]),
                ]),
            ])
        )
    ]));

// Additive       = Multiplicative
//                    ( "+" Additive |
//                      "-" Additive )*

grm.define("Additive",
    sequence([
        ref("Multiplicative"),
        repeat(
            choice([
                sequence([
                    keyword("+"),
                    ref("Additive"),
                    spliceNode(2, "Add", -1, -1, [2, 0]),
                ]),
                sequence([
                    keyword("-"),
                    ref("Additive"),
                    spliceNode(2, "Sub", -1, -1, [2, 0]),
                ]),
            ])
        )
    ]));

// Equality       = Additive "==" Additive |
//                  Additive "!=" Additive |
//                  Additive

grm.define("Equality",
    choice([
        sequence([
            ref("Additive"),
            keyword("=="),
            ref("Additive"),
            spliceNode(2, "Eq", -1, -1, [2, 0]),
        ]),
        sequence([
            ref("Additive"),
            keyword("!="),
            ref("Additive"),
            spliceNode(2, "Ne", -1, -1, [2, 0]),
        ]),
        ref("Additive"),
    ]));

// Expression     = Equality

grm.define("Expression",
    ref("Equality"));

/*
grm.define("test",
    sequence([
        sequence([
            sequence([
                choice([
                    choice([
                        choice([
                            sequence([
                                sequence([
                                    sequence([
                                        keyword('x'),
                                    ]),
                                ]),
                            ]),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]));
*/
