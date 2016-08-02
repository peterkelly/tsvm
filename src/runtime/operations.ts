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

// ES6 Chapter 7: Abstract Operations

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
import {
    ToPrimitive,
    ToNumber,
    ToNumber_string,
    ToNumber_boolean,
    ToObject,
} from "./07-01-conversion";
import {
    IsCallable,
} from "./07-02-testcompare";
import {
    Call,
    CreateDataProperty,
    CreateMethodProperty,
} from "./07-03-objects";

// ES6 Section 9.2.7.1: %ThrowTypeError% ()

export function intrinsic_ThrowTypeError(realm: Realm, message?: string): ThrowCompletion {
    // const proto = realm.intrinsics.TypeErrorPrototype;
    // if (message !== undefined)
    //     return new ThrowCompletion(new bi.TypeErrorObject(realm,proto,new JSString(message)));
    // else
    //     return new ThrowCompletion(new bi.TypeErrorObject(realm,proto,new JSUndefined()));
    throw new Error("intrinsic_ThrowReferenceError Not implemented");
}

export function intrinsic_ThrowReferenceError(realm: Realm): ThrowCompletion {
    throw new Error("intrinsic_ThrowReferenceError Not implemented");
}
