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
} from "./datatypes";
import {
    JSFunctionObject,
    ThisMode,
    ObjectCreate,
} from "./objects";
import {
    intrinsic_ThrowTypeError,
    intrinsic_ThrowReferenceError,
    HasProperty,
} from "./operations";
// import {
//     ThrowTypeErrorFunction,
//     FunctionPrototypeFunction,
// } from "./builtins";
import * as bi from "./builtins";


// ES6 Section 8.1: Lexical Environments


// export class LexicalEnvironment {
//     _nominal_type_LexicalEnvironment: any;
//     public record: EnvironmentRecord;
//     public outer: LexicalEnvironment | null;
//
//     public constructor(record: EnvironmentRecord, outer: LexicalEnvironment | null) {
//         this.record = record;
//         this.outer = outer;
//     }
// }

// ES6 Section 8.1.1: Environment Records

export abstract class AbstractEnvironmentRecord implements EnvironmentRecord {
    _nominal_type_EnvironmentRecord: any;

    public constructor() {
    }

    // FIXME: I believe this can just return a boolean, not a completion
    public abstract HasBinding(N: string): Completion<boolean>;

    public abstract CreateMutableBinding(N: string, D: boolean): void;

    public abstract CreateImmutableBinding(N: string, S: boolean): void;

    public abstract InitializeBinding(N: string, V: JSValue): void;

    public abstract SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void>;

    public abstract GetBindingValue(N: string, S: boolean): Completion<JSValue>;

    public abstract DeleteBinding(N: string): Completion<boolean>;

    public abstract HasThisBinding(): Completion<boolean>;

    public abstract HasSuperBinding(): Completion<boolean>;

    public abstract WithBaseObject(): Completion<JSObject | JSUndefined>;
}

// ES6 Section 8.1.1.1: Declarative Environment Records

interface DeclarativeBinding {
    value: JSValue;
    canDelete: boolean;
    mutable: boolean;
    initialized: boolean;
    strict: boolean;
}

export class DeclarativeEnvironmentRecord extends AbstractEnvironmentRecord {
    _nominal_type_DeclarativeEnvironmentRecord: any;

    public readonly bindings: { [name: string]: DeclarativeBinding } = {};
    public realm: Realm;

    public constructor(realm: Realm) {
        super();
        this.realm = realm;
    }

    // ES6 Section 8.1.1.1.1: HasBinding(N)

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

    // ES6 Section 8.1.1.1.5 SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        const envRec = this;

        if (!(N in envRec.bindings)) {
            if (S)
                return intrinsic_ThrowReferenceError(this.realm);
            envRec.CreateMutableBinding(N,true);
            envRec.InitializeBinding(N,V);
            return new NormalCompletion(undefined);
        }

        const binding = envRec.bindings[N];
        if (binding.strict)
            S = true;
        if (!binding.initialized)
            return intrinsic_ThrowReferenceError(this.realm);
        else if (binding.mutable)
            binding.value = V;
        else if (S)
            return intrinsic_ThrowTypeError(this.realm);
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.1.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        const envRec = this;
        if (!(N in this.bindings))
            throw new Error("Binding for "+N+" does not exist");
        const binding = this.bindings[N];
        if (!binding.initialized)
            return intrinsic_ThrowReferenceError(this.realm);
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

export class ObjectEnvironmentRecord extends AbstractEnvironmentRecord {
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

    // ES6 Section 8.1.1.2.1: HasBinding(N)

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

    // ES6 Section 8.1.1.3.1: BindThisValue(V)

    public BindThisValue(V: JSValue): Completion<JSValue> {
        const envRec = this;
        if (envRec.thisBindingStatus == BindingStatus.Lexical)
            throw new Error("FunctionEnvironmentRecord.BindThisValue: thisBindingStatus is Lexical");
        if (envRec.thisBindingStatus == BindingStatus.Initialized)
            return intrinsic_ThrowReferenceError(this.realm);
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
            return intrinsic_ThrowReferenceError(this.realm);
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

export class GlobalEnvironmentRecord extends AbstractEnvironmentRecord {
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

    // ES6 Section 8.1.1.4.1: HasBinding(N)

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

    // ES6 Section 8.1.1.4.6: GetBindingValue(N, S)

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

    public GetThisBinding(): Completion<JSValue> {
        throw new Error("ModuleEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.5.5: CreateImportBinding (N, M, N2)

    public CreateImportBinding(N: string, M: any, N2: any): Completion<UnknownType> {
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

// ES6 Section 8.2: Code Realms

export class RealmImpl implements Realm {
    _nominal_type_RealmImpl: any;
    public intrinsics: Intrinsics;
    public globalThis: JSObject;
    public globalEnv: LexicalEnvironment;
    public templateMap: any[]; // FIXME

    public constructor() {
        this.intrinsics = CreateIntrinsics(this);
        this.globalThis = new JSOrdinaryObject(this,this.intrinsics.ObjectPrototype);
        this.globalEnv = NewDeclarativeEnvironment(this,null); // FIXME
        this.templateMap = [];
        SetDefaultGlobalBindings(this);
    }
}

// ES6 Section 8.2.1: CreateRealm ()

export function CreateRealm(): Realm {
    return new RealmImpl();
}

// ES6 Section 8.2.2: CreateIntrinsics (realmRec)

export function CreateIntrinsics(realm: Realm): Intrinsics {
    const objProto = new JSOrdinaryObject(realm);
    const thrower = new bi.ThrowTypeErrorFunction(realm,new JSNull());
    const funcProto = new bi.BuiltinFunctionPrototype(realm,new JSNull());

    thrower.__prototype__ = funcProto;
    funcProto.__prototype__ = objProto;


    // Function.prototype.__proto__ === Object.prototype




    const intrinsics = {
        ObjectPrototype: objProto,
        ThrowTypeError: thrower,
        FunctionPrototype: funcProto,

        Array: new bi.BuiltinArrayConstructor(realm,funcProto),
        ArrayBuffer: new bi.BuiltinArrayBufferConstructor(realm,funcProto),
        ArrayBufferPrototype: new bi.BuiltinArrayBufferPrototype(realm,funcProto),
        ArrayIteratorPrototype: new bi.BuiltinArrayBufferPrototype(realm,funcProto),
        ArrayPrototype: new bi.BuiltinArrayPrototype(realm,funcProto),
        ArrayProto_values: new bi.BuiltinArrayProto_values(realm,funcProto),
        Boolean: new bi.BuiltinBooleanConstructor(realm,funcProto),
        BooleanPrototype: new bi.BuiltinBooleanPrototype(realm,funcProto),
        DataView: new bi.BuiltinDataViewConstructor(realm,funcProto),
        DataViewPrototype: new bi.BuiltinDataViewPrototype(realm,funcProto),
        Date: new bi.BuiltinDateConstructor(realm,funcProto),
        DatePrototype: new bi.BuiltinDatePrototype(realm,funcProto),
        decodeURI: new bi.BuiltindecodeURIFunction(realm,funcProto),
        decodeURIComponent: new bi.BuiltindecodeURIComponentFunction(realm,funcProto),
        encodeURI: new bi.BuiltinencodeURIFunction(realm,funcProto),
        encodeURIComponent: new bi.BuiltinencodeURIComponentFunction(realm,funcProto),
        Error: new bi.BuiltinErrorConstructor(realm,funcProto),
        ErrorPrototype: new bi.BuiltinErrorPrototype(realm,funcProto),
        eval: new bi.BuiltinevalFunction(realm,funcProto),
        EvalError: new bi.BuiltinEvalErrorConstructor(realm,funcProto),
        EvalErrorPrototype: new bi.BuiltinEvalErrorPrototype(realm,funcProto),
        Float32Array: new bi.BuiltinFloat32ArrayConstructor(realm,funcProto),
        Float32ArrayPrototype: new bi.BuiltinFloat32ArrayPrototype(realm,funcProto),
        Float64Array: new bi.BuiltinFloat64ArrayConstructor(realm,funcProto),
        Float64ArrayPrototype: new bi.BuiltinFloat64ArrayPrototype(realm,funcProto),
        Function: new bi.BuiltinFunctionConstructor(realm,funcProto),
        Generator: new bi.BuiltinGenerator(realm,funcProto),
        GeneratorFunction: new bi.BuiltinGeneratorFunctionConstructor(realm,funcProto),
        GeneratorPrototype: new bi.BuiltinGeneratorPrototype(realm,funcProto),
        Int8Array: new bi.BuiltinInt8ArrayConstructor(realm,funcProto),
        Int8ArrayPrototype: new bi.BuiltinInt8ArrayPrototype(realm,funcProto),
        Int16Array: new bi.BuiltinInt16ArrayConstructor(realm,funcProto),
        Int16ArrayPrototype: new bi.BuiltinInt16ArrayPrototype(realm,funcProto),
        Int32Array: new bi.BuiltinInt32ArrayConstructor(realm,funcProto),
        Int32ArrayPrototype: new bi.BuiltinInt32ArrayPrototype(realm,funcProto),
        isFinite: new bi.BuiltinisFiniteFunction(realm,funcProto),
        isNaN: new bi.BuiltinisNaNFunction(realm,funcProto),
        IteratorPrototype: new bi.BuiltinIteratorPrototype(realm,funcProto),
        JSON: new bi.BuiltinJSONObject(realm,funcProto),
        Map: new bi.BuiltinMapConstructor(realm,funcProto),
        MapIteratorPrototype: new bi.BuiltinMapIteratorPrototype(realm,funcProto),
        MapPrototype: new bi.BuiltinMapPrototype(realm,funcProto),
        Math: new bi.BuiltinMathObject(realm,funcProto),
        Number: new bi.BuiltinNumberConstructor(realm,funcProto),
        NumberPrototype: new bi.BuiltinNumberPrototype(realm,funcProto),
        Object: new bi.BuiltinObjectConstructor(realm,funcProto),
        ObjProto_toString: new bi.BuiltinObjProto_toStringFunction(realm,funcProto),
        parseFloat: new bi.BuiltinparseFloatFunction(realm,funcProto),
        parseInt: new bi.BuiltinparseIntFunction(realm,funcProto),
        Promise: new bi.BuiltinPromiseConstructor(realm,funcProto),
        PromisePrototype: new bi.BuiltinPromisePrototype(realm,funcProto),
        Proxy: new bi.BuiltinProxyConstructor(realm,funcProto),
        RangeError: new bi.BuiltinRangeErrorConstructor(realm,funcProto),
        RangeErrorPrototype: new bi.BuiltinRangeErrorPrototype(realm,funcProto),
        ReferenceError: new bi.BuiltinReferenceErrorConstructor(realm,funcProto),
        ReferenceErrorPrototype: new bi.BuiltinReferenceErrorPrototype(realm,funcProto),
        Reflect: new bi.BuiltinReflectObject(realm,funcProto),
        RegExp: new bi.BuiltinRegExpConstructor(realm,funcProto),
        RegExpPrototype: new bi.BuiltinRegExpPrototype(realm,funcProto),
        Set: new bi.BuiltinSetConstructor(realm,funcProto),
        SetIteratorPrototype: new bi.BuiltinSetIteratorPrototype(realm,funcProto),
        SetPrototype: new bi.BuiltinSetPrototype(realm,funcProto),
        String: new bi.BuiltinStringConstructor(realm,funcProto),
        StringIteratorPrototype: new bi.BuiltinStringIteratorPrototype(realm,funcProto),
        StringPrototype: new bi.BuiltinStringPrototype(realm,funcProto),
        Symbol: new bi.BuiltinSymbolConstructor(realm,funcProto),
        SymbolPrototype: new bi.BuiltinSymbolPrototype(realm,funcProto),
        SyntaxError: new bi.BuiltinSyntaxErrorConstructor(realm,funcProto),
        SyntaxErrorPrototype: new bi.BuiltinSyntaxErrorPrototype(realm,funcProto),
        TypedArrayPrototype: new bi.BuiltinTypedArrayPrototype(realm,funcProto),
        TypeError: new bi.BuiltinTypeErrorConstructor(realm,funcProto),
        TypeErrorPrototype: new bi.BuiltinTypeErrorPrototype(realm,funcProto),
        Uint8Array: new bi.BuiltinUint8ArrayConstructor(realm,funcProto),
        Uint8ArrayPrototype: new bi.BuiltinUint8ArrayPrototype(realm,funcProto),
        Uint8ClampedArray: new bi.BuiltinUint8ClampedArrayConstructor(realm,funcProto),
        Uint8ClampedArrayPrototype: new bi.BuiltinUint8ClampedArrayPrototype(realm,funcProto),
        Uint16Array: new bi.BuiltinUint16ArrayConstructor(realm,funcProto),
        Uint16ArrayPrototype: new bi.BuiltinUint16ArrayPrototype(realm,funcProto),
        Uint32Array: new bi.BuiltinUint32ArrayConstructor(realm,funcProto),
        Uint32ArrayPrototype: new bi.BuiltinUint32ArrayPrototype(realm,funcProto),
        URIError: new bi.BuiltinURIErrorConstructor(realm,funcProto),
        URIErrorPrototype: new bi.BuiltinURIErrorPrototype(realm,funcProto),
        WeakMap: new bi.BuiltinWeakMapConstructor(realm,funcProto),
        WeakMapPrototype: new bi.BuiltinWeakMapPrototype(realm,funcProto),
        WeakSet: new bi.BuiltinWeakSetConstructor(realm,funcProto),
        WeakSetPrototype: new bi.BuiltinWeakSetPrototype(realm,funcProto),
    };

    const globals = {
        Array: intrinsics.Array,
        ArrayBuffer: intrinsics.ArrayBuffer,
        Boolean: intrinsics.Boolean,
        DataView: intrinsics.DataView,
        Date: intrinsics.Date,
        decodeURI: intrinsics.decodeURI,
        decodeURIComponent: intrinsics.decodeURIComponent,
        encodeURI: intrinsics.encodeURI,
        encodeURIComponent: intrinsics.encodeURIComponent,
        Error: intrinsics.Error,
        eval: intrinsics.eval,
        EvalError: intrinsics.EvalError,
        Float32Array: intrinsics.Float32Array,
        Float64Array: intrinsics.Float64Array,
        Function: intrinsics.Function,
        Int8Array: intrinsics.Int8Array,
        Int16Array: intrinsics.Int16Array,
        Int32Array: intrinsics.Int32Array,
        isFinite: intrinsics.isFinite,
        isNaN: intrinsics.isNaN,
        JSON: intrinsics.JSON,
        Map: intrinsics.Map,
        Math: intrinsics.Math,
        Number: intrinsics.Number,
        Object: intrinsics.Object,
        parseFloat: intrinsics.parseFloat,
        parseInt: intrinsics.parseInt,
        Promise: intrinsics.Promise,
        Proxy: intrinsics.Proxy,
        RangeError: intrinsics.RangeError,
        ReferenceError: intrinsics.ReferenceError,
        Reflect: intrinsics.Reflect,
        RegExp: intrinsics.RegExp,
        Set: intrinsics.Set,
        String: intrinsics.String,
        Symbol: intrinsics.Symbol,
        SyntaxError: intrinsics.SyntaxError,
        TypeError: intrinsics.TypeError,
        Uint8Array: intrinsics.Uint8Array,
        Uint8ClampedArray: intrinsics.Uint8ClampedArray,
        Uint16Array: intrinsics.Uint16Array,
        Uint32Array: intrinsics.Uint32Array,
        URIError: intrinsics.URIError,
        WeakMap: intrinsics.WeakMap,
        WeakSet: intrinsics.WeakSet,
    };

    intrinsics.Array.__prototype__ = intrinsics.ArrayPrototype;
    intrinsics.ArrayBuffer.__prototype__ = intrinsics.ArrayBufferPrototype;
    intrinsics.Boolean.__prototype__ = intrinsics.BooleanPrototype;
    intrinsics.DataView.__prototype__ = intrinsics.DataViewPrototype;
    intrinsics.Date.__prototype__ = intrinsics.DatePrototype;
    intrinsics.Error.__prototype__ = intrinsics.ErrorPrototype;
    intrinsics.EvalError.__prototype__ = intrinsics.EvalErrorPrototype;
    intrinsics.Float32Array.__prototype__ = intrinsics.Float32ArrayPrototype;
    intrinsics.Float64Array.__prototype__ = intrinsics.Float64ArrayPrototype;
    intrinsics.Function.__prototype__ = intrinsics.FunctionPrototype;
    intrinsics.Int8Array.__prototype__ = intrinsics.Int8ArrayPrototype;
    intrinsics.Int16Array.__prototype__ = intrinsics.Int16ArrayPrototype;
    intrinsics.Int32Array.__prototype__ = intrinsics.Int32ArrayPrototype;
    intrinsics.Map.__prototype__ = intrinsics.MapPrototype;
    intrinsics.Number.__prototype__ = intrinsics.NumberPrototype;
    intrinsics.Object.__prototype__ = intrinsics.ObjectPrototype;
    // FIXME: ObjProto_toString
    intrinsics.Promise.__prototype__ = intrinsics.PromisePrototype;
    intrinsics.RangeError.__prototype__ = intrinsics.RangeErrorPrototype;
    intrinsics.ReferenceError.__prototype__ = intrinsics.ReferenceErrorPrototype;
    intrinsics.RegExp.__prototype__ = intrinsics.RegExpPrototype;
    intrinsics.Set.__prototype__ = intrinsics.SetPrototype;
    intrinsics.String.__prototype__ = intrinsics.StringPrototype;
    intrinsics.Symbol.__prototype__ = intrinsics.SymbolPrototype;
    intrinsics.SyntaxError.__prototype__ = intrinsics.SyntaxErrorPrototype;
    intrinsics.TypeError.__prototype__ = intrinsics.TypeErrorPrototype;
    intrinsics.Uint8Array.__prototype__ = intrinsics.Uint8ArrayPrototype;
    intrinsics.Uint8ClampedArray.__prototype__ = intrinsics.Uint8ClampedArrayPrototype;
    intrinsics.Uint16Array.__prototype__ = intrinsics.Uint16ArrayPrototype;
    intrinsics.Uint32Array.__prototype__ = intrinsics.Uint32ArrayPrototype;
    intrinsics.URIError.__prototype__ = intrinsics.URIErrorPrototype;
    intrinsics.WeakMap.__prototype__ = intrinsics.WeakMapPrototype;
    intrinsics.WeakSet.__prototype__ = intrinsics.WeakSetPrototype;

    function immutableProperty(value: JSValue): PropertyDescriptor {
        return new DataDescriptor({
            value: value,
            writable: false,
            enumerable: false,
            configurable: false,
        });
    }

    intrinsics.Array.properties["prototype"] = immutableProperty(intrinsics.ArrayPrototype);
    intrinsics.ArrayBuffer.properties["prototype"] = immutableProperty(intrinsics.ArrayBufferPrototype);
    intrinsics.Boolean.properties["prototype"] = immutableProperty(intrinsics.BooleanPrototype);
    intrinsics.DataView.properties["prototype"] = immutableProperty(intrinsics.DataViewPrototype);
    intrinsics.Date.properties["prototype"] = immutableProperty(intrinsics.DatePrototype);
    intrinsics.Error.properties["prototype"] = immutableProperty(intrinsics.ErrorPrototype);
    intrinsics.EvalError.properties["prototype"] = immutableProperty(intrinsics.EvalErrorPrototype);
    intrinsics.Float32Array.properties["prototype"] = immutableProperty(intrinsics.Float32ArrayPrototype);
    intrinsics.Float64Array.properties["prototype"] = immutableProperty(intrinsics.Float64ArrayPrototype);
    intrinsics.Function.properties["prototype"] = immutableProperty(intrinsics.FunctionPrototype);
    intrinsics.GeneratorFunction.properties["prototype"] = immutableProperty(intrinsics.Generator);
    intrinsics.Int8Array.properties["prototype"] = immutableProperty(intrinsics.Int8ArrayPrototype);
    intrinsics.Int16Array.properties["prototype"] = immutableProperty(intrinsics.Int16ArrayPrototype);
    intrinsics.Int32Array.properties["prototype"] = immutableProperty(intrinsics.Int32ArrayPrototype);
    intrinsics.Map.properties["prototype"] = immutableProperty(intrinsics.MapPrototype);
    intrinsics.Number.properties["prototype"] = immutableProperty(intrinsics.NumberPrototype);
    intrinsics.Object.properties["prototype"] = immutableProperty(intrinsics.ObjectPrototype);
    intrinsics.Promise.properties["prototype"] = immutableProperty(intrinsics.PromisePrototype);
    intrinsics.RangeError.properties["prototype"] = immutableProperty(intrinsics.RangeErrorPrototype);
    intrinsics.ReferenceError.properties["prototype"] = immutableProperty(intrinsics.ReferenceErrorPrototype);
    intrinsics.RegExp.properties["prototype"] = immutableProperty(intrinsics.RegExpPrototype);
    intrinsics.Set.properties["prototype"] = immutableProperty(intrinsics.SetPrototype);
    intrinsics.String.properties["prototype"] = immutableProperty(intrinsics.StringPrototype);
    intrinsics.Symbol.properties["prototype"] = immutableProperty(intrinsics.SymbolPrototype);
    intrinsics.SyntaxError.properties["prototype"] = immutableProperty(intrinsics.SyntaxErrorPrototype);
    intrinsics.TypeError.properties["prototype"] = immutableProperty(intrinsics.TypeErrorPrototype);
    intrinsics.Uint8Array.properties["prototype"] = immutableProperty(intrinsics.Uint8ArrayPrototype);
    intrinsics.Uint8ClampedArray.properties["prototype"] = immutableProperty(intrinsics.Uint8ClampedArrayPrototype);
    intrinsics.Uint16Array.properties["prototype"] = immutableProperty(intrinsics.Uint16ArrayPrototype);
    intrinsics.Uint32Array.properties["prototype"] = immutableProperty(intrinsics.Uint32ArrayPrototype);
    intrinsics.URIError.properties["prototype"] = immutableProperty(intrinsics.URIErrorPrototype);
    intrinsics.WeakMap.properties["prototype"] = immutableProperty(intrinsics.WeakMapPrototype);
    intrinsics.WeakSet.properties["prototype"] = immutableProperty(intrinsics.WeakSetPrototype);

    return intrinsics;

    // throw new Error("CreateIntrinsics not implemented");
}

// ES6 Section 8.2.3: SetRealmGlobalObject (realmRec, globalObj)

export function SetRealmGlobalObject(realm: Realm, globalObj: JSObject | JSUndefined): Realm {
    throw new Error("SetRealmGlobalObject not implemented");
}

// ES6 Section 8.2.4: SetDefaultGlobalBindings (realmRec)

function SetDefaultGlobalBindings(realm: Realm): void {

    function prop(value: JSValue): PropertyDescriptor {
        // FIXME: Check that the configurable, enumerable, and writable settings are correct
        return new DataDescriptor({
            configurable: true,
            enumerable: true,
            value: value,
            writable: true,
        });
    }

    const global = realm.globalThis;

    // ES6 Section 18.1: Value Properties of the Global Object

    // Infinity
    global.properties["Infinity"] = new DataDescriptor({
        value: new JSNumber(rt_Infinity()),
        writable: false,
        enumerable: false,
        configurable: false,
    });

    // NaN
    global.properties["NaN"] = new DataDescriptor({
        value: new JSNumber(rt_NaN()),
        writable: false,
        enumerable: false,
        configurable: false,
    });

    // undefined
    global.properties["undefined"] = new DataDescriptor({
        value: new JSUndefined(),
        writable: false,
        enumerable: false,
        configurable: false,
    });

    // ES6 Section 18.2: Function Properties of the Global Object

    // eval
    global.properties["eval"] = prop(realm.intrinsics.eval);
    global.properties["isFinite"] = prop(realm.intrinsics.isFinite);
    global.properties["isNaN"] = prop(realm.intrinsics.isNaN);
    global.properties["parseFloat"] = prop(realm.intrinsics.parseFloat);
    global.properties["parseInt"] = prop(realm.intrinsics.parseInt);
    global.properties["decodeURI"] = prop(realm.intrinsics.decodeURI);
    global.properties["decodeURIComponent"] = prop(realm.intrinsics.decodeURIComponent);
    global.properties["encodeURI"] = prop(realm.intrinsics.encodeURI);
    global.properties["encodeURIComponent"] = prop(realm.intrinsics.encodeURIComponent);

    // ES6 Section 18.3: Constructor Properties of the Global Object

    global.properties["Array"] = prop(realm.intrinsics.Array);
    global.properties["ArrayBuffer"] = prop(realm.intrinsics.ArrayBuffer);
    global.properties["Boolean"] = prop(realm.intrinsics.Boolean);
    global.properties["DataView"] = prop(realm.intrinsics.DataView);
    global.properties["Date"] = prop(realm.intrinsics.Date);
    global.properties["Error"] = prop(realm.intrinsics.Error);
    global.properties["EvalError"] = prop(realm.intrinsics.EvalError);
    global.properties["Float32Array"] = prop(realm.intrinsics.Float32Array);
    global.properties["Float64Array"] = prop(realm.intrinsics.Float64Array);
    global.properties["Function"] = prop(realm.intrinsics.Function);
    global.properties["Int8Array"] = prop(realm.intrinsics.Int8Array);
    global.properties["Int16Array"] = prop(realm.intrinsics.Int16Array);
    global.properties["Int32Array"] = prop(realm.intrinsics.Int32Array);
    global.properties["Map"] = prop(realm.intrinsics.Map);
    global.properties["Number"] = prop(realm.intrinsics.Number);
    global.properties["Object"] = prop(realm.intrinsics.Object);
    global.properties["Proxy"] = prop(realm.intrinsics.Proxy);
    global.properties["Promise"] = prop(realm.intrinsics.Promise);
    global.properties["RangeError"] = prop(realm.intrinsics.RangeError);
    global.properties["ReferenceError"] = prop(realm.intrinsics.ReferenceError);
    global.properties["RegExp"] = prop(realm.intrinsics.RegExp);
    global.properties["Set"] = prop(realm.intrinsics.Set);
    global.properties["String"] = prop(realm.intrinsics.String);
    global.properties["Symbol"] = prop(realm.intrinsics.Symbol);
    global.properties["SyntaxError"] = prop(realm.intrinsics.SyntaxError);
    global.properties["TypeError"] = prop(realm.intrinsics.TypeError);
    global.properties["Uint8Array"] = prop(realm.intrinsics.Uint8Array);
    global.properties["Uint8ClampedArray"] = prop(realm.intrinsics.Uint8ClampedArray);
    global.properties["Uint16Array"] = prop(realm.intrinsics.Uint16Array);
    global.properties["Uint32Array"] = prop(realm.intrinsics.Uint32Array);
    global.properties["URIError"] = prop(realm.intrinsics.URIError);
    global.properties["WeakMap"] = prop(realm.intrinsics.WeakMap);
    global.properties["WeakSet"] = prop(realm.intrinsics.WeakSet);

    // ES6 Section 18.4: Other Properties of the Global Object

    global.properties["JSON"] = prop(realm.intrinsics.JSON);
    global.properties["Math"] = prop(realm.intrinsics.Math);
    global.properties["Reflect"] = prop(realm.intrinsics.Reflect);
}

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
