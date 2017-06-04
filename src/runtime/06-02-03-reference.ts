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

// ES6 Section 6.2.3: The Reference Specification Type

import {
    Realm,
    JSValue,
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
    ReferenceBase,
    Reference,
    AbstractReference,
    UnresolvableReference,
    PropertyReference,
    EnvironmentReference,
    SuperReference,
    TypeIsReference,
    Empty,
} from "./datatypes";
import {
    ToObject,
} from "./07-01-conversion";
import {
    Set,
} from "./07-03-objects";

export function GetBase(realm: Realm, V: Reference): ReferenceBase {
    return V.base;
}

export function GetReferencedName(realm: Realm, V: Reference): JSPropertyKey {
    return V.name;
}

export function IsStrictReference(realm: Realm, V: Reference): boolean {
    return V.strict;
}

export function HasPrimitiveBase(realm: Realm, V: Reference): boolean {
    return ((V.base instanceof JSBoolean) ||
            (V.base instanceof JSString) ||
            (V.base instanceof JSSymbol) ||
            (V.base instanceof JSNumber));
}

export function IsPropertyReference(realm: Realm, V: Reference): V is PropertyReference {
    return ((V.base instanceof JSObject) || HasPrimitiveBase(realm, V));
}

export function IsUnresolvableReference(realm: Realm, V: Reference): V is UnresolvableReference {
    return (V.base instanceof JSUndefined);
}

export function IsSuperReference(realm: Realm, V: Reference): V is SuperReference {
    return (V instanceof SuperReference);
}

// ES6 Section 6.2.3.1: GetValue (V)

export function GetValue(realm: Realm, VComp: Reference | JSValue | Completion<Reference | JSValue>): Completion<JSValue> {
    // 1. ReturnIfAbrupt(V).
    // 2. If Type(V) is not Reference, return V.
    let V: Reference | JSValue;
    if ((VComp instanceof AbstractReference) || (VComp instanceof JSValue))
        V = VComp;
    else if (VComp instanceof NormalCompletion)
        V = VComp.value;
    else
        return VComp;

    // 2. If Type(V) is not Reference, return V.
    if (!(V instanceof AbstractReference))
        return new NormalCompletion(V);

    // 3. Let base be GetBase(V).
    // (We use different classes to represent references with different types of bases, so we
    // access the base within the cases for each, so the type checker gets the appropriate type).

    // 4. If IsUnresolvableReference(V), throw a ReferenceError exception.
    if (V instanceof UnresolvableReference) {
        let nameStr: string;
        if (V.name instanceof JSString)
            nameStr = V.name.stringValue;
        else if ((V.name instanceof JSSymbol) && (V.name.description instanceof JSString))
            nameStr = V.name.description.stringValue;
        else
            nameStr = "[symbol]";
        return realm.throwReferenceError(name + " is not defined");
    }
    // 5. If IsPropertyReference(V), then
    else if (V instanceof PropertyReference) {
        let base = V.base;
        if (!(base instanceof JSObject)) {
            const baseComp = ToObject(realm, base);
            if (!(baseComp instanceof NormalCompletion))
                return baseComp;
            base = baseComp.value;
        }
        const name = GetReferencedName(realm, V);
        const thisValueComp = GetThisValue(realm, V);
        if (!(thisValueComp instanceof NormalCompletion))
            return thisValueComp;
        const thisValue = thisValueComp.value;
        return base.__Get__(realm, name, thisValue);
    }
    // 6. Else base must be an Environment Record,
    else {
        // a. Return base.GetBindingValue(GetReferencedName(V), IsStrictReference(V))
        const name: string = V.name.stringValue;
        const strict: boolean = IsStrictReference(realm, V);
        return V.base.GetBindingValue(name, strict);
    }
}

// ES6 Section 6.2.3.2: PutValue (V, W)

export function PutValue(realm: Realm, Vcomp: Completion<JSValue | Reference>, Wcomp: Completion<JSValue> | JSValue): Completion<void> {

    // 1. ReturnIfAbrupt(V).
    if (!(Vcomp instanceof NormalCompletion))
        return Vcomp;
    const V = Vcomp.value;

    // 2. ReturnIfAbrupt(W).
    let W: JSValue;
    if (Wcomp instanceof JSValue) {
        W = Wcomp;
    }
    else {
        if (!(Wcomp instanceof NormalCompletion))
            return Wcomp;
        W = Wcomp.value;
    }

    // 3. If Type(V) is not Reference, throw a ReferenceError exception.
    if (!TypeIsReference(V))
        return realm.throwReferenceError("LHS of assignment is not a reference");

    // 4. Let base be GetBase(V).
    // (done below)

    // 5. If IsUnresolvableReference(V), then
    if (IsUnresolvableReference(realm, V)) {
        // a. If IsStrictReference(V) is true, then
        if (V.strict) {
            // i. Throw ReferenceError exception.
            if (V.name instanceof JSString)
                return realm.throwReferenceError(V.name.stringValue + " is not defined");
            else
                return realm.throwReferenceError(V.name.stringRep + " is not defined");
        }

        // b. Let globalObj be GetGlobalObject().
        const globalObj = realm.globalThis;

        // c. Return Set(globalObj, GetReferencedName(V), W, false).
        const setComp = Set(realm, globalObj, GetReferencedName(realm, V), W, false);
        if (!(setComp instanceof NormalCompletion))
            return setComp;
        return new NormalCompletion(undefined);
    }
    // 6. Else if IsPropertyReference(V), then
    else if (IsPropertyReference(realm, V)) {
        let base: JSObject;

        // a. If HasPrimitiveBase(V) is true, then
        if (!(V.base instanceof JSObject)) {
            // i. Assert: In this case, base will never be null or undefined.
            if ((V.base instanceof JSNull) || (V.base instanceof JSUndefined))
                throw new Error("base should not be null or undefined");
            // ii. Set base to ToObject(base).
            const base2Comp = ToObject(realm, V.base);
            if (!(base2Comp instanceof NormalCompletion))
                return base2Comp;
            base = base2Comp.value;
        }
        else {
            base = V.base;
        }

        // b. Let succeeded be base.[[Set]](GetReferencedName(V), W, GetThisValue(V)).
        // c. ReturnIfAbrupt(succeeded).
        const thisValueComp = GetThisValue(realm, V);
        if (!(thisValueComp instanceof NormalCompletion))
            return thisValueComp;
        const thisValue = thisValueComp.value;
        const succeededComp = base.__Set__(realm, V.name, W, thisValue);
        if (!(succeededComp instanceof NormalCompletion))
            return succeededComp;
        const succeeded = succeededComp.value;

        // d. If succeeded is false and IsStrictReference(V) is true, throw a TypeError exception.
        if (!succeeded && IsStrictReference(realm, V))
            return realm.throwTypeError("Cannot set property which only has a getter");

        // e. Return.
        return new NormalCompletion(undefined);
    }
    // 7. Else base must be an Environment Record.
    else {
        // a. Return base.SetMutableBinding(GetReferencedName(V), W, IsStrictReference(V)) (see 8.1.1).
        return V.base.SetMutableBinding(V.name.stringValue, W, V.strict);
    }

    // NOTE The object that may be created in step 6.a.ii is not accessible outside of the above
    // algorithm and the ordinary object [[Set]] internal method. An implementation might choose to
    // avoid the actual creation of that object.
}

// ES6 Section 6.2.3.3: GetThisValue (V)

export function GetThisValue(realm: Realm, V: Reference): Completion<JSValue> {
    if (V instanceof SuperReference)
        return new NormalCompletion(V.thisValue);
    else {
        const result = GetBase(realm, V);
        if (!(result instanceof JSValue))
            throw new Error("base is not a value"); // FIXME: What to do here?
        return new NormalCompletion(result);
    }
}

// ES6 Section 6.2.3.4: InitializeReferencedBinding (V, W)

export function InitializeReferencedBinding(realm: Realm, V: EnvironmentReference, W: JSValue): Completion<Empty> {
    // 1. ReturnIfAbrupt(V).
    // (implicit in parameter type)

    // 2. ReturnIfAbrupt(W).
    // (implicit in parameter type)

    // 3. Assert: Type(V) is Reference.
    // (implicit in parameter type)

    // 4. Assert: IsUnresolvableReference(V) is false.
    // (implicit in parameter type)

    // 5. Let base be GetBase(V).
    // 6. Assert: base is an Environment Record.
    // (implicit in parameter type)

    // 7. Return base.InitializeBinding(GetReferencedName(V), W).
    const initComp = V.base.InitializeBinding(V.name.stringValue, W);
    if (!(initComp instanceof NormalCompletion))
        return initComp;
    return new NormalCompletion(new Empty());
}
