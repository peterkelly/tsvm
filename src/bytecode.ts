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

import { ASTNode, ListNode } from "./parser/ast";

import { InternalSchemaError } from "./analysis";

import {
    CompletionType,
    Completion,
    LabelId,
    JSValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSPropertyDescriptor,
    JSObject
} from "./itypes";

function assertNode(node: ASTNode, kind: string, childCount: number) {
    if (node == null)
        throw new Error("Node is null");
    if (node.kind != kind)
        throw new InternalSchemaError(node,"Expected "+kind);
    if (node.children.length != childCount)
        throw new InternalSchemaError(node,"Should have "+childCount+" children");
}

function checkListNode(node: ASTNode): ListNode {
    if ((node != null) && (node instanceof ListNode))
        return node;
    else
        throw new Error("Expected a list node");
}

class Label {}

abstract class Address {}
class NameAddress extends Address {}
class ConstantAddress extends Address {}
class TemporaryAddress extends Address {}

abstract class Instruction {}
class BinaryOpInstruction extends Instruction {}
class UnaryOpInstruction extends Instruction {}
class CopyInstruction extends Instruction {}
class UnconditionalJumpInstruction extends Instruction {}
class ConditionalJumpInstruction extends Instruction {}
class RelationalJumpInstruction extends Instruction {}
class ParamInstruction extends Instruction {}
class CallInstruction extends Instruction {}
class ReturnInstruction extends Instruction {}
class IndexedCopyFromInstruction extends Instruction {}
class IndexedCopyToInstruction extends Instruction {}
class ReferenceSetValueInstruction extends Instruction {}
class ReferenceGetValueInstruction extends Instruction {}






export function executeNode(root: ASTNode): void {
    assertNode(root,"Module",1);
    // console.log("executeNode");
}
