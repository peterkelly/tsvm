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
    JSValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    DataDescriptor,
    Intrinsics,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Reference,
    Realm,
} from "../runtime/datatypes";
import {
    ExecutionContext,
} from "../runtime/08-03-context";
import {
    RealmImpl,
} from "../runtime/08-02-realm";
import {
    DeclarativeEnvironmentRecord,
} from "../runtime/08-01-environment";
import {
    ASTNode,
    ListNode,
    GenericStringNode,
    GenericNumberNode,
} from "../parser/ast";
import {
    ToString,
    ToNumber,
    ToBoolean,
} from "../runtime/07-01-conversion";
import {
    GetValue,
} from "../runtime/06-02-03-reference";
import {
    ToPrimitive,
} from "../runtime/07-01-conversion";
import {
    RequireObjectCoercible,
    IsCallable,
} from "../runtime/07-02-testcompare";
import {
    Call,
} from "../runtime/07-03-objects";
import {
    pr_double_add,
    pr_double_sub,
    pr_double_mul,
    pr_double_div,
    pr_double_mod,
    pr_string_concat,
} from "../runtime/primitives";

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

// ES6 Section 12.3.2.1: Property Accessors - Runtime Semantics: Evaluation

function evalMemberAccessIdent(ctx: ExecutionContext, node: ASTNode): Completion<JSValue | Reference> {
    const leftNode = checkNodeNotNull(node.children[0]);
    const rightNode = checkNodeNotNull(node.children[1]);

    // 1. Let baseReference be the result of evaluating MemberExpression.
    const baseReferenceComp = evalExpression(ctx,leftNode);
    if (!(baseReferenceComp instanceof NormalCompletion))
        return baseReferenceComp;

    // 2. Let baseValue be GetValue(baseReference).
    // 3. ReturnIfAbrupt(baseValue).
    const baseValueComp = GetValue(ctx.realm,baseReferenceComp);
    if (!(baseValueComp instanceof NormalCompletion))
        return baseValueComp;
    const baseValue = baseValueComp.value;

    // 4. Let bv be RequireObjectCoercible(baseValue).
    // 5. ReturnIfAbrupt(bv).
    const bvComp = RequireObjectCoercible(ctx.realm,baseValue);
    if (!(bvComp instanceof NormalCompletion))
        return bvComp;
    const bv = bvComp.value;
    if (!(bv instanceof JSObject))
        throw new Error("FIXME: Need to support non-objects for MemberAccessIdent");

    // 6. Let propertyNameString be StringValue of IdentifierName
    if (!(rightNode instanceof GenericStringNode))
        throw new Error("MemberAccessIdent: rightNode should be a GenericStringNode, kind is "+rightNode.kind);
    const propertyNameString = rightNode.value;

    // 7. If the code matched by the syntactic production that is being evaluated is strict mode
    // code, let strict be true, else let strict be false.
    const strict = true; // FIXME: This must be determined by the AST node

    // 8. Return a value of type Reference whose base value is bv and whose referenced name is
    // propertyNameString, and whose strict reference flag is strict.
    const ref = new Reference(bv,new JSString(propertyNameString),new JSBoolean(strict));
    return new NormalCompletion(ref);
}

// ES6 Section 12.3.4.1: Function Calls - Runtime Semantics: Evaluation

function evalCall(ctx: ExecutionContext, node: ASTNode): Completion<JSValue | Reference> {
    // A basic, incomplete implementation. Need to go through this and expand it to cover all
    // steps given in the spec. For example we don't set the this value correctly.
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

// ES6 Section 12.3.4.3: Function Call - Runtime Semantics:
// EvaluateDirectCall (func, thisValue, arguments, tailPosition)

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

// ES6 Section 12.3.6.1: Argument Lists - Runtime Semantics: ArgumentListEvaluation

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

// ES6 Section 12.6.3: Multiplicative Operators - Runtime Semantics: Evaluation

function evalMultiplicativeExpr(ctx: ExecutionContext, node: ASTNode): Completion<JSValue | Reference> {
    const leftNode = checkNodeNotNull(node.children[0]);
    const rightNode = checkNodeNotNull(node.children[1]);

    // 1. Let left be the result of evaluating MultiplicativeExpression.
    const leftComp = evalExpression(ctx,leftNode);

    // 2. Let leftValue be GetValue(left).
    // 3. ReturnIfAbrupt(leftValue).
    const leftValueComp = GetValue(ctx.realm,leftComp);

    // 4. Let right be the result of evaluating UnaryExpression.
    const rightComp = evalExpression(ctx,rightNode);

    // 5. Let rightValue be GetValue(right).
    const rightValueComp = GetValue(ctx.realm,rightComp);

    // 6. Let lnum be ToNumber(leftValue).
    // 7. ReturnIfAbrupt(lnum).
    const lnumComp = ToNumber(ctx.realm,leftValueComp);
    if (!(lnumComp instanceof NormalCompletion))
        return lnumComp;
    const lnum = lnumComp.value;

    // 8. Let rnum be ToNumber(rightValue).
    // 9. ReturnIfAbrupt(rnum).
    const rnumComp = ToNumber(ctx.realm,rightValueComp);
    if (!(rnumComp instanceof NormalCompletion))
        return rnumComp;
    const rnum = rnumComp.value;

    // 10. Return the result of applying the MultiplicativeOperator (*, /, or %) to lnum and rnum
    // as specified in 12.6.3.1, 12.6.3.2, or 12.6.3.3.
    let resultNum: number;
    if (node.kind === "Multiply")
        resultNum = pr_double_mul(lnum.numberValue,rnum.numberValue);
    else if (node.kind === "Divide")
        resultNum = pr_double_div(lnum.numberValue,rnum.numberValue);
    else
        resultNum = pr_double_mod(lnum.numberValue,rnum.numberValue);
    return new NormalCompletion(new JSNumber(resultNum));
}

// ES6 Section 12.7.3.1: The Addition operator ( + ) - Runtime Semantics: Evaluation

function evalAdd(ctx: ExecutionContext, node: ASTNode): Completion<JSValue | Reference> {
    const left = checkNodeNotNull(node.children[0]);
    const right = checkNodeNotNull(node.children[1]);

    // 1. Let lref be the result of evaluating AdditiveExpression.
    const lrefComp = evalExpression(ctx,left);

    // 2. Let lval be GetValue(lref).
    // 3. ReturnIfAbrupt(lval).
    const lvalComp = GetValue(ctx.realm,lrefComp);
    if (!(lvalComp instanceof NormalCompletion))
        return lvalComp;
    const lval = lvalComp.value;

    // 4. Let rref be the result of evaluating MultiplicativeExpression.
    const rrefComp = evalExpression(ctx,right);

    // 5. Let rval be GetValue(rref).
    // 6. ReturnIfAbrupt(rval).
    const rvalComp = GetValue(ctx.realm,rrefComp);
    if (!(rvalComp instanceof NormalCompletion))
        return rvalComp;
    const rval = rvalComp.value;

    // 7. Let lprim be ToPrimitive(lval).
    // 8. ReturnIfAbrupt(lprim).
    const lprimComp = ToPrimitive(ctx.realm,lval);
    if (!(lprimComp instanceof NormalCompletion))
        return lprimComp;
    const lprim = lprimComp.value;

    // 9. Let rprim be ToPrimitive(rval).
    // 10. ReturnIfAbrupt(rprim).
    const rprimComp = ToPrimitive(ctx.realm,rval);
    if (!(rprimComp instanceof NormalCompletion))
        return rprimComp;
    const rprim = rprimComp.value;

    // 11. If Type(lprim) is String or Type(rprim) is String, then
    if ((lprim instanceof JSString) || (rprim instanceof JSString)) {
        // a. Let lstr be ToString(lprim).
        // b. ReturnIfAbrupt(lstr).
        const lstrComp = ToString(ctx.realm,lprim);
        if (!(lstrComp instanceof NormalCompletion))
            return lstrComp;
        const lstr = lstrComp.value;

        // c. Let rstr be ToString(rprim).
        // d. ReturnIfAbrupt(rstr).
        const rstrComp = ToString(ctx.realm,rprim);
        if (!(rstrComp instanceof NormalCompletion))
            return rstrComp;
        const rstr = rstrComp.value;

        // e. Return the String that is the result of concatenating lstr and rstr.
        const resultStr = pr_string_concat(lstr.stringValue,rstr.stringValue);
        const result = new JSString(resultStr);
        return new NormalCompletion(result);
    }

    // 12. Let lnum be ToNumber(lprim).
    // 13. ReturnIfAbrupt(lnum).
    const lnumComp = ToNumber(ctx.realm,lprim);
    if (!(lnumComp instanceof NormalCompletion))
        return lnumComp;
    const lnum = lnumComp.value;

    // 14. Let rnum be ToNumber(rprim).
    // 15. ReturnIfAbrupt(rnum).
    const rnumComp = ToNumber(ctx.realm,rprim);
    if (!(rnumComp instanceof NormalCompletion))
        return rnumComp;
    const rnum = rnumComp.value;

    // 16. Return the result of applying the addition operation to lnum and rnum.
    const resultNum = pr_double_add(lnum.numberValue,rnum.numberValue);
    const result = new JSNumber(resultNum);
    return new NormalCompletion(result);
}

// ES6 Section 12.7.4.1: The Subtraction Operator ( - ) - Runtime Semantics: Evaluation

function evalSubtract(ctx: ExecutionContext, node: ASTNode): Completion<JSValue | Reference> {
    const left = checkNodeNotNull(node.children[0]);
    const right = checkNodeNotNull(node.children[1]);

    // 1. Let lref be the result of evaluating AdditiveExpression.
    const lrefComp = evalExpression(ctx,left);

    // 2. Let lval be GetValue(lref).
    // 3. ReturnIfAbrupt(lval).
    const lvalComp = GetValue(ctx.realm,lrefComp);
    if (!(lvalComp instanceof NormalCompletion))
        return lvalComp;
    const lval = lvalComp.value;

    // 4. Let rref be the result of evaluating MultiplicativeExpression.
    const rrefComp = evalExpression(ctx,right);

    // 5. Let rval be GetValue(rref).
    // 6. ReturnIfAbrupt(rval).
    const rvalComp = GetValue(ctx.realm,rrefComp);
    if (!(rvalComp instanceof NormalCompletion))
        return rvalComp;
    const rval = rvalComp.value;

    // 7. Let lnum be ToNumber(lval).
    // 8. ReturnIfAbrupt(lnum).
    const lnumComp = ToNumber(ctx.realm,lval);
    if (!(lnumComp instanceof NormalCompletion))
        return lnumComp;
    const lnum = lnumComp.value;

    // 9. Let rnum be ToNumber(rval).
    // 10. ReturnIfAbrupt(rnum).
    const rnumComp = ToNumber(ctx.realm,rval);
    if (!(rnumComp instanceof NormalCompletion))
        return rnumComp;
    const rnum = rnumComp.value;

    // 1. Return the result of applying the subtraction operation to lnum and rnum.
    const resultNum = pr_double_sub(lnum.numberValue,rnum.numberValue);
    const result = new JSNumber(resultNum);
    return new NormalCompletion(result);
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
        case "Add":
            return evalAdd(ctx,node);
        case "Subtract":
            return evalSubtract(ctx,node);
        case "Multiply":
        case "Divide":
        case "Modulo":
            return evalMultiplicativeExpr(ctx,node);
        case "MemberAccessIdent":
            return evalMemberAccessIdent(ctx,node);
        case "Call":
            return evalCall(ctx,node);
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

class ConsoleLogFunction extends JSObject {
    public get implementsCall(): boolean {
        return true;
    }
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        console.log("ConsoleLogFunction.__Call__ begin");
        const strings: string[] = [];
        for (const arg of args) {
            const strComp = ToString(realm,arg);
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
    const consoleObject = new JSObject(realm.intrinsics.ObjectPrototype);
    consoleObject.properties.put("log",new DataDescriptor({
        enumerable: true,
        configurable: true,
        writable: true,
        value: new ConsoleLogFunction(realm.intrinsics.FunctionPrototype)
    }));
    envRec.InitializeBinding("console",consoleObject);

    checkNode(node,"Module",1);
    const statements = checkListNode(node.children[0]);
    const resultComp = evalStatementList(ctx,statements);
    if (!(resultComp instanceof NormalCompletion)) {
        if (resultComp instanceof ThrowCompletion) {
            console.log("JS code threw exception");
            const strComp = ToString(realm,resultComp.exceptionValue);
            if (!(strComp instanceof NormalCompletion)) {
                console.log("toString() on exception object failed");
            }
            else {
                const str = strComp.value;
                console.log(str.stringValue);
            }
        }
        else {
            console.log("Got some other completion");
        }
    }
    console.log("Execution completed normally");
}
