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
    LexicalEnvironment,
    Realm,
    EnvironmentRecord,
    ValueType,
    JSValue,
    JSPrimitiveValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    JSOrdinaryObject,
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
    Intrinsics,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    ReferenceBase,
    SuperReferenceBase,
    Reference,
    SuperReference,
    DataBlock,
} from "./datatypes";
import {
    ExecutionContext,
} from "./08-03-context";
import {
    RealmImpl,
} from "./08-02-realm";
import {
    DeclarativeEnvironmentRecord,
} from "./08-01-environment";
import {
    ASTNode,
    ListNode,
    GenericStringNode,
    GenericNumberNode,
} from "../parser/ast";
import {
    ToString,
    ToNumber,
} from "./07-01-conversion";
import {
    GetValue,
} from "./06-02-03-reference";
import {
    ToPrimitive,
} from "./07-01-conversion";
import {
    rt_double_add,
    rt_double_sub,
    rt_string_concat,
} from "./runtime";

function checkNode(node: ASTNode | null, kind: string, arity: number): ASTNode {
    if (node === null)
        throw new Error("Expected "+kind+" node, got null");
    if (node.kind != kind)
        throw new Error("Expected "+kind+" node, got "+node.kind);
    if (node.children.length != arity)
        throw new Error("Expected "+kind+" node with "+arity+" chilren, but has "+node.children.length);
    return node;
}

function checkNodeNotNull(node: ASTNode | null): ASTNode {
    if (node === null)
        throw new Error("node is null");
    return node;
}

function checkListNode(node: ASTNode | null): ListNode {
    if (node == null)
        throw new Error("Expected list node, got null/undefined");
    if (!(node instanceof ListNode))
        throw new Error("Expected list node, got "+node.kind);
    return node;
}

function evalExpression(ctx: ExecutionContext, node: ASTNode): Completion<JSValue | Reference> {
    switch (node.kind) {
        case "NullLiteral":
            return new NormalCompletion(new JSNull());
        case "True":
            return new NormalCompletion(new JSBoolean(true));
        case "False":
            return new NormalCompletion(new JSBoolean(false));
        case "StringLiteral": {
            if (!(node instanceof GenericStringNode))
                throw new Error("StringLiteral: node is not a GenericStringNode");
            return new NormalCompletion(new JSString(node.value));
        }
        case "NumericLiteral":
            if (!(node instanceof GenericNumberNode))
                throw new Error("NumericLiteral: node is not a GenericNumberNode");
            return new NormalCompletion(new JSNumber(node.value));
        case "IdentifierReference":
            if (!(node instanceof GenericStringNode))
                throw new Error("IdentifierReference: node is not a GenericStringNode");
            return ctx.ResolveBinding(node.value);
        case "This":
            return ctx.ResolveThisBinding();
        case "Add": {
            const left = checkNodeNotNull(node.children[0]);
            const right = checkNodeNotNull(node.children[1]);

            const lrefComp = evalExpression(ctx,left);
            const lvalComp = GetValue(ctx.realm,lrefComp);
            if (!(lvalComp instanceof NormalCompletion))
                return lvalComp;
            const lval = lvalComp.value;

            const rrefComp = evalExpression(ctx,right);
            const rvalComp = GetValue(ctx.realm,rrefComp);
            if (!(rvalComp instanceof NormalCompletion))
                return rvalComp;
            const rval = rvalComp.value;

            const lprimComp = ToPrimitive(ctx.realm,lval);
            if (!(lprimComp instanceof NormalCompletion))
                return lprimComp;
            const lprim = lprimComp.value;

            const rprimComp = ToPrimitive(ctx.realm,rval);
            if (!(rprimComp instanceof NormalCompletion))
                return rprimComp;
            const rprim = rprimComp.value;

            if ((lprim instanceof JSString) || (rprim instanceof JSString)) {
                const lstrComp = ToString(ctx.realm,lprim);
                if (!(lstrComp instanceof NormalCompletion))
                    return lstrComp;
                const lstr = lstrComp.value;

                const rstrComp = ToString(ctx.realm,rprim);
                if (!(rstrComp instanceof NormalCompletion))
                    return rstrComp;
                const rstr = rstrComp.value;

                const resultStr = rt_string_concat(lstr.stringValue,rstr.stringValue);
                const result = new JSString(resultStr);
                return new NormalCompletion(result);
            }

            const lnumComp = ToNumber(ctx.realm,lprim);
            if (!(lnumComp instanceof NormalCompletion))
                return lnumComp;
            const lnum = lnumComp.value;

            const rnumComp = ToNumber(ctx.realm,rprim);
            if (!(rnumComp instanceof NormalCompletion))
                return rnumComp;
            const rnum = rnumComp.value;

            const resultNum = rt_double_add(lnum.numberValue,rnum.numberValue);
            const result = new JSNumber(resultNum);
            return new NormalCompletion(result);
        }
        case "Subtract": {
            const left = checkNodeNotNull(node.children[0]);
            const right = checkNodeNotNull(node.children[1]);

            const lrefComp = evalExpression(ctx,left);
            const lvalComp = GetValue(ctx.realm,lrefComp);
            if (!(lvalComp instanceof NormalCompletion))
                return lvalComp;
            const lval = lvalComp.value;

            const rrefComp = evalExpression(ctx,right);
            const rvalComp = GetValue(ctx.realm,rrefComp);
            if (!(rvalComp instanceof NormalCompletion))
                return rvalComp;
            const rval = rvalComp.value;

            const lnumComp = ToNumber(ctx.realm,lval);
            if (!(lnumComp instanceof NormalCompletion))
                return lnumComp;
            const lnum = lnumComp.value;

            const rnumComp = ToNumber(ctx.realm,rval);
            if (!(rnumComp instanceof NormalCompletion))
                return rnumComp;
            const rnum = rnumComp.value;

            const resultNum = rt_double_sub(lnum.numberValue,rnum.numberValue);
            const result = new JSNumber(resultNum);
            return new NormalCompletion(result);
        }
    }

    throw new Error("Unsupported expression node: "+node.kind);
}

// class Foo extends BuiltinFunction {
//     public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
//         return new NormalCompletion(new JSUndefined());
//     }
// }

function evalStatementList(ctx: ExecutionContext, statements: ListNode): Completion<void> {
    for (const stmt of statements.elements) {
        switch (stmt.kind) {
            case "ExpressionStatement": {
                checkNode(stmt,"ExpressionStatement",1);
                const expr = checkNodeNotNull(stmt.children[0]);
                const resultComp = evalExpression(ctx,expr);
                if (!(resultComp instanceof NormalCompletion))
                    return resultComp;
                const result = resultComp.value;
                let value: JSValue;
                if (result instanceof Reference) {
                    const valueComp = GetValue(ctx.realm,result);
                    if (!(valueComp instanceof NormalCompletion))
                        return valueComp;
                    value = valueComp.value;
                }
                else {
                    value = result;
                }
                // const value = GetValue(ctx.realm,result);
                const strComp = ToString(ctx.realm,value);
                if (!(strComp instanceof NormalCompletion))
                    return strComp;
                const str = strComp.value;
                console.log("ExpressionStatement returned "+str.stringValue);



                break;
            }
            default:
                throw new Error("Unsupported statement: "+stmt.kind);
        }
    }
    return new NormalCompletion(undefined);
}

export function evalModule(node: ASTNode): void {
    const realm = new RealmImpl();
    const envRec = new DeclarativeEnvironmentRecord(realm);
    const lexEnv = { record: envRec, outer: null };
    const ctx = new ExecutionContext(realm, new JSNull(),lexEnv);

    envRec.CreateImmutableBinding("console",true);
    const consoleObject = new JSOrdinaryObject(realm);
    envRec.InitializeBinding("console",consoleObject);


    // const envRec = new EnvironmentRecord
    // const obj = new JSOrdinaryObject(realm);
    // console.log("evalModule");
    checkNode(node,"Module",1);
    const statements = checkListNode(node.children[0]);
    const resultComp = evalStatementList(ctx,statements);
    if (!(resultComp instanceof NormalCompletion)) {
        if (resultComp instanceof ThrowCompletion) {
            console.log("JS code threw exception : "+resultComp.exceptionValue);
        }
        else {
            console.log("Got some other completion");
        }
    }
    console.log("Execution completed normally");
}
