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

// ES6 Section 6.2.3: The Reference Specification Type

import {
    Realm,
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
    ReferenceBase,
    SuperReferenceBase,
    Reference,
    SuperReference,
} from "./datatypes";
import {
    ToObject,
} from "./07-01-conversion";

export function GetBase(realm: Realm, V: Reference): ReferenceBase {
    return V.base;
}

export function GetReferencedName(realm: Realm, V: Reference): JSPropertyKey {
    return V.name;
}

export function IsStrictReference(realm: Realm, V: Reference): boolean {
    return V.strict.booleanValue;
}

export function HasPrimitiveBase(realm: Realm, V: Reference): boolean {
    return ((V.base instanceof JSBoolean) ||
            (V.base instanceof JSString) ||
            (V.base instanceof JSSymbol) ||
            (V.base instanceof JSNumber));
}

export function IsPropertyReference(realm: Realm, V: Reference): boolean {
    return ((V.base instanceof JSObject) || HasPrimitiveBase(realm,V));
}

export function IsUnresolvableReference(realm: Realm, V: Reference): boolean {
    return (V.base instanceof JSUndefined);
}

export function IsSuperReference(realm: Realm, V: Reference): boolean {
    return (V instanceof SuperReference);
}

// ES6 Section 6.2.3.1: GetValue (V)

export function GetValue(realm: Realm, V: Reference | JSValue): Completion<JSValue> {
    if (!(V instanceof Reference))
        return new NormalCompletion(V);
    let base = GetBase(realm,V);
    if (base instanceof JSUndefined)
        throw new Error("FIXME: Should throw ReferenceError here, but can't import it");
    if ((base instanceof JSUndefined) ||
        (base instanceof JSObject) ||
        (base instanceof JSBoolean) ||
        (base instanceof JSPropertyKey) ||
        (base instanceof JSNumber)) {
        if (!(base instanceof JSObject)) {
            const baseComp = ToObject(realm,base);
            if (!(baseComp instanceof NormalCompletion))
                return baseComp;
            base = baseComp.value;
            // base = realm.intrinsics.Object;
        }
        const name = GetReferencedName(realm,V);
        const thisValueComp = GetThisValue(realm,V);
        if (!(thisValueComp instanceof NormalCompletion))
            return thisValueComp;
        const thisValue = thisValueComp.value;
        return base.__Get__(name,thisValue);
    }
    else {
        const name: string = GetReferencedName(realm,V).stringRep;
        const strict: boolean = IsStrictReference(realm,V);
        return base.GetBindingValue(name,strict);
    }
}

// ES6 Section 6.2.3.2: PutValue (V, W)

export function PutValue(realm: Realm, V: any, W: any): Completion<void> {
    throw new Error("PutValue not implemented");
}

// ES6 Section 6.2.3.3: GetThisValue (V)

export function GetThisValue(realm: Realm, V: Reference): Completion<JSValue> {
    if (V instanceof SuperReference)
        return new NormalCompletion(V.thisValue);
    else {
        const result = GetBase(realm,V);
        if (!(result instanceof JSValue))
            throw new Error("base is not a value"); // FIXME: What to do here?
        return new NormalCompletion(result);
    }
}

// ES6 Section 6.2.3.4: InitializeReferencedBinding (V, W)

export function InitializeReferencedBinding(realm: Realm, V: any): Completion<void> {
    throw new Error("InitializeReferencedBinding not implemented");
}
