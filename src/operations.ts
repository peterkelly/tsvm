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
    ValueType,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    JSValue,
    JSPrimitiveValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    PropertyKey,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    Property,
    UnknownType,
} from "./datatypes";

// Chapter 7 Abstract Operations

// Section 7.1 Type Conversion

// Section 7.1.1 ToPrimitive ( input [, PreferredType] )

export function ToPrimitive(argument: JSValue, preferredType?: ValueType): Completion<JSPrimitiveValue> {
    throw new Error("ToPrimitive not implemented");
}

export function OrdinaryToPrimitive(O: JSObject, hint: "string" | "number"): Completion<JSPrimitiveValue> {
    throw new Error("OrdinaryToPrimitive not implemented");
}

// 7.1.2 ToBoolean ( argument )

export function ToBoolean(argument: JSValue): Completion<JSBoolean> {
    throw new Error("ToBoolean not implemented");
}

// 7.1.3 ToNumber ( argument )

export function ToNumber(argument: JSValue): Completion<JSNumber> {
    throw new Error("ToNumber not implemented");
}

// 7.1.4 ToInteger ( argument )

export function ToInteger(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInteger not implemented");
}

// 7.1.5 ToInt32 ( argument )

export function ToInt32(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInt32 not implemented");
}

// 7.1.6 ToUint32 ( argument )

export function ToUint32(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint32 not implemented");
}

// 7.1.7 ToInt16 ( argument )

export function ToInt16(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInt16 not implemented");
}

// 7.1.8 ToUint16 ( argument )

export function ToUint16(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint16 not implemented");
}

// 7.1.9 ToInt8 ( argument )

export function ToInt8(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInt8 not implemented");
}

// 7.1.10 ToUint8 ( argument )

export function ToUint8(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint8 not implemented");
}

// 7.1.11 ToUint8Clamp ( argument )

export function ToUint8Clamp(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint8Clamp not implemented");
}

// 7.1.12 ToString ( argument )

export function ToString(argument: JSValue): Completion<JSString> {
    throw new Error("ToString not implemented");
}

// 7.1.13 ToObject ( argument )

export function ToObject(argument: JSValue): Completion<JSObject> {
    throw new Error("ToObject not implemented");
}

// 7.1.14 ToPropertyKey ( argument )

export function ToPropertyKey(argument: JSValue): Completion<PropertyKey> {
    const keyComp = ToPrimitive(argument,ValueType.String);
    if (keyComp instanceof NormalCompletion) {
        const primitiveKey: NormalCompletion<JSPrimitiveValue> = keyComp;

        const booleanKey: NormalCompletion<boolean> = keyComp;

        const autoKey = keyComp;
    }
    if (!(keyComp instanceof NormalCompletion))
        return keyComp.convert<PropertyKey>();

    const key = keyComp.value;
    if (key instanceof JSSymbol) {
        const x = new NormalCompletion(key);
        return x;
    }
    else
        return ToString(key);
}

// 7.1.15 ToLength ( argument )

export function ToLength(argument: any): Completion<JSNumber> {
    throw new Error("ToLength not implemented");
}

// 7.1.16 CanonicalNumericIndexString ( argument )

export function CanonicalNumericIndexString(argument: any): Completion<UnknownType> {
    throw new Error("CanonicalNumericIndexString not implemented");
}

// 7.2 Testing and Comparison Operations

// 7.2.1 RequireObjectCoercible ( argument )

export function RequireObjectCoercible(argument: any): Completion<UnknownType> {
    throw new Error("RequireObjectCoercible not implemented");
}

// 7.2.2 IsArray ( argument )

export function IsArray(argument: any): Completion<UnknownType> {
    throw new Error("IsArray not implemented");
}

// 7.2.3 IsCallable ( argument )

export function IsCallable(argument: any): Completion<UnknownType> {
    throw new Error("IsCallable not implemented");
}

// 7.2.4 IsConstructor ( argument )

export function IsConstructor(argument: any): Completion<UnknownType> {
    throw new Error("IsConstructor not implemented");
}

// 7.2.5 IsExtensible (O)

export function IsExtensible(O: any): Completion<UnknownType> {
    throw new Error("IsExtensible not implemented");
}

// 7.2.6 IsInteger ( argument )

export function IsInteger(argument: any): Completion<UnknownType> {
    throw new Error("IsInteger not implemented");
}

// 7.2.7 IsPropertyKey ( argument )

export function IsPropertyKey(argument: any): Completion<UnknownType> {
    throw new Error("IsPropertyKey not implemented");
}

// 7.2.8 IsRegExp ( argument )

export function IsRegExp(argument: any): Completion<UnknownType> {
    throw new Error("IsRegExp not implemented");
}

// 7.2.9 SameValue(x, y)

export function SameValue(x: any, y: any): Completion<UnknownType> {
    throw new Error("SameValue not implemented");
}

// 7.2.10 SameValueZero(x, y)

export function SameValueZero(x: any, y: any): Completion<UnknownType> {
    throw new Error("SameValueZero not implemented");
}

// 7.2.11 Abstract Relational Comparison

export function _abstractRelationalComparison(x: any, y: any): Completion<UnknownType> {
    throw new Error("_abstractRelationalComparison not implemented");
}

// 7.2.12 Abstract Equality Comparison

export function _abstractEqualityComparison(x: any, y: any): Completion<UnknownType> {
    throw new Error("_abstractEqualityComparison not implemented");
}

// 7.2.13 Strict Equality Comparison

export function _strictEqualityComparison(x: any, y: any): Completion<UnknownType> {
    throw new Error("_strictEqualityComparison not implemented");
}

// 7.3 Operations on Objects

// 7.3.1 Get (O, P)

export function Get(O: JSObject, P: PropertyKey): Completion<UnknownType> {
    throw new Error("Get not implemented");
}

// 7.3.2 GetV (V, P)

export function GetV(O: any, P: PropertyKey): Completion<UnknownType> {
    throw new Error("GetV not implemented");
}

// 7.3.3 Set (O, P, V, Throw)

export function Set(O: JSObject, P: PropertyKey, V: JSValue, Throw: boolean): Completion<UnknownType> {
    throw new Error("Set not implemented");
}

// 7.3.4 CreateDataProperty (O, P, V)

export function CreateDataProperty(O: JSObject, P: PropertyKey, V: JSValue): Completion<UnknownType> {
    throw new Error("CreateDataProperty not implemented");
}

// 7.3.5 CreateMethodProperty (O, P, V)

export function CreateMethodProperty(O: JSObject, P: PropertyKey, V: JSValue): Completion<UnknownType> {
    throw new Error("CreateMethodProperty not implemented");
}

// 7.3.6 CreateDataPropertyOrThrow (O, P, V)

export function CreateDataPropertyOrThrow(O: JSObject, P: PropertyKey, V: JSValue): Completion<UnknownType> {
    throw new Error("CreateDataPropertyOrThrow not implemented");
}

// 7.3.7 DefinePropertyOrThrow (O, P, desc)

export function DefinePropertyOrThrow(O: JSObject, P: PropertyKey, desc: Property): Completion<UnknownType> {
    throw new Error("DefinePropertyOrThrow not implemented");
}

// 7.3.8 DeletePropertyOrThrow (O, P)

export function DeletePropertyOrThrow(O: JSObject, P: PropertyKey): Completion<UnknownType> {
    throw new Error("DeletePropertyOrThrow not implemented");
}

// 7.3.9 GetMethod (O, P)

export function GetMethod(O: JSObject, P: PropertyKey): Completion<UnknownType> {
    throw new Error("GetMethod not implemented");
}

// 7.3.10 HasProperty (O, P)

export function HasProperty(O: JSObject, P: PropertyKey): Completion<UnknownType> {
    throw new Error("HasProperty not implemented");
}

// 7.3.11 HasOwnProperty (O, P)

export function HasOwnProperty(O: JSObject, P: PropertyKey): Completion<UnknownType> {
    throw new Error("HasOwnProperty not implemented");
}

// 7.3.12 Call(F, V, [argumentsList])

export function Call(F: JSObject, V: JSValue, argumentList: JSValue[]): Completion<UnknownType> {
    throw new Error("Call not implemented");
}

// 7.3.13 Construct (F, [argumentsList], [newTarget])

export function Construct(F: JSObject, argumentList: JSValue[], newTarget: JSObject): Completion<UnknownType> {
    throw new Error("Construct not implemented");
}

// 7.3.14 SetIntegrityLevel (O, level)

export function SetIntegrityLevel(O: JSObject, level: string): Completion<UnknownType> {
    throw new Error("SetIntegrityLevel not implemented");
}

// 7.3.15 TestIntegrityLevel (O, level)

export function TestIntegrityLevel(O: JSObject, level: string): Completion<UnknownType> {
    throw new Error("TestIntegrityLevel not implemented");
}

// 7.3.16 CreateArrayFromList (elements)

export function CreateArrayFromList(elements: JSValue[]): Completion<UnknownType> {
    throw new Error("CreateArrayFromList not implemented");
}

// 7.3.17 CreateListFromArrayLike (obj [, elementTypes] )

export function CreateListFromArrayLike(obj: JSValue, elementTypes: any): Completion<UnknownType> {
    throw new Error("CreateListFromArrayLike not implemented");
}

// 7.3.18 Invoke(O,P, [argumentsList])

export function Invoke(O: JSObject, P: PropertyKey, argumentsList: JSValue[]): Completion<UnknownType> {
    throw new Error("Invoke not implemented");
}

// 7.3.19 OrdinaryHasInstance (C, O)

export function OrdinaryHasInstance(C: any, O: JSObject): Completion<UnknownType> {
    throw new Error("OrdinaryHasInstance not implemented");
}

// 7.3.20 SpeciesConstructor ( O, defaultConstructor )

export function SpeciesConstructor(O: JSObject, defaultConstructor: any): Completion<UnknownType> {
    throw new Error("SpeciesConstructor not implemented");
}

// 7.3.21 EnumerableOwnNames (O)

export function EnumerableOwnNames(O: JSObject): Completion<UnknownType> {
    throw new Error("EnumerableOwnNames not implemented");
}

// 7.3.22 GetFunctionRealm ( obj )

export function GetFunctionRealm(obj: JSObject): Completion<UnknownType> {
    throw new Error("GetFunctionRealm not implemented");
}

// 7.4 Operations on Iterator Objects

// 7.4.1 GetIterator ( obj, method )

export function GetIterator(obj: any, method: any): Completion<UnknownType> {
    throw new Error("GetIterator not implemented");
}

// 7.4.2 IteratorNext ( iterator, value )

export function IteratorNext(iterator: any, value: any): Completion<UnknownType> {
    throw new Error("IteratorNext not implemented");
}

// 7.4.3 IteratorComplete ( iterResult )

export function IteratorComplete(iterResult: any): Completion<UnknownType> {
    throw new Error("IteratorComplete not implemented");
}

// 7.4.4 IteratorValue ( iterResult )

export function IteratorValue(iterResult: any): Completion<UnknownType> {
    throw new Error("IteratorValue not implemented");
}

// 7.4.5 IteratorStep ( iterator )

export function IteratorStep(iterator: any): Completion<UnknownType> {
    throw new Error("IteratorStep not implemented");
}

// 7.4.6 IteratorClose( iterator, Completion<UnknownType> )

export function IteratorClose(iterator: any, completion: any): Completion<UnknownType> {
    throw new Error("IteratorClose not implemented");
}

// 7.4.7 CreateIterResultObject ( value, done )

export function CreateIterResultObject(value: any, done: any): Completion<UnknownType> {
    throw new Error("CreateIterResultObject not implemented");
}

// 7.4.8 CreateListIterator ( list )

export function CreateListIterator(list: any): Completion<UnknownType> {
    throw new Error("CreateListIterator not implemented");
}

// 7.4.8.1 ListIterator next( )

export function ListIterator_next(): Completion<UnknownType> {
    throw new Error("ListIterator_next not implemented");
}
