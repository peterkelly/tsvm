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
        while ((this.pos < this.len) && ((this.text[this.pos] == " ") || (this.text[this.pos] == "\n")))
            this.pos++;
    }

    public lookahead(str: string): boolean {
        if ((this.pos < this.len) && (this.text.substring(this.pos,this.pos + str.length) == str))
            return true;
        return false;
    }

    public match(str: string): boolean {
        if (this.lookahead(str)) {
            this.pos += str.length;
            return true;
        }
        return false;
    }

    public expect(str: string): void {
        if (!this.match(str))
            throw new ParseError(this,this.pos,"Expected "+str);
    }

    public lookaheadKeyword(keyword: string): boolean {
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
