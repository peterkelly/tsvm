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
import { Script } from "./parser/syntax";
import { Parser } from "./parser/parser";
import { ASTNode } from "./parser/ast";

// console.log("Hello World");
// console.log("__filename = "+__filename);
// console.log("__dirname = "+__dirname);
// // console.log("argv",process.argv);
// console.log("argv.length = "+process.argv.length);
// for (let i = 0; i < process.argv.length; i++) {
//     console.log("argv["+i+"] = "+JSON.stringify(process.argv[i]));
// }

function printTree(node: ASTNode, prefix: string = "", indent: string = "") {
    if (node == null) {
        console.log(prefix+"null");
        return;
    }

    console.log(prefix+node.label);

    const children = node.children;
    // console.log(prefix+"children.length = "+children.length);
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (i+1 < children.length)
            printTree(child,indent+"|-- ",indent+"|   ");
        else
            printTree(child,indent+"\\-- ",indent+"    ");
    }
}

function main(): void {
    if ((process.argv.length == 4) && (process.argv[2] == "parse")) {
        const text = fs.readFileSync(process.argv[3],{ encoding: "utf-8" });
        console.log(text);
        try {
            const p = new Parser(text);
            const root = Script(p);
            printTree(root);
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        console.log("Usage: index.js parse FILENAME");
        process.exit(1);
    }
}

main();
