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
    RequireObjectCoercible,
    IsCallable,
} from "./07-02-testcompare";
import {
    Call,
} from "./07-03-objects";
import {
    rt_double_add,
    rt_double_sub,
    rt_double_mul,
    rt_double_div,
    rt_double_mod,
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

// ES6 Section 12.3.6.1: Runtime Semantics: ArgumentListEvaluation

function ArgumentListEvaluation(ctx: ExecutionContext, argNodes: ASTNode[]): Completion<JSValue[]> {
    // FIXME: This is just a temporary implementation to get basic functionality... need to look
    // closer at the spec to ensure we're doing it correctly, and add support for spread arguments
    const result: JSValue[] = [];
    for (let i = 0; i < argNodes.length; i++) {
        const argNode = argNodes[i];
        const refComp = evalExpression(ctx,argNode);
        const argComp = GetValue(ctx.realm,refComp);
        if (!(argComp instanceof NormalCompletion))
            return argComp;
        const arg = argComp.value;
        result.push(arg);
    }
    return new NormalCompletion(result);
}

// ES6 Section 12.3.4.3: Runtime Semantics: EvaluateDirectCall (func, thisValue, arguments, tailPosition)

function EvaluateDirectCall(ctx: ExecutionContext, func: JSValue, thisValue: JSValue,
                            args: ASTNode[], tailPosition: boolean): Completion<JSValue> {
    const argListComp = ArgumentListEvaluation(ctx,args);
    if (!(argListComp instanceof NormalCompletion))
        return argListComp;
    const argList = argListComp.value;

    if (!(func instanceof JSValue))
        return ctx.realm.throwTypeError("Attempt to call a value that is not an object");

    if (!IsCallable(ctx.realm,func))
        return ctx.realm.throwTypeError("Object is not callable");

    // FIXME: support tail calls
    return Call(ctx.realm,func,thisValue,argList);
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
        case "Multiply":
        case "Divide":
        case "Modulo": {
            const leftNode = checkNodeNotNull(node.children[0]);
            const rightNode = checkNodeNotNull(node.children[1]);

            const leftComp = evalExpression(ctx,leftNode);
            const leftValueComp = GetValue(ctx.realm,leftComp);
            if (!(leftValueComp instanceof NormalCompletion))
                return leftValueComp;
            const leftValue = leftValueComp.value;

            const rightComp = evalExpression(ctx,rightNode);
            const rightValueComp = GetValue(ctx.realm,rightComp);
            if (!(rightValueComp instanceof NormalCompletion))
                return rightValueComp;
            const rightValue = rightValueComp.value;

            const lnumComp = ToNumber(ctx.realm,leftValue);
            if (!(lnumComp instanceof NormalCompletion))
                return lnumComp;
            const lnum = lnumComp.value;

            const rnumComp = ToNumber(ctx.realm,rightValue);
            if (!(rnumComp instanceof NormalCompletion))
                return rnumComp;
            const rnum = rnumComp.value;

            let resultNum: number;
            if (node.kind === "Multiply")
                resultNum = rt_double_mul(lnum.numberValue,rnum.numberValue);
            else if (node.kind === "Divide")
                resultNum = rt_double_div(lnum.numberValue,rnum.numberValue);
            else
                resultNum = rt_double_mod(lnum.numberValue,rnum.numberValue);
            const result = new JSNumber(resultNum);
            return new NormalCompletion(result);
        }
        case "MemberAccessIdent": {
            const leftNode = checkNodeNotNull(node.children[0]);
            const rightNode = checkNodeNotNull(node.children[1]);

            const baseReferenceComp = evalExpression(ctx,leftNode);
            if (!(baseReferenceComp instanceof NormalCompletion))
                return baseReferenceComp;
            // const baseReference = baseReferenceComp.value;
            const baseValueComp = GetValue(ctx.realm,baseReferenceComp);
            if (!(baseValueComp instanceof NormalCompletion))
                return baseValueComp;
            const baseValue = baseValueComp.value;

            const bvComp = RequireObjectCoercible(ctx.realm,baseValue);
            if (!(bvComp instanceof NormalCompletion))
                return bvComp;
            const bv = bvComp.value;
            if (!(bv instanceof JSObject))
                throw new Error("FIXME: Need to support non-objects for MemberAccessIdent");

            if (!(rightNode instanceof GenericStringNode))
                throw new Error("MemberAccessIdent: rightNode should be a GenericStringNode, kind is "+rightNode.kind);
            const propertyNameString = rightNode.value;
            const strict = true; // FIXME: This must be determined by the AST node

            const ref = new Reference(bv,new JSString(propertyNameString),new JSBoolean(strict));
            return new NormalCompletion(ref);
        }
        case "Call": {
            checkNode(node,"Call",2);
            const funNode = checkNodeNotNull(node.children[0]);
            const argsNode = checkNode(node.children[1],"Arguments",1);
            const argsListNode = checkListNode(argsNode.children[0]);

            const refComp = evalExpression(ctx,funNode);
            const funcComp = GetValue(ctx.realm,refComp);
            if (!(funcComp instanceof NormalCompletion))
                return funcComp;
            const func = funcComp.value;

            const thisValue = new JSUndefined(); // FIXME: temp

            return EvaluateDirectCall(ctx,func,thisValue,argsListNode.elements,false);
        }
    }

    throw new Error("Unsupported expression node: "+node.kind);
}

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

class ConsoleLogFunction extends JSOrdinaryObject {
    public constructor(realm: Realm, prototype: JSObject) {
        super(realm,prototype);
    }
    public get implementsCall(): boolean {
        return true;
    }
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        console.log("ConsoleLogFunction.__Call__ begin");
        const strings: string[] = [];
        for (const arg of args) {
            const strComp = ToString(this.realm,arg);
            if (!(strComp instanceof NormalCompletion))
                return strComp;
            const str = strComp.value;
            strings.push(str.stringValue);
        }
        console.log("==== "+strings.join(" "));
        return new NormalCompletion(new JSUndefined());
    }
}

export function evalModule(node: ASTNode): void {
    const realm = new RealmImpl();
    const envRec = new DeclarativeEnvironmentRecord(realm);
    const lexEnv = { record: envRec, outer: null };
    const ctx = new ExecutionContext(realm, new JSNull(),lexEnv);

    envRec.CreateImmutableBinding("console",true);
    const consoleObject = new JSOrdinaryObject(realm,realm.intrinsics.ObjectPrototype);
    consoleObject.properties.put("log",new DataDescriptor({
        enumerable: true,
        configurable: true,
        writable: true,
        value: new ConsoleLogFunction(realm,realm.intrinsics.FunctionPrototype)
    }));
    envRec.InitializeBinding("console",consoleObject);


    // const envRec = new EnvironmentRecord
    // const obj = new JSOrdinaryObject(realm);
    // console.log("evalModule");
    checkNode(node,"Module",1);
    const statements = checkListNode(node.children[0]);
    const resultComp = evalStatementList(ctx,statements);
    if (!(resultComp instanceof NormalCompletion)) {
        if (resultComp instanceof ThrowCompletion) {
            console.log("JS code threw exception");
            // try {
                const strComp = ToString(realm,resultComp.exceptionValue);
                if (!(strComp instanceof NormalCompletion)) {
                    console.log("toString() on exception object failed");
                }
                else {
                    // console.log(strComp.value);
                    // console.log("Value: "+(<any>strComp.value).constructor.name);
                    const str = strComp.value;
                    console.log(str.stringValue);
                }
            // }
            // catch (e) {
            //     console.log(e);
            // }
        }
        else {
            console.log("Got some other completion");
        }
    }
    console.log("Execution completed normally");
}
