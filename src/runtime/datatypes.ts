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
} from "./types";

// import {
//     LexicalEnvironment,
//     EnvironmentRecord,
//     Realm,
// } from "./context";
// import * as context from "./context";
import {
    ASTNode
} from "../parser/ast";
import {
    ToObject,
} from "./07-01-conversion";
import {
    SameValue,
    SameValueZero,
} from "./07-02-testcompare";
// import {
//     intrinsic_ThrowTypeError
// } from "./objects";
import {
    rt_double_abstractRelationalComparison,
    rt_double_strictEqualityComparison,
    rt_double_equalsExact,
    rt_double_isNaN,
    rt_double_isPositiveZero,
    rt_double_isNegativeZero,
    rt_double_isPositiveInfinity,
    rt_double_isNegativeInfinity,
    rt_double_isInteger,
    rt_double_to_string,
    rt_string_to_double,
    rt_string_lessThan,
} from "./runtime";
// import {
//     intrinsic_ThrowTypeError,
//     intrinsic_ThrowReferenceError,
// } from "./objects";

export class JSOrdinaryObject extends JSObject {

    // ES6 Section 6.1.7.2: Object Internal Methods and Internal Slots
    // ES6 Section 9.1: Ordinary Object Internal Methods and Internal Slots

    // ES6 Section 9.1.1: [[GetPrototypeOf]] ()

    public __GetPrototypeOf__(): Completion<JSObject | JSNull> {
        return new NormalCompletion(this.__prototype__);
    }

    // ES6 Section 9.1.2: [[SetPrototypeOf]] (V)

    public __SetPrototypeOf__(V: JSObject | JSNull): Completion<boolean> {
        const extensible = this.__extensible__;
        const current = this.__prototype__;
        if (SameValue(V,current))
            return new NormalCompletion(true);
        if (!extensible)
            return new NormalCompletion(false);
        let p = V;
        let done = false;
        while (!done) {
            if (p instanceof JSNull)
                done = true;
            else if (SameValue(p,this))
                return new NormalCompletion(false);
            else if (p.overridesGetPrototypeOf)
                done = true;
            else
                p = p.__prototype__;
        }
        this.__prototype__ = V;
        return new NormalCompletion(true);
    }

    // ES6 Section 9.1.3: [[IsExtensible]] ()

    public __IsExtensible__(): Completion<boolean> {
        return new NormalCompletion(this.__extensible__);
    }

    // ES6 Section 9.1.4: [[PreventExtensions]] ()

    public __PreventExtensions__(): Completion<boolean> {
        this.__extensible__ = false;
        return new NormalCompletion(true);
    }

    // ES6 Section 9.1.5: [[GetOwnProperty]] (P)

    public __GetOwnProperty__(P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor> {
        if (copy === undefined)
            copy = true;
        return new NormalCompletion(OrdinaryGetOwnProperty(this.realm,this,P,copy));
    }

    // ES6 Section 9.1.7: [[HasProperty]](P)

    public __HasProperty__(P: JSPropertyKey): Completion<boolean> {
        return OrdinaryHasProperty(this.realm,this,P);
    }

    // ES6 Section 9.1.8: [[Get]] (P, Receiver)

    public __Get__(P: JSPropertyKey, Receiver: JSValue): Completion<JSValue> {
        const descComp = this.__GetOwnProperty__(P,false);
        if (!(descComp instanceof NormalCompletion))
            return descComp;
        const desc = descComp.value;
        if (desc instanceof JSUndefined) {
            const parentComp = this.__GetPrototypeOf__();
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
            return Call(this.realm,getter,Receiver,[]);
        }
    }

    // ES6 Section 9.1.9: [[Set]] (P, V, Receiver)

    public __Set__(P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean> {
        const O = this;
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
                return CreateDataProperty(this.realm,Receiver,P,V);
            }
        }
        else {
            const setter = ownDesc.__set__;
            if (setter instanceof JSUndefined)
                return new NormalCompletion(false);
            const setterResultComp = Call(this.realm,setter,Receiver,[V]);
            if (!(setterResultComp instanceof NormalCompletion))
                return setterResultComp;
            return new NormalCompletion(true);
        }
    }

    // ES6 Section 9.1.10: [[Delete]] (P)

    public __Delete__(P: JSPropertyKey): Completion<boolean> {
        const descComp = this.__GetOwnProperty__(P);
        if (!(descComp instanceof NormalCompletion))
            return descComp;
        const desc = descComp.value;
        if (desc instanceof JSUndefined)
            return new NormalCompletion(true);
        if (desc.configurable) {
            delete this.properties[P.stringRep];
            return new NormalCompletion(true);
        }
        return new NormalCompletion(false);
    }

    // ES6 Section 9.1.6: [[DefineOwnProperty]] (P, Desc)

    public __DefineOwnProperty__(propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean> {
        throw new Error("JSObject.__DefineOwnProperty__ not implemented");
    }

    // ES6 Section 9.1.11: [[Enumerate]] ()

    public __Enumerate__(): Completion<JSObject> {
        throw new Error("JSObject.__Enumerate__ not implemented");
    }

    // ES6 Section 9.1.12: [[OwnPropertyKeys]] ()

    public __OwnPropertyKeys__(): Completion<JSPropertyKey[]> {
        throw new Error("JSObject.__OwnPropertyKeys__ not implemented");
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Not a callable object; check implementsCall first");
    }

    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        throw new Error("Not a constructor object; check implementsConstruct first");
    }
}

// ES6 Section 9.1.5.1: OrdinaryGetOwnProperty (O, P)

export function OrdinaryGetOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey, copy: boolean = true): JSUndefined | PropertyDescriptor {
    // I'm not sure why this needs to make a copy of the property; perhaps there are some cases
    // where we can avoid doing so.
    const stringKey = P.stringRep;
    if (!(stringKey in O.properties))
        return new JSUndefined();
    const X = O.properties[stringKey];
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

export function GetBase(realm: Realm, V: Reference): ReferenceBase {
    return V.base;
}

export function GetReferencedName(realm: Realm, V: Reference): JSPropertyKey {
    return V.name;
}

export function IsStrictReference(realm: Realm, V: Reference): boolean {
    return V.strict.booleanValue;
}

export function HasPrimitiveBase(realm: Realm, V: Reference): boolean {
    return ((V.base instanceof JSBoolean) ||
            (V.base instanceof JSString) ||
            (V.base instanceof JSSymbol) ||
            (V.base instanceof JSNumber));
}

export function IsPropertyReference(realm: Realm, V: Reference): boolean {
    return ((V.base instanceof JSObject) || HasPrimitiveBase(realm,V));
}

export function IsUnresolvableReference(realm: Realm, V: Reference): boolean {
    return (V.base instanceof JSUndefined);
}

export function IsSuperReference(realm: Realm, V: Reference): boolean {
    return (V instanceof SuperReference);
}

// ES6 Section 6.2.3.1: GetValue (V)

export function GetValue(realm: Realm, V: Reference): Completion<JSValue> {
    let base = GetBase(realm,V);
    if (base instanceof JSUndefined)
        throw new Error("FIXME: Should throw ReferenceError here, but can't import it");
    if ((base instanceof JSUndefined) ||
        (base instanceof JSObject) ||
        (base instanceof JSBoolean) ||
        (base instanceof JSPropertyKey) ||
        (base instanceof JSNumber)) {
        if (!(base instanceof JSObject)) {
            const baseComp = ToObject(realm,base);
            if (!(baseComp instanceof NormalCompletion))
                return baseComp;
            base = baseComp.value;
            // base = realm.intrinsics.Object;
        }
        const name = GetReferencedName(realm,V);
        const thisValueComp = GetThisValue(realm,V);
        if (!(thisValueComp instanceof NormalCompletion))
            return thisValueComp;
        const thisValue = thisValueComp.value;
        return base.__Get__(name,thisValue);
    }
    else {
        const name: string = GetReferencedName(realm,V).stringRep;
        const strict: boolean = IsStrictReference(realm,V);
        return base.GetBindingValue(name,strict);
    }
}

// ES6 Section 6.2.3.2: PutValue (V, W)

export function PutValue(realm: Realm, V: any, W: any): Completion<UnknownType> {
    throw new Error("PutValue not implemented");
}

// ES6 Section 6.2.3.3: GetThisValue (V)

export function GetThisValue(realm: Realm, V: Reference): Completion<JSValue> {
    if (V instanceof SuperReference)
        return new NormalCompletion(V.thisValue);
    else {
        const result = GetBase(realm,V);
        if (!(result instanceof JSValue))
            throw new Error("base is not a value"); // FIXME: What to do here?
        return new NormalCompletion(result);
    }
}

// ES6 Section 6.2.3.4: InitializeReferencedBinding (V, W)

export function InitializeReferencedBinding(realm: Realm, V: any): Completion<UnknownType> {
    throw new Error("InitializeReferencedBinding not implemented");
}

// ES6 Section 6.2.4: The Property Descriptor Specification Type

// ES6 Section 6.2.4.1: IsAccessorDescriptor (Desc)

export function IsAccessorDescriptor(realm: Realm, Desc: PropertyDescriptor): Desc is AccessorDescriptor {
    return (Desc instanceof AccessorDescriptor);
}

// ES6 Section 6.2.4.2: IsDataDescriptor (Desc)

export function IsDataDescriptor(realm: Realm, Desc: PropertyDescriptor): Desc is DataDescriptor {
    return (Desc instanceof DataDescriptor);
}

// ES6 Section 6.2.4.3: IsGenericDescriptor (Desc)

export function IsGenericDescriptor(realm: Realm, Desc: BaseDescriptor | JSUndefined): boolean {
    if (Desc instanceof JSUndefined)
        return false;
    if (!(Desc instanceof AccessorDescriptor) && !(Desc instanceof DataDescriptor))
        return true;
    return false;
}

// ES6 Section 6.2.4.4: FromPropertyDescriptor (Desc)

export function FromPropertyDescriptor(realm: Realm, Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("FromPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.5: ToPropertyDescriptor (Obj)

export function ToPropertyDescriptor(realm: Realm, Obj: any): Completion<UnknownType> {
    throw new Error("ToPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.6: CompletePropertyDescriptor (Desc)

export function CompletePropertyDescriptor(realm: Realm, Desc: any): Completion<UnknownType> {
    throw new Error("CompletePropertyDescriptor not implemented");
}

// ES6 Section 6.2.6.1: CreateByteDataBlock (size)

export function CreateByteDataBlock(realm: Realm, size: number): DataBlock {
    throw new Error("CreateByteDataBlock not implemented");
}

// ES6 Section 6.2.6.2: CopyDataBlockBytes (toBlock, toIndex, fromBlock, fromIndex, count)

export function CopyDataBlockBytes(realm: Realm, toBlock: DataBlock, toIndex: number, fromBlock: DataBlock, fromIndex: number, count: number): Completion<UnknownType> {
    throw new Error("CopyDataBlockBytes not implemented");
}



































// ES6 Section 7.3.12: Call(F, V, [argumentsList])

export function Call(realm: Realm, F: JSValue, V: JSValue, argumentList: JSValue[]): Completion<JSValue> {
    if (!(F instanceof JSObject) || !F.implementsCall)
        throw new Error("Object is not callable"); // FIXME: temp
    // if (!IsCallable(F))
        // return intrinsic_ThrowTypeError();
    return F.__Call__(V,argumentList);
}




// ES6 Section 7.3.4: CreateDataProperty (O, P, V)

export function CreateDataProperty(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const newDesc = new DataDescriptor({ value: V, writable: true });
    newDesc.enumerable = true;
    newDesc.configurable = true;
    return O.__DefineOwnProperty__(P,newDesc);
}

// ES6 Section 7.3.5: CreateMethodProperty (O, P, V)

export function CreateMethodProperty(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const newDesc = new DataDescriptor({ value: V, writable: true });
    newDesc.enumerable = false;
    newDesc.configurable = true;
    return O.__DefineOwnProperty__(P,newDesc);
}
