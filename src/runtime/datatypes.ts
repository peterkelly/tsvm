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

// This is a placeholder used in cases where we haven't yet determined what type should be used.
// Eventually all instances of this should be removed.
export class UnknownType {
    _nominal_type_UnknownType: any;
}

export class GenericMap<T> {
    private readonly contents: { [key: string]: T } = {};
    public get(key: string): T | undefined {
        const fullKey = "prop_"+key;
        if (fullKey in this.contents)
            return this.contents[fullKey];
        else
            return undefined;
    }
    public put(key: string, value: T): void {
        const fullKey = "prop_"+key;
        this.contents[fullKey] = value;
    }
    public contains(key: string): boolean {
        const fullKey = "prop_"+key;
        return (fullKey in this.contents);
    }
    public remove(key: string): void {
        const fullKey = "prop_"+key;
        delete this.contents[fullKey];
    }
    public keys(): string[] {
        const result: string[] = [];
        for (const key in this.contents) {
            if (key.match(/^prop_/))
                result.push(key.substring(5));
        }
        return result.sort();
    }
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
    public get type(): ValueType {
        return ValueType.Undefined;
    }
}

// ES6 Section 6.1.2: The Null Type

export class JSNull extends JSPrimitiveValue {
    _nominal_type_JSNull: any;
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

// Additional implementation-specific numeric types

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

// ES6 Section 6.1.7: The Object Type

export class JSObject extends JSValue {
    _nominal_type_JSObject: any;

    public __prototype__: JSObject | JSNull;
    public __extensible__: boolean;
    public readonly properties: GenericMap<PropertyDescriptor>;

    public constructor(prototype?: JSObject | JSNull) {
        super();
        if (prototype !== undefined)
            this.__prototype__ = prototype;
        else
            this.__prototype__ = new JSNull();
        this.__extensible__ = true;
        this.properties = new GenericMap<PropertyDescriptor>();
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

    public __GetPrototypeOf__(realm: Realm): Completion<JSObject | JSNull> {
        return realm.ordinaryOps.__GetPrototypeOf__(realm,this);
    }

    public __SetPrototypeOf__(realm: Realm, V: JSObject | JSNull): Completion<boolean> {
        return realm.ordinaryOps.__SetPrototypeOf__(realm,this,V);
    }

    public __IsExtensible__(realm: Realm): Completion<boolean> {
        return realm.ordinaryOps.__IsExtensible__(realm,this);
    }

    public __PreventExtensions__(realm: Realm): Completion<boolean> {
        return realm.ordinaryOps.__PreventExtensions__(realm,this);
    }

    public __GetOwnProperty__(realm: Realm, P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor> {
        return realm.ordinaryOps.__GetOwnProperty__(realm,this,P,copy);
    }

    public __HasProperty__(realm: Realm, P: JSPropertyKey): Completion<boolean> {
        return realm.ordinaryOps.__HasProperty__(realm,this,P);
    }

    public __Get__(realm: Realm, P: JSPropertyKey, Receiver: JSValue): Completion<JSValue> {
        return realm.ordinaryOps.__Get__(realm,this,P,Receiver);
    }

    public __Set__(realm: Realm, P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean> {
        return realm.ordinaryOps.__Set__(realm,this,P,V,Receiver);
    }

    public __Delete__(realm: Realm, P: JSPropertyKey): Completion<boolean> {
        return realm.ordinaryOps.__Delete__(realm,this,P);
    }

    public __DefineOwnProperty__(realm: Realm, propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean> {
        return realm.ordinaryOps.__DefineOwnProperty__(realm,this,propertyKey,property);
    }

    public __Enumerate__(realm: Realm): Completion<JSObject> {
        return realm.ordinaryOps.__Enumerate__(realm,this);
    }

    public __OwnPropertyKeys__(realm: Realm): Completion<JSPropertyKey[]> {
        return realm.ordinaryOps.__OwnPropertyKeys__(realm,this);
    }

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        return realm.ordinaryOps.__Call__(realm,this,thisArg,args);
    }

    public __Construct__(realm: Realm, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
        return realm.ordinaryOps.__Construct__(realm,this,args,newTarget);
    }
}

// This interface exists solely for the purpose of achieving a form of dependency injection for the
// default implementation of JSObject's methods. Many of these implementations rely on functions
// from other modules, but we can't import those in datatypes.ts because some of those modules that
// define classes that inherit from JSObject. Because of the way typescript handles inheritance in
// the generated classes, it is necessary for a module defining a class to be fully loaded before
// any module that defines inherited classes, which is why datatypes.ts does needs to be completely
// independent of all other modules in the runtime system.
export interface ObjectOperations {
    __GetPrototypeOf__(realm: Realm, O: JSObject): Completion<JSObject | JSNull>;
    __SetPrototypeOf__(realm: Realm, O: JSObject, V: JSObject | JSNull): Completion<boolean>;
    __IsExtensible__(realm: Realm, O: JSObject): Completion<boolean>;
    __PreventExtensions__(realm: Realm, O: JSObject): Completion<boolean>;
    __GetOwnProperty__(realm: Realm, O: JSObject, P: JSPropertyKey, copy?: boolean): Completion<JSUndefined | PropertyDescriptor>;
    __HasProperty__(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean>;
    __Get__(realm: Realm, O: JSObject, P: JSPropertyKey, Receiver: JSValue): Completion<JSValue>;
    __Set__(realm: Realm, O: JSObject, P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean>;
    __Delete__(realm: Realm, O: JSObject, P: JSPropertyKey): Completion<boolean>;
    __DefineOwnProperty__(realm: Realm, O: JSObject, propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean>;
    __Enumerate__(realm: Realm, O: JSObject, ): Completion<JSObject>;
    __OwnPropertyKeys__(realm: Realm, O: JSObject): Completion<JSPropertyKey[]>;
    __Call__(realm: Realm, O: JSObject, thisArg: JSValue, args: JSValue[]): Completion<JSValue>;
    __Construct__(realm: Realm, O: JSObject, args: JSValue[], newTarget: JSObject): Completion<JSObject>;
}

// ES6 Section 6.1.7.1: Property Attributes

export interface DescriptorFields {
    enumerable?: boolean;
    configurable?: boolean;
    value?: JSValue;
    writable?: boolean;
    __get__?: JSObject | JSUndefined;
    __set__?: JSObject | JSUndefined;
}

export type PropertyDescriptor = DataDescriptor | AccessorDescriptor;

export abstract class BaseDescriptor {
    _nominal_type_Property: any;
    public enumerable: boolean;
    public configurable: boolean;
    public constructor(options: {
        enumerable: boolean,
        configurable: boolean,
    }) {
        this.enumerable = options.enumerable;
        this.configurable = options.configurable;
    }
}

export class DataDescriptor extends BaseDescriptor implements DescriptorFields {
    _nominal_type_DataDescriptor: any;
    public value: JSValue;
    public writable: boolean;
    public constructor(options: {
        enumerable: boolean,
        configurable: boolean,
        value: JSValue,
        writable: boolean,
    }) {
        super(options);
        this.value = options.value;
        this.writable = options.writable;
    }
}

export class AccessorDescriptor extends BaseDescriptor implements DescriptorFields {
    _nominal_type_AccessorDescriptor: any;
    public __get__: JSObject | JSUndefined;
    public __set__: JSObject | JSUndefined;
    public constructor(options: {
        enumerable: boolean,
        configurable: boolean,
        __get__: JSObject | JSUndefined;
        __set__: JSObject | JSUndefined;
    }) {
        super(options);
        this.__get__ = options.__get__;
        this.__set__ = options.__set__;
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

// ES6 Section 8.1: Lexical Environments

export class LexicalEnvironment {
    record: EnvironmentRecord;
    outer: LexicalEnvironment | null;

    public constructor(record: EnvironmentRecord, outer: LexicalEnvironment | null) {
        this.record = record;
        this.outer = outer;
    }
}

// ES6 Section 8.1.1.1: Declarative Environment Records

export abstract class EnvironmentRecord {
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

// ES6 Section 8.2: Code Realms

export interface Realm {
    intrinsics: Intrinsics;
    globalThis: JSObject;
    globalEnv: LexicalEnvironment;
    templateMap: UnknownType[];
    ordinaryOps: ObjectOperations;

    throwEvalError(message?: string): ThrowCompletion;
    throwRangeError(message?: string): ThrowCompletion;
    throwReferenceError(message?: string): ThrowCompletion;
    throwSyntaxError(message?: string): ThrowCompletion;
    throwTypeError(message?: string): ThrowCompletion;
    throwURIError(message?: string): ThrowCompletion;
}
