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

import {
    Opcode,
    MemLocation,
    Immediate,
    Instruction,
    BasicBlock,
    Assembly
} from "./bytecode";

import {
    ASTNode,
    ModuleNode,
    ListNode,
} from "./parser/ast";

class CompileError {
    public readonly node: ASTNode;
    public readonly msg: string;
    public constructor(node: ASTNode, msg: string) {
        this.node = node;
        this.msg = msg;
    }
    public toString(): string {
        return this.node.range.start+" - "+this.node.range.end+": "+this.msg;
    }
}

export function compileModule(root: ASTNode): Assembly {
    const ass = new Assembly();
    const start = new BasicBlock();
    if (!(root instanceof ModuleNode))
        throw new CompileError(root,"Root must be a ModuleNode");
    const body = root.body;
    if (!(body instanceof ListNode))
        throw new CompileError(root,"Module body must be a ListNode");
    const statements = body.elements;
    for (const stmt of statements) {
        console.log("stmt = "+stmt);
    }
    return ass;
}
