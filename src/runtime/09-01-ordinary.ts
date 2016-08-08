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
    LexicalEnvironment,
    Realm,
    EnvironmentRecord,
    ValueType,
    JSValue,
    // JSPrimitiveValue,
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
    DataDescriptor,
    AccessorDescriptor,
    Intrinsics,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
} from "./datatypes";
// import {
//     ExecutionContext,
// } from "./08-03-context";
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

// ES6 Section 9.1: Ordinary Object Internal Methods and Internal Slots

// ES6 Section 9.1.1: [[GetPrototypeOf]] ()

function JSObject_GetPrototypeOf(realm: Realm, O: JSObject): Completion<JSObject | JSNull> {
    throw new Error("JSObject_GetPrototypeOf not implemented");
}

// ES6 Section 9.1.2: [[SetPrototypeOf]] (V)

function JSObject_SetPrototypeOf(realm: Realm, O: JSObject, V: JSObject | JSNull): Completion<boolean> {
    throw new Error("JSObject_SetPrototypeOf not implemented");
}

// ES6 Section 9.1.3: [[IsExtensible]] ()

function JSObject_IsExtensible(realm: Realm, O: JSObject): Completion<boolean> {
    throw new Error("JSObject_IsExtensible not implemented");
}

// ES6 Section 9.1.4: [[PreventExtensions]] ()

function JSObject_PreventExtensions(realm: Realm, O: JSObject): Completion<boolean> {
    throw new Error("JSObject_PreventExtensions not implemented");
}

// ES6 Section 9.1.5: [[GetOwnProperty]] (P)

function JSObject_GetOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor> {
    throw new Error("JSObject_GetOwnProperty not implemented");
}

// ES6 Section 9.1.5.1: OrdinaryGetOwnProperty (O, P)

export function OrdinaryGetOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey): JSUndefined | PropertyDescriptor {
    throw new Error("OrdinaryGetOwnProperty not implemented");
}

// ES6 Section 9.1.6: [[DefineOwnProperty]] (P, Desc)

function JSObject_DefineOwnProperty(realm: Realm, O: JSObject, propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean> {
    throw new Error("JSObject_DefineOwnProperty not implemented");
}

// ES6 Section 9.1.6.1: OrdinaryDefineOwnProperty (O, P, Desc)

export function OrdinaryDefineOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey, Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("OrdinaryDefineOwnProperty not implemented");
}

// ES6 Section 9.1.6.2: IsCompatiblePropertyDescriptor (Extensible, Desc, Current)

export function IsCompatiblePropertyDescriptor(realm: Realm, Extensible: boolean, Desc: PropertyDescriptor, Current: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("IsCompatiblePropertyDescriptor not implemented");
}

// ES6 Section 9.1.6.3: ValidateAndApplyPropertyDescriptor (O, P, extensible, Desc, current)

export function ValidateAndApplyPropertyDescriptor(
    realm: Realm,
    O: JSObject,
    P: JSPropertyKey,
    extensible: boolean,
    Desc: PropertyDescriptor,
    current: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("ValidateAndApplyPropertyDescriptor not implemented");
}

// ES6 Section 9.1.7: [[HasProperty]] (P)

function JSObject_HasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    throw new Error("JSObject_HasProperty not implemented");
}

// ES6 Section 9.1.7.1: OrdinaryHasProperty (O, P)

export function OrdinaryHasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    throw new Error("OrdinaryHasProperty not implemented");
}

// ES6 Section 9.1.8: [[Get]] (P, Receiver)

function JSObject_Get(realm: Realm, O: JSObject, P: JSPropertyKey, Receiver: JSValue): Completion<JSValue> {
    throw new Error("JSObject_Get not implemented");
}

// ES6 Section 9.1.9: [[Set]] (P, V, Receiver)

function JSObject_Set(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean> {
    throw new Error("JSObject_Set not implemented");
}

// ES6 Section 9.1.10: [[Delete]] (P)

function JSObject_Delete(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    throw new Error("JSObject_Delete not implemented");
}

// ES6 Section 9.1.11: [[Enumerate]] ()

function JSObject_Enumerate(realm: Realm, O: JSObject): Completion<JSObject> {
    throw new Error("JSObject_Enumerate not implemented");
}

// ES6 Section 9.1.12: [[OwnPropertyKeys]] ()

function JSObject_OwnPropertyKeys(realm: Realm, O: JSObject): Completion<JSPropertyKey[]> {
    throw new Error("JSObject_OwnPropertyKeys not implemented");
}

// ES6 Section 9.1.13: ObjectCreate(proto, internalSlotsList)

export function ObjectCreate(realm: Realm, proto: JSObject | JSNull): JSObject {
    throw new Error("ObjectCreate not implemented");
}

// ES6 Section 9.1.14: OrdinaryCreateFromConstructor (constructor, intrinsicDefaultProto, internalSlotsList)

export function OrdinaryCreateFromConstructor(realm: Realm, constructor: any, intrinsicDefaultProto: any, internalSlotsList: any): Completion<UnknownType> {
    throw new Error("OrdinaryCreateFromConstructor not implemented");
}

// ES6 Section 9.1.15: GetPrototypeFromConstructor (constructor, intrinsicDefaultProto)

export function GetPrototypeFromConstructor(realm: Realm, constructor: any, intrinsicDefaultProto: any): Completion<UnknownType> {
    throw new Error("GetPrototypeFromConstructor not implemented");
}

// Call/Create - not present for ordinary objects

function JSObject_Call(realm: Realm, O: JSObject, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    throw new Error("JSObject_Call not implemented");
}

function JSObject_Construct(realm: Realm, O: JSObject, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
    throw new Error("JSObject_Construct not implemented");
}

export const ordinaryObjectOperations: ObjectOperations = {
    __GetPrototypeOf__: JSObject_GetPrototypeOf,
    __SetPrototypeOf__: JSObject_SetPrototypeOf,
    __IsExtensible__: JSObject_IsExtensible,
    __PreventExtensions__: JSObject_PreventExtensions,
    __GetOwnProperty__: JSObject_GetOwnProperty,
    __HasProperty__: JSObject_HasProperty,
    __Get__: JSObject_Get,
    __Set__: JSObject_Set,
    __Delete__: JSObject_Delete,
    __DefineOwnProperty__: JSObject_DefineOwnProperty,
    __Enumerate__: JSObject_Enumerate,
    __OwnPropertyKeys__: JSObject_OwnPropertyKeys,
    __Call__: JSObject_Call,
    __Construct__: JSObject_Construct,
}
