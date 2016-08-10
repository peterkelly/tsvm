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

// ES6 Section 6.2.4: The Property Descriptor Specification Type

import {
    UnknownType,
    JSValue,
    JSUndefined,
    JSString,
    JSObject,
    DescriptorFields,
    Completion,
    NormalCompletion,
    Realm,
} from "./datatypes";
import {
    ToBoolean,
} from "./07-01-conversion";
import {
    IsCallable,
} from "./07-02-testcompare";
import {
    HasProperty,
    Get,
} from "./07-03-objects";

// ES6 Section 6.2.4.1: IsAccessorDescriptor (Desc)

export function IsAccessorDescriptor(Desc: DescriptorFields | undefined): boolean {
    // 1. If Desc is undefined, return false
    if (Desc === undefined)
        return false;
    // 2. If both Desc.[[Get]] and Desc.[[Set]] are absent, return false.
    if ((Desc.__get__ === undefined) && (Desc.__set__ === undefined))
        return false;
    // 3. Return true.
    return true;
}

// ES6 Section 6.2.4.2: IsDataDescriptor (Desc)

export function IsDataDescriptor(Desc: DescriptorFields | undefined): boolean {
    // 1. If Desc is undefined, return false.
    if (Desc === undefined)
        return false;
    // 2. If both Desc.[[Value]] and Desc.[[Writable]] are absent, return false.
    if ((Desc.value === undefined) && (Desc.writable === undefined))
        return false;
    // 3. Return true.
    return true;
}

// ES6 Section 6.2.4.3: IsGenericDescriptor (Desc)

export function IsGenericDescriptor(Desc: DescriptorFields | undefined): boolean {
    // 1. If Desc is undefined, return false.
    if (Desc === undefined)
        return false;
    // 2. If IsAccessorDescriptor(Desc) and IsDataDescriptor(Desc) are both false, return true.
    if (!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc))
        return true;
    // 3. Return false.
    return false;
}

// ES6 Section 6.2.4.4: FromPropertyDescriptor (Desc)

export function FromPropertyDescriptor(realm: Realm, Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("FromPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.5: ToPropertyDescriptor (Obj)

export function ToPropertyDescriptor(realm: Realm, Obj: JSValue | Completion<JSValue>): Completion<DescriptorFields> {
    // 1. ReturnIfAbrupt(Obj).
    if (Obj instanceof NormalCompletion)
        Obj = Obj.value;
    else if (!(Obj instanceof JSValue))
        return Obj;

    // 2. If Type(Obj) is not Object, throw a TypeError exception.
    if (!(Obj instanceof JSObject))
        return realm.throwTypeError("ToPropertyDescriptor: Obj is not an object");

    // 3. Let desc be a new Property Descriptor that initially has no fields.
    const desc: DescriptorFields = {};

    // 4. Let hasEnumerable be HasProperty(Obj, "enumerable").
    // 5. ReturnIfAbrupt(hasEnumerable).
    const hasEnumerableComp = HasProperty(realm,Obj,new JSString("enumerable"));
    if (!(hasEnumerableComp instanceof NormalCompletion))
        return hasEnumerableComp;
    const hasEnumerable = hasEnumerableComp.value;

    // 6. If hasEnumerable is true, then
    if (hasEnumerable) {
        // a. Let enum be ToBoolean(Get(Obj, "enumerable")).
        // b. ReturnIfAbrupt(enum).
        const enumComp = ToBoolean(realm,Get(realm,Obj,new JSString("enumerable")));
        if (!(enumComp instanceof NormalCompletion))
            return enumComp;
        const enumerable = enumComp.value;
        // c. Set the [[Enumerable]] field of desc to enum.
        desc.enumerable = enumerable.booleanValue;
    }

    // 7. Let hasConfigurable be HasProperty(Obj, "configurable").
    // 8. ReturnIfAbrupt(hasConfigurable).
    const hasConfigurableComp = HasProperty(realm,Obj,new JSString("configurable"));
    if (!(hasConfigurableComp instanceof NormalCompletion))
        return hasConfigurableComp;
    const hasConfigurable = hasConfigurableComp.value;

    // 9. If hasConfigurable is true, then
    if (hasConfigurable) {
        // a. Let conf be ToBoolean(Get(Obj, "configurable")).
        // b. ReturnIfAbrupt(conf).
        const confComp = ToBoolean(realm,Get(realm,Obj,new JSString("configurable")));
        if (!(confComp instanceof NormalCompletion))
            return confComp;
        const conf = confComp.value;
        // c. Set the [[Configurable]] field of desc to conf.
        desc.configurable = conf.booleanValue;
    }

    // 10. Let hasValue be HasProperty(Obj, "value").
    // 11. ReturnIfAbrupt(hasValue).
    const hasValueComp = HasProperty(realm,Obj,new JSString("value"));
    if (!(hasValueComp instanceof NormalCompletion))
        return hasValueComp;
    const hasValue = hasValueComp.value;

    // 12. If hasValue is true, then
    if (hasValue) {
        // a. Let value be Get(Obj, "value").
        // b. ReturnIfAbrupt(value).
        const valueComp = Get(realm,Obj,new JSString("value"));
        if (!(valueComp instanceof NormalCompletion))
            return valueComp;
        const value = valueComp.value;
        // c. Set the [[Value]] field of desc to value.
        desc.value = value;
    }

    // 13. Let hasWritable be HasProperty(Obj, "writable").
    // 14. ReturnIfAbrupt(hasWritable).
    const hasWritableComp = HasProperty(realm,Obj,new JSString("writable"));
    if (!(hasWritableComp instanceof NormalCompletion))
        return hasWritableComp;
    const hasWritable = hasWritableComp.value;

    // 15. If hasWritable is true, then
    if (hasWritable) {
        // a. Let writable be ToBoolean(Get(Obj, "writable")).
        // b. ReturnIfAbrupt(writable).
        const writableComp = ToBoolean(realm,Get(realm,Obj,new JSString("writable")));
        if (!(writableComp instanceof NormalCompletion))
            return writableComp;
        const writable = writableComp.value;
        // c. Set the [[Writable]] field of desc to writable.
        desc.writable = writable.booleanValue;
    }

    // 16. Let hasGet be HasProperty(Obj, "get").
    // 17. ReturnIfAbrupt(hasGet).
    const hasGetComp = HasProperty(realm,Obj,new JSString("get"));
    if (!(hasGetComp instanceof NormalCompletion))
        return hasGetComp;
    const hasGet = hasGetComp.value;

    // 18. If hasGet is true, then
    if (hasGet) {
        // a. Let getter be Get(Obj, "get").
        const getterComp = Get(realm,Obj,new JSString("get"));
        // b. ReturnIfAbrupt(getter).
        if (!(getterComp instanceof NormalCompletion))
            return getterComp;
        const getter = getterComp.value;
        // c. If IsCallable(getter) is false and getter is not undefined, throw a TypeError exception.
        // d. Set the [[Get]] field of desc to getter.
        if ((getter instanceof JSObject) && IsCallable(realm,getter))
            desc.__get__ = getter;
        else if (getter instanceof JSUndefined)
            desc.__get__ = undefined;
        else
            return realm.throwTypeError("get is not a function");
    }

    // 19. Let hasSet be HasProperty(Obj, "set").
    // 20. ReturnIfAbrupt(hasSet).
    const hasSetComp = HasProperty(realm,Obj,new JSString("set"));
    if (!(hasSetComp instanceof NormalCompletion))
        return hasSetComp;
    const hasSet = hasSetComp.value;

    // 21. If hasSet is true, then
    if (hasSet) {
        // a. Let setter be Get(Obj, "set").
        // b. ReturnIfAbrupt(setter).
        const setterComp = Get(realm,Obj,new JSString("set"));
        if (!(setterComp instanceof NormalCompletion))
            return setterComp;
        const setter = setterComp.value;
        // c. If IsCallable(setter) is false and setter is not undefined, throw a TypeError exception.
        // Set the [[Set]] field of desc to setter.
        if ((setter instanceof JSObject) && IsCallable(realm,setter))
            desc.__set__ = setter;
        else if (setter instanceof JSUndefined)
            desc.__set__ = undefined;
        else
            return realm.throwTypeError("set is not a function");
    }

    // 22. If either desc.[[Get]] or desc.[[Set]] is present, then
    if (hasGet || hasSet) {
        // a. If either desc.[[Value]] or desc.[[Writable]] is present, throw a TypeError exception.
        if (hasValue || hasWritable)
            return realm.throwTypeError("Must be either a data or accessor descriptor, not both");
    }

    // 23. Return desc.
    return new NormalCompletion(desc);
}

// ES6 Section 6.2.4.6: CompletePropertyDescriptor (Desc)

export function CompletePropertyDescriptor(realm: Realm, Desc: any): Completion<UnknownType> {
    throw new Error("CompletePropertyDescriptor not implemented");
}
