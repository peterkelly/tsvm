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
    intrinsic_ThrowTypeError,
    intrinsic_ThrowReferenceError,
    ObjectCreate,
} from "./objects";
import {
    HasProperty,
} from "./operations";
// import {
//     ThrowTypeErrorFunction,
//     FunctionPrototypeFunction,
// } from "./builtins";
import * as bi from "./builtins";


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

export class DeclarativeEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_DeclarativeEnvironmentRecord: any;

    public readonly bindings: { [name: string]: DeclarativeBinding } = {};

    public constructor() {
        super();
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
                return intrinsic_ThrowReferenceError();
            envRec.CreateMutableBinding(N,true);
            envRec.InitializeBinding(N,V);
            return new NormalCompletion(undefined);
        }

        const binding = envRec.bindings[N];
        if (binding.strict)
            S = true;
        if (!binding.initialized)
            return intrinsic_ThrowReferenceError();
        else if (binding.mutable)
            binding.value = V;
        else if (S)
            return intrinsic_ThrowTypeError();
        return new NormalCompletion(undefined);
    }

    // ES6 Section 8.1.1.1.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        const envRec = this;
        if (!(N in this.bindings))
            throw new Error("Binding for "+N+" does not exist");
        const binding = this.bindings[N];
        if (!binding.initialized)
            return intrinsic_ThrowReferenceError();
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
    // public withEnvironment: boolean;

    public constructor(bindingObject: JSObject) {
        super();
        this.bindingObject = bindingObject;
        // this.withEnvironment = false;
    }

    // ES6 Section 8.1.1.2.1: HasBinding(N)

    public HasBinding(N: string): Completion<boolean> {
        const envRec = this;
        const bindings = envRec.bindingObject;
        const foundBindingComp = HasProperty(bindings,new JSString(N));
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

    public BindThisValue(V: JSValue): Completion<JSValue> {
        const envRec = this;
        if (envRec.thisBindingStatus == BindingStatus.Lexical)
            throw new Error("FunctionEnvironmentRecord.BindThisValue: thisBindingStatus is Lexical");
        if (envRec.thisBindingStatus == BindingStatus.Initialized)
            return intrinsic_ThrowReferenceError();
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
            return intrinsic_ThrowReferenceError();
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
    public intrinsics: Intrinsics | undefined;
    public globalThis: JSObject | JSUndefined;
    public globalEnv: LexicalEnvironment | JSUndefined;
    public templateMap: any[]; // FIXME

    public constructor() {
        // this.intrinsics = new Intrinsics();
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

export function CreateIntrinsics(realm: Realm): Intrinsics {
    const objProto = new JSObject();
    const thrower = new bi.ThrowTypeErrorFunction(realm);
    const funcProto = new bi.FunctionPrototypeFunction(realm);

    thrower.__prototype__ = funcProto;





    return {
        Array: new bi.BuiltinArrayConstructor(realm),
        ArrayBuffer: new bi.BuiltinArrayBufferConstructor(realm),
        ArrayBufferPrototype: new bi.BuiltinArrayBufferPrototype(),
        ArrayIteratorPrototype: new bi.BuiltinArrayBufferPrototype(),
        ArrayPrototype: new bi.BuiltinArrayPrototype(),
        ArrayProto_values: new bi.BuiltinArrayProto_values(),
        Boolean: new bi.BuiltinBooleanConstructor(realm),
        BooleanPrototype: new bi.BuiltinBooleanPrototype(),
        DataView: new bi.BuiltinDataViewConstructor(realm),
        DataViewPrototype: new bi.BuiltinDataViewPrototype(),
        Date: new bi.BuiltinDateConstructor(realm),
        DatePrototype: new bi.BuiltinDatePrototype(),
        decodeURI: new bi.BuiltindecodeURIFunction(realm),
        decodeURIComponent: new bi.BuiltindecodeURIComponentFunction(realm),
        encodeURI: new bi.BuiltinencodeURIFunction(realm),
        encodeURIComponent: new bi.BuiltinencodeURIComponentFunction(realm),
        Error: new bi.BuiltinErrorConstructor(realm),
        ErrorPrototype: new bi.BuiltinErrorPrototype(),
        eval: new bi.BuiltinevalFunction(realm),
        EvalError: new bi.BuiltinEvalErrorConstructor(realm),
        EvalErrorPrototype: new bi.BuiltinEvalErrorPrototype(),
        Float32Array: new bi.BuiltinFloat32ArrayConstructor(realm),
        Float32ArrayPrototype: new bi.BuiltinFloat32ArrayPrototype(),
        Float64Array: new bi.BuiltinFloat64ArrayConstructor(realm),
        Float64ArrayPrototype: new bi.BuiltinFloat64ArrayPrototype(),
        Function: new bi.BuiltinFunctionConstructor(realm),
        Generator: new bi.BuiltinGenerator(),
        GeneratorFunction: new bi.BuiltinGeneratorFunctionConstructor(realm),
        GeneratorPrototype: new bi.BuiltinGeneratorPrototype(),
        Int8Array: new bi.BuiltinInt8ArrayConstructor(realm),
        Int8ArrayPrototype: new bi.BuiltinInt8ArrayPrototype(),
        Int16Array: new bi.BuiltinInt16ArrayConstructor(realm),
        Int16ArrayPrototype: new bi.BuiltinInt16ArrayPrototype(),
        Int32Array: new bi.BuiltinInt32ArrayConstructor(realm),
        Int32ArrayPrototype: new bi.BuiltinInt32ArrayPrototype(),
        isFinite: new bi.BuiltinisFiniteFunction(realm),
        isNaN: new bi.BuiltinisNaNFunction(realm),
        IteratorPrototype: new bi.BuiltinIteratorPrototype(),
        JSON: new bi.BuiltinJSONObject(),
        Map: new bi.BuiltinMapConstructor(realm),
        MapIteratorPrototype: new bi.BuiltinMapIteratorPrototype(),
        MapPrototype: new bi.BuiltinMapPrototype(),
        Math: new bi.BuiltinMathObject(),
        Number: new bi.BuiltinNumberConstructor(realm),
        NumberPrototype: new bi.BuiltinNumberPrototype(),
        Object: new bi.BuiltinObjectConstructor(realm),
        ObjProto_toString: new bi.BuiltinObjProto_toStringFunction(realm),
        parseFloat: new bi.BuiltinparseFloatFunction(realm),
        parseInt: new bi.BuiltinparseIntFunction(realm),
        Promise: new bi.BuiltinPromiseConstructor(realm),
        PromisePrototype: new bi.BuiltinPromisePrototype(),
        Proxy: new bi.BuiltinProxyConstructor(realm),
        RangeError: new bi.BuiltinRangeErrorConstructor(realm),
        RangeErrorPrototype: new bi.BuiltinRangeErrorPrototype(),
        ReferenceError: new bi.BuiltinReferenceErrorConstructor(realm),
        ReferenceErrorPrototype: new bi.BuiltinReferenceErrorPrototype(),
        Reflect: new bi.BuiltinReflectObject(),
        RegExp: new bi.BuiltinRegExpConstructor(realm),
        RegExpPrototype: new bi.BuiltinRegExpPrototype(),
        Set: new bi.BuiltinSetConstructor(realm),
        SetIteratorPrototype: new bi.BuiltinSetIteratorPrototype(),
        SetPrototype: new bi.BuiltinSetPrototype(),
        String: new bi.BuiltinStringConstructor(realm),
        StringIteratorPrototype: new bi.BuiltinStringIteratorPrototype(),
        StringPrototype: new bi.BuiltinStringPrototype(),
        Symbol: new bi.BuiltinSymbolConstructor(realm),
        SymbolPrototype: new bi.BuiltinSymbolPrototype(),
        SyntaxError: new bi.BuiltinSyntaxErrorConstructor(realm),
        SyntaxErrorPrototype: new bi.BuiltinSyntaxErrorPrototype(),
        TypedArrayPrototype: new bi.BuiltinTypedArrayPrototype(),
        TypeError: new bi.BuiltinTypeErrorConstructor(realm),
        TypeErrorPrototype: new bi.BuiltinTypeErrorPrototype(),
        Uint8Array: new bi.BuiltinUint8ArrayConstructor(realm),
        Uint8ArrayPrototype: new bi.BuiltinUint8ArrayPrototype(),
        Uint8ClampedArray: new bi.BuiltinUint8ClampedArrayConstructor(realm),
        Uint8ClampedArrayPrototype: new bi.BuiltinUint8ClampedArrayPrototype(),
        Uint16Array: new bi.BuiltinUint16ArrayConstructor(realm),
        Uint16ArrayPrototype: new bi.BuiltinUint16ArrayPrototype(),
        Uint32Array: new bi.BuiltinUint32ArrayConstructor(realm),
        Uint32ArrayPrototype: new bi.BuiltinUint32ArrayPrototype(),
        URIError: new bi.BuiltinURIErrorConstructor(realm),
        URIErrorPrototype: new bi.BuiltinURIErrorPrototype(),
        WeakMap: new bi.BuiltinWeakMapConstructor(realm),
        WeakMapPrototype: new bi.BuiltinWeakMapPrototype(),
        WeakSet: new bi.BuiltinWeakSetConstructor(realm),
        WeakSetPrototype: new bi.BuiltinWeakSetPrototype(),

        FunctionPrototype: funcProto,
        ObjectPrototype: objProto,
        ThrowTypeError: thrower,
    };

    // throw new Error("CreateIntrinsics not implemented");
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

    public ResolveBinding(name: JSString, env?: LexicalEnvironment | undefined ): Completion<JSValue> {
        throw new Error("ExecutionContext.ResolveBinding not implemented");
    }

    // ES6 Section 8.3.2: GetThisEnvironment ()

    public GetThisEnvironment(): Completion<UnknownType> {
        throw new Error("ExecutionContext.GetThisEnvironment not implemented");
    }

    // ES6 Section 8.3.3: ResolveThisBinding ()

    public ResolveThisBinding(): Completion<JSValue> {
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
