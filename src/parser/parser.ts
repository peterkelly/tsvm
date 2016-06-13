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

const keywords = arrayToSet([
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
]);

const punctuators = arrayToSet([
    "{",    "(",    ")",    "[",    "]",    ".",
    "...",  ";",    ",",    "<",    ">",    "<=",
    ">=",   "==",   "!=",   "===",  "!==",
    "+",    "-",    "*",    "%",    "++",   "--",
    "<<",   ">>",   ">>>",  "&",    "|",    "^",
    "!",    "~",    "&&",   "||",   "?",    ":",
    "=",    "+=",   "-=",   "*=",   "%=",   "<<=",
    ">>=",  ">>>=", "&=",   "|=",   "^=",   "=>",
    "/", "/=", // DivPunctuator
    "}", // RightBracePunctuator
]);

function isKeyword(str: string): boolean {
    return (keywords[str] === true);
}

function isPunctuator(str: string): boolean {
    return (punctuators[str] === true);
}

function arrayToSet(array: string[]): { [key: string]: boolean } {
    const result: { [key: string]: boolean } = {};
    for (const item of array)
        result[item] = true;
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

export class Parser {
    public text: string;
    public pos: number;
    public len: number;

    public get cur(): string {
        if (this.pos < this.len)
            return this.text[this.pos];
        else
            return null;
    }

    public next(): string {
        if (this.pos < this.len)
            this.pos++;
        return this.cur;
    }

    public constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.len = this.text.length;
    }

    public skipWhitespace(): void {
        // FIXME: comments, tabs, and other whitespace characters
        while ((this.pos < this.len) && ((this.text[this.pos] == " ") || (this.text[this.pos] == "\n")))
            this.pos++;
    }

    public skipWhitespaceNoNewline(): void {
        // FIXME: comments, tabs, and other whitespace characters
        while ((this.pos < this.len) && ((this.text[this.pos] == " ")))
            this.pos++;
    }

    public upcomingPunctuator(): string {
        let longest: string = null;
        for (let i = this.pos+1; i < this.len; i++) {
            const candidate = this.text.substring(this.pos,i);
            if (isPunctuator(candidate))
                longest = candidate;
            else
                break;
        }
        return longest;
    }

    public lookaheadPunctuator(str: string): boolean {
        const upcoming = this.upcomingPunctuator();
        return (upcoming == str);
    }

    public matchPunctuator(str: string): boolean {
        if (this.lookaheadPunctuator(str)) {
            this.pos += str.length;
            return true;
        }
        return false;
    }

    public expectPunctuator(str: string): void {
        if (!this.matchPunctuator(str))
            throw new ParseError(this,this.pos,"Expected "+str);
    }

    public lookaheadKeyword(keyword: string): boolean {
        if (!isKeyword(keyword))
            throw new ParseError(this,this.pos,keyword+" is not a keyword");
        if ((this.pos < this.len) && (this.text.substring(this.pos,this.pos + keyword.length) == keyword)) {
            if ((this.pos + keyword.length == this.len) || !isIdChar(this.text[this.pos + keyword.length]))
                return true;
        }
        return false;
    }

    public matchKeyword(keyword: string): boolean {
        if (this.lookaheadKeyword(keyword)) {
            this.pos += keyword.length;
            return true;
        }
        return false;
    }

    public expectKeyword(keyword: string): void {
        if (!this.matchKeyword(keyword))
            throw new ParseError(this,this.pos,"Expected "+keyword);
    }

    public attempt<T>(f: (start: number) => T): T {
        const start = this.pos;
        try {
            return f(start);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }
}

export class ParseError {
    public readonly parser: Parser;
    public readonly pos: number;
    public readonly message: string;
    public constructor(parser: Parser, pos: number, message: string) {
        this.parser = parser;
        this.pos = pos;
        this.message = message;
    }
    public toString(): string {
        const before = this.parser.text.substring(0,this.pos);
        const after = this.parser.text.substring(this.pos,this.parser.text.length);
        return this.message+": "+JSON.stringify(before+"|"+after);
    }
}

export class ParseIgnore {
    public constructor() {
    }
}
