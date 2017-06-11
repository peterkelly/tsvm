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

// ES6 Section 19.1: Object Objects

import {
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
    Realm,
} from "./datatypes";
import {
    ToObject,
    ToPropertyKey,
} from "./07-01-conversion";
import {
    IsArray,
    SameValue,
} from "./07-02-testcompare";
import {
    Get,
    HasOwnProperty,
    Invoke,
} from "./07-03-objects";
import {
    StringExoticObject,
    ArgumentsExoticObject,
} from "./09-04-exotic";
import {
    ErrorObject,
} from "./19-05-error";
import {
    BooleanObject,
} from "./19-03-boolean";
import {
    NumberObject,
} from "./20-01-number";
import {
    DateObject,
} from "./20-03-date";
import {
    RegExpObject,
} from "./21-02-regexp";

export class ObjectObject extends JSObject {
    public _type_ObjectObject: any;
}

export class ObjectConstructor extends JSObject {
    public _type_ObjectConstructor: any;
}

// ES6 Section 19.1.3.2: Object.prototype.hasOwnProperty ( V )

function Object_prototype_hasOwnProperty(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    const V = (args.length > 0) ? args[0] : new JSUndefined();

    // 1. Let P be ToPropertyKey(V).
    // 2. ReturnIfAbrupt(P).
    const PComp = ToPropertyKey(realm, V);
    if (!(PComp instanceof NormalCompletion))
        return PComp;
    const P = PComp.value;

    // 3. Let O be ToObject(this value).
    // 4. ReturnIfAbrupt(O).
    const OComp = ToObject(realm, thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 5. Return HasOwnProperty(O, P).
    const resultComp = HasOwnProperty(realm, O, P);
    if (!(resultComp instanceof NormalCompletion))
        return resultComp;
    const result = resultComp.value;

    return new NormalCompletion(new JSBoolean(result));
}

// ES6 Section 19.1.3.3: Object.prototype.isPrototypeOf ( V )

function Object_prototype_isPrototypeOf(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    const V1 = (args.length > 0) ? args[0] : new JSUndefined();

    // 1. If Type(V) is not Object, return false.
    if (!(V1 instanceof JSObject))
        return new NormalCompletion(new JSBoolean(false));

    // 2. Let O be ToObject(this value).
    // 3. ReturnIfAbrupt(O).
    const OComp = ToObject(realm, thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 4. Repeat
    while (true) {
        // a. Let V be V.[[GetPrototypeOf]]().
        const V2Comp = V1.__GetPrototypeOf__(realm);
        if (!(V2Comp instanceof NormalCompletion))
            return V2Comp;
        const V2 = V2Comp.value;

        // b. If V is null, return false
        if (V2 instanceof JSNull)
            return new NormalCompletion(new JSBoolean(false));

        // c. If SameValue(O, V) is true, return true.
        if (SameValue(O, V2))
            return new NormalCompletion(new JSBoolean(true));
    }
}

// ES6 Section 19.1.3.4: Object.prototype.propertyIsEnumerable ( V )

function Object_prototype_propertyIsEnumerable(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    const V = (args.length > 0) ? args[0] : new JSUndefined();

    // 1. Let P be ToPropertyKey(V).
    // 2. ReturnIfAbrupt(P).
    const PComp = ToPropertyKey(realm, V);
    if (!(PComp instanceof NormalCompletion))
        return PComp;
    const P = PComp.value;

    // 3. Let O be ToObject(this value).
    // 4. ReturnIfAbrupt(O).
    const OComp = ToObject(realm, thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 5. Let desc be O.[[GetOwnProperty]](P).
    // 6. ReturnIfAbrupt(desc).
    const descComp = O.__GetOwnProperty__(realm, P);
    if (!(descComp instanceof NormalCompletion))
        return descComp;
    const desc = descComp.value;

    // 7. If desc is undefined, return false.
    if (desc instanceof JSUndefined)
        return new NormalCompletion(new JSBoolean(false));

    // 8. Return the value of desc.[[Enumerable]].
    return new NormalCompletion(new JSBoolean(desc.enumerable));
}

// ES6 Section 19.1.3.5: Object.prototype.toLocaleString ( [ reserved1 [ , reserved2 ] ] )

function Object_prototype_toLocaleString(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    // Invoke requires an object; the spec does not specify what do do if this function is called
    // on a non-object. So let's just try to convert the value to an object if it isn't already one.

    // 1. Let O be the this value.
    const OComp = ToObject(realm, thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 2. Return Invoke(O, "toString").
    return Invoke(realm, O, new JSString("toString"), []);
}

// ES6 Section 19.1.3.6: Object.prototype.toString ( )

function Object_prototype_toString(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {

    // 1. If the this value is undefined, return "[object Undefined]".
    if (thisArg instanceof JSUndefined)
        return new NormalCompletion(new JSString("[object Undefined]"));

    // 2. If the this value is null, return "[object Null]".
    if (thisArg instanceof JSNull)
        return new NormalCompletion(new JSString("[object Null]"));

    // 3. Let O be ToObject(this value).
    const OComp = ToObject(realm, thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 4. Let isArray be IsArray(O).
    // 5. ReturnIfAbrupt(isArray).
    const isArrayComp = IsArray(realm, O);
    if (!(isArrayComp instanceof NormalCompletion))
        return isArrayComp;
    const isArray = isArrayComp.value;

    let builtinTag: string;
    // 6. If isArray is true, let builtinTag be "Array".
    if (isArray) {
        builtinTag = "Array";
    }
    // 7. Else, if O is an exotic String object, let builtinTag be "String".
    else if (O instanceof StringExoticObject) {
        builtinTag = "String";
    }
    // 8. Else, if O has an [[ParameterMap]] internal slot, let builtinTag be "Arguments".
    else if (O instanceof ArgumentsExoticObject) {
        builtinTag = "Arguments";
    }
    // 9. Else, if O has a [[Call]] internal method, let builtinTag be "Function"
    else if (O.implementsCall) {
        builtinTag = "Function";
    }
    // 10. Else, if O has an [[ErrorData]] internal slot, let builtinTag be "Error".
    else if (O instanceof ErrorObject) {
        builtinTag = "Error";
    }
    // 11. Else, if O has a [[BooleanData]] internal slot, let builtinTag be "Boolean".
    else if (O instanceof BooleanObject) {
        builtinTag = "Boolean";
    }
    // 12. Else, if O has a [[NumberData]] internal slot, let builtinTag be "Number".
    else if (O instanceof NumberObject) {
        builtinTag = "Number";
    }
    // 13. Else, if O has a [[DateValue]] internal slot, let builtinTag be "Date".
    else if (O instanceof DateObject) {
        builtinTag = "Date";
    }
    // 14. Else, if O has a [[RegExpMatcher]] internal slot, let builtinTag be "RegExp".
    else if (O instanceof RegExpObject) {
        builtinTag = "RegExp";
    }
    // 15. Else, let builtinTag be "Object".
    else {
        builtinTag = "Object";
    }

    // 16. Let tag be Get (O, @@toStringTag).
    // 17. ReturnIfAbrupt(tag).
    const tagComp = Get(realm, O, JSSymbol.$$toStringTag);
    if (!(tagComp instanceof NormalCompletion))
        return tagComp;
    const tag = tagComp.value;

    // 18. If Type(tag) is not String, let tag be builtinTag.
    let tagStr: string;
    if (tag instanceof JSString)
        tagStr = tag.stringValue;
    else
        tagStr = builtinTag;

    // 19. Return the String that is the result of concatenating "[object ", tag, and "]".
    return new NormalCompletion(new JSString("[object " + tagStr + "]"));
}

// ES6 Section 19.1.3.7: Object.prototype.valueOf ( )

function Object_prototype_valueOf(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    // 1. Return ToObject(this value).
    return ToObject(realm, thisArg);
}
