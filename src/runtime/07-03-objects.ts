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

// ES6 Section 7.3: Operations on Objects

import {
    JSValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSString,
    JSObject,
    PropertyDescriptor,
    DataDescriptor,
    Completion,
    NormalCompletion,
    Realm,
} from "./datatypes";
import {
    ToObject,
} from "./07-01-conversion";
import {
    IsCallable,
} from "./07-02-testcompare";

// ES6 Section 7.3.1: Get (O, P)

export function Get(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<JSValue> {
    return O.__Get__(realm, P, O);
}

// ES6 Section 7.3.2: GetV (V, P)

export function GetV(realm: Realm, V: JSValue, P: JSPropertyKey): Completion<JSValue> {
    const OComp = ToObject(realm, V);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;
    return O.__Get__(realm, P, O);
}

// ES6 Section 7.3.3: Set (O, P, V, Throw)

export function Set(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue, Throw: boolean): Completion<boolean> {
    const successComp = O.__Set__(realm, P, V, O);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success && Throw)
        return realm.throwTypeError("Set " + JSON.stringify(P.stringRep) + " failed");
    return new NormalCompletion(success);
}

// ES6 Section 7.3.4: CreateDataProperty (O, P, V)

export function CreateDataProperty(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const newDesc = new DataDescriptor({
        value: V,
        writable: true,
        enumerable: true,
        configurable: true,
    });
    newDesc.enumerable = true;
    newDesc.configurable = true;
    return O.__DefineOwnProperty__(realm, P, newDesc);
}

// ES6 Section 7.3.5: CreateMethodProperty (O, P, V)

export function CreateMethodProperty(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    return O.__DefineOwnProperty__(realm, P, new DataDescriptor({
        value: V,
        writable: true,
        enumerable: false,
        configurable: true,
    }));
}

// ES6 Section 7.3.6: CreateDataPropertyOrThrow (O, P, V)

export function CreateDataPropertyOrThrow(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const successComp = CreateDataProperty(realm, O, P, V);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success)
        return realm.throwTypeError("CreateDataPropertyOrThrow " + JSON.stringify(P.stringRep) + " failed");
    return new NormalCompletion(success);
}

// ES6 Section 7.3.7: DefinePropertyOrThrow (O, P, desc)

export function DefinePropertyOrThrow(realm: Realm, O: JSObject, P: JSPropertyKey, desc: PropertyDescriptor): Completion<boolean> {
    const successComp = O.__DefineOwnProperty__(realm, P, desc);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success)
        return realm.throwTypeError("DefinePropertyOrThrow " + JSON.stringify(P.stringRep) + " failed");
    return new NormalCompletion(success);
}

// ES6 Section 7.3.8: DeletePropertyOrThrow (O, P)

export function DeletePropertyOrThrow(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const successComp = O.__Delete__(realm, P);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success)
        return realm.throwTypeError("DeletePropertyOrThrow " + JSON.stringify(P.stringRep) + " failed");
    return new NormalCompletion(success);
}

// ES6 Section 7.3.9: GetMethod (O, P)

export function GetMethod(realm: Realm, O: JSValue, P: JSPropertyKey): Completion<JSValue> {
    const funcComp = GetV(realm, O, P);
    if (!(funcComp instanceof NormalCompletion))
        return funcComp;
    const func = funcComp.value;
    if ((func instanceof JSUndefined) || (func instanceof JSNull))
        return new NormalCompletion(new JSUndefined());
    if (!IsCallable(realm, func))
        return realm.throwTypeError("GetMethod: " + JSON.stringify(P.stringRep) + " is not callable");
    return new NormalCompletion(func);
}

// ES6 Section 7.3.10: HasProperty (O, P)

export function HasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    return O.__HasProperty__(realm, P);
}

// ES6 Section 7.3.11: HasOwnProperty (O, P)

export function HasOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const descComp = O.__GetOwnProperty__(realm, P);
    if (!(descComp instanceof NormalCompletion))
        return descComp;
    const desc = descComp.value;
    if (desc instanceof JSUndefined)
        return new NormalCompletion(false);
    return new NormalCompletion(true);
}

// ES6 Section 7.3.12: Call(F, V, [argumentsList])

export function Call(realm: Realm, F: JSValue, V: JSValue, argumentList: JSValue[]): Completion<JSValue> {
    if (!(F instanceof JSObject) || !F.implementsCall)
        throw new Error("Object is not callable"); // FIXME: temp
    // if (!IsCallable(F))
        // return realm.throwTypeError();
    return F.__Call__(realm, V, argumentList);
}

// ES6 Section 7.3.13: Construct (F, [argumentsList], [newTarget])

export function Construct(realm: Realm, F: JSObject, argumentList: JSValue[], newTarget: JSObject): Completion<JSObject> {
    if (!F.implementsConstruct)
        throw new Error("Attempt to call Construct ot an object that is not a constructor");
    return F.__Construct__(realm, argumentList, newTarget);
}

// ES6 Section 7.3.14: SetIntegrityLevel (O, level)

export function SetIntegrityLevel(realm: Realm, O: JSObject, level: string): Completion<boolean> {
    throw new Error("SetIntegrityLevel not implemented");
}

// ES6 Section 7.3.15: TestIntegrityLevel (O, level)

export function TestIntegrityLevel(realm: Realm, O: JSObject, level: string): Completion<boolean> {
    throw new Error("TestIntegrityLevel not implemented");
}

// ES6 Section 7.3.16: CreateArrayFromList (elements)

export function CreateArrayFromList(realm: Realm, elements: JSValue[]): Completion<JSObject> {
    throw new Error("CreateArrayFromList not implemented");
}

// ES6 Section 7.3.17: CreateListFromArrayLike (obj [, elementTypes])

export function CreateListFromArrayLike(realm: Realm, obj: JSValue, elementTypes: any): Completion<JSValue[]> {
    throw new Error("CreateListFromArrayLike not implemented");
}

// ES6 Section 7.3.18: Invoke(O, P, [argumentsList])

export function Invoke(realm: Realm, O: JSObject, P: JSPropertyKey, argumentsList: JSValue[]): Completion<JSValue> {
    const funcComp = GetV(realm, O, P);
    if (!(funcComp instanceof NormalCompletion))
        return funcComp;
    const func = funcComp.value;
    return Call(realm, func, O, argumentsList);
}

// ES6 Section 7.3.19: OrdinaryHasInstance (C, O)

export function OrdinaryHasInstance(realm: Realm, C: any, O: JSObject): Completion<boolean> {
    throw new Error("OrdinaryHasInstance not implemented");
}

// ES6 Section 7.3.20: SpeciesConstructor (O, defaultConstructor)

export function SpeciesConstructor(realm: Realm, O: JSObject, defaultConstructor: any): Completion<JSObject> {
    throw new Error("SpeciesConstructor not implemented");
}

// ES6 Section 7.3.21: EnumerableOwnNames (O)

export function EnumerableOwnNames(realm: Realm, O: JSObject): Completion<JSString[]> {
    throw new Error("EnumerableOwnNames not implemented");
}

// ES6 Section 7.3.22: GetFunctionRealm (obj)

export function GetFunctionRealm(realm: Realm, obj: JSObject): Completion<Realm> {
    throw new Error("GetFunctionRealm not implemented");
}
