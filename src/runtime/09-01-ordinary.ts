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

// ES6 Section 9.1: Ordinary Object Internal Methods and Internal Slots

// ES6 Section 9.1.1: [[GetPrototypeOf]] ()

function JSObject_GetPrototypeOf(realm: Realm, O: JSObject): Completion<JSObject | JSNull> {
    return new NormalCompletion(O.__prototype__);
}

// ES6 Section 9.1.2: [[SetPrototypeOf]] (V)

function JSObject_SetPrototypeOf(realm: Realm, O: JSObject, V: JSObject | JSNull): Completion<boolean> {
    const extensible = O.__extensible__;
    const current = O.__prototype__;
    if (SameValue(V,current))
        return new NormalCompletion(true);
    if (!extensible)
        return new NormalCompletion(false);
    let p = V;
    let done = false;
    while (!done) {
        if (p instanceof JSNull)
            done = true;
        else if (SameValue(p,O))
            return new NormalCompletion(false);
        else if (p.overridesGetPrototypeOf)
            done = true;
        else
            p = p.__prototype__;
    }
    O.__prototype__ = V;
    return new NormalCompletion(true);
}

// ES6 Section 9.1.3: [[IsExtensible]] ()

function JSObject_IsExtensible(realm: Realm, O: JSObject): Completion<boolean> {
    return new NormalCompletion(O.__extensible__);
}

// ES6 Section 9.1.4: [[PreventExtensions]] ()

function JSObject_PreventExtensions(realm: Realm, O: JSObject): Completion<boolean> {
    O.__extensible__ = false;
    return new NormalCompletion(true);
}

// ES6 Section 9.1.5: [[GetOwnProperty]] (P)

function JSObject_GetOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor> {
    if (copy === undefined)
        copy = true;
    return new NormalCompletion(OrdinaryGetOwnProperty(realm,O,P,copy));
}

// ES6 Section 9.1.5.1: OrdinaryGetOwnProperty (O, P)

export function OrdinaryGetOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey, copy: boolean = true): JSUndefined | PropertyDescriptor {
    // I'm not sure why this needs to make a copy of the property; perhaps there are some cases
    // where we can avoid doing so.
    const stringKey = P.stringRep;
    const X = O.properties.get(stringKey);
    if (X === undefined)
        return new JSUndefined();
    if (!copy)
        return X;
    if (X instanceof DataDescriptor) {
        const D = new DataDescriptor({
            enumerable: X.enumerable,
            configurable: X.configurable,
            value: X.value,
            writable: X.writable
        });
        return D;
    }
    else {
        const D = new AccessorDescriptor({
            enumerable: X.enumerable,
            configurable: X.configurable,
            __get__: X.__get__,
            __set__: X.__set__,
        });
        return D;
    }
}

// ES6 Section 9.1.6: [[DefineOwnProperty]] (P, Desc)

function JSObject_DefineOwnProperty(realm: Realm, O: JSObject, propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean> {
    throw new Error("JSObject.__DefineOwnProperty__ not implemented");
}

// ES6 Section 9.1.6.1: OrdinaryDefineOwnProperty (O, P, Desc)

export function OrdinaryDefineOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey, Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("OrdinaryDefineOwnProperty Not implemented");
}

// ES6 Section 9.1.6.2: IsCompatiblePropertyDescriptor (Extensible, Desc, Current)

export function IsCompatiblePropertyDescriptor(realm: Realm, Extensible: boolean, Desc: PropertyDescriptor, Current: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("IsCompatiblePropertyDescriptor Not implemented");
}

// ES6 Section 9.1.6.3: ValidateAndApplyPropertyDescriptor (O, P, extensible, Desc, current)

export function ValidateAndApplyPropertyDescriptor(
    realm: Realm,
    O: JSObject,
    P: JSPropertyKey,
    extensible: boolean,
    Desc: PropertyDescriptor,
    current: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("ValidateAndApplyPropertyDescriptor Not implemented");
}

// ES6 Section 9.1.7: [[HasProperty]] (P)

function JSObject_HasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    return OrdinaryHasProperty(realm,O,P);
}

// ES6 Section 9.1.7.1: OrdinaryHasProperty (O, P)

export function OrdinaryHasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const hasOwn = OrdinaryGetOwnProperty(realm,O,P);
    if (!(hasOwn instanceof JSUndefined))
        return new NormalCompletion(true);
    const parentComp = O.__GetPrototypeOf__(realm);
    if (!(parentComp instanceof NormalCompletion))
        return parentComp;
    const parent = parentComp.value;
    if (!(parent instanceof JSNull))
        return parent.__HasProperty__(realm,P);
    return new NormalCompletion(false);
}

// ES6 Section 9.1.8: [[Get]] (P, Receiver)

function JSObject_Get(realm: Realm, O: JSObject, P: JSPropertyKey, Receiver: JSValue): Completion<JSValue> {
    const descComp = O.__GetOwnProperty__(realm,P,false);
    if (!(descComp instanceof NormalCompletion))
        return descComp;
    const desc = descComp.value;
    if (desc instanceof JSUndefined) {
        const parentComp = O.__GetPrototypeOf__(realm);
        if (!(parentComp instanceof NormalCompletion))
            return parentComp;
        const parent = parentComp.value;
        if (parent instanceof JSNull)
            return new NormalCompletion(new JSUndefined());
        return parent.__Get__(realm,P,Receiver);
    }
    else if (desc instanceof DataDescriptor) {
        return new NormalCompletion(desc.value);
    }
    else {
        const getter = desc.__get__;
        if (getter instanceof JSUndefined)
            return new NormalCompletion(new JSUndefined());
        return Call(realm,getter,Receiver,[]);
    }
}

// ES6 Section 9.1.9: [[Set]] (P, V, Receiver)

function JSObject_Set(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean> {
    const ownDescComp = O.__GetOwnProperty__(realm,P,false);
    if (!(ownDescComp instanceof NormalCompletion))
        return ownDescComp;
    let ownDesc = ownDescComp.value;
    if (ownDesc instanceof JSUndefined) {
        const parentComp = O.__GetPrototypeOf__(realm);
        if (!(parentComp instanceof NormalCompletion))
            return parentComp;
        const parent = parentComp.value;
        if (!(parent instanceof JSNull)) {
            return parent.__Set__(realm,P,V,Receiver);
        }
        else {
            ownDesc = new DataDescriptor({
                enumerable: true,
                configurable: true,
                value: new JSUndefined(),
                writable: true
            });
        }
    }

    if (ownDesc instanceof DataDescriptor) {
        if (!ownDesc.writable)
            return new NormalCompletion(false);
        if (!(Receiver instanceof JSObject))
            return new NormalCompletion(false);
        const existingDescriptorComp = Receiver.__GetOwnProperty__(realm,P);
        if (!(existingDescriptorComp instanceof NormalCompletion))
            return existingDescriptorComp;
        const existingDescriptor = existingDescriptorComp.value;
        if (!(existingDescriptor instanceof JSUndefined)) {
            if (existingDescriptor instanceof AccessorDescriptor)
                return new NormalCompletion(false);
            if (!(existingDescriptor.writable))
                return new NormalCompletion(false);
            const valueDesc = new DataDescriptor({value: V, writable: true });
            return Receiver.__DefineOwnProperty__(realm,P,valueDesc);
        }
        else {
            return CreateDataProperty(realm,Receiver,P,V);
        }
    }
    else {
        const setter = ownDesc.__set__;
        if (setter instanceof JSUndefined)
            return new NormalCompletion(false);
        const setterResultComp = Call(realm,setter,Receiver,[V]);
        if (!(setterResultComp instanceof NormalCompletion))
            return setterResultComp;
        return new NormalCompletion(true);
    }
}

// ES6 Section 9.1.10: [[Delete]] (P)

function JSObject_Delete(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const descComp = O.__GetOwnProperty__(realm,P);
    if (!(descComp instanceof NormalCompletion))
        return descComp;
    const desc = descComp.value;
    if (desc instanceof JSUndefined)
        return new NormalCompletion(true);
    if (desc.configurable) {
        O.properties.remove(P.stringRep);
        return new NormalCompletion(true);
    }
    return new NormalCompletion(false);
}

// ES6 Section 9.1.11: [[Enumerate]] ()

function JSObject_Enumerate(realm: Realm, O: JSObject): Completion<JSObject> {
    throw new Error("JSObject.__Enumerate__ not implemented");
}

// ES6 Section 9.1.12: [[OwnPropertyKeys]] ()

function JSObject_OwnPropertyKeys(realm: Realm, O: JSObject): Completion<JSPropertyKey[]> {
    throw new Error("JSObject.__OwnPropertyKeys__ not implemented");
}

// ES6 Section 9.1.13: ObjectCreate(proto, internalSlotsList)

export function ObjectCreate(realm: Realm, proto: JSObject | JSNull/*, internalSlotsList: string[]*/): JSObject {
    const obj = new JSObject();
    obj.__prototype__ = proto;
    obj.__extensible__ = true; // not really necessary; JSObjects are extensible by default
    return obj;
}

// ES6 Section 9.1.14: OrdinaryCreateFromConstructor (constructor, intrinsicDefaultProto, internalSlotsList)

export function OrdinaryCreateFromConstructor(realm: Realm, constructor: any, intrinsicDefaultProto: any, internalSlotsList: any): Completion<UnknownType> {
    throw new Error("OrdinaryCreateFromConstructor Not implemented");
}

// ES6 Section 9.1.15: GetPrototypeFromConstructor (constructor, intrinsicDefaultProto)

export function GetPrototypeFromConstructor(realm: Realm, constructor: any, intrinsicDefaultProto: any): Completion<UnknownType> {
    throw new Error("GetPrototypeFromConstructor Not implemented");
}

// Call/Create - not present for ordinary objects

function JSObject_Call(realm: Realm, O: JSObject, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    throw new Error("Not a callable object; check implementsCall first");
}

function JSObject_Construct(realm: Realm, O: JSObject, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
    throw new Error("Not a constructor object; check implementsConstruct first");
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
