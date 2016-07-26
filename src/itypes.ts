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
    public value: JSValue;
    public target: LabelId;
    public isAbrupt(): boolean {
        return (this.type != CompletionType.Normal);
    }
}

export abstract class Reference {
    _nominal_type_Reference: any;
    // public base: any;
    // public name: string;
    // public strict: boolean;

    public abstract getBase(): any;
    public abstract getReferencedName(): string;
    public abstract isStrictReference(): boolean;
    public abstract hasPrimitiveBase(): boolean;
    public abstract isPropertyReference(): boolean;
    public abstract isUnresolvableRefence(): boolean;
    public abstract isSuperReference(): boolean;
}

export function GetValue(V: Completion): Completion {
    throw new Error("Not implemented");
}

export function PutValue(V: Completion, W: Completion): Completion {
    throw new Error("Not implemented");
}

export function GetThisValue(V: Completion): Completion {
    throw new Error("Not implemented");
}

export class LabelId {
    _nominal_type_LabelId: any;
}

export class JSValue {
    _nominal_type_JSValue: any;
    public constructor() {
    }
}

export class JSUndefined extends JSValue {
    _nominal_type_JSUndefinedValue: any;
    public constructor() {
        super();
    }
}

export class JSNull extends JSValue {
    _nominal_type_JSNullValue: any;
    public constructor() {
        super();
    }
}

export class JSBoolean extends JSValue {
    _nominal_type_JSBooleanValue: any;
    public booleanVal: boolean;
    public constructor(booleanVal: boolean) {
        super();
        this.booleanVal = booleanVal;
    }
}

export class JSString extends JSValue {
    _nominal_type_JSStringValue: any;
    public stringVal: string;
    public constructor(stringVal: string) {
        super();
        this.stringVal = stringVal;
    }
}

export class JSSymbol extends JSValue {
    _nominal_type_JSSymbolValue: any;
    public constructor() {
        super();
    }
}

export class JSNumber extends JSValue {
    _nominal_type_JSNumberValue: any;
    public numberVal: number;
    public constructor(numberVal: number) {
        super();
        this.numberVal = numberVal;
    }
}

export class JSPropertyDescriptor {
    _nominal_type_JSPropertyDescriptor: any;
    public value: JSValue;
}

export class JSObject extends JSValue {
    _nominal_type_JSObjectValue: any;
    public properties: { [name: string]: JSPropertyDescriptor };
    public constructor() {
        super();
        this.properties = {};
    }
}

// Section 8.1.1 Environment Records

export abstract class EnvironmentRecord {

    /**
     * Determine if an Environment Record has a binding for the String value N. Return true if it
     * does and false if it does not.
     */
    public abstract hasBinding(N: string): Completion;

    /**
     * Create a new but uninitialized mutable binding in an Environment Record. The String value N
     * is the text of the bound name. If the optional Boolean argument D is true the binding is may
     * be subsequently deleted.
     */
    public abstract createMutableBinding(N: string, D: boolean): Completion;

    /**
     * Create a new but uninitialized immutable binding in an Environment Record. The String value
     * N is the text of the bound name. If S is true then attempts to access the value of the
     * binding before it is initialized or set it after it has been initialized will always throw
     * an exception, regardless of the strict mode setting of operations that reference that
     * binding. S is an optional parameter that defaults to false.
     */
    public abstract createImmutableBinding(N: string, S: boolean): Completion;

    /**
     * Set the value of an already existing but uninitialized binding in an Environment Record.
     * The String value N is the text of the bound name. V is the value for the binding and is a
     * value of any ECMAScript language type.
     */
    public abstract initializeBinding(N: string, V: JSValue): Completion;

    /**
     * Set the value of an already existing mutable binding in an Environment Record. The String
     * value N is the text of the bound name. V is the value for the binding and may be a value of
     * any ECMAScript language type. S is a Boolean flag. If S is true and the binding cannot be set
     * throw a TypeError exception.
    */
    public abstract setMutableBinding(N: string, V: JSValue, S: boolean): Completion;

    /**
     * Returns the value of an already existing binding from an Environment Record. The String value
     * N is the text of the bound name. S is used to identify references originating in strict mode
     * code or that otherwise require strict mode reference semantics. If S is true and the binding
     * does not exist throw a ReferenceError exception. If the binding exists but is uninitialized
     * a ReferenceError is thrown, regardless of the value of S.
     */
    public abstract getBindingValue(N: string, S: boolean): Completion;

    /**
     * Delete a binding from an Environment Record. The String value N is the text of the bound
     * name. If a binding for N exists, remove the binding and return true. If the binding exists
     * but cannot be removed return false. If the binding does not exist return true.
     */
    public abstract deleteBinding(N: string): Completion;

    /**
     * Determine if an Environment Record establishes a this binding. Return true if it does and
     * false if it does not.
     */
    public abstract hasThisBinding(): Completion;

    /**
     * Determine if an Environment Record establishes a super method binding. Return true if it does
     * and false if it does not.
     */
    public abstract hasSuperBinding(): Completion;

    /**
     * If this Environment Record is associated with a with statement, return the with object.
     * Otherwise, return undefined.
     */
    public abstract withBaseObject(): Completion;

}

export abstract class DeclarativeEnvironmentRecord extends EnvironmentRecord {
}

export abstract class ObjectEnvironmentRecord extends EnvironmentRecord {
}

export abstract class GlobalEnvironmentRecord extends EnvironmentRecord {
}

export abstract class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
    public thisValue: JSValue;
    public thisBindingStatus: "lexical" | "initializd" | "uninitialized";
    public functionObject: JSObject;
    public homeObject: JSObject | undefined;
    public newTarget: JSObject | undefined;
}

export abstract class ModuleEnvironmentRecord extends DeclarativeEnvironmentRecord {
}
