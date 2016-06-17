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

import fs = require("fs");
import path = require("path");
import { Script, Module } from "./parser/syntax";
import { Parser, ParseError } from "./parser/parser";
import { ASTNode, ListNode } from "./parser/ast";

const OUTPUT_START = "/*******************************************************************************";
const OUTPUT_END = "*******************************************************************************/";

// console.log("Hello World");
// console.log("__filename = "+__filename);
// console.log("__dirname = "+__dirname);
// // console.log("argv",process.argv);
// console.log("argv.length = "+process.argv.length);
// for (let i = 0; i < process.argv.length; i++) {
//     console.log("argv["+i+"] = "+JSON.stringify(process.argv[i]));
// }

function nodeToPlainTree(node: ASTNode): string {
    const lines: string[] = [];
    recurse(node);
    return lines.join("\n");

    function recurse(node: ASTNode, indent: string = "") {
        if (node == null) {
            console.log(indent+"Nil");
            return;
        }

        lines.push(indent+node.label);

        for (const child of node.children)
            recurse(child,indent+"  ");
    }
}

function nodeToFancyTree(node: ASTNode): string {
    const lines: string[] = [];
    recurse(node);
    return lines.join("\n");

    function recurse(node: ASTNode, prefix: string = "", indent: string = "") {
        if (node == null) {
            console.log(prefix+"null");
            return;
        }

        lines.push(prefix+node.label);

        const children = node.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (i+1 < children.length)
                recurse(child,indent+"|-- ",indent+"|   ");
            else
                recurse(child,indent+"\\-- ",indent+"    ");
        }
    }
}

interface TestData {
    input: string;
    command: string;
    output: string;
}

function splitTestData(content: string): TestData {
    const lines = content.split("\n");
    // console.log(lines);
    let inOutput = false;
    const inputLines: string[] = [];
    const outputLines: string[] = [];
    for (let i = 0; i < lines.length; i++) {
        // console.log("Line "+i+": "+JSON.stringify(lines[i]));
        if (lines[i] == OUTPUT_START) {
            inOutput = true;
        }
        else if (lines[i] == OUTPUT_END) {
            inOutput = false;
        }
        else if (inOutput) {
            outputLines.push(lines[i]);
        }
        else {
            inputLines.push(lines[i]);
        }
    }
    while ((inputLines.length > 0) && (inputLines[inputLines.length-1] == ""))
        inputLines.length--;
    while ((outputLines.length > 0) && (outputLines[outputLines.length-1] == ""))
        outputLines.length--;

    let command: string = null;
    if (outputLines.length > 0) {
        command = outputLines[0];
        outputLines.splice(0,1);
    }
    if ((outputLines.length > 0) && (outputLines[0] == ""))
        outputLines.splice(0,1);

    return {
        input: inputLines.join("\n"),
        command: command,
        output: outputLines.join("\n")
    };
}

function runTest(relPath: string, content: string) {
    const { input, command, output } = splitTestData(content);
}

function joinInputCmdOutput(input: string, command: string, output: string) {
    return [
        input,
        "",
        OUTPUT_START,
        command,
        "",
        output,
        OUTPUT_END
    ].join("\n");
}

function genTest(command: string, relPath: string) {
    let content: string = null;

    const absPath = path.resolve(process.cwd(),relPath);
    try {
        content = fs.readFileSync(absPath,{ encoding: "utf-8" });
    }
    catch (e) {
        console.error(absPath+": "+e);
        process.exit(1);
    }

    const { input } = splitTestData(content);

    if (command == "ast-module") {
        try {
            const p = new Parser(input);
            const root = Module(p);
            p.skipWhitespace();
            if (p.pos < p.len)
                throw new ParseError(p,p.pos,"Expected end of file");
            console.log(joinInputCmdOutput(input,command,nodeToPlainTree(root)));
        }
        catch (e) {
            console.log(joinInputCmdOutput(input,command,"Exception: "+e.toString()));
        }
    }
    else {
        console.error("Unknown command: "+command);
        process.exit(1);
    }
}

function main(): void {
    if ((process.argv.length == 4) && (process.argv[2] == "parse")) {
        const text = fs.readFileSync(process.argv[3],{ encoding: "utf-8" });
        console.log(text);
        try {
            const p = new Parser(text);
            const root = Module(p);
            p.skipWhitespace();
            if (p.pos < p.len)
                throw new ParseError(p,p.pos,"Expected end of file");
            console.log(nodeToPlainTree(root));
        }
        catch (e) {
            console.log(e.toString());
        }
    }
    else if ((process.argv.length == 4) && (process.argv[2] == "test")) {
        const toplevel = path.resolve(process.cwd(),process.argv[3]);
        // console.log("toplevel = "+toplevel);
        const recurse = (relPath: string): void => {
            const absPath = path.join(toplevel,relPath);
            try {
                // let str = relPath;
                // while (str.length < 60)
                //     str += " ";
                // str += absPath;
                // console.log(str);

                if (fs.statSync(absPath).isDirectory()) {
                    for (const filename of fs.readdirSync(absPath))
                        recurse(path.join(relPath,filename));
                }
                else {
                    if (relPath.match(/\.js$/)) {
                        const content = fs.readFileSync(absPath,{ encoding: "utf-8" });
                        runTest(relPath,content);
                    }
                }
            }
            catch (e) {
                console.error(absPath+": "+e);
            }
        }
        recurse("");
    }
    else if ((process.argv.length == 5) && (process.argv[2] == "gentest")) {
        genTest(process.argv[3],process.argv[4]);
    }
    else {
        console.log("Usage: index.js parse FILENAME");
        process.exit(1);
    }
}

main();
