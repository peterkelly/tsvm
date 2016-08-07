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

export abstract class JSPropertyKey extends JSValue {
    _nominal_type_PropertyKey: any;
    public abstract get stringRep(): string;
}

// ES6 Section 6.1.1: The Undefined Type

export class JSUndefined extends JSValue {
    _nominal_type_JSUndefined: any;
    public get type(): ValueType {
        return ValueType.Undefined;
    }
}

// ES6 Section 6.1.2: The Null Type

export class JSNull extends JSValue {
    _nominal_type_JSNull: any;
    public get type(): ValueType {
        return ValueType.Null;
    }
}

// ES6 Section 6.1.3: The Boolean Type

export class JSBoolean extends JSValue {
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
        return "string:"+this.stringValue;
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
        return "symbol:"+this.symbolId;
    }
}

// ES6 Section 6.1.6: The Number Type

export class JSNumber extends JSValue {
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

    public constructor(prototype?: JSObject | JSNull) {
        super();
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

    public __GetPrototypeOf__(): Completion<UnknownType> {
        throw new Error("JSObject.__GetPrototypeOf__ not implemented");
    }

    public __SetPrototypeOf__(V: UnknownType): Completion<UnknownType> {
        throw new Error("JSObject.__SetPrototypeOf__ not implemented");
    }

    public __IsExtensible__(): Completion<UnknownType> {
        throw new Error("JSObject.__IsExtensible__ not implemented");
    }

    public __PreventExtensions__(): Completion<UnknownType> {
        throw new Error("JSObject.__PreventExtensions__ not implemented");
    }

    public __GetOwnProperty__(P: JSPropertyKey): Completion<UnknownType> {
        throw new Error("JSObject.__GetOwnProperty__ not implemented");
    }

    public __HasProperty__(P: JSPropertyKey): Completion<UnknownType> {
        throw new Error("JSObject.__HasProperty__ not implemented");
    }

    public __Get__(P: JSPropertyKey, Receiver: UnknownType): Completion<UnknownType> {
        throw new Error("JSObject.__Get__ not implemented");
    }

    public __Set__(P: JSPropertyKey, V: UnknownType, Receiver: UnknownType): Completion<UnknownType> {
        throw new Error("JSObject.__Set__ not implemented");
    }

    public __Delete__(P: JSPropertyKey): Completion<UnknownType> {
        throw new Error("JSObject.__Delete__ not implemented");
    }

    public __DefineOwnProperty__(propertyKey: JSPropertyKey, property: UnknownType): Completion<UnknownType> {
        throw new Error("JSObject.__DefineOwnProperty__ not implemented");
    }

    public __Enumerate__(): Completion<UnknownType> {
        throw new Error("JSObject.__Enumerate__ not implemented");
    }

    public __OwnPropertyKeys__(): Completion<JSPropertyKey[]> {
        throw new Error("JSObject.__OwnPropertyKeys__ not implemented");
    }

    public __Call__(thisArg: UnknownType, args: UnknownType): Completion<UnknownType> {
        throw new Error("JSObject.__Call__ not implemented");
    }

    public __Construct__(args: UnknownType, newTarget: UnknownType): Completion<UnknownType> {
        throw new Error("JSObject.__Construct__ not implemented");
    }
}

// ES6 Section 6.1.7.1: Property Attributes

export abstract class PropertyDescriptor {
    _nominal_type_PropertyDescriptor: any;
    public enumerable: boolean = true;
    public configurable: boolean = true;
}

export class DataDescriptor extends PropertyDescriptor {
    _nominal_type_DataDescriptor: any;
    public value: JSValue = new JSUndefined();
    public writable: boolean = true;
}

export class AccessorDescriptor extends PropertyDescriptor {
    _nominal_type_AccessorDescriptor: any;
    public __get__: JSObject | JSUndefined = new JSUndefined();
    public __set__: JSObject | JSUndefined = new JSUndefined();
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
