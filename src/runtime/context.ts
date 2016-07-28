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
    JSValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSPropertyKey,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Intrinsics,
    UnknownType,
} from "./datatypes";
import {
    JSFunctionObject,
    ThisMode,
} from "./objects";

// ES6 Section 8.1: Lexical Environments

export class LexicalEnvironment {
    _nominal_type_LexicalEnvironment: any;
    public record: EnvironmentRecord;
    public outer: LexicalEnvironment | null;

    public constructor(record: EnvironmentRecord, outer: LexicalEnvironment | null) {
        this.record = record;
        this.outer = outer;
    }
}

// ES6 Section 8.1.1: Environment Records

export abstract class EnvironmentRecord {
    _nominal_type_EnvironmentRecord: any;

    public constructor() {
    }

    public abstract HasBinding(N: string): Completion<boolean>;

    public abstract CreateMutableBinding(N: string, D: boolean): Completion<void>;

    public abstract CreateImmutableBinding(N: string, S: boolean): Completion<void>;

    public abstract InitializeBinding(N: string, V: JSValue): Completion<void>;

    public abstract SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void>;

    public abstract GetBindingValue(N: string, S: boolean): Completion<JSValue>;

    public abstract DeleteBinding(N: string): Completion<boolean>;

    public abstract HasThisBinding(): Completion<boolean>;

    public abstract HasSuperBinding(): Completion<boolean>;

    public abstract WithBaseObject(): Completion<JSObject | JSUndefined>;
}

// ES6 Section 8.1.1.1: Declarative Environment Records

export class DeclarativeEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_DeclarativeEnvironmentRecord: any;

    public constructor() {
        super();
    }

    // ES6 Section 8.1.1.1.1: HasBinding(N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.1.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): Completion<void> {
        throw new Error("DeclarativeEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.1.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): Completion<void> {
        throw new Error("DeclarativeEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.1.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): Completion<void> {
        throw new Error("DeclarativeEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.1.5 SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("DeclarativeEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.1.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("DeclarativeEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.1.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.1.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.1.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.1.10: WithBaseObject ()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("DeclarativeEnvironmentRecord.WithBaseObject not implemented");
    }
}

export class ObjectEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_ObjectEnvironmentRecord: any;
    public bindingObject: JSObject;

    public constructor(bindingObject: JSObject) {
        super();
        this.bindingObject = bindingObject;
    }

    // ES6 Section 8.1.1.2.1: HasBinding(N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.2.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): Completion<void> {
        throw new Error("ObjectEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): Completion<void> {
        throw new Error("ObjectEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): Completion<void> {
        throw new Error("ObjectEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.2.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("ObjectEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("ObjectEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.2.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.2.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.2.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.2.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("ObjectEnvironmentRecord.WithBaseObject not implemented");
    }
}

// ES6 Section 8.1.1.3: Function Environment Records

enum BindingStatus {
    Lexical,
    Initialized,
    Uninitialized,
}

export class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
    _nominal_type_FunctionEnvironmentRecord: any;
    public thisValue: JSValue;
    public thisBindingStatus: BindingStatus;
    public functionObject: JSObject;
    public homeObject: JSObject | JSUndefined;
    public newTarget: JSObject | JSUndefined;

    public constructor(F: JSFunctionObject, newTarget: JSUndefined | JSObject) {
        super();

        this.functionObject = F;
        if (F.thisMode == ThisMode.Lexical)
            this.thisBindingStatus = BindingStatus.Lexical;
        else
            this.thisBindingStatus = BindingStatus.Uninitialized;
        this.homeObject = F.homeObject;
        this.newTarget = newTarget;
        this.thisValue = new JSUndefined();
    }

    // ES6 Section 8.1.1.3.1: BindThisValue(V)

    public BindThisValue(V: JSValue): Completion<UnknownType> {
        throw new Error("FunctionEnvironmentRecord.BindThisValue not implemented");
    }

    // ES6 Section 8.1.1.3.2: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("FunctionEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.3.3: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("FunctionEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.3.4: GetThisBinding ()

    public GetThisBinding(): Completion<UnknownType> {
        throw new Error("FunctionEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.3.5: GetSuperBase ()

    public GetSuperBase(): Completion<UnknownType> {
        throw new Error("FunctionEnvironmentRecord.GetSuperBase not implemented");
    }
}

// ES6 Section 8.1.1.4: Global Environment Records

export class GlobalEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_GlobalEnvironmentRecord: any;
    public objectRecord: ObjectEnvironmentRecord;
    public declarativeRecord: DeclarativeEnvironmentRecord;
    public varNames: string[];

    public constructor(G: JSObject) {
        super();
        this.objectRecord = new ObjectEnvironmentRecord(G);
        this.declarativeRecord = new DeclarativeEnvironmentRecord();
        this.varNames = [];
    }

    // ES6 Section 8.1.1.4.1: HasBinding(N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.4.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): Completion<void> {
        throw new Error("GlobalEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): Completion<void> {
        throw new Error("GlobalEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.4: InitializeBinding (N,V)

    public InitializeBinding(N: string, V: JSValue): Completion<void> {
        throw new Error("GlobalEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.4.5: SetMutableBinding (N,V,S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("GlobalEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.6: GetBindingValue(N,S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("GlobalEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.4.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.4.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.4.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.4.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("GlobalEnvironmentRecord.WithBaseObject not implemented");
    }

    // ES6 Section 8.1.1.4.11: GetThisBinding ()

    public GetThisBinding(): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.4.12: HasVarDeclaration (N)

    public HasVarDeclaration(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.HasVarDeclaration not implemented");
    }

    // ES6 Section 8.1.1.4.13: HasLexicalDeclaration (N)

    public HasLexicalDeclaration(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.HasLexicalDeclaration not implemented");
    }

    // ES6 Section 8.1.1.4.14: HasRestrictedGlobalProperty (N)

    public HasRestrictedGlobalProperty(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.HasRestrictedGlobalProperty not implemented");
    }

    // ES6 Section 8.1.1.4.15: CanDeclareGlobalVar (N)

    public CanDeclareGlobalVar(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CanDeclareGlobalVar not implemented");
    }

    // ES6 Section 8.1.1.4.16: CanDeclareGlobalFunction (N)

    public CanDeclareGlobalFunction(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CanDeclareGlobalFunction not implemented");
    }

    // ES6 Section 8.1.1.4.17: CreateGlobalVarBinding (N, D)

    public CreateGlobalVarBinding(N: string, D: boolean): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CreateGlobalVarBinding not implemented");
    }

    // ES6 Section 8.1.1.4.18: CreateGlobalFunctionBinding (N, V, D)

    public CreateGlobalFunctionBinding(N: string, V: JSValue, D: boolean): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CreateGlobalFunctionBinding not implemented");
    }
}

// ES6 Section 8.1.1.5: Module Environment Records

export class ModuleEnvironmentRecord extends DeclarativeEnvironmentRecord {
    _nominal_type_ModuleEnvironmentRecord: any;

    public constructor() {
        super();
    }

    // ES6 Section 8.1.1.5.1: GetBindingValue (N,S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("ModuleEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.5.2: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("ModuleEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.5.3: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("ModuleEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.5.4: GetThisBinding ()

    public GetThisBinding(): Completion<UnknownType> {
        throw new Error("ModuleEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.5.5: CreateImportBinding (N, M, N2)

    public CreateImportBinding(N: string, M: any, N2: any): Completion<UnknownType> {
        throw new Error("ModuleEnvironmentRecord.CreateImportBinding not implemented");
    }
}

// ES6 Section 8.1.2: Lexical Environment Operations

// ES6 Section 8.1.2.1: GetIdentifierReference (lex, name, strict)

export function GetIdentifierReference(lex: LexicalEnvironment, name: string, strict: boolean): Completion<UnknownType> {
    throw new Error("GetIdentifierReference not implemented");
}

// ES6 Section 8.1.2.2: NewDeclarativeEnvironment (E)

export function NewDeclarativeEnvironment(E: LexicalEnvironment): LexicalEnvironment {
    const envRec = new DeclarativeEnvironmentRecord();
    return new LexicalEnvironment(envRec,E);
}

// ES6 Section 8.1.2.3: NewObjectEnvironment (O, E)

export function NewObjectEnvironment(O: JSObject, E: LexicalEnvironment): LexicalEnvironment {
    const envRec = new ObjectEnvironmentRecord(O);
    return new LexicalEnvironment(envRec,E);
}

// ES6 Section 8.1.2.4: NewFunctionEnvironment (F, newTarget)

export function NewFunctionEnvironment(F: JSFunctionObject, newTarget: JSUndefined | JSObject): LexicalEnvironment {
    // FIXME: Assert: F is an ECMAScript function
    const bindingStatus = (F.thisMode == ThisMode.Lexical) ?
        BindingStatus.Lexical :
        BindingStatus.Uninitialized;
    const envRec = new FunctionEnvironmentRecord(F,newTarget);
    return new LexicalEnvironment(envRec,F.environment);
}

// ES6 Section 8.1.2.5: NewGlobalEnvironment (G)

export function NewGlobalEnvironment(G: JSObject): LexicalEnvironment {
    const globalRec = new GlobalEnvironmentRecord(G);
    return new LexicalEnvironment(globalRec,null);
}

// ES6 Section 8.1.2.6: NewModuleEnvironment (E)

export function NewModuleEnvironment(E: LexicalEnvironment): LexicalEnvironment {
    const envRec = new ModuleEnvironmentRecord();
    return new LexicalEnvironment(envRec,E);
}

// ES6 Section 8.2: Code Realms

export class Realm {
    _nominal_type_Realm: any;
    public intrinsics: any;
    public globalThis: JSObject | JSUndefined;
    public globalEnv: LexicalEnvironment | JSUndefined;
    public templateMap: any[]; // FIXME

    public constructor() {
        this.intrinsics = new Intrinsics();
        this.globalThis = new JSUndefined();
        this.globalEnv = new JSUndefined;
        this.templateMap = [];
    }
}

// ES6 Section 8.2.1: CreateRealm ()

export function CreateRealm(): Realm {
    return new Realm();
}

// ES6 Section 8.2.2: CreateIntrinsics (realmRec)

export function CreateIntrinsics(realmRec: Realm): Completion<UnknownType> {
    throw new Error("CreateIntrinsics not implemented");
}

// ES6 Section 8.2.3: SetRealmGlobalObject (realmRec, globalObj)

export function SetRealmGlobalObject(realmRec: Realm, globalObj: JSObject | JSUndefined): Realm {
    throw new Error("SetRealmGlobalObject not implemented");
}

// ES6 Section 8.2.4: SetDefaultGlobalBindings (realmRec)

export function SetDefaultGlobalBindings(realmRec: Realm): Completion<UnknownType> {
    throw new Error("SetDefaultGlobalBindings not implemented");
}

// ES6 Section 8.3: Execution Contexts

export class ExecutionContext {
    _nominal_type_ExecutionContext: any;
    public state: any; // Implementation-specific
    public fun: JSFunctionObject | JSNull;
    public realm: Realm;
    public lexicalEnvironment: LexicalEnvironment;
    public variableEnvironment: LexicalEnvironment;
    public generator: any;

    // ES6 Section 8.3.1: ResolveBinding (name, [env])

    public ResolveBinding(name: JSString, env?: LexicalEnvironment | undefined ): Completion<UnknownType> {
        throw new Error("ExecutionContext.ResolveBinding not implemented");
    }

    // ES6 Section 8.3.2: GetThisEnvironment ()

    public GetThisEnvironment(): Completion<UnknownType> {
        throw new Error("ExecutionContext.GetThisEnvironment not implemented");
    }

    // ES6 Section 8.3.3: ResolveThisBinding ()

    public ResolveThisBinding(): Completion<UnknownType> {
        throw new Error("ExecutionContext.ResolveThisBinding not implemented");
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
