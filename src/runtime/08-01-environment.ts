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
    ToBoolean,
} from "./07-01-conversion";
import {
    IsExtensible,
} from "./07-02-testcompare";
import {
    ObjectCreate,
} from "./09-01-ordinary";
import {
    JSFunction,
    ThisMode,
} from "./09-02-function";
import {
    Get,
    GetV,
    Set,
    CreateDataProperty,
    CreateMethodProperty,
    CreateDataPropertyOrThrow,
    DefinePropertyOrThrow,
    DeletePropertyOrThrow,
    GetMethod,
    HasProperty,
    HasOwnProperty,
    Call,
    Construct,
    SetIntegrityLevel,
    TestIntegrityLevel,
    CreateArrayFromList,
    CreateListFromArrayLike,
    Invoke,
    OrdinaryHasInstance,
    SpeciesConstructor,
    EnumerableOwnNames,
    GetFunctionRealm,
} from "./07-03-objects";
// import * as bi from "./builtins";

// ES6 Section 8.1.1: Environment Records

// ES6 Section 8.1.1.1: Declarative Environment Records

class DeclarativeBinding {
    _nominal_type_DeclarativeBinding: any;
    public value: JSValue;
    public canDelete: boolean;
    public mutable: boolean;
    public initialized: boolean;
    public strict: boolean;

    public constructor(options: {
        value: JSValue,
        canDelete: boolean,
        mutable: boolean,
        initialized: boolean,
        strict: boolean,
    }) {
        this.value = options.value;
        this.canDelete = options.canDelete;
        this.mutable = options.mutable;
        this.initialized = options.initialized;
        this.strict = options.strict;
    }

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

    public CreateMutableBinding(N: string, D: boolean = false): Completion<void> {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec does not already have a binding for N.
        if (this.bindings.contains(N))
            throw new Error("Assertion failure: envRec does not already have a binding for N");

        // 3. Create a mutable binding in envRec for N and record that it is uninitialized. If D is
        // true record that the newly created binding may be deleted by a subsequent DeleteBinding
        // call.
        this.bindings.put(N,new DeclarativeBinding({
            value: new JSUndefined(),
            canDelete: D,
            mutable: true,
            initialized: false,
            strict: true, // Spec doesn't actually mention what strict should be here
        }));

        // 4. Return NormalCompletion(empty).
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.1.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean = false): Completion<void> {
        // 1. Let envRec be the declarative Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec does not already have a binding for N.
        if (this.bindings.contains(N))
            throw new Error("Assertion failure: envRec does not already have a binding for N");

        // 3. Create an immutable binding in envRec for N and record that it is uninitialized. If S
        // is true record that the newly created binding is a strict binding.
        this.bindings.put(N,new DeclarativeBinding({
            value: new JSUndefined(),
            canDelete: false, // Spec doesn't actually mention what canDelete should be here
            mutable: false,
            initialized: false,
            strict: S,
        }));

        // 4. Return NormalCompletion(empty).
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.1.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): Completion<void> {
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
        return new NormalCompletion(undefined);
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
    public withEnvironment: boolean;

    public constructor(realm: Realm, bindingObject: JSObject) {
        super();
        this.realm = realm;
        this.bindingObject = bindingObject;
        this.withEnvironment = true; // FIXME: What should this be by default?
    }

    // ES6 Section 8.1.1.2.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let bindings be the binding object for envRec.
        const bindings = this.bindingObject;

        // 3. Let foundBinding be HasProperty(bindings, N)
        // 4. ReturnIfAbrupt(foundBinding).
        const foundBindingComp = HasProperty(this.realm,bindings,new JSString(N));
        if (!(foundBindingComp instanceof NormalCompletion))
            return foundBindingComp;
        const foundBinding = foundBindingComp.value;

        // 5. If foundBinding is false, return false.
        if (!foundBinding)
            return new NormalCompletion(false);

        // 6. If the withEnvironment flag of envRec is false, return true.
        if (!this.withEnvironment)
            return new NormalCompletion(true);

        // 7. Let unscopables be Get(bindings, @@unscopables).
        // 8. ReturnIfAbrupt(unscopables).
        const unscopablesComp = Get(this.realm,bindings,JSSymbol.$$unscopables);
        if (!(unscopablesComp instanceof NormalCompletion))
            return unscopablesComp;
        const unscopables = unscopablesComp.value;

        // 9. If Type(unscopables) is Object, then
        if (unscopables instanceof JSObject) {
            // a. Let blocked be ToBoolean(Get(unscopables, N)).
            // b. ReturnIfAbrupt(blocked).
            const blockedComp = ToBoolean(this.realm,Get(this.realm,unscopables,new JSString(N)));
            if (!(blockedComp instanceof NormalCompletion))
                return blockedComp;
            const blocked = blockedComp.value;

            // c. If blocked is true, return false.
            if (blocked)
                return new NormalCompletion(false);
        }

        // 10. Return true.
        return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.2.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): Completion<void> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let bindings be the binding object for envRec.
        const bindings = this.bindingObject;

        // 3. If D is true then let configValue be true otherwise let configValue be false.
        const configValue = D;

        // 4. Return DefinePropertyOrThrow(bindings, N,
        //        PropertyDescriptor{ [[Value]]:undefined,
        //                            [[Writable]]: true,
        //                            [[Enumerable]]: true,
        //                            [[Configurable]]: configValue }).
        const resultComp = DefinePropertyOrThrow(this.realm,bindings,new JSString(N),new DataDescriptor({
            value: new JSUndefined(),
            writable: true,
            enumerable: true,
            configurable: configValue,
        }));
        if (!(resultComp instanceof NormalCompletion))
            return resultComp;
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.2.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): Completion<void> {
        throw new Error("CreateImmutableBinding is not used in the spec with object environments");
    }

    // ES6 Section 8.1.1.2.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): Completion<void> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec must have an uninitialized binding for N.
        // 3. Record that the binding for N in envRec has been initialized.
        //     "NOTE: In this specification, all uses of CreateMutableBinding for object Environment
        //     Records are immediately followed by a call to InitializeBinding for the same name.
        //     Hence, implementations do not need to explicitly track the initialization state of
        //     individual object Environment Record bindings."

        // 4. Return envRec.SetMutableBinding(N, V, false).
        return envRec.SetMutableBinding(N,V,false);
    }

    // ES6 Section 8.1.1.2.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let bindings be the binding object for envRec.
        const bindings = this.bindingObject;

        // 3. Return Set(bindings, N, V, S).
        const resultComp = Set(this.realm,bindings,new JSString(N),V,S);
        if (!(resultComp instanceof NormalCompletion))
            return resultComp;
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.2.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let bindings be the binding object for envRec.
        const bindings = this.bindingObject;

        // 3. Let value be HasProperty(bindings, N).
        // 4. ReturnIfAbrupt(value).
        const valueComp = HasProperty(this.realm,bindings,new JSString(N));
        if (!(valueComp instanceof NormalCompletion))
            return valueComp;
        const value = valueComp.value;

        // 5. If value is false, then
        if (!value) {
            // a. If S is false, return the value undefined, otherwise throw a ReferenceError
            // exception.
            if (!S)
                return new NormalCompletion(new JSUndefined());
            else
                this.realm.throwReferenceError(N+" is not defined");
        }

        // 6. Return Get(bindings, N).
        return Get(this.realm,bindings,new JSString(N));
    }

    // ES6 Section 8.1.1.2.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let bindings be the binding object for envRec.
        const bindings = this.bindingObject;

        // 3. Return bindings.[[Delete]](N).
        return bindings.__Delete__(this.realm,new JSString(N));
    }

    // ES6 Section 8.1.1.2.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        // 1. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.2.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        // 1. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.2.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        // 1. Let envRec be the object Environment Record for which the method was invoked.
        const envRec = this;

        // 2. If the withEnvironment flag of envRec is true, return the binding object for envRec.
        if (this.withEnvironment)
            return new NormalCompletion(this.bindingObject);

        // 3. Otherwise, return undefined.
        return new NormalCompletion(new JSUndefined());
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
        // 1. Let envRec be the function Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec.[[thisBindingStatus]] is not "lexical".
        if (envRec.thisBindingStatus === BindingStatus.Lexical)
            throw new Error("Assertion failure: envRec.[[thisBindingStatus]] is not \"lexical\"");

        // 3. If envRec.[[thisBindingStatus]] is "initialized", throw a ReferenceError exception.
        if (envRec.thisBindingStatus === BindingStatus.Initialized)
            return this.realm.throwReferenceError("this binding already initialized");

        // 4. Set envRec.[[thisValue]] to V.
        envRec.thisValue = V;

        // 5. Set envRec.[[thisBindingStatus]] to "initialized".
        envRec.thisBindingStatus = BindingStatus.Lexical;

        // 6. Return V.
        return new NormalCompletion(V);
    }

    // ES6 Section 8.1.1.3.2: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        // 1. Let envRec be the function Environment Record for which the method was invoked.
        const envRec = this;

        // 2. If envRec.[[thisBindingStatus]] is "lexical", return false; otherwise, return true.
        if (envRec.thisBindingStatus === BindingStatus.Lexical)
            return new NormalCompletion(false);
        else
            return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.3.3: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        // 1. Let envRec be the function Environment Record for which the method was invoked.
        const envRec = this;

        // 2. If envRec.[[thisBindingStatus]] is "lexical", return false.
        if (envRec.thisBindingStatus === BindingStatus.Lexical)
            return new NormalCompletion(false);

        // 3. If envRec.[[HomeObject]] has the value undefined, return false, otherwise, return true.
        if (envRec.homeObject instanceof JSUndefined)
            return new NormalCompletion(false);
        else
            return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.3.4: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        // 1. Let envRec be the function Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Assert: envRec.[[thisBindingStatus]] is not "lexical".
        if (envRec.thisBindingStatus === BindingStatus.Lexical)
            throw new Error("Assertion failure: envRec.[[thisBindingStatus]] is not \"lexical\"");

        // 3. If envRec.[[thisBindingStatus]] is "uninitialized", throw a ReferenceError exception.
        if (envRec.thisBindingStatus === BindingStatus.Uninitialized)
            return this.realm.throwReferenceError("this binding is uninitialized");

        // 4. Return envRec.[[thisValue]].
        return new NormalCompletion(envRec.thisValue);
    }

    // ES6 Section 8.1.1.3.5: GetSuperBase ()

    public GetSuperBase(): Completion<JSValue> {
        // 1. Let envRec be the function Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let home be the value of envRec.[[HomeObject]].
        const home = envRec.homeObject;

        // 3. If home has the value undefined, return undefined.
        if (home instanceof JSUndefined)
            return new NormalCompletion(new JSUndefined());

        // 4. Assert: Type(home) is Object.
        // (guaranteed by type system)

        // 5. Return home.[[GetPrototypeOf]]().
        return home.__GetPrototypeOf__(this.realm);
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
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, return true.
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas)
            return new NormalCompletion(true);

        // 4. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 5. Return ObjRec.HasBinding(N).
        return objRec.HasBinding(N);
    }

    // ES6 Section 8.1.1.4.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): Completion<void> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, throw a TypeError exception.
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas)
            return this.realm.throwTypeError(N+": binding already exists");

        // 4. Return DclRec.CreateMutableBinding(N, D).
        return dclRec.CreateMutableBinding(N,D);
    }

    // ES6 Section 8.1.1.4.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): Completion<void> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, throw a TypeError exception.
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas)
            return this.realm.throwTypeError(N+": binding already exists");

        // 4. Return DclRec.CreateImmutableBinding(N, S).
        return dclRec.CreateImmutableBinding(N,S);
    }

    // ES6 Section 8.1.1.4.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): Completion<void> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, then
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas) {
            // a. Return DclRec.InitializeBinding(N, V).
            return dclRec.InitializeBinding(N,V);
        }

        // 4. Assert: If the binding exists it must be in the object Environment Record.
        // (implicity guaranteed by above)

        // 5. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 6. Return ObjRec.InitializeBinding(N, V).
        return objRec.InitializeBinding(N,V);
    }

    // ES6 Section 8.1.1.4.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, then
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas) {
            // a. Return DclRec.SetMutableBinding(N, V, S).
            return dclRec.SetMutableBinding(N,V,S);
        }

        // 4. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 5. Return ObjRec.SetMutableBinding(N, V, S).
        return objRec.SetMutableBinding(N,V,S);
    }

    // ES6 Section 8.1.1.4.6: GetBindingValue (N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, then
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas) {
            // a. Return DclRec.GetBindingValue(N, S).
            return dclRec.GetBindingValue(N,S);
        }

        // 4. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 5. Return ObjRec.GetBindingValue(N, S).
        return objRec.GetBindingValue(N,S);
    }

    // ES6 Section 8.1.1.4.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = envRec.declarativeRecord;

        // 3. If DclRec.HasBinding(N) is true, then
        const dclHasComp = dclRec.HasBinding(N);
        if (!(dclHasComp instanceof NormalCompletion))
            return dclHasComp;
        const dclHas = dclHasComp.value;
        if (dclHas) {
            // a. Return DclRec.DeleteBinding(N).
            return dclRec.DeleteBinding(N);
        }

        // 4. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 5. Let globalObject be the binding object for ObjRec.
        const globalObject = objRec.bindingObject;

        // 6. Let existingProp be HasOwnProperty(globalObject, N).
        // 7. ReturnIfAbrupt(existingProp).
        const existingPropComp = HasOwnProperty(this.realm,globalObject,new JSString(N));
        if (!(existingPropComp instanceof NormalCompletion))
            return existingPropComp;
        const existingProp = existingPropComp.value;

        // 8. If existingProp is true, then
        if (existingProp) {
            // a. Let status be ObjRec.DeleteBinding(N).
            // b. ReturnIfAbrupt(status).
            const statusComp = objRec.DeleteBinding(N);
            if (!(statusComp instanceof NormalCompletion))
                return statusComp;
            const status = statusComp.value;

            // c. If status is true, then
            if (status) {
                // i. Let varNames be envRec.[[VarNames]].
                const varNames = envRec.varNames;
                // ii. If N is an element of varNames, remove that element from the varNames.
                const index = varNames.indexOf(N);
                if (index >= 0)
                    varNames.splice(index,1);
            }

            // d. Return status.
            return new NormalCompletion(status);
        }

        // 9. Return true.
        return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.4.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        // 1. Return true.
        return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.4.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        // 1. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.4.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        // 1. Return undefined.
        return new NormalCompletion(new JSUndefined());
    }

    // ES6 Section 8.1.1.4.11: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 3. Let bindings be the binding object for ObjRec.
        const bindings = objRec.bindingObject;

        // 4. Return bindings.
        return new NormalCompletion(bindings);
    }

    // ES6 Section 8.1.1.4.12: HasVarDeclaration (N)

    public HasVarDeclaration(N: string): Completion<boolean> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let varDeclaredNames be envRec.[[VarNames]].
        const varDeclaredNames = envRec.varNames;

        // 3. If varDeclaredNames contains the value of N, return true.
        if (varDeclaredNames.indexOf(N) >= 0)
            return new NormalCompletion(true);

        // 4. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.4.13: HasLexicalDeclaration (N)

    public HasLexicalDeclaration(N: string): Completion<boolean> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let DclRec be envRec.[[DeclarativeRecord]].
        const dclRec = this.declarativeRecord;

        // 3. Return DclRec.HasBinding(N).
        return dclRec.HasBinding(N);
    }

    // ES6 Section 8.1.1.4.14: HasRestrictedGlobalProperty (N)

    public HasRestrictedGlobalProperty(N: string): Completion<boolean> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 3. Let globalObject be the binding object for ObjRec.
        const globalObject = objRec.bindingObject;

        // 4. Let existingProp be globalObject.[[GetOwnProperty]](N).
        // 5. ReturnIfAbrupt(existingProp).
        const existingPropComp = globalObject.__GetOwnProperty__(this.realm,new JSString(N));
        if (!(existingPropComp instanceof NormalCompletion))
            return existingPropComp;
        const existingProp = existingPropComp.value;

        // 6. If existingProp is undefined, return false.
        if (existingProp instanceof JSUndefined)
            return new NormalCompletion(false);

        // 7. If existingProp.[[Configurable]] is true, return false.
        if (existingProp.configurable)
            return new NormalCompletion(false);

        // 8. Return true.
        return new NormalCompletion(true);
    }

    // ES6 Section 8.1.1.4.15: CanDeclareGlobalVar (N)

    public CanDeclareGlobalVar(N: string): Completion<boolean> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 3. Let globalObject be the binding object for ObjRec.
        const globalObject = objRec.bindingObject;

        // 4. Let hasProperty be HasOwnProperty(globalObject, N).
        // 5. ReturnIfAbrupt(hasProperty).
        const hasPropertyComp = HasOwnProperty(this.realm,globalObject,new JSString(N));
        if (!(hasPropertyComp instanceof NormalCompletion))
            return hasPropertyComp;
        const hasProperty = hasPropertyComp.value;

        // 6. If hasProperty is true, return true.
        if (hasProperty)
            return new NormalCompletion(true);

        // 7. Return IsExtensible(globalObject).
        return IsExtensible(this.realm,globalObject);
    }

    // ES6 Section 8.1.1.4.16: CanDeclareGlobalFunction (N)

    public CanDeclareGlobalFunction(N: string): Completion<boolean> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 3. Let globalObject be the binding object for ObjRec.
        const globalObject = objRec.bindingObject;

        // 4. Let existingProp be globalObject.[[GetOwnProperty]](N).
        // 5. ReturnIfAbrupt(existingProp).
        const existingPropComp = globalObject.__GetOwnProperty__(this.realm,new JSString(N));
        if (!(existingPropComp instanceof NormalCompletion))
            return existingPropComp;
        const existingProp = existingPropComp.value;

        // 6. If existingProp is undefined, return IsExtensible(globalObject).
        if (existingProp instanceof JSUndefined)
            return IsExtensible(this.realm,globalObject);

        // 7. If existingProp.[[Configurable]] is true, return true.
        if (existingProp.configurable)
            return new NormalCompletion(true);

        // 8. If IsDataDescriptor(existingProp) is true and existingProp has attribute values
        // {[[Writable]]: true, [[Enumerable]]: true}, return true.
        if ((existingProp instanceof DataDescriptor) &&
            existingProp.writable &&
            existingProp.enumerable)
            return new NormalCompletion(true);

        // 9. Return false.
        return new NormalCompletion(false);
    }

    // ES6 Section 8.1.1.4.17: CreateGlobalVarBinding (N, D)

    public CreateGlobalVarBinding(N: string, D: boolean): Completion<void> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 3. Let globalObject be the binding object for ObjRec.
        const globalObject = objRec.bindingObject;

        // 4. Let hasProperty be HasOwnProperty(globalObject, N).
        // 5. ReturnIfAbrupt(hasProperty).
        const hasPropertyComp = HasOwnProperty(this.realm,globalObject,new JSString(N));
        if (!(hasPropertyComp instanceof NormalCompletion))
            return hasPropertyComp;
        const hasProperty = hasPropertyComp.value;

        // 6. Let extensible be IsExtensible(globalObject).
        // 7. ReturnIfAbrupt(extensible).
        const extensibleComp = IsExtensible(this.realm,globalObject);
        if (!(extensibleComp instanceof NormalCompletion))
            return extensibleComp;
        const extensible = extensibleComp.value;

        // 8. If hasProperty is false and extensible is true, then
        if (!hasProperty && extensible) {
            // a. Let status be ObjRec.CreateMutableBinding(N, D).
            // b. ReturnIfAbrupt(status).
            const createStatusComp = objRec.CreateMutableBinding(N,D);
            if (!(createStatusComp instanceof NormalCompletion))
                return createStatusComp;

            // c. Let status be ObjRec.InitializeBinding(N, undefined).
            // d. ReturnIfAbrupt(status).
            const initStatusComp = objRec.InitializeBinding(N,new JSUndefined());
            if (!(initStatusComp instanceof NormalCompletion))
                return initStatusComp;
        }

        // 9. Let varDeclaredNames be envRec.[[VarNames]].
        const varDeclaredNames = envRec.varNames;

        // 10. If varDeclaredNames does not contain the value of N, then
        if (varDeclaredNames.indexOf(N) < 0) {
            // a. Append N to varDeclaredNames.
            varDeclaredNames.push(N);
        }

        // 11. Return NormalCompletion(empty).
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.4.18: CreateGlobalFunctionBinding (N, V, D)

    public CreateGlobalFunctionBinding(N: string, V: JSValue, D: boolean): Completion<void> {
        // 1. Let envRec be the global Environment Record for which the method was invoked.
        const envRec = this;

        // 2. Let ObjRec be envRec.[[ObjectRecord]].
        const objRec = envRec.objectRecord;

        // 3. Let globalObject be the binding object for ObjRec.
        const globalObject = objRec.bindingObject;

        // 4. Let existingProp be globalObject.[[GetOwnProperty]](N).
        // 5. ReturnIfAbrupt(existingProp).
        const existingPropComp = globalObject.__GetOwnProperty__(this.realm,new JSString(N));
        if (!(existingPropComp instanceof NormalCompletion))
            return existingPropComp;
        const existingProp = existingPropComp.value;

        // 6. If existingProp is undefined or existingProp.[[Configurable]] is true, then
        let desc: PropertyDescriptor;
        if ((existingProp instanceof JSUndefined) || existingProp.configurable) {
            // a. Let desc be the PropertyDescriptor{[[Value]]:V, [[Writable]]: true,
            // [[Enumerable]]: true , [[Configurable]]: D}.
            desc = new DataDescriptor({
                value: V,
                writable: true,
                enumerable: true,
                configurable: D,
            });
        }
        // 7. Else,
        else {
            // a. Let desc be the PropertyDescriptor{[[Value]]:V }.

            // Note: The spec doesn't mention what the other attributes of the newly-created
            // property descriptor should be. I assume that we should just keep ones from the
            // existing descriptor.

            // FIXME: Not sure about the writable attribute in the case where the existing
            // descriptor is an AccessorDescriptor

            desc = new DataDescriptor({
                value: V,
                writable: (existingProp instanceof DataDescriptor) ? existingProp.writable : true,
                enumerable: existingProp.enumerable,
                configurable: existingProp.configurable,
            });
        }

        // 8. Let status be DefinePropertyOrThrow(globalObject, N, desc).
        // 9. ReturnIfAbrupt(status).
        const defineStatusComp = DefinePropertyOrThrow(this.realm,globalObject,new JSString(N),desc);
        if (!(defineStatusComp instanceof NormalCompletion))
            return defineStatusComp;

        // 10. Let status be Set(globalObject, N, V, false).
        const setStatusComp = Set(this.realm,globalObject,new JSString(N),V,false);

        // 11. Record that the binding for N in ObjRec has been initialized.
        // FIXME: Not sure how this statement makes sense in this context, since we don't use
        // bindings in ObjectEnvironmentRecord. Maybe we should?

        // 12. ReturnIfAbrupt(status).
        if (!(setStatusComp instanceof NormalCompletion))
            return setStatusComp;

        // 13. Let varDeclaredNames be envRec.[[VarNames]].
        const varDeclaredNames = envRec.varNames;

        // 14. If varDeclaredNames does not contain the value of N, then
        if (varDeclaredNames.indexOf(N) < 0) {
            // a. Append N to varDeclaredNames.
            varDeclaredNames.push(N);
        }

        // 15. Return NormalCompletion(empty).
        return new NormalCompletion(undefined);
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
