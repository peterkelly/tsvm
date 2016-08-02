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
    Empty,
    LexicalEnvironment,
    Realm,
    EnvironmentRecord,
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
} from "./types";
import {
    rt_Infinity,
    rt_NaN,
} from "./runtime";
import {
    JSOrdinaryObject,
    ObjectCreate,
} from "./09-01-ordinary";
import {
    JSFunctionObject,
    ThisMode,
} from "./09-02-exotic";
import {
    HasProperty,
} from "./07-03-objects";
import {
    NewDeclarativeEnvironment,
    GetIdentifierReference,
    FunctionEnvironmentRecord,
    GlobalEnvironmentRecord,
    ModuleEnvironmentRecord,
    DeclarativeEnvironmentRecord,
} from "./08-01-environment";
import * as bi from "./builtins";

// ES6 Section 8.3: Execution Contexts

export class ExecutionContext {
    _nominal_type_ExecutionContext: any;
    // public state: any; // Implementation-specific
    public fun: JSFunctionObject | JSNull;
    public realm: Realm;
    public lexicalEnvironment: LexicalEnvironment;
    public variableEnvironment: LexicalEnvironment;
    public strict: boolean = true; // FIXME: This should come from the code being executed
    // public generator: any;

    public constructor(realm: Realm, fun: JSFunctionObject | JSNull, env: LexicalEnvironment) {
        this.realm = realm;
        this.fun = fun;
        this.lexicalEnvironment = env;
        this.variableEnvironment = env;
    }

    // ES6 Section 8.3.1: ResolveBinding (name, [env])

    public ResolveBinding(name: string, env?: LexicalEnvironment): Completion<Reference> {
        if (env === undefined)
            env = this.lexicalEnvironment;
        return GetIdentifierReference(this.realm,env,name,this.strict);
    }

    // ES6 Section 8.3.2: GetThisEnvironment ()

    public GetThisEnvironment(): Completion<EnvironmentRecord> {
        let lex = this.lexicalEnvironment;
        while (true) {
            const envRec = lex.record;
            const existsComp = envRec.HasThisBinding();
            if (!(existsComp instanceof NormalCompletion))
                return existsComp;
            const exists = existsComp.value;
            if (exists)
                return new NormalCompletion(envRec);
            const outer = lex.outer;
            if (outer === null)
                throw new Error("GetThisEnvironment: Did not find a global environment");
            lex = outer;
        }
    }

    // ES6 Section 8.3.3: ResolveThisBinding ()

    public ResolveThisBinding(): Completion<JSValue> {
        const envRecComp = this.GetThisEnvironment();
        if (!(envRecComp instanceof NormalCompletion))
            return envRecComp;
        const envRec = envRecComp.value;
        if (envRec instanceof FunctionEnvironmentRecord)
            return envRec.GetThisBinding();
        else if (envRec instanceof GlobalEnvironmentRecord)
            return envRec.GetThisBinding();
        else if (envRec instanceof ModuleEnvironmentRecord)
            return envRec.GetThisBinding();
        else // should never happen
            throw new Error("ResolveThisBinding: Environment record does not implement GetThisBinding");
    }

    // ES6 Section 8.3.4: GetNewTarget ()

    public GetNewTarget(): Completion<UnknownType> {
        throw new Error("ExecutionContext.GetNewTarget not implemented");
    }

    // ES6 Section 8.3.5: GetGlobalObject ()

    public GetGlobalObject(): Completion<UnknownType> {
        throw new Error("ExecutionContext.GetGlobalObject not implemented");
    }
}

// ES6 Section 8.4: Jobs and Job Queues

export class PendingJob {
    _nominal_type_PendingJob: any;
    public job: string;
    public arguments: JSValue[];
    public realm: Realm;
    public hostDefined: undefined;

    public constructor(job: string, args: JSValue[], realm: Realm) {
        this.job = job;
        this.arguments = args;
        this.realm = realm;
        this.hostDefined = undefined;
    }
}
