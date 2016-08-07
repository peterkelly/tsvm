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
    Realm,
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
    Completion,
    NormalCompletion,
} from "./datatypes";
import {
    rt_double_strictEqualityComparison,
    rt_double_abstractRelationalComparison,
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
    rt_Infinity,
    rt_NaN,
} from "./runtime";
import {
    ToPrimitive,
    OrdinaryToPrimitive,
    ToBoolean,
    ToNumber,
    ToNumber_string,
    ToNumber_boolean,
    ToInteger,
    ToInt32,
    ToUint32,
    ToInt16,
    ToUint16,
    ToInt8,
    ToUint8,
    ToUint8Clamp,
    ToString,
    ToObject,
    ToPropertyKey,
    ToLength,
    CanonicalNumericIndexString,
} from "./07-01-conversion";

// ES6 Section 7.2.1: RequireObjectCoercible (argument)

export function RequireObjectCoercible(realm: Realm, argument: JSValue): Completion<JSValue> {
    switch (argument.type) {
        case ValueType.Undefined:
            return realm.throwTypeError("undefined is not coercible");
        case ValueType.Null:
            return realm.throwTypeError("null is not coercible");
        default:
            return new NormalCompletion(argument);
    }
}

// ES6 Section 7.2.2: IsArray (argument)

// export function IsArray(realm: Realm, argument: any): Completion<UnknownType> {
//     throw new Error("IsArray not implemented");
// }

// ES6 Section 7.2.3: IsCallable (argument)

export function IsCallable(realm: Realm, argument: JSValue): boolean {
    return ((argument instanceof JSObject) && argument.implementsCall);
}

// ES6 Section 7.2.4: IsConstructor (argument)

export function IsConstructor(realm: Realm, argument: any): boolean {
    return ((argument instanceof JSObject) && argument.implementsConstruct);
}

// ES6 Section 7.2.5: IsExtensible (O)

export function IsExtensible(realm: Realm, O: JSObject): Completion<boolean> {
    return O.__IsExtensible__(realm);
}

// ES6 Section 7.2.6: IsInteger (argument)

export function IsInteger(realm: Realm, argument: JSValue): Completion<boolean> {
    if (!(argument instanceof JSNumber))
        return new NormalCompletion(false);
    const result = rt_double_isInteger(argument.numberValue);
    return new NormalCompletion(result);
}

// ES6 Section 7.2.7: IsPropertyKey (argument)

export function IsPropertyKey(realm: Realm, argument: JSValue): argument is JSPropertyKey {
    return (argument instanceof JSPropertyKey);
}

// ES6 Section 7.2.8 IsRegExp: (argument)

// export function IsRegExp(realm: Realm, argument: any): Completion<UnknownType> {
//     throw new Error("IsRegExp not implemented");
// }

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

export function abstractRelationalComparison(realm: Realm, x: JSValue, y: JSValue, leftFirst: boolean = true): Completion<JSBoolean | JSUndefined> {
    let px: JSValue;
    let py: JSValue;
    if (leftFirst) {
        const pxComp = ToPrimitive(realm,x,ValueType.Number);
        if (!(pxComp instanceof NormalCompletion))
            return pxComp;
        px = pxComp.value;
        const pyComp = ToPrimitive(realm,y,ValueType.Number);
        if (!(pyComp instanceof NormalCompletion))
            return pyComp;
        py = pyComp.value;
    }
    else {
        const pyComp = ToPrimitive(realm,y,ValueType.Number);
        if (!(pyComp instanceof NormalCompletion))
            return pyComp;
        py = pyComp.value;
        const pxComp = ToPrimitive(realm,x,ValueType.Number);
        if (!(pxComp instanceof NormalCompletion))
            return pxComp;
        px = pxComp.value;
    }
    if ((px instanceof JSString) && (py instanceof JSString)) {
        const result = rt_string_lessThan(px.stringValue,py.stringValue);
        return new NormalCompletion(new JSBoolean(result));
    }
    else {
        const nxComp = ToNumber(realm,px);
        if (!(nxComp instanceof NormalCompletion))
            return nxComp;
        const nx = nxComp.value;
        const nyComp = ToNumber(realm,py);
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

export function abstractEqualityComparison(realm: Realm, x: JSValue, y: JSValue): Completion<boolean> {
    if (x.type === y.type)
        return new NormalCompletion(strictEqualityComparison(realm,x,y));

    if ((x instanceof JSNull) && (y instanceof JSUndefined))
        return new NormalCompletion(true);

    if ((x instanceof JSUndefined) && (y instanceof JSNull))
        return new NormalCompletion(true);

    if ((x instanceof JSNumber) && (y instanceof JSString))
        return abstractEqualityComparison(realm,x,ToNumber_string(realm,y));

    if ((x instanceof JSString) && (y instanceof JSNumber))
        return abstractEqualityComparison(realm,ToNumber_string(realm,x),y);

    if (x instanceof JSBoolean)
        return abstractEqualityComparison(realm,ToNumber_boolean(realm,x),y);

    if (y instanceof JSBoolean)
        return abstractEqualityComparison(realm,x,ToNumber_boolean(realm,y));

    if ((y instanceof JSObject) &&
        ((x instanceof JSString) || (x instanceof JSNumber) || (x instanceof JSSymbol))) {
        const yComp = ToPrimitive(realm,y);
        if (!(yComp instanceof NormalCompletion))
            return yComp;
        return abstractEqualityComparison(realm,x,yComp.value);
    }

    if ((x instanceof JSObject) &&
        ((y instanceof JSString) || (y instanceof JSNumber) || (y instanceof JSSymbol))) {
        const xComp = ToPrimitive(realm,x);
        if (!(xComp instanceof NormalCompletion))
            return xComp;
        return abstractEqualityComparison(realm,xComp.value,y);
    }

    return new NormalCompletion(false);
}

// ES6 Section 7.2.13: Strict Equality Comparison

export function strictEqualityComparison(realm: Realm, x: JSValue, y: JSValue): boolean {
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
