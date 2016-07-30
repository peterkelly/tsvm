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

import {
    LexicalEnvironment,
    EnvironmentRecord,
    Realm,
} from "./context";
import {
    ASTNode
} from "../parser/ast";
import {
    SameValue,
    Call,
    CreateDataProperty,
} from "./operations";
// import {
//     intrinsic_ThrowTypeError
// } from "./objects";

export class UnknownType {
    _nominal_type_UnknownType: any;
}

export class Empty {
    _nominal_type_EmptyType: any;
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

export class JSObject extends JSValue {
    _nominal_type_JSObject: any;
    public __prototype__: JSObject | JSNull;
    public __extensible__: boolean;
    public readonly properties: { [key: string]: PropertyDescriptor };
    public constructor() {
        super();
        this.__prototype__ = new JSNull();
        this.__extensible__ = true;
        this.properties = {};
    }

    public get type(): ValueType {
        return ValueType.Object;
    }

    public get overridesGetPrototypeOf(): boolean {
        return (this.__GetPrototypeOf__ !== JSObject.prototype.__GetPrototypeOf__);
    }

    // ES6 Section 6.1.7.2: Object Internal Methods and Internal Slots
    // ES6 Section 9.1: Ordinary Object Internal Methods and Internal Slots

    // ES6 Section 9.1.1: [[GetPrototypeOf]] ()

    public __GetPrototypeOf__(): Completion<JSObject | JSNull> {
        return new NormalCompletion(this.__prototype__);
    }

    // ES6 Section 9.1.2: [[SetPrototypeOf]] (V)

    public __SetPrototypeOf__(V: JSObject | JSNull): Completion<boolean> {
        const extensible = this.__extensible__;
        const current = this.__prototype__;
        if (SameValue(V,current))
            return new NormalCompletion(true);
        if (!extensible)
            return new NormalCompletion(false);
        let p = V;
        let done = false;
        while (!done) {
            if (p instanceof JSNull)
                done = true;
            else if (SameValue(p,this))
                return new NormalCompletion(false);
            else if (p.overridesGetPrototypeOf)
                done = true;
            else
                p = p.__prototype__;
        }
        this.__prototype__ = V;
        return new NormalCompletion(true);
    }

    // ES6 Section 9.1.3: [[IsExtensible]] ()

    public __IsExtensible__(): Completion<boolean> {
        return new NormalCompletion(this.__extensible__);
    }

    // ES6 Section 9.1.4: [[PreventExtensions]] ()

    public __PreventExtensions__(): Completion<boolean> {
        this.__extensible__ = false;
        return new NormalCompletion(true);
    }

    // ES6 Section 9.1.5: [[GetOwnProperty]] (P)

    public __GetOwnProperty__(P: JSPropertyKey, copy: boolean = true): Completion<JSUndefined | PropertyDescriptor> {
        return new NormalCompletion(OrdinaryGetOwnProperty(this,P,copy));
    }

    // ES6 Section 9.1.7: [[HasProperty]](P)

    public __HasProperty__(P: JSPropertyKey): Completion<boolean> {
        return OrdinaryHasProperty(this,P);
    }

    // ES6 Section 9.1.8: [[Get]] (P, Receiver)

    public __Get__(P: JSPropertyKey, Receiver: JSValue): Completion<JSValue> {
        const descComp = this.__GetOwnProperty__(P,false);
        if (!(descComp instanceof NormalCompletion))
            return descComp;
        const desc = descComp.value;
        if (desc instanceof JSUndefined) {
            const parentComp = this.__GetPrototypeOf__();
            if (!(parentComp instanceof NormalCompletion))
                return parentComp;
            const parent = parentComp.value;
            if (parent instanceof JSNull)
                return new NormalCompletion(new JSUndefined());
            return parent.__Get__(P,Receiver);
        }
        else if (desc instanceof DataDescriptor) {
            return new NormalCompletion(desc.value);
        }
        else {
            const getter = desc.__get__;
            if (getter instanceof JSUndefined)
                return new NormalCompletion(new JSUndefined());
            return Call(getter,Receiver,[]);
        }
    }

    // ES6 Section 9.1.9: [[Set]] (P, V, Receiver)

    public __Set__(P: JSPropertyKey, V: JSValue, Receiver: JSValue): Completion<boolean> {
        const O = this;
        const ownDescComp = O.__GetOwnProperty__(P,false);
        if (!(ownDescComp instanceof NormalCompletion))
            return ownDescComp;
        let ownDesc = ownDescComp.value;
        if (ownDesc instanceof JSUndefined) {
            const parentComp = O.__GetPrototypeOf__();
            if (!(parentComp instanceof NormalCompletion))
                return parentComp;
            const parent = parentComp.value;
            if (!(parent instanceof JSNull)) {
                return parent.__Set__(P,V,Receiver);
            }
            else {
                ownDesc = new DataDescriptor(new JSUndefined(),true);
                ownDesc.enumerable = true;
                ownDesc.configurable = true;
            }
        }

        if (ownDesc instanceof DataDescriptor) {
            if (!ownDesc.writable)
                return new NormalCompletion(false);
            if (!(Receiver instanceof JSObject))
                return new NormalCompletion(false);
            const existingDescriptorComp = Receiver.__GetOwnProperty__(P);
            if (!(existingDescriptorComp instanceof NormalCompletion))
                return existingDescriptorComp;
            const existingDescriptor = existingDescriptorComp.value;
            if (!(existingDescriptor instanceof JSUndefined)) {
                if (existingDescriptor instanceof AccessorDescriptor)
                    return new NormalCompletion(false);
                if (!(existingDescriptor.writable))
                    return new NormalCompletion(false);
                const valueDesc = new DataDescriptor(V,true);
                return Receiver.__DefineOwnProperty__(P,valueDesc);
            }
            else {
                return CreateDataProperty(Receiver,P,V);
            }
        }
        else {
            const setter = ownDesc.__set__;
            if (setter instanceof JSUndefined)
                return new NormalCompletion(false);
            const setterResultComp = Call(setter,Receiver,[V]);
            if (!(setterResultComp instanceof NormalCompletion))
                return setterResultComp;
            return new NormalCompletion(true);
        }
    }

    // ES6 Section 9.1.10: [[Delete]] (P)

    public __Delete__(P: JSPropertyKey): Completion<boolean> {
        const descComp = this.__GetOwnProperty__(P);
        if (!(descComp instanceof NormalCompletion))
            return descComp;
        const desc = descComp.value;
        if (desc instanceof JSUndefined)
            return new NormalCompletion(true);
        if (desc.configurable) {
            delete this.properties[P.stringRep];
            return new NormalCompletion(true);
        }
        return new NormalCompletion(false);
    }

    // ES6 Section 9.1.6: [[DefineOwnProperty]] (P, Desc)

    public __DefineOwnProperty__(propertyKey: JSPropertyKey, property: PropertyDescriptor): Completion<boolean> {
        throw new Error("JSObject.__DefineOwnProperty__ not implemented");
    }

    // ES6 Section 9.1.11: [[Enumerate]] ()

    public __Enumerate__(): Completion<JSObject> {
        throw new Error("JSObject.__Enumerate__ not implemented");
    }

    // ES6 Section 9.1.12: [[OwnPropertyKeys]] ()

    public __OwnPropertyKeys__(): Completion<JSPropertyKey[]> {
        throw new Error("JSObject.__OwnPropertyKeys__ not implemented");
    }
}

// ES6 Section 9.1.5.1: OrdinaryGetOwnProperty (O, P)

export function OrdinaryGetOwnProperty(O: JSObject, P: JSPropertyKey, copy: boolean = true): JSUndefined | PropertyDescriptor {
    // I'm not sure why this needs to make a copy of the property; perhaps there are some cases
    // where we can avoid doing so.
    const stringKey = P.stringRep;
    if (!(stringKey in O.properties))
        return new JSUndefined();
    const X = O.properties[stringKey];
    if (!copy)
        return X;
    if (X instanceof DataDescriptor) {
        const D = new DataDescriptor(X.value,X.writable);
        D.enumerable = X.enumerable;
        D.configurable = X.configurable;
        return D;
    }
    else {
        const D = new AccessorDescriptor();
        D.__get__ = X.__get__;
        D.__set__ = X.__set__;
        D.enumerable = X.enumerable;
        D.configurable = X.configurable;
        return D;
    }
}

// ES6 Section 9.1.7.1: OrdinaryHasProperty (O, P)

export function OrdinaryHasProperty(O: JSObject, P: JSPropertyKey): Completion<boolean> {
    const hasOwn = OrdinaryGetOwnProperty(O,P);
    if (!(hasOwn instanceof JSUndefined))
        return new NormalCompletion(true);
    const parentComp = O.__GetPrototypeOf__();
    if (!(parentComp instanceof NormalCompletion))
        return parentComp;
    const parent = parentComp.value;
    if (!(parent instanceof JSNull))
        return parent.__HasProperty__(P);
    return new NormalCompletion(false);
}

// Additional implementation types

export abstract class JSPrimitiveValue extends JSValue {
    _nominal_type_JSPrimitiveValue: any;
}

export abstract class JSPropertyKey extends JSPrimitiveValue {
    _nominal_type_PropertyKey: any;
    public abstract get stringRep(): string;
}

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
    public constructor(value: JSValue, writable: boolean) {
        super();
        this.value = value;
        this.writable = writable;
    }
}

export function newDataDescriptor(options: {
    enumerable: boolean,
    configurable: boolean,
    value: JSValue,
    writable: boolean
}): DataDescriptor {
    const desc = new DataDescriptor(options.value,options.writable);
    desc.enumerable = options.enumerable;
    desc.configurable = options.configurable;
    return desc;
}

export class AccessorDescriptor extends BaseDescriptor {
    _nominal_type_AccessorDescriptor: any;
    public __get__: JSObject | JSUndefined = new JSUndefined;
    public __set__: JSObject | JSUndefined = new JSUndefined;
    public constructor() {
        super();
    }
}

export function newAccessorDescriptor(options: {
    enumerable: boolean,
    configurable: boolean,
    __get__: JSObject | JSUndefined,
    __set__: JSObject | JSUndefined,
}): AccessorDescriptor {
    const desc = new AccessorDescriptor();
    desc.__get__ = options.__get__;
    desc.__set__ = options.__set__;
    desc.enumerable = options.enumerable;
    desc.configurable = options.configurable;
    return desc;
}

// ES6 Section 6.1.7.4: Well-Known Intrinsic Objects

export interface Intrinsics {
    // Array: JSObject;
    // ArrayBuffer: JSObject;
    // ArrayBufferPrototype: JSObject;
    // ArrayIteratorPrototype: JSObject;
    // ArrayPrototype: JSObject;
    // ArrayProto_values: JSObject;
    // Boolean: JSObject;
    // BooleanPrototype: JSObject;
    // DataView: JSObject;
    // DataViewPrototype: JSObject;
    // Date: JSObject;
    // DatePrototype: JSObject;
    // decodeURI: JSObject;
    // decodeURIComponent: JSObject;
    // encodeURI: JSObject;
    // encodeURIComponent: JSObject;
    // Error: JSObject;
    // ErrorPrototype: JSObject;
    // eval: JSObject;
    // EvalError: JSObject;
    // EvalErrorPrototype: JSObject;
    // Float32Array: JSObject;
    // Float32ArrayPrototype: JSObject;
    // Float64Array: JSObject;
    // Float64ArrayPrototype: JSObject;
    // Function: JSObject;
    FunctionPrototype: JSObject;
    // Generator: JSObject;
    // GeneratorFunction: JSObject;
    // GeneratorPrototype: JSObject;
    // Int8Array: JSObject;
    // Int8ArrayPrototype: JSObject;
    // Int16Array: JSObject;
    // Int16ArrayPrototype: JSObject;
    // Int32Array: JSObject;
    // Int32ArrayPrototype: JSObject;
    // isFinite: JSObject;
    // isNaN: JSObject;
    // IteratorPrototype: JSObject;
    // JSON: JSObject;
    // Map: JSObject;
    // MapIteratorPrototype: JSObject;
    // MapPrototype: JSObject;
    // Math: JSObject;
    // Number: JSObject;
    // NumberPrototype: JSObject;
    // Object: JSObject;
    ObjectPrototype: JSObject;
    // ObjProto_toString: JSObject;
    // parseFloat: JSObject;
    // parseInt: JSObject;
    // Promise: JSObject;
    // PromisePrototype: JSObject;
    // Proxy: JSObject;
    // RangeError: JSObject;
    // RangeErrorPrototype: JSObject;
    // ReferenceError: JSObject;
    // ReferenceErrorPrototype: JSObject;
    // Reflect: JSObject;
    // RegExp: JSObject;
    // RegExpPrototype: JSObject;
    // Set: JSObject;
    // SetIteratorPrototype: JSObject;
    // SetPrototype: JSObject;
    // String: JSObject;
    // StringIteratorPrototype: JSObject;
    // StringPrototype: JSObject;
    // Symbol: JSObject;
    // SymbolPrototype: JSObject;
    // SyntaxError: JSObject;
    // SyntaxErrorPrototype: JSObject;
    ThrowTypeError: JSObject;
    // TypedArray: JSObject;
    // TypedArrayPrototype: JSObject;
    // TypeError: JSObject;
    // TypeErrorPrototype: JSObject;
    // Uint8Array: JSObject;
    // Uint8ArrayPrototype: JSObject;
    // Uint8ClampedArray: JSObject;
    // Uint8ClampedArrayPrototype: JSObject;
    // Uint16Array: JSObject;
    // Uint16ArrayPrototype: JSObject;
    // Uint32Array: JSObject;
    // Uint32ArrayPrototype: JSObject;
    // URIError: JSObject;
    // URIErrorPrototype: JSObject;
    // WeakMap: JSObject;
    // WeakMapPrototype: JSObject;
    // WeakSet: JSObject;
    // WeakSetPrototype: JSObject;
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

// ES6 Section 6.2.2.1: NormalCompletion ()

// export function NormalCompletion(value: JSValue | Empty): Completion<UnknownType> {
//     return new Completion(CompletionType.Normal,value,new Empty());
// }

// ES6 Section 6.2.2.5: UpdateEmpty (completionRecord, value)

// export function UpdateEmpty(completionRecord: Completion, value: JSValue | Empty): Completion<UnknownType> {
//     if ((completionRecord.type == CompletionType.Throw) &&
//         (completionRecord.value instanceof Empty))
//         throw new Error("Assertion error: Completion<UnknownType> record has type throw, but empty value");
//     if (completionRecord.type == CompletionType.Throw)
//         return completionRecord;
//     if (!(completionRecord.value instanceof Empty))
//         return completionRecord;
//     return new Completion(completionRecord.type,value,completionRecord.target);
// }

// ES6 Section 6.2.3: The Reference Specification Type

type ReferenceBase = JSUndefined | JSObject | JSBoolean | JSPropertyKey | JSNumber | EnvironmentRecord;
type SuperReferenceBase = JSUndefined | JSObject | JSBoolean | JSPropertyKey | JSNumber;

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

export function GetBase(V: Reference): ReferenceBase {
    return V.base;
}

export function GetReferencedName(V: Reference): JSPropertyKey {
    return V.name;
}

export function IsStrictReference(V: Reference): boolean {
    return V.strict.booleanValue;
}

export function HasPrimitiveBase(V: Reference): boolean {
    return ((V.base instanceof JSBoolean) ||
            (V.base instanceof JSString) ||
            (V.base instanceof JSSymbol) ||
            (V.base instanceof JSNumber));
}

export function IsPropertyReference(V: Reference): boolean {
    return ((V.base instanceof JSObject) || HasPrimitiveBase(V));
}

export function IsUnresolvableReference(V: Reference): boolean {
    return (V.base instanceof JSUndefined);
}

export function IsSuperReference(V: Reference): boolean {
    return (V instanceof SuperReference);
}

// ES6 Section 6.2.3.1: GetValue (V)

export function GetValue(V: any): Completion<UnknownType> {
    throw new Error("GetValue not implemented");
}

// ES6 Section 6.2.3.2: PutValue (V, W)

export function PutValue(V: any, W: any): Completion<UnknownType> {
    throw new Error("PutValue not implemented");
}

// ES6 Section 6.2.3.3: GetThisValue (V)

export function GetThisValue(V: any): Completion<UnknownType> {
    throw new Error("GetThisValue not implemented");
}

// ES6 Section 6.2.3.4: InitializeReferencedBinding (V, W)

export function InitializeReferencedBinding(V: any): Completion<UnknownType> {
    throw new Error("InitializeReferencedBinding not implemented");
}

// ES6 Section 6.2.4: The Property Descriptor Specification Type

// ES6 Section 6.2.4.1: IsAccessorDescriptor (Desc)

export function IsAccessorDescriptor(Desc: PropertyDescriptor): Desc is AccessorDescriptor {
    return (Desc instanceof AccessorDescriptor);
}

// ES6 Section 6.2.4.2: IsDataDescriptor (Desc)

export function IsDataDescriptor(Desc: PropertyDescriptor): Desc is DataDescriptor {
    return (Desc instanceof DataDescriptor);
}

// ES6 Section 6.2.4.3: IsGenericDescriptor (Desc)

export function IsGenericDescriptor(Desc: BaseDescriptor | JSUndefined): boolean {
    if (Desc instanceof JSUndefined)
        return false;
    if (!(Desc instanceof AccessorDescriptor) && !(Desc instanceof DataDescriptor))
        return true;
    return false;
}

// ES6 Section 6.2.4.4: FromPropertyDescriptor (Desc)

export function FromPropertyDescriptor(Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("FromPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.5: ToPropertyDescriptor (Obj)

export function ToPropertyDescriptor(Obj: any): Completion<UnknownType> {
    throw new Error("ToPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.6: CompletePropertyDescriptor (Desc)

export function CompletePropertyDescriptor(Desc: any): Completion<UnknownType> {
    throw new Error("CompletePropertyDescriptor not implemented");
}

// ES6 Section 6.2.6: Data Blocks

// ES6 Section 6.2.6.1: CreateByteDataBlock (size)

export class DataBlock {
    _nominal_type_DataBlock: any;
}

export function CreateByteDataBlock(size: number): DataBlock {
    throw new Error("CreateByteDataBlock not implemented");
}

// ES6 Section 6.2.6.2: CopyDataBlockBytes (toBlock, toIndex, fromBlock, fromIndex, count)

export function CopyDataBlockBytes(toBlock: DataBlock, toIndex: number, fromBlock: DataBlock, fromIndex: number, count: number): Completion<UnknownType> {
    throw new Error("CopyDataBlockBytes not implemented");
}
