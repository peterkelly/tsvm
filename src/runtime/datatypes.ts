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
import {
    CreateDataProperty,
    Call,
} from "./07-03-objects";
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
