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
    JSValue,
    JSUndefined,
    JSString,
    JSObject,
    PropertyDescriptor,
    DataDescriptor,
    Completion,
    NormalCompletion,
    Realm,
} from "./datatypes";
import {
    ToString,
} from "./07-01-conversion";
import {
    Get,
} from "./07-03-objects";

export class ErrorObject extends JSObject {
    _nominal_type_ErrorObject: any;
    public errorData: JSUndefined = new JSUndefined();
    public message: string;
    public constructor(realm: Realm, proto: JSObject, message: string | undefined) {
        super(proto);
        if (message !== undefined)
            this.properties.put(new JSString("message"),stringDescriptor(message));
    }
}

export class ErrorConstructor extends JSObject {
    _nominal_type_ErrorConstructor: any;
}

function stringDescriptor(str: string): PropertyDescriptor {
    return new DataDescriptor({
        enumerable: false,
        configurable: true,
        writable: true,
        value: new JSString(str),
    });
}

class ErrorToStringFunction extends JSObject {
    public get implementsCall(): boolean {
        return true;
    }

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {

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

export function setupErrorPrototype(realm: Realm, obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor(""));
    obj.properties.put(new JSString("toString"),new DataDescriptor({
        enumerable: false,
        configurable: true,
        writable: true,
        value: new ErrorToStringFunction(realm.intrinsics.FunctionPrototype),
    }));
}

export function setupEvalErrorPrototype(obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor("EvalError"));
}

export function setupRangeErrorPrototype(obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor("RangeError"));
}

export function setupReferenceErrorPrototype(obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor("ReferenceError"));
}

export function setupSyntaxErrorPrototype(obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor("SyntaxError"));
}

export function setupTypeErrorPrototype(obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor("TypeError"));
}

export function setupURIErrorPrototype(obj: JSObject): void {
    obj.properties.put(new JSString("message"),stringDescriptor(""));
    obj.properties.put(new JSString("name"),stringDescriptor("URIError"));
}
