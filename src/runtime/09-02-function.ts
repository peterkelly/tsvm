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
    JSObject,
    Completion,
    LexicalEnvironment,
    Realm,
} from "./datatypes";
import {
    ExecutionContext,
} from "./08-03-context";
import {
    ASTNode
} from "../parser/ast";

// ES6 Section 9.2: ECMAScript Function Objects

export enum FunctionKind {
    Normal,
    ClassConstructor,
    Generator,
}

export enum ConstructorKind {
    Base,
    Derived,
}

export enum ThisMode {
    Lexical,
    Strict,
    Global,
}

export class JSFunction extends JSObject {
    _nominal_type_JSFunction: any;
    // FIXME: The types of most of these properties should not include undefined; but they have
    // not be initialized properly by the constructor
    public environment: LexicalEnvironment | undefined = undefined;
    public formalParameters: ASTNode | undefined = undefined;
    public functionKind: FunctionKind;
    public ecmaScriptCode: ASTNode | undefined = undefined;
    public constructorKind: ConstructorKind;
    public realm: Realm | undefined = undefined;
    public thisMode: ThisMode;
    public strict: boolean | undefined = undefined;
    public homeObject: JSObject | undefined = undefined;

    public constructor(options: {
        functionKind: FunctionKind,
        constructorKind: ConstructorKind,
        thisMode: ThisMode,
        realm: Realm,
    }) {
        super();
        this.environment = undefined;
        this.formalParameters = undefined;
        this.functionKind = options.functionKind;
        this.ecmaScriptCode = undefined;
        this.constructorKind = options.constructorKind;
        this.realm = options.realm;
        this.thisMode = options.thisMode;
        this.strict = undefined;
        this.homeObject = undefined;
    }

    public get implementsCall(): boolean {
        return true;
    }

    public get implementsConstruct(): boolean {
        return true;
    }

    // ES6 Section 9.2.1: [[Call]] (thisArgument, argumentsList)

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("JSFunction.__Call__ not implemented");
    }

    // ES6 Section 9.2.2: [[Construct]] (argumentsList, newTarget)

    public __Construct__(realm: Realm, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
        throw new Error("JSFunction.__Construct__ not implemented");
    }
}

// ES6 Section 9.2.1.1: PrepareForOrdinaryCall (F, newTarget)

export function PrepareForOrdinaryCall(
    ctx: ExecutionContext,
    F: JSFunction,
    newTarget: JSObject | JSUndefined
): Completion<ExecutionContext> {
    throw new Error("PrepareForOrdinaryCall not implemented");
}

// ES6 Section 9.2.1.2: OrdinaryCallBindThis (F, calleeContext, thisArgument)

export function OrdinaryCallBindThis(
    realm: Realm,
    F: JSFunction,
    calleeContext: ExecutionContext,
    thisArgument: JSValue
): Completion<JSValue> {
    throw new Error("OrdinaryCallBindThis not implemented");
}

// ES6 Section 9.2.1.3: OrdinaryCallEvaluateBody (F, argumentsList)

export function OrdinaryCallEvaluateBody(F: JSFunction, argumentsList: JSValue[]): Completion<JSValue> {
    throw new Error("OrdinaryCallEvaluateBody not implemented");
}

// ES6 Section 9.2.3: FunctionAllocate (functionPrototype, strict [,functionKind])

export enum AllocateKind {
    Normal,
    NonConstructor,
    Generator,
}

export function FunctionAllocate(functionPrototype: JSObject, strict: boolean, functionKind: AllocateKind): Completion<JSFunction> {
    throw new Error("FunctionAllocate not implemented");
}

// ES6 Section 9.2.4: FunctionInitialize (F, kind, ParameterList, Body, Scope)

export enum InitializeKind {
    Normal,
    Method,
    Arrow
}

export function FunctionInitialize(
    F: JSFunction,
    kind: InitializeKind,
    ParameterList: ASTNode,
    Body: ASTNode,
    Scope: LexicalEnvironment
): Completion<JSFunction> {
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
): Completion<JSFunction> {
    throw new Error("FunctionCreate not implemented");
}

// ES6 Section 9.2.6: GeneratorFunctionCreate (kind, ParameterList, Body, Scope, Strict)

export function GeneratorFunctionCreate(
    kind: "normal" | "method",
    ParameterList: ASTNode,
    Body: ASTNode,
    Scope: LexicalEnvironment,
    Strict: boolean
): Completion<JSFunction> {
    throw new Error("GeneratorFunctionCreate not implemented");
}

// ES6 Section 9.2.7: AddRestrictedFunctionProperties (F, realm)

export function AddRestrictedFunctionProperties(F: JSFunction, realm: Realm): Completion<void> {
    throw new Error("AddRestrictedFunctionProperties not implemented");
}

// ES6 Section 9.2.7.1: %ThrowTypeError% ( )

// Implemented as part of Intrinsics

// ES6 Section 9.2.8: MakeConstructor (F, writablePrototype, prototype)

export function MakeConstructor(F: JSFunction, writablePrototype?: boolean, prototype?: JSObject): Completion<void> {
    throw new Error("MakeConstructor not implemented");
}

// ES6 Section 9.2.9: MakeClassConstructor (F)

export function MakeClassConstructor(F: JSFunction): Completion<void> {
    throw new Error("MakeClassConstructor not implemented");
}

// ES6 Section 9.2.10: MakeMethod (F, homeObject)

export function MakeMethod(F: JSFunction, homeObject: JSObject): Completion<void> {
    throw new Error("MakeMethod not implemented");
}

// ES6 Section 9.2.11: SetFunctionName (F, name, prefix)

export function SetFunctionName(F: JSObject, name: JSPropertyKey, prefix?: string): Completion<boolean> {
    throw new Error("SetFunctionName not implemented");
}

// ES6 Section 9.2.12: FunctionDeclarationInstantiation (func, argumentsList)

export function FunctionDeclarationInstantiation(func: JSFunction, argumentsList: JSValue[]): Completion<void> {
    throw new Error("FunctionDeclarationInstantiation not implemented");
}
