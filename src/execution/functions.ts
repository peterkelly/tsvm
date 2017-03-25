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
    Range,
    ASTNode,
    ExpressionNode,
    DeclarationNode,
    VarScopedDeclaration,
    LexicallyScopedDeclaration,
    HoistableDeclarationNode,
    BindingIdentifierNode,
    check,
    CannotConvertError,
} from "../parser/ast";
import {
    Precedence,
    ExpressionNode_fromGeneric,
    PropertyNameType,
    evaluatePropertyName,
} from "./expressions";
import {
    StatementListNode,
    BindingElementType,
    BindingRestElementNode,
} from "./statements";
import {
    Empty,
    Completion,
    NormalCompletion,
    Reference,
    JSValue,
    JSUndefined,
    JSPropertyKey,
    JSString,
    JSObject,
    LexicalEnvironment,
    Realm,
    ValueIterator,
    DataDescriptor,
    AccessorDescriptor,
} from "../runtime/datatypes";
import {
    DefinePropertyOrThrow,
} from "../runtime/07-03-objects";
import {
    ExecutionContext,
} from "../runtime/08-03-context";
import {
    InitializeKind,
    FunctionCreate,
    MakeConstructor,
    MakeMethod,
    SetFunctionName,
} from "../runtime/09-02-function";

// ES6 Section 14.1.3 Static Semantics: BoundNames
// "*default*" is used within this specification as a synthetic name for hoistable anonymous
// functions that are defined using export declarations.
export const DEFAULT_FUNCTION_NAME = "*default*";

export type FormalParameterListItemType = BindingElementType | BindingRestElementNode;
export const FormalParameterListItemType = {
    fromGeneric(node: ASTNode | null): FormalParameterListItemType {
        try { return BindingElementType.fromGeneric(node); } catch (e) {}
        try { return BindingRestElementNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("FormalParameterListItemType",node);
    }
};

export abstract class ClassElementNode extends ASTNode {
    public _type_ClassElementNode: any;

    public static fromGeneric(node: ASTNode | null): ClassElementNode {
        if (node === null)
            throw new CannotConvertError("ClassElementNode",node);
        switch (node.kind) {
            case "Method":
            case "Getter":
            case "Setter":
            case "GeneratorMethod":
                return MethodDefinitionNode.fromGeneric(node);
            case "StaticMethodDefinition":
                return StaticMethodDefinitionNode.fromGeneric(node);
            case "EmptyClassElement":
                return EmptyClassElementNode.fromGeneric(node);
            default:
                throw new CannotConvertError("ClassElementNode",node);
        }
    }
}

// ES6 Chapter 14: ECMAScript Language: Functions and Classes

// ES6 Section 14.1: Function Definitions

export class FormalParameterListNode extends ASTNode {
    public _type_FormalParameterListNode: any;
    public readonly elements: FormalParameterListItemType[];

    public constructor(range: Range, elements: FormalParameterListItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 14.1.3 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        for (const element of this.elements)
            element.boundNames(out);
    }

    // ES6 Section 14.1.5 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        // FormalsList : FormalsList , FormalParameter
        // 1. If ContainsExpression of FormalsList is true, return true.
        // 2. Return ContainsExpression of FormalParameter.
        for (const element of this.elements) {
            if (element.containsExpression())
                return true;
        }
        return false;
    }

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // FormalsList : FormalsList , FormalParameter
        // 1. If IsSimpleParameterList of FormalsList is false, return false.
        // 2. Return IsSimpleParameterList of FormalParameter.
        for (const element of this.elements) {
            if (!element.isSimpleParameterList())
                return false;
        }
        return true;
    }

    // ES6 Section 14.1.18 Runtime Semantics: IteratorBindingInitialization
    public iteratorBindingInitialization(iterator: ValueIterator, env: LexicalEnvironment): Completion<void> {
        // TODO: This is just a quick-and-dirty implementation that only handles BindingIdnetifiers
        for (const element of this.elements) {
            if (element instanceof BindingIdentifierNode) {
                const value = iterator.next();
                if (value === null)
                    env.record.InitializeBinding(element.value,new JSUndefined());
                else
                    env.record.InitializeBinding(element.value,value);
            }
        }
        return new NormalCompletion(undefined);
    }

    public prettyPrint(prefix: string, indent: string, output: string[]) {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            if (!(element instanceof BindingIdentifierNode)) {
                throw new Error("Pretty printing non-identifier parameters not supported");
            }
            output.push(element.value);
            if (i+1 < this.elements.length)
                output.push(",");
        }
    }

    public static fromGeneric(node: ASTNode | null): FormalParameterListNode {
        const list = check.list(node);
        const elements: FormalParameterListItemType[] = [];
        for (const listElement of list.elements)
            elements.push(FormalParameterListItemType.fromGeneric(listElement));
        return new FormalParameterListNode(list.range,elements);
    }
}

// This class exists to get around the fact that we don't actually represent the
// FunctionStatementList grammar production in the AST, instead directly referencing a
// StatementListNode from the function declaration classes. Certain algorithms must behave
// differently for the former however, and where these need to be used, an instance of this
// class should be created to get the right behaviour.
export class FunctionStatementList {
    public _type_FunctionStatementList: any;
    public statements: StatementListNode;

    public constructor(statements: StatementListNode) {
        this.statements = statements;
    }

    // ES6 Section 14.1.13: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        this.statements.topLevelLexicallyDeclaredNames(out);
    }

    // ES6 Section 14.1.14: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        this.statements.topLevelLexicallyScopedDeclarations(out);
    }

    // ES6 Section 14.1.15: Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.statements.topLevelVarDeclaredNames(out);
    }

    // ES6 Section 14.1.16: Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.statements.topLevelVarScopedDeclarations(out);
    }
}

export class FunctionDeclarationNode extends HoistableDeclarationNode implements VarScopedDeclaration {
    public _type_FunctionDeclarationNode: any;
    public _interface_VarScopedDeclaration: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
        body: StatementListNode
    ) {
        super(range,"FunctionDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }

    // ES6 Section 13.13.13 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    // ES6 Section 14.1.3: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        if (this.ident != null)
            this.ident.boundNames(out);
        else
            out.push(DEFAULT_FUNCTION_NAME);
    }

    // ES6 Section 14.1.10: Static Semantics: IsConstantDeclaration
    public isConstantDeclaration(): boolean {
        return false;
    }

    // ES6 Section 14.1.19 Runtime Semantics: InstantiateFunctionObject
    public instantiateFunctionObject(realm: Realm, scope: LexicalEnvironment): Completion<JSObject> {
        if (this.ident != null) {
            // 1. If the function code for FunctionDeclaration is strict mode code, let strict be true.
            // Otherwise let strict be false.
            // TODO: Not sure how to determine this. Do we need to look at the body and check for
            // a "use strict" directive?
            const strict = true;

            // 2. Let name be StringValue of BindingIdentifier.
            const name = this.ident.value;

            // 3. Let F be FunctionCreate(Normal, FormalParameters, FunctionBody, scope, strict).
            const FComp = FunctionCreate(realm,InitializeKind.Normal,this.params,this.body,scope,strict);
            if (!(FComp instanceof NormalCompletion))
                return FComp;
            const F = FComp.value;

            // 4. Perform MakeConstructor(F).
            const makeComp = MakeConstructor(realm,F); // this function returns void
            if (!(makeComp instanceof NormalCompletion))
                return makeComp;

            // 5. Perform SetFunctionName(F, name).
            const setComp = SetFunctionName(realm,F,new JSString(name));
            if (!(setComp instanceof NormalCompletion))
                return setComp;

            // 6. Return F.
            return new NormalCompletion(F);
        }
        else {
            // 1. If the function code for FunctionDeclaration is strict mode code, let strict be true.
            // Otherwise let strict be false.
            // TODO: Not sure how to determine this. Do we need to look at the body and check for
            // a "use strict" directive?
            const strict = true;

            // 2. Let F be FunctionCreate(Normal, FormalParameters, FunctionBody, scope, strict).
            const FComp = FunctionCreate(realm,InitializeKind.Normal,this.params,this.body,scope,strict);
            if (!(FComp instanceof NormalCompletion))
                return FComp;
            const F = FComp.value;

            // 3. Perform MakeConstructor(F).
            const makeComp = MakeConstructor(realm,F); // this function returns void
            if (!(makeComp instanceof NormalCompletion))
                return makeComp;

            // 4. Perform SetFunctionName(F, "default").
            const setComp = SetFunctionName(realm,F,new JSString("default"));
            if (!(setComp instanceof NormalCompletion))
                return setComp;

            // 5. Return F.
            return new NormalCompletion(F);
        }
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // 1. Return NormalCompletion(empty).
        return new NormalCompletion(new Empty());
    }

    public prettyPrint(prefix: string, indent: string, output: string[]) {
        if (this.ident != null)
            output.push(prefix+"function "+this.ident.value+"(");
        else
            output.push(prefix+"function(\n");
        this.params.prettyPrint("","",output);
        output.push(") {\n");
        this.body.prettyPrint(indent+"    ",indent+"    ",output);
        output.push(indent+"}\n");
    }

    public static fromGeneric(node: ASTNode | null): FunctionDeclarationNode {
        node = check.node(node,"FunctionDeclaration",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new FunctionDeclarationNode(node.range,ident,params,body);
    }
}

export class FunctionExpressionNode extends ExpressionNode {
    public _type_FunctionExpressionNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
        body: StatementListNode
    ) {
        super(range,"FunctionExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }

    public get precedence(): number {
        return Precedence.Primary;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("FunctionExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): FunctionExpressionNode {
        node = check.node(node,"FunctionExpression",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new FunctionExpressionNode(node.range,ident,params,body);
    }
}

export abstract class FormalParametersNode extends ASTNode {
    public _type_FormalParametersNode: any;

    // ES6 Section 14.1.3 Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    // ES6 Section 14.1.5 Static Semantics: ContainsExpression
    public abstract containsExpression(): boolean;

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public abstract isSimpleParameterList(): boolean;

    // ES6 Section 14.1.18 Runtime Semantics: IteratorBindingInitialization
    public abstract iteratorBindingInitialization(iterator: ValueIterator, env: LexicalEnvironment): Completion<void>;

    public static fromGeneric(node: ASTNode | null): FormalParametersNode {
        if (node === null)
            throw new CannotConvertError("FormalParametersNode",node);
        switch (node.kind) {
            case "FormalParameters1":
                return FormalParameters1Node.fromGeneric(node);
            case "FormalParameters2":
                return FormalParameters2Node.fromGeneric(node);
            case "FormalParameters3":
                return FormalParameters3Node.fromGeneric(node);
            case "FormalParameters4":
                return FormalParameters4Node.fromGeneric(node);
            default:
                throw new CannotConvertError("FormalParametersNode",node);
        }
    }
}

export class FormalParameters1Node extends FormalParametersNode {
    public _type_FormalParameters1Node: any;

    public constructor(range: Range) {
        super(range,"FormalParameters1");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    // ES6 Section 14.1.3 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        // No bound names for this node type
    }

    // ES6 Section 14.1.5 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        // FormalParameters : [empty]
        // 1. Return false.
        return false;
    }

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // FormalParameters : [empty]
        // 1. Return true.
        return true;
    }

    // ES6 Section 14.1.18 Runtime Semantics: IteratorBindingInitialization
    public iteratorBindingInitialization(iterator: ValueIterator, env: LexicalEnvironment): Completion<void> {
        return new NormalCompletion(undefined);
    }

    public prettyPrint(prefix: string, indent: string, output: string[]) {
        output.push(prefix);
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters1Node {
        node = check.node(node,"FormalParameters1",0);
        return new FormalParameters1Node(node.range);
    }
}

export class FormalParameters2Node extends FormalParametersNode {
    public _type_FormalParameters2Node: any;
    public readonly rest: BindingRestElementNode;

    public constructor(range: Range, rest: BindingRestElementNode) {
        super(range,"FormalParameters2");
        this.rest = rest;
    }

    public get children(): (ASTNode | null)[] {
        return [this.rest];
    }

    // ES6 Section 14.1.3 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.rest.boundNames(out);
    }

    // ES6 Section 14.1.5 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        // FormalParameterList : FunctionRestParameter
        // 1. Return false.
        return false;
    }

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // FormalParameterList : FunctionRestParameter
        // 1. Return false.
        return false;
    }

    // ES6 Section 14.1.18 Runtime Semantics: IteratorBindingInitialization
    public iteratorBindingInitialization(iterator: ValueIterator, env: LexicalEnvironment): Completion<void> {
        throw new Error("FormalParameters2Node.iteratorBindingInitialization not implemented");
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters2Node {
        node = check.node(node,"FormalParameters2",1);
        const rest = BindingRestElementNode.fromGeneric(node.children[0]);
        return new FormalParameters2Node(node.range,rest);
    }
}

export class FormalParameters3Node extends FormalParametersNode {
    public _type_FormalParameters3Node: any;
    public readonly elements: FormalParameterListNode;

    public constructor(range: Range, elements: FormalParameterListNode) {
        super(range,"FormalParameters3");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return [this.elements];
    }

    // ES6 Section 14.1.3 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.elements.boundNames(out);
    }

    // ES6 Section 14.1.5 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        // FormalsList : FormalsList , FormalParameter
        // 1. If ContainsExpression of FormalsList is true, return true.
        // 2. Return ContainsExpression of FormalParameter.
        return this.elements.containsExpression();
    }

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // FormalsList : FormalsList , FormalParameter
        // 1. If IsSimpleParameterList of FormalsList is false, return false.
        // 2. Return IsSimpleParameterList of FormalParameter.
        return this.elements.isSimpleParameterList();
    }

    // ES6 Section 14.1.18 Runtime Semantics: IteratorBindingInitialization
    public iteratorBindingInitialization(iterator: ValueIterator, env: LexicalEnvironment): Completion<void> {
        return this.elements.iteratorBindingInitialization(iterator,env);
    }

    public prettyPrint(prefix: string, indent: string, output: string[]) {
        this.elements.prettyPrint("",indent,output);
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters3Node {
        node = check.node(node,"FormalParameters3",1);
        const elements = FormalParameterListNode.fromGeneric(node.children[0]);
        return new FormalParameters3Node(node.range,elements);
    }
}

export class FormalParameters4Node extends FormalParametersNode {
    public _type_FormalParameters4Node: any;
    public readonly elements: FormalParameterListNode;
    public readonly rest: BindingRestElementNode;

    public constructor(range: Range, elements: FormalParameterListNode, rest: BindingRestElementNode) {
        super(range,"FormalParameters4");
        this.elements = elements;
        this.rest = rest;
    }

    public get children(): (ASTNode | null)[] {
        return [this.elements,this.rest];
    }

    // ES6 Section 14.1.3 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.elements.boundNames(out);
        this.rest.boundNames(out);
    }

    // ES6 Section 14.1.5 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        // FormalParameterList : FormalsList , FunctionRestParameter
        // 1. Return ContainsExpression of FormalsList.
        return this.elements.containsExpression();
    }

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // FormalParameterList : FormalsList , FunctionRestParameter
        // 1. Return false.
        return false;
    }

    // ES6 Section 14.1.18 Runtime Semantics: IteratorBindingInitialization
    public iteratorBindingInitialization(iterator: ValueIterator, env: LexicalEnvironment): Completion<void> {
        throw new Error("FormalParameters4Node.iteratorBindingInitialization not implemented");
    }

    public static fromGeneric(node: ASTNode | null): FormalParameters4Node {
        node = check.node(node,"FormalParameters4",2);
        const elements = FormalParameterListNode.fromGeneric(node.children[0]);
        const rest = BindingRestElementNode.fromGeneric(node.children[1]);
        return new FormalParameters4Node(node.range,elements,rest);
    }
}

// ES6 Section 14.2: Arrow Function Definitions

type ArrowFunctionParamsType = BindingIdentifierNode | FormalParametersNode;
const ArrowFunctionParamsType = {
    fromGeneric(node: ASTNode | null): ArrowFunctionParamsType {
        try { return BindingIdentifierNode.fromGeneric(node); } catch (e) {}
        try { return FormalParametersNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArrowFunctionParamsType",node);
    }
};

type ArrowFunctionBodyType = ExpressionNode | StatementListNode;
const ArrowFunctionBodyType = {
    fromGeneric(node: ASTNode | null): ArrowFunctionBodyType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return StatementListNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArrowFunctionBodyType",node);
    }
};

export class ArrowFunctionNode extends ExpressionNode {
    public _type_ArrowFunctionNode: any;
    public readonly params: ArrowFunctionParamsType;
    public readonly body: ArrowFunctionBodyType;

    public level(): number { return 2; }

    public prettyPrintExpr(outerPrecedence: number, indent: string, output: string[]): void {
        let prec = this.precedence;
        if (this.precedence < outerPrecedence) {
            output.push("(");
            prec = 0;
        }

        output.push("(");
        this.params.prettyPrint("",indent,output);
        output.push(") => ");
        if (this.body instanceof StatementListNode) {
            output.push("{\n");
            this.body.prettyPrint(indent,indent,output);
            output.push("}");
        }
        else {
            this.body.prettyPrintExpr(0,indent,output);
        }

        if (this.precedence < outerPrecedence)
            output.push(")");
    }

    public constructor(
        range: Range,
        params: ArrowFunctionParamsType,
        body: ArrowFunctionBodyType
    ) {
        super(range,"ArrowFunction");
        this.params = params;
        this.body = body;
    }

    public get precedence(): number {
        return Precedence.Assignment;
    }

    public get children(): (ASTNode | null)[] {
        return [this.params,this.body];
    }

    // ES6 Section 14.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.params.boundNames(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ArrowFunctionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ArrowFunctionNode {
        node = check.node(node,"ArrowFunction",2);
        const params = ArrowFunctionParamsType.fromGeneric(node.children[0]);
        const body = ArrowFunctionBodyType.fromGeneric(node.children[1]);
        return new ArrowFunctionNode(node.range,params,body);
    }
}

// ES6 Section 14.3: Method Definitions

export abstract class MethodDefinitionNode extends ClassElementNode {
    public _type_MethodDefinitionNode: any;

    // ES6 Section 14.3.9: Runtime Semantics: PropertyDefinitionEvaluation
    public abstract propertyDefinitionEvaluation(ctx: ExecutionContext, object: JSObject, enumerable: boolean): Completion<boolean>;

    public static fromGeneric(node: ASTNode | null): MethodDefinitionNode {
        if (node === null)
            throw new CannotConvertError("MethodDefinitionNode",node);
        switch (node.kind) {
            case "Method":
                return MethodNode.fromGeneric(node);
            case "Getter":
                return GetterNode.fromGeneric(node);
            case "Setter":
                return SetterNode.fromGeneric(node);
            case "GeneratorMethod":
                return GeneratorMethodNode.fromGeneric(node);
            default:
                throw new CannotConvertError("MethodDefinitionNode",node);
        }
    }
}

export interface DefineMethodResult {
    key: JSPropertyKey;
    closure: JSObject;
}

export class MethodNode extends MethodDefinitionNode {
    public _type_MethodNode: any;
    public readonly name: PropertyNameType;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        name: PropertyNameType,
        params: FormalParametersNode,
        body: StatementListNode
    ) {
        super(range,"Method");
        this.name = name;
        this.params = params;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.params,this.body];
    }

    // ES6 Section 14.3.8: Runtime Semantics: DefineMethod
    public defineMethod(ctx: ExecutionContext, object: JSObject, functionPrototype?: JSObject): Completion<DefineMethodResult> {
        // 1. Let propKey be the result of evaluating PropertyName.
        const propKeyComp = evaluatePropertyName(ctx,this.name);

        // 2. ReturnIfAbrupt(propKey).
        if (!(propKeyComp instanceof NormalCompletion))
            return propKeyComp;
        const propKey = propKeyComp.value;

        // 3. If the function code for this MethodDefinition is strict mode code, let strict be true. Otherwise let strict be false.
        const strict = this.strict;

        // 4. Let scope be the running execution context’s LexicalEnvironment.
        const scope = ctx.lexicalEnvironment;

        // 5. If functionPrototype was passed as a parameter, let kind be Normal; otherwise let kind be Method.
        const kind = (functionPrototype !== undefined) ? InitializeKind.Normal : InitializeKind.Method;

        // 6. Let closure be FunctionCreate(kind, StrictFormalParameters, FunctionBody, scope, strict).
        // If functionPrototype was passed as a parameter then pass its value as the functionPrototype
        // optional argument of FunctionCreate.
        const closureComp = FunctionCreate(ctx.realm,kind,this.params,this.body,scope,strict,functionPrototype);
        if (!(closureComp instanceof NormalCompletion))
            return closureComp;
        const closure = closureComp.value;

        // 7. Perform MakeMethod(closure, object).
        MakeMethod(closure,object);

        // 8. Return the Record{[[key]]: propKey, [[closure]]: closure}.
        return new NormalCompletion({ key: propKey, closure: closure });
    }

    // ES6 Section 14.3.9: Runtime Semantics: PropertyDefinitionEvaluation
    public propertyDefinitionEvaluation(ctx: ExecutionContext, object: JSObject, enumerable: boolean): Completion<boolean> {
        // 1. Let methodDef be DefineMethod of MethodDefinition with argument object.
        const methodDefComp = this.defineMethod(ctx,object);

        // 2. ReturnIfAbrupt(methodDef).
        if (!(methodDefComp instanceof NormalCompletion))
            return methodDefComp;
        const methodDef = methodDefComp.value;

        // 3. Perform SetFunctionName(methodDef.[[closure]], methodDef.[[key]]).
        const nameComp = SetFunctionName(ctx.realm,methodDef.closure,methodDef.key);
        if (!(nameComp instanceof NormalCompletion))
            return nameComp;

        // 4. Let desc be the Property Descriptor{[[Value]]: methodDef.[[closure]], [[Writable]]:
        // true, [[Enumerable]]: enumerable, [[Configurable]]: true}.
        const desc = new DataDescriptor({
            value: methodDef.closure,
            writable: true,
            enumerable: enumerable,
            configurable: true,
        });

        // 5. Return DefinePropertyOrThrow(object, methodDef.[[key]], desc).
        return DefinePropertyOrThrow(ctx.realm,object,methodDef.key,desc);
    }

    public static fromGeneric(node: ASTNode | null): MethodNode {
        node = check.node(node,"Method",3);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new MethodNode(node.range,name,params,body);
    }
}

export class GetterNode extends MethodDefinitionNode {
    public _type_GetterNode: any;
    public readonly name: PropertyNameType;
    public readonly body: StatementListNode;

    public constructor(range: Range, name: PropertyNameType, body: StatementListNode) {
        super(range,"Getter");
        this.name = name;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.body];
    }

    // ES6 Section 14.3.9: Runtime Semantics: PropertyDefinitionEvaluation
    public propertyDefinitionEvaluation(ctx: ExecutionContext, object: JSObject, enumerable: boolean): Completion<boolean> {
        // 1. Let propKey be the result of evaluating PropertyName.
        const propKeyComp = evaluatePropertyName(ctx,this.name);

        // 2. ReturnIfAbrupt(propKey).
        if (!(propKeyComp instanceof NormalCompletion))
            return propKeyComp;
        const propKey = propKeyComp.value;

        // 3. If the function code for this MethodDefinition is strict mode code, let strict be true. Otherwise let strict be false.
        const strict = this.body.strict;

        // 4. Let scope be the running execution context’s LexicalEnvironment.
        const scope = ctx.lexicalEnvironment;

        // 5. Let formalParameterList be the production FormalParameters : [empty]
        const formalParameterList = new FormalParameters1Node(new Range(0,0));

        // 6. Let closure be FunctionCreate(Method, formalParameterList, FunctionBody, scope, strict).
        const closureComp = FunctionCreate(ctx.realm,InitializeKind.Method,formalParameterList,this.body,scope,strict);
        if (!(closureComp instanceof NormalCompletion))
            return closureComp;
        const closure = closureComp.value;

        // 7. Perform MakeMethod(closure, object).
        MakeMethod(closure,object);

        // 8. Perform SetFunctionName(closure, propKey, "get").
        const setComp = SetFunctionName(ctx.realm,closure,propKey,"get");
        if (!(setComp instanceof NormalCompletion))
            return setComp;

        // 9. Let desc be the PropertyDescriptor{[[Get]]: closure, [[Enumerable]]: enumerable, [[Configurable]]: true}
        const desc = new AccessorDescriptor({
            enumerable: enumerable,
            configurable: true,
            __get__: closure,
            __set__: new JSUndefined(),
        });

        // 10. Return DefinePropertyOrThrow(object, propKey, desc).
        return DefinePropertyOrThrow(ctx.realm,object,propKey,desc);
    }

    public static fromGeneric(node: ASTNode | null): GetterNode {
        node = check.node(node,"Getter",2);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const body = StatementListNode.fromGeneric(node.children[1]);
        return new GetterNode(node.range,name,body);
    }
}

export class SetterNode extends MethodDefinitionNode {
    public _type_SetterNode: any;
    public readonly name: PropertyNameType;
    public readonly param: BindingElementType;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        name: PropertyNameType,
        param: BindingElementType,
        body: StatementListNode
    ) {
        super(range,"Setter");
        this.name = name;
        this.param = param;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.param,this.body];
    }

    // ES6 Section 14.3.9: Runtime Semantics: PropertyDefinitionEvaluation
    public propertyDefinitionEvaluation(ctx: ExecutionContext, object: JSObject, enumerable: boolean): Completion<boolean> {
        // 1. Let propKey be the result of evaluating PropertyName.
        const propKeyComp = evaluatePropertyName(ctx,this.name);

        // 2. ReturnIfAbrupt(propKey).
        if (!(propKeyComp instanceof NormalCompletion))
            return propKeyComp;
        const propKey = propKeyComp.value;

        // 3. If the function code for this MethodDefinition is strict mode code, let strict be true. Otherwise let strict be false.
        const strict = this.body.strict;

        // 4. Let scope be the running execution context’s LexicalEnvironment.
        const scope = ctx.lexicalEnvironment;

        // 5. Let closure be FunctionCreate(Method, PropertySetParameterList, FunctionBody, scope, strict).
        const list = new FormalParameterListNode(this.name.range,[this.param]);
        const params = new FormalParameters3Node(list.range,list);
        const closureComp = FunctionCreate(ctx.realm,InitializeKind.Method,params,this.body,scope,strict);
        if (!(closureComp instanceof NormalCompletion))
            return closureComp;
        const closure = closureComp.value;

        // 6. Perform MakeMethod(closure, object).
        MakeMethod(closure,object);

        // 7. Perform SetFunctionName(closure, propKey, "set").
        const setComp = SetFunctionName(ctx.realm,closure,propKey,"set");
        if (!(setComp instanceof NormalCompletion))
            return setComp;

        // 8. Let desc be the PropertyDescriptor{[[Set]]: closure, [[Enumerable]]: enumerable, [[Configurable]]: true}
        const desc = new AccessorDescriptor({
            enumerable: enumerable,
            configurable: true,
            __get__: new JSUndefined(),
            __set__: closure,
        });

        // 9. Return DefinePropertyOrThrow(object, propKey, desc).
        return DefinePropertyOrThrow(ctx.realm,object,propKey,desc);
    }

    public static fromGeneric(node: ASTNode | null): SetterNode {
        node = check.node(node,"Setter",3);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const param = BindingElementType.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new SetterNode(node.range,name,param,body);
    }
}

// ES6 Section 14.4: Generator Function Definitions

export class GeneratorMethodNode extends MethodDefinitionNode {
    public _type_GeneratorMethodNode: any;
    public readonly name: PropertyNameType;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        name: PropertyNameType,
        params: FormalParametersNode,
        body: StatementListNode
    ) {
        super(range,"GeneratorMethod");
        this.name = name;
        this.params = params;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.params,this.body];
    }

    // ES6 Section 14.4.13: Runtime Semantics: PropertyDefinitionEvaluation
    public propertyDefinitionEvaluation(ctx: ExecutionContext, object: JSObject, enumerable: boolean): Completion<boolean> {
        throw new Error("GeneratorMethodNode.propertyDefinitionEvaluation() not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GeneratorMethodNode {
        node = check.node(node,"GeneratorMethod",3);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new GeneratorMethodNode(node.range,name,params,body);
    }
}

export class GeneratorDeclarationNode extends HoistableDeclarationNode implements VarScopedDeclaration {
    public _type_GeneratorDeclarationNode: any;
    public _interface_VarScopedDeclaration: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
        body: StatementListNode
    ) {
        super(range,"GeneratorDeclaration");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }

    // ES6 Section 14.4.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        if (this.ident != null)
            this.ident.boundNames(out);
        else
            out.push(DEFAULT_FUNCTION_NAME);
    }

    // ES6 Section 14.4.8: Static Semantics: IsConstantDeclaration
    public isConstantDeclaration(): boolean {
        return false;
    }

    // ES6 Section 14.4.12 Runtime Semantics: InstantiateFunctionObject
    public instantiateFunctionObject(realm: Realm, scope: LexicalEnvironment): Completion<JSObject> {
        throw new Error("GeneratorDeclarationNode.instantiateFunctionObject not implemented");
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("GeneratorDeclarationNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GeneratorDeclarationNode {
        node = check.node(node,"GeneratorDeclaration",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new GeneratorDeclarationNode(node.range,ident,params,body);
    }
}

export class GeneratorExpressionNode extends ExpressionNode {
    public _type_GeneratorExpressionNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly params: FormalParametersNode;
    public readonly body: StatementListNode;

    public constructor(
        range: Range,
        ident: BindingIdentifierNode | null,
        params: FormalParametersNode,
        body: StatementListNode
    ) {
        super(range,"GeneratorExpression");
        this.ident = ident;
        this.params = params;
        this.body = body;
    }

    public get precedence(): number {
        return Precedence.Primary;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.params,this.body];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("GeneratorExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GeneratorExpressionNode {
        node = check.node(node,"GeneratorExpression",3);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const params = FormalParametersNode.fromGeneric(node.children[1]);
        const body = StatementListNode.fromGeneric(node.children[2]);
        return new GeneratorExpressionNode(node.range,ident,params,body);
    }
}

export class YieldExprNode extends ExpressionNode {
    public _type_YieldExprNode: any;
    public readonly expr: ExpressionNode;

    public level(): number { return 2; }

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"YieldExpr");
        this.expr = expr;
    }

    public get precedence(): number {
        return Precedence.Assignment;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("YieldExprNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): YieldExprNode {
        node = check.node(node,"YieldExpr",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new YieldExprNode(node.range,expr);
    }
}

export class YieldStarNode extends ExpressionNode {
    public _type_YieldStarNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"YieldStar");
        this.expr = expr;
    }

    public get precedence(): number {
        return Precedence.Assignment;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("YieldStarNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): YieldStarNode {
        node = check.node(node,"YieldStar",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new YieldStarNode(node.range,expr);
    }
}

export class YieldNothingNode extends ExpressionNode {
    public _type_YieldNothingNode: any;

    public constructor(range: Range) {
        super(range,"YieldNothing");
    }

    public get precedence(): number {
        return Precedence.Assignment;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("YieldNothingNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): YieldNothingNode {
        node = check.node(node,"YieldNothing",0);
        return new YieldNothingNode(node.range);
    }
}

// ES6 Section 14.5: Class Definitions

export class ClassElementListNode extends ASTNode {
    public _type_ClassElementListNode: any;
    public readonly elements: ClassElementNode[];

    public constructor(range: Range, elements: ClassElementNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): ClassElementListNode {
        const list = check.list(node);
        const elements: ClassElementNode[] = [];
        for (const listElement of list.elements)
            elements.push(ClassElementNode.fromGeneric(listElement));
        return new ClassElementListNode(list.range,elements);
    }
}

export class ClassDeclarationNode extends DeclarationNode {
    public _type_ClassDeclarationNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly tail: ClassTailNode;

    public constructor(range: Range, ident: BindingIdentifierNode | null, tail: ClassTailNode) {
        super(range,"ClassDeclaration");
        this.ident = ident;
        this.tail = tail;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.tail];
    }

    // ES6 Section 14.5.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        if (this.ident != null)
            this.ident.boundNames(out);
        else
            out.push(DEFAULT_FUNCTION_NAME);
    }

    // ES6 Section 14.5.7: Static Semantics: IsConstantDeclaration
    public isConstantDeclaration(): boolean {
        return false;
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ClassDeclarationNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ClassDeclarationNode {
        node = check.node(node,"ClassDeclaration",2);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const tail = ClassTailNode.fromGeneric(node.children[1]);
        return new ClassDeclarationNode(node.range,ident,tail);
    }
}

export class ClassExpressionNode extends ExpressionNode {
    public _type_ClassExpressionNode: any;
    public readonly ident: BindingIdentifierNode | null;
    public readonly tail: ClassTailNode;

    public constructor(range: Range, ident: BindingIdentifierNode | null, tail: ClassTailNode) {
        super(range,"ClassExpression");
        this.ident = ident;
        this.tail = tail;
    }

    public get precedence(): number {
        return Precedence.Primary;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.tail];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ClassExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ClassExpressionNode {
        node = check.node(node,"ClassExpression",2);
        const ident = (node.children[0] === null) ? null : BindingIdentifierNode.fromGeneric(node.children[0]);
        const tail = ClassTailNode.fromGeneric(node.children[1]);
        return new ClassExpressionNode(node.range,ident,tail);
    }
}

export class ClassTailNode extends ASTNode {
    public _type_ClassTailNode: any;
    public readonly heritage: ExtendsNode | null;
    public readonly body: ClassElementListNode;

    public constructor(range: Range, heritage: ExtendsNode | null, body: ClassElementListNode) {
        super(range,"ClassTail");
        this.heritage = heritage;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.heritage,this.body];
    }

    public static fromGeneric(node: ASTNode | null): ClassTailNode {
        node = check.node(node,"ClassTail",2);
        const heritage = (node.children[0] === null) ? null : ExtendsNode.fromGeneric(node.children[0]);
        const body = ClassElementListNode.fromGeneric(node.children[1]);
        return new ClassTailNode(node.range,heritage,body);
    }
}

export class ExtendsNode extends ASTNode {
    public _type_ExtendsNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Extends");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public static fromGeneric(node: ASTNode | null): ExtendsNode {
        node = check.node(node,"Extends",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new ExtendsNode(node.range,expr);
    }
}

export class StaticMethodDefinitionNode extends ClassElementNode {
    public _type_StaticMethodDefinitionNode: any;
    public readonly method: MethodDefinitionNode;

    public constructor(range: Range, method: MethodDefinitionNode) {
        super(range,"StaticMethodDefinition");
        this.method = method;
    }

    public get children(): (ASTNode | null)[] {
        return [this.method];
    }

    public static fromGeneric(node: ASTNode | null): StaticMethodDefinitionNode {
        node = check.node(node,"StaticMethodDefinition",1);
        const method = MethodDefinitionNode.fromGeneric(node.children[0]);
        return new StaticMethodDefinitionNode(node.range,method);
    }
}

export class EmptyClassElementNode extends ClassElementNode {
    public _type_EmptyClassElementNode: any;

    public constructor(range: Range) {
        super(range,"EmptyClassElement");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public static fromGeneric(node: ASTNode | null): EmptyClassElementNode {
        node = check.node(node,"EmptyClassElement",0);
        return new EmptyClassElementNode(node.range);
    }
}

// ES6 Section 14.6: Tail Position Calls
