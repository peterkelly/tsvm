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
    GenericMap,
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
    JSFunction,
    ThisMode,
} from "./09-02-function";
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

    public readonly bindings: GenericMap<DeclarativeBinding>;
    public realm: Realm;

    public constructor(realm: Realm) {
        super();
        this.bindings = new GenericMap<DeclarativeBinding>();
        this.realm = realm;
    }

    // ES6 Section 8.1.1.1.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. If envRec has a binding for the name that is the value of N, return true.
        if (this.bindings.contains(N))
            return new NormalCompletion(true);

        // 3. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.1.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean = false): void {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec does not already have a binding for N.
        if (this.bindings.contains(N))
            throw new Error("Assertion failure: envRec does not already have a binding for N");

        // 3. Create a mutable binding in envRec for N and record that it is uninitialized. If D is
        // true record that the newly created binding may be deleted by a subsequent DeleteBinding
        // call.
        this.bindings.put(N,{
            value: new JSUndefined(),
            canDelete: D,
            mutable: true,
            initialized: false,
            strict: true, // Spec doesn't actually mention what strict should be here
        });

        // 4. Return NormalCompletion(empty).
        return;
    }

    // ES6 Section 8.1.1.1.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean = false): void {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec does not already have a binding for N.
        if (this.bindings.contains(N))
            throw new Error("Assertion failure: envRec does not already have a binding for N");

        // 3. Create an immutable binding in envRec for N and record that it is uninitialized. If S
        // is true record that the newly created binding is a strict binding.
        this.bindings.put(N,{
            value: new JSUndefined(),
            canDelete: false, // Spec doesn't actually mention what canDelete should be here
            mutable: false,
            initialized: false,
            strict: S,
        });

        // 4. Return NormalCompletion(empty).
        return;
    }

    // ES6 Section 8.1.1.1.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec must have an uninitialized binding for N.
        const binding = this.bindings.get(N);
        if (binding === undefined)
            throw new Error("Assertion failure: envRec must have an uninitialized binding for N.");
        if (binding.initialized)
            throw new Error("Assertion failure: envRec must have an uninitialized binding for N.");

        // 3. Set the bound value for N in envRec to V.
        binding.value = V;

        // 4. Record that the binding for N in envRec has been initialized.
        binding.initialized = true;

        // 5. Return NormalCompletion(empty).
        return;
    }

    // ES6 Section 8.1.1.1.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. If envRec does not have a binding for N, then
        const binding = this.bindings.get(N);
        if (binding === undefined) {
            // a. If S is true throw a ReferenceError exception.
            if (S)
                return this.realm.throwReferenceError(N+": no such binding");

            // b. Perform envRec.CreateMutableBinding(N, true).
            envRec.CreateMutableBinding(N,true);

            // c. Perform envRec.InitializeBinding(N, V).
            envRec.InitializeBinding(N,V);

            // d. Return NormalCompletion(empty).
            return new NormalCompletion(undefined);
        }

        // 3. If the binding for N in envRec is a strict binding, let S be true.
        if (binding.strict)
            S = true;

        // 4. If the binding for N in envRec has not yet been initialized throw a ReferenceError
        // exception.
        if (!binding.initialized) {
            return this.realm.throwReferenceError(N+": binding has not yet been initialized");
        }
        // 5. Else if the binding for N in envRec is a mutable binding, change its bound value to V.
        else if (binding.mutable) {
            binding.value = V;
        }
        // 6. Else this must be an attempt to change the value of an immutable binding so if S is
        // true throw a TypeError exception.
        else {
            return this.realm.throwTypeError(N+": binding is immutable");
        }

        // Return NormalCompletion(empty).
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.1.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec has a binding for N.
        const binding = this.bindings.get(N);
        if (binding === undefined)
            throw new Error("Assertion failure: envRec has a binding for N");

        // 3. If the binding for N in envRec is an uninitialized binding, throw a ReferenceError
        // exception.
        if (!binding.initialized)
            throw new Error(N+" has not yet been initialized");

        // 4. Return the value currently bound to N in envRec.
        return new NormalCompletion(binding.value);
    }

    // ES6 Section 8.1.1.1.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec has a binding for the name that is the value of N.
        const binding = this.bindings.get(N);
        if (binding === undefined)
            throw new Error("Assertion failure: envRec has a binding for the name that is the value of N");

        // 3. If the binding for N in envRec cannot be deleted, return false.
        if (!binding.canDelete)
            return new NormalCompletion(false);

        // 4. Remove the binding for N from envRec.
        this.bindings.remove(N);

        // 5. Return true.
        return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.1.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        // 1. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.1.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        // 1. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.1.10: WithBaseObject ()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        // 1. Return undefined.
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
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): void {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): void {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.2.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("not implemented");
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

    public constructor(realm: Realm, F: JSFunction, newTarget: JSUndefined | JSObject) {
        super(realm);
        this.functionObject = F;
        if (F.thisMode == ThisMode.Lexical)
            this.thisBindingStatus = BindingStatus.Lexical;
        else
            this.thisBindingStatus = BindingStatus.Uninitialized;
        this.homeObject = (F.homeObject === undefined) ? new JSUndefined() : F.homeObject;
        this.newTarget = newTarget;
        this.thisValue = new JSUndefined();
    }

    // ES6 Section 8.1.1.3.1: BindThisValue (V)

    public BindThisValue(V: JSValue): Completion<JSValue> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.3.2: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.3.3: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.3.4: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        throw new Error("not implemented");
    }

    // ES6 Section 8.1.1.3.5: GetSuperBase ()

    public GetSuperBase(): Completion<JSValue> {
        throw new Error("not implemented");
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
    throw new Error("not implemented");
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

export function NewFunctionEnvironment(realm: Realm, F: JSFunction, newTarget: JSUndefined | JSObject): LexicalEnvironment {
    // FIXME: Assert: F is an ECMAScript function
    const bindingStatus = (F.thisMode == ThisMode.Lexical) ?
        BindingStatus.Lexical :
        BindingStatus.Uninitialized;
    const envRec = new FunctionEnvironmentRecord(realm,F,newTarget);
    if (F.environment === undefined)
        return { record: envRec, outer: null };
    else
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
