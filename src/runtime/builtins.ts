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

import {
    UnknownType,
    Empty,
    JSValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    JSPrimitiveValue,
    JSPropertyKey,
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
    newDataDescriptor,
    AccessorDescriptor,
    newAccessorDescriptor,
    Intrinsics,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Reference,
    SuperReference,
    DataBlock,
} from "./datatypes";
import {
    EnvironmentRecord,
} from "./context";
import {
    Realm,
} from "./context";

export abstract class BuiltinFunction extends JSObject {
    public realm: Realm;
    public constructor(realm: Realm) {
        super();
        this.realm = realm;
    }
    public abstract Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue>;
}

export class ArgGetterFunction extends BuiltinFunction {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, name: string, env: EnvironmentRecord) {
        super(realm);
        this.name = name;
        this.env = env;
    }

    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return this.env.GetBindingValue(this.name,false);
    }
}

export class ArgSetterFunction extends BuiltinFunction {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, name: string, env: EnvironmentRecord) {
        super(realm);
        this.name = name;
        this.env = env;
    }

    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        const value = (args.length > 0) ? args[0] : new JSUndefined();
        this.env.SetMutableBinding(this.name,value,false);
        return new NormalCompletion(new JSUndefined());
    }
}

export class ThrowTypeErrorFunction extends BuiltinFunction {
    public constructor(realm: Realm) {
        super(realm);
        this.__extensible__ = false;
        this.properties["length"] = newDataDescriptor({
            enumerable: false,
            configurable: false,
            value: new JSNumber(1),
            writable: false
        });
    }

    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        const message = (args.length > 0) ? args[0] : new JSUndefined();
        if (message instanceof JSString)
            return new ThrowCompletion(new TypeErrorObject(message));
        else
            return new ThrowCompletion(new TypeErrorObject(new JSUndefined()));
    }
}

export class TypeErrorObject extends JSObject {
    public constructor(message: JSString | JSUndefined) {
        super();
        this.properties["message"] = newDataDescriptor({
            enumerable: true,
            configurable: false,
            value: message,
            writable: false,
        });
    }
}

export class FunctionPrototypeFunction extends BuiltinFunction {
    public constructor(realm: Realm) {
        super(realm);
    }
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSUndefined());
    }
}
