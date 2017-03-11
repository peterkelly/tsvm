// Copyright 2016-2017 Peter Kelly <peter@pmkelly.net>
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

// ES6 Chapter 9: Ordinary and Exotic Objects Behaviours

import {
    UnknownType,
    // GenericMap,
    // ValueType,
    JSValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    PropertyDescriptor,
    DataDescriptor,
    AccessorDescriptor,
    Completion,
    NormalCompletion,
    LexicalEnvironment,
    EnvironmentRecord,
    Realm,
} from "./datatypes";
import {
    ExecutionContext,
} from "./08-03-context";
import {
    ASTNode,
} from "../parser/ast";
import {
    SameValue,
} from "./07-02-testcompare";
import {
    Call,
    CreateDataProperty,
} from "./07-03-objects";

// ES6 Section 9.3: Built-in Function Objects

// FIXME

// ES6 Section 9.4: Built-in Exotic Object Internal Methods and Slots

// ES6 Section 9.4.1: Bound Function Exotic Objects

class JSBoundFunctionObject extends JSObject {
    public _type_JSBoundFunctionObject: any;

    public boundFunctionObject: JSObject;
    public boundThis: JSValue;
    public boundArguments: JSValue[];

    public constructor(realm: Realm, boundFunctionObject: JSObject, boundThis: JSValue,
                       boundArguments: JSValue[]) {
        super();
        if (this.boundFunctionObject === this)
            throw new Error("Function bound to itself");
        this.boundFunctionObject = boundFunctionObject;
        this.boundThis = boundThis;
        this.boundArguments = boundArguments;
    }

    public get implementsCall(): boolean {
        return this.boundFunctionObject.implementsCall;
    }

    public get implementsConstruct(): boolean {
        return this.boundFunctionObject.implementsConstruct;
    }

    // ES6 Section 9.4.1.1: [[Call]] (thisArgument, argumentsList)

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("JSBoundFunctionObject.__Call__ not implemented");
    }

    // ES6 Section 9.4.1.2: [[Construct]] (argumentsList, newTarget)

    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        throw new Error("JSBoundFunctionObject.__Construct__ not implemented");
    }
}

// ES6 Section 9.4.1.3: BoundFunctionCreate (targetFunction, boundThis, boundArgs)

export function BoundFunctionCreate(realm: Realm, targetFunction: JSObject, boundThis: JSValue, boundArgs: JSValue[]): Completion<UnknownType> {
    throw new Error("BoundFunctionCreate not implemented");
}

// ES6 Section 9.4.2: Array Exotic Objects

export class ArrayExoticObject extends JSObject {
    public _type_ArrayExoticObject: any;
}

// ES6 Section 9.4.2.1: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.2.2: ArrayCreate(length, proto)

export function ArrayCreate(realm: Realm, length: any, proto: any): Completion<UnknownType> {
    throw new Error("ArrayCreate not implemented");
}

// ES6 Section 9.4.2.3: ArraySpeciesCreate(originalArray, length)

export function ArraySpeciesCreate(realm: Realm, originalArray: any, length: any): Completion<UnknownType> {
    throw new Error("ArraySpeciesCreate not implemented");
}

// ES6 Section 9.4.2.4: ArraySetLength(A, Desc)

export function ArraySetLength(realm: Realm, A: any, Desc: any): Completion<UnknownType> {
    throw new Error("ArraySetLength not implemented");
}

// ES6 Section 9.4.3: String Exotic Objects

export class StringExoticObject extends JSObject {
    public _type_StringExoticObject: any;
}

// ES6 Section 9.4.3.1: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.3.1.1: StringGetIndexProperty (S, P)

export function StringGetIndexProperty(realm: Realm, S: any, P: any): Completion<UnknownType> {
    throw new Error("StringGetIndexProperty not implemented");
}

// ES6 Section 9.4.3.2: [[HasProperty]] (P)

// TODO

// ES6 Section 9.4.3.3: [[OwnPropertyKeys]] ()

// TODO

// ES6 Section 9.4.3.4: StringCreate (value, prototype)

export function StringCreate(realm: Realm, value: any, prototype: any): Completion<UnknownType> {
    throw new Error("StringCreate not implemented");
}

// ES6 Section 9.4.4: Arguments Exotic Objects

export class ArgumentsExoticObject extends JSObject {
    public _type_ArgumentsExoticObject: any;
    public parameterMap: any = null;
}

// ES6 Section 9.4.4.1: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.4.2: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.4.3: [[Get]] (P, Receiver)

// TODO

// ES6 Section 9.4.4.4: [[Set]] (P, V, Receiver)

// TODO

// ES6 Section 9.4.4.5: [[Delete]] (P)

// TODO

// ES6 Section 9.4.4.6: CreateUnmappedArgumentsObject (argumentsList)

export function CreateUnmappedArgumentsObject(realm: Realm, argumentsList: any): Completion<UnknownType> {
    throw new Error("CreateUnmappedArgumentsObject not implemented");
}

// ES6 Section 9.4.4.7: CreateMappedArgumentsObject (func, formals, argumentsList, env)

export function CreateMappedArgumentsObject(realm: Realm, func: any, formals: any, argumentsList: any, env: any): Completion<UnknownType> {
    throw new Error("CreateMappedArgumentsObject not implemented");
}

// ES6 Section 9.4.4.7.1: MakeArgGetter (name, env)

export function MakeArgGetter(realm: Realm, name: string, env: EnvironmentRecord): Completion<JSValue> {
    const intrinsics = realm.intrinsics;
    if (intrinsics === undefined)
        throw new Error("intrinsics is undefined"); // FIXME: temp: we'll remove undefiend from the type of intrinsics soon
    const fun = new ArgGetterFunction(realm,intrinsics.FunctionPrototype,name,env);
    return new NormalCompletion(fun);
}

class ArgGetterFunction extends JSObject {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, proto: JSObject | JSNull, name: string, env: EnvironmentRecord) {
        super(proto);
        this.name = name;
        this.env = env;
    }

    public get implementsCall(): boolean {
        return true;
    }

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        return this.env.GetBindingValue(this.name,false);
    }
}

// ES6 Section 9.4.4.7.2: MakeArgSetter (name, env)

export function MakeArgSetter(realm: Realm, name: string, env: EnvironmentRecord): Completion<JSValue> {
    const intrinsics = realm.intrinsics;
    if (intrinsics === undefined)
        throw new Error("intrinsics is undefined"); // FIXME: temp: we'll remove undefiend from the type of intrinsics soon
    const fun = new ArgSetterFunction(realm,intrinsics.FunctionPrototype,name,env);
    return new NormalCompletion(fun);
}

class ArgSetterFunction extends JSObject {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, proto: JSObject | JSNull, name: string, env: EnvironmentRecord) {
        super(proto);
        this.name = name;
        this.env = env;
    }

    public get implementsCall(): boolean {
        return true;
    }

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        const value = (args.length > 0) ? args[0] : new JSUndefined();
        this.env.SetMutableBinding(this.name,value,false);
        return new NormalCompletion(new JSUndefined());
    }
}

// ES6 Section 9.4.5: Integer Indexed Exotic Objects

export class IntegerInexedExoticObject extends JSObject {
    public _type_IntegerInexedExoticObject: any;
}

// ES6 Section 9.4.5.1: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.5.2: [[HasProperty]] (P)

// TODO

// ES6 Section 9.4.5.3: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.5.4: [[Get]] (P, Receiver)

// TODO

// ES6 Section 9.4.5.5: [[Set]] (P, V, Receiver)

// TODO

// ES6 Section 9.4.5.6: [[OwnPropertyKeys]] ()

// TODO

// ES6 Section 9.4.5.7: IntegerIndexedObjectCreate (prototype, internalSlotsList)

export function IntegerIndexedObjectCreate(realm: Realm, prototype: any, internalSlotsList: any): Completion<UnknownType> {
    throw new Error("IntegerIndexedObjectCreate not implemented");
}

// ES6 Section 9.4.5.8: IntegerIndexedElementGet (O, index)

export function IntegerIndexedElementGet(realm: Realm, O: any, index: any): Completion<UnknownType> {
    throw new Error("IntegerIndexedElementGet not implemented");
}

// ES6 Section 9.4.5.9: IntegerIndexedElementSet (O, index, value)

export function IntegerIndexedElementSet(realm: Realm, O: any, index: any, value: any): Completion<UnknownType> {
    throw new Error("IntegerIndexedElementGet not implemented");
}

// ES6 Section 9.4.6: Module Namespace Exotic Objects

export class ModuleNamespaceExoticObject extends JSObject {
    public _type_ModuleNamespaceExoticObject: any;
}

// ES6 Section 9.4.6.1: [[GetPrototypeOf]] ()

// TODO

// ES6 Section 9.4.6.2: [[SetPrototypeOf]] (V)

// TODO

// ES6 Section 9.4.6.3: [[IsExtensible]] ()

// TODO

// ES6 Section 9.4.6.4: [[PreventExtensions]] ()

// TODO

// ES6 Section 9.4.6.5: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.6.6: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.6.7: [[HasProperty]] (P)

// TODO

// ES6 Section 9.4.6.8: [[Get]] (P, Receiver)

// TODO

// ES6 Section 9.4.6.9: [[Set]] (P, V, Receiver)

// TODO

// ES6 Section 9.4.6.10: [[Delete]] (P)

// TODO

// ES6 Section 9.4.6.11: [[Enumerate]] ()

// TODO

// ES6 Section 9.4.6.12: [[OwnPropertyKeys]] ()

// TODO

// ES6 Section 9.4.6.13: ModuleNamespaceCreate (module, exports)

export function ModuleNamespaceCreate(realm: Realm, module: any, exports: any): Completion<UnknownType> {
    throw new Error("ModuleNamespaceCreate not implemented");
}

// ES6 Section 9.5: Proxy Object Internal Methods and Internal Slots

// TODO
