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
} from "./datatypes";
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

export function CreateIntrinsics(realm: Realm): Intrinsics {
    const ObjectPrototype = new JSOrdinaryObject(realm);
    const FunctionPrototype = new bi.BuiltinFunctionPrototype(realm,ObjectPrototype);
    const ThrowTypeError = new bi.ThrowTypeErrorFunction(realm,FunctionPrototype);

    const IteratorPrototype = new bi.BuiltinIteratorPrototype(realm,ObjectPrototype)
    const ErrorPrototype = new bi.BuiltinErrorPrototype(realm,ObjectPrototype);
    const TypedArrayPrototype = new bi.BuiltinTypedArrayPrototype(realm,ObjectPrototype);

    const intrinsics: Intrinsics = {

        // Functions
        decodeURI: new bi.BuiltindecodeURIFunction(realm,FunctionPrototype),
        decodeURIComponent: new bi.BuiltindecodeURIComponentFunction(realm,FunctionPrototype),
        encodeURI: new bi.BuiltinencodeURIFunction(realm,FunctionPrototype),
        encodeURIComponent: new bi.BuiltinencodeURIComponentFunction(realm,FunctionPrototype),
        eval: new bi.BuiltinevalFunction(realm,FunctionPrototype),
        isFinite: new bi.BuiltinisFiniteFunction(realm,FunctionPrototype),
        isNaN: new bi.BuiltinisNaNFunction(realm,FunctionPrototype),
        parseFloat: new bi.BuiltinparseFloatFunction(realm,FunctionPrototype),
        parseInt: new bi.BuiltinparseIntFunction(realm,FunctionPrototype),
        ArrayProto_values: new bi.BuiltinArrayProto_values(realm,FunctionPrototype),
        ObjProto_toString: new bi.BuiltinObjProto_toStringFunction(realm,FunctionPrototype),
        ThrowTypeError: ThrowTypeError,

        // Collections of functions (sort of like modules)
        JSON: new bi.BuiltinJSONObject(realm,ObjectPrototype),
        Reflect: new bi.BuiltinReflectObject(realm,ObjectPrototype),
        Math: new bi.BuiltinMathObject(realm,ObjectPrototype),

        // Constructors
        ArrayBuffer: new bi.BuiltinArrayBufferConstructor(realm,FunctionPrototype),
        DataView: new bi.BuiltinDataViewConstructor(realm,FunctionPrototype),
        Date: new bi.BuiltinDateConstructor(realm,FunctionPrototype),
        Function: new bi.BuiltinFunctionConstructor(realm,FunctionPrototype),
        GeneratorFunction: new bi.BuiltinGeneratorFunctionConstructor(realm,FunctionPrototype),
        Object: new bi.BuiltinObjectConstructor(realm,FunctionPrototype),
        Promise: new bi.BuiltinPromiseConstructor(realm,FunctionPrototype),
        Proxy: new bi.BuiltinProxyConstructor(realm,FunctionPrototype),
        RegExp: new bi.BuiltinRegExpConstructor(realm,FunctionPrototype),

        // Constructors - value wrappers
        Boolean: new bi.BuiltinBooleanConstructor(realm,FunctionPrototype),
        Number: new bi.BuiltinNumberConstructor(realm,FunctionPrototype),
        String: new bi.BuiltinStringConstructor(realm,FunctionPrototype),
        Symbol: new bi.BuiltinSymbolConstructor(realm,FunctionPrototype),

        // Constructors - collections
        Array: new bi.BuiltinArrayConstructor(realm,FunctionPrototype),
        Map: new bi.BuiltinMapConstructor(realm,FunctionPrototype),
        Set: new bi.BuiltinSetConstructor(realm,FunctionPrototype),
        WeakMap: new bi.BuiltinWeakMapConstructor(realm,FunctionPrototype),
        WeakSet: new bi.BuiltinWeakSetConstructor(realm,FunctionPrototype),

        // Constructors - errors
        Error: new bi.BuiltinErrorConstructor(realm,FunctionPrototype),
        EvalError: new bi.BuiltinEvalErrorConstructor(realm,FunctionPrototype),
        RangeError: new bi.BuiltinRangeErrorConstructor(realm,FunctionPrototype),
        ReferenceError: new bi.BuiltinReferenceErrorConstructor(realm,FunctionPrototype),
        SyntaxError: new bi.BuiltinSyntaxErrorConstructor(realm,FunctionPrototype),
        TypeError: new bi.BuiltinTypeErrorConstructor(realm,FunctionPrototype),
        URIError: new bi.BuiltinURIErrorConstructor(realm,FunctionPrototype),

        // Constructors - typed arrays
        Float32Array: new bi.BuiltinFloat32ArrayConstructor(realm,FunctionPrototype),
        Float64Array: new bi.BuiltinFloat64ArrayConstructor(realm,FunctionPrototype),
        Int8Array: new bi.BuiltinInt8ArrayConstructor(realm,FunctionPrototype),
        Int16Array: new bi.BuiltinInt16ArrayConstructor(realm,FunctionPrototype),
        Int32Array: new bi.BuiltinInt32ArrayConstructor(realm,FunctionPrototype),
        Uint8Array: new bi.BuiltinUint8ArrayConstructor(realm,FunctionPrototype),
        Uint8ClampedArray: new bi.BuiltinUint8ClampedArrayConstructor(realm,FunctionPrototype),
        Uint16Array: new bi.BuiltinUint16ArrayConstructor(realm,FunctionPrototype),
        Uint32Array: new bi.BuiltinUint32ArrayConstructor(realm,FunctionPrototype),

        // Prototypes
        ObjectPrototype: ObjectPrototype,
        FunctionPrototype: FunctionPrototype,
        ArrayBufferPrototype: new bi.BuiltinArrayBufferPrototype(realm,ObjectPrototype),
        DataViewPrototype: new bi.BuiltinDataViewPrototype(realm,ObjectPrototype),
        DatePrototype: new bi.BuiltinDatePrototype(realm,ObjectPrototype),
        Generator: new bi.BuiltinGenerator(realm,ObjectPrototype),
        PromisePrototype: new bi.BuiltinPromisePrototype(realm,ObjectPrototype),
        RegExpPrototype: new bi.BuiltinRegExpPrototype(realm,ObjectPrototype),

        // Prototypes - value wrappers
        BooleanPrototype: new bi.BuiltinBooleanPrototype(realm,ObjectPrototype),
        NumberPrototype: new bi.BuiltinNumberPrototype(realm,ObjectPrototype),
        StringPrototype: new bi.BuiltinStringPrototype(realm,ObjectPrototype),
        SymbolPrototype: new bi.BuiltinSymbolPrototype(realm,ObjectPrototype),

        // Prototypes - collections
        ArrayPrototype: new bi.BuiltinArrayPrototype(realm,ObjectPrototype),
        MapPrototype: new bi.BuiltinMapPrototype(realm,ObjectPrototype),
        SetPrototype: new bi.BuiltinSetPrototype(realm,ObjectPrototype),
        WeakMapPrototype: new bi.BuiltinWeakMapPrototype(realm,ObjectPrototype),
        WeakSetPrototype: new bi.BuiltinWeakSetPrototype(realm,ObjectPrototype),

        // Prototypes - errors
        ErrorPrototype: ErrorPrototype,
        EvalErrorPrototype: new bi.BuiltinEvalErrorPrototype(realm,ErrorPrototype),
        RangeErrorPrototype: new bi.BuiltinRangeErrorPrototype(realm,ErrorPrototype),
        ReferenceErrorPrototype: new bi.BuiltinReferenceErrorPrototype(realm,ErrorPrototype),
        SyntaxErrorPrototype: new bi.BuiltinSyntaxErrorPrototype(realm,ErrorPrototype),
        TypeErrorPrototype: new bi.BuiltinTypeErrorPrototype(realm,ErrorPrototype),
        URIErrorPrototype: new bi.BuiltinURIErrorPrototype(realm,ErrorPrototype),

        // Prototypes - iterators
        IteratorPrototype: IteratorPrototype,
        ArrayIteratorPrototype: new bi.BuiltinArrayBufferPrototype(realm,IteratorPrototype),
        GeneratorPrototype: new bi.BuiltinGeneratorPrototype(realm,IteratorPrototype),
        MapIteratorPrototype: new bi.BuiltinMapIteratorPrototype(realm,IteratorPrototype),
        SetIteratorPrototype: new bi.BuiltinSetIteratorPrototype(realm,IteratorPrototype),
        StringIteratorPrototype: new bi.BuiltinStringIteratorPrototype(realm,IteratorPrototype),

        // Prototypes - typed arrays
        TypedArrayPrototype: TypedArrayPrototype,
        Float32ArrayPrototype: new bi.BuiltinFloat32ArrayPrototype(realm,TypedArrayPrototype),
        Float64ArrayPrototype: new bi.BuiltinFloat64ArrayPrototype(realm,TypedArrayPrototype),
        Int8ArrayPrototype: new bi.BuiltinInt8ArrayPrototype(realm,TypedArrayPrototype),
        Int16ArrayPrototype: new bi.BuiltinInt16ArrayPrototype(realm,TypedArrayPrototype),
        Int32ArrayPrototype: new bi.BuiltinInt32ArrayPrototype(realm,TypedArrayPrototype),
        Uint8ArrayPrototype: new bi.BuiltinUint8ArrayPrototype(realm,TypedArrayPrototype),
        Uint8ClampedArrayPrototype: new bi.BuiltinUint8ClampedArrayPrototype(realm,TypedArrayPrototype),
        Uint16ArrayPrototype: new bi.BuiltinUint16ArrayPrototype(realm,TypedArrayPrototype),
        Uint32ArrayPrototype: new bi.BuiltinUint32ArrayPrototype(realm,TypedArrayPrototype),
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

    // Note: Generator prototype section in spec seems to be the only place that mentions the attributes
    // of the prototype's constructor property descriptor

    function setupConstructorPrototype(constructor: JSObject, prototype: JSObject): void {
        const constructorStr = "constructor"; // Avoid TypeScript warnings about setting constructor property
        constructor.properties["prototype"] = new DataDescriptor({
            value: prototype,
            writable: false,
            enumerable: false,
            configurable: false,
        });
        prototype.properties[constructorStr] = new DataDescriptor({
            value: constructor,
            writable: false,
            enumerable: false,
            configurable: true,
        });

    }

    setupConstructorPrototype(intrinsics.Array,intrinsics.ArrayPrototype);
    setupConstructorPrototype(intrinsics.ArrayBuffer,intrinsics.ArrayBufferPrototype);
    setupConstructorPrototype(intrinsics.Boolean,intrinsics.BooleanPrototype);
    setupConstructorPrototype(intrinsics.DataView,intrinsics.DataViewPrototype);
    setupConstructorPrototype(intrinsics.Date,intrinsics.DatePrototype);
    setupConstructorPrototype(intrinsics.Error,intrinsics.ErrorPrototype);
    setupConstructorPrototype(intrinsics.EvalError,intrinsics.EvalErrorPrototype);
    setupConstructorPrototype(intrinsics.Float32Array,intrinsics.Float32ArrayPrototype);
    setupConstructorPrototype(intrinsics.Float64Array,intrinsics.Float64ArrayPrototype);
    setupConstructorPrototype(intrinsics.Function,intrinsics.FunctionPrototype);
    setupConstructorPrototype(intrinsics.GeneratorFunction,intrinsics.Generator);
    setupConstructorPrototype(intrinsics.Int8Array,intrinsics.Int8ArrayPrototype);
    setupConstructorPrototype(intrinsics.Int8Array,intrinsics.Int8ArrayPrototype);
    setupConstructorPrototype(intrinsics.Int32Array,intrinsics.Int32ArrayPrototype);
    setupConstructorPrototype(intrinsics.Map,intrinsics.MapPrototype);
    setupConstructorPrototype(intrinsics.Number,intrinsics.NumberPrototype);
    setupConstructorPrototype(intrinsics.Object,intrinsics.ObjectPrototype);
    setupConstructorPrototype(intrinsics.Promise,intrinsics.PromisePrototype);
    setupConstructorPrototype(intrinsics.RangeError,intrinsics.RangeErrorPrototype);
    setupConstructorPrototype(intrinsics.ReferenceError,intrinsics.ReferenceErrorPrototype);
    setupConstructorPrototype(intrinsics.RegExp,intrinsics.RegExpPrototype);
    setupConstructorPrototype(intrinsics.Set,intrinsics.SetPrototype);
    setupConstructorPrototype(intrinsics.String,intrinsics.StringPrototype);
    setupConstructorPrototype(intrinsics.Symbol,intrinsics.SymbolPrototype);
    setupConstructorPrototype(intrinsics.SyntaxError,intrinsics.SyntaxErrorPrototype);
    setupConstructorPrototype(intrinsics.TypeError,intrinsics.TypeErrorPrototype);
    setupConstructorPrototype(intrinsics.Uint8Array,intrinsics.Uint8ArrayPrototype);
    setupConstructorPrototype(intrinsics.Uint8ClampedArray,intrinsics.Uint8ClampedArrayPrototype);
    setupConstructorPrototype(intrinsics.Uint16Array,intrinsics.Uint16ArrayPrototype);
    setupConstructorPrototype(intrinsics.Uint32Array,intrinsics.Uint32ArrayPrototype);
    setupConstructorPrototype(intrinsics.URIError,intrinsics.URIErrorPrototype);
    setupConstructorPrototype(intrinsics.WeakMap,intrinsics.WeakMapPrototype);
    setupConstructorPrototype(intrinsics.WeakSet,intrinsics.WeakSetPrototype);

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
