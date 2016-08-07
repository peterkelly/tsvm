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
} from "./datatypes";
import {
    rt_Infinity,
    rt_NaN,
} from "./runtime";
import {
    ObjectCreate,
} from "./09-01-ordinary";
import {
    JSFunctionObject,
    ThisMode,
} from "./09-02-exotic";
import {
    HasProperty,
} from "./07-03-objects";
// import * as bi from "./builtins";

// ES6 Section 8.1.1: Environment Records

// ES6 Section 8.1.1.1: Declarative Environment Records

interface DeclarativeBinding {
    value: JSValue;
    canDelete: boolean;
    mutable: boolean;
    initialized: boolean;
    strict: boolean;
}

export class DeclarativeEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_DeclarativeEnvironmentRecord: any;

    public readonly bindings: { [name: string]: DeclarativeBinding } = {};
    public realm: Realm;

    public constructor(realm: Realm) {
        super();
        this.realm = realm;
    }

    // ES6 Section 8.1.1.1.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        const result = (N in this.bindings);
        return new NormalCompletion(result);
    }

    // ES6 Section 8.1.1.1.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean = false): void {
        if (N in this.bindings)
            throw new Error("Binding for "+N+" already exists");
        this.bindings[N] = {
            value: new JSUndefined(),
            canDelete: D,
            mutable: true,
            initialized: false,
            strict: false,
        };
    }

    // ES6 Section 8.1.1.1.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean = false): void {
        if (N in this.bindings)
            throw new Error("Binding for "+N+" already exists");
        this.bindings[N] = {
            value: new JSUndefined(),
            canDelete: false,
            mutable: true,
            initialized: false,
            strict: S,
        };
    }

    // ES6 Section 8.1.1.1.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        if (!(N in this.bindings))
            throw new Error("Binding for "+N+" does not exist");
        const binding = this.bindings[N];
        if (binding.initialized)
            throw new Error("Binding for "+N+" is already initialized");
        binding.value = V;
        binding.initialized = true;
    }

    // ES6 Section 8.1.1.1.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        const envRec = this;

        if (!(N in envRec.bindings)) {
            if (S)
                return this.realm.throwReferenceError();
            envRec.CreateMutableBinding(N,true);
            envRec.InitializeBinding(N,V);
            return new NormalCompletion(undefined);
        }

        const binding = envRec.bindings[N];
        if (binding.strict)
            S = true;
        if (!binding.initialized)
            return this.realm.throwReferenceError();
        else if (binding.mutable)
            binding.value = V;
        else if (S)
            return this.realm.throwTypeError("DeclarativeEnvironmentRecord SetMutableBinding: "+JSON.stringify(N)+": immutable binding");
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.1.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        const envRec = this;
        if (!(N in this.bindings))
            throw new Error("Binding for "+N+" does not exist");
        const binding = this.bindings[N];
        if (!binding.initialized)
            return this.realm.throwReferenceError();
        return new NormalCompletion(binding.value);
    }

    // ES6 Section 8.1.1.1.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        if (!(N in this.bindings))
            throw new Error("Binding for "+N+" does not exist");
        const binding = this.bindings[N];
        if (!binding.canDelete)
            return new NormalCompletion(false);
        delete this.bindings[N];
        return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.1.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.1.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.1.10: WithBaseObject ()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        return new NormalCompletion(new JSUndefined());
    }
}

export class ObjectEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_ObjectEnvironmentRecord: any;
    public bindingObject: JSObject;
    public realm: Realm;
    // public withEnvironment: boolean;

    public constructor(realm: Realm, bindingObject: JSObject) {
        super();
        this.realm = realm;
        this.bindingObject = bindingObject;
        // this.withEnvironment = false;
    }

    // ES6 Section 8.1.1.2.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        const envRec = this;
        const bindings = envRec.bindingObject;
        const foundBindingComp = HasProperty(this.realm,bindings,new JSString(N));
        if (!(foundBindingComp instanceof NormalCompletion))
            return foundBindingComp;
        const foundBinding = foundBindingComp.value;
        if (!foundBinding)
            return new NormalCompletion(false);
        // if (!envRec.withEnvironment)
            return new NormalCompletion(true);
        // FIXME: Unscopables
        // throw new Error("ObjectEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.2.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): void {
        throw new Error("ObjectEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): void {
        throw new Error("ObjectEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
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

    public constructor(realm: Realm, F: JSFunctionObject, newTarget: JSUndefined | JSObject) {
        super(realm);
        this.functionObject = F;
        if (F.thisMode == ThisMode.Lexical)
            this.thisBindingStatus = BindingStatus.Lexical;
        else
            this.thisBindingStatus = BindingStatus.Uninitialized;
        this.homeObject = F.homeObject;
        this.newTarget = newTarget;
        this.thisValue = new JSUndefined();
    }

    // ES6 Section 8.1.1.3.1: BindThisValue (V)

    public BindThisValue(V: JSValue): Completion<JSValue> {
        const envRec = this;
        if (envRec.thisBindingStatus == BindingStatus.Lexical)
            throw new Error("FunctionEnvironmentRecord.BindThisValue: thisBindingStatus is Lexical");
        if (envRec.thisBindingStatus == BindingStatus.Initialized)
            return this.realm.throwReferenceError();
        envRec.thisValue = V;
        envRec.thisBindingStatus = BindingStatus.Initialized;
        return new NormalCompletion(V);
    }

    // ES6 Section 8.1.1.3.2: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        const envRec = this;
        const result = (envRec.thisBindingStatus != BindingStatus.Lexical);
        return new NormalCompletion(result);
    }

    // ES6 Section 8.1.1.3.3: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        const envRec = this;
        const result = (envRec.thisBindingStatus != BindingStatus.Lexical);
        return new NormalCompletion(result);
    }

    // ES6 Section 8.1.1.3.4: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        const envRec = this;
        if (envRec.thisBindingStatus == BindingStatus.Lexical)
            throw new Error("FunctionEnvironmentRecord.GetThisBinding: thisBindingStatus is Lexical");
        if (envRec.thisBindingStatus == BindingStatus.Uninitialized)
            return this.realm.throwReferenceError();
        return new NormalCompletion(envRec.thisValue);
    }

    // ES6 Section 8.1.1.3.5: GetSuperBase ()

    public GetSuperBase(): Completion<JSValue> {
        const envRec = this;
        const home = envRec.homeObject;
        if (home instanceof JSUndefined)
            return new NormalCompletion(new JSUndefined());
        return home.__GetPrototypeOf__();
    }
}

// ES6 Section 8.1.1.4: Global Environment Records

export class GlobalEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_GlobalEnvironmentRecord: any;
    public realm: Realm;
    public objectRecord: ObjectEnvironmentRecord;
    public declarativeRecord: DeclarativeEnvironmentRecord;
    public varNames: string[];

    public constructor(realm: Realm, G: JSObject) {
        super();
        this.realm = realm;
        this.objectRecord = new ObjectEnvironmentRecord(realm,G);
        this.declarativeRecord = new DeclarativeEnvironmentRecord(realm);
        this.varNames = [];
    }

    // ES6 Section 8.1.1.4.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.4.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): void {
        throw new Error("GlobalEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): void {
        throw new Error("GlobalEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        throw new Error("GlobalEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.4.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("GlobalEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.6: GetBindingValue (N, S)

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

    public GetThisBinding(): Completion<JSValue> {
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

    public constructor(realm: Realm) {
        super(realm);
    }

    // ES6 Section 8.1.1.5.1: GetBindingValue (N, S)

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

    public GetThisBinding(): Completion<JSValue> {
        throw new Error("ModuleEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.5.5: CreateImportBinding (N, M, N2)

    public CreateImportBinding(N: string, M: UnknownType, N2: string): Completion<UnknownType> {
        throw new Error("ModuleEnvironmentRecord.CreateImportBinding not implemented");
    }
}

// ES6 Section 8.1.2: Lexical Environment Operations

// ES6 Section 8.1.2.1: GetIdentifierReference (lex, name, strict)

export function GetIdentifierReference(realm: Realm, lex: LexicalEnvironment | null, name: string, strict: boolean): Completion<Reference> {
    if (lex === null) {
        const ref = new Reference(new JSUndefined(),new JSString(name),new JSBoolean(strict));
        return new NormalCompletion(ref);
    }

    const envRec = lex.record;
    const existsComp = envRec.HasBinding(name);
    if (!(existsComp instanceof NormalCompletion))
        return existsComp;
    const exists = existsComp.value;

    if (exists) {
        const ref = new Reference(envRec,new JSString(name),new JSBoolean(strict));
        return new NormalCompletion(ref);
    }
    else {
        const outer = lex.outer;
        return GetIdentifierReference(realm,outer,name,strict);
    }
}

// ES6 Section 8.1.2.2: NewDeclarativeEnvironment (E)

export function NewDeclarativeEnvironment(realm: Realm, E: LexicalEnvironment | null): LexicalEnvironment {
    const envRec = new DeclarativeEnvironmentRecord(realm);
    return { record: envRec, outer: E };
}

// ES6 Section 8.1.2.3: NewObjectEnvironment (O, E)

export function NewObjectEnvironment(realm: Realm, O: JSObject, E: LexicalEnvironment | null): LexicalEnvironment {
    const envRec = new ObjectEnvironmentRecord(realm,O);
    return { record: envRec, outer: E };
}

// ES6 Section 8.1.2.4: NewFunctionEnvironment (F, newTarget)

export function NewFunctionEnvironment(realm: Realm, F: JSFunctionObject, newTarget: JSUndefined | JSObject): LexicalEnvironment {
    // FIXME: Assert: F is an ECMAScript function
    const bindingStatus = (F.thisMode == ThisMode.Lexical) ?
        BindingStatus.Lexical :
        BindingStatus.Uninitialized;
    const envRec = new FunctionEnvironmentRecord(realm,F,newTarget);
    return { record: envRec, outer: F.environment };
}

// ES6 Section 8.1.2.5: NewGlobalEnvironment (G)

export function NewGlobalEnvironment(realm: Realm, G: JSObject): LexicalEnvironment {
    const globalRec = new GlobalEnvironmentRecord(realm,G);
    return { record: globalRec, outer: null };
}

// ES6 Section 8.1.2.6: NewModuleEnvironment (E)

export function NewModuleEnvironment(realm: Realm, E: LexicalEnvironment | null): LexicalEnvironment {
    const envRec = new ModuleEnvironmentRecord(realm);
    return { record: envRec, outer: E };
}
