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

import { Parser, ParseError } from "./parser/parser";
import { ASTNode } from "./parser/ast";
import { Grammar, Action, Builder, ref } from "./parser/grammar";
import * as grammar from "./parser/grammar";
import { grm as sampleGrammar } from "./sample";
import { leftpad, rightpad } from "./util";
import * as fs from "fs";

function nodeToFancyTree(node: ASTNode): string {
    const lines: string[] = [];
    recurse(node);
    return lines.join("\n");

    function recurse(node: ASTNode | null, prefix: string = "", indent: string = "") {
        if (node == null) {
            console.log(prefix + "null");
            return;
        }

        lines.push(prefix + node.label);

        const children = node.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (i + 1 < children.length)
                recurse(child, indent + "|-- ", indent + "|   ");
            else
                recurse(child, indent + "\\-- ", indent + "    ");
        }
    }
}

export function parseSample(g: Grammar, input: string): ASTNode {
    const p = new Parser(input);
    const root = p.attempt(() => {
        const b = new Builder(g, p);
        ref("Program").execute(b);
        b.assertLengthIs(1);
        return b.getNode(0);
    });
    if (p.pos < p.len)
        throw new ParseError(p, p.pos, "Expected end of file");
    return root;
}

function grammarToString(g: Grammar): string {
    const components: string[] = [];
    g.dump({ write: (str: string) => components.push(str) });
    return components.join("");
}

function leftFactor(g: Grammar): void {
    g.visit((action, visitChildren) => {
        action = visitChildren();
        if (action instanceof grammar.ChoiceAction) {
            let foundCommon: boolean;
            do {
                foundCommon = false;
                let candidate: Action | null = null;
                const matches: Action[] = [];
                // const common: Action[] = [];
                for (const child of action.actions) {
                    if ((child instanceof grammar.SequenceAction) && (child.actions.length > 0)) {
                        const candidate = child.actions[0];
                    }
                    if (child instanceof grammar.SequenceAction) {
                        for (const grandChild of child.actions) {
                            if (grandChild instanceof grammar.KeywordAction) {
                                if (candidate === null)
                                    candidate = grandChild;
                                else
                                    foundCommon = true;
                                matches.push(candidate);
                            }
                        }
                    }
                }
                if (foundCommon) {
                    const revisedChoices: Action[] = [];

                }
            } while (!foundCommon);
        }

        return action;
    });
}

function main(): void {
    let beforeFilename: string | null = null;
    let afterFilename: string | null = null;
    if (process.argv.length > 2)
        beforeFilename = process.argv[2];
    if (process.argv.length > 3)
        afterFilename = process.argv[3];
    // const input = '   one   two    three ';
    // const root = parseSample(sampleGrammar, input);
    // console.log(nodeToFancyTree(root));

    const beforeStr = grammarToString(sampleGrammar);

    let indent = 0;
    sampleGrammar.visit((action, visitChildren) => {
        indent++;
        console.log(leftpad("", indent * 4) + (<any> action.constructor).name);
        action = visitChildren();
        indent--;
        return action;
    });

    const afterStr = grammarToString(sampleGrammar);

    if (beforeFilename && afterFilename) {
        fs.writeFileSync(beforeFilename, beforeStr);
        console.log("Wrote " + beforeFilename);
        fs.writeFileSync(afterFilename, afterStr);
        console.log("Wrote " + afterFilename);
    }
    else {
        console.log("Before");
        console.log(beforeStr);
        console.log("After");
        console.log(afterStr);
    }
}

main();
