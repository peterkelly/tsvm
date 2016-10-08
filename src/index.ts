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
import { grm, parseModule } from "./parser/syntax";
import { Parser, ParseError } from "./parser/parser";
import { ASTNode } from "./parser/ast";
import { ModuleNode } from "./execution/modules";
// import { compileModule } from "./parser/compiler";
import { evalModule } from "./execution/interpreter";

type CommandFunction = (input: string) => string;
type CommandSet = { [name: string]: CommandFunction };

interface TestData {
    input: string;
    command: string;
    output: string;
}

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

function nodeToPlainTree(node: ASTNode, p: Parser): string {
    const lines: string[] = [];
    recurse(node);
    return lines.join("\n");

    function recurse(node: ASTNode | null, indent: string = "") {
        if (node == null) {
            lines.push(indent+"null");
            return;
        }

        const rawText = p.text.substring(node.range.start,node.range.end);

        lines.push(indent+node.label+" "+node.range.start+"-"+node.range.end+" "+JSON.stringify(rawText));

        for (const child of node.children)
            recurse(child,indent+"  ");
    }
}

function nodeToFancyTree(node: ASTNode): string {
    const lines: string[] = [];
    recurse(node);
    return lines.join("\n");

    function recurse(node: ASTNode | null, prefix: string = "", indent: string = "") {
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

const commands: CommandSet = {

    ["ast-module"](input: string): string {
        const p = new Parser(input);
        const root = parseModule(p);
        p.skipWhitespace();
        if (p.pos < p.len)
            throw new ParseError(p,p.pos,"Expected end of file");
        const typedRoot = ModuleNode.fromGeneric(root);
        return nodeToPlainTree(typedRoot,p);
    }

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

    let command: string = "";
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

function joinTestData(data: TestData) {
    return [
        data.input,
        "",
        OUTPUT_START,
        data.command,
        "",
        data.output,
        OUTPUT_END
    ].join("\n");
}

function leftpad(str: string, width: number) {
    if (str.length < width)
        str += (new Array(width-str.length+1)).join(" ");
    return str;
}

function checkTest(relPath: string, content: string): boolean {
    const absPath = path.resolve(process.cwd(),relPath);
    try {
        const { input, command, output: expected } = splitTestData(content);
        const fun = commands[command];
        if (fun == null)
            throw new Error("Unknown command "+JSON.stringify(command));
        const actual = fun(input);
        const pass = (actual == expected);
        if (pass) {
            console.log(leftpad(relPath,60)+"PASS");
            return true;
        }
        else {
            console.log(leftpad(relPath,60)+"FAIL");
            return false;
        }
    }
    catch (e) {
        console.log(leftpad(relPath,60)+"FAIL "+e);
        return false;
    }
}

function genTest(command: string, relPath: string, write: boolean) {
    const absPath = path.resolve(process.cwd(),relPath);
    try {
        const content = fs.readFileSync(absPath,{ encoding: "utf-8" });

        const { input } = splitTestData(content);

        const fun = commands[command];
        if (fun == null)
            throw new Error("Unknown command "+JSON.stringify(command));

        let output: string = "";
        try {
            output = fun(input);
        }
        catch (e) {
            output = "Exception: "+e;
        }

        const joined = joinTestData({ input: input, command: command, output: output });

        if (write) {
            fs.writeFileSync(relPath,joined+"\n",{ encoding: "utf-8" });
            console.log("Wrote "+relPath);
        }
        else {
            console.log(joined);
        }
    }
    catch (e) {
        console.error(absPath+": "+e);
        process.exit(1);
    }
}

function parse(relFilename: string): void {
    const text = fs.readFileSync(relFilename,{ encoding: "utf-8" });
    console.log(text);
    try {
        const p = new Parser(text);
        const root = parseModule(p);
        p.skipWhitespace();
        if (p.pos < p.len)
            throw new ParseError(p,p.pos,"Expected end of file");
        console.log(nodeToPlainTree(root,p));
    }
    catch (e) {
        console.error(e.toString());
        process.exit(1);
    }
}

function runtests(relRoot: string): void {
    const absRoot = path.resolve(process.cwd(),relRoot);
    let passed = 0;
    let failed = 0;
    recurse();
    console.log("Passed: "+passed);
    console.log("Failed: "+failed);

    function recurse(relPath: string = "") {
        const absPath = path.join(absRoot,relPath);
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
                    if(checkTest(relPath,content))
                        passed++;
                    else
                        failed++;
                }
            }
        }
        catch (e) {
            console.error(absPath+": "+e);
        }
    }
}

function showUsageAndExit(): void {
    console.error("Usage:");
    console.error("    "+path.basename(process.argv[1])+" gentest [-w] <command> <filename>");
    console.error("    "+path.basename(process.argv[1])+" runtests <path>");
    process.exit(1);
}

function execute(relFilename: string) {
    const absFilename = path.resolve(process.cwd(),relFilename);
    try {
        const content = fs.readFileSync(absFilename,{ encoding: "utf-8" });

        const { input } = splitTestData(content);

        const p = new Parser(input);
        const root = parseModule(p);
        p.skipWhitespace();
        if (p.pos < p.len)
            throw new ParseError(p,p.pos,"Expected end of file");

        try {
            evalModule(root);
        }
        catch (e) {
            console.log(e);
            console.log(e.stack);
        }
    }
    catch (e) {
        console.error(absFilename+": "+e);
        process.exit(1);
    }
}

function printGrammar(): void {
    const components: string[] = [];
    grm.dump((str: string) => components.push(str));
    console.log(components.join(""));
}

function main(): void {
    let i = 2;
    const argv = process.argv;
    const argc = process.argv.length;

    if ((process.argv.length == 4) && (process.argv[2] == "runtests")) {
        runtests(process.argv[3]);
    }
    else if ((i < argc) && (argv[i] == "grammar")) {
        printGrammar();
    }
    else if ((i < argc) && (argv[i] == "execute")) {
        i++;
        execute(argv[i]);
    }
    else if ((i < argc) && (argv[i] == "gentest")) {
        i++;

        let command: string = "";
        let filename: string = "";
        let write: boolean = false;

        for (; i < argc; i++) {
            if (argv[i] == "-w")
                write = true;
            else if (command == "")
                command = argv[i];
            else if (filename == "")
                filename = argv[i];
        }

        if ((command == "") || (filename == ""))
            showUsageAndExit();

        genTest(command,filename,write);
    }
    else {
        showUsageAndExit();
    }
}

main();
