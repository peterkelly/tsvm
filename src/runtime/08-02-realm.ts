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
    ObjectOperations,
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
    ordinaryObjectOperations,
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
import {
    ErrorObject,
    setupErrorPrototype,
    setupEvalErrorPrototype,
    setupRangeErrorPrototype,
    setupReferenceErrorPrototype,
    setupSyntaxErrorPrototype,
    setupTypeErrorPrototype,
    setupURIErrorPrototype,
} from "./19-05-error";

function setupIntrinsicObjects(realm: Realm): void {
    // Note: We do this separately from *creating* the intrinsics, to ensure that these actions
    // only occur after all intrinsic objects have actually been created. Prior to CreateIntrinsics
    // returning, the realm is not initialized with any such objects.
    setupErrorPrototype(realm,realm.intrinsics.ErrorPrototype);
    setupEvalErrorPrototype(realm.intrinsics.EvalErrorPrototype);
    setupRangeErrorPrototype(realm.intrinsics.RangeErrorPrototype);
    setupReferenceErrorPrototype(realm.intrinsics.ReferenceErrorPrototype);
    setupSyntaxErrorPrototype(realm.intrinsics.SyntaxErrorPrototype);
    setupTypeErrorPrototype(realm.intrinsics.TypeErrorPrototype);
    setupURIErrorPrototype(realm.intrinsics.URIErrorPrototype);
}

// ES6 Section 8.2: Code Realms

export class RealmImpl implements Realm {
    _nominal_type_RealmImpl: any;
    public intrinsics: Intrinsics;
    public globalThis: JSObject;
    public globalEnv: LexicalEnvironment;
    public templateMap: any[]; // FIXME
    public ordinaryOps: ObjectOperations = ordinaryObjectOperations();

    public constructor() {
        this.intrinsics = CreateIntrinsics();
        this.globalThis = new JSObject(this.intrinsics.ObjectPrototype);
        this.globalEnv = NewDeclarativeEnvironment(this,null); // FIXME
        this.templateMap = [];
        SetDefaultGlobalBindings(this);
        setupIntrinsicObjects(this);
    }

    public throwEvalError(message?: string): ThrowCompletion {
        return this.throwError(this.intrinsics.EvalErrorPrototype,message);
    }

    public throwRangeError(message?: string): ThrowCompletion {
        return this.throwError(this.intrinsics.RangeErrorPrototype,message);
    }
    public throwReferenceError(message?: string): ThrowCompletion {
        return this.throwError(this.intrinsics.ReferenceErrorPrototype,message);
    }

    public throwSyntaxError(message?: string): ThrowCompletion {
        return this.throwError(this.intrinsics.SyntaxErrorPrototype,message);
    }

    public throwTypeError(message?: string): ThrowCompletion {
        return this.throwError(this.intrinsics.TypeErrorPrototype,message);
    }

    public throwURIError(message?: string): ThrowCompletion {
        return this.throwError(this.intrinsics.URIErrorPrototype,message);
    }

    private throwError(proto: JSObject, message: string | undefined): ThrowCompletion {
        const error = new ErrorObject(this,proto,message);
        return new ThrowCompletion(error);
    }
}

// ES6 Section 8.2.1: CreateRealm ()

export function CreateRealm(): Realm {
    return new RealmImpl();
}

// ES6 Section 8.2.2: CreateIntrinsics (realmRec)

export function CreateIntrinsics(): Intrinsics {
    const ObjectPrototype = new JSObject();
    const FunctionPrototype = bi.createFunctionPrototype(ObjectPrototype);
    const ThrowTypeError = bi.createThrowTypeErrorFunction(FunctionPrototype);

    const IteratorPrototype = bi.createIteratorPrototype(ObjectPrototype)
    const ErrorPrototype = bi.createErrorPrototype(ObjectPrototype);
    const TypedArrayPrototype = bi.createTypedArrayPrototype(ObjectPrototype);

    const intrinsics: Intrinsics = {

        // Functions
        decodeURI: bi.createDecodeURIFunction(FunctionPrototype),
        decodeURIComponent: bi.createDecodeURIComponentFunction(FunctionPrototype),
        encodeURI: bi.createEncodeURIFunction(FunctionPrototype),
        encodeURIComponent: bi.createEncodeURIComponentFunction(FunctionPrototype),
        eval: bi.createEvalFunction(FunctionPrototype),
        isFinite: bi.createIsFiniteFunction(FunctionPrototype),
        isNaN: bi.createIsNaNFunction(FunctionPrototype),
        parseFloat: bi.createParseFloatFunction(FunctionPrototype),
        parseInt: bi.createParseIntFunction(FunctionPrototype),
        ArrayProto_values: bi.createArrayProto_values(FunctionPrototype),
        ObjProto_toString: bi.createObjProto_toStringFunction(FunctionPrototype),
        ThrowTypeError: ThrowTypeError,

        // Collections of functions (sort of like modules)
        JSON: bi.createJSONObject(ObjectPrototype),
        Reflect: bi.createReflectObject(ObjectPrototype),
        Math: bi.createMathObject(ObjectPrototype),

        // Constructors
        ArrayBuffer: bi.createArrayBufferConstructor(FunctionPrototype),
        DataView: bi.createDataViewConstructor(FunctionPrototype),
        Date: bi.createDateConstructor(FunctionPrototype),
        Function: bi.createFunctionConstructor(FunctionPrototype),
        GeneratorFunction: bi.createGeneratorFunctionConstructor(FunctionPrototype), // FIXME: Generator?
        Object: bi.createObjectConstructor(FunctionPrototype),
        Promise: bi.createPromiseConstructor(FunctionPrototype),
        Proxy: bi.createProxyConstructor(FunctionPrototype),
        RegExp: bi.createRegExpConstructor(FunctionPrototype),

        // Constructors - value wrappers
        Boolean: bi.createBooleanConstructor(FunctionPrototype),
        Number: bi.createNumberConstructor(FunctionPrototype),
        String: bi.createStringConstructor(FunctionPrototype),
        Symbol: bi.createSymbolConstructor(FunctionPrototype),

        // Constructors - collections
        Array: bi.createArrayConstructor(FunctionPrototype),
        Map: bi.createMapConstructor(FunctionPrototype),
        Set: bi.createSetConstructor(FunctionPrototype),
        WeakMap: bi.createWeakMapConstructor(FunctionPrototype),
        WeakSet: bi.createWeakSetConstructor(FunctionPrototype),

        // Constructors - errors
        Error: bi.createErrorConstructor(FunctionPrototype),
        EvalError: bi.createEvalErrorConstructor(FunctionPrototype),
        RangeError: bi.createRangeErrorConstructor(FunctionPrototype),
        ReferenceError: bi.createReferenceErrorConstructor(FunctionPrototype),
        SyntaxError: bi.createSyntaxErrorConstructor(FunctionPrototype),
        TypeError: bi.createTypeErrorConstructor(FunctionPrototype),
        URIError: bi.createURIErrorConstructor(FunctionPrototype),

        // Constructors - typed arrays
        Float32Array: bi.createFloat32ArrayConstructor(FunctionPrototype),
        Float64Array: bi.createFloat64ArrayConstructor(FunctionPrototype),
        Int8Array: bi.createInt8ArrayConstructor(FunctionPrototype),
        Int16Array: bi.createInt16ArrayConstructor(FunctionPrototype),
        Int32Array: bi.createInt32ArrayConstructor(FunctionPrototype),
        Uint8Array: bi.createUint8ArrayConstructor(FunctionPrototype),
        Uint8ClampedArray: bi.createUint8ClampedArrayConstructor(FunctionPrototype),
        Uint16Array: bi.createUint16ArrayConstructor(FunctionPrototype),
        Uint32Array: bi.createUint32ArrayConstructor(FunctionPrototype),

        // Prototypes
        ObjectPrototype: ObjectPrototype,
        FunctionPrototype: FunctionPrototype,
        ArrayBufferPrototype: bi.createArrayBufferPrototype(ObjectPrototype),
        DataViewPrototype: bi.createDataViewPrototype(ObjectPrototype),
        DatePrototype: bi.createDatePrototype(ObjectPrototype),
        Generator: bi.createGenerator(ObjectPrototype),
        PromisePrototype: bi.createPromisePrototype(ObjectPrototype),
        RegExpPrototype: bi.createRegExpPrototype(ObjectPrototype),

        // Prototypes - value wrappers
        BooleanPrototype: bi.createBooleanPrototype(ObjectPrototype),
        NumberPrototype: bi.createNumberPrototype(ObjectPrototype),
        StringPrototype: bi.createStringPrototype(ObjectPrototype),
        SymbolPrototype: bi.createSymbolPrototype(ObjectPrototype),

        // Prototypes - collections
        ArrayPrototype: bi.createArrayPrototype(ObjectPrototype),
        MapPrototype: bi.createMapPrototype(ObjectPrototype),
        SetPrototype: bi.createSetPrototype(ObjectPrototype),
        WeakMapPrototype: bi.createWeakMapPrototype(ObjectPrototype),
        WeakSetPrototype: bi.createWeakSetPrototype(ObjectPrototype),

        // Prototypes - errors
        ErrorPrototype: ErrorPrototype,
        EvalErrorPrototype: bi.createEvalErrorPrototype(ErrorPrototype),
        RangeErrorPrototype: bi.createRangeErrorPrototype(ErrorPrototype),
        ReferenceErrorPrototype: bi.createReferenceErrorPrototype(ErrorPrototype),
        SyntaxErrorPrototype: bi.createSyntaxErrorPrototype(ErrorPrototype),
        TypeErrorPrototype: bi.createTypeErrorPrototype(ErrorPrototype),
        URIErrorPrototype: bi.createURIErrorPrototype(ErrorPrototype),

        // Prototypes - iterators
        IteratorPrototype: IteratorPrototype,
        ArrayIteratorPrototype: bi.createArrayBufferPrototype(IteratorPrototype),
        GeneratorPrototype: bi.createGeneratorPrototype(IteratorPrototype),
        MapIteratorPrototype: bi.createMapIteratorPrototype(IteratorPrototype),
        SetIteratorPrototype: bi.createSetIteratorPrototype(IteratorPrototype),
        StringIteratorPrototype: bi.createStringIteratorPrototype(IteratorPrototype),

        // Prototypes - typed arrays
        TypedArrayPrototype: TypedArrayPrototype,
        Float32ArrayPrototype: bi.createFloat32ArrayPrototype(TypedArrayPrototype),
        Float64ArrayPrototype: bi.createFloat64ArrayPrototype(TypedArrayPrototype),
        Int8ArrayPrototype: bi.createInt8ArrayPrototype(TypedArrayPrototype),
        Int16ArrayPrototype: bi.createInt16ArrayPrototype(TypedArrayPrototype),
        Int32ArrayPrototype: bi.createInt32ArrayPrototype(TypedArrayPrototype),
        Uint8ArrayPrototype: bi.createUint8ArrayPrototype(TypedArrayPrototype),
        Uint8ClampedArrayPrototype: bi.createUint8ClampedArrayPrototype(TypedArrayPrototype),
        Uint16ArrayPrototype: bi.createUint16ArrayPrototype(TypedArrayPrototype),
        Uint32ArrayPrototype: bi.createUint32ArrayPrototype(TypedArrayPrototype),
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
        constructor.properties.put("prototype",new DataDescriptor({
            value: prototype,
            writable: false,
            enumerable: false,
            configurable: false,
        }));
        prototype.properties.put("constructor",new DataDescriptor({
            value: constructor,
            writable: false,
            enumerable: false,
            configurable: true,
        }));

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
    global.properties.put("Infinity",new DataDescriptor({
        value: new JSNumber(rt_Infinity()),
        writable: false,
        enumerable: false,
        configurable: false,
    }));

    // NaN
    global.properties.put("NaN",new DataDescriptor({
        value: new JSNumber(rt_NaN()),
        writable: false,
        enumerable: false,
        configurable: false,
    }));

    // undefined
    global.properties.put("undefined",new DataDescriptor({
        value: new JSUndefined(),
        writable: false,
        enumerable: false,
        configurable: false,
    }));

    // ES6 Section 18.2: Function Properties of the Global Object

    // eval
    global.properties.put("eval",prop(realm.intrinsics.eval));
    global.properties.put("isFinite",prop(realm.intrinsics.isFinite));
    global.properties.put("isNaN",prop(realm.intrinsics.isNaN));
    global.properties.put("parseFloat",prop(realm.intrinsics.parseFloat));
    global.properties.put("parseInt",prop(realm.intrinsics.parseInt));
    global.properties.put("decodeURI",prop(realm.intrinsics.decodeURI));
    global.properties.put("decodeURIComponent",prop(realm.intrinsics.decodeURIComponent));
    global.properties.put("encodeURI",prop(realm.intrinsics.encodeURI));
    global.properties.put("encodeURIComponent",prop(realm.intrinsics.encodeURIComponent));

    // ES6 Section 18.3: Constructor Properties of the Global Object

    global.properties.put("Array",prop(realm.intrinsics.Array));
    global.properties.put("ArrayBuffer",prop(realm.intrinsics.ArrayBuffer));
    global.properties.put("Boolean",prop(realm.intrinsics.Boolean));
    global.properties.put("DataView",prop(realm.intrinsics.DataView));
    global.properties.put("Date",prop(realm.intrinsics.Date));
    global.properties.put("Error",prop(realm.intrinsics.Error));
    global.properties.put("EvalError",prop(realm.intrinsics.EvalError));
    global.properties.put("Float32Array",prop(realm.intrinsics.Float32Array));
    global.properties.put("Float64Array",prop(realm.intrinsics.Float64Array));
    global.properties.put("Function",prop(realm.intrinsics.Function));
    global.properties.put("Int8Array",prop(realm.intrinsics.Int8Array));
    global.properties.put("Int16Array",prop(realm.intrinsics.Int16Array));
    global.properties.put("Int32Array",prop(realm.intrinsics.Int32Array));
    global.properties.put("Map",prop(realm.intrinsics.Map));
    global.properties.put("Number",prop(realm.intrinsics.Number));
    global.properties.put("Object",prop(realm.intrinsics.Object));
    global.properties.put("Proxy",prop(realm.intrinsics.Proxy));
    global.properties.put("Promise",prop(realm.intrinsics.Promise));
    global.properties.put("RangeError",prop(realm.intrinsics.RangeError));
    global.properties.put("ReferenceError",prop(realm.intrinsics.ReferenceError));
    global.properties.put("RegExp",prop(realm.intrinsics.RegExp));
    global.properties.put("Set",prop(realm.intrinsics.Set));
    global.properties.put("String",prop(realm.intrinsics.String));
    global.properties.put("Symbol",prop(realm.intrinsics.Symbol));
    global.properties.put("SyntaxError",prop(realm.intrinsics.SyntaxError));
    global.properties.put("TypeError",prop(realm.intrinsics.TypeError));
    global.properties.put("Uint8Array",prop(realm.intrinsics.Uint8Array));
    global.properties.put("Uint8ClampedArray",prop(realm.intrinsics.Uint8ClampedArray));
    global.properties.put("Uint16Array",prop(realm.intrinsics.Uint16Array));
    global.properties.put("Uint32Array",prop(realm.intrinsics.Uint32Array));
    global.properties.put("URIError",prop(realm.intrinsics.URIError));
    global.properties.put("WeakMap",prop(realm.intrinsics.WeakMap));
    global.properties.put("WeakSet",prop(realm.intrinsics.WeakSet));

    // ES6 Section 18.4: Other Properties of the Global Object

    global.properties.put("JSON",prop(realm.intrinsics.JSON));
    global.properties.put("Math",prop(realm.intrinsics.Math));
    global.properties.put("Reflect",prop(realm.intrinsics.Reflect));
}
