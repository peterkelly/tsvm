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

import { Range } from "./ast";
import { Parser, ParseError } from "./parser";

export class Token {
    public readonly range: Range;
    public readonly kind: number;
    public readonly value: string;
    public constructor(range: Range, kind: number, value: string) {
        this.range = range;
        this.kind = kind;
        this.value = value;
    }
}

export enum TokenKind {
    IDENT = 1,
    NUMBER = 2,
    STRING = 3,
    FIRST_KEYWORD = 4,
}

const keywordArray = [
    "async",  // Note: Future reserved word (not in spec but we know it's coming)
    "await",  // Note: Future reserved word
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum", // Note: Future reserved word
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let", // Note: in strict mode, treated as a reserved keyword through static semantic restrictions
    "new",
    "return",
    "static", // Note: in strict mode, treated as a reserved keyword through static semantic restrictions
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield", // Note: can be an Identifier in some contexts
    "{",    "(",    ")",    "[",    "]",    ".",
    "...",  ";",    ",",    "<",    ">",    "<=",
    ">=",   "==",   "!=",   "===",  "!==",
    "+",    "-",    "*",    "%",    "++",   "--",
    "<<",   ">>",   ">>>",  "&",    "|",    "^",
    "!",    "~",    "&&",   "||",   "?",    ":",
    "=",    "+=",   "-=",   "*=",   "%=",   "<<=",
    ">>=",  ">>>=", "&=",   "|=",   "^=",   "=>",
    "/", "/=",
    "}",
];

const keywordSet = stringArrayToSet(keywordArray,TokenKind.FIRST_KEYWORD);

const keywordMaxLen = stringArrayMaxLength(keywordArray);

export function isKeyword(str: string): boolean {
    return (keywordSet[str] !== undefined);
}

function stringArrayToSet(array: string[], start: number): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    for (let i = 0; i < array.length; i++) {
        const str = array[i];
        result[str] = start+i;
    }
    return result;
}

function stringArrayMaxLength(array: string[]): number {
    let result: number = 0;
    for (const str of array)
        if (result < str.length)
            result = str.length;
    return result;
}

export function isIdStart(c: string): boolean {
    return (((c >= "A") && (c <= "Z")) ||
            ((c >= "a") && (c <= "z")) ||
            (c == "_"));
}

export function isIdChar(c: string): boolean {
    return (isIdStart(c) || ((c >= "0") && (c <= "9")));
}

export function upcomingKeyword(p: Parser): Token | null {
    let longest: string | null = null;
    for (let i = 1; i <= keywordMaxLen; i++) {
        const candidate = p.text.substring(p.pos,p.pos+i);
        if (isKeyword(candidate))
            longest = candidate;
    }
    if (longest == null)
        return null;
    return new Token(new Range(p.pos,p.pos+longest.length),keywordSet[longest],longest);
}

export function lexIdentOrKeyword(p: Parser): Token | null {
    const start = p.pos;
    let current = p.current();
    if ((current != null) && isIdStart(current)) {
        current = p.next();
        while ((current != null) && isIdChar(current))
            current = p.next();
        const range = new Range(start,p.pos);
        const value = p.text.substring(range.start,range.end);
        if (isKeyword(value))
            return new Token(new Range(start,p.pos),keywordSet[value],value);
        else
            return new Token(new Range(start,p.pos),TokenKind.IDENT,value);
    }
    else {
        const token = upcomingKeyword(p);
        if (token != null)
            p.pos = token.range.end;
        return token;
    }
}

export function lexNumber(p: Parser): Token | null {
    // TODO: Complete numeric literal syntax according to spec
    const start = p.pos;
    let current = p.current();
    while ((current != null) && (current >= "0") && (current <= "9")) {
        p.next();
        current = p.current();
    }
    if (p.pos == start)
        return null;
    if (p.current() == ".") {
        p.next();
        const postDecimal = p.pos;
        current = p.current();
        while ((current != null) && (current >= "0") && (current <= "9")) {
            p.next();
            current = p.current();
        }
        if (p.pos == postDecimal) {
            p.pos = start;
            throw new ParseError(p,p.pos,"Invalid number");
        }
    }
    const stringValue = p.text.substring(start,p.pos);
    return new Token(new Range(start,p.pos),TokenKind.NUMBER,stringValue)
}

export function lexString(p: Parser): Token | null {
    // TODO: Complete string literal syntax according to spec
    const start = p.pos;
    if ((p.current() == "\"") || (p.current() == "'")) {
        const quote = p.current();
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
                p.pos = start;
                throw new ParseError(p,p.pos,"Unterminated string");
            }
        }
        return new Token(new Range(start,p.pos),TokenKind.STRING,value);
    }
    return null;
}
