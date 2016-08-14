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
    JSObject,
    Completion,
    LexicalEnvironment,
    Realm,
} from "./datatypes";
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
