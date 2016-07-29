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

// ES6 Chapter 9: Ordinary and Exotic Objects Behaviours

import {
    JSValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSPropertyKey,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    Completion,
    Intrinsics,
    Property,
    UnknownType,
} from "./datatypes";
import {
    LexicalEnvironment,
    ExecutionContext,
    Realm,
} from "./context";
import {
    ASTNode,
} from "../parser/ast";

// ES6 Section 9.1: Ordinary Object Internal Methods and Internal Slots

export class JSOrdinaryObject extends JSObject {
    _nominal_type_JSOrdinaryObject: any;
    public __prototype__: JSObject | JSNull;
    public __extensible__: JSBoolean

    public constructor() {
        super();
    }

    // ES6 Section 9.1.1: [[GetPrototypeOf]] ()

    public __GetPrototypeOf__(): Completion<JSObject | JSNull> {
        throw new Error("JSOrdinaryObject.__GetPrototypeOf__ Not implemented");
    }

    // ES6 Section 9.1.2: [[SetPrototypeOf]] (V)

    public __SetPrototypeOf__(prototype: JSObject | JSNull): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__SetPrototypeOf__ Not implemented");
    }

    // ES6 Section 9.1.3: [[IsExtensible]] ()

    public __IsExtensible__(): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__IsExtensible__ Not implemented");
    }

    // ES6 Section 9.1.4: [[PreventExtensions]] ()

    public __PreventExtensions__(): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__PreventExtensions__ Not implemented");
    }

    // ES6 Section 9.1.5: [[GetOwnProperty]] (P)

    public __GetOwnProperty__(propertyKey: JSString | JSSymbol): Completion<JSUndefined | Property> {
        throw new Error("JSOrdinaryObject.__GetOwnProperty__ Not implemented");
    }

    // ES6 Section 9.1.6: [[DefineOwnProperty]] (P, Desc)

    public __DefineOwnProperty__(propertyKey: JSString | JSSymbol, property: Property): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__DefineOwnProperty__ Not implemented");
    }

    // ES6 Section 9.1.7: [[HasProperty]](P)

    public __HasProperty__(propertyKey: JSString | JSSymbol): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__HasProperty__ Not implemented");
    }

    // ES6 Section 9.1.8: [[Get]] (P, Receiver)

    public __Get__(propertyKey: JSString | JSSymbol, receiver: JSValue): Completion<UnknownType> {
        throw new Error("JSOrdinaryObject.__Get__ Not implemented");
    }

    // ES6 Section 9.1.9: [[Set]] (P, V, Receiver)

    public __Set__(propertyKey: JSString | JSSymbol, value: JSValue, receiver: JSValue): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__Set__ Not implemented");
    }

    // ES6 Section 9.1.10: [[Delete]] (P)

    public __Delete__(propertyKey: JSString | JSSymbol): Completion<boolean> {
        throw new Error("JSOrdinaryObject.__Delete__ Not implemented");
    }

    // ES6 Section 9.1.11: [[Enumerate]] ()

    public __Enumerate__(): Completion<JSObject> {
        throw new Error("JSOrdinaryObject.__Enumerate__ Not implemented");
    }

    // ES6 Section 9.1.12: [[OwnPropertyKeys]] ()

    public __OwnPropertyKeys__(): Completion<JSPropertyKey[]> {
        throw new Error("JSOrdinaryObject.__OwnPropertyKeys__ Not implemented");
    }
}

export abstract class JSExoticObject extends JSObject {
    _nominal_type_JSExoticObject: any;
}

// ES6 Section 9.1.5.1: OrdinaryGetOwnProperty (O, P)

export function OrdinaryGetOwnProperty(O: JSOrdinaryObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("OrdinaryGetOwnProperty Not implemented");
}

// ES6 Section 9.1.6.1: OrdinaryDefineOwnProperty (O, P, Desc)

export function OrdinaryDefineOwnProperty(O: JSOrdinaryObject, P: JSPropertyKey, Desc: Property): Completion<UnknownType> {
    throw new Error("OrdinaryDefineOwnProperty Not implemented");
}

// ES6 Section 9.1.6.2: IsCompatiblePropertyDescriptor (Extensible, Desc, Current)

export function IsCompatiblePropertyDescriptor(Extensible: boolean, Desc: Property, Current: Property): Completion<UnknownType> {
    throw new Error("IsCompatiblePropertyDescriptor Not implemented");
}

// ES6 Section 9.1.6.3: ValidateAndApplyPropertyDescriptor (O, P, extensible, Desc, current)

export function ValidateAndApplyPropertyDescriptor(
    O: JSOrdinaryObject,
    P: JSPropertyKey,
    extensible: boolean,
    Desc: Property,
    current: Property): Completion<UnknownType> {
    throw new Error("ValidateAndApplyPropertyDescriptor Not implemented");
}

// ES6 Section 9.1.7.1: OrdinaryHasProperty (O, P)

export function OrdinaryHasProperty(O: JSOrdinaryObject, P: JSPropertyKey): Completion<UnknownType> {
    throw new Error("OrdinaryHasProperty Not implemented");
}

// ES6 Section 9.1.13: ObjectCreate(proto, internalSlotsList)

export function ObjectCreate(proto: JSObject | JSNull, internalSlotsList: string[]): Completion<UnknownType> {
    throw new Error("ObjectCreate Not implemented");
}

// ES6 Section 9.1.14: OrdinaryCreateFromConstructor (constructor, intrinsicDefaultProto, internalSlotsList)

export function OrdinaryCreateFromConstructor(constructor: any, intrinsicDefaultProto: any, internalSlotsList: any): Completion<UnknownType> {
    throw new Error("OrdinaryCreateFromConstructor Not implemented");
}

// ES6 Section 9.1.15: GetPrototypeFromConstructor (constructor, intrinsicDefaultProto)

export function GetPrototypeFromConstructor(constructor: any, intrinsicDefaultProto: any): Completion<UnknownType> {
    throw new Error("GetPrototypeFromConstructor Not implemented");
}

// ES6 Section 9.2: ECMAScript Function Objects

export enum ThisMode {
    Lexical,
    Strict,
    Global,
}

export enum FunctionKind {
    Normal,
    ClassConstructor,
    Generator,
}

export enum ConstructorKind {
    Base,
    Derived,
}

export class JSFunctionObject extends JSOrdinaryObject {
    _nominal_type_JSFunctionObject: any;
    public environment: LexicalEnvironment;
    public formalParameters: ASTNode;
    public functionKind: FunctionKind;
    public ecmaScriptCode: ASTNode;
    public constructorKind: ConstructorKind;
    public realm: Realm;
    public thisMode: ThisMode;
    public strict: boolean;
    public homeObject: JSObject;

    public constructor() {
        super();
    }

    // ES6 Section 9.2.1: [[Call]] (thisArgument, argumentsList)

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<UnknownType> {
        throw new Error("JSFunctionObject.__Call__ Not implemented");
    }

    // ES6 Section 9.2.2: [[Construct]] (argumentsList, newTarget)

    public __Construct__(args: JSValue[], obj: JSObject): Completion<UnknownType> {
        throw new Error("JSFunctionObject.__Construct__ Not implemented");
    }


}

// ES6 Section 9.2.1.1: PrepareForOrdinaryCall (F, newTarget)

export function PrepareForOrdinaryCall(F: JSFunctionObject, newTarget: JSObject | JSUndefined): Completion<UnknownType> {
    throw new Error("PrepareForOrdinaryCall Not implemented");
}

// ES6 Section 9.2.1.2: OrdinaryCallBindThis (F, calleeContext, thisArgument)

export function OrdinaryCallBindThis(F: JSFunctionObject, calleeContext: ExecutionContext, thisArgument: JSValue): Completion<UnknownType> {
    throw new Error("OrdinaryCallBindThis Not implemented");
}

// ES6 Section 9.2.1.3: OrdinaryCallEvaluateBody (F, argumentsList)

export function OrdinaryCallEvaluateBody(F: JSFunctionObject, argumentsList: JSValue[]): Completion<UnknownType> {
    throw new Error("OrdinaryCallEvaluateBody Not implemented");
}

// ES6 Section 9.2.3 FunctionAllocate (functionPrototype, strict [,functionKind])

export function FunctionAllocate(functionPrototype: JSObject, strict: boolean, functionKind?: string): Completion<UnknownType> {
    throw new Error("FunctionAllocate Not implemented");
}

// ES6 Section 9.2.4: FunctionInitialize (F, kind, ParameterList, Body, Scope)

export function FunctionInitialize(F: JSFunctionObject, kind: any, ParameterList: any, Body: any, Scope: any): JSFunctionObject {
    throw new Error("FunctionInitialize Not implemented");
}

// ES6 Section 9.2.5: FunctionCreate (kind, ParameterList, Body, Scope, Strict, prototype)

export function FunctionCreate(kind: any, ParameterList: any, Body: any, Scope: any, Strict: any, prototype: any): JSFunctionObject {
    throw new Error("FunctionInitialize Not implemented");
}

// ES6 Section 9.2.6: GeneratorFunctionCreate (kind, ParameterList, Body, Scope, Strict)

export function GeneratorFunctionCreate(kind: any, ParameterList: any, Body: any, Scope: any, Strict: any): JSFunctionObject {
    throw new Error("FunctionInitialize Not implemented");
}

// ES6 Section 9.2.7 AddRestrictedFunctionProperties (F, realm)

export function AddRestrictedFunctionProperties(F: JSFunctionObject, realm: Realm): Completion<UnknownType> {
    throw new Error("AddRestrictedFunctionProperties Not implemented");
}

// ES6 Section 9.2.7.1: %ThrowTypeError% ()

export function intrinsic_ThrowTypeError(): Completion<UnknownType> {
    throw new Error("intrinsic_ThrowTypeError Not implemented");
}

// ES6 Section 9.2.8 MakeConstructor: (F, writablePrototype, prototype)

export function MakeConstructor(F: JSFunctionObject, writablePrototype: any, prototype: any): Completion<UnknownType> {
    throw new Error("MakeConstructor Not implemented");
}

// ES6 Section 9.2.9: MakeClassConstructor (F)

export function MakeClassConstructor(F: JSFunctionObject): Completion<UnknownType> {
    throw new Error("MakeClassConstructor Not implemented");
}

// ES6 Section 9.2.10 MakeMethod: (F, homeObject)

export function MakeMethod(F: JSFunctionObject, homeObject: JSObject): Completion<UnknownType> {
    throw new Error("MakeMethod Not implemented");
}

// ES6 Section 9.2.11: SetFunctionName (F, name, prefix)

export function SetFunctionName(F: JSFunctionObject, name: string, prefix: string): Completion<UnknownType> {
    throw new Error("SetFunctionName Not implemented");
}

// ES6 Section 9.2.12: FunctionDeclarationInstantiation (func, argumentsList)

export function FunctionDeclarationInstantiation(func: JSFunctionObject, argumentsList: any[]) {
    throw new Error("FunctionDeclarationInstantiation Not implemented");
}

// ES6 Section 9.3: Built-in Function Objects

// ES6 Section 9.3.3: CreateBuiltinFunction (realm, steps, prototype, internalSlotsList)

export function CreateBuiltinFunction(realm: Realm, steps: any, prototype: any, internalSlotsList: any): Completion<UnknownType> {
    throw new Error("CreateBuiltinFunction Not implemented");
}

// ES6 Section 9.4: Built-in Exotic Object Internal Methods and Slots

// ES6 Section 9.4.1: Bound Function Exotic Objects

// ES6 Section 9.4.1.1: [[Call]] (thisArgument, argumentsList)

// TODO

// ES6 Section 9.4.1.2: [[Construct]] (argumentsList, newTarget)

// TODO

// ES6 Section 9.4.1.3: BoundFunctionCreate (targetFunction, boundThis, boundArgs)

export function BoundFunctionCreate(targetFunction: any, boundThis: any, boundArgs: any): Completion<UnknownType> {
    throw new Error("BoundFunctionCreate not implemented");
}

// ES6 Section 9.4.2: Array Exotic Objects

// ES6 Section 9.4.2.1: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.2.2: ArrayCreate(length, proto)

export function ArrayCreate(length: any, proto: any): Completion<UnknownType> {
    throw new Error("ArrayCreate not implemented");
}

// ES6 Section 9.4.2.3: ArraySpeciesCreate(originalArray, length)

export function ArraySpeciesCreate(originalArray: any, length: any): Completion<UnknownType> {
    throw new Error("ArraySpeciesCreate not implemented");
}

// ES6 Section 9.4.2.4: ArraySetLength(A, Desc)

export function ArraySetLength(A: any, Desc: any): Completion<UnknownType> {
    throw new Error("ArraySetLength not implemented");
}

// ES6 Section 9.4.3: String Exotic Objects

// ES6 Section 9.4.3.1: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.3.1.1: StringGetIndexProperty (S, P)

export function StringGetIndexProperty(S: any, P: any): Completion<UnknownType> {
    throw new Error("StringGetIndexProperty not implemented");
}

// ES6 Section 9.4.3.2: [[HasProperty]] (P)

// TODO

// ES6 Section 9.4.3.3: [[OwnPropertyKeys]] ()

// TODO

// ES6 Section 9.4.3.4: StringCreate (value, prototype)

export function StringCreate(value: any, prototype: any): Completion<UnknownType> {
    throw new Error("StringCreate not implemented");
}

// ES6 Section 9.4.4: Arguments Exotic Objects

// ES6 Section 9.4.4.1: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.4.2: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.4.3: [[Get]] (P, Receiver)

// TODO

// ES6 Section 9.4.4.4: [[Set]] (P, V, Receiver)

// TODO

// ES6 Section 9.4.4.5: [[Delete]] (P)

// TODO

// ES6 Section 9.4.4.6: CreateUnmappedArgumentsObject (argumentsList)

export function CreateUnmappedArgumentsObject(argumentsList: any): Completion<UnknownType> {
    throw new Error("CreateUnmappedArgumentsObject not implemented");
}

// ES6 Section 9.4.4.7: CreateMappedArgumentsObject (func, formals, argumentsList, env)

export function CreateMappedArgumentsObject(func: any, formals: any, argumentsList: any, env: any): Completion<UnknownType> {
    throw new Error("CreateMappedArgumentsObject not implemented");
}

// ES6 Section 9.4.4.7.1: MakeArgGetter (name, env)

export function MakeArgGetter(name: any, env: any): Completion<UnknownType> {
    throw new Error("MakeArgGetter not implemented");
}

// ES6 Section 9.4.4.7.2: MakeArgSetter (name, env)

export function MakeArgSetter(name: any, env: any): Completion<UnknownType> {
    throw new Error("MakeArgSetter not implemented");
}

// ES6 Section 9.4.5: Integer Indexed Exotic Objects

// ES6 Section 9.4.5.1: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.5.2: [[HasProperty]] (P)

// TODO

// ES6 Section 9.4.5.3: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.5.4: [[Get]] (P, Receiver)

// TODO

// ES6 Section 9.4.5.5: [[Set]] (P, V, Receiver)

// TODO

// ES6 Section 9.4.5.6: [[OwnPropertyKeys]] ()

// TODO

// ES6 Section 9.4.5.7: IntegerIndexedObjectCreate (prototype, internalSlotsList)

export function IntegerIndexedObjectCreate(prototype: any, internalSlotsList: any): Completion<UnknownType> {
    throw new Error("IntegerIndexedObjectCreate not implemented");
}

// ES6 Section 9.4.5.8: IntegerIndexedElementGet (O, index)

export function IntegerIndexedElementGet(O: any, index: any): Completion<UnknownType> {
    throw new Error("IntegerIndexedElementGet not implemented");
}

// ES6 Section 9.4.5.9: IntegerIndexedElementSet (O, index, value)

export function IntegerIndexedElementSet(O: any, index: any, value: any): Completion<UnknownType> {
    throw new Error("IntegerIndexedElementGet not implemented");
}

// ES6 Section 9.4.6: Module Namespace Exotic Objects

// ES6 Section 9.4.6.1: [[GetPrototypeOf]] ()

// TODO

// ES6 Section 9.4.6.2: [[SetPrototypeOf]] (V)

// TODO

// ES6 Section 9.4.6.3: [[IsExtensible]] ()

// TODO

// ES6 Section 9.4.6.4: [[PreventExtensions]] ()

// TODO

// ES6 Section 9.4.6.5: [[GetOwnProperty]] (P)

// TODO

// ES6 Section 9.4.6.6: [[DefineOwnProperty]] (P, Desc)

// TODO

// ES6 Section 9.4.6.7: [[HasProperty]] (P)

// TODO

// ES6 Section 9.4.6.8: [[Get]] (P, Receiver)

// TODO

// ES6 Section 9.4.6.9: [[Set]] (P, V, Receiver)

// TODO

// ES6 Section 9.4.6.10: [[Delete]] (P)

// TODO

// ES6 Section 9.4.6.11: [[Enumerate]] ()

// TODO

// ES6 Section 9.4.6.12: [[OwnPropertyKeys]] ()

// TODO

// ES6 Section 9.4.6.13: ModuleNamespaceCreate (module, exports)

export function ModuleNamespaceCreate(module: any, exports: any): Completion<UnknownType> {
    throw new Error("ModuleNamespaceCreate not implemented");
}

// ES6 Section 9.5: Proxy Object Internal Methods and Internal Slots

// TODO
