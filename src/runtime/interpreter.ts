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
    UnknownType,
    Empty,
    JSValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    JSOrdinaryObject,
    JSPrimitiveValue,
    JSPropertyKey,
    JSInteger,
    JSInt32,
    JSUInt32,
    JSInt16,
    JSUInt16,
    JSInt8,
    JSUInt8,
    PropertyDescriptor,
    BaseDescriptor,
    DataDescriptor,
    AccessorDescriptor,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Reference,
    SuperReference,
    DataBlock,
} from "./datatypes";
// import {
//     ExecutionContext,
//     Realm,
// } from "./context";
import {
    ASTNode,
    ListNode,
    GenericStringNode,
    GenericNumberNode,
} from "../parser/ast";

// function evalExpression(ctx: ExecutionContext, node: ASTNode): Completion<JSValue> {
//     switch (node.kind) {
//         case "NullLiteral":
//             return new NormalCompletion(new JSNull());
//         case "True":
//             return new NormalCompletion(new JSBoolean(true));
//         case "False":
//             return new NormalCompletion(new JSBoolean(false));
//         case "StringLiteral": {
//             if (!(node instanceof GenericStringNode))
//                 throw new Error("StringLiteral: node is not a GenericStringNode");
//             return new NormalCompletion(new JSString(node.value));
//         }
//         case "NumericLiteral":
//             if (!(node instanceof GenericNumberNode))
//                 throw new Error("NumericLiteral: node is not a GenericNumberNode");
//             return new NormalCompletion(new JSNumber(node.value));
//         case "IdentifierReference":
//             if (!(node instanceof GenericStringNode))
//                 throw new Error("IdentifierReference: node is not a GenericStringNode");
//             return ctx.ResolveBinding(new JSString(node.value));
//         case "This":
//             return ctx.ResolveThisBinding();
//     }
//
//     throw new Error("Unsupported expression node: "+node.kind);
// }

// class Foo extends BuiltinFunction {
//     public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
//         return new NormalCompletion(new JSUndefined());
//     }
// }

export function evalModule(node: ASTNode): void {
    // const realm = new Realm();
    const obj = new JSOrdinaryObject();
    console.log("evalModule");
}
