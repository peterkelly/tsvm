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
    DataDescriptor,
    Intrinsics,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Reference,
    AbstractReference,
    PropertyReference,
    Realm,
} from "../runtime/datatypes";
import {
    ExecutionContext,
} from "../runtime/08-03-context";
import {
    RealmImpl,
} from "../runtime/08-02-realm";
import {
    DeclarativeEnvironmentRecord,
} from "../runtime/08-01-environment";
import {
    ToString,
} from "../runtime/07-01-conversion";
import {
    ModuleNode,
} from "./modules";

export interface ExecutionCallbacks {
    log(message: string): void;
    success(): void;
    failure(reason: string): void;
}

class ConsoleLogFunction extends JSObject {
    private callbacks: ExecutionCallbacks;

    public constructor(prototype: JSObject | JSNull, callbacks: ExecutionCallbacks) {
        super(prototype);
        this.callbacks = callbacks;
    }

    public get implementsCall(): boolean {
        return true;
    }

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        const strings: string[] = [];
        for (const arg of args) {
            const strComp = ToString(realm,arg);
            if (!(strComp instanceof NormalCompletion))
                return strComp;
            const str = strComp.value;
            strings.push(str.stringValue);
        }
        this.callbacks.log(strings.join(" "));
        return new NormalCompletion(new JSUndefined());
    }
}

export function evalModule(node: ModuleNode, callbacks: ExecutionCallbacks): void {
    const realm = new RealmImpl();
    const envRec = new DeclarativeEnvironmentRecord(realm);
    const lexEnv = { record: envRec, outer: realm.globalEnv };
    const ctx = new ExecutionContext(realm, new JSNull(),lexEnv);

    envRec.CreateImmutableBinding("console",true);
    const consoleObject = new JSObject(realm.intrinsics.ObjectPrototype);
    consoleObject.properties.put(new JSString("log"),new DataDescriptor({
        enumerable: true,
        configurable: true,
        writable: true,
        value: new ConsoleLogFunction(realm.intrinsics.FunctionPrototype,callbacks)
    }));
    envRec.InitializeBinding("console",consoleObject);

    const resultComp = node.evaluate(ctx);
    if (resultComp instanceof NormalCompletion) {
        callbacks.success();
        return;
    }

    try {
        if (!(resultComp instanceof ThrowCompletion))
            throw new Error("Completion type not Normal or Throw");

        const strComp = ToString(realm,resultComp.exceptionValue);
        if (!(strComp instanceof NormalCompletion))
            throw new Error("toString() on exception object failed");

        callbacks.failure("Exception: "+strComp.value);
    }
    catch (e) {
        callbacks.failure("Exception (internal): "+e);
    }
}
