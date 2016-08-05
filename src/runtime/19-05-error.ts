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

// ES6 Section 19.5: Error Objects

import {
    UnknownType,
    Empty,
    LexicalEnvironment,
    Realm,
    EnvironmentRecord,
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
    JSObject,
    JSOrdinaryObject,
    ObjectOperations,
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
} from "./datatypes";
import {
    ToString,
} from "./07-01-conversion";
import {
    Get,
} from "./07-03-objects";

function stringDescriptor(str: string): PropertyDescriptor {
    return new DataDescriptor({
        enumerable: false,
        configurable: true,
        writable: true,
        value: new JSString(str),
    });
}

class ErrorToStringFunction extends JSOrdinaryObject {
    public get implementsCall(): boolean {
        return true;
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {

        const realm = this.realm;

        const O = thisArg;
        if (!(O instanceof JSObject))
            return realm.throwTypeError("Error.prototype.toString() applied to non-object");

        const nameComp = Get(realm,O,new JSString("name"));
        if (!(nameComp instanceof NormalCompletion))
            return nameComp;
        const name = nameComp.value;

        let nameStr: JSString;
        if (name instanceof JSUndefined) {
            nameStr = new JSString("Error");
        }
        else {
            const nameStrComp = ToString(realm,name);
            if (!(nameStrComp instanceof NormalCompletion))
                return nameStrComp;
            nameStr = nameStrComp.value;
        }

        const msgComp = Get(realm,O,new JSString("message"));
        if (!(msgComp instanceof NormalCompletion))
            return msgComp;
        const msg = msgComp.value;

        let msgStr: JSString;
        if (msg instanceof JSUndefined) {
            msgStr = new JSString("");
        }
        else {
            const msgStrComp = ToString(realm,msg);
            if (!(msgStrComp instanceof NormalCompletion))
                return msgStrComp;
            msgStr = msgStrComp.value;
        }

        console.log("ErrorToStringFunction: nameStr = "+JSON.stringify(nameStr.stringValue)+
                    ", msgStr = "+JSON.stringify(msgStr.stringValue));

        if (nameStr.stringValue.length == 0)
            return new NormalCompletion(msgStr);

        if (msgStr.stringValue.length == 0)
            return new NormalCompletion(nameStr);

        const combined = nameStr.stringValue+": "+msgStr.stringValue;
        return new NormalCompletion(new JSString(combined));
    }
}

export class ErrorObject extends JSOrdinaryObject {
    public message: string;
    public constructor(realm: Realm, proto: JSObject, message: string | undefined) {
        super(realm,proto);
        if (message !== undefined)
            this.properties.put("message",stringDescriptor(message));
    }
}

export function setupErrorPrototype(obj: JSObject): void {
    const realm = obj.realm;
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor(""));
    obj.properties.put("toString",new DataDescriptor({
        enumerable: false,
        configurable: true,
        writable: true,
        value: new ErrorToStringFunction(realm,realm.intrinsics.FunctionPrototype),
    }));
}

export function setupEvalErrorPrototype(obj: JSObject): void {
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor("EvalError"));
}

export function setupRangeErrorPrototype(obj: JSObject): void {
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor("RangeError"));
}

export function setupReferenceErrorPrototype(obj: JSObject): void {
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor("ReferenceError"));
}

export function setupSyntaxErrorPrototype(obj: JSObject): void {
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor("SyntaxError"));
}

export function setupTypeErrorPrototype(obj: JSObject): void {
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor("TypeError"));
}

export function setupURIErrorPrototype(obj: JSObject): void {
    obj.properties.put("message",stringDescriptor(""));
    obj.properties.put("name",stringDescriptor("URIError"));
}
