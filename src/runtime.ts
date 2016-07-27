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

export enum BasicType {
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

export class JSUndefined extends JSValue {
    _nominal_type_JSUndefined: any;
    public constructor() {
        super();
    }
}

export class JSNull extends JSValue {
    _nominal_type_JSNull: any;
    public constructor() {
        super();
    }
}

export class JSBoolean extends JSValue {
    _nominal_type_JSBoolean: any;
    public readonly booleanValue: boolean;
    public constructor(booleanValue: boolean) {
        super();
        this.booleanValue = booleanValue;
    }
}

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

    // Well-known symbols
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


export class JSNumber extends JSValue {
    _nominal_type_JSNumber: any;
    public readonly numberValue: number;
    public constructor(numberValue: number) {
        super();
        this.numberValue = numberValue;
    }
}

export class JSObject extends JSValue {
    _nominal_type_JSObject: any;
    public readonly properties: { [key: string]: Property };
    public constructor() {
        super();
        this.properties = {};
    }

    public __GetPrototypeOf__(): Completion {
        throw new Error("JSObject.__GetPrototypeOf__ Not implemented");
    }

    public __SetPrototypeOf__(prototype: JSObject | JSNull): Completion {
        throw new Error("JSObject.__SetPrototypeOf__ Not implemented");
    }

    public __IsExtensible__(): Completion {
        throw new Error("JSObject.__IsExtensible__ Not implemented");
    }

    public __PreventExtensions__(): Completion {
        throw new Error("JSObject.__PreventExtensions__ Not implemented");
    }

    public __GetOwnProperty__(propertyKey: JSString | JSSymbol): Completion {
        throw new Error("JSObject.__GetOwnProperty__ Not implemented");
    }

    public __HasProperty__(propertyKey: JSString | JSSymbol): Completion {
        throw new Error("JSObject.__HasProperty__ Not implemented");
    }

    public __Get__(propertyKey: JSString | JSSymbol, receiver: JSValue): Completion {
        throw new Error("JSObject.__Get__ Not implemented");
    }

    public __Set__(propertyKey: JSString | JSSymbol, value: JSValue, receiver: JSValue): Completion {
        throw new Error("JSObject.__Set__ Not implemented");
    }

    public __Delete__(propertyKey: JSString | JSSymbol): Completion {
        throw new Error("JSObject.__Delete__ Not implemented");
    }

    public __DefineOwnProperty__(propertyKey: JSString | JSSymbol, property: Property): Completion {
        throw new Error("JSObject.__DefineOwnProperty__ Not implemented");
    }

    public __Enumerate__(): Completion {
        throw new Error("JSObject.__Enumerate__ Not implemented");
    }

    public __OwnPropertyKeys__(): Completion {
        throw new Error("JSObject.__OwnPropertyKeys__ Not implemented");
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion {
        throw new Error("JSObject.__Call__ Not implemented");
    }

    public __Construct__(args: JSValue[], obj: JSObject): Completion {
        throw new Error("JSObject.__Construct__ Not implemented");
    }
}

export class BuiltinObjects {
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

// export function GetValue(V: any): Completion {
//     // if (isAbruptCompletion(V))
//     //     return V;
//
//     // 1
//     if ((V instanceof Completion) && (V.type != CompletionType.Normal))
//         return V;
//
//     // 2
//     if (!(V instanceof Reference)) {
//         if (V instanceof Completion)
//             return V;
//         else
//             return new Completion(CompletionType.Return,V,new Empty());
//     }
//
//     // 3
//     const base = GetBase(V);
//
//     // 4
//     if (IsUnresolvableReference(V))
//         return throwReferenceError();
//
//     // 5
//     if (IsPropertyReference(V)) {
//         // a
//         if (HasPrimitiveBase(V)) {
//             if ((base instanceof JSNull) || (base instanceof JSUndefined))
//                 throw new Error("Assertion failure: base is null or undefined");
//             base = ToObject(base);
//
//         }
//     }
//
//     // 6
//     else {
//
//     }
//
//
//
//     return NormalCompletion(new Empty());
// }

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

export class LexicalEnvironment {
    _nominal_type_LexicalEnvironment: any;
}

export class EnvironmentRecord {
    _nominal_type_EnvironmentRecord: any;
}

export class DataBlock {
    _nominal_type_DataBlock: any;
}

export class Empty {
    _nominal_type_EmptyType: any;
}

// 6.2.2 The Completion Record Specification Type

export enum CompletionType {
    Normal,
    Break,
    Continue,
    Return,
    Throw,
}

export class Completion {
    _nominal_type_Completion: any;
    public type: CompletionType;
    public value: JSValue | Empty;
    public target: JSString | Empty;

    public constructor(type: CompletionType, value: JSValue | Empty, target: JSString | Empty) {
        this.type = type;
        this.value = value;
        this.target = target;
    }
}

export function isAbruptCompletion(comp: any): comp is Completion {
    return ((comp instanceof Completion) && (comp.type != CompletionType.Normal));
}

export function NormalCompletion(value: JSValue | Empty): Completion {
    return new Completion(CompletionType.Normal,value,new Empty());
}

export function createThrowCompletion(value: JSValue | Empty): Completion {
    return new Completion(CompletionType.Throw,value,new Empty());
}

export function throwReferenceError(): Completion {
    const error = new JSObject();
    return new Completion(CompletionType.Throw,error,new Empty());
}

export function UpdateEmpty(completionRecord: Completion, value: JSValue | Empty): Completion {
    if ((completionRecord.type == CompletionType.Throw) &&
        (completionRecord.value instanceof Empty))
        throw new Error("Assertion error: Completion record has type throw, but empty value");
    if (completionRecord.type == CompletionType.Throw)
        return completionRecord;
    if (!(completionRecord.value instanceof Empty))
        return completionRecord;
    return new Completion(completionRecord.type,value,completionRecord.target);
}
