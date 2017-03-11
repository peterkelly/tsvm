// Copyright 2016-2017 Peter Kelly <peter@pmkelly.net>
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
    ValueType,
    JSValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSInteger,
    JSInt32,
    JSUInt32,
    JSInt16,
    JSUInt16,
    JSInt8,
    JSUInt8,
    JSObject,
    Completion,
    NormalCompletion,
    Realm,
} from "./datatypes";
import {
    pr_double_isPositiveZero,
    pr_double_isNegativeZero,
    pr_double_isNaN,
    pr_double_to_string,
    pr_string_to_double,
} from "./primitives";
import {
    IsCallable,
} from "./07-02-testcompare";
import {
    Get,
    GetMethod,
    Call,
} from "./07-03-objects";
import {
    BooleanObject,
} from "./19-03-boolean";
import {
    NumberObject,
} from "./20-01-number";
import {
    StringObject,
} from "./21-01-string";
import {
    SymbolObject,
} from "./19-04-symbol";

// ES6 Section 7.1.1: ToPrimitive (input [, PreferredType])

export function ToPrimitive(realm: Realm, input: JSValue | Completion<JSValue>, preferredType?: ValueType): Completion<JSValue> {
    if (input instanceof NormalCompletion)
        input = input.value;
    else if (!(input instanceof JSValue))
        return input;

    if (!(input instanceof JSObject))
        return new NormalCompletion(input);

    // When Type(input) is Object, the following steps are taken:

    let hint: JSString;

    // 1. If PreferredType was not passed, let hint be "default".
    if (preferredType === undefined) {
        hint = new JSString("default");
    }
    // 2. Else if PreferredType is hint String, let hint be "string".
    else if (preferredType == ValueType.String) {
        hint = new JSString("string");
    }
    // 3. Else PreferredType is hint Number, let hint be "number".
    else {
        hint = new JSString("number");
    }

    // 4. Let exoticToPrim be GetMethod(input, @@toPrimitive).
    // 5. ReturnIfAbrupt(exoticToPrim).
    const exoticToPrimComp = GetMethod(realm,input,JSSymbol.$$toPrimitive);
    if (!(exoticToPrimComp instanceof NormalCompletion))
        return exoticToPrimComp;
    const exoticToPrim = exoticToPrimComp.value;

    // 6. If exoticToPrim is not undefined, then
    if (!(exoticToPrim instanceof JSUndefined)) {
        // a. Let result be Call(exoticToPrim, input, «hint»).
        // b. ReturnIfAbrupt(result).
        const resultComp = Call(realm,exoticToPrim,input,[hint]);
        if (!(resultComp instanceof NormalCompletion))
            return resultComp;
        const result = resultComp.value;

        // c. If Type(result) is not Object, return result.
        if (!(result instanceof JSObject))
            return new NormalCompletion(result);

        // d. Throw a TypeError exception.
        return realm.throwTypeError("ToPrimitive: no $$toPrimitive method");
    }

    // 7. If hint is "default", let hint be "number".
    if (hint.stringValue === "default")
        hint = new JSString("number");

    // 6. Return OrdinaryToPrimitive(input,hint).
    if (hint.stringValue === "string")
        return OrdinaryToPrimitive(realm,input,"string");
    else
        return OrdinaryToPrimitive(realm,input,"number");
}

export function OrdinaryToPrimitive(realm: Realm, O: JSObject, hint: "string" | "number"): Completion<JSValue> {
    // 1. Assert: Type(O) is Object
    // (guaranteed by type signature)

    // 2. Assert: Type(hint) is String and its value is either "string" or "number".
    // (guaranteed by type signature; that's why we pass literals, not the hint variable, above)

    let methodNames: JSString[];

    // 3. If hint is "string", then
    if (hint === "string") {
        // a. Let methodNames be «"toString", "valueOf"».
        methodNames = [new JSString("toString"), new JSString("valueOf")];
    }
    // 4. Else,
    else {
        // a. Let methodNames be «"valueOf", "toString"».
        methodNames = [new JSString("valueOf"), new JSString("toString")];
    }

    // 5. For each name in methodNames in List order, do
    for (const name of methodNames) {
        // a. Let method be Get(O, name).
        // b. ReturnIfAbrupt(method).
        const methodComp = Get(realm,O,name);
        if (!(methodComp instanceof NormalCompletion))
            return methodComp;
        const method = methodComp.value;

        // c. If IsCallable(method) is true, then
        if (IsCallable(realm,method)) {
            // i. Let result be Call(method, O).
            // ii. ReturnIfAbrupt(result).
            const resultComp = Call(realm,method,O,[]);
            if (!(resultComp instanceof NormalCompletion))
                return resultComp;
            const result = resultComp.value;

            // iii. If Type(result) is not Object, return result.
            if (!(result instanceof JSObject))
                return new NormalCompletion(result);
        }
    }

    // 6. Throw a TypeError exception.
    return realm.throwTypeError("OrdinaryToPrimitive: No toString or valueOf method");
}

// ES6 Section 7.1.2: ToBoolean (argument)

export function ToBoolean(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSBoolean> {
    if (argument instanceof NormalCompletion)
        argument = argument.value;
    else if (!(argument instanceof JSValue))
        return argument;

    if (argument instanceof JSUndefined)
        return new NormalCompletion(new JSBoolean(false));
    if (argument instanceof JSNull)
        return new NormalCompletion(new JSBoolean(false));
    if (argument instanceof JSBoolean)
        return new NormalCompletion(argument);
    if (argument instanceof JSNumber) {
        const num = argument.numberValue;
        if (pr_double_isPositiveZero(num) || pr_double_isNegativeZero(num) || pr_double_isNaN(num))
            return new NormalCompletion(new JSBoolean(false));
        else
            return new NormalCompletion(new JSBoolean(true));
    }
    if (argument instanceof JSString) {
        const result = (argument.stringValue.length == 0);
        return new NormalCompletion(new JSBoolean(result));
    }
    if (argument instanceof JSSymbol)
        return new NormalCompletion(new JSBoolean(true));
    if (argument instanceof JSObject)
        return new NormalCompletion(new JSBoolean(true));

    throw new Error("Unhandled case; should never get here");
}

// ES6 Section 7.1.3: ToNumber (argument)

export function ToNumber(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSNumber> {
    if (argument instanceof NormalCompletion)
        argument = argument.value;
    else if (!(argument instanceof JSValue))
        return argument;

    if (argument instanceof JSUndefined)
        return new NormalCompletion(new JSNumber(NaN));
    if (argument instanceof JSNull)
        return new NormalCompletion(new JSNumber(0));
    if (argument instanceof JSBoolean) {
        return new NormalCompletion(ToNumber_boolean(realm,argument));
    }
    if (argument instanceof JSNumber)
        return new NormalCompletion(argument);
    if (argument instanceof JSString)
        return new NormalCompletion(ToNumber_string(realm,argument));
    if (argument instanceof JSSymbol)
        return realm.throwTypeError("ToNumber applied to symbol");
    if (argument instanceof JSObject) {
        const primValueComp = ToPrimitive(realm,argument,ValueType.Number);
        if (!(primValueComp instanceof NormalCompletion))
            return primValueComp;
        const primValue = primValueComp.value;
        return ToNumber(realm,primValue);
    }
    throw new Error("Unhandled case; should never get here");
}

export function ToNumber_string(realm: Realm, argument: JSString): JSNumber {
    return new JSNumber(pr_string_to_double(argument.stringValue));
}

export function ToNumber_boolean(realm: Realm, argument: JSBoolean): JSNumber {
    if (argument.booleanValue)
        return new JSNumber(1);
    else
        return new JSNumber(0);
}

// ES6 Section 7.1.4: ToInteger (argument)

export function ToInteger(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSInteger> {
    throw new Error("ToInteger not implemented");
}

// ES6 Section 7.1.5: ToInt32 (argument)

export function ToInt32(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSInt32> {
    throw new Error("ToInt32 not implemented");
}

// ES6 Section 7.1.6: ToUint32 (argument)

export function ToUint32(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSUInt32> {
    throw new Error("ToUint32 not implemented");
}

// ES6 Section 7.1.7: ToInt16 (argument)

export function ToInt16(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSInt16> {
    throw new Error("ToInt16 not implemented");
}

// ES6 Section 7.1.8: ToUint16 (argument)

export function ToUint16(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSUInt16> {
    throw new Error("ToUint16 not implemented");
}

// ES6 Section 7.1.9: ToInt8 (argument)

export function ToInt8(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSInt8> {
    throw new Error("ToInt8 not implemented");
}

// ES6 Section 7.1.10: ToUint8 (argument)

export function ToUint8(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSUInt8> {
    throw new Error("ToUint8 not implemented");
}

// ES6 Section 7.1.11: ToUint8Clamp (argument)

export function ToUint8Clamp(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSUInt8> {
    throw new Error("ToUint8Clamp not implemented");
}

// ES6 Section 7.1.12: ToString (argument)

export function ToString(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSString> {
    if (argument instanceof NormalCompletion)
        argument = argument.value;
    else if (!(argument instanceof JSValue))
        return argument;

    if (argument instanceof JSUndefined)
        return new NormalCompletion(new JSString("undefined"));
    if (argument instanceof JSNull)
        return new NormalCompletion(new JSString("null"));
    if (argument instanceof JSBoolean) {
        if (argument.booleanValue)
            return new NormalCompletion(new JSString("true"));
        else
            return new NormalCompletion(new JSString("false"));
    }
    if (argument instanceof JSNumber) {
        const result = pr_double_to_string(argument.numberValue);
        return new NormalCompletion(new JSString(result));
    }
    if (argument instanceof JSString)
        return new NormalCompletion(argument);
    if (argument instanceof JSSymbol)
        return realm.throwTypeError("ToString applied to symbol");
    if (argument instanceof JSObject) {
        const primValueComp = ToPrimitive(realm,argument,ValueType.String);
        if (!(primValueComp instanceof NormalCompletion))
            return primValueComp;
        const primValue = primValueComp.value;
        return ToString(realm,primValue);
    }
    throw new Error("Unhandled case; should never get here");
}

// ES6 Section 7.1.13: ToObject (argument)

export function ToObject(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSObject> {
    if (argument instanceof NormalCompletion)
        argument = argument.value;
    else if (!(argument instanceof JSValue))
        return argument;

    switch (argument.type) {
        case ValueType.Undefined:
            if (argument instanceof JSUndefined)
                return realm.throwTypeError("ToObject applied to undefined");
            break;
        case ValueType.Null:
            if (argument instanceof JSNull)
                return realm.throwTypeError("ToObject applied to null");
            break;
        case ValueType.Boolean:
            if (argument instanceof JSBoolean) {
                const proto = realm.intrinsics.BooleanPrototype;
                const obj = new BooleanObject(proto,argument);
                return new NormalCompletion(obj);
            }
            break;
        case ValueType.Number:
            if (argument instanceof JSNumber) {
                const proto = realm.intrinsics.NumberPrototype;
                const obj = new NumberObject(proto,argument);
                return new NormalCompletion(obj);
            }
            break;
        case ValueType.String:
            if (argument instanceof JSString) {
                const proto = realm.intrinsics.StringPrototype;
                const obj = new StringObject(proto,argument);
                return new NormalCompletion(obj);
            }
            break;
        case ValueType.Symbol:
            if (argument instanceof JSSymbol) {
                const proto = realm.intrinsics.SymbolPrototype;
                const obj = new SymbolObject(proto,argument);
                return new NormalCompletion(obj);
            }
            break;
        case ValueType.Object:
            if (argument instanceof JSObject)
                return new NormalCompletion(argument);
            break;
    }
    throw new Error("Incorrect argument.type: "+argument.type);
}

// ES6 Section 7.1.14: ToPropertyKey (argument)

export function ToPropertyKey(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSPropertyKey> {
    // 1. Let key be ToPrimitive(argument, hint String).
    // 2. ReturnIfAbrupt(key).
    const keyComp = ToPrimitive(realm,argument,ValueType.String);
    if (!(keyComp instanceof NormalCompletion))
        return keyComp;
    const key = keyComp.value;

    // 3. If Type(key) is Symbol, then
    if (key instanceof JSSymbol) {
        // a. Return key.
        return new NormalCompletion(key);
    }

    // 4. Return ToString(key).
    return ToString(realm,key);
}

// ES6 Section 7.1.15: ToLength (argument)

export function ToLength(realm: Realm, argument: JSValue | Completion<JSValue>): Completion<JSNumber> {
    throw new Error("ToLength not implemented");
}

// ES6 Section 7.1.16: CanonicalNumericIndexString (argument)

export function CanonicalNumericIndexString(realm: Realm, argument: JSString): Completion<JSString | JSUndefined> {
    throw new Error("CanonicalNumericIndexString not implemented");
}
