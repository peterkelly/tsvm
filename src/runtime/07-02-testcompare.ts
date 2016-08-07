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

// ES6 Section 7.2: Testing and Comparison Operations

import {
    UnknownType,
    Completion,
    Realm,
} from "./datatypes";

// ES6 Section 7.2.1: RequireObjectCoercible (argument)

export function RequireObjectCoercible(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("RequireObjectCoercible not implemented");
}

// ES6 Section 7.2.2: IsArray (argument)

export function IsArray(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("IsArray not implemented");
}

// ES6 Section 7.2.3: IsCallable (argument)

export function IsCallable(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("IsCallable not implemented");
}

// ES6 Section 7.2.4: IsConstructor (argument)

export function IsConstructor(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("IsConstructor not implemented");
}

// ES6 Section 7.2.5: IsExtensible (O)

export function IsExtensible(realm: Realm, O: UnknownType): Completion<UnknownType> {
    throw new Error("IsExtensible not implemented");
}

// ES6 Section 7.2.6: IsInteger (argument)

export function IsInteger(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("IsInteger not implemented");
}

// ES6 Section 7.2.7: IsPropertyKey (argument)

export function IsPropertyKey(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("IsPropertyKey not implemented");
}

// ES6 Section 7.2.8 IsRegExp: (argument)

export function IsRegExp(realm: Realm, argument: UnknownType): Completion<UnknownType> {
    throw new Error("IsRegExp not implemented");
}

// ES6 Section 7.2.9: SameValue (x, y)

export function SameValue(realm: Realm, x: UnknownType, y: UnknownType): Completion<UnknownType> {
    throw new Error("SameValue not implemented");
}

// ES6 Section 7.2.10: SameValueZero (x, y)

export function SameValueZero(realm: Realm, x: UnknownType, y: UnknownType): Completion<UnknownType> {
    throw new Error("SameValueZero not implemented");
}

// ES6 Section 7.2.11: Abstract Relational Comparison

export function abstractRelationalComparison(realm: Realm, x: UnknownType, y: UnknownType, leftFirst: UnknownType): Completion<UnknownType> {
    throw new Error("abstractRelationalComparison not implemented");
}

// ES6 Section 7.2.12: Abstract Equality Comparison

export function abstractEqualityComparison(realm: Realm, x: UnknownType, y: UnknownType): Completion<UnknownType> {
    throw new Error("abstractEqualityComparison not implemented");
}

// ES6 Section 7.2.13: Strict Equality Comparison

export function strictEqualityComparison(realm: Realm, x: UnknownType, y: UnknownType): Completion<UnknownType> {
    throw new Error("strictEqualityComparison not implemented");
}
