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
    JSPropertyKey,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    Property,
    UnknownType,
} from "./datatypes";
import {
    rt_isSameNumberValue,
    rt_double_abstractRelationalComparison,
    rt_double_strictEqualityComparison,
    rt_double_equalsExact,
    rt_double_isNaN,
    rt_double_isPositiveZero,
    rt_double_isNegativeZero,
    rt_double_isPositiveInfinity,
    rt_double_isNegativeInfinity,
    rt_string_to_double,
    rt_string_lessThan,
} from "./runtime";

// ES6 Section 7.1: Type Conversion

// ES6 Section 7.1.1: ToPrimitive (input [, PreferredType])

export function ToPrimitive(argument: JSValue, preferredType?: ValueType): Completion<JSPrimitiveValue> {
    throw new Error("ToPrimitive not implemented");
}

export function OrdinaryToPrimitive(O: JSObject, hint: "string" | "number"): Completion<JSPrimitiveValue> {
    throw new Error("OrdinaryToPrimitive not implemented");
}

// ES6 Section 7.1.2: ToBoolean (argument)

export function ToBoolean(argument: JSValue): Completion<JSBoolean> {
    throw new Error("ToBoolean not implemented");
}

// ES6 Section 7.1.3: ToNumber (argument)

export function ToNumber(argument: JSValue): Completion<JSNumber> {
    throw new Error("ToNumber not implemented");
}

function ToNumber_string(argument: JSString): JSNumber {
    return new JSNumber(rt_string_to_double(argument.stringValue));
}

function ToNumber_boolean(argument: JSBoolean): JSNumber {
    throw new Error("ToNumber_boolean not implemented");
}

// ES6 Section 7.1.4: ToInteger (argument)

export function ToInteger(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInteger not implemented");
}

// ES6 Section 7.1.5: ToInt32 (argument)

export function ToInt32(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInt32 not implemented");
}

// ES6 Section 7.1.6: ToUint32 (argument)

export function ToUint32(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint32 not implemented");
}

// ES6 Section 7.1.7: ToInt16 (argument)

export function ToInt16(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInt16 not implemented");
}

// ES6 Section 7.1.8: ToUint16 (argument)

export function ToUint16(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint16 not implemented");
}

// ES6 Section 7.1.9: ToInt8 (argument)

export function ToInt8(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToInt8 not implemented");
}

// ES6 Section 7.1.10: ToUint8 (argument)

export function ToUint8(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint8 not implemented");
}

// ES6 Section 7.1.11: ToUint8Clamp (argument)

export function ToUint8Clamp(argument: JSValue): Completion<UnknownType> {
    throw new Error("ToUint8Clamp not implemented");
}

// ES6 Section 7.1.12: ToString (argument)

export function ToString(argument: JSValue): Completion<JSString> {
    throw new Error("ToString not implemented");
}

// ES6 Section 7.1.13: ToObject (argument)

export function ToObject(argument: JSValue): Completion<JSObject> {
    throw new Error("ToObject not implemented");
}

// ES6 Section 7.1.14: ToPropertyKey (argument)

export function ToPropertyKey(argument: JSValue): Completion<JSPropertyKey> {
    const keyComp = ToPrimitive(argument,ValueType.String);
    if (!(keyComp instanceof NormalCompletion))
        return keyComp;

    const key = keyComp.value;
    if (key instanceof JSSymbol) {
        return new NormalCompletion(key);
    }
    else
        return ToString(key);
}

// ES6 Section 7.1.15: ToLength (argument)

export function ToLength(argument: any): Completion<JSNumber> {
    throw new Error("ToLength not implemented");
}

// ES6 Section 7.1.16: CanonicalNumericIndexString (argument)

export function CanonicalNumericIndexString(argument: any): Completion<UnknownType> {
    throw new Error("CanonicalNumericIndexString not implemented");
}

// ES6 Section 7.2: Testing and Comparison Operations

// ES6 Section 7.2.1: RequireObjectCoercible (argument)

export function RequireObjectCoercible(argument: any): Completion<UnknownType> {
    throw new Error("RequireObjectCoercible not implemented");
}

// ES6 Section 7.2.2: IsArray (argument)

export function IsArray(argument: any): Completion<UnknownType> {
    throw new Error("IsArray not implemented");
}

// ES6 Section 7.2.3: IsCallable (argument)

export function IsCallable(argument: any): Completion<UnknownType> {
    throw new Error("IsCallable not implemented");
}

// ES6 Section 7.2.4: IsConstructor (argument)

export function IsConstructor(argument: any): Completion<UnknownType> {
    throw new Error("IsConstructor not implemented");
}

// ES6 Section 7.2.5: IsExtensible (O)

export function IsExtensible(O: any): Completion<UnknownType> {
    throw new Error("IsExtensible not implemented");
}

// ES6 Section 7.2.6: IsInteger (argument)

export function IsInteger(argument: any): Completion<UnknownType> {
    throw new Error("IsInteger not implemented");
}

// ES6 Section 7.2.7: IsPropertyKey (argument)

export function IsPropertyKey(argument: any): Completion<UnknownType> {
    throw new Error("IsPropertyKey not implemented");
}

// ES6 Section 7.2.8 IsRegExp: (argument)

export function IsRegExp(argument: any): Completion<UnknownType> {
    throw new Error("IsRegExp not implemented");
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

// ES6 Section 7.2.11: Abstract Relational Comparison

export function abstractRelationalComparison(x: JSValue, y: JSValue, leftFirst: boolean = true): Completion<JSBoolean | JSUndefined> {
    let px: JSValue;
    let py: JSValue;
    if (leftFirst) {
        const pxComp = ToPrimitive(x,ValueType.Number);
        if (!(pxComp instanceof NormalCompletion))
            return pxComp;
        px = pxComp.value;
        const pyComp = ToPrimitive(y,ValueType.Number);
        if (!(pyComp instanceof NormalCompletion))
            return pyComp;
        py = pyComp.value;
    }
    else {
        const pyComp = ToPrimitive(y,ValueType.Number);
        if (!(pyComp instanceof NormalCompletion))
            return pyComp;
        py = pyComp.value;
        const pxComp = ToPrimitive(x,ValueType.Number);
        if (!(pxComp instanceof NormalCompletion))
            return pxComp;
        px = pxComp.value;
    }
    if ((px instanceof JSString) && (py instanceof JSString)) {
        const result = rt_string_lessThan(px.stringValue,py.stringValue);
        return new NormalCompletion(new JSBoolean(result));
    }
    else {
        const nxComp = ToNumber(px);
        if (!(nxComp instanceof NormalCompletion))
            return nxComp;
        const nx = nxComp.value;
        const nyComp = ToNumber(py);
        if (!(nyComp instanceof NormalCompletion))
            return nyComp;
        const ny = nyComp.value;
        const result = rt_double_abstractRelationalComparison(nx.numberValue,ny.numberValue);
        if (result === undefined)
            return new NormalCompletion(new JSUndefined());
        else
            return new NormalCompletion(new JSBoolean(result));
    }
}

// ES6 Section 7.2.12: Abstract Equality Comparison

export function abstractEqualityComparison(x: JSValue, y: JSValue): Completion<boolean> {
    if (x.type === y.type)
        return new NormalCompletion(strictEqualityComparison(x,y));

    if ((x instanceof JSNull) && (y instanceof JSUndefined))
        return new NormalCompletion(true);

    if ((x instanceof JSUndefined) && (y instanceof JSNull))
        return new NormalCompletion(true);

    if ((x instanceof JSNumber) && (y instanceof JSString))
        return abstractEqualityComparison(x,ToNumber_string(y));

    if ((x instanceof JSString) && (y instanceof JSNumber))
        return abstractEqualityComparison(ToNumber_string(x),y);

    if (x instanceof JSBoolean)
        return abstractEqualityComparison(ToNumber_boolean(x),y);

    if (y instanceof JSBoolean)
        return abstractEqualityComparison(x,ToNumber_boolean(y));

    if ((y instanceof JSObject) &&
        ((x instanceof JSString) || (x instanceof JSNumber) || (x instanceof JSSymbol))) {
        const yComp = ToPrimitive(y);
        if (!(yComp instanceof NormalCompletion))
            return yComp;
        return abstractEqualityComparison(x,yComp.value);
    }

    if ((x instanceof JSObject) &&
        ((y instanceof JSString) || (y instanceof JSNumber) || (y instanceof JSSymbol))) {
        const xComp = ToPrimitive(x);
        if (!(xComp instanceof NormalCompletion))
            return xComp;
        return abstractEqualityComparison(xComp.value,y);
    }

    return new NormalCompletion(false);
}

// ES6 Section 7.2.13: Strict Equality Comparison

export function strictEqualityComparison(x: JSValue, y: JSValue): boolean {
    if (x.type !== y.type)
        return false;
    switch (x.type) {
        case ValueType.Undefined:
            return true;
        case ValueType.Null:
            return true;
        case ValueType.Number:
            if ((x instanceof JSNumber) && (y instanceof JSNumber)) {
                return rt_double_strictEqualityComparison(x.numberValue,y.numberValue);
            }
            else {
                throw new Error("Incorrect JSValue.type (Number); should never get here");
            }
        case ValueType.String:
            if ((x instanceof JSString) && (y instanceof JSString)) {
                // FIXME: Define a set of functions for primitive operations like this that the
                // runtime must supply itself, so we're not relying on the host JS implementation
                // within our own implementation functions.
                return (x.stringValue === y.stringValue);
            }
            else {
                throw new Error("Incorrect JSValue.type (String); should never get here");
            }
        case ValueType.Boolean:
            if ((x instanceof JSBoolean) && (y instanceof JSBoolean)) {
                return (x.booleanValue == y.booleanValue);
            }
            else {
                throw new Error("Incorrect JSValue.type (Boolean); should never get here");
            }
        case ValueType.Symbol:
            if ((x instanceof JSSymbol) && (y instanceof JSSymbol))
                return (x.symbolId === y.symbolId);
            else
                throw new Error("Incorrect JSValue.type (Symbol); should never get here");
        case ValueType.Object:
            return (x === y);
    }

    throw new Error("Unhandled case; should never get here");
}

// ES6 Section 7.3: Operations on Objects

// ES6 Section 7.3.1: Get (O, P)

export function Get(O: JSObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("Get not implemented");
}

// ES6 Section 7.3.2: GetV (V, P)

export function GetV(O: any, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("GetV not implemented");
}

// ES6 Section 7.3.3 Set: (O, P, V, Throw)

export function Set(O: JSObject, P: JSPropertyKey, V: JSValue, Throw: boolean): Completion<UnknownType> {
    throw new Error("Set not implemented");
}

// ES6 Section 7.3.4: CreateDataProperty (O, P, V)

export function CreateDataProperty(O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    throw new Error("CreateDataProperty not implemented");
}

// ES6 Section 7.3.5: CreateMethodProperty (O, P, V)

export function CreateMethodProperty(O: JSObject, P: JSPropertyKey, V: JSValue): Completion<UnknownType> {
    throw new Error("CreateMethodProperty not implemented");
}

// ES6 Section 7.3.6: CreateDataPropertyOrThrow (O, P, V)

export function CreateDataPropertyOrThrow(O: JSObject, P: JSPropertyKey, V: JSValue): Completion<UnknownType> {
    throw new Error("CreateDataPropertyOrThrow not implemented");
}

// ES6 Section 7.3.7: DefinePropertyOrThrow (O, P, desc)

export function DefinePropertyOrThrow(O: JSObject, P: JSPropertyKey, desc: Property): Completion<UnknownType> {
    throw new Error("DefinePropertyOrThrow not implemented");
}

// ES6 Section 7.3.8: DeletePropertyOrThrow (O, P)

export function DeletePropertyOrThrow(O: JSObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("DeletePropertyOrThrow not implemented");
}

// ES6 Section 7.3.9: GetMethod (O, P)

export function GetMethod(O: JSObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("GetMethod not implemented");
}

// ES6 Section 7.3.10: HasProperty (O, P)

export function HasProperty(O: JSObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("HasProperty not implemented");
}

// ES6 Section 7.3.11: HasOwnProperty (O, P)

export function HasOwnProperty(O: JSObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("HasOwnProperty not implemented");
}

// ES6 Section 7.3.12: Call(F, V, [argumentsList])

export function Call(F: JSObject, V: JSValue, argumentList: JSValue[]): Completion<JSValue> {
    throw new Error("Call not implemented");
}

// ES6 Section 7.3.13: Construct (F, [argumentsList], [newTarget])

export function Construct(F: JSObject, argumentList: JSValue[], newTarget: JSObject): Completion<UnknownType> {
    throw new Error("Construct not implemented");
}

// ES6 Section 7.3.14: SetIntegrityLevel (O, level)

export function SetIntegrityLevel(O: JSObject, level: string): Completion<UnknownType> {
    throw new Error("SetIntegrityLevel not implemented");
}

// ES6 Section 7.3.15: TestIntegrityLevel (O, level)

export function TestIntegrityLevel(O: JSObject, level: string): Completion<UnknownType> {
    throw new Error("TestIntegrityLevel not implemented");
}

// ES6 Section 7.3.16: CreateArrayFromList (elements)

export function CreateArrayFromList(elements: JSValue[]): Completion<UnknownType> {
    throw new Error("CreateArrayFromList not implemented");
}

// ES6 Section 7.3.17: CreateListFromArrayLike (obj [, elementTypes])

export function CreateListFromArrayLike(obj: JSValue, elementTypes: any): Completion<UnknownType> {
    throw new Error("CreateListFromArrayLike not implemented");
}

// ES6 Section 7.3.18: Invoke(O, P, [argumentsList])

export function Invoke(O: JSObject, P: JSPropertyKey, argumentsList: JSValue[]): Completion<UnknownType> {
    throw new Error("Invoke not implemented");
}

// ES6 Section 7.3.19: OrdinaryHasInstance (C, O)

export function OrdinaryHasInstance(C: any, O: JSObject): Completion<UnknownType> {
    throw new Error("OrdinaryHasInstance not implemented");
}

// ES6 Section 7.3.20: SpeciesConstructor (O, defaultConstructor)

export function SpeciesConstructor(O: JSObject, defaultConstructor: any): Completion<UnknownType> {
    throw new Error("SpeciesConstructor not implemented");
}

// ES6 Section 7.3.21: EnumerableOwnNames (O)

export function EnumerableOwnNames(O: JSObject): Completion<UnknownType> {
    throw new Error("EnumerableOwnNames not implemented");
}

// ES6 Section 7.3.22: GetFunctionRealm (obj)

export function GetFunctionRealm(obj: JSObject): Completion<UnknownType> {
    throw new Error("GetFunctionRealm not implemented");
}

// ES6 Section 7.4: Operations on Iterator Objects

// ES6 Section 7.4.1: GetIterator (obj, method)

export function GetIterator(obj: any, method: any): Completion<UnknownType> {
    throw new Error("GetIterator not implemented");
}

// ES6 Section 7.4.2: IteratorNext (iterator, value)

export function IteratorNext(iterator: any, value: any): Completion<UnknownType> {
    throw new Error("IteratorNext not implemented");
}

// ES6 Section 7.4.3: IteratorComplete (iterResult)

export function IteratorComplete(iterResult: any): Completion<UnknownType> {
    throw new Error("IteratorComplete not implemented");
}

// ES6 Section 7.4.4: IteratorValue (iterResult)

export function IteratorValue(iterResult: any): Completion<UnknownType> {
    throw new Error("IteratorValue not implemented");
}

// ES6 Section 7.4.5: IteratorStep (iterator)

export function IteratorStep(iterator: any): Completion<UnknownType> {
    throw new Error("IteratorStep not implemented");
}

// ES6 Section 7.4.6: IteratorClose (iterator, completion)

export function IteratorClose(iterator: any, completion: any): Completion<UnknownType> {
    throw new Error("IteratorClose not implemented");
}

// ES6 Section 7.4.7: CreateIterResultObject (value, done)

export function CreateIterResultObject(value: any, done: any): Completion<UnknownType> {
    throw new Error("CreateIterResultObject not implemented");
}

// ES6 Section 7.4.8: CreateListIterator (list)

export function CreateListIterator(list: any): Completion<UnknownType> {
    throw new Error("CreateListIterator not implemented");
}

// ES6 Section 7.4.8.1: ListIterator next()

export function ListIterator_next(): Completion<UnknownType> {
    throw new Error("ListIterator_next not implemented");
}
