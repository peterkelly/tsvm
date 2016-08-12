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

// ES6 Section 19.1: Object Objects

import {
    UnknownType,
    PropertyMap,
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
    JSInteger,
    JSInt32,
    JSUInt32,
    JSInt16,
    JSUInt16,
    JSInt8,
    JSUInt8,
    JSObject,
    ObjectOperations,
    DescriptorFields,
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
    LexicalEnvironment,
    EnvironmentRecord,
    Realm,
} from "./datatypes";
import {
    ToObject,
    ToPropertyKey,
} from "./07-01-conversion";
import {
    IsArray,
} from "./07-02-testcompare";
import {
    Get,
    HasOwnProperty,
} from "./07-03-objects";
import {
    StringExoticObject,
    ArgumentsExoticObject,
} from "./09-02-exotic";
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
} from "./21-02-regexp.ts";

export class ObjectObject extends JSObject {
    _nominal_type_ObjectObject: any;
}

export class ObjectConstructor extends JSObject {
    _nominal_type_ObjectConstructor: any;
}

// ES6 Section 19.1.3.2: Object.prototype.hasOwnProperty ( V )

function Object_prototype_hasOwnProperty(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
    const V = (args.length > 0) ? args[0] : new JSUndefined();

    // 1. Let P be ToPropertyKey(V).
    // 2. ReturnIfAbrupt(P).
    const PComp = ToPropertyKey(realm,V);
    if (!(PComp instanceof NormalCompletion))
        return PComp;
    const P = PComp.value;

    // 3. Let O be ToObject(this value).
    // 4. ReturnIfAbrupt(O).
    const OComp = ToObject(realm,thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 5. Return HasOwnProperty(O, P).
    const resultComp = HasOwnProperty(realm,O,P);
    if (!(resultComp instanceof NormalCompletion))
        return resultComp;
    const result = resultComp.value;

    return new NormalCompletion(new JSBoolean(result));
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
    const OComp = ToObject(realm,thisArg);
    if (!(OComp instanceof NormalCompletion))
        return OComp;
    const O = OComp.value;

    // 4. Let isArray be IsArray(O).
    // 5. ReturnIfAbrupt(isArray).
    const isArrayComp = IsArray(realm,O);
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
    const tagComp = Get(realm,O,JSSymbol.$$toStringTag);
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
    return new NormalCompletion(new JSString("[object "+tagStr+"]"));
}
