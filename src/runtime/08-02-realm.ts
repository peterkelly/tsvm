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

// ES6 Chapter 8: Executable Code and Execution Contexts

import {
    UnknownType,
    Completion,
    ThrowCompletion,
    LexicalEnvironment,
    Realm,
    JSUndefined,
    JSObject,
    Intrinsics,
} from "./datatypes";
import {
    NewGlobalEnvironment,
} from "./08-01-environment";

// ES6 Section 8.2: Code Realms

export class RealmImpl implements Realm {
    _nominal_type_Realm: any;
    _nominal_type_RealmImpl: any;
    public intrinsics: Intrinsics;
    public globalThis: JSObject;
    public globalEnv: LexicalEnvironment;
    public templateMap: UnknownType[];

    public constructor() {
        this.intrinsics = CreateIntrinsics();
        this.globalThis = new JSObject();
        this.globalEnv = NewGlobalEnvironment(this.globalThis);
        this.templateMap = [];
    }

    public throwEvalError(message?: string): ThrowCompletion {
        throw new Error("RealmImpl.throwEvalError not implemented");
    }

    public throwRangeError(message?: string): ThrowCompletion {
        throw new Error("RealmImpl.throwRangeError not implemented");
    }

    public throwReferenceError(message?: string): ThrowCompletion {
        throw new Error("RealmImpl.throwReferenceError not implemented");
    }

    public throwSyntaxError(message?: string): ThrowCompletion {
        throw new Error("RealmImpl.throwSyntaxError not implemented");
    }

    public throwTypeError(message?: string): ThrowCompletion {
        throw new Error("RealmImpl.throwTypeError not implemented");
    }

    public throwURIError(message?: string): ThrowCompletion {
        throw new Error("RealmImpl.throwURIError not implemented");
    }
}

// ES6 Section 8.2.1: CreateRealm ()

export function CreateRealm(): Realm {
    return new RealmImpl();
}

// ES6 Section 8.2.2: CreateIntrinsics (realmRec)

export function CreateIntrinsics(): Intrinsics {
    throw new Error("CreateIntrinsics not implemented");
}

// ES6 Section 8.2.3: SetRealmGlobalObject (realmRec, globalObj)

export function SetRealmGlobalObject(realm: Realm, globalObj: JSObject | JSUndefined): Realm {
    throw new Error("SetRealmGlobalObject not implemented");
}

// ES6 Section 8.2.4: SetDefaultGlobalBindings (realmRec)

function SetDefaultGlobalBindings(realm: Realm): void {
    throw new Error("SetDefaultGlobalBindings not implemented");
}
