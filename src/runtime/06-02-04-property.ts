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

// ES6 Section 6.2.4: The Property Descriptor Specification Type

import {
    UnknownType,
    JSValue,
    JSUndefined,
    JSBoolean,
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
    CreateDataProperty,
} from "./07-03-objects";
import {
    ObjectCreate,
} from "./09-01-ordinary";

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

export function FromPropertyDescriptor(realm: Realm, Desc: DescriptorFields | undefined): Completion<JSObject | undefined> {
    // 1. If Desc is undefined, return undefined.
    if (Desc === undefined)
        return new NormalCompletion(undefined);

    // 2. Let obj be ObjectCreate(%ObjectPrototype%).
    // 3. Assert: obj is an extensible ordinary object with no own properties.
    const obj = ObjectCreate(realm,realm.intrinsics.ObjectPrototype);

    // 4. If Desc has a [[Value]] field, then
    if (Desc.value !== undefined) {
        // a. Perform CreateDataProperty(obj, "value", Desc.[[Value]]).
        const comp = CreateDataProperty(realm,obj,new JSString("value"),Desc.value);
        if (!(comp instanceof NormalCompletion))
            return comp;
    }

    // 5. If Desc has a [[Writable]] field, then
    if (Desc.writable !== undefined) {
        // a. Perform CreateDataProperty(obj, "writable", Desc.[[Writable]]).
        const comp = CreateDataProperty(realm,obj,new JSString("writable"),new JSBoolean(Desc.writable));
        if (!(comp instanceof NormalCompletion))
            return comp;
    }

    // 6. If Desc has a [[Get]] field, then
    if (Desc.__get__ !== undefined) {
        // a. Perform CreateDataProperty(obj, "get", Desc.[[Get]]).
        const comp = CreateDataProperty(realm,obj,new JSString("get"),Desc.__get__);
        if (!(comp instanceof NormalCompletion))
            return comp;
    }

    // 7. If Desc has a [[Set]] field, then
    if (Desc.__set__ !== undefined) {
        // a. Perform CreateDataProperty(obj, "set", Desc.[[Set]])
        const comp = CreateDataProperty(realm,obj,new JSString("set"),Desc.__set__);
        if (!(comp instanceof NormalCompletion))
            return comp;
    }

    // 8. If Desc has an [[Enumerable]] field, then
    if (Desc.enumerable !== undefined) {
        // a. Perform CreateDataProperty(obj, "enumerable", Desc.[[Enumerable]]).
        const comp = CreateDataProperty(realm,obj,new JSString("enumerable"),new JSBoolean(Desc.enumerable));
        if (!(comp instanceof NormalCompletion))
            return comp;
    }

    // 9. If Desc has a [[Configurable]] field, then
    if (Desc.configurable !== undefined) {
        // a. Perform CreateDataProperty(obj , "configurable", Desc.[[Configurable]]).
        const comp = CreateDataProperty(realm,obj,new JSString("configurable"),new JSBoolean(Desc.configurable));
        if (!(comp instanceof NormalCompletion))
            return comp;
    }

    // 10. Assert: all of the above CreateDataProperty operations return true.
    // (assumed)

    // 11. Return obj.
    return new NormalCompletion(obj);
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

export function CompletePropertyDescriptor(realm: Realm, Desc: DescriptorFields): DescriptorFields {
    // 1. ReturnIfAbrupt(Desc).
    // 2. Assert: Desc is a Property Descriptor
    // 3. Let like be Record {
    //        [[Value]]: undefined,
    //        [[Writable]]: false,
    //        [[Get]]: undefined,
    //        [[Set]]: undefined,
    //        [[Enumerable]]: false,
    //        [[Configurable]]: false }.
    const like: DescriptorFields = {
        value: new JSUndefined,
        writable: false,
        __get__: new JSUndefined(),
        __set__: new JSUndefined(),
        enumerable: false,
        configurable: false,
    };

    // 4. If either IsGenericDescriptor(Desc) or IsDataDescriptor(Desc) is true, then
    if (IsGenericDescriptor(Desc) || IsDataDescriptor(Desc)) {
        // a. If Desc does not have a [[Value]] field, set Desc.[[Value]] to like.[[Value]].
        if (Desc.value === undefined)
            Desc.value = like.value;
        // b. If Desc does not have a [[Writable]] field, set Desc.[[Writable]] to like.[[Writable]].
        if (Desc.writable === undefined)
            Desc.writable = like.writable;
    }
    // 5. Else,
    else {
        // a. If Desc does not have a [[Get]] field, set Desc.[[Get]] to like.[[Get]].
        if (Desc.__get__ === undefined)
            Desc.__get__ = like.__get__;
        // b. If Desc does not have a [[Set]] field, set Desc.[[Set]] to like.[[Set]].
        if (Desc.__set__ === undefined)
            Desc.__set__ = like.__set__;
    }

    // 6. If Desc does not have an [[Enumerable]] field, set Desc.[[Enumerable]] to like.[[Enumerable]].
    if (Desc.enumerable === undefined)
        Desc.enumerable = like.enumerable;

    // 7. If Desc does not have a [[Configurable]] field, set Desc.[[Configurable]] to like.[[Configurable]].
    if (Desc.configurable === undefined)
        Desc.configurable = like.configurable;

    // 8. Return Desc.
    return Desc;
}
