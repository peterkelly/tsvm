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
    Call,
    CreateDataProperty,
    CreateMethodProperty,
} from "./datatypes";
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

// ES6 Section 7.2: Testing and Comparison Operations

// ES6 Section 7.2.1: RequireObjectCoercible (argument)

export function RequireObjectCoercible(realm: Realm, argument: JSValue): Completion<JSValue> {
    switch (argument.type) {
        case ValueType.Undefined:
        case ValueType.Null:
            return intrinsic_ThrowTypeError(realm);
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
    return O.__IsExtensible__();
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

// ES6 Section 7.3: Operations on Objects

// ES6 Section 7.3.1: Get (O, P)

export function Get(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<JSValue> {
    return O.__Get__(P,O);
}

// ES6 Section 7.3.2: GetV (V, P)

export function GetV(realm: Realm, V: JSValue, P: JSPropertyKey): Completion<JSValue> {
    const OComp = ToObject(realm,V);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;
    return O.__Get__(P,O);
}

// ES6 Section 7.3.3 Set: (O, P, V, Throw)

export function Set(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue, Throw: boolean): Completion<boolean> {
    const successComp = O.__Set__(P,V,O);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success && Throw)
        return intrinsic_ThrowTypeError(realm);
    return new NormalCompletion(success);
}

// ES6 Section 7.3.6: CreateDataPropertyOrThrow (O, P, V)

export function CreateDataPropertyOrThrow(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue): Completion<boolean> {
    const successComp = CreateDataProperty(realm,O,P,V);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success)
        return intrinsic_ThrowTypeError(realm);
    return new NormalCompletion(success);
}

// ES6 Section 7.3.7: DefinePropertyOrThrow (O, P, desc)

export function DefinePropertyOrThrow(realm: Realm, O: JSObject, P: JSPropertyKey, desc: PropertyDescriptor): Completion<boolean> {
    const successComp = O.__DefineOwnProperty__(P,desc);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success)
        return intrinsic_ThrowTypeError(realm);
    return new NormalCompletion(success);
}

// ES6 Section 7.3.8: DeletePropertyOrThrow (O, P)

export function DeletePropertyOrThrow(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const successComp = O.__Delete__(P);
    if (!(successComp instanceof NormalCompletion))
        return successComp;
    const success = successComp.value;
    if (!success)
        return intrinsic_ThrowTypeError(realm);
    return new NormalCompletion(success);
}

// ES6 Section 7.3.9: GetMethod (O, P)

export function GetMethod(realm: Realm, O: JSValue, P: JSPropertyKey): Completion<JSValue> {
    const funcComp = GetV(realm,O,P);
    if (!(funcComp instanceof NormalCompletion))
        return funcComp;
    const func = funcComp.value;
    if ((func instanceof JSUndefined) || (func instanceof JSNull))
        return new NormalCompletion(new JSUndefined());
    if (!IsCallable(realm,func))
        return intrinsic_ThrowTypeError(realm);
    return new NormalCompletion(func);
}

// ES6 Section 7.3.10: HasProperty (O, P)

export function HasProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    return O.__HasProperty__(P);
}

// ES6 Section 7.3.11: HasOwnProperty (O, P)

export function HasOwnProperty(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const descComp = O.__GetOwnProperty__(P,false);
    if (!(descComp instanceof NormalCompletion))
        return descComp;
    const desc = descComp.value;
    if (desc instanceof JSUndefined)
        return new NormalCompletion(false);
    return new NormalCompletion(true);
}

// ES6 Section 7.3.13: Construct (F, [argumentsList], [newTarget])

export function Construct(realm: Realm, F: JSObject, argumentList: JSValue[], newTarget: JSObject): Completion<JSObject> {
    if (!F.implementsConstruct)
        throw new Error("Attempt to call Construct ot an object that is not a constructor");
    return F.__Construct__(argumentList,newTarget);
}

// ES6 Section 7.3.14: SetIntegrityLevel (O, level)

export function SetIntegrityLevel(realm: Realm, O: JSObject, level: string): Completion<UnknownType> {
    throw new Error("SetIntegrityLevel not implemented");
}

// ES6 Section 7.3.15: TestIntegrityLevel (O, level)

export function TestIntegrityLevel(realm: Realm, O: JSObject, level: string): Completion<UnknownType> {
    throw new Error("TestIntegrityLevel not implemented");
}

// ES6 Section 7.3.16: CreateArrayFromList (elements)

export function CreateArrayFromList(realm: Realm, elements: JSValue[]): Completion<UnknownType> {
    throw new Error("CreateArrayFromList not implemented");
}

// ES6 Section 7.3.17: CreateListFromArrayLike (obj [, elementTypes])

export function CreateListFromArrayLike(realm: Realm, obj: JSValue, elementTypes: any): Completion<UnknownType> {
    throw new Error("CreateListFromArrayLike not implemented");
}

// ES6 Section 7.3.18: Invoke(O, P, [argumentsList])

export function Invoke(realm: Realm, O: JSObject, P: JSPropertyKey, argumentsList: JSValue[]): Completion<JSValue> {
    const funcComp = GetV(realm,O,P);
    if (!(funcComp instanceof NormalCompletion))
        return funcComp;
    const func = funcComp.value;
    return Call(realm,func,O,argumentsList);
}

// ES6 Section 7.3.19: OrdinaryHasInstance (C, O)

export function OrdinaryHasInstance(realm: Realm, C: any, O: JSObject): Completion<UnknownType> {
    throw new Error("OrdinaryHasInstance not implemented");
}

// ES6 Section 7.3.20: SpeciesConstructor (O, defaultConstructor)

export function SpeciesConstructor(realm: Realm, O: JSObject, defaultConstructor: any): Completion<UnknownType> {
    throw new Error("SpeciesConstructor not implemented");
}

// ES6 Section 7.3.21: EnumerableOwnNames (O)

export function EnumerableOwnNames(realm: Realm, O: JSObject): Completion<UnknownType> {
    throw new Error("EnumerableOwnNames not implemented");
}

// ES6 Section 7.3.22: GetFunctionRealm (obj)

export function GetFunctionRealm(realm: Realm, obj: JSObject): Completion<UnknownType> {
    throw new Error("GetFunctionRealm not implemented");
}

// ES6 Section 7.4: Operations on Iterator Objects

// ES6 Section 7.4.1: GetIterator (obj, method)

export function GetIterator(realm: Realm, obj: any, method: any): Completion<UnknownType> {
    throw new Error("GetIterator not implemented");
}

// ES6 Section 7.4.2: IteratorNext (iterator, value)

export function IteratorNext(realm: Realm, iterator: any, value: any): Completion<UnknownType> {
    throw new Error("IteratorNext not implemented");
}

// ES6 Section 7.4.3: IteratorComplete (iterResult)

export function IteratorComplete(realm: Realm, iterResult: any): Completion<UnknownType> {
    throw new Error("IteratorComplete not implemented");
}

// ES6 Section 7.4.4: IteratorValue (iterResult)

export function IteratorValue(realm: Realm, iterResult: any): Completion<UnknownType> {
    throw new Error("IteratorValue not implemented");
}

// ES6 Section 7.4.5: IteratorStep (iterator)

export function IteratorStep(realm: Realm, iterator: any): Completion<UnknownType> {
    throw new Error("IteratorStep not implemented");
}

// ES6 Section 7.4.6: IteratorClose (iterator, completion)

export function IteratorClose(realm: Realm, iterator: any, completion: any): Completion<UnknownType> {
    throw new Error("IteratorClose not implemented");
}

// ES6 Section 7.4.7: CreateIterResultObject (value, done)

export function CreateIterResultObject(realm: Realm, value: any, done: any): Completion<UnknownType> {
    throw new Error("CreateIterResultObject not implemented");
}

// ES6 Section 7.4.8: CreateListIterator (list)

export function CreateListIterator(realm: Realm, list: any): Completion<UnknownType> {
    throw new Error("CreateListIterator not implemented");
}

// ES6 Section 7.4.8.1: ListIterator next()

export function ListIterator_next(realm: Realm): Completion<UnknownType> {
    throw new Error("ListIterator_next not implemented");
}
