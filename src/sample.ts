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

grm.define("IDENT", identifier_token());
grm.define("NUMBER", numeric_literal_token());
grm.define("STRING", string_literal_token());

// grm.define("a", keyword("a"));
// grm.define("b", keyword("b"));
// grm.define("c", keyword("c"));
// grm.define("d", keyword("d"));
// grm.define("e", keyword("e"));
// grm.define("f", keyword("f"));
// grm.define("0", keyword("0"));
// grm.define("1", keyword("1"));
// grm.define("2", keyword("2"));
//
// grm.define("Precedence1",
//     sequence([
//         ref("a"),
//         ref("b"),
//         ref("c"),
//         ref("d"),
//         ref("e"),
//     ])
// );
//
// grm.define("Precedence2",
//     sequence([
//         ref("a"),
//         ref("b"),
//         sequence([
//             ref("0"),
//             ref("1"),
//             ref("2"),
//         ]),
//         ref("c"),
//         ref("d"),
//         ref("e"),
//     ])
// );
//
// grm.define("Precedence3",
//     choice([
//         ref("a"),
//         ref("b"),
//         ref("c"),
//         ref("d"),
//         ref("e"),
//     ])
// );
//
// grm.define("Precedence4",
//     choice([
//         ref("a"),
//         ref("b"),
//         choice([
//             ref("0"),
//             ref("1"),
//             ref("2"),
//         ]),
//         ref("c"),
//         ref("d"),
//         ref("e"),
//     ])
// );
//
// grm.define("Precedence5",
//     choice([
//         sequence([
//             ref("a"),
//             ref("b"),
//         ]),
//         sequence([
//             ref("c"),
//             ref("d"),
//         ])
//     ])
// );
//
// grm.define("Precedence6",
//     sequence([
//         choice([
//             ref("a"),
//             ref("b"),
//         ]),
//         choice([
//             ref("c"),
//             ref("d"),
//         ])
//     ])
// );

grm.define("ForCStatement",
    sequence([
        keyword("for"),
        keyword("("),
    ]));

grm.define("ForInStatement",
    sequence([
        keyword("for"),
        keyword("in"),
    ]));

grm.define("ForOfStatement",
    sequence([
        keyword("for"),
        keyword("1"),
    ]));

grm.define("ForStatement",
    choice([
        ref("ForCStatement"),
        ref("ForInStatement"),
        ref("ForOfStatement"),
    ]));

grm.define("WhileStatement",
    sequence([
        keyword("while"),
        keyword("{"),
        keyword("}"),
    ]));

grm.define("DoStatement",
sequence([
    keyword("while"),
    keyword("{"),
    keyword("}"),
]));

grm.define("IterationStatement",
    choice([
        ref("ForStatement"),
        ref("WhileStatement"),
        ref("DoStatement"),
    ]));

grm.define("IfStatement1",
    sequence([
        keyword("if"),
        keyword("{"),
    ]));

grm.define("IfStatement2",
    sequence([
        keyword("if"),
        keyword("*"),
    ]));

grm.define("TryStatement1",
    sequence([
        keyword("try"),
        keyword("{"),
    ]));

grm.define("TryStatement2",
    sequence([
        keyword("try"),
        keyword("*"),
    ]));


grm.define("Program",
    choice([
        ref("IfStatement1"),
        ref("IfStatement2"),
        ref("TryStatement1"),
        ref("TryStatement2"),
        ref("IterationStatement"),
    ]));





grm.define("Main",
    choice([
        sequence([
            keyword("if"),
            keyword("try"),
            ref("IDENT"),
            spliceNull(2),
        ]),
        sequence([
            keyword("if"),
            keyword("try"),
            ref("NUMBER"),
            spliceNull(2),
        ]),
        sequence([
            keyword("if"),
            keyword("catch"),
            ref("IDENT"),
            spliceNull(2),
        ]),
        sequence([
            keyword("while"),
            ref("IDENT"),
            spliceNull(1),
        ]),
        sequence([
            keyword("while"),
            ref("NUMBER"),
            spliceNull(1),
        ]),
    ])
);

// grm.define("Program",
//     sequence([
//         whitespace(),               // 8
//         pos(),                      // 7
//         ref("IDENT"),               // 6
//         whitespace(),               // 5
//         ref("IDENT"),               // 4
//         whitespace(),               // 3
//         ref("IDENT"),               // 2
//         pos(),                      // 1
//         whitespace(),               // 0
//         spliceNode(8,"Test",1,7,[6,4,2])
//     ]));
