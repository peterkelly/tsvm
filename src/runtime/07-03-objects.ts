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

// ES6 Section 7.3: Operations on Objects

import {
    UnknownType,
    Completion,
} from "./datatypes";

// ES6 Section 7.3.1: Get (O, P)

export function Get(O: UnknownType, P: UnknownType): Completion<UnknownType> {
    throw new Error("Get not implemented");
}

// ES6 Section 7.3.2: GetV (V, P)

export function GetV(V: UnknownType, P: UnknownType): Completion<UnknownType> {
    throw new Error("GetV not implemented");
}

// ES6 Section 7.3.3: Set (O, P, V, Throw)

export function Set(O: UnknownType, P: UnknownType, V: UnknownType, Throw: UnknownType): Completion<UnknownType> {
    throw new Error("Set not implemented");
}

// ES6 Section 7.3.4: CreateDataProperty (O, P, V)

export function CreateDataProperty(O: UnknownType, P: UnknownType, V: UnknownType): Completion<UnknownType> {
    throw new Error("CreateDataProperty not implemented");
}

// ES6 Section 7.3.5: CreateMethodProperty (O, P, V)

export function CreateMethodProperty(O: UnknownType, P: UnknownType, V: UnknownType): Completion<UnknownType> {
    throw new Error("CreateMethodProperty not implemented");
}

// ES6 Section 7.3.6: CreateDataPropertyOrThrow (O, P, V)

export function CreateDataPropertyOrThrow(O: UnknownType, P: UnknownType, V: UnknownType): Completion<UnknownType> {
    throw new Error("CreateDataPropertyOrThrow not implemented");
}

// ES6 Section 7.3.7: DefinePropertyOrThrow (O, P, desc)

export function DefinePropertyOrThrow(O: UnknownType, P: UnknownType, desc: UnknownType): Completion<UnknownType> {
    throw new Error("DefinePropertyOrThrow not implemented");
}

// ES6 Section 7.3.8: DeletePropertyOrThrow (O, P)

export function DeletePropertyOrThrow(O: UnknownType, P: UnknownType): Completion<UnknownType> {
    throw new Error("DeletePropertyOrThrow not implemented");
}

// ES6 Section 7.3.9: GetMethod (O, P)

export function GetMethod(O: UnknownType, P: UnknownType): Completion<UnknownType> {
    throw new Error("GetMethod not implemented");
}

// ES6 Section 7.3.10: HasProperty (O, P)

export function HasProperty(O: UnknownType, P: UnknownType): Completion<UnknownType> {
    throw new Error("HasProperty not implemented");
}

// ES6 Section 7.3.11: HasOwnProperty (O, P)

export function HasOwnProperty(O: UnknownType, P: UnknownType): Completion<UnknownType> {
    throw new Error("HasOwnProperty not implemented");
}

// ES6 Section 7.3.12: Call(F, V, [argumentsList])

export function Call(F: UnknownType, V: UnknownType, argumentList: UnknownType): Completion<UnknownType> {
    throw new Error("Call not implemented");
}

// ES6 Section 7.3.13: Construct (F, [argumentsList], [newTarget])

export function Construct(F: UnknownType, argumentList: UnknownType, newTarget: UnknownType): Completion<UnknownType> {
    throw new Error("Construct not implemented");
}

// ES6 Section 7.3.14: SetIntegrityLevel (O, level)

export function SetIntegrityLevel(O: UnknownType, level: UnknownType): Completion<UnknownType> {
    throw new Error("SetIntegrityLevel not implemented");
}

// ES6 Section 7.3.15: TestIntegrityLevel (O, level)

export function TestIntegrityLevel(O: UnknownType, level: UnknownType): Completion<UnknownType> {
    throw new Error("TestIntegrityLevel not implemented");
}

// ES6 Section 7.3.16: CreateArrayFromList (elements)

export function CreateArrayFromList(elements: UnknownType): Completion<UnknownType> {
    throw new Error("CreateArrayFromList not implemented");
}

// ES6 Section 7.3.17: CreateListFromArrayLike (obj [, elementTypes])

export function CreateListFromArrayLike(obj: UnknownType, elementTypes: UnknownType): Completion<UnknownType> {
    throw new Error("CreateListFromArrayLike not implemented");
}

// ES6 Section 7.3.18: Invoke(O, P, [argumentsList])

export function Invoke(O: UnknownType, P: UnknownType, argumentsList: UnknownType): Completion<UnknownType> {
    throw new Error("Invoke not implemented");
}

// ES6 Section 7.3.19: OrdinaryHasInstance (C, O)

export function OrdinaryHasInstance(C: UnknownType, O: UnknownType): Completion<UnknownType> {
    throw new Error("OrdinaryHasInstance not implemented");
}

// ES6 Section 7.3.20: SpeciesConstructor (O, defaultConstructor)

export function SpeciesConstructor(O: UnknownType, defaultConstructor: UnknownType): Completion<UnknownType> {
    throw new Error("SpeciesConstructor not implemented");
}

// ES6 Section 7.3.21: EnumerableOwnNames (O)

export function EnumerableOwnNames(O: UnknownType): Completion<UnknownType> {
    throw new Error("EnumerableOwnNames not implemented");
}

// ES6 Section 7.3.22: GetFunctionRealm (obj)

export function GetFunctionRealm(obj: UnknownType): Completion<UnknownType> {
    throw new Error("GetFunctionRealm not implemented");
}
