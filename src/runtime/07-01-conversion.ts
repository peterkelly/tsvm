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

// ES6 Section 7.1: Type Conversion

import {
    UnknownType,
    Completion,
} from "./datatypes";

// ES6 Section 7.1.1: ToPrimitive (input [, PreferredType])

export function ToPrimitive(input: UnknownType, preferredType?: UnknownType): Completion<UnknownType> {
    throw new Error("ToPrimitive not implemented");
}

export function OrdinaryToPrimitive(O: UnknownType, hint: UnknownType): Completion<UnknownType> {
    throw new Error("OrdinaryToPrimitive not implemented");
}

// ES6 Section 7.1.2: ToBoolean (argument)

export function ToBoolean(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToBoolean not implemented");
}

// ES6 Section 7.1.3: ToNumber (argument)

export function ToNumber(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToNumber not implemented");
}

// ES6 Section 7.1.4: ToInteger (argument)

export function ToInteger(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToInteger not implemented");
}

// ES6 Section 7.1.5: ToInt32 (argument)

export function ToInt32(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToInt32 not implemented");
}

// ES6 Section 7.1.6: ToUint32 (argument)

export function ToUint32(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToUint32 not implemented");
}

// ES6 Section 7.1.7: ToInt16 (argument)

export function ToInt16(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToInt16 not implemented");
}

// ES6 Section 7.1.8: ToUint16 (argument)

export function ToUint16(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToUint16 not implemented");
}

// ES6 Section 7.1.9: ToInt8 (argument)

export function ToInt8(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToInt8 not implemented");
}

// ES6 Section 7.1.10: ToUint8 (argument)

export function ToUint8(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToUint8 not implemented");
}

// ES6 Section 7.1.11: ToUint8Clamp (argument)

export function ToUint8Clamp(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToUint8Clamp not implemented");
}

// ES6 Section 7.1.12: ToString (argument)

export function ToString(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToString not implemented");
}

// ES6 Section 7.1.13: ToObject (argument)

export function ToObject(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToObject not implemented");
}

// ES6 Section 7.1.14: ToPropertyKey (argument)

export function ToPropertyKey(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToPropertyKey not implemented");
}

// ES6 Section 7.1.15: ToLength (argument)

export function ToLength(argument: UnknownType): Completion<UnknownType> {
    throw new Error("ToLength not implemented");
}

// ES6 Section 7.1.16: CanonicalNumericIndexString (argument)

export function CanonicalNumericIndexString(argument: UnknownType): Completion<UnknownType> {
    throw new Error("CanonicalNumericIndexString not implemented");
}
