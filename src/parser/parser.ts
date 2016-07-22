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

type PF<T> = (p: Parser) => T;

let maxPunctuatorLen = 0;
for (const punc in punctuators) {
    if (maxPunctuatorLen < punc.length)
        maxPunctuatorLen = punc.length;
}

export function isKeyword(str: string): boolean {
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

    private skipws(allowNewline: boolean): void {
        while (this.pos < this.len) {
            const c = this.text[this.pos];
            switch (c) {
                case " ":
                case "\t":
                case "\r":
                    this.pos++;
                    break;
                case "\n":
                    if (allowNewline)
                        this.pos++;
                    else
                        return;
                    break;
                case "/": {
                    if (this.pos+1 >= this.len)
                        return;
                    if (this.text[this.pos+1] == "*") {
                        this.pos += 2;
                        // while ((this.pos+1 < this.len) && ((this.text[this.pos] != "*") || (this.text[this.pos] != "/")))
                        //     this.pos++;

                        while (this.pos < this.len) {
                            if ((this.pos+1 < this.len) && (this.text[this.pos] == "*") && (this.text[this.pos+1] == "/")) {
                                this.pos += 2;
                                break;
                            }
                            else {
                                this.pos++;
                            }
                        }
                    }
                    else if (this.text[this.pos+1] == "/") {
                        this.pos += 2;
                        while (this.text[this.pos] != "\n")
                            this.pos++;
                    }
                    else {
                        return;
                    }
                    break;
                }
                default:
                    return;
            }
        }
    }

    public skipWhitespace(): void {
        this.skipws(true);
    }

    public skipWhitespaceNoNewline(): void {
        this.skipws(false);
    }

    public upcomingPunctuator(): string {
        let longest: string = null;
        for (let i = 1; i <= maxPunctuatorLen; i++) {
            const candidate = this.text.substring(this.pos,this.pos+i);
            if (isPunctuator(candidate))
                longest = candidate;
        }
        return longest;
    }

    public lookaheadKeyword(keyword: string): boolean {
        const upcoming = this.upcomingPunctuator();
        if (upcoming == keyword)
            return true;
        // if (!isKeyword(keyword))
        //     throw new ParseError(this,this.pos,keyword+" is not a keyword");
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

    public opt<T>(f: (p: Parser) => T): T {
        const start = this.pos;
        try {
            return f(this);
        }
        catch (e) {
            this.pos = start;
            return null;
        }
    }

    // Execute all of the functions in list, or throw an exception. In the latter case, restore
    // the current position to what it was at the start of the sequence.
    public sequence(list: ((p: Parser) => void)[]): void {
        const start = this.pos;
        try {
            for (const item of list)
                item(this);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public choice<T>(list: ((p: Parser) => T)[]): T {
        const start = this.pos;
        for (const item of list) {
            try {
                return item(this);
            }
            catch (e) {
                this.pos = start;
            }
        }
        throw new ParseError(this,this.pos,"No valid alternative found");
    }

    public get preceding(): string {
        return JSON.stringify(this.text.substring(0,this.pos));
    }

    public get following(): string {
        return JSON.stringify(this.text.substring(this.pos));
    }

    public seq1<T1,R>(
        elements: [ PF<T1> ],
        cb: (nodes: [T1]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            return cb([v1]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq2<T1,T2,R>(
        elements: [ PF<T1>, PF<T2> ],
        cb: (nodes: [T1,T2]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            return cb([v1,v2]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq3<T1,T2,T3,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3> ],
        cb: (nodes: [T1,T2,T3]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            return cb([v1,v2,v3]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq4<T1,T2,T3,T4,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4> ],
        cb: (nodes: [T1,T2,T3,T4]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            return cb([v1,v2,v3,v4]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq5<T1,T2,T3,T4,T5,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5> ],
        cb: (nodes: [T1,T2,T3,T4,T5]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            return cb([v1,v2,v3,v4,v5]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq6<T1,T2,T3,T4,T5,T6,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            return cb([v1,v2,v3,v4,v5,v6]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq7<T1,T2,T3,T4,T5,T6,T7,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            return cb([v1,v2,v3,v4,v5,v6,v7]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }
    public seq8<T1,T2,T3,T4,T5,T6,T7,T8,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq9<T1,T2,T3,T4,T5,T6,T7,T8,T9,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq10<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq11<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq12<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq13<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12>, PF<T13> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            const v13 = elements[12](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq14<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12>, PF<T13>, PF<T14> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            const v13 = elements[12](this);
            const v14 = elements[13](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq15<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12>, PF<T13>, PF<T14>, PF<T15> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            const v13 = elements[12](this);
            const v14 = elements[13](this);
            const v15 = elements[14](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq16<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12>, PF<T13>, PF<T14>, PF<T15>, PF<T16> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            const v13 = elements[12](this);
            const v14 = elements[13](this);
            const v15 = elements[14](this);
            const v16 = elements[15](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq17<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12>, PF<T13>, PF<T14>, PF<T15>, PF<T16>,
                    PF<T17> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            const v13 = elements[12](this);
            const v14 = elements[13](this);
            const v15 = elements[14](this);
            const v16 = elements[15](this);
            const v17 = elements[16](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17]);
        }
        catch (e) {
            this.pos = start;
            throw e;
        }
    }

    public seq18<T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18,R>(
        elements: [ PF<T1>, PF<T2>, PF<T3>, PF<T4>, PF<T5>, PF<T6>, PF<T7>, PF<T8>,
                    PF<T9>, PF<T10>, PF<T11>, PF<T12>, PF<T13>, PF<T14>, PF<T15>, PF<T16>,
                    PF<T17>, PF<T18> ],
        cb: (nodes: [T1,T2,T3,T4,T5,T6,T7,T8,T9,T10,T11,T12,T13,T14,T15,T16,T17,T18]) => R
    ): R {
        const start = this.pos;
        try {
            const v1 = elements[0](this);
            const v2 = elements[1](this);
            const v3 = elements[2](this);
            const v4 = elements[3](this);
            const v5 = elements[4](this);
            const v6 = elements[5](this);
            const v7 = elements[6](this);
            const v8 = elements[7](this);
            const v9 = elements[8](this);
            const v10 = elements[9](this);
            const v11 = elements[10](this);
            const v12 = elements[11](this);
            const v13 = elements[12](this);
            const v14 = elements[13](this);
            const v15 = elements[14](this);
            const v16 = elements[15](this);
            const v17 = elements[16](this);
            const v18 = elements[17](this);
            return cb([v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13,v14,v15,v16,v17,v18]);
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
