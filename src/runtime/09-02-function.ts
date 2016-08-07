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
    PropertyMap,
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
    ObjectOperations,
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
    LexicalEnvironment,
    EnvironmentRecord,
    Realm,
} from "./datatypes";
import {
    ExecutionContext,
} from "./08-03-context";
import {
    ASTNode
} from "../parser/ast";

// ES6 Section 9.2: ECMAScript Function Objects

export class JSFunctionObject extends JSObject {

    public get implementsCall(): boolean {
        return true;
    }

    public get implementsConstruct(): boolean {
        return true;
    }

    // ES6 Section 9.2.1: [[Call]] (thisArgument, argumentsList)

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("JSFunctionObject.__Call__ not implemented");
    }

    // ES6 Section 9.2.2: [[Construct]] (argumentsList, newTarget)

    public __Construct__(realm: Realm, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
        throw new Error("JSFunctionObject.__Construct__ not implemented");
    }

}

// ES6 Section 9.2.1.1: PrepareForOrdinaryCall (F, newTarget)

export function PrepareForOrdinaryCall(
    ctx: ExecutionContext,
    F: JSFunctionObject,
    newTarget: JSObject | JSUndefined
): Completion<ExecutionContext> {
    throw new Error("PrepareForOrdinaryCall not implemented");
}

// ES6 Section 9.2.1.2: OrdinaryCallBindThis (F, calleeContext, thisArgument)

export function OrdinaryCallBindThis(
    realm: Realm,
    F: JSFunctionObject,
    calleeContext: ExecutionContext,
    thisArgument: JSValue
): Completion<JSValue> {
    throw new Error("OrdinaryCallBindThis not implemented");
}

// ES6 Section 9.2.1.3: OrdinaryCallEvaluateBody (F, argumentsList)

export function OrdinaryCallEvaluateBody(F: JSFunctionObject, argumentsList: JSValue[]): Completion<JSValue> {
    throw new Error("OrdinaryCallEvaluateBody not implemented");
}

// ES6 Section 9.2.3: FunctionAllocate (functionPrototype, strict [,functionKind])

export enum AllocateKind {
    Normal,
    NonConstructor,
    Generator,
}

export function FunctionAllocate(functionPrototype: JSObject, strict: boolean, functionKind: AllocateKind): Completion<JSFunctionObject> {
    throw new Error("FunctionAllocate not implemented");
}

// ES6 Section 9.2.4: FunctionInitialize (F, kind, ParameterList, Body, Scope)

export enum InitializeKind {
    Normal,
    Method,
    Arrow
}

export function FunctionInitialize(
    F: JSFunctionObject,
    kind: InitializeKind,
    ParameterList: ASTNode,
    Body: ASTNode,
    Scope: LexicalEnvironment
): Completion<JSFunctionObject> {
    throw new Error("FunctionInitialize not implemented");
}

// ES6 Section 9.2.5: FunctionCreate (kind, ParameterList, Body, Scope, Strict, prototype)

export function FunctionCreate(
    kind: InitializeKind,
    ParameterList: ASTNode,
    Body: ASTNode,
    Scope: LexicalEnvironment,
    Strict: boolean,
    prototype: JSObject
): Completion<JSFunctionObject> {
    throw new Error("FunctionCreate not implemented");
}
