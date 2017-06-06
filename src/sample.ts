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

// grm.define("IDENT", identifier_token());
// grm.define("NUMBER", numeric_literal_token());
// grm.define("STRING", string_literal_token());

grm.define("ForCStatement",
    sequence([
        keyword("for"),
        keyword("c"),
        spliceNull(1),
    ]));

grm.define("ForInStatement",
    sequence([
        keyword("for"),
        keyword("in"),
        spliceNull(1),
    ]));

grm.define("ForOfStatement",
    sequence([
        keyword("for"),
        keyword("of"),
        spliceNull(1),
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
        keyword("("),
        keyword(")"),
        spliceNull(2),
    ]));

grm.define("Statement",
    choice([
        ref("ForStatement"),
        ref("WhileStatement"),
    ]));
