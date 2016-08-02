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
