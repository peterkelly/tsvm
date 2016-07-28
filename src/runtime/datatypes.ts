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
    JSOrdinaryObject,
} from "./objects";
import {
    ASTNode
} from "../parser/ast";

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
}

// ES6 Section 6.1.1: The Undefined Type

export class JSUndefined extends JSPrimitiveValue {
    _nominal_type_JSUndefined: any;
    public constructor() {
        super();
    }
}

// ES6 Section 6.1.2: The Null Type

export class JSNull extends JSPrimitiveValue {
    _nominal_type_JSNull: any;
    public constructor() {
        super();
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
}

// ES6 Section 6.1.4: The String Type

export class JSString extends JSPropertyKey {
    _nominal_type_JSString: any;
    public readonly stringValue: string;
    public constructor(stringValue: string) {
        super();
        this.stringValue = stringValue;
    }
}

// ES6 Section 6.1.5: The Symbol Type

export class JSSymbol extends JSPropertyKey {
    _nominal_type_JSSymbol: any;
    public readonly description: JSString | JSUndefined;
    private readonly symbolId: number;
    private static nextSymbolId: number = 1;
    public constructor(description: JSString | JSUndefined) {
        super();
        this.description = description;
        this.symbolId = JSSymbol.nextSymbolId++;
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
}

// ES6 Section 6.1.7: The Object Type

export abstract class JSObject extends JSValue {
    _nominal_type_JSObject: any;
    public readonly properties: { [key: string]: Property };
    public constructor() {
        super();
        this.properties = {};
    }

    // ES6 Section 6.1.7.2: Object Internal Methods and Internal Slots

    public abstract __GetPrototypeOf__(): Completion<JSObject | JSNull>;

    public abstract __SetPrototypeOf__(prototype: JSObject | JSNull): Completion<boolean>;

    public abstract __IsExtensible__(): Completion<boolean>;

    public abstract __PreventExtensions__(): Completion<boolean>;

    public abstract __GetOwnProperty__(propertyKey: JSString | JSSymbol): Completion<JSUndefined | Property>;

    public abstract __HasProperty__(propertyKey: JSString | JSSymbol): Completion<boolean>;

    public abstract __Get__(propertyKey: JSString | JSSymbol, receiver: JSValue): Completion<UnknownType>;

    public abstract __Set__(propertyKey: JSString | JSSymbol, value: JSValue, receiver: JSValue): Completion<boolean>;

    public abstract __Delete__(propertyKey: JSString | JSSymbol): Completion<boolean>;

    public abstract __DefineOwnProperty__(propertyKey: JSString | JSSymbol, property: Property): Completion<boolean>;

    public abstract __Enumerate__(): Completion<JSObject>;

    public abstract __OwnPropertyKeys__(): Completion<JSPropertyKey[]>;

    public abstract __Call__(thisArg: JSValue, args: JSValue[]): Completion<UnknownType>;

    public abstract __Construct__(args: JSValue[], obj: JSObject): Completion<UnknownType>;
}

// Additional implementation types

export abstract class JSPrimitiveValue extends JSValue {
    _nominal_type_JSPrimitiveValue: any;
}

export abstract class JSPropertyKey extends JSPrimitiveValue {
    _nominal_type_PropertyKey: any;
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

export abstract class Property {
    _nominal_type_Property: any;
    public enumerable: boolean = true;
    public configurable: boolean = true;
    public constructor() {
    }
}

export class DataProperty extends Property {
    _nominal_type_DataProperty: any;
    public value: JSValue;
    public writable: boolean;
    public constructor(value: JSValue, writable: boolean) {
        super();
        this.value = value;
        this.writable = writable;
    }
}

export class AccessorProperty extends Property {
    _nominal_type_AccessorProperty: any;
    public __get__: JSObject | JSUndefined = new JSUndefined;
    public __set__: JSObject | JSUndefined = new JSUndefined;
    public constructor() {
        super();
    }
}

// ES6 Section 6.1.7.4: Well-Known Intrinsic Objects

export class Intrinsics {
    $Array$: JSObject = new JSOrdinaryObject(); // TODO
    $ArrayBuffer$: JSObject = new JSOrdinaryObject(); // TODO
    $ArrayBufferPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $ArrayIteratorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $ArrayProto_values$: JSObject = new JSOrdinaryObject(); // TODO;
    $Boolean$: JSObject = new JSOrdinaryObject(); // TODO
    $BooleanPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $DataView$: JSObject = new JSOrdinaryObject(); // TODO
    $DataViewPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Date$: JSObject = new JSOrdinaryObject(); // TODO
    $DatePrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $decodeURI$: JSObject = new JSOrdinaryObject(); // TODO
    $decodeURIComponent$: JSObject = new JSOrdinaryObject(); // TODO
    $encodeURI$: JSObject = new JSOrdinaryObject(); // TODO
    $encodeURIComponent$: JSObject = new JSOrdinaryObject(); // TODO
    $Error$: JSObject = new JSOrdinaryObject(); // TODO
    $ErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $eval$: JSObject = new JSOrdinaryObject(); // TODO
    $EvalError$: JSObject = new JSOrdinaryObject(); // TODO
    $EvalErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Float32Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Float32ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Float64Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Float64ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Function$: JSObject = new JSOrdinaryObject(); // TODO
    $FunctionPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Generator$: JSObject = new JSOrdinaryObject(); // TODO
    $GeneratorFunction$: JSObject = new JSOrdinaryObject(); // TODO
    $GeneratorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Int8Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Int8ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO;
    $Int16Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Int16ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Int32Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Int32ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $isFinite$: JSObject = new JSOrdinaryObject(); // TODO
    $isNaN$: JSObject = new JSOrdinaryObject(); // TODO
    $IteratorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $JSON$: JSObject = new JSOrdinaryObject(); // TODO
    $Map$: JSObject = new JSOrdinaryObject(); // TODO
    $MapIteratorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $MapPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Math$: JSObject = new JSOrdinaryObject(); // TODO
    $Number$: JSObject = new JSOrdinaryObject(); // TODO
    $NumberPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Object$: JSObject = new JSOrdinaryObject(); // TODO
    $ObjectPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $ObjProto_toString$: JSObject = new JSOrdinaryObject(); // TODO
    $parseFloat$: JSObject = new JSOrdinaryObject(); // TODO
    $parseInt$: JSObject = new JSOrdinaryObject(); // TODO
    $Promise$: JSObject = new JSOrdinaryObject(); // TODO
    $PromisePrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Proxy$: JSObject = new JSOrdinaryObject(); // TODO
    $RangeError$: JSObject = new JSOrdinaryObject(); // TODO
    $RangeErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $ReferenceError$: JSObject = new JSOrdinaryObject(); // TODO
    $ReferenceErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Reflect$: JSObject = new JSOrdinaryObject(); // TODO
    $RegExp$: JSObject = new JSOrdinaryObject(); // TODO
    $RegExpPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Set$: JSObject = new JSOrdinaryObject(); // TODO
    $SetIteratorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $SetPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $String$: JSObject = new JSOrdinaryObject(); // TODO
    $StringIteratorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $StringPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Symbol$: JSObject = new JSOrdinaryObject(); // TODO
    $SymbolPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $SyntaxError$: JSObject = new JSOrdinaryObject(); // TODO
    $SyntaxErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $ThrowTypeError$: JSObject = new JSOrdinaryObject(); // TODO
    $TypedArray$: JSObject = new JSOrdinaryObject(); // TODO
    $TypedArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $TypeError$: JSObject = new JSOrdinaryObject(); // TODO
    $TypeErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint8Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint8ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint8ClampedArray$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint8ClampedArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint16Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint16ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint32Array$: JSObject = new JSOrdinaryObject(); // TODO
    $Uint32ArrayPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $URIError$: JSObject = new JSOrdinaryObject(); // TODO
    $URIErrorPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $WeakMap$: JSObject = new JSOrdinaryObject(); // TODO
    $WeakMapPrototype$: JSObject = new JSOrdinaryObject(); // TODO
    $WeakSet$: JSObject = new JSOrdinaryObject(); // TODO
    $WeakSetPrototype$: JSObject = new JSOrdinaryObject(); // TODO
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

type ReferenceBase = JSUndefined | JSObject | JSBoolean | JSString | JSSymbol | JSNumber | EnvironmentRecord;
type SuperReferenceBase = JSUndefined | JSObject | JSBoolean | JSString | JSSymbol | JSNumber;

export class Reference {
    _nominal_type_Reference: any;
    public base: ReferenceBase;
    public name: JSString | JSSymbol;
    public strict: JSBoolean;
    public constructor(base: ReferenceBase, name: JSString | JSSymbol, strict: JSBoolean) {
        this.base = base;
        this.name = name;
        this.strict = strict;
    }
}

export class SuperReference extends Reference {
    _nominal_type_SuperReference: any;
    public thisValue: JSValue;
    public constructor(base: SuperReferenceBase, name: JSString | JSSymbol, strict: JSBoolean) {
        super(base,name,strict);
        this.thisValue = new JSUndefined();
    }
}

export function GetBase(V: Reference): ReferenceBase {
    return V.base;
}

export function GetReferencedName(V: Reference): JSString | JSSymbol {
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

export function IsAccessorDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("IsAccessorDescriptor not implemented");
}

// ES6 Section 6.2.4.2: IsDataDescriptor (Desc)

export function IsDataDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("IsDataDescriptor not implemented");
}

// ES6 Section 6.2.4.3: IsGenericDescriptor (Desc)

export function IsGenericDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("IsGenericDescriptor not implemented");
}

// ES6 Section 6.2.4.4: FromPropertyDescriptor (Desc)

export function FromPropertyDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
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
