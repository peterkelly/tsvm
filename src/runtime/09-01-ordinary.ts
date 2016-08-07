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

export class JSOrdinaryObjectOperations {

    // ES6 Section 9.1.1: [[GetPrototypeOf]] ()

    public __GetPrototypeOf__(obj: JSObject): Completion<JSObject | JSNull> {
        return new NormalCompletion(obj.__prototype__);
    }

    // ES6 Section 9.1.2: [[SetPrototypeOf]] (V)

    public __SetPrototypeOf__(obj: JSObject, V: JSObject | JSNull): Completion<boolean> {
        const extensible = obj.__extensible__;
        const current = obj.__prototype__;
        if (SameValue(V,current))
            return new NormalCompletion(true);
        if (!extensible)
            return new NormalCompletion(false);
        let p = V;
        let done = false;
        while (!done) {
            if (p instanceof JSNull)
                done = true;
            else if (SameValue(p,obj))
                return new NormalCompletion(false);
            else if (p.overridesGetPrototypeOf)
                done = true;
            else
                p = p.__prototype__;
        }
        obj.__prototype__ = V;
        return new NormalCompletion(true);
    }

    // ES6 Section 9.1.3: [[IsExtensible]] ()

    public __IsExtensible__(obj: JSObject): Completion<boolean> {
        return new NormalCompletion(obj.__extensible__);
    }

    // ES6 Section 9.1.4: [[PreventExtensions]] ()

    public __PreventExtensions__(obj: JSObject): Completion<boolean> {
        obj.__extensible__ = false;
        return new NormalCompletion(true);
    }

    // ES6 Section 9.1.5: [[GetOwnProperty]] (P)

    public __GetOwnProperty__(obj: JSObject, P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor> {
        if (copy === undefined)
            copy = true;
        return new NormalCompletion(OrdinaryGetOwnProperty(obj.realm,obj,P,copy));
    }

    // ES6 Section 9.1.6: [[DefineOwnProperty]] (P, Desc)

    public __DefineOwnProperty__(obj: JSObject, propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean> {
        throw new Error("JSObject.__DefineOwnProperty__ not implemented");
    }

    // ES6 Section 9.1.7: [[HasProperty]](P)

    public __HasProperty__(obj: JSObject, P: JSPropertyKey): Completion<boolean> {
        return OrdinaryHasProperty(obj.realm,obj,P);
    }

    // ES6 Section 9.1.8: [[Get]] (P, Receiver)

    public __Get__(obj: JSObject, P: JSPropertyKey, Receiver: JSValue): Completion<JSValue> {
        const descComp = obj.__GetOwnProperty__(P,false);
        if (!(descComp instanceof NormalCompletion))
            return descComp;
        const desc = descComp.value;
        if (desc instanceof JSUndefined) {
            const parentComp = obj.__GetPrototypeOf__();
            if (!(parentComp instanceof NormalCompletion))
                return parentComp;
            const parent = parentComp.value;
            if (parent instanceof JSNull)
                return new NormalCompletion(new JSUndefined());
            return parent.__Get__(P,Receiver);
        }
        else if (desc instanceof DataDescriptor) {
            return new NormalCompletion(desc.value);
        }
        else {
            const getter = desc.__get__;
            if (getter instanceof JSUndefined)
                return new NormalCompletion(new JSUndefined());
            return Call(obj.realm,getter,Receiver,[]);
        }
    }

    // ES6 Section 9.1.9: [[Set]] (P, V, Receiver)

    public __Set__(obj: JSObject, P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean> {
        const O = obj;
        const ownDescComp = O.__GetOwnProperty__(P,false);
        if (!(ownDescComp instanceof NormalCompletion))
            return ownDescComp;
        let ownDesc = ownDescComp.value;
        if (ownDesc instanceof JSUndefined) {
            const parentComp = O.__GetPrototypeOf__();
            if (!(parentComp instanceof NormalCompletion))
                return parentComp;
            const parent = parentComp.value;
            if (!(parent instanceof JSNull)) {
                return parent.__Set__(P,V,Receiver);
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
            const existingDescriptorComp = Receiver.__GetOwnProperty__(P);
            if (!(existingDescriptorComp instanceof NormalCompletion))
                return existingDescriptorComp;
            const existingDescriptor = existingDescriptorComp.value;
            if (!(existingDescriptor instanceof JSUndefined)) {
                if (existingDescriptor instanceof AccessorDescriptor)
                    return new NormalCompletion(false);
                if (!(existingDescriptor.writable))
                    return new NormalCompletion(false);
                const valueDesc = new DataDescriptor({value: V, writable: true });
                return Receiver.__DefineOwnProperty__(P,valueDesc);
            }
            else {
                return CreateDataProperty(obj.realm,Receiver,P,V);
            }
        }
        else {
            const setter = ownDesc.__set__;
            if (setter instanceof JSUndefined)
                return new NormalCompletion(false);
            const setterResultComp = Call(obj.realm,setter,Receiver,[V]);
            if (!(setterResultComp instanceof NormalCompletion))
                return setterResultComp;
            return new NormalCompletion(true);
        }
    }

    // ES6 Section 9.1.10: [[Delete]] (P)

    public __Delete__(obj: JSObject, P: JSPropertyKey): Completion<boolean> {
        const descComp = obj.__GetOwnProperty__(P);
        if (!(descComp instanceof NormalCompletion))
            return descComp;
        const desc = descComp.value;
        if (desc instanceof JSUndefined)
            return new NormalCompletion(true);
        if (desc.configurable) {
            obj.properties.remove(P.stringRep);
            return new NormalCompletion(true);
        }
        return new NormalCompletion(false);
    }

    // ES6 Section 9.1.11: [[Enumerate]] ()

    public __Enumerate__(obj: JSObject, ): Completion<JSObject> {
        throw new Error("JSObject.__Enumerate__ not implemented");
    }

    // ES6 Section 9.1.12: [[OwnPropertyKeys]] ()

    public __OwnPropertyKeys__(obj: JSObject): Completion<JSPropertyKey[]> {
        throw new Error("JSObject.__OwnPropertyKeys__ not implemented");
    }

    public __Call__(obj: JSObject, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Not a callable object; check implementsCall first");
    }
    public __Construct__(obj: JSObject, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
        throw new Error("Not a constructor object; check implementsConstruct first");
    }
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

// ES6 Section 9.1.7.1: OrdinaryHasProperty (O, P)

export function OrdinaryHasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const hasOwn = OrdinaryGetOwnProperty(realm,O,P);
    if (!(hasOwn instanceof JSUndefined))
        return new NormalCompletion(true);
    const parentComp = O.__GetPrototypeOf__();
    if (!(parentComp instanceof NormalCompletion))
        return parentComp;
    const parent = parentComp.value;
    if (!(parent instanceof JSNull))
        return parent.__HasProperty__(P);
    return new NormalCompletion(false);
}

// ES6 Section 9.1.13: ObjectCreate(proto, internalSlotsList)

export function ObjectCreate(realm: Realm, proto: JSObject | JSNull/*, internalSlotsList: string[]*/): JSObject {
    const obj = new JSObject(realm);
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
