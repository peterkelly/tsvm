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

// ES6 Chapter 6: ECMAScript Data Types and Values

// Just a placeholder for places where we don't know the type. All such cases should eventually
// be fixed by determine which type should be used.
export class UnknownType {
    _nominal_type_UnknownType: any;
}

// This is here for places in the spec where it says to return "Empty", though I think we can
// just use void instead.
export class Empty {
    _nominal_type_EmptyType: any;
}

export interface LexicalEnvironment {
    record: EnvironmentRecord;
    outer: LexicalEnvironment | null;
}

export interface Realm {
    globalThis: JSObject | JSUndefined;
    globalEnv: LexicalEnvironment | JSUndefined;
    templateMap: any[]; // FIXME
    intrinsics: Intrinsics;
}

export interface EnvironmentRecord {
    HasBinding(N: string): Completion<boolean>;
    CreateMutableBinding(N: string, D: boolean): void;
    CreateImmutableBinding(N: string, S: boolean): void;
    InitializeBinding(N: string, V: JSValue): void;
    SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void>;
    GetBindingValue(N: string, S: boolean): Completion<JSValue>;
    DeleteBinding(N: string): Completion<boolean>;
    HasThisBinding(): Completion<boolean>;
    HasSuperBinding(): Completion<boolean>;
    WithBaseObject(): Completion<JSObject | JSUndefined>;
}

// ES6 Section 6.1: ECMAScript Language Types

export enum ValueType {
    Undefined,
    Null,
    Boolean,
    Number,
    String,
    Symbol,
    Object,
}

export abstract class JSValue {
    _nominal_type_JSValue: any;
    public constructor() {
    }
    public abstract get type(): ValueType;
}

export abstract class JSPrimitiveValue extends JSValue {
    _nominal_type_JSPrimitiveValue: any;
}

export abstract class JSPropertyKey extends JSPrimitiveValue {
    _nominal_type_PropertyKey: any;
    public abstract get stringRep(): string;
}

// ES6 Section 6.1.1: The Undefined Type

export class JSUndefined extends JSPrimitiveValue {
    _nominal_type_JSUndefined: any;
    public constructor() {
        super();
    }
    public get type(): ValueType {
        return ValueType.Undefined;
    }
}

// ES6 Section 6.1.2: The Null Type

export class JSNull extends JSPrimitiveValue {
    _nominal_type_JSNull: any;
    public constructor() {
        super();
    }
    public get type(): ValueType {
        return ValueType.Null;
    }
}

// ES6 Section 6.1.3: The Boolean Type

export class JSBoolean extends JSPrimitiveValue {
    _nominal_type_JSBoolean: any;
    public readonly booleanValue: boolean;
    public constructor(booleanValue: boolean) {
        super();
        this.booleanValue = booleanValue;
    }
    public get type(): ValueType {
        return ValueType.Boolean;
    }
}

// ES6 Section 6.1.4: The String Type

export class JSString extends JSPropertyKey {
    _nominal_type_JSString: any;
    public readonly stringValue: string;
    public constructor(stringValue: string) {
        super();
        this.stringValue = stringValue;
    }
    public get type(): ValueType {
        return ValueType.String;
    }
    public get stringRep(): string {
        return this.stringValue;
    }
}

// ES6 Section 6.1.5: The Symbol Type

export class JSSymbol extends JSPropertyKey {
    _nominal_type_JSSymbol: any;
    public readonly description: JSString | JSUndefined;
    public readonly symbolId: number;
    private static nextSymbolId: number = 1;
    public constructor(description: JSString | JSUndefined) {
        super();
        this.description = description;
        this.symbolId = JSSymbol.nextSymbolId++;
    }
    public get type(): ValueType {
        return ValueType.Symbol;
    }
    public get stringRep(): string {
        return "%%symbol:"+this.symbolId;
    }

    // ES6 Section 6.1.5.1: Well-Known Symbols

    public static readonly $$hasInstance = new JSSymbol(new JSString("Symbol.hasInstance"));
    public static readonly $$isConcatSpreadable = new JSSymbol(new JSString("Symbol.isConcatSpreadable"));
    public static readonly $$iterator = new JSSymbol(new JSString("Symbol.iterator"));
    public static readonly $$match = new JSSymbol(new JSString("Symbol.match"));
    public static readonly $$replace = new JSSymbol(new JSString("Symbol.replace"));
    public static readonly $$search = new JSSymbol(new JSString("Symbol.search"));
    public static readonly $$species = new JSSymbol(new JSString("Symbol.species"));
    public static readonly $$split = new JSSymbol(new JSString("Symbol.split"));
    public static readonly $$toPrimitive = new JSSymbol(new JSString("Symbol.toPrimitive"));
    public static readonly $$toStringTag = new JSSymbol(new JSString("Symbol.toStringTag"));
    public static readonly $$unscopables = new JSSymbol(new JSString("Symbol.unscopables"));
}


// ES6 Section 6.1.6: The Number Type

export class JSNumber extends JSPrimitiveValue {
    _nominal_type_JSNumber: any;
    public readonly numberValue: number;
    public constructor(numberValue: number) {
        super();
        this.numberValue = numberValue;
    }
    public get type(): ValueType {
        return ValueType.Number;
    }
}

// ES6 Section 6.1.7: The Object Type

export abstract class JSObject extends JSValue {
    _nominal_type_JSObject: any;

    public realm: Realm;
    public __prototype__: JSObject | JSNull;
    public __extensible__: boolean;
    public readonly properties: { [key: string]: PropertyDescriptor };

    public constructor(realm: Realm, prototype?: JSObject | JSNull) {
        super();
        this.realm = realm;
        if (prototype !== undefined)
            this.__prototype__ = prototype;
        else
            this.__prototype__ = new JSNull();
        this.__extensible__ = true;
        this.properties = {};
    }

    public get type(): ValueType {
        return ValueType.Object;
    }

    public get implementsCall(): boolean {
        return false;
    }

    public get implementsConstruct(): boolean {
        return false;
    }

    public get overridesGetPrototypeOf(): boolean {
        return (this.__GetPrototypeOf__ !== JSObject.prototype.__GetPrototypeOf__);
    }

    public abstract __GetPrototypeOf__(): Completion<JSObject | JSNull>;
    public abstract __SetPrototypeOf__(V: JSObject | JSNull): Completion<boolean>;
    public abstract __IsExtensible__(): Completion<boolean>;
    public abstract __PreventExtensions__(): Completion<boolean>;
    public abstract __GetOwnProperty__(P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor>;
    public abstract __HasProperty__(P: JSPropertyKey): Completion<boolean>;
    public abstract __Get__(P: JSPropertyKey, Receiver: JSValue): Completion<JSValue>;
    public abstract __Set__(P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean>;
    public abstract __Delete__(P: JSPropertyKey): Completion<boolean>;
    public abstract __DefineOwnProperty__(propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean>;
    public abstract __Enumerate__(): Completion<JSObject>;
    public abstract __OwnPropertyKeys__(): Completion<JSPropertyKey[]>;
    public abstract __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue>;
    public abstract __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject>;
}

// Additional implementation types

export class JSInteger extends JSNumber {
    public readonly integerValue: number;
    public constructor(integerValue: number) {
        super(integerValue);
        this.integerValue = integerValue;
    }
}

export class JSInt32 extends JSInteger {
    public readonly int32Value: number;
    public constructor(int32Value: number) {
        super(int32Value);
        this.int32Value = int32Value;
    }
}

export class JSUInt32 extends JSInteger {
    public readonly uint32Value: number;
    public constructor(uint32Value: number) {
        super(uint32Value);
        this.uint32Value = uint32Value;
    }
}

export class JSInt16 extends JSInteger {
    public readonly int16Value: number;
    public constructor(int16Value: number) {
        super(int16Value);
        this.int16Value = int16Value;
    }
}

export class JSUInt16 extends JSInteger {
    public readonly uint16Value: number;
    public constructor(uint16Value: number) {
        super(uint16Value);
        this.uint16Value = uint16Value;
    }
}

export class JSInt8 extends JSInteger {
    public readonly int8Value: number;
    public constructor(int8Value: number) {
        super(int8Value);
        this.int8Value = int8Value;
    }
}

export class JSUInt8 extends JSInteger {
    public readonly uint8Value: number;
    public constructor(uint8Value: number) {
        super(uint8Value);
        this.uint8Value = uint8Value;
    }
}

// ES6 Section 6.1.7.1: Property Attributes

export type PropertyDescriptor = DataDescriptor | AccessorDescriptor;

export abstract class BaseDescriptor {
    _nominal_type_Property: any;
    public enumerable: boolean = true;
    public configurable: boolean = true;
    public constructor() {
    }
}

export class DataDescriptor extends BaseDescriptor {
    _nominal_type_DataDescriptor: any;
    public value: JSValue;
    public writable: boolean;
    public constructor(options: {
        enumerable?: boolean,
        configurable?: boolean,
        value: JSValue,
        writable: boolean,
    }) {
        super();
        if (options.enumerable !== undefined)
            this.enumerable = options.enumerable;
        if (options.configurable !== undefined)
            this.configurable = options.configurable;
        this.value = options.value;
        this.writable = options.writable;
    }
}

export class AccessorDescriptor extends BaseDescriptor {
    _nominal_type_AccessorDescriptor: any;
    public __get__: JSObject | JSUndefined = new JSUndefined;
    public __set__: JSObject | JSUndefined = new JSUndefined;
    public constructor(options?: {
        enumerable?: boolean,
        configurable?: boolean,
        __get__?: JSObject | JSUndefined;
        __set__?: JSObject | JSUndefined;
    }) {
        super();
        if (options !== undefined) {
            if (options.enumerable !== undefined)
                this.enumerable = options.enumerable;
            if (options.configurable !== undefined)
                this.configurable = options.configurable;
            if (options.__get__ !== undefined) // Note that JSUndefined is distinct from undefined
                this.__get__ = options.__get__;
            if (options.__set__ !== undefined)
                this.__set__ = options.__set__;
        }
    }
}

// ES6 Section 6.1.7.4: Well-Known Intrinsic Objects

export interface Intrinsics {
    Array: JSObject;
    ArrayBuffer: JSObject;
    ArrayBufferPrototype: JSObject;
    ArrayIteratorPrototype: JSObject;
    ArrayPrototype: JSObject;
    ArrayProto_values: JSObject;
    Boolean: JSObject;
    BooleanPrototype: JSObject;
    DataView: JSObject;
    DataViewPrototype: JSObject;
    Date: JSObject;
    DatePrototype: JSObject;
    decodeURI: JSObject;
    decodeURIComponent: JSObject;
    encodeURI: JSObject;
    encodeURIComponent: JSObject;
    Error: JSObject;
    ErrorPrototype: JSObject;
    eval: JSObject;
    EvalError: JSObject;
    EvalErrorPrototype: JSObject;
    Float32Array: JSObject;
    Float32ArrayPrototype: JSObject;
    Float64Array: JSObject;
    Float64ArrayPrototype: JSObject;
    Function: JSObject;
    FunctionPrototype: JSObject;
    Generator: JSObject;
    GeneratorFunction: JSObject;
    GeneratorPrototype: JSObject;
    Int8Array: JSObject;
    Int8ArrayPrototype: JSObject;
    Int16Array: JSObject;
    Int16ArrayPrototype: JSObject;
    Int32Array: JSObject;
    Int32ArrayPrototype: JSObject;
    isFinite: JSObject;
    isNaN: JSObject;
    IteratorPrototype: JSObject;
    JSON: JSObject;
    Map: JSObject;
    MapIteratorPrototype: JSObject;
    MapPrototype: JSObject;
    Math: JSObject;
    Number: JSObject;
    NumberPrototype: JSObject;
    Object: JSObject;
    ObjectPrototype: JSObject;
    ObjProto_toString: JSObject;
    parseFloat: JSObject;
    parseInt: JSObject;
    Promise: JSObject;
    PromisePrototype: JSObject;
    Proxy: JSObject;
    RangeError: JSObject;
    RangeErrorPrototype: JSObject;
    ReferenceError: JSObject;
    ReferenceErrorPrototype: JSObject;
    Reflect: JSObject;
    RegExp: JSObject;
    RegExpPrototype: JSObject;
    Set: JSObject;
    SetIteratorPrototype: JSObject;
    SetPrototype: JSObject;
    String: JSObject;
    StringIteratorPrototype: JSObject;
    StringPrototype: JSObject;
    Symbol: JSObject;
    SymbolPrototype: JSObject;
    SyntaxError: JSObject;
    SyntaxErrorPrototype: JSObject;
    ThrowTypeError: JSObject;
    // TypedArray: JSObject;
    TypedArrayPrototype: JSObject;
    TypeError: JSObject;
    TypeErrorPrototype: JSObject;
    Uint8Array: JSObject;
    Uint8ArrayPrototype: JSObject;
    Uint8ClampedArray: JSObject;
    Uint8ClampedArrayPrototype: JSObject;
    Uint16Array: JSObject;
    Uint16ArrayPrototype: JSObject;
    Uint32Array: JSObject;
    Uint32ArrayPrototype: JSObject;
    URIError: JSObject;
    URIErrorPrototype: JSObject;
    WeakMap: JSObject;
    WeakMapPrototype: JSObject;
    WeakSet: JSObject;
    WeakSetPrototype: JSObject;
}

// ES6 Section 6.2: ECMAScript Specification Types

// ES6 Section 6.2.2: The Completion Record Specification Type

export type Completion<T> =
    NormalCompletion<T> |
    BreakCompletion |
    ContinueCompletion |
    ReturnCompletion |
    ThrowCompletion;

export class NormalCompletion<T> {
    public _nominal_type_NormalCompletion: T;
    public value: T;
    public constructor(value: T) {
        this.value = value;
    }
}

export class BreakCompletion {
    public _nominal_type_BreakCompletion: any;
    public target: string;
    public constructor(target: string) {
        this.target = target;
    }
}

export class ContinueCompletion {
    public _nominal_type_ContinueCompletion: any;
    public target: string;
    public constructor(target: string) {
        this.target = target;
    }
}

export class ReturnCompletion {
    public _nominal_type_ReturnCompletion: any;
    public returnValue: JSValue;
    public constructor(returnValue: JSValue) {
        this.returnValue = returnValue;
    }
}

export class ThrowCompletion {
    public _nominal_type_ThrowCompletion: any;
    public exceptionValue: JSValue;
    public constructor(exceptionValue: JSValue) {
        this.exceptionValue = exceptionValue;
    }
}

// ES6 Section 6.2.3: The Reference Specification Type

export type ReferenceBase = JSUndefined | JSObject | JSBoolean | JSPropertyKey | JSNumber | EnvironmentRecord;
export type SuperReferenceBase = JSUndefined | JSObject | JSBoolean | JSPropertyKey | JSNumber;

export class Reference {
    _nominal_type_Reference: any;
    public base: ReferenceBase;
    public name: JSPropertyKey;
    public strict: JSBoolean;
    public constructor(base: ReferenceBase, name: JSPropertyKey, strict: JSBoolean) {
        this.base = base;
        this.name = name;
        this.strict = strict;
    }
}

export class SuperReference extends Reference {
    _nominal_type_SuperReference: any;
    public thisValue: JSValue;
    public constructor(base: SuperReferenceBase, name: JSPropertyKey, strict: JSBoolean) {
        super(base,name,strict);
        this.thisValue = new JSUndefined();
    }
}

// ES6 Section 6.2.6: Data Blocks

export class DataBlock {
    _nominal_type_DataBlock: any;
}
