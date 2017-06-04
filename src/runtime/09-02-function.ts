// Copyright 2016-2017 Peter Kelly <peter@pmkelly.net>
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

import {
    JSValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    Completion,
    LexicalEnvironment,
    EnvironmentRecord,
    Realm,
    DataDescriptor,
    NormalCompletion,
    ReturnCompletion,
    Empty,
    Reference,
    ValueIterator,
} from "./datatypes";
import {
    ToObject,
} from "./07-01-conversion";
import {
    DefinePropertyOrThrow,
} from "./07-03-objects";
import {
    NewFunctionEnvironment,
    FunctionEnvironmentRecord,
    NewDeclarativeEnvironment,
} from "./08-01-environment";
import {
    ExecutionContext,
} from "./08-03-context";
import {
    ObjectCreate,
} from "./09-01-ordinary";
import {
    ASTNode,
    VarScopedDeclaration,
    LexicallyScopedDeclaration,
} from "../parser/ast";
import {
    FormalParametersNode,
    FunctionStatementList,
    FunctionDeclarationNode,
    GeneratorDeclarationNode,
} from "../execution/functions";
import {
    StatementListNode
} from "../execution/statements";

// ES6 Section 9.2: ECMAScript Function Objects

export enum FunctionKind {
    Normal,
    ClassConstructor,
    Generator,
}

export enum ConstructorKind {
    Base,
    Derived,
}

export enum ThisMode {
    Lexical,
    Strict,
    Global,
    Undefined,
}

export interface JSFunctionOptions {
    functionKind: FunctionKind;
    constructorKind: ConstructorKind;
    thisMode: ThisMode;
    realm: Realm;
    strict: boolean;
    prototype: JSObject | JSNull;
}

export class JSFunction extends JSObject {
    public _type_JSFunction: any;
    // FIXME: The types of most of these properties should not include undefined; but they have
    // not be initialized properly by the constructor
    public environment: LexicalEnvironment | undefined = undefined;
    public formalParameters: FormalParametersNode | undefined = undefined;
    public functionKind: FunctionKind;
    public ecmaScriptCode: StatementListNode | undefined = undefined;
    public constructorKind: ConstructorKind;
    public realm: Realm;
    public thisMode: ThisMode;
    public strict: boolean;
    public homeObject: JSObject | undefined = undefined;

    public constructor(options: JSFunctionOptions) {
        super(options.prototype);
        this.environment = undefined;
        this.formalParameters = undefined;
        this.functionKind = options.functionKind;
        this.ecmaScriptCode = undefined;
        this.constructorKind = options.constructorKind;
        this.realm = options.realm;
        this.thisMode = options.thisMode;
        this.strict = options.strict;
        this.homeObject = undefined;
    }

    public get implementsCall(): boolean {
        return true;
    }

    public get implementsConstruct(): boolean {
        return true;
    }

    // ES6 Section 9.2.1: [[Call]] (thisArgument, argumentsList)
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        const F = this;

        // 1. Assert: F is an ECMAScript function object.
        // (implicit in object type)

        // 2. If F’s [[FunctionKind]] internal slot is "classConstructor", throw a TypeError exception.
        if (F.functionKind === FunctionKind.ClassConstructor)
            return realm.throwTypeError();

        // 3. Let callerContext be the running execution context.
        // (unnecessary, because we are using the host VM's stack)

        // 4. Let calleeContext be PrepareForOrdinaryCall(F, undefined).
        const calleeContext = PrepareForOrdinaryCall(F,new JSUndefined());
        const calleeRealm = calleeContext.realm;

        // 5. Assert: calleeContext is now the running execution context.
        // (unnecessary, because we are using the host VM's stack)

        // 6. Perform OrdinaryCallBindThis(F, calleeContext, thisArgument).
        const bindComp = OrdinaryCallBindThis(calleeRealm,F,calleeContext,thisArg);
        if (!(bindComp instanceof NormalCompletion))
            return bindComp;

        // 7. Let result be OrdinaryCallEvaluateBody(F, argumentsList).
        const resultComp = OrdinaryCallEvaluateBody(calleeContext,F,args);

        // 8. Remove calleeContext from the execution context stack and restore callerContext as the running execution context.
        // (unnecessary, because we are using the host VM's stack)

        // 9. If result.[[type]] is return, return NormalCompletion(result.[[value]]).
        if (resultComp instanceof ReturnCompletion)
            return new NormalCompletion(resultComp.returnValue);

        // 10. ReturnIfAbrupt(result).
        if (!(resultComp instanceof NormalCompletion))
            return resultComp;

        // 11. Return NormalCompletion(undefined).
        return new NormalCompletion(new JSUndefined());
    }

    // ES6 Section 9.2.2: [[Construct]] (argumentsList, newTarget)
    public __Construct__(realm: Realm, args: JSValue[], newTarget: JSObject): Completion<JSObject> {
        throw new Error("JSFunction.__Construct__ not implemented");
    }
}

// ES6 Section 9.2.1.1: PrepareForOrdinaryCall (F, newTarget)

export function PrepareForOrdinaryCall(
    F: JSFunction,
    newTarget: JSObject | JSUndefined
): ExecutionContext {
    // 1. Assert: Type(newTarget) is Undefined or Object.
    // (implicit in parameter type)

    // 2. Let callerContext be the running execution context.
    // (unnecessary, because we are using the host VM's stack)

    // 3. Let calleeContext be a new ECMAScript code execution context.
    // 4. Set the Function of calleeContext to F.
    // 5. Let calleeRealm be the value of F’s [[Realm]] internal slot.
    // 6. Set the Realm of calleeContext to calleeRealm.
    // 7. Let localEnv be NewFunctionEnvironment(F, newTarget).
    // 8. Set the LexicalEnvironment of calleeContext to localEnv.
    // 9. Set the VariableEnvironment of calleeContext to localEnv.
    // (property initialization is done in ExecutionContext constructor)
    const localEnv = NewFunctionEnvironment(F.realm,F,newTarget);
    const calleeContext = new ExecutionContext(F.realm,F,localEnv);

    // 10. If callerContext is not already suspended, Suspend callerContext.
    // (unnecessary, because we are using the host VM's stack)

    // 11. Push calleeContext onto the execution context stack; calleeContext is now the running execution context.
    // (caller must do this, because we are using the host VM's stack)

    // 12. NOTE Any exception objects produced after this point are associated with calleeRealm.
    // 13. Return calleeContext.
    return calleeContext;
}

// ES6 Section 9.2.1.2: OrdinaryCallBindThis (F, calleeContext, thisArgument)

export function OrdinaryCallBindThis(
    realm: Realm,
    F: JSFunction,
    calleeContext: ExecutionContext,
    thisArgument: JSValue
): Completion<JSValue> {
    // 1. Let thisMode be the value of F’s [[ThisMode]] internal slot.
    const thisMode = F.thisMode;

    // 2. If thisMode is lexical, return NormalCompletion(undefined).
    if (thisMode === ThisMode.Lexical)
        return new NormalCompletion(new JSUndefined());

    // 3. Let calleeRealm be the value of F’s [[Realm]] internal slot.
    const calleeRealm = F.realm;

    // 4. Let localEnv be the LexicalEnvironment of calleeContext.
    const localEnv = calleeContext.lexicalEnvironment;

    let thisValue: JSValue;
    // 5. If thisMode is strict, let thisValue be thisArgument.
    if (thisMode === ThisMode.Strict) {
        thisValue = thisArgument;
    }
    // 6. Else
    else {
        // a. if thisArgument is null or undefined, then
        if ((thisArgument instanceof JSNull) || (thisArgument instanceof JSUndefined)) {
            // i. Let thisValue be calleeRealm.[[globalThis]].
            thisValue = calleeRealm.globalThis;
        }
        // b. Else
        else {
            // i. Let thisValue be ToObject(thisArgument).
            const thisValueComp = ToObject(calleeRealm,thisArgument);

            // ii. Assert: thisValue is not an abrupt completion.
            if (!(thisValueComp instanceof NormalCompletion))
                throw new Error("Assertion failure: ToObject returned an abrupt completion");
            thisValue = thisValueComp.value;

            // iii. NOTE ToObject produces wrapper objects using calleeRealm.
        }
    }

    // 7. Let envRec be localEnv’s EnvironmentRecord.
    const envRec = localEnv.record;

    // 8. Assert: The next step never returns an abrupt completion because
    // envRec.[[thisBindingStatus]] is not "uninitialized".
    // 9. Return envRec.BindThisValue(thisValue).
    if (!(envRec instanceof FunctionEnvironmentRecord))
        throw new Error("Assertion failure: Expected envRec to be a FunctionEnvironmentRecord");
    const bindComp = envRec.BindThisValue(thisValue);
    if (!(bindComp instanceof NormalCompletion))
        throw new Error("Assertion failure: BindThisValue returned an abrupt completion");
    return bindComp;
}

// ES6 Section 9.2.1.3: OrdinaryCallEvaluateBody (F, argumentsList)

export function OrdinaryCallEvaluateBody(ctx: ExecutionContext, F: JSFunction, argumentsList: JSValue[]): Completion<JSValue | Reference | Empty> {
    // 1. Let status be FunctionDeclarationInstantiation(F, argumentsList).
    const statusComp = FunctionDeclarationInstantiation(ctx,F,argumentsList);

    // 2. ReturnIfAbrupt(status)
    if (!(statusComp instanceof NormalCompletion))
        return statusComp;

    // 3. Return the result of EvaluateBody of the parsed code that is the value of F's
    // [[ECMAScriptCode]] internal slot passing F as the argument.

    // FIXME (important): For normal functions (not arrow functions or generators), EvaluateBody
    // simply calls Evaluate on the StatementList. It looks like we're going to have a separate
    // node for FunctionBody and/or FunctionStatementList, and similar for arrow functions and
    // generators, to handle this and other differences.
    //
    // When we do this, the ecmaScriptCode property of JSFunction would become a union type of
    // the body classes for each function type.

    if (F.ecmaScriptCode === undefined)
        throw new Error("F.ecmaScriptCode is undefined");

    return F.ecmaScriptCode.evaluate(ctx);
}

// ES6 Section 9.2.3: FunctionAllocate (functionPrototype, strict [,functionKind])

export enum AllocateKind {
    Normal,
    NonConstructor,
    Generator,
}

export function FunctionAllocate(realm: Realm, functionPrototype: JSObject, strict: boolean, functionKind?: AllocateKind): JSFunction {
    // 1. Assert: Type(functionPrototype) is Object.
    // (implicit in parameter type)

    // 2. Assert: If functionKind is present, its value is either "normal", "non-constructor" or "generator".
    // (implicit in parameter type)

    // 3. If functionKind is not present, let functionKind be "normal".
    if (functionKind === undefined)
        functionKind = AllocateKind.Normal;

    let needsConstruct: boolean;

    // 4. If functionKind is "non-constructor", then
    if (functionKind === AllocateKind.NonConstructor) {
        // a. Let functionKind be "normal".
        functionKind = AllocateKind.Normal;

        // b. Let needsConstruct be false.
        needsConstruct = false;
    }
    // 5. Else let needsConstruct be true.
    else {
        needsConstruct = true;
    }

    // 6. Let F be a newly created ECMAScript function object with the internal slots listed in
    // Table 27. All of those internal slots are initialized to undefined.
    // (we do this later, as the values described below must be passed in to the constructor)

    // 7. Set F’s essential internal methods to the default ordinary object definitions specified in 9.1.
    // (implicit; JSFunction inherits these methods from JSObject)

    // 8. Set F’s [[Call]] internal method to the definition specified in 9.2.1.
    // (implicit; JSFunction implements this in its __Call__ method)

    let optConstructorKind: ConstructorKind = ConstructorKind.Base;
    // 9. If needsConstruct is true, then
    if (needsConstruct) {
        // a. Set F’s [[Construct]] internal method to the definition specified in 9.2.2.
        // (implicit; JSFunction implements this in its __Construct__ method)

        // b. If functionKind is "generator", set the [[ConstructorKind]] internal slot of F to "derived".
        if (functionKind === AllocateKind.Generator) {
            optConstructorKind = ConstructorKind.Derived;
        }
        // c. Else, set the [[ConstructorKind]] internal slot of F to "base".
        else {
            optConstructorKind = ConstructorKind.Base;
        }
        // d. NOTE Generator functions are tagged as "derived" constructors to prevent [[Construct]]
        // from preallocating a generator instance. Generator instance objects are allocated when
        // EvaluateBody is applied to the GeneratorBody of a generator function.
    }

    // 10. Set the [[Strict]] internal slot of F to strict.
    const optStrict: boolean = strict;

    // 11. Set the [[FunctionKind]] internal slot of F to functionKind.
    const optFunctionKind: FunctionKind = (functionKind === AllocateKind.Generator) ? FunctionKind.Generator : FunctionKind.Normal;

    // 12. Set the [[Prototype]] internal slot of F to functionPrototype.
    const optPrototype: JSObject = functionPrototype;

    // 13. Set the [[Extensible]] internal slot of F to true.
    const optExtensible: boolean = true;

    // 14. Set the [[Realm]] internal slot of F to the running execution context’s Realm.
    const optRealm: Realm = realm;

    // *Now* we can create F, as we have all the required parameters for the constructor
    const F = new JSFunction({
        functionKind: optFunctionKind,
        constructorKind: optConstructorKind,
        thisMode: ThisMode.Undefined,
        realm: realm,
        strict: optStrict,
        prototype: optPrototype,
    });

    F.__extensible__ = optExtensible;

    // 15. Return F.
    return F;
}

// ES6 Section 9.2.4: FunctionInitialize (F, kind, ParameterList, Body, Scope)

export enum InitializeKind {
    Normal,
    Method,
    Arrow
}

export function FunctionInitialize(
    realm: Realm,
    F: JSFunction,
    kind: InitializeKind,
    ParameterList: FormalParametersNode,
    Body: StatementListNode,
    Scope: LexicalEnvironment
): Completion<JSFunction> {
    // FunctionInitialize is called from three places:
    //     9.2.5 FunctionCreate
    //     9.2.6 GeneratorFunctionCreate
    //     19.2.1.1.1 RuntimeSemantics: CreateDynamicFunction
    //
    // In all three cases, the call is preceded by FunctionAllocate. The only difference is that
    // in FunctionCreate and GeneratorFunctionCreate, FunctionInitialize is called immediately
    // after FunctionAllocate, while CreateDynamicFunction passes the global scope of the function's
    // realm as a parameter. Ideally these should really be merged into a single implementation
    // function.

    // 1. Assert: F is an extensible object that does not have a length own property.
    // (implicit; we have just called FunctionAllocate before this, which does not set length)

    // 2. Let len be the ExpectedArgumentCount of ParameterList.
    // TODO
    const len = 0;

    // 3. Let status be DefinePropertyOrThrow(F, "length", PropertyDescriptor{[[Value]]: len,
    // [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true}).
    const statusComp = DefinePropertyOrThrow(realm, F, new JSString("length"), new DataDescriptor({
        value: new JSNumber(len),
        writable: false,
        enumerable: false,
        configurable: true,
    }));

    // 4. Assert: status is not an abrupt completion.
    if (!(statusComp instanceof NormalCompletion))
        return statusComp;

    // 5. Let Strict be the value of the [[Strict]] internal slot of F.
    const strict = F.strict;

    // 6. Set the [[Environment]] internal slot of F to the value of Scope.
    F.environment = Scope;

    // 7. Set the [[FormalParameters]] internal slot of F to ParameterList .
    F.formalParameters = ParameterList;

    // 8. Set the [[ECMAScriptCode]] internal slot of F to Body.
    F.ecmaScriptCode = Body;

    // 9. If kind is Arrow, set the [[ThisMode]] internal slot of F to lexical.
    if (kind === InitializeKind.Arrow) {
        F.thisMode = ThisMode.Lexical;
    }
    // 10. Else if Strict is true, set the [[ThisMode]] internal slot of F to strict.
    else if (F.strict) {
        F.thisMode = ThisMode.Strict;
    }
    // 11. Else set the [[ThisMode]] internal slot of F to global.
    else {
        F.thisMode = ThisMode.Global;
    }

    // 12. Return F.
    return new NormalCompletion(F);
}

// ES6 Section 9.2.5: FunctionCreate (kind, ParameterList, Body, Scope, Strict, prototype)

export function FunctionCreate(
    realm: Realm,
    kind: InitializeKind,
    parameterList: FormalParametersNode,
    body: StatementListNode,
    scope: LexicalEnvironment,
    strict: boolean,
    prototype?: JSObject
): Completion<JSFunction> {
    // 1. If the prototype argument was not passed, then
    if (prototype === undefined) {
        // a. Let prototype be the intrinsic object %FunctionPrototype%.
        prototype = realm.intrinsics.FunctionPrototype;
    }

    let allocKind: AllocateKind;
    // 2. If kind is not Normal, let allocKind be "non-constructor".
    if (kind !== InitializeKind.Normal) {
        allocKind = AllocateKind.NonConstructor;
    }
    // 3. Else let allocKind be "normal".
    else {
        allocKind = AllocateKind.Normal;
    }

    // 4. Let F be FunctionAllocate(prototype, Strict, allocKind).
    const F = FunctionAllocate(realm,prototype,strict,allocKind);

    // 5. Return FunctionInitialize(F, kind, ParameterList, Body, Scope).
    return FunctionInitialize(realm,F,kind,parameterList,body,scope);
}

// ES6 Section 9.2.6: GeneratorFunctionCreate (kind, ParameterList, Body, Scope, Strict)

export function GeneratorFunctionCreate(
    kind: "normal" | "method",
    ParameterList: ASTNode,
    Body: ASTNode,
    Scope: LexicalEnvironment,
    Strict: boolean
): Completion<JSFunction> {
    throw new Error("GeneratorFunctionCreate not implemented");
}

// ES6 Section 9.2.7: AddRestrictedFunctionProperties (F, realm)

export function AddRestrictedFunctionProperties(F: JSFunction, realm: Realm): Completion<void> {
    throw new Error("AddRestrictedFunctionProperties not implemented");
}

// ES6 Section 9.2.7.1: %ThrowTypeError% ( )

// Implemented as part of Intrinsics

// ES6 Section 9.2.8: MakeConstructor (F, writablePrototype, prototype)

export function MakeConstructor(realm: Realm, F: JSFunction, writablePrototype?: boolean, prototype?: JSObject): Completion<void> {
    // 1. Assert: F is an ECMAScript function object.
    // (implicit in parameter type)

    // 2. Assert: F has a [[Construct]] internal method.
    // (implicit in parameter type)

    // 3. Assert: F is an extensible object that does not have a prototype own property.
    if (!F.__extensible__)
        throw new Error("Assertion failure: F must be an extensible object");

    if (F.properties.contains(new JSString("prototype")))
        throw new Error("Assertion failure: F must not have a prototype own property.");

    // 4. If the writablePrototype argument was not provided, let writablePrototype be true.
    if (writablePrototype === undefined)
        writablePrototype = true;

    // 5. If the prototype argument was not provided, then
    if (prototype === undefined) {
        // a. Let prototype be ObjectCreate(%ObjectPrototype%).
        prototype = ObjectCreate(realm,realm.intrinsics.ObjectPrototype);

        // b. Let status be DefinePropertyOrThrow(prototype, "constructor",
        // PropertyDescriptor{[[Value]]: F, [[Writable]]: writablePrototype, [[Enumerable]]: false,
        // [[Configurable]]: true }).
        const status = DefinePropertyOrThrow(realm,prototype,new JSString("constructor"),new DataDescriptor({
            value: F,
            writable: writablePrototype,
            enumerable: false,
            configurable: true,
        }));

        // c. Assert: status is not an abrupt completion.
        if (!(status instanceof NormalCompletion))
            throw new Error("Assertion failure: DefinePropertyOrThrow (case 1) returned an abrupt completion");
    }

    // 6. Let status be DefinePropertyOrThrow(F, "prototype", PropertyDescriptor{[[Value]]: prototype,
    // [[Writable]]: writablePrototype, [[Enumerable]]: false, [[Configurable]]: false}).
    const status = DefinePropertyOrThrow(realm,F,new JSString("prototype"),new DataDescriptor({
        value: prototype,
        writable: writablePrototype,
        enumerable: false,
        configurable: false,
    }));

    // 7. Assert: status is not an abrupt completion.
    if (!(status instanceof NormalCompletion))
        throw new Error("Assertion failure: DefinePropertyOrThrow (case 1) returned an abrupt completion");

    // 8. Return NormalCompletion(undefined).
    return new NormalCompletion(undefined);
}

// ES6 Section 9.2.9: MakeClassConstructor (F)

export function MakeClassConstructor(F: JSFunction): Completion<void> {
    throw new Error("MakeClassConstructor not implemented");
}

// ES6 Section 9.2.10: MakeMethod (F, homeObject)

export function MakeMethod(F: JSFunction, homeObject: JSObject): void {
    // 1. Assert: F is an ECMAScript function object.
    // (implicit in parameter type)

    // 2. Assert: Type(homeObject) is Object.
    // (implicit in parameter type)

    // 3. Set the [[HomeObject]] internal slot of F to homeObject.
    F.homeObject = homeObject;

    // 4. Return NormalCompletion(undefined).
    // (just return void, since this function can never throw)
}

// ES6 Section 9.2.11: SetFunctionName (F, name, prefix)

export function SetFunctionName(realm: Realm, F: JSObject, name: JSPropertyKey, prefix?: string): Completion<boolean> {
    // 1. Assert: F is an extensible object that does not have a name own property.
    if (!F.__extensible__)
        throw new Error("Assertion failure: F must be an extensible object");

    if (F.properties.contains(new JSString("name")))
        throw new Error("Assertion failure: F must not have a name own property");

    // 2. Assert: Type(name) is either Symbol or String.
    // (implicit in parameter type)

    // 3. Assert: If prefix was passed then Type(prefix) is String.
    // (implicit in parameter type)

    // 4. If Type(name) is Symbol, then
    if (name instanceof JSSymbol) {
        // a. Let description be name’s [[Description]] value.
        const description = name.description;

        // b. If description is undefined, let name be the empty String.
        if (description instanceof JSUndefined)
            name = new JSString("");

        // c. Else, let name be the concatenation of "[", description, and "]".
        else
            name = new JSString("["+description+"]");
    }

    // Not in the spec, but just to satisfy typescript
    if (!(name instanceof JSString))
        throw new Error("Assertion failure: name must be a JSString by this point");

    // 5. If prefix was passed, then
    if (prefix !== undefined) {
        // a. Let name be the concatenation of prefix, code unit 0x0020 (SPACE), and name.
        name = new JSString(prefix+" "+name.stringValue);
    }

    // 6. Return DefinePropertyOrThrow(F, "name", PropertyDescriptor{[[Value]]: name,
    // [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true}).
    const result = DefinePropertyOrThrow(realm,F,new JSString("name"),new DataDescriptor({
        value: name,
        writable: false,
        enumerable: false,
        configurable: true,
    }));

    // 7. Assert: the result is never an abrupt completion.
    if (!(result instanceof NormalCompletion))
        throw new Error("Assertion failure: DefinePropertyOrThrow returned an abrupt completion");

    return result;
}

// ES6 Section 9.2.12: FunctionDeclarationInstantiation (func, argumentsList)

export function FunctionDeclarationInstantiation(
    calleeContext: ExecutionContext, func: JSFunction, argumentsList: JSValue[]): Completion<Empty> {

    const realm = calleeContext.realm;

    // 1. Let calleeContext be the running execution context.
    // (parameter)

    // 2. Let env be the LexicalEnvironment of calleeContext.
    const env = calleeContext.lexicalEnvironment;

    // 3. Let envRec be env’s EnvironmentRecord.
    const envRec = env.record;

    // 4. Let code be the value of the [[ECMAScriptCode]] internal slot of func.
    if (func.ecmaScriptCode === undefined) // FIXME: Prevent func.ecmaScriptCode from ever being undefined
        throw new Error("Assertion failure: func.ecmaScriptCode is undefined");
    const code = new FunctionStatementList(func.ecmaScriptCode);

    // 5. Let strict be the value of the [[Strict]] internal slot of func.
    const strict = func.strict;

    // 6. Let formals be the value of the [[FormalParameters]] internal slot of func.
    const formals = func.formalParameters;
    if (formals === undefined) // FIXME: Prevent func.formalParameters from ever being undefined
        throw new Error("Assertion failure: func.formalParameters is undefined");

    // 7. Let parameterNames be the BoundNames of formals.
    const parameterNames: string[] = [];
    formals.boundNames(parameterNames);

    // 8. If parameterNames has any duplicate entries, let hasDuplicates be true. Otherwise, let hasDuplicates be false.
    const hasDuplicates = haveDuplicateNames(parameterNames);

    // 9. Let simpleParameterList be IsSimpleParameterList of formals.
    const simpleParameterList = formals.isSimpleParameterList();

    // 10. Let hasParameterExpressions be ContainsExpression of formals.
    const hasParameterExpressions = formals.containsExpression();

    // 11. Let varNames be the VarDeclaredNames of code.
    const varNames: string[] = [];
    code.varDeclaredNames(varNames);

    // 12. Let varDeclarations be the VarScopedDeclarations of code.
    const varDeclarations: VarScopedDeclaration[] = [];
    code.varScopedDeclarations(varDeclarations);

    // 13. Let lexicalNames be the LexicallyDeclaredNames of code.
    const lexicalNames: string[] = [];
    code.lexicallyDeclaredNames(lexicalNames);

    // 14. Let functionNames be an empty List.
    const functionNames: string[] = [];

    // 15. Let functionsToInitialize be an empty List.
    const functionsToInitialize: (FunctionDeclarationNode | GeneratorDeclarationNode)[] = [];

    // 16. For each d in varDeclarations, in reverse list order do
    for (const d of varDeclarations.slice().reverse()) {
        // a. If d is neither a VariableDeclaration or a ForBinding, then
        if ((d instanceof FunctionDeclarationNode) || (d instanceof GeneratorDeclarationNode)) {
        // TODO...
            // i. Assert: d is either a FunctionDeclaration or a GeneratorDeclaration.
            // (implicit above)

            // ii. Let fn be the sole element of the BoundNames of d.
            if (d.ident == null) {
                throw new Error("Expected function to have an identifier");
            }
            const fn = d.ident.value;

            // iii. If fn is not an element of functionNames, then
            if (functionNames.indexOf(fn) < 0) {
                // 1. Insert fn as the first element of functionNames.
                functionNames.unshift(fn);

                // 2. NOTE If there are multiple FunctionDeclarations or GeneratorDeclarations for
                // the same name, the last declaration is used.

                // 3. Insert d as the first element of functionsToInitialize.
                functionsToInitialize.unshift(d);
            }
        }
    }

    // 17. Let argumentsObjectNeeded be true.
    let argumentsObjectNeeded = true;

    // 18. If the value of the [[ThisMode]] internal slot of func is lexical, then
    if (func.thisMode === ThisMode.Lexical) {
        // a. NOTE Arrow functions never have an arguments objects.
        // b. Let argumentsObjectNeeded be false.
        argumentsObjectNeeded = false;
    }
    // 19. Else if "arguments" is an element of parameterNames, then
    else if (parameterNames.indexOf("arguments") >= 0) {
        // a. Let argumentsObjectNeeded be false.
        argumentsObjectNeeded = false;
    }
    // 20. Else if hasParameterExpressions is false, then
    else if (!hasParameterExpressions) {
        // a. If "arguments" is an element of functionNames or if "arguments" is an element of lexicalNames, then
        if ((functionNames.indexOf("arguments") >= 0) || (lexicalNames.indexOf("arguments") >= 0)) {
            // i. Let argumentsObjectNeeded be false.
            argumentsObjectNeeded = false;
        }
    }

    // 21. For each String paramName in parameterNames, do
    for (const paramName of parameterNames) {
        // a. Let alreadyDeclared be envRec.HasBinding(paramName).
        const alreadyDeclaredComp = envRec.HasBinding(paramName);
        if (!(alreadyDeclaredComp instanceof NormalCompletion))
            return alreadyDeclaredComp;
        const alreadyDeclared = alreadyDeclaredComp.value;

        // b. NOTE Early errors ensure that duplicate parameter names can only occur in non-strict
        // functions that do not have parameter default values or rest parameters.

        // c. If alreadyDeclared is false, then
        if (!alreadyDeclared) {
            // i. Let status be envRec.CreateMutableBinding(paramName).
            const statusComp1 = envRec.CreateMutableBinding(paramName,false);
            if (!(statusComp1 instanceof NormalCompletion))
                throw new Error("statusComp1 should not be an abrupt completion");

            // ii. If hasDuplicates is true, then
            if (hasDuplicates) {
                // 1. Let status be envRec.InitializeBinding(paramName, undefined).
                const statusComp2 = envRec.InitializeBinding(paramName,new JSUndefined());
                if (!(statusComp2 instanceof NormalCompletion))
                    throw new Error("statusComp2 should not be an abrupt completion");
            }

            // iii. Assert: status is never an abrupt completion for either of the above operations.
            // (done above)
        }
    }

    // 22. If argumentsObjectNeeded is true, then
    if (argumentsObjectNeeded) {
        // TODO
        // a. If strict is true or if simpleParameterList is false, then
            // i. Let ao be CreateUnmappedArgumentsObject(argumentsList).
        // b. Else,
            // i. NOTE mapped argument object is only provided for non-strict functions that don’t have a rest parameter, any parameter default value initializers, or any destructured parameters .
            // ii. Let ao be CreateMappedArgumentsObject(func, formals, argumentsList, env).
        // c. ReturnIfAbrupt(ao).
        // d. If strict is true, then
            // i. Let status be envRec.CreateImmutableBinding("arguments").
        // e. Else,
            // i. Let status be envRec.CreateMutableBinding("arguments").
        // f. Assert: status is never an abrupt completion.
        // g. Call envRec.InitializeBinding("arguments", ao).
        // h. Append "arguments" to parameterNames.
    }

    // TODO: Steps 23 - 26
    // 23. Let iteratorRecord be Record {[[iterator]]: CreateListIterator(argumentsList), [[done]]: false}.
    // 24. If hasDuplicates is true, then
        // a. Let formalStatus be IteratorBindingInitialization for formals with iteratorRecord and undefined as arguments.
    // 25. Else,
        // a. Let formalStatus be IteratorBindingInitialization for formals with iteratorRecord and env as arguments.
    // 26. ReturnIfAbrupt(formalStatus).

    // FIXME: This is a temporary solution to get arguments bound, but only supports basic
    // parameters with no initializers
    const iterator = new ValueIterator(argumentsList);
    formals.iteratorBindingInitialization(iterator,env);

    let varEnv: LexicalEnvironment;
    let varEnvRec: EnvironmentRecord;
    let lexEnv: LexicalEnvironment;
    let lexEnvRec: EnvironmentRecord;

    // 27. If hasParameterExpressions is false, then
    if (!hasParameterExpressions) {
        // a. NOTE Only a single lexical environment is needed for the parameters and top-level vars.

        // b. Let instantiatedVarNames be a copy of the List parameterNames.
        const instantiatedVarNames = parameterNames.slice();

        // c. For each n in varNames, do
        for (const n of varNames) {
            // i. If n is not an element of instantiatedVarNames, then
            if (instantiatedVarNames.indexOf(n) < 0) {
                // 1. Append n to instantiatedVarNames.
                instantiatedVarNames.push(n);

                // 2. Let status be envRec.CreateMutableBinding(n).
                const statusComp = envRec.CreateMutableBinding(n,false);

                // 3. Assert: status is never an abrupt completion.
                if (!(statusComp instanceof NormalCompletion))
                    throw new Error("Assertion failure: statusComp should not be an abrupt completion");

                // 4. Call envRec.InitializeBinding(n, undefined).
                const initComp = envRec.InitializeBinding(n,new JSUndefined());
                if (!(initComp instanceof NormalCompletion))
                    return initComp;
            }
        }

        // d. Let varEnv be env.
        varEnv = env;

        // e. Let varEnvRec be envRec.
        varEnvRec = envRec;
    }
    // 28. Else,
    else {
        // a. NOTE A separate Environment Record is needed to ensure that closures created by
        // expressions in the formal parameter list do not have visibility of declarations in the function body.

        // b. Let varEnv be NewDeclarativeEnvironment(env).
        varEnv = NewDeclarativeEnvironment(realm,env);

        // c. Let varEnvRec be varEnv’s EnvironmentRecord.
        varEnvRec = varEnv.record;

        // TODO
        throw new Error("Functions with parameter expressions not implemented");
        // d. Set the VariableEnvironment of calleeContext to varEnv.
        // e. Let instantiatedVarNames be a new empty List.
        // f. For each n in varNames, do
            // i. If n is not an element of instantiatedVarNames, then
                // 1. Append n to instantiatedVarNames.
                // 2. Let status be varEnvRec.CreateMutableBinding(n).
                // 3. Assert: status is never an abrupt completion.
                // 4. If n is not an element of parameterNames or if n is an element of functionNames, let initialValue be undefined.
                // 5. else,
                    // a. Let initialValue be envRec.GetBindingValue(n, false).
                    // b. ReturnIfAbrupt(initialValue).
                // 6. Call varEnvRec.InitializeBinding(n, initialValue).
                // 7. NOTE vars whose names are the same as a formal parameter, initially have the same value as the corresponding initialized parameter.
    }

    // 29. NOTE: Annex B.3.3 adds additional steps at this point.

    // 30. If strict is false, then
    if (!strict) {
        // a. Let lexEnv be NewDeclarativeEnvironment(varEnv).
        lexEnv = NewDeclarativeEnvironment(realm,varEnv);
        // b. NOTE: Non-strict functions use a separate lexical Environment Record for top-level
        // lexical declarations so that a direct eval (see 12.3.4.1) can determine whether any var
        // scoped declarations introduced by the eval code conflict with pre-existing top-level
        // lexically scoped declarations. This is not needed for strict functions because a strict
        // direct eval always places all declarations into a new Environment Record.
    }
    // 31. Else, let lexEnv be varEnv.
    else {
        lexEnv = varEnv;
    }

    // 32. Let lexEnvRec be lexEnv’s EnvironmentRecord.
    lexEnvRec = lexEnv.record;

    // 33. Set the LexicalEnvironment of calleeContext to lexEnv.
    calleeContext.lexicalEnvironment = lexEnv;

    // 34. Let lexDeclarations be the LexicallyScopedDeclarations of code.
    const lexDeclarations: LexicallyScopedDeclaration[] = [];
    code.lexicallyScopedDeclarations(lexDeclarations);

    // 35. For each element d in lexDeclarations do
    for (const d of lexDeclarations) {
        // a. NOTE A lexically declared name cannot be the same as a function/generator declaration,
        // formal parameter, or a var name. Lexically declared names are only instantiated here but
        // not initialized.

        // b. For each element dn of the BoundNames of d do
        const boundNames: string[] = [];
        d.boundNames(boundNames);
        for (const dn of boundNames) {
            // i. If IsConstantDeclaration of d is true, then
            if (d.isConstantDeclaration()) {
                // 1. Let status be lexEnvRec.CreateImmutableBinding(dn, true).
                const statusComp = lexEnvRec.CreateImmutableBinding(dn,true);
                if (!(statusComp instanceof NormalCompletion))
                    return statusComp;
            }
            // ii. Else,
            else {
                // 1. Let status be lexEnvRec.CreateMutableBinding(dn, false).
                const statusComp = lexEnvRec.CreateMutableBinding(dn,false);
                if (!(statusComp instanceof NormalCompletion))
                    return statusComp;
            }
        }

        // c. Assert: status is never an abrupt completion.
        // TODO
    }

    // 36. For each parsed grammar phrase f in functionsToInitialize, do
    for (const f of functionsToInitialize) {
    // TODO...
        // a. Let fn be the sole element of the BoundNames of f.
        if (f.ident == null) {
            throw new Error("Expected function to have an identifier");
        }
        const fn = f.ident.value;

        // b. Let fo be the result of performing InstantiateFunctionObject for f with argument lexEnv.
        const foComp = f.instantiateFunctionObject(realm, lexEnv);
        if (!(foComp instanceof NormalCompletion))
            return foComp;
        const fo = foComp.value;

        // c. Let status be varEnvRec.SetMutableBinding(fn, fo, false).
        const statusComp = varEnvRec.SetMutableBinding(fn,fo,false);

        // d. Assert: status is never an abrupt completion.
        if (!(statusComp instanceof NormalCompletion)) {
            throw new Error("SetMutableBinding returned an abrupt completion");
        }
    }

    // 37. Return NormalCompletion(empty).
    return new NormalCompletion(new Empty());
}

function haveDuplicateNames(names: string[]): boolean {
    for (let a = 0; a < names.length; a++) {
        for (let b = a+1; b < names.length; b++) {
            if (names[a] === names[b])
                return true;
        }
    }
    return false;
}
