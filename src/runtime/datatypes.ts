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
// import {
//     SameValue,
//     Call,
//     CreateDataProperty,
// } from "./operations";
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
        return new NormalCompletion(OrdinaryGetOwnProperty(this,P,copy));
    }

    // ES6 Section 9.1.7: [[HasProperty]](P)

    public __HasProperty__(P: JSPropertyKey): Completion<boolean> {
        return OrdinaryHasProperty(this,P);
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
            return Call(getter,Receiver,[]);
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
                return CreateDataProperty(Receiver,P,V);
            }
        }
        else {
            const setter = ownDesc.__set__;
            if (setter instanceof JSUndefined)
                return new NormalCompletion(false);
            const setterResultComp = Call(setter,Receiver,[V]);
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

export function OrdinaryGetOwnProperty(O: JSObject, P: JSPropertyKey, copy: boolean = true): JSUndefined | PropertyDescriptor {
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

export function OrdinaryHasProperty(O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const hasOwn = OrdinaryGetOwnProperty(O,P);
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

export function GetBase(V: Reference): ReferenceBase {
    return V.base;
}

export function GetReferencedName(V: Reference): JSPropertyKey {
    return V.name;
}

export function IsStrictReference(V: Reference): boolean {
    return V.strict.booleanValue;
}

export function HasPrimitiveBase(V: Reference): boolean {
    return ((V.base instanceof JSBoolean) ||
            (V.base instanceof JSString) ||
            (V.base instanceof JSSymbol) ||
            (V.base instanceof JSNumber));
}

export function IsPropertyReference(V: Reference): boolean {
    return ((V.base instanceof JSObject) || HasPrimitiveBase(V));
}

export function IsUnresolvableReference(V: Reference): boolean {
    return (V.base instanceof JSUndefined);
}

export function IsSuperReference(V: Reference): boolean {
    return (V instanceof SuperReference);
}

// ES6 Section 6.2.3.1: GetValue (V)

export function GetValue(V: any): Completion<UnknownType> {
    throw new Error("GetValue not implemented");
}

// ES6 Section 6.2.3.2: PutValue (V, W)

export function PutValue(V: any, W: any): Completion<UnknownType> {
    throw new Error("PutValue not implemented");
}

// ES6 Section 6.2.3.3: GetThisValue (V)

export function GetThisValue(V: any): Completion<UnknownType> {
    throw new Error("GetThisValue not implemented");
}

// ES6 Section 6.2.3.4: InitializeReferencedBinding (V, W)

export function InitializeReferencedBinding(V: any): Completion<UnknownType> {
    throw new Error("InitializeReferencedBinding not implemented");
}

// ES6 Section 6.2.4: The Property Descriptor Specification Type

// ES6 Section 6.2.4.1: IsAccessorDescriptor (Desc)

export function IsAccessorDescriptor(Desc: PropertyDescriptor): Desc is AccessorDescriptor {
    return (Desc instanceof AccessorDescriptor);
}

// ES6 Section 6.2.4.2: IsDataDescriptor (Desc)

export function IsDataDescriptor(Desc: PropertyDescriptor): Desc is DataDescriptor {
    return (Desc instanceof DataDescriptor);
}

// ES6 Section 6.2.4.3: IsGenericDescriptor (Desc)

export function IsGenericDescriptor(Desc: BaseDescriptor | JSUndefined): boolean {
    if (Desc instanceof JSUndefined)
        return false;
    if (!(Desc instanceof AccessorDescriptor) && !(Desc instanceof DataDescriptor))
        return true;
    return false;
}

// ES6 Section 6.2.4.4: FromPropertyDescriptor (Desc)

export function FromPropertyDescriptor(Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("FromPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.5: ToPropertyDescriptor (Obj)

export function ToPropertyDescriptor(Obj: any): Completion<UnknownType> {
    throw new Error("ToPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.6: CompletePropertyDescriptor (Desc)

export function CompletePropertyDescriptor(Desc: any): Completion<UnknownType> {
    throw new Error("CompletePropertyDescriptor not implemented");
}

// ES6 Section 6.2.6.1: CreateByteDataBlock (size)

export function CreateByteDataBlock(size: number): DataBlock {
    throw new Error("CreateByteDataBlock not implemented");
}

// ES6 Section 6.2.6.2: CopyDataBlockBytes (toBlock, toIndex, fromBlock, fromIndex, count)

export function CopyDataBlockBytes(toBlock: DataBlock, toIndex: number, fromBlock: DataBlock, fromIndex: number, count: number): Completion<UnknownType> {
    throw new Error("CopyDataBlockBytes not implemented");
}





























// ES6 Section 7.2.9: SameValue (x, y)

export function SameValue(x: JSValue, y: JSValue): boolean {
    return SameValue2(x,y,false);
}

// ES6 Section 7.2.10: SameValueZero (x, y)

export function SameValueZero(x: any, y: any): boolean {
    return SameValue2(x,y,true);
}

function SameValue2(x: JSValue, y: JSValue, zero: boolean): boolean {
    if (x.type != y.type)
        return false;

    switch (x.type) {
        case ValueType.Undefined:
            return true;
        case ValueType.Null:
            return true;
        case ValueType.Number:
            if ((x instanceof JSNumber) && (y instanceof JSNumber)) {
                if (rt_double_isNaN(x.numberValue) && rt_double_isNaN(y.numberValue))
                    return true;
                if (!zero) {
                    // Logic for the SameValue operation
                    if (rt_double_isPositiveZero(x.numberValue) && rt_double_isNegativeZero(y.numberValue))
                        return false;
                    if (rt_double_isNegativeZero(x.numberValue) && rt_double_isPositiveZero(y.numberValue))
                        return false;
                }
                else {
                    // Logic for the SameValueZero operation
                    if (rt_double_isPositiveZero(x.numberValue) && rt_double_isNegativeZero(y.numberValue))
                        return true;
                    if (rt_double_isNegativeZero(x.numberValue) && rt_double_isPositiveZero(y.numberValue))
                        return true;
                }
                if (rt_double_equalsExact(x.numberValue,y.numberValue))
                    return true;
                return false;
            }
            else {
                throw new Error("Incorrect JSValue.type (Number); should never get here");
            }
        case ValueType.String:
            if ((x instanceof JSString) && (y instanceof JSString))
                return (x.stringValue === y.stringValue);
            else
                throw new Error("Incorrect JSValue.type (String); should never get here");
        case ValueType.Boolean:
            if ((x instanceof JSBoolean) && (y instanceof JSBoolean))
                return (x.booleanValue == y.booleanValue);
            else
                throw new Error("Incorrect JSValue.type (Boolean); should never get here");
        case ValueType.Object:
            if ((x instanceof JSObject) && (y instanceof JSObject))
                return (x === y);
            else
                throw new Error("Incorrect JSValue.type (Object); should never get here");
    }

    throw new Error("Unhandled case; should never get here");
}






// ES6 Section 7.3.12: Call(F, V, [argumentsList])

export function Call(F: JSValue, V: JSValue, argumentList: JSValue[]): Completion<JSValue> {
    if (!(F instanceof JSObject) || !F.implementsCall)
        throw new Error("Object is not callable"); // FIXME: temp
    // if (!IsCallable(F))
        // return intrinsic_ThrowTypeError();
    return F.__Call__(V,argumentList);
}




// ES6 Section 7.3.4: CreateDataProperty (O, P, V)

export function CreateDataProperty(O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const newDesc = new DataDescriptor({ value: V, writable: true });
    newDesc.enumerable = true;
    newDesc.configurable = true;
    return O.__DefineOwnProperty__(P,newDesc);
}

// ES6 Section 7.3.5: CreateMethodProperty (O, P, V)

export function CreateMethodProperty(O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const newDesc = new DataDescriptor({ value: V, writable: true });
    newDesc.enumerable = false;
    newDesc.configurable = true;
    return O.__DefineOwnProperty__(P,newDesc);
}
