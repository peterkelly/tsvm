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

const COL_BLACK   = 0;
const COL_RED     = 1;
const COL_GREEN   = 2;
const COL_YELLOW  = 3;
const COL_BLUE    = 4;
const COL_MAGENTA = 5;
const COL_CYAN    = 6;
const COL_WHITE   = 7;

export function boldBrightColor(s: string, col: number): string {
    return "\x1b[9" + col + ";1m" + s + "\x1b[0m";
}

export function black(s: string): string {
    return boldBrightColor(s, COL_BLACK);
}

export function red(s: string): string {
    return boldBrightColor(s, COL_RED);
}

export function green(s: string): string {
    return boldBrightColor(s, COL_GREEN);
}

export function yellow(s: string): string {
    return boldBrightColor(s, COL_YELLOW);
}

export function blue(s: string): string {
    return boldBrightColor(s, COL_BLUE);
}

export function magenta(s: string): string {
    return boldBrightColor(s, COL_MAGENTA);
}

export function cyan(s: string): string {
    return boldBrightColor(s, COL_CYAN);
}

export function white(s: string): string {
    return boldBrightColor(s, COL_WHITE);
}


// export function green(s: string): string {
//     return "\x1b[92;1m" + s + "\x1b[0m";
// }
//
// export function red(s: string): string {
//     return "\x1b[91;1m" + s + "\x1b[0m";
// }

export function strip(s: string): string {
    const chars: string[] = [];
    for (let i = 0; i < s.length; i++) {
        if (s[i] === "\x1b") {
            i++;
            while (s[i] !== "m")
                i++;
        }
        else {
            chars.push(s[i]);
        }
    }
    return chars.join("");
}

export function padLeft(s: string, length: number): string {
    const sLength = strip(s).length;
    for (let i = sLength; i < length; i++)
        s = " " + s;
    return s;
}

export function padRight(s: string, length: number): string {
    const sLength = strip(s).length;
    for (let i = sLength; i < length; i++)
        s = s + " ";
    return s;
}

function test(): void {
    const greenText = green("Green");
    const redText = red("Red");
    // const line = "one " + green("two") + " three " + red("four") + " five";
    const line =
        "normal " +
        black("black") + " " +
        red("red") + " " +
        green("green") + " " +
        yellow("yellow") + " " +
        blue("blue") + " " +
        magenta("magenta") + " " +
        cyan("cyan") + " " +
        white("white") +
        " normal";

    console.log(line);
    // console.log(JSON.stringify(line));

    const stripped = strip(line);
    console.log(stripped);
}

// test();
