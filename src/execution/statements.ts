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
    StatementListItemNode,
    DeclarationNode,
    HoistableDeclarationNode,
    BindingIdentifierNode,
    GenericStringNode,
    check,
    CannotConvertError,
    VarScopedDeclaration,
    LexicallyScopedDeclaration,
} from "../parser/ast";
import {
    ExpressionNode_fromGeneric,
    PropertyNameType,
    ElisionNode,
} from "./expressions";
import {
    FunctionDeclarationNode,
    GeneratorDeclarationNode,
    ClassDeclarationNode,
} from "./functions";
import {
    JSValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    DataDescriptor,
    Intrinsics,
    Empty,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Reference,
    AbstractReference,
    PropertyReference,
    EnvironmentReference,
    Realm,
    LexicalEnvironment,
} from "../runtime/datatypes";
import {
    NewDeclarativeEnvironment,
} from "../runtime/08-01-environment";
import {
    ExecutionContext,
} from "../runtime/08-03-context";
import {
    GetValue,
    PutValue,
    InitializeReferencedBinding,
} from "../runtime/06-02-03-reference";

export function DeclarationNode_fromGeneric(node: ASTNode | null): DeclarationNode {
    if (node === null)
        throw new CannotConvertError("DeclarationNode",node);
    switch (node.kind) {
        case "FunctionDeclaration":
        case "GeneratorDeclaration":
            return HoistableDeclarationNode_fromGeneric(node);
        case "ClassDeclaration":
            return ClassDeclarationNode.fromGeneric(node);
        case "Let":
            return LetNode.fromGeneric(node);
        case "Const":
            return ConstNode.fromGeneric(node);
        default:
            throw new CannotConvertError("DeclarationNode",node);
    }
}

export function HoistableDeclarationNode_fromGeneric(node: ASTNode | null): HoistableDeclarationNode {
    if (node === null)
        throw new CannotConvertError("HoistableDeclarationNode",node);
    switch (node.kind) {
        case "FunctionDeclaration":
            return FunctionDeclarationNode.fromGeneric(node);
        case "GeneratorDeclaration":
            return GeneratorDeclarationNode.fromGeneric(node);
        default:
            throw new CannotConvertError("HoistableDeclarationNode",node);
    }
}

export type ForCInitType = ExpressionNode | VarNode | LetNode | ConstNode | null;
export const ForCInitType = {
    fromGeneric(node: ASTNode | null): ForCInitType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return VarNode.fromGeneric(node); } catch (e) {}
        try { return LetNode.fromGeneric(node); } catch (e) {}
        try { return ConstNode.fromGeneric(node); } catch (e) {}
        if (node === null)
            return null;
        throw new CannotConvertError("ForCInitType",node);
    }
};

export type ForBindingType = BindingIdentifierNode | BindingPatternNode;
export const ForBindingType = {
    fromGeneric(node: ASTNode | null): ForBindingType {
        try { return BindingIdentifierNode.fromGeneric(node); } catch (e) {}
        try { return BindingPatternNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ForBindingType",node);
    }
};

export type ForInBindingType = ExpressionNode | VarForDeclarationNode | LetForDeclarationNode | ConstForDeclarationNode;
export const ForInBindingType = {
    fromGeneric(node: ASTNode | null): ForInBindingType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return VarForDeclarationNode.fromGeneric(node); } catch (e) {}
        try { return LetForDeclarationNode.fromGeneric(node); } catch (e) {}
        try { return ConstForDeclarationNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ForInBindingType",node);
    }
};

export type ForOfBindingType = ExpressionNode | VarForDeclarationNode | LetForDeclarationNode | ConstForDeclarationNode;
export const ForOfBindingType = {
    fromGeneric(node: ASTNode | null): ForOfBindingType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return VarForDeclarationNode.fromGeneric(node); } catch (e) {}
        try { return LetForDeclarationNode.fromGeneric(node); } catch (e) {}
        try { return ConstForDeclarationNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ForOfBindingType",node);
    }
};

export type CatchParameterType = BindingIdentifierNode | BindingPatternNode;
export const CatchParameterType = {
    fromGeneric(node: ASTNode | null): CatchParameterType {
        try { return BindingIdentifierNode.fromGeneric(node); } catch (e) {}
        try { return BindingPatternNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("CatchParameterType",node);
    }
};

export type SingleNameBindingType = BindingIdentifierNode | SingleNameBindingNode;
export const SingleNameBindingType = {
    fromGeneric(node: ASTNode | null): SingleNameBindingType {
        try { return BindingIdentifierNode.fromGeneric(node); } catch (e) {}
        try { return SingleNameBindingNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("SingleNameBindingType",node);
    }
};

export type BindingElementType = SingleNameBindingType | BindingPatternInitNode |
                                 BindingPatternNode | BindingRestElementNode |
                                 ElisionNode;
export const BindingElementType = {
    fromGeneric(node: ASTNode | null): BindingElementType {
        try { return SingleNameBindingType.fromGeneric(node); } catch (e) {}
        try { return BindingPatternInitNode.fromGeneric(node); } catch (e) {}
        try { return BindingPatternNode.fromGeneric(node); } catch (e) {}
        try { return BindingRestElementNode.fromGeneric(node); } catch (e) {}
        try { return ElisionNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("BindingElementType",node);
    }
};

export type BindingPropertyType = SingleNameBindingType | BindingPropertyNode;
export const BindingPropertyType = {
    fromGeneric(node: ASTNode | null): BindingPropertyType {
        try { return SingleNameBindingType.fromGeneric(node); } catch (e) {}
        try { return BindingPropertyNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("BindingPropertyType",node);
    }
};

export function StatementListItemNode_fromGeneric(node: ASTNode | null): StatementListItemNode {
    if (node === null)
        throw new CannotConvertError("StatementListItemNode",node);
    switch (node.kind) {
        case "FunctionDeclaration":
        case "GeneratorDeclaration":
        case "ClassDeclaration":
        case "Let":
        case "Const":
            return DeclarationNode_fromGeneric(node);
        default:
            return StatementNode.fromGeneric(node);
    }
}

// ES6 Chapter 13: ECMAScript Language: Statements and Declarations

export abstract class StatementNode extends StatementListItemNode {
    public _type_StatementNode: any;

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public abstract varDeclaredNames(out: string[]): void;

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public abstract varScopedDeclarations(out: VarScopedDeclaration[]): void;

    // ES6 Section 13.2.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        // No lexically declared names by default, unless explicitly overridden
    }

    // ES6 Section 13.2.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        // No lexically scoped declarations by default, unless explicitly overridden
    }

    public static fromGeneric(node: ASTNode | null): StatementNode {
        if (node === null)
            throw new CannotConvertError("StatementNode",node);
        switch (node.kind) {
            case "DoStatement":
                return DoStatementNode.fromGeneric(node);
            case "WhileStatement":
                return WhileStatementNode.fromGeneric(node);
            case "ForC":
                return ForCNode.fromGeneric(node);
            case "ForIn":
                return ForInNode.fromGeneric(node);
            case "ForOf":
                return ForOfNode.fromGeneric(node);
            case "SwitchStatement":
                return SwitchStatementNode.fromGeneric(node);
            case "Block":
                return BlockNode.fromGeneric(node);
            case "Var":
                return VarNode.fromGeneric(node);
            case "EmptyStatement":
                return EmptyStatementNode.fromGeneric(node);
            case "ExpressionStatement":
                return ExpressionStatementNode.fromGeneric(node);
            case "IfStatement":
                return IfStatementNode.fromGeneric(node);
            case "ContinueStatement":
                return ContinueStatementNode.fromGeneric(node);
            case "BreakStatement":
                return BreakStatementNode.fromGeneric(node);
            case "ReturnStatement":
                return ReturnStatementNode.fromGeneric(node);
            case "WithStatement":
                return WithStatementNode.fromGeneric(node);
            case "LabelledStatement":
                return LabelledStatementNode.fromGeneric(node);
            case "ThrowStatement":
                return ThrowStatementNode.fromGeneric(node);
            case "TryStatement":
                return TryStatementNode.fromGeneric(node);
            case "DebuggerStatement":
                return DebuggerStatementNode.fromGeneric(node);
            default:
                throw new CannotConvertError("StatementNode",node);
        }
    }
}

export class StatementListNode extends ASTNode {
    public _type_StatementListNode: any;
    public readonly elements: StatementListItemNode[];

    public constructor(range: Range, elements: StatementListItemNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 13.2.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        for (const element of this.elements) {
            if (element instanceof LabelledStatementNode)
                element.lexicallyDeclaredNames(out);
            else if (element instanceof DeclarationNode)
                element.boundNames(out);
        }
    }

    // ES6 Section 13.2.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        for (const element of this.elements) {
            if (element instanceof LabelledStatementNode)
                element.lexicallyScopedDeclarations(out);
            else if (element instanceof DeclarationNode)
                out.push(element);
        }
    }

    // ES6 Section 13.2.7: Static Semantics: TopLevelLexicallyDeclaredNames
    public topLevelLexicallyDeclaredNames(out: string[]): void {
        for (const element of this.elements) {
            if (element instanceof StatementNode) {
            }
            else if (element instanceof DeclarationNode) {
                if (!(element instanceof FunctionDeclarationNode) &&
                    !(element instanceof GeneratorDeclarationNode)) {
                    element.boundNames(out);
                }
            }
            else {
                throw new Error("StatementListNode contains item that is not a Statement "+
                                "or Declaration: "+element.kind);
            }
        }
    }

    // ES6 Section 13.2.8: Static Semantics: TopLevelLexicallyScopedDeclarations
    public topLevelLexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        for (const element of this.elements) {
            if (element instanceof StatementNode) {
            }
            else if (element instanceof DeclarationNode) {
                if (!(element instanceof FunctionDeclarationNode) &&
                    !(element instanceof GeneratorDeclarationNode)) {
                    out.push(element);
                }
            }
            else {
                throw new Error("StatementListNode contains item that is not a Statement "+
                                "or Declaration: "+element.kind);
            }
        }
    }

    // ES6 Section 13.2.9: Static Semantics: TopLevelVarDeclaredNames
    public topLevelVarDeclaredNames(out: string[]): void {
        for (const element of this.elements) {
            if (element instanceof FunctionDeclarationNode)
                element.boundNames(out);
            else if (element instanceof GeneratorDeclarationNode)
                element.boundNames(out);
            else if (element instanceof LabelledStatementNode)
                element.topLevelVarDeclaredNames(out);
            else
                element.varDeclaredNames(out);
        }
    }

    // ES6 Section 13.2.10: Static Semantics: TopLevelVarScopedDeclarations
    public topLevelVarScopedDeclarations(out: VarScopedDeclaration[]): void {
        for (const element of this.elements) {
            if (element instanceof FunctionDeclarationNode)
                out.push(element);
            else if (element instanceof GeneratorDeclarationNode)
                out.push(element);
            else if (element instanceof LabelledStatementNode)
                element.topLevelVarScopedDeclarations(out);
            else
                element.varScopedDeclarations(out);
        }
    }

    // ES6 Section 13.2.11 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        for (const element of this.elements) {
            element.varDeclaredNames(out);
        }
    }

    // ES6 Section 13.2.12 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        for (const element of this.elements) {
            element.varScopedDeclarations(out);
        }
    }

    // ES6 Section 13.2.13 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        for (const element of this.elements) {
            const comp = element.evaluate(ctx);
            if (!(comp instanceof NormalCompletion))
                return comp;
            // FIXME: Follow algorithm in spec and use UpdateEmpty
        }
        return new NormalCompletion(new Empty());
    }

    public static fromGeneric(node: ASTNode | null): StatementListNode {
        const list = check.list(node);
        const elements: StatementListItemNode[] = [];
        for (const listElement of list.elements)
            elements.push(StatementListItemNode_fromGeneric(listElement));
        return new StatementListNode(list.range,elements);
    }
}

export class LabelIdentifierNode extends ASTNode {
    public _type_LabelIdentifierNode: any;
    public readonly value: string;

    public constructor(range: Range, value: string) {
        super(range,"LabelIdentifier");
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        return "LabelIdentifier("+JSON.stringify(this.value)+")";
        // return this.value;
    }

    public static fromGeneric(node: ASTNode | null): LabelIdentifierNode {
        if ((node === null) || (node.kind !== "LabelIdentifier") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("LabelIdentifier",node);
        return new LabelIdentifierNode(node.range,node.value);
    }
}

export abstract class BreakableStatementNode extends StatementNode {
    public _type_BreakableStatementNode: any;

    public static fromGeneric(node: ASTNode | null): BreakableStatementNode {
        throw new Error("BreakableStatementNode.fromGeneric not implemented");
    }
}

// ES6 Section 13.1: Statement Semantics

// ES6 Section 13.2: Block

export class BlockNode extends StatementNode {
    public _type_BlockNode: any;
    public statements: StatementListNode;

    public constructor(range: Range, statements: StatementListNode) {
        super(range,"Block");
        this.statements = statements;
    }

    public get children(): (ASTNode | null)[] {
        return [this.statements];
    }

    // ES6 Section 13.2.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        this.statements.lexicallyDeclaredNames(out);
    }

    // ES6 Section 13.2.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        this.statements.lexicallyScopedDeclarations(out);
    }

    // ES6 Section 13.2.9: Static Semantics: TopLevelVarDeclaredNames
    public topLevelVarDeclaredNames(out: string[]): void {
        this.statements.topLevelVarDeclaredNames(out);
    }

    // ES6 Section 13.2.10: Static Semantics: TopLevelVarScopedDeclarations
    public topLevelVarScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.statements.topLevelVarScopedDeclarations(out);
    }

    // ES6 Section 13.2.11 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.statements.varDeclaredNames(out);
    }

    // ES6 Section 13.2.12 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.statements.varScopedDeclarations(out);
    }

    // ES6 Section 13.2.13 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // 1. Let oldEnv be the running execution context’s LexicalEnvironment.
        const oldEnv = ctx.lexicalEnvironment;

        // 2. Let blockEnv be NewDeclarativeEnvironment(oldEnv).
        const blockEnv = NewDeclarativeEnvironment(ctx.realm,oldEnv);

        // 3. Perform BlockDeclarationInstantiation(StatementList, blockEnv).
        const instComp = BlockDeclarationInstantiation(ctx.realm,this.statements,blockEnv);
        if (!(instComp instanceof NormalCompletion))
            return instComp;

        // 4. Set the running execution context’s LexicalEnvironment to blockEnv.
        ctx.lexicalEnvironment = blockEnv;

        // 5. Let blockValue be the result of evaluating StatementList.
        const blockValueComp = this.statements.evaluate(ctx);

        // 6. Set the running execution context’s LexicalEnvironment to oldEnv.
        ctx.lexicalEnvironment = oldEnv;

        // 7. Return blockValue.
        return blockValueComp;
    }

    public static fromGeneric(node: ASTNode | null): BlockNode {
        node = check.node(node,"Block",1);
        const statements = StatementListNode.fromGeneric(node.children[0]);
        return new BlockNode(node.range,statements);
    }
}

function BlockDeclarationInstantiation(realm: Realm, code: StatementListNode, env: LexicalEnvironment): Completion<void> {
    // 1. Let declarations be the LexicallyScopedDeclarations of code.
    const declarations: LexicallyScopedDeclaration[] = [];
    code.lexicallyScopedDeclarations(declarations);

    // 2. For each element d in declarations do
    for (const d of declarations) {
        const boundNames: string[] = [];
        d.boundNames(boundNames);

        // a. For each element dn of the BoundNames of d do
        for (const dn of boundNames) {
            // i. If IsConstantDeclaration of d is true, then
            let status: Completion<void>;
            if (d.isConstantDeclaration()) {
                // 1. Let status be env.CreateImmutableBinding(dn, true).
                status = env.record.CreateImmutableBinding(dn, true);
            }
            // ii. Else,
            else {
                // 1. Let status be env.CreateMutableBinding(dn, false).
                status = env.record.CreateMutableBinding(dn, false);
            }
            // iii. Assert: status is never an abrupt completion.
            if (!(status instanceof NormalCompletion)) {
                throw new Error("Assertion failure: BlockDeclarationInstantiation: status should "+
                                "never be an abrubt completion");
            }
        }

        // b. If d is a GeneratorDeclaration production or a FunctionDeclaration production, then
        if ((d instanceof GeneratorDeclarationNode) || (d instanceof FunctionDeclarationNode)) {
            // i. Let fn be the sole element of the BoundNames of d
            if (boundNames.length !== 1) {
                throw new Error("Assertion failure: Should only have a single bound name for a "+
                                "generator or function declaration");
            }
            const fn = boundNames[0];

            // ii. Let fo be the result of performing InstantiateFunctionObject for d with argument env.
            const foComp = d.instantiateFunctionObject(realm,env);
            if (!(foComp instanceof NormalCompletion))
                return foComp;
            const fo = foComp.value;

            // iii. Perform env.InitializeBinding(fn, fo).
            env.record.InitializeBinding(fn, fo);
        }
    }

    return new NormalCompletion(undefined);
}

// ES6 Section 13.3: Declarations and the Variable Statement

// ES6 Section 13.3.1: Let and Const Declarations

export class BindingListNode extends ASTNode {
    public _type_BindingListNode: any;
    public readonly elements: LexicalBindingNode[];

    public constructor(range: Range, elements: LexicalBindingNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 13.3.1.2 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        for (const element of this.elements)
            element.boundNames(out);
    }

    // ES6 Section 13.3.1.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // 1. Let next be the result of evaluating BindingList.
        // 2. ReturnIfAbrupt(next).
        // 3. Return the result of evaluating LexicalBinding.
        let result: Completion<JSValue | Reference | Empty>;
        result = new NormalCompletion(new Empty());
        for (const element of this.elements) {
            result = element.evaluate(ctx);
            if (!(result instanceof NormalCompletion))
                return result;
        }
        return result;
    }

    public static fromGeneric(node: ASTNode | null): BindingListNode {
        const list = check.list(node);
        const elements: LexicalBindingNode[] = [];
        for (const listElement of list.elements)
            elements.push(LexicalBindingNode.fromGeneric(listElement));
        return new BindingListNode(list.range,elements);
    }
}

export abstract class LexicalDeclarationNode extends DeclarationNode {
    public _type_LexicalDeclarationNode: any;
    public bindings: BindingListNode;

    public constructor(range: Range, kind: string, bindings: BindingListNode) {
        super(range,kind);
        this.bindings = bindings;
    }

    public get children(): (ASTNode | null)[] {
        return [this.bindings];
    }

    // ES6 Section 13.3.1.2 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.bindings.boundNames(out);
    }

    // ES6 Section 13.3.1.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // 1. Let next be the result of evaluating BindingList.
        const nextComp = this.bindings.evaluate(ctx);
        // 2. ReturnIfAbrupt(next).
        if (!(nextComp instanceof NormalCompletion))
            return nextComp;
        // 3. Return NormalCompletion(empty).
        return new NormalCompletion(new Empty());
    }
}

export class LetNode extends LexicalDeclarationNode {
    public _type_LetNode: any;

    public constructor(range: Range, bindings: BindingListNode) {
        super(range,"Let",bindings);
    }

    // ES6 Section 13.3.1.3: Static Semantics: IsConstantDeclaration
    public isConstantDeclaration(): boolean {
        return false;
    }

    public static fromGeneric(node: ASTNode | null): LetNode {
        node = check.node(node,"Let",1);
        const bindings = BindingListNode.fromGeneric(node.children[0]);
        return new LetNode(node.range,bindings);
    }
}

export class ConstNode extends LexicalDeclarationNode {
    public _type_ConstNode: any;

    public constructor(range: Range, bindings: BindingListNode) {
        super(range,"Const",bindings);
    }

    // ES6 Section 13.3.1.3: Static Semantics: IsConstantDeclaration
    public isConstantDeclaration(): boolean {
        return true;
    }

    public static fromGeneric(node: ASTNode | null): ConstNode {
        node = check.node(node,"Const",1);
        const bindings = BindingListNode.fromGeneric(node.children[0]);
        return new ConstNode(node.range,bindings);
    }
}

export abstract class LexicalBindingNode extends ASTNode {
    public _type_LexicalBindingNode: any;

    // ES6 Section 13.3.1.2 Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    // ES6 Section 13.3.1.4 Runtime Semantics: Evaluation
    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;

    public static fromGeneric(node: ASTNode | null): LexicalBindingNode {
        if (node === null)
            throw new CannotConvertError("LexicalBindingNode",node);
        switch (node.kind) {
            case "LexicalIdentifierBinding":
                return LexicalIdentifierBindingNode.fromGeneric(node);
            case "LexicalPatternBinding":
                return LexicalPatternBindingNode.fromGeneric(node);
            default:
                throw new CannotConvertError("LexicalBindingNode",node);
        }
    }
}

export class LexicalIdentifierBindingNode extends LexicalBindingNode {
    public _type_LexicalIdentifierBindingNode: any;
    public identifier: BindingIdentifierNode;
    public initializer: ExpressionNode | null;

    public constructor(
        range: Range,
        identifier: BindingIdentifierNode,
        initializer: ExpressionNode | null
    ) {
        super(range,"LexicalIdentifierBinding");
        this.identifier = identifier;
        this.initializer = initializer;
    }

    public get children(): (ASTNode | null)[] {
        return [this.identifier,this.initializer];
    }

    // ES6 Section 13.3.1.2 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.identifier.boundNames(out);
    }

    // ES6 Section 13.3.1.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        if (this.initializer == null) {
            const lhsComp = ctx.ResolveBinding(this.identifier.value);
            if (!(lhsComp instanceof NormalCompletion))
                return lhsComp;
            const lhs = lhsComp.value;
            if (!(lhs instanceof EnvironmentReference))
                return ctx.realm.throwTypeError("Attempt to initialize a non-environment refrence");
            return InitializeReferencedBinding(ctx.realm,lhs,new JSUndefined());
        }
        else {
            // 1. Let bindingId be StringValue of BindingIdentifier.
            const bindingId = this.identifier.value;

            // 2. Let lhs be ResolveBinding(bindingId).
            const lhsComp = ctx.ResolveBinding(this.identifier.value);
            if (!(lhsComp instanceof NormalCompletion))
                return lhsComp;
            const lhs = lhsComp.value;

            // 3. Let rhs be the result of evaluating Initializer.
            // 4. Let value be GetValue(rhs).
            // 5. ReturnIfAbrupt(value).
            const rhsComp = this.initializer.evaluate(ctx);
            const valueComp = GetValue(ctx.realm, rhsComp);
            if (!(valueComp instanceof NormalCompletion))
                return valueComp;
            const value = valueComp.value;

            // 6. If IsAnonymousFunctionDefinition(Initializer) is true, then
            // TODO...
                // a. Let hasNameProperty be HasOwnProperty(value, "name").
                // b. ReturnIfAbrupt(hasNameProperty).
                // c. If hasNameProperty is false, perform SetFunctionName(value, bindingId).

            // 7. Return InitializeReferencedBinding(lhs, value).
            if (!(lhs instanceof EnvironmentReference))
                return ctx.realm.throwTypeError("Attempt to initialize a non-environment refrence");

            return InitializeReferencedBinding(ctx.realm,lhs,value);
        }
    }

    public static fromGeneric(node: ASTNode | null): LexicalIdentifierBindingNode {
        node = check.node(node,"LexicalIdentifierBinding",2);
        const identifier = BindingIdentifierNode.fromGeneric(node.children[0]);
        const initializer = (node.children[1] === null) ? null : ExpressionNode_fromGeneric(node.children[1]);
        return new LexicalIdentifierBindingNode(node.range,identifier,initializer);
    }
}

export class LexicalPatternBindingNode extends LexicalBindingNode {
    public _type_LexicalPatternBindingNode: any;
    public pattern: BindingPatternNode;
    public initializer: ExpressionNode;

    public constructor(
        range: Range,
        pattern: BindingPatternNode,
        initializer: ExpressionNode
    ) {
        super(range,"LexicalPatternBinding");
        this.pattern = pattern;
        this.initializer = initializer;
    }

    public get children(): (ASTNode | null)[] {
        return [this.pattern,this.initializer];
    }

    // ES6 Section 13.3.1.2 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.pattern.boundNames(out);
    }

    // ES6 Section 13.3.1.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("LexicalPatternBindingNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): LexicalPatternBindingNode {
        node = check.node(node,"LexicalPatternBinding",2);
        const pattern = BindingPatternNode.fromGeneric(node.children[0]);
        const initializer = ExpressionNode_fromGeneric(node.children[1]);
        return new LexicalPatternBindingNode(node.range,pattern,initializer);
    }
}

// ES6 Section 13.3.2: Variable Statement

export class VariableDeclarationListNode extends ASTNode {
    public _type_VariableDeclarationListNode: any;
    public readonly elements: VarBindingNode[];

    public constructor(range: Range, elements: VarBindingNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 13.3.2.1 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        for (const element of this.elements)
            element.boundNames(out);
    }

    // ES6 Section 13.3.2.3 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        for (const element of this.elements)
            out.push(element);
    }

    // ES6 Section 13.3.2.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // Note: The spec discusses VariableDeclarationList in terms of a cons-like list. Here
        // we use a normal array. The grammar requires there is at least one element in the array,
        // so the initial next value of undefined should never actually be returned in practice.
        let next: Completion<JSValue | Reference | Empty> = new NormalCompletion(new JSUndefined());

        // 1. Let next be the result of evaluating VariableDeclarationList.
        // 2. ReturnIfAbrupt(next).
        // 3. Return the result of evaluating VariableDeclaration.
        for (const element of this.elements) {
            next = element.evaluate(ctx);
            if (!(next instanceof NormalCompletion))
                return next;
        }
        return next;
    }

    public static fromGeneric(node: ASTNode | null): VariableDeclarationListNode {
        const list = check.list(node);
        const elements: VarBindingNode[] = [];
        for (const listElement of list.elements)
            elements.push(VarBindingNode.fromGeneric(listElement));
        return new VariableDeclarationListNode(list.range,elements);
    }
}

export class VarNode extends StatementNode {
    public _type_VarNode: any;
    public declarations: VariableDeclarationListNode;

    public constructor(range: Range, declarations: VariableDeclarationListNode) {
        super(range,"Var");
        this.declarations = declarations;
    }

    public get children(): (ASTNode | null)[] {
        return [this.declarations];
    }

    // ES6 Section 13.3.2.1 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.declarations.boundNames(out);
    }

    // ES6 Section 13.3.2.2 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.declarations.boundNames(out);
    }

    // ES6 Section 13.3.2.3 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.declarations.varScopedDeclarations(out);
    }

    // ES6 Section 13.3.2.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // 1. Let next be the result of evaluating VariableDeclarationList.
        const next = this.declarations.evaluate(ctx);

        // 2. ReturnIfAbrupt(next).
        if (!(next instanceof NormalCompletion))
            return next;

        // 3. Return NormalCompletion( empty).
        return new NormalCompletion(new Empty());
    }

    public static fromGeneric(node: ASTNode | null): VarNode {
        node = check.node(node,"Var",1);
        const declarations = VariableDeclarationListNode.fromGeneric(node.children[0]);
        return new VarNode(node.range,declarations);
    }
}

export abstract class VarBindingNode extends ASTNode implements VarScopedDeclaration {
    public _type_VarBindingNode: any;
    public _interface_VarScopedDeclaration: any;

    // ES6 Section 13.3.2.1 Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    public isConstantDeclaration(): boolean {
        return false;
    }

    // ES6 Section 13.3.2.4 Runtime Semantics: Evaluation
    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;

    public static fromGeneric(node: ASTNode | null): VarBindingNode {
        if (node === null)
            throw new CannotConvertError("VarBindingNode",node);
        switch (node.kind) {
            case "VarIdentifier":
                return VarIdentifierNode.fromGeneric(node);
            case "VarPattern":
                return VarPatternNode.fromGeneric(node);
            default:
                throw new CannotConvertError("VarBindingNode",node);
        }
    }
}

export class VarIdentifierNode extends VarBindingNode {
    public _type_VarIdentifierNode: any;
    public identifier: BindingIdentifierNode;
    public initializer: ExpressionNode | null;

    public constructor(
        range: Range,
        identifier: BindingIdentifierNode,
        initializer: ExpressionNode | null
    ) {
        super(range,"VarIdentifier");
        this.identifier = identifier;
        this.initializer = initializer;
    }

    public get children(): (ASTNode | null)[] {
        return [this.identifier,this.initializer];
    }

    // ES6 Section 13.3.2.1 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.identifier.boundNames(out);
    }

    // ES6 Section 13.3.2.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        if (this.initializer === null)
            return new NormalCompletion(new Empty());

        // 1. Let bindingId be StringValue of BindingIdentifier.
        const bindingId = this.identifier.value;

        // 2. Let lhs be ResolveBinding(bindingId)
        // 3. ReturnIfAbrupt(lhs).
        const lhsComp = ctx.ResolveBinding(bindingId);
        if (!(lhsComp instanceof NormalCompletion))
            return lhsComp;
        const lhs = lhsComp.value;

        // 4. Let rhs be the result of evaluating Initializer.
        const rhsComp = this.initializer.evaluate(ctx);

        // 5. Let value be GetValue(rhs).
        // 6. ReturnIfAbrupt(value).
        const valueComp = GetValue(ctx.realm, rhsComp);

        if (!(valueComp instanceof NormalCompletion))
            return valueComp;
        const value = valueComp.value;

        // 7. If IsAnonymousFunctionDefinition(Initializer) is true, then
        // TODO...
            // a. Let hasNameProperty be HasOwnProperty(value, "name").
            // b. ReturnIfAbrupt(hasNameProperty).
            // c. If hasNameProperty is false, perform SetFunctionName(value, bindingId).

        // 8. Return PutValue(lhs, value).
        const putValueComp = PutValue(ctx.realm,lhsComp,valueComp);
        if (!(putValueComp instanceof NormalCompletion))
            return putValueComp;
        return new NormalCompletion(new Empty());

        // NOTE If a VariableDeclaration is nested within a with statement and the BindingIdentifier
        // in the VariableDeclaration is the same as a property name of the binding object of the
        // with statement’s object Environment Record, then step 7 will assign value to the property
        // instead of assigning to the VariableEnvironment binding of the Identifier.
    }

    public static fromGeneric(node: ASTNode | null): VarIdentifierNode {
        node = check.node(node,"VarIdentifier",2);
        const identifier = BindingIdentifierNode.fromGeneric(node.children[0]);
        const initializer = (node.children[1] === null) ? null : ExpressionNode_fromGeneric(node.children[1]);
        return new VarIdentifierNode(node.range,identifier,initializer);
    }
}

export class VarPatternNode extends VarBindingNode {
    public _type_VarPatternNode: any;
    public pattern: BindingPatternNode;
    public initializer: ExpressionNode;

    public constructor(
        range: Range,
        pattern: BindingPatternNode,
        initializer: ExpressionNode
    ) {
        super(range,"VarPattern");
        this.pattern = pattern;
        this.initializer = initializer;
    }

    public get children(): (ASTNode | null)[] {
        return [this.pattern,this.initializer];
    }

    // ES6 Section 13.3.2.1 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.pattern.boundNames(out);
    }

    // ES6 Section 13.3.2.4 Runtime Semantics: Evaluation
    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("VarPatternNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): VarPatternNode {
        node = check.node(node,"VarPattern",2);
        const pattern = BindingPatternNode.fromGeneric(node.children[0]);
        const initializer = ExpressionNode_fromGeneric(node.children[1]);
        return new VarPatternNode(node.range,pattern,initializer);
    }
}

// ES6 Section 13.3.3: Destructuring Binding Patterns

export class BindingPropertyListNode extends ASTNode {
    public _type_BindingPropertyListNode: any;
    public readonly elements: BindingPropertyType[];

    public constructor(range: Range, elements: BindingPropertyType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        for (const element of this.elements)
            element.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): BindingPropertyListNode {
        const list = check.list(node);
        const elements: BindingPropertyType[] = [];
        for (const listElement of list.elements)
            elements.push(BindingPropertyType.fromGeneric(listElement));
        return new BindingPropertyListNode(list.range,elements);
    }
}

export abstract class BindingPatternNode extends ASTNode {
    public _type_BindingPatternNode: any;

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    // ES6 Section 13.3.3.2 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        throw new Error("BindingPatternNode.containsExpression not implemented");
    }

    // ES6 Section 13.3.3.4 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // BindingElement : BindingPattern
        // 1. Return false.
        return false;
    }

    public static fromGeneric(node: ASTNode | null): BindingPatternNode {
        if (node === null)
            throw new CannotConvertError("BindingPatternNode",node);
        switch (node.kind) {
            case "ObjectBindingPattern":
                return ObjectBindingPatternNode.fromGeneric(node);
            case "ArrayBindingPattern":
                return ArrayBindingPatternNode.fromGeneric(node);
            default:
                throw new CannotConvertError("BindingPatternNode",node);
        }
    }
}

export class ObjectBindingPatternNode extends BindingPatternNode {
    public _type_ObjectBindingPatternNode: any;
    public readonly properties: BindingPropertyListNode;

    public constructor(range: Range, properties: BindingPropertyListNode) {
        super(range,"ObjectBindingPattern");
        this.properties = properties;
    }

    public get children(): (ASTNode | null)[] {
        return [this.properties];
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.properties.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): ObjectBindingPatternNode {
        node = check.node(node,"ObjectBindingPattern",1);
        const properties = BindingPropertyListNode.fromGeneric(node.children[0]);
        return new ObjectBindingPatternNode(node.range,properties);
    }
}

export class BindingElementListNode extends ASTNode {
    public _type_BindingElementListNode: any;
    public readonly elements: BindingElementType[];

    public constructor(range: Range, elements: BindingElementType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        for (const element of this.elements)
            element.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): BindingElementListNode {
        const list = check.list(node);
        const elements: BindingElementType[] = [];
        for (const listElement of list.elements)
            elements.push(BindingElementType.fromGeneric(listElement));
        return new BindingElementListNode(list.range,elements);
    }
}

export class ArrayBindingPatternNode extends BindingPatternNode {
    public _type_ArrayBindingPatternNode: any;
    public readonly elements: BindingElementListNode;
    public readonly rest: BindingRestElementNode | null;

    public constructor(
        range: Range,
        elements: BindingElementListNode,
        rest: BindingRestElementNode | null
    ) {
        super(range,"ArrayBindingPattern");
        this.elements = elements;
        this.rest = rest;
    }

    public get children(): (ASTNode | null)[] {
        return [this.elements,this.rest];
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.elements.boundNames(out);
        if (this.rest != null)
            this.rest.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): ArrayBindingPatternNode {
        node = check.node(node,"ArrayBindingPattern",2);
        const elements = BindingElementListNode.fromGeneric(node.children[0]);
        const rest = (node.children[1] === null) ? null : BindingRestElementNode.fromGeneric(node.children[1]);
        return new ArrayBindingPatternNode(node.range,elements,rest);
    }
}

export class BindingPropertyNode extends ASTNode {
    public _type_BindingPropertyNode: any;
    public readonly name: PropertyNameType;
    public readonly element: BindingElementType;

    public constructor(range: Range, name: PropertyNameType, element: BindingElementType) {
        super(range,"BindingProperty");
        this.name = name;
        this.element = element;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.element];
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.element.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): BindingPropertyNode {
        node = check.node(node,"BindingProperty",2);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const element = BindingElementType.fromGeneric(node.children[1]);
        return new BindingPropertyNode(node.range,name,element);
    }
}

export class BindingPatternInitNode extends ASTNode {
    public _type_BindingPatternInitNode: any;
    public readonly pattern: BindingPatternNode;
    public readonly init: ExpressionNode;

    public constructor(
        range: Range,
        pattern: BindingPatternNode,
        init: ExpressionNode
    ) {
        super(range,"BindingPatternInit");
        this.pattern = pattern;
        this.init = init;
    }

    public get children(): (ASTNode | null)[] {
        return [this.pattern,this.init];
    }

    // ES6 Section 13.3.3.1 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.pattern.boundNames(out);
    }

    // ES6 Section 13.3.3.2 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        throw new Error("BindingPatternInitNode.containsExpression not implemented");
    }

    // ES6 Section 13.3.3.4 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // BindingElement : BindingPattern Initializer
        // 1. Return false.
        return false;
    }

    public static fromGeneric(node: ASTNode | null): BindingPatternInitNode {
        node = check.node(node,"BindingPatternInit",2);
        const pattern = BindingPatternNode.fromGeneric(node.children[0]);
        const init = ExpressionNode_fromGeneric(node.children[1]);
        return new BindingPatternInitNode(node.range,pattern,init);
    }
}

export class SingleNameBindingNode extends ASTNode {
    public _type_SingleNameBindingNode: any;
    public readonly ident: BindingIdentifierNode;
    public readonly init: ExpressionNode;

    public constructor(range: Range, ident: BindingIdentifierNode, init: ExpressionNode) {
        super(range,"SingleNameBinding");
        this.ident = ident;
        this.init = init;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.init];
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.ident.boundNames(out);
    }

    // ES6 Section 13.3.3.2 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        // SingleNameBinding : BindingIdentifier Initializer
        // 1. Return true.
        return true;
    }

    // ES6 Section 13.3.3.4 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        // SingleNameBinding : BindingIdentifier Initializer
        // 1. Return false.
        return false;
    }

    public static fromGeneric(node: ASTNode | null): SingleNameBindingNode {
        node = check.node(node,"SingleNameBinding",2);
        const ident = BindingIdentifierNode.fromGeneric(node.children[0]);
        const init = ExpressionNode_fromGeneric(node.children[1]);
        return new SingleNameBindingNode(node.range,ident,init);
    }
}

export class BindingRestElementNode extends ASTNode {
    public _type_BindingRestElementNode: any;
    public readonly ident: BindingIdentifierNode;

    public constructor(range: Range, ident: BindingIdentifierNode) {
        super(range,"BindingRestElement");
        this.ident = ident;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }

    // ES6 Section 13.3.3.1: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.ident.boundNames(out);
    }

    // ES6 Section 13.3.3.2 Static Semantics: ContainsExpression
    public containsExpression(): boolean {
        throw new Error("BindingRestElementNode.containsExpression not implemented");
    }

    // ES6 Section 14.1.12 Static Semantics: IsSimpleParameterList
    public isSimpleParameterList(): boolean {
        return false;
    }

    public static fromGeneric(node: ASTNode | null): BindingRestElementNode {
        node = check.node(node,"BindingRestElement",1);
        const ident = BindingIdentifierNode.fromGeneric(node.children[0]);
        return new BindingRestElementNode(node.range,ident);
    }
}

// ES6 Section 13.4: Empty Statement

export class EmptyStatementNode extends StatementNode {
    public _type_EmptyStatementNode: any;

    public constructor(range: Range) {
        super(range,"EmptyStatement");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("EmptyStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): EmptyStatementNode {
        node = check.node(node,"EmptyStatement",0);
        return new EmptyStatementNode(node.range);
    }
}

// ES6 Section 13.5: Expression Statement

export class ExpressionStatementNode extends StatementNode {
    public _type_ExpressionStatementNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ExpressionStatement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        const resultComp = this.expr.evaluate(ctx);
        if (!(resultComp instanceof NormalCompletion))
            return resultComp;
        const result = resultComp.value;
        if (result instanceof AbstractReference)
            return GetValue(ctx.realm,result);
        else
            return new NormalCompletion(result);
    }

    public static fromGeneric(node: ASTNode | null): ExpressionStatementNode {
        node = check.node(node,"ExpressionStatement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new ExpressionStatementNode(node.range,expr);
    }
}

// ES6 Section 13.6: The if Statement

export class IfStatementNode extends StatementNode {
    public _type_IfStatementNode: any;
    public readonly condition: ExpressionNode;
    public readonly trueBranch: StatementNode;
    public readonly falseBranch: StatementNode | null;

    public constructor(
        range: Range,
        condition: ExpressionNode,
        trueBranch: StatementNode,
        falseBranch: StatementNode | null
    ) {
        super(range,"IfStatement");
        this.condition = condition;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }

    public get children(): (ASTNode | null)[] {
        return [this.condition,this.trueBranch,this.falseBranch];
    }

    // ES6 Section 13.6.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.trueBranch.varDeclaredNames(out);
        if (this.falseBranch != null)
            this.falseBranch.varDeclaredNames(out);
    }

    // ES6 Section 13.6.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.trueBranch.varScopedDeclarations(out);
        if (this.falseBranch != null) {
            this.falseBranch.varScopedDeclarations(out);
        }
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("IfStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): IfStatementNode {
        node = check.node(node,"IfStatement",3);
        const condition = ExpressionNode_fromGeneric(node.children[0]);
        const trueBranch = StatementNode.fromGeneric(node.children[1]);
        const falseBranch = (node.children[2] === null) ? null : StatementNode.fromGeneric(node.children[2]);
        return new IfStatementNode(node.range,condition,trueBranch,falseBranch);
    }
}

// ES6 Section 13.7: Iteration Statements

// ES6 Section 13.7.1: Semantics

// ES6 Section 13.7.2: The do-while Statement

export class DoStatementNode extends BreakableStatementNode {
    public _type_DoStatementNode: any;
    public readonly body: StatementNode;
    public readonly condition: ExpressionNode;

    public constructor(range: Range, body: StatementNode, condition: ExpressionNode) {
        super(range,"DoStatement");
        this.body = body;
        this.condition = condition;
    }

    public get children(): (ASTNode | null)[] {
        return [this.body,this.condition];
    }

    // ES6 Section 13.7.2.4 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.body.varDeclaredNames(out);
    }

    // ES6 Section 13.7.2.5 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.body.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("DoStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): DoStatementNode {
        node = check.node(node,"DoStatement",2);
        const body = StatementNode.fromGeneric(node.children[0]);
        const condition = ExpressionNode_fromGeneric(node.children[1]);
        return new DoStatementNode(node.range,body,condition);
    }
}

// ES6 Section 13.7.3: The while Statement

export class WhileStatementNode extends BreakableStatementNode {
    public _type_WhileStatementNode: any;
    public readonly condition: ExpressionNode;
    public readonly body: StatementNode;

    public constructor(range: Range, condition: ExpressionNode, body: StatementNode) {
        super(range,"WhileStatement");
        this.condition = condition;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.condition,this.body];
    }

    // ES6 Section 13.7.3.4 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.body.varDeclaredNames(out);
    }

    // ES6 Section 13.7.3.5 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.body.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("WhileStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): WhileStatementNode {
        node = check.node(node,"WhileStatement",2);
        const condition = ExpressionNode_fromGeneric(node.children[0]);
        const body = StatementNode.fromGeneric(node.children[1]);
        return new WhileStatementNode(node.range,condition,body);
    }
}

// ES6 Section 13.7.4: The for Statement

export class ForCNode extends BreakableStatementNode {
    public _type_ForCNode: any;
    public readonly init: ForCInitType;
    public readonly condition: ExpressionNode | null;
    public readonly update: ExpressionNode | null;
    public readonly body: StatementNode;

    public constructor(
        range: Range,
        init: ForCInitType,
        condition: ExpressionNode | null,
        update: ExpressionNode | null,
        body: StatementNode
    ) {
        super(range,"ForC");
        this.init = init;
        this.condition = condition;
        this.update = update;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.init,this.condition,this.update,this.body];
    }

    // ES6 Section 13.7.4.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        if (this.init instanceof VarNode)
            this.init.varDeclaredNames(out);
        this.body.varDeclaredNames(out);
    }

    // ES6 Section 13.7.4.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        if (this.init instanceof VarNode)
            this.init.varScopedDeclarations(out);
        this.body.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ForCNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ForCNode {
        node = check.node(node,"ForC",4);
        const init = ForCInitType.fromGeneric(node.children[0]);
        const condition = (node.children[1] === null) ? null : ExpressionNode_fromGeneric(node.children[1]);
        const update = (node.children[2] === null) ? null : ExpressionNode_fromGeneric(node.children[2]);
        const body = StatementNode.fromGeneric(node.children[3]);
        return new ForCNode(node.range,init,condition,update,body);
    }
}

// ES6 Section 13.7.5: The for-in and for-of Statements

export class ForInNode extends BreakableStatementNode {
    public _type_ForInNode: any;
    public readonly binding: ForInBindingType;
    public readonly expr: ExpressionNode;
    public readonly body: StatementNode;

    public constructor(
        range: Range,
        binding: ForInBindingType,
        expr: ExpressionNode,
        body: StatementNode
    ) {
        super(range,"ForIn");
        this.binding = binding;
        this.expr = expr;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding,this.expr,this.body];
    }

    // ES6 Section 13.7.5.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        if ((this.binding instanceof LetForDeclarationNode) || (this.binding instanceof ConstForDeclarationNode))
            this.binding.boundNames(out);
    }

    // ES6 Section 13.7.5.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        if (this.binding instanceof VarForDeclarationNode)
            this.binding.varDeclaredNames(out);
        this.body.varDeclaredNames(out);
    }

    // ES6 Section 13.7.5.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        if (this.binding instanceof VarForDeclarationNode)
            this.binding.varScopedDeclarations(out);
        this.body.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ForInNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ForInNode {
        node = check.node(node,"ForIn",3);
        const binding = ForInBindingType.fromGeneric(node.children[0]);
        const expr = ExpressionNode_fromGeneric(node.children[1]);
        const body = StatementNode.fromGeneric(node.children[2]);
        return new ForInNode(node.range,binding,expr,body);
    }
}

export class ForOfNode extends BreakableStatementNode {
    public _type_ForOfNode: any;
    public readonly binding: ForOfBindingType;
    public readonly expr: ExpressionNode;
    public readonly body: StatementNode;

    public constructor(
        range: Range,
        binding: ForOfBindingType,
        expr: ExpressionNode,
        body: StatementNode
    ) {
        super(range,"ForOf");
        this.binding = binding;
        this.expr = expr;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding,this.expr,this.body];
    }

    // ES6 Section 13.7.5.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        if ((this.binding instanceof LetForDeclarationNode) || (this.binding instanceof ConstForDeclarationNode))
            this.binding.boundNames(out);
    }

    // ES6 Section 13.7.5.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        if (this.binding instanceof VarForDeclarationNode)
            this.binding.varDeclaredNames(out);
        this.body.varDeclaredNames(out);
    }

    // ES6 Section 13.7.5.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        if (this.binding instanceof VarForDeclarationNode)
            this.binding.varScopedDeclarations(out);
        this.body.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ForOfNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ForOfNode {
        node = check.node(node,"ForOf",3);
        const binding = ForOfBindingType.fromGeneric(node.children[0]);
        const expr = ExpressionNode_fromGeneric(node.children[1]);
        const body = StatementNode.fromGeneric(node.children[2]);
        return new ForOfNode(node.range,binding,expr,body);
    }
}

export class VarForDeclarationNode extends ASTNode {
    public _type_VarForDeclarationNode: any;
    public readonly binding: ForBindingType;

    public constructor(range: Range, binding: ForBindingType) {
        super(range,"VarForDeclaration");
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }

    // ES6 Section 13.7.5.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    // ES6 Section 13.7.5.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        throw new Error("VarForDeclarationNode.varScopedDeclarations not implemented");
    }

    public static fromGeneric(node: ASTNode | null): VarForDeclarationNode {
        node = check.node(node,"VarForDeclaration",1);
        const binding = ForBindingType.fromGeneric(node.children[0]);
        return new VarForDeclarationNode(node.range,binding);
    }
}

export class LetForDeclarationNode extends ASTNode {
    public _type_LetForDeclarationNode: any;
    public readonly binding: ForBindingType;

    public constructor(range: Range, binding: ForBindingType) {
        super(range,"LetForDeclaration");
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }

    // ES6 Section 13.7.5.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): LetForDeclarationNode {
        node = check.node(node,"LetForDeclaration",1);
        const binding = ForBindingType.fromGeneric(node.children[0]);
        return new LetForDeclarationNode(node.range,binding);
    }
}

export class ConstForDeclarationNode extends ASTNode {
    public _type_ConstForDeclarationNode: any;
    public readonly binding: ForBindingType;

    public constructor(range: Range, binding: ForBindingType) {
        super(range,"ConstForDeclaration");
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }

    // ES6 Section 13.7.5.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): ConstForDeclarationNode {
        node = check.node(node,"ConstForDeclaration",1);
        const binding = ForBindingType.fromGeneric(node.children[0]);
        return new ConstForDeclarationNode(node.range,binding);
    }
}

// ES6 Section 13.8: The continue Statement

export class ContinueStatementNode extends StatementNode {
    public _type_ContinueStatementNode: any;
    public readonly labelIdentifier: LabelIdentifierNode | null;

    public constructor(range: Range, labelIdentifier: LabelIdentifierNode | null) {
        super(range,"ContinueStatement");
        this.labelIdentifier = labelIdentifier;
    }

    public get children(): (ASTNode | null)[] {
        return [this.labelIdentifier];
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ContinueStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ContinueStatementNode {
        node = check.node(node,"ContinueStatement",1);
        const labelIdentifier = (node.children[0] === null) ? null : LabelIdentifierNode.fromGeneric(node.children[0]);
        return new ContinueStatementNode(node.range,labelIdentifier);
    }
}

// ES6 Section 13.9: The break Statement

export class BreakStatementNode extends StatementNode {
    public _type_BreakStatementNode: any;
    public readonly labelIdentifier: LabelIdentifierNode | null;

    public constructor(range: Range, labelIdentifier: LabelIdentifierNode | null) {
        super(range,"BreakStatement");
        this.labelIdentifier = labelIdentifier;
    }

    public get children(): (ASTNode | null)[] {
        return [this.labelIdentifier];
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("BreakStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): BreakStatementNode {
        node = check.node(node,"BreakStatement",1);
        const labelIdentifier = (node.children[0] === null) ? null : LabelIdentifierNode.fromGeneric(node.children[0]);
        return new BreakStatementNode(node.range,labelIdentifier);
    }
}

// ES6 Section 13.10: The return Statement

export class ReturnStatementNode extends StatementNode {
    public _type_ReturnStatementNode: any;
    public readonly expr: ExpressionNode | null;

    public constructor(range: Range, expr: ExpressionNode | null) {
        super(range,"ReturnStatement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ReturnStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ReturnStatementNode {
        node = check.node(node,"ReturnStatement",1);
        const expr = (node.children[0] === null) ? null : ExpressionNode_fromGeneric(node.children[0]);
        return new ReturnStatementNode(node.range,expr);
    }
}

// ES6 Section 13.11: The with Statement

export class WithStatementNode extends StatementNode {
    public _type_WithStatementNode: any;
    public expr: ExpressionNode;
    public body: StatementNode;

    public constructor(range: Range, expr: ExpressionNode, body: StatementNode) {
        super(range,"WithStatement");
        this.expr = expr;
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr,this.body];
    }

    // ES6 Section 13.11.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.body.varDeclaredNames(out);
    }

    // ES6 Section 13.11.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.body.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("WithStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): WithStatementNode {
        node = check.node(node,"WithStatement",2);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        const body = StatementNode.fromGeneric(node.children[1]);
        return new WithStatementNode(node.range,expr,body);
    }
}

// ES6 Section 13.12: The switch Statement

export class SwitchStatementNode extends BreakableStatementNode {
    public _type_SwitchStatementNode: any;
    public readonly expr: ExpressionNode;
    public readonly cases: CaseBlockNode;

    public constructor(range: Range, expr: ExpressionNode, cases: CaseBlockNode) {
        super(range,"SwitchStatement");
        this.expr = expr;
        this.cases = cases;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr,this.cases];
    }

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.cases.varDeclaredNames(out);
    }

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.cases.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("SwitchStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): SwitchStatementNode {
        node = check.node(node,"SwitchStatement",2);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        const cases = CaseBlockNode.fromGeneric(node.children[1]);
        return new SwitchStatementNode(node.range,expr,cases);
    }
}

export class CaseClauseListNode extends ASTNode {
    public _type_CaseClauseListNode: any;
    public readonly elements: CaseClauseListItemNode[];

    public constructor(range: Range, elements: CaseClauseListItemNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        throw new Error("CaseClauseListNode.lexicallyDeclaredNames not implemented");
    }

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("CaseClauseListNode.lexicallyScopedDeclarations not implemented");
    }

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        for (const element of this.elements) {
            element.varDeclaredNames(out);
        }
    }

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        for (const element of this.elements)
            element.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): CaseClauseListNode {
        const list = check.list(node);
        const elements: CaseClauseListItemNode[] = [];
        for (const listElement of list.elements)
            elements.push(CaseClauseListItemNode.fromGeneric(listElement));
        return new CaseClauseListNode(list.range,elements);
    }
}

export abstract class CaseBlockNode extends ASTNode {
    public _type_CaseBlockNode: any;

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public abstract lexicallyDeclaredNames(out: string[]): void;

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public abstract lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void;

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public abstract varDeclaredNames(out: string[]): void;

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public abstract varScopedDeclarations(out: VarScopedDeclaration[]): void;

    public static fromGeneric(node: ASTNode | null): CaseBlockNode {
        if (node === null)
            throw new CannotConvertError("CaseBlockNode",node);
        switch (node.kind) {
            case "CaseBlock1":
                return CaseBlock1Node.fromGeneric(node);
            case "CaseBlock2":
                return CaseBlock2Node.fromGeneric(node);
            default:
                throw new CannotConvertError("CaseBlockNode",node);
        }
    }
};

export class CaseBlock1Node extends CaseBlockNode {
    public _type_CaseBlock1Node: any;
    public caseClauses: CaseClauseListNode;

    public constructor(range: Range, caseClauses: CaseClauseListNode) {
        super(range,"CaseBlock1");
        this.caseClauses = caseClauses;
    }

    public get children(): (ASTNode | null)[] {
        return [this.caseClauses];
    }

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        this.caseClauses.lexicallyDeclaredNames(out);
    }

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        this.caseClauses.lexicallyScopedDeclarations(out);
    }

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.caseClauses.varDeclaredNames(out);
    }

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.caseClauses.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): CaseBlock1Node {
        node = check.node(node,"CaseBlock1",1);
        const caseClauses = CaseClauseListNode.fromGeneric(node.children[0]);
        return new CaseBlock1Node(node.range,caseClauses);
    }
}

export class CaseBlock2Node extends CaseBlockNode {
    public _type_CaseBlock2Node: any;
    public caseClauses1: CaseClauseListNode | null;
    public defaultClause: DefaultClauseNode;
    public caseClauses2: CaseClauseListNode | null;

    public constructor(
        range: Range,
        caseClauses1: CaseClauseListNode | null,
        defaultClause: DefaultClauseNode,
        caseClauses2: CaseClauseListNode | null
    ) {
        super(range,"CaseBlock2");
        this.range = range;
        this.caseClauses1 = caseClauses1;
        this.defaultClause = defaultClause;
        this.caseClauses2 = caseClauses2;
    }

    public get children(): (ASTNode | null)[] {
        return [this.caseClauses1,this.defaultClause,this.caseClauses2];
    }

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        if (this.caseClauses1 != null)
            this.caseClauses1.lexicallyDeclaredNames(out);
        this.defaultClause.lexicallyDeclaredNames(out);
        if (this.caseClauses2 != null)
            this.caseClauses2.lexicallyDeclaredNames(out);
    }

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        if (this.caseClauses1 != null)
            this.caseClauses1.lexicallyScopedDeclarations(out);
        this.defaultClause.lexicallyScopedDeclarations(out);
        if (this.caseClauses2 != null)
            this.caseClauses2.lexicallyScopedDeclarations(out);
    }

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        if (this.caseClauses1 != null)
            this.caseClauses1.varDeclaredNames(out);
        this.defaultClause.varDeclaredNames(out);
        if (this.caseClauses2 != null)
            this.caseClauses2.varDeclaredNames(out);
    }

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        if (this.caseClauses1 != null)
            this.caseClauses1.varScopedDeclarations(out);
        this.defaultClause.varScopedDeclarations(out);
        if (this.caseClauses2 != null)
            this.caseClauses2.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): CaseBlock2Node {
        node = check.node(node,"CaseBlock2",3);
        const caseClauses1 = (node.children[0] === null) ? null : CaseClauseListNode.fromGeneric(node.children[0]);
        const defaultClause = DefaultClauseNode.fromGeneric(node.children[1]);
        const caseClauses2 = (node.children[2] === null) ? null : CaseClauseListNode.fromGeneric(node.children[2]);
        return new CaseBlock2Node(node.range,caseClauses1,defaultClause,caseClauses2);
    }
}

export abstract class CaseClauseListItemNode extends ASTNode {
    public _type_CaseClauseListItemNode: any;

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public abstract lexicallyDeclaredNames(out: string[]): void;

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public abstract lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void;

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public abstract varDeclaredNames(out: string[]): void;

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public abstract varScopedDeclarations(out: VarScopedDeclaration[]): void;

    public static fromGeneric(node: ASTNode | null): CaseClauseListItemNode {
        try { return CaseClauseNode.fromGeneric(node); } catch (e) {}
        try { return DefaultClauseNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("CaseClauseListItemNode",node);
    }
}

export class CaseClauseNode extends CaseClauseListItemNode {
    public _type_CaseClauseNode: any;
    public readonly expr: ExpressionNode;
    public readonly statements: StatementListNode;

    public constructor(range: Range, expr: ExpressionNode, statements: StatementListNode) {
        super(range,"CaseClause");
        this.expr = expr;
        this.statements = statements;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr,this.statements];
    }

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        this.statements.lexicallyDeclaredNames(out);
    }

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        this.statements.lexicallyScopedDeclarations(out);
    }

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.statements.varDeclaredNames(out);
    }

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.statements.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): CaseClauseNode {
        node = check.node(node,"CaseClause",2);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        const statements = StatementListNode.fromGeneric(node.children[1]);
        return new CaseClauseNode(node.range,expr,statements);
    }
}

export class DefaultClauseNode extends CaseClauseListItemNode {
    public _type_DefaultClauseNode: any;
    public readonly statements: StatementListNode;

    public constructor(range: Range, statements: StatementListNode) {
        super(range,"DefaultClause");
        this.statements = statements;
    }

    public get children(): (ASTNode | null)[] {
        return [this.statements];
    }

    // ES6 Section 13.12.5: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        this.statements.lexicallyDeclaredNames(out);
    }

    // ES6 Section 13.12.6: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        this.statements.lexicallyScopedDeclarations(out);
    }

    // ES6 Section 13.12.7 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.statements.varDeclaredNames(out);
    }

    // ES6 Section 13.12.8 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.statements.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): DefaultClauseNode {
        node = check.node(node,"DefaultClause",1);
        const statements = StatementListNode.fromGeneric(node.children[0]);
        return new DefaultClauseNode(node.range,statements);
    }
}

// ES6 Section 13.13: Labelled Statements

type LabelledStatementItemType = StatementNode | FunctionDeclarationNode;
const LabelledStatementItemType = {
    fromGeneric(node: ASTNode | null): LabelledStatementItemType {
        try { return StatementNode.fromGeneric(node); } catch (e) {}
        try { return FunctionDeclarationNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("LabelledStatementItemType",node);
    }
};

export class LabelledStatementNode extends StatementNode {
    public _type_LabelledStatementNode: any;
    public readonly ident: LabelIdentifierNode;
    public readonly item: LabelledStatementItemType;

    public constructor(
        range: Range,
        ident: LabelIdentifierNode,
        item: LabelledStatementItemType
    ) {
        super(range,"LabelledStatement");
        this.ident = ident;
        this.item = item;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.item];
    }

    // ES6 Section 13.13.6: Static Semantics: LexicallyDeclaredNames
    public lexicallyDeclaredNames(out: string[]): void {
        if (this.item instanceof FunctionDeclarationNode)
            this.item.lexicallyDeclaredNames(out);
    }

    // ES6 Section 13.13.7: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        if (this.item instanceof FunctionDeclarationNode)
            out.push(this.item);
    }

    // ES6 Section 13.13.10: Static Semantics: TopLevelVarDeclaredNames
    public topLevelVarDeclaredNames(out: string[]): void {
        if (this.item instanceof LabelledStatementNode)
            this.item.topLevelVarDeclaredNames(out);
        else if (this.item instanceof StatementNode)
            this.item.varDeclaredNames(out);
        else if (this.item instanceof FunctionDeclarationNode)
            this.item.boundNames(out);
    }

    // ES6 Section 13.13.11: Static Semantics: TopLevelVarScopedDeclarations
    public topLevelVarScopedDeclarations(out: VarScopedDeclaration[]): void {
        if (this.item instanceof LabelledStatementNode)
            this.item.topLevelVarScopedDeclarations(out);
        else if (this.item instanceof StatementNode)
            this.item.varScopedDeclarations(out);
        else if (this.item instanceof FunctionDeclarationNode)
            out.push(this.item);
    }

    // ES6 Section 13.13.12 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        if (!(this.item instanceof FunctionDeclarationNode))
            this.item.varDeclaredNames(out);
    }

    // ES6 Section 13.13.13 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.item.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("LabelledStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): LabelledStatementNode {
        node = check.node(node,"LabelledStatement",2);
        const ident = LabelIdentifierNode.fromGeneric(node.children[0]);
        const item = LabelledStatementItemType.fromGeneric(node.children[1]);
        return new LabelledStatementNode(node.range,ident,item);
    }
}

// ES6 Section 13.14: The throw Statement

export class ThrowStatementNode extends StatementNode {
    public _type_ThrowStatementNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ThrowStatement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ThrowStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ThrowStatementNode {
        node = check.node(node,"ThrowStatement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new ThrowStatementNode(node.range,expr);
    }
}

// ES6 Section 13.15: The try Statement

export class TryStatementNode extends StatementNode {
    public _type_TryStatementNode: any;
    public tryNode: BlockNode;
    public catchNode: CatchNode | null;
    public finallyNode: FinallyNode | null;

    public constructor(
        range: Range,
        tryNode: BlockNode,
        catchNode: CatchNode | null,
        finallyNode: FinallyNode | null
    ) {
        super(range,"TryStatement");
        this.tryNode = tryNode;
        this.catchNode = catchNode;
        this.finallyNode = finallyNode;
    }

    public get children(): (ASTNode | null)[] {
        return [this.tryNode,this.catchNode,this.finallyNode];
    }

    // ES6 Section 13.15.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.tryNode.varDeclaredNames(out);
        if (this.catchNode != null)
            this.catchNode.varDeclaredNames(out);
        if (this.finallyNode != null)
            this.finallyNode.varDeclaredNames(out);
    }

    // ES6 Section 13.15.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.tryNode.varScopedDeclarations(out);
        if (this.catchNode != null)
            this.catchNode.varScopedDeclarations(out);
        if (this.finallyNode != null)
            this.finallyNode.varScopedDeclarations(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("TryStatementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): TryStatementNode {
        node = check.node(node,"TryStatement",3);
        const tryNode = BlockNode.fromGeneric(node.children[0]);
        const catchNode = (node.children[1] === null) ? null : CatchNode.fromGeneric(node.children[1]);
        const finallyNode = (node.children[2] === null) ? null : FinallyNode.fromGeneric(node.children[2]);
        return new TryStatementNode(node.range,tryNode,catchNode,finallyNode);
    }
}

export class CatchNode extends ASTNode {
    public _type_CatchNode: any;
    public readonly param: CatchParameterType;
    public readonly block: BlockNode;

    public constructor(range: Range, param: CatchParameterType, block: BlockNode) {
        super(range,"Catch");
        this.param = param;
        this.block = block;
    }

    public get children(): (ASTNode | null)[] {
        return [this.param,this.block];
    }

    // ES6 Section 13.15.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.block.varDeclaredNames(out);
    }

    // ES6 Section 13.15.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.block.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): CatchNode {
        node = check.node(node,"Catch",2);
        const param = CatchParameterType.fromGeneric(node.children[0]);
        const block = BlockNode.fromGeneric(node.children[1]);
        return new CatchNode(node.range,param,block);
    }
}

export class FinallyNode extends ASTNode {
    public _type_FinallyNode: any;
    public readonly block: BlockNode;

    public constructor(range: Range, block: BlockNode) {
        super(range,"Finally");
        this.block = block;
    }

    public get children(): (ASTNode | null)[] {
        return [this.block];
    }

    // ES6 Section 13.15.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // FIXME: Not sure about this one. The spec doesn't explicitly say that we should include
        // the varDeclaredNames of block, but there seems to be an implicit notion that if the
        // RHS of a production consists of only one non-terminal, then you should apply the rule
        // for that non-terminal (in this case, Block).
        this.block.varDeclaredNames(out);
    }

    // ES6 Section 13.15.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.block.varScopedDeclarations(out);
    }

    public static fromGeneric(node: ASTNode | null): FinallyNode {
        node = check.node(node,"Finally",1);
        const block = BlockNode.fromGeneric(node.children[0]);
        return new FinallyNode(node.range,block);
    }
}

// ES6 Section 13.16: The debugger statement

export class DebuggerStatementNode extends StatementNode {
    public _type_DebuggerStatementNode: any;

    public constructor(range: Range) {
        super(range,"DebuggerStatement");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("DebuggerStatementNode.evaluate not implemented");
    }

    // ES6 Section 13.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 13.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public static fromGeneric(node: ASTNode | null): DebuggerStatementNode {
        node = check.node(node,"DebuggerStatement",0);
        return new DebuggerStatementNode(node.range);
    }
}
