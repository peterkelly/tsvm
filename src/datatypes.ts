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

// Chapter 6 ECMAScript Data Types and Values

import {
    LexicalEnvironment,
    EnvironmentRecord,
    Realm,
} from "./context";
import {
    ASTNode
} from "./parser/ast";

export class UnknownType {
    _nominal_type_UnknownType: any;
}

export class Empty {
    _nominal_type_EmptyType: any;
}

// 6.1 ECMAScript Language Types

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

// 6.1.1 The Undefined Type

export class JSUndefined extends JSValue {
    _nominal_type_JSUndefined: any;
    public constructor() {
        super();
    }
}

// 6.1.2 The Null Type

export class JSNull extends JSValue {
    _nominal_type_JSNull: any;
    public constructor() {
        super();
    }
}

// 6.1.3 The Boolean Type

export class JSBoolean extends JSValue {
    _nominal_type_JSBoolean: any;
    public readonly booleanValue: boolean;
    public constructor(booleanValue: boolean) {
        super();
        this.booleanValue = booleanValue;
    }
}

// 6.1.4 The String Type

export abstract class PropertyKey extends JSValue {
    _nominal_type_PropertyKey: any;
}

export class JSString extends JSValue {
    _nominal_type_JSString: any;
    public readonly stringValue: string;
    public constructor(stringValue: string) {
        super();
        this.stringValue = stringValue;
    }
}

// 6.1.5 The Symbol Type

export class JSSymbol extends JSValue {
    _nominal_type_JSSymbol: any;
    public readonly description: JSString | JSUndefined;
    private readonly symbolId: number;
    private static nextSymbolId: number = 1;
    public constructor(description: JSString | JSUndefined) {
        super();
        this.description = description;
        this.symbolId = JSSymbol.nextSymbolId++;
    }

    // 6.1.5.1 Well-Known Symbols

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


// 6.1.6 The Number Type

export class JSNumber extends JSValue {
    _nominal_type_JSNumber: any;
    public readonly numberValue: number;
    public constructor(numberValue: number) {
        super();
        this.numberValue = numberValue;
    }
}

// 6.1.7 The Object Type

export class JSObject extends JSValue {
    _nominal_type_JSObject: any;
    public readonly properties: { [key: string]: Property };
    public constructor() {
        super();
        this.properties = {};
    }

    // 6.1.7.2 Object Internal Methods and Internal Slots

    public __GetPrototypeOf__(): Completion<JSObject | JSNull> {
        throw new Error("JSObject.__GetPrototypeOf__ Not implemented");
    }

    public __SetPrototypeOf__(prototype: JSObject | JSNull): Completion<boolean> {
        throw new Error("JSObject.__SetPrototypeOf__ Not implemented");
    }

    public __IsExtensible__(): Completion<boolean> {
        throw new Error("JSObject.__IsExtensible__ Not implemented");
    }

    public __PreventExtensions__(): Completion<boolean> {
        throw new Error("JSObject.__PreventExtensions__ Not implemented");
    }

    public __GetOwnProperty__(propertyKey: JSString | JSSymbol): Completion<JSUndefined | Property> {
        throw new Error("JSObject.__GetOwnProperty__ Not implemented");
    }

    public __HasProperty__(propertyKey: JSString | JSSymbol): Completion<boolean> {
        throw new Error("JSObject.__HasProperty__ Not implemented");
    }

    public __Get__(propertyKey: JSString | JSSymbol, receiver: JSValue): Completion<UnknownType> {
        throw new Error("JSObject.__Get__ Not implemented");
    }

    public __Set__(propertyKey: JSString | JSSymbol, value: JSValue, receiver: JSValue): Completion<boolean> {
        throw new Error("JSObject.__Set__ Not implemented");
    }

    public __Delete__(propertyKey: JSString | JSSymbol): Completion<boolean> {
        throw new Error("JSObject.__Delete__ Not implemented");
    }

    public __DefineOwnProperty__(propertyKey: JSString | JSSymbol, property: Property): Completion<boolean> {
        throw new Error("JSObject.__DefineOwnProperty__ Not implemented");
    }

    public __Enumerate__(): Completion<JSObject> {
        throw new Error("JSObject.__Enumerate__ Not implemented");
    }

    public __OwnPropertyKeys__(): Completion<PropertyKey[]> {
        throw new Error("JSObject.__OwnPropertyKeys__ Not implemented");
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<UnknownType> {
        throw new Error("JSObject.__Call__ Not implemented");
    }

    public __Construct__(args: JSValue[], obj: JSObject): Completion<UnknownType> {
        throw new Error("JSObject.__Construct__ Not implemented");
    }
}

// 6.1.7.1 Property Attributes

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

// 6.1.7.4 Well-Known Intrinsic Objects

export class Intrinsics {
    $Array$: JSObject = new JSObject(); // TODO
    $ArrayBuffer$: JSObject = new JSObject(); // TODO
    $ArrayBufferPrototype$: JSObject = new JSObject(); // TODO
    $ArrayIteratorPrototype$: JSObject = new JSObject(); // TODO
    $ArrayPrototype$: JSObject = new JSObject(); // TODO
    $ArrayProto_values$: JSObject = new JSObject(); // TODO;
    $Boolean$: JSObject = new JSObject(); // TODO
    $BooleanPrototype$: JSObject = new JSObject(); // TODO
    $DataView$: JSObject = new JSObject(); // TODO
    $DataViewPrototype$: JSObject = new JSObject(); // TODO
    $Date$: JSObject = new JSObject(); // TODO
    $DatePrototype$: JSObject = new JSObject(); // TODO
    $decodeURI$: JSObject = new JSObject(); // TODO
    $decodeURIComponent$: JSObject = new JSObject(); // TODO
    $encodeURI$: JSObject = new JSObject(); // TODO
    $encodeURIComponent$: JSObject = new JSObject(); // TODO
    $Error$: JSObject = new JSObject(); // TODO
    $ErrorPrototype$: JSObject = new JSObject(); // TODO
    $eval$: JSObject = new JSObject(); // TODO
    $EvalError$: JSObject = new JSObject(); // TODO
    $EvalErrorPrototype$: JSObject = new JSObject(); // TODO
    $Float32Array$: JSObject = new JSObject(); // TODO
    $Float32ArrayPrototype$: JSObject = new JSObject(); // TODO
    $Float64Array$: JSObject = new JSObject(); // TODO
    $Float64ArrayPrototype$: JSObject = new JSObject(); // TODO
    $Function$: JSObject = new JSObject(); // TODO
    $FunctionPrototype$: JSObject = new JSObject(); // TODO
    $Generator$: JSObject = new JSObject(); // TODO
    $GeneratorFunction$: JSObject = new JSObject(); // TODO
    $GeneratorPrototype$: JSObject = new JSObject(); // TODO
    $Int8Array$: JSObject = new JSObject(); // TODO
    $Int8ArrayPrototype$: JSObject = new JSObject(); // TODO;
    $Int16Array$: JSObject = new JSObject(); // TODO
    $Int16ArrayPrototype$: JSObject = new JSObject(); // TODO
    $Int32Array$: JSObject = new JSObject(); // TODO
    $Int32ArrayPrototype$: JSObject = new JSObject(); // TODO
    $isFinite$: JSObject = new JSObject(); // TODO
    $isNaN$: JSObject = new JSObject(); // TODO
    $IteratorPrototype$: JSObject = new JSObject(); // TODO
    $JSON$: JSObject = new JSObject(); // TODO
    $Map$: JSObject = new JSObject(); // TODO
    $MapIteratorPrototype$: JSObject = new JSObject(); // TODO
    $MapPrototype$: JSObject = new JSObject(); // TODO
    $Math$: JSObject = new JSObject(); // TODO
    $Number$: JSObject = new JSObject(); // TODO
    $NumberPrototype$: JSObject = new JSObject(); // TODO
    $Object$: JSObject = new JSObject(); // TODO
    $ObjectPrototype$: JSObject = new JSObject(); // TODO
    $ObjProto_toString$: JSObject = new JSObject(); // TODO
    $parseFloat$: JSObject = new JSObject(); // TODO
    $parseInt$: JSObject = new JSObject(); // TODO
    $Promise$: JSObject = new JSObject(); // TODO
    $PromisePrototype$: JSObject = new JSObject(); // TODO
    $Proxy$: JSObject = new JSObject(); // TODO
    $RangeError$: JSObject = new JSObject(); // TODO
    $RangeErrorPrototype$: JSObject = new JSObject(); // TODO
    $ReferenceError$: JSObject = new JSObject(); // TODO
    $ReferenceErrorPrototype$: JSObject = new JSObject(); // TODO
    $Reflect$: JSObject = new JSObject(); // TODO
    $RegExp$: JSObject = new JSObject(); // TODO
    $RegExpPrototype$: JSObject = new JSObject(); // TODO
    $Set$: JSObject = new JSObject(); // TODO
    $SetIteratorPrototype$: JSObject = new JSObject(); // TODO
    $SetPrototype$: JSObject = new JSObject(); // TODO
    $String$: JSObject = new JSObject(); // TODO
    $StringIteratorPrototype$: JSObject = new JSObject(); // TODO
    $StringPrototype$: JSObject = new JSObject(); // TODO
    $Symbol$: JSObject = new JSObject(); // TODO
    $SymbolPrototype$: JSObject = new JSObject(); // TODO
    $SyntaxError$: JSObject = new JSObject(); // TODO
    $SyntaxErrorPrototype$: JSObject = new JSObject(); // TODO
    $ThrowTypeError$: JSObject = new JSObject(); // TODO
    $TypedArray$: JSObject = new JSObject(); // TODO
    $TypedArrayPrototype$: JSObject = new JSObject(); // TODO
    $TypeError$: JSObject = new JSObject(); // TODO
    $TypeErrorPrototype$: JSObject = new JSObject(); // TODO
    $Uint8Array$: JSObject = new JSObject(); // TODO
    $Uint8ArrayPrototype$: JSObject = new JSObject(); // TODO
    $Uint8ClampedArray$: JSObject = new JSObject(); // TODO
    $Uint8ClampedArrayPrototype$: JSObject = new JSObject(); // TODO
    $Uint16Array$: JSObject = new JSObject(); // TODO
    $Uint16ArrayPrototype$: JSObject = new JSObject(); // TODO
    $Uint32Array$: JSObject = new JSObject(); // TODO
    $Uint32ArrayPrototype$: JSObject = new JSObject(); // TODO
    $URIError$: JSObject = new JSObject(); // TODO
    $URIErrorPrototype$: JSObject = new JSObject(); // TODO
    $WeakMap$: JSObject = new JSObject(); // TODO
    $WeakMapPrototype$: JSObject = new JSObject(); // TODO
    $WeakSet$: JSObject = new JSObject(); // TODO
    $WeakSetPrototype$: JSObject = new JSObject(); // TODO
}

// 6.2 ECMAScript Specification Types

// 6.2.2 The Completion<UnknownType> Record Specification Type

// export enum CompletionType {
//     Normal,
//     Break,
//     Continue,
//     Return,
//     Throw,
// }

export abstract class Completion<T> {
    _nominal_type_Completion: T;
    public constructor() {
    }
}

export class NormalCompletion<T> extends Completion<T> {
    _nominal_type_NormalCompletion: T;
    public value: T;
    public constructor(value: T) {
        super();
        this.value = value;
    }
}

export class BreakCompletion<T> extends Completion<T> {
    _nominal_type_BreakCompletion: T;
    public target: string;
    public constructor(target: string) {
        super();
        this.target = target;
    }
}

export class ContinueCompletion<T> extends Completion<T> {
    _nominal_type_ContinueCompletion: T;
    public target: string;
    public constructor(target: string) {
        super();
        this.target = target;
    }
}

export class ReturnCompletion<T> extends Completion<T> {
    _nominal_type_ReturnCompletion: T;
    public value: T;
    public constructor(value: T) {
        super();
        this.value = value;
    }
}

export class ThrowCompletion<T> extends Completion<T> {
    _nominal_type_ThrowCompletion: T;
    public exceptionValue: JSValue;
    public constructor(exceptionValue: JSValue) {
        super();
        this.exceptionValue = exceptionValue;
    }
}

// export class Completion<UnknownType> {
//     _nominal_type_Completion: any;
//     public type: CompletionType;
//     public value: JSValue | Empty;
//     public target: JSString | Empty;
//
//     public constructor(type: CompletionType, value: JSValue | Empty, target: JSString | Empty) {
//         this.type = type;
//         this.value = value;
//         this.target = target;
//     }
// }
//
// export function isAbruptCompletion(comp: any): comp is Completion<UnknownType> {
//     return ((comp instanceof Completion) && (comp.type != CompletionType.Normal));
// }
//
// export function createThrowCompletion(value: JSValue | Empty): Completion<UnknownType> {
//     return new Completion(CompletionType.Throw,value,new Empty());
// }
//
// export function throwReferenceError(): Completion<UnknownType> {
//     const error = new JSObject();
//     return new Completion(CompletionType.Throw,error,new Empty());
// }


// 6.2.2.1 NormalCompletion

// export function NormalCompletion(value: JSValue | Empty): Completion<UnknownType> {
//     return new Completion(CompletionType.Normal,value,new Empty());
// }

// 6.2.2.5 UpdateEmpty ( completionRecord, value)

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

// 6.2.3 The Reference Specification Type

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

// 6.2.3.1 GetValue (V)

export function GetValue(V: any): Completion<UnknownType> {
    throw new Error("GetValue not implemented");
}

// 6.2.3.2 PutValue (V, W)

export function PutValue(V: any, W: any): Completion<UnknownType> {
    throw new Error("PutValue not implemented");
}

// 6.2.3.3 GetThisValue (V)

export function GetThisValue(V: any): Completion<UnknownType> {
    throw new Error("GetThisValue not implemented");
}

// 6.2.3.4 InitializeReferencedBinding (V, W)

export function InitializeReferencedBinding(V: any): Completion<UnknownType> {
    throw new Error("InitializeReferencedBinding not implemented");
}

// 6.2.4 The Property Descriptor Specification Type

// 6.2.4.1 IsAccessorDescriptor ( Desc )

export function IsAccessorDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("IsAccessorDescriptor not implemented");
}

// 6.2.4.2 IsDataDescriptor ( Desc )

export function IsDataDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("IsDataDescriptor not implemented");
}

// 6.2.4.3 IsGenericDescriptor ( Desc )

export function IsGenericDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("IsGenericDescriptor not implemented");
}

// 6.2.4.4 FromPropertyDescriptor ( Desc )

export function FromPropertyDescriptor(Desc: Property | JSUndefined): Completion<UnknownType> {
    throw new Error("FromPropertyDescriptor not implemented");
}

// 6.2.4.5 ToPropertyDescriptor ( Obj )

export function ToPropertyDescriptor(Obj: any): Completion<UnknownType> {
    throw new Error("ToPropertyDescriptor not implemented");
}

// 6.2.4.6 CompletePropertyDescriptor ( Desc )

export function CompletePropertyDescriptor(Desc: any): Completion<UnknownType> {
    throw new Error("CompletePropertyDescriptor not implemented");
}

// 6.2.6 Data Blocks

// 6.2.6.1 CreateByteDataBlock(size)

export class DataBlock {
    _nominal_type_DataBlock: any;
}

export function CreateByteDataBlock(size: number): DataBlock {
    throw new Error("CreateByteDataBlock not implemented");
}

// 6.2.6.2 CopyDataBlockBytes(toBlock, toIndex, fromBlock, fromIndex, count)

export function CopyDataBlockBytes(toBlock: DataBlock, toIndex: number, fromBlock: DataBlock, fromIndex: number, count: number): Completion<UnknownType> {
    throw new Error("CopyDataBlockBytes not implemented");
}
