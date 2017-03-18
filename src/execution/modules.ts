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
    IdentifierNode,
    BindingIdentifierNode,
    check,
    CannotConvertError,
    VarScopedDeclaration,
    LexicallyScopedDeclaration,
} from "../parser/ast";
import {
    ExpressionNode_fromGeneric,
    StringLiteralNode,
} from "./expressions";
import {
    DeclarationNode_fromGeneric,
    StatementListItemNode_fromGeneric,
    VarNode,
} from "./statements";
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
    Realm,
    LexicalEnvironment,
} from "../runtime/datatypes";
import {
    ExecutionContext,
} from "../runtime/08-03-context";
import {
    RealmImpl,
} from "../runtime/08-02-realm";
import {
    DeclarativeEnvironmentRecord,
    NewModuleEnvironment,
} from "../runtime/08-01-environment";

export type ModuleItemType = ImportNode | ExportNode | StatementListItemNode;
export const ModuleItemType = {
    fromGeneric(node: ASTNode | null): ModuleItemType {
        if (node === null)
            throw new CannotConvertError("ModuleItemType",node);
        switch (node.kind) {
            case "ImportFrom":
            case "ImportModule":
                return ImportNode.fromGeneric(node);
            case "ExportDefault":
            case "ExportStar":
            case "ExportPlain":
            case "ExportVariable":
            case "ExportDeclaration":
            case "ExportFrom":
            case "ExportClause":
                return ExportNode.fromGeneric(node);
            default:
                return StatementListItemNode_fromGeneric(node);
        }
    }
};

// ES6 Chapter 15: ECMAScript Language: Scripts and Modules

// ES6 Section 15.1: Scripts

export class ScriptNode extends ASTNode {
    public _type_ScriptNode: any;
    public readonly body: ASTNode;

    public constructor(range: Range, body: ASTNode) {
        super(range,"Script");
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.body];
    }

    // ES6 Section 15.1.4: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("ScriptNode.lexicallyScopedDeclarations not implemented");
    }

    // ES6 Section 15.1.5 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // FIXME: Return TopLevelVarDeclaredNames of StatementList
        throw new Error("ScriptNode.varDeclaredNames not implemented");
    }

    // ES6 Section 15.1.6 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // FIXME: Return TopLevelVarScopedDeclarations of StatementList.
        throw new Error('ScriptNode.varScopedDeclarations not implemented');
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ScriptNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ScriptNode {
        node = check.node(node,"Script",1);
        const body = node.children[0];
        if (body === null)
            throw new CannotConvertError("ASTNode",body);
        return new ScriptNode(node.range,body);
    }
}

// ES6 Section 15.2: Modules

export class ModuleItemListNode extends ASTNode {
    public _type_ModuleItemListNode: any;
    public readonly elements: ModuleItemType[];

    public constructor(range: Range, elements: ModuleItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 15.2.1.12 Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        // FIXME: This is not what the spec says (but it's close)
        for (const element of this.elements) {
            if (element instanceof ImportNode) {
                // don't include in list
            }
            else if (element instanceof DeclarationNode) {
                out.push(element);
            }
        }
    }

    // ES6 Section 15.2.1.13 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        for (const element of this.elements)
            element.varDeclaredNames(out);
    }

    // ES6 Section 15.2.1.14 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        for (const element of this.elements) {
            element.varScopedDeclarations(out);
        }
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        let result: NormalCompletion<JSValue | Reference | Empty> | null = null;
        for (const elem of this.elements) {
            const comp = elem.evaluate(ctx);
            if (!(comp instanceof NormalCompletion))
                return comp;
            result = comp;
        }

        if (result === null) // Will only be true if the list is empty
            return new NormalCompletion(new JSUndefined());

        const value = result.value;
        if (value instanceof Empty)
            return new NormalCompletion(new JSUndefined());

        return new NormalCompletion(value);
    }

    public static fromGeneric(node: ASTNode | null): ModuleItemListNode {
        const list = check.list(node);
        const elements: ModuleItemType[] = [];
        for (const listElement of list.elements)
            elements.push(ModuleItemType.fromGeneric(listElement));
        return new ModuleItemListNode(list.range,elements);
    }
}

export class ModuleNode extends ASTNode {
    public _type_ModuleNode: any;
    public realm: Realm;
    public readonly body: ModuleItemListNode;
    public environment: LexicalEnvironment | undefined = undefined;
    public evaluated: boolean = false;

    public constructor(range: Range, body: ModuleItemListNode, realm: Realm) {
        super(range,"Module");
        this.body = body;
        this.realm = realm;
    }

    public get children(): (ASTNode | null)[] {
        return [this.body];
    }

    // ES6 Section 15.2.1.13 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 15.2.1.14 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.body.varScopedDeclarations(out);
    }

    // ES6 Section 15.2.1.16.4 ModuleDeclarationInstantiation( ) Concrete Method
    private moduleDeclarationInstantiation(): Completion<JSValue | Reference | Empty> {

        // 1. Let module be this Source Text Module Record.
        const module = this;

        // 2. Let realm be module.[[Realm]].
        // 3. Assert: realm is not undefined.
        const realm = module.realm;

        // 4. Let code be module.[[ECMAScriptCode]].
        const code = this.body;

        // 5. If module.[[Environment]] is not undefined, return NormalCompletion(empty).
        if (module.environment != null)
            return new NormalCompletion(new Empty());

        // 6. Let env be NewModuleEnvironment(realm.[[globalEnv]]).
        const env = NewModuleEnvironment(realm, realm.globalEnv);

        // 7. Set module.[[Environment]] to env.
        module.environment = env;

        // 8. For each String required that is an element of module.[[RequestedModules]] do,
        // TODO...
            // a. NOTE: Before instantiating a module, all of the modules it requested must be available. An implementation may perform this test at any time prior to this point,
            // b. Let requiredModule be HostResolveImportedModule(module, required).
            // c. ReturnIfAbrupt(requiredModule).
            // d. Let status be requiredModule.ModuleDeclarationInstantiation().
            // e. ReturnIfAbrupt(status).

        // 9. For each ExportEntry Record e in module.[[IndirectExportEntries]], do
        // TODO...
            // a. Let resolution be module.ResolveExport(e.[[ExportName]], «‍ », «‍ »).
            // b. ReturnIfAbrupt(resolution).
            // c. If resolution is null or resolution is "ambiguous", throw a SyntaxError exception.

        // 10. Assert: all named exports from module are resolvable.
        // TODO

        // 11. Let envRec be env’s EnvironmentRecord.
        const envRec = env.record;

        // 12. For each ImportEntry Record in in module.[[ImportEntries]], do
        // TODO...
            // a. Let importedModule be HostResolveImportedModule(module, in.[[ModuleRequest]]).
            // b. ReturnIfAbrupt(importedModule).
            // c. If in.[[ImportName]] is "*", then
                // i. Let namespace be GetModuleNamespace(importedModule).
                // ii. ReturnIfAbrupt(module).
                // iii. Let status be envRec.CreateImmutableBinding(in.[[LocalName]], true).
                // iv. Assert: status is not an abrupt completion.
                // v. Call envRec.InitializeBinding(in.[[LocalName]], namespace).
            // d. else,
                // i. Let resolution be importedModule.ResolveExport(in.[[ImportName]], « », «‍ »).
                // ii. ReturnIfAbrupt(resolution).
                // iii. If resolution is null or resolution is "ambiguous", throw a SyntaxError exception.
                // iv. Call envRec.CreateImportBinding(in.[[LocalName]], resolution.[[module]], resolution.[[bindingName]]).

        // 13. Let varDeclarations be the VarScopedDeclarations of code.
        const varDeclarations: VarScopedDeclaration[] = [];
        code.varScopedDeclarations(varDeclarations);
        // console.log("varDeclarations.length = "+varDeclarations.length);

        // Note: For var-scoped declarations we use the portion of the algorithm from the ES7 spec,
        // which corrects a defect in the ES6 spec which would fail when multiple variables or
        // functions were declared with the same name
        const declaredVarNames: string[] = [];

        // 14. For each element d in varDeclarations do
        for (const d of varDeclarations) {
            const boundNames: string[] = [];
            d.boundNames(boundNames);

            // a. For each element dn of the BoundNames of d do
            for (const dn of boundNames) {
                if (declaredVarNames.indexOf(dn) < 0) {
                    // console.log("variable name " + JSON.stringify(dn));
                    // i. Let status be envRec.CreateMutableBinding(dn, false).
                    // console.log("Creating mutable binding for "+dn);
                    let status = envRec.CreateMutableBinding(dn, false);
                    // envRec.print("");
                    // ii. Assert: status is not an abrupt completion.
                    if (!(status instanceof NormalCompletion))
                        return status;
                    // iii. Call envRec.InitializeBinding(dn, undefined).
                    status = envRec.InitializeBinding(dn, new JSUndefined());
                    if (!(status instanceof NormalCompletion))
                        return status;

                    declaredVarNames.push(dn);
                }
            }
        }

        // 15. Let lexDeclarations be the LexicallyScopedDeclarations of code.
        const lexDeclarations: LexicallyScopedDeclaration[] = [];
        code.lexicallyScopedDeclarations(lexDeclarations);
        // console.log("lexDeclarations.length = "+lexDeclarations.length);

        // 16. For each element d in lexDeclarations do
        for (const d of lexDeclarations) {
            const boundNames: string[] = [];
            d.boundNames(boundNames);

            // a. For each element dn of the BoundNames of d do
            for (const dn of boundNames) {
                // console.log("lexical name " + JSON.stringify(dn));
                // i. If IsConstantDeclaration of d is true, then
                let status: Completion<void>;
                if (d.isConstantDeclaration()) {
                    // 1. Let status be envRec.CreateImmutableBinding(dn, true).
                    // console.log("Creating immutable binding for "+dn);
                    status = envRec.CreateImmutableBinding(dn, true);
                    // envRec.print("");
                }
                // ii. Else,
                else {
                    // 1. Let status be envRec.CreateMutableBinding(dn, false).
                    // console.log("Creating mutable binding for "+dn);
                    status = envRec.CreateMutableBinding(dn, false);
                    // envRec.print("");
                }

                // iii. Assert: status is not an abrupt completion.
                if (!(status instanceof NormalCompletion))
                    return status;

                // iv. If d is a GeneratorDeclaration production or a FunctionDeclaration production, then
                if ((d instanceof GeneratorDeclarationNode) || (d instanceof FunctionDeclarationNode)) {
                    // 1. Let fo be the result of performing InstantiateFunctionObject for d with argument env.
                    const foComp = d.instantiateFunctionObject(realm,env);
                    if (!(foComp instanceof NormalCompletion))
                        return foComp;
                    const fo = foComp.value;

                    // 2. Call envRec.InitializeBinding(dn, fo).
                    status = envRec.InitializeBinding(dn, fo);
                    if (!(status instanceof NormalCompletion))
                        return status;
                }
            }
        }

        // 17. Return NormalCompletion(empty).
        return new NormalCompletion(new Empty());
    }

    // ES6 Section 15.2.1.16.5 ModuleEvaluation() Concrete Method
    public moduleEvaluation(): Completion<JSValue | Reference | Empty> {
        // 1. Let module be this Source Text Module Record.
        const module = this;

        // 2. Assert: ModuleDeclarationInstantiation has already been invoked on module and successfully completed.
        // ---

        // 3. Assert: module.[[Realm]] is not undefined.
        // ---

        // 4. If module.[[Evaluated]] is true, return undefined.
        if (module.evaluated)
            return new NormalCompletion(new JSUndefined());

        // 5. Set module.[[Evaluated]] to true.
        module.evaluated = true;

        // 6. For each String required that is an element of module.[[RequestedModules]] do,
        // TODO...
            // a. Let requiredModule be HostResolveImportedModule(module, required).
            // b. ReturnIfAbrupt(requiredModule).
            // c. Let status be requiredModule.ModuleEvaluation().
            // d. ReturnIfAbrupt(status).

        // 7. Let moduleCxt be a new ECMAScript code execution context.
        // 8. Set the Function of moduleCxt to null.
        // 9. Set the Realm of moduleCxt to module.[[Realm]].
        // 10. Assert: module has been linked and declarations in its module environment have been instantiated.
        // 11. Set the VariableEnvironment of moduleCxt to module.[[Environment]].
        // 12. Set the LexicalEnvironment of moduleCxt to module.[[Environment]].
        if (module.environment === undefined) {
            throw new Error("Module environment has not been initialized");
        }
        const moduleCxt = new ExecutionContext(module.realm,new JSNull(),module.environment);

        // 13. Suspend the currently running execution context.
        // 14. Push moduleCxt on to the execution context stack; moduleCxt is now the running execution context.
        // TODO

        // console.log("======== before evaluating module ========");
        // for (let curEnv: LexicalEnvironment | null = module.environment; curEnv != null; curEnv = curEnv.outer) {
        //     curEnv.record.print("");
        //     if (curEnv.outer != null)
        //         console.log("");
        // }
        // console.log("==========================================");

        // 15. Let result be the result of evaluating module.[[ECMAScriptCode]].
        const result = module.evaluate(moduleCxt);

        // 16. Suspend moduleCxt and remove it from the execution context stack.
        // 17. Resume the context that is now on the top of the execution context stack as the running execution context.
        // TODO

        // 18. Return Completion(result).
        return result;
    }

    // ES6 Section 15.2.1.19 Runtime Semantics: TopLevelModuleEvaluationJob ( sourceText)
    public topLevelModuleEvaluationJob(): Completion<JSValue | Reference | Empty> {
        // FIXME: Implement based on spec
        let status = this.moduleDeclarationInstantiation();
        if (!(status instanceof NormalCompletion))
            return status;
        status = this.moduleEvaluation();
        return status;
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        return this.body.evaluate(ctx);
    }

    public static fromGeneric(node: ASTNode | null, realm: Realm): ModuleNode {
        node = check.node(node,"Module",1);
        const body = ModuleItemListNode.fromGeneric(node.children[0]);
        return new ModuleNode(node.range,body,realm);
    }
}

// ES6 Section 15.2.1: Module Semantics

// ES6 Section 15.2.2: Imports

export class ImportsListNode extends ASTNode {
    public _type_ImportsListNode: any;
    public readonly elements: ImportListItemNode[];

    public constructor(range: Range, elements: ImportListItemNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        for (const element of this.elements)
            element.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): ImportsListNode {
        const list = check.list(node);
        const elements: ImportListItemNode[] = [];
        for (const listElement of list.elements)
            elements.push(ImportListItemNode.fromGeneric(listElement));
        return new ImportsListNode(list.range,elements);
    }
}

export abstract class ImportNode extends ASTNode {
    public _type_ImportNode: any;

    // ES6 Section 15.2.2.2 Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        // No lexcially scoped declarations for this node type (???)
    }

    // ES6 Section 15.2.1.13 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type
    }

    // ES6 Section 15.2.1.14 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type
    }

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;

    public static fromGeneric(node: ASTNode | null): ImportNode {
        node = check.nodeNotNull(node);
        switch (node.kind) {
            case "ImportFrom":
                return ImportFromNode.fromGeneric(node);
            case "ImportModule":
                return ImportModuleNode.fromGeneric(node);
            default:
                throw new CannotConvertError("ImportNode",node);
        }
    }
}

export class ImportFromNode extends ImportNode {
    public _type_ImportFromNode: any;
    public readonly importClause: ImportClauseNode;
    public readonly fromClause: StringLiteralNode;

    public constructor(range: Range, importClause: ImportClauseNode, fromClause: StringLiteralNode) {
        super(range,"ImportFrom");
        this.importClause = importClause;
        this.fromClause = fromClause;
    }

    public get children(): (ASTNode | null)[] {
        return [this.importClause,this.fromClause];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.importClause.boundNames(out);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // Do nothing
        return new NormalCompletion(new Empty());
    }

    public static fromGeneric(node: ASTNode | null): ImportFromNode {
        node = check.node(node,"ImportFrom",2);
        const importClause = ImportClauseNode.fromGeneric(node.children[0]);
        const fromClause = StringLiteralNode.fromGeneric(node.children[1]);
        return new ImportFromNode(node.range,importClause,fromClause);
    }
}

export class ImportModuleNode extends ImportNode {
    public _type_ImportModuleNode: any;
    public readonly specifier: StringLiteralNode;

    public constructor(range: Range, specifier: StringLiteralNode) {
        super(range,"ImportModule");
        this.specifier = specifier;
    }

    public get children(): (ASTNode | null)[] {
        return [this.specifier];
    }

    // ES6 Section 15.2.2.2 Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        // No bound names for this node type
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        // Do nothing
        return new NormalCompletion(new Empty());
    }

    public static fromGeneric(node: ASTNode | null): ImportModuleNode {
        node = check.node(node,"ImportModule",1);
        const specifier = StringLiteralNode.fromGeneric(node.children[0]);
        return new ImportModuleNode(node.range,specifier);
    }
}

export abstract class ImportClauseNode extends ASTNode {
    public _type_ImportClauseNode: any;

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    public static fromGeneric(node: ASTNode | null): ImportClauseNode {
        if (node === null)
            throw new CannotConvertError("ImportClauseNode",node);
        switch (node.kind) {
            case "DefaultAndNameSpaceImports":
                return DefaultAndNameSpaceImportsNode.fromGeneric(node);
            case "DefaultAndNamedImports":
                return DefaultAndNamedImportsNode.fromGeneric(node);
            case "DefaultImport":
                return DefaultImportNode.fromGeneric(node);
            case "NameSpaceImport":
                return NameSpaceImportNode.fromGeneric(node);
            case "NamedImports":
                return NamedImportsNode.fromGeneric(node);
            default:
                throw new CannotConvertError("ImportClauseNode",node);
        }
    }
}

export class DefaultAndNameSpaceImportsNode extends ImportClauseNode {
    public _type_DefaultAndNameSpaceImportsNode: any;
    public readonly defaultBinding: BindingIdentifierNode;
    public readonly nameSpaceImport: NameSpaceImportNode;

    public constructor(
        range: Range,
        defaultBinding: BindingIdentifierNode,
        nameSpaceImport: NameSpaceImportNode
    ) {
        super(range,"DefaultAndNameSpaceImports");
        this.defaultBinding = defaultBinding;
        this.nameSpaceImport = nameSpaceImport;
    }

    public get children(): (ASTNode | null)[] {
        return [this.defaultBinding,this.nameSpaceImport];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.defaultBinding.boundNames(out);
        this.nameSpaceImport.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): DefaultAndNameSpaceImportsNode {
        node = check.node(node,"DefaultAndNameSpaceImports",2);
        const defaultBinding = BindingIdentifierNode.fromGeneric(node.children[0]);
        const nameSpaceImport = NameSpaceImportNode.fromGeneric(node.children[1]);
        return new DefaultAndNameSpaceImportsNode(node.range,defaultBinding,nameSpaceImport);
    }
}

export class DefaultAndNamedImportsNode extends ImportClauseNode {
    public _type_DefaultAndNamedImportsNode: any;
    public readonly defaultBinding: BindingIdentifierNode;
    public readonly namedImports: NamedImportsNode;

    public constructor(
        range: Range,
        defaultBinding: BindingIdentifierNode,
        namedImports: NamedImportsNode
    ) {
        super(range,"DefaultAndNamedImports");
        this.defaultBinding = defaultBinding;
        this.namedImports = namedImports;
    }

    public get children(): (ASTNode | null)[] {
        return [this.defaultBinding,this.namedImports];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.defaultBinding.boundNames(out);
        this.namedImports.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): DefaultAndNamedImportsNode {
        node = check.node(node,"DefaultAndNamedImports",2);
        const defaultBinding = BindingIdentifierNode.fromGeneric(node.children[0]);
        const namedImports = NamedImportsNode.fromGeneric(node.children[1]);
        return new DefaultAndNamedImportsNode(node.range,defaultBinding,namedImports);
    }
}

export class DefaultImportNode extends ImportClauseNode {
    public _type_DefaultImportNode: any;
    public readonly binding: BindingIdentifierNode;

    public constructor(range: Range, binding: BindingIdentifierNode) {
        super(range,"DefaultImport");
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): DefaultImportNode {
        node = check.node(node,"DefaultImport",1);
        const binding = BindingIdentifierNode.fromGeneric(node.children[0]);
        return new DefaultImportNode(node.range,binding);
    }
}

export class NameSpaceImportNode extends ImportClauseNode {
    public _type_NameSpaceImportNode: any;
    public readonly binding: BindingIdentifierNode;

    public constructor(range: Range, binding: BindingIdentifierNode) {
        super(range,"NameSpaceImport");
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): NameSpaceImportNode {
        node = check.node(node,"NameSpaceImport",1);
        const binding = BindingIdentifierNode.fromGeneric(node.children[0]);
        return new NameSpaceImportNode(node.range,binding);
    }
}

export class NamedImportsNode extends ImportClauseNode {
    public _type_NamedImportsNode: any;
    public readonly imports: ImportsListNode;

    public constructor(range: Range, imports: ImportsListNode) {
        super(range,"NamedImports");
        this.imports = imports;
    }

    public get children(): (ASTNode | null)[] {
        return [this.imports];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.imports.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): NamedImportsNode {
        node = check.node(node,"NamedImports",1);
        const imports = ImportsListNode.fromGeneric(node.children[0]);
        return new NamedImportsNode(node.range,imports);
    }
}

export abstract class ImportListItemNode extends ASTNode {
    public _type_ImportListItemNode: any;

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    public static fromGeneric(node: ASTNode | null): ImportListItemNode {
        try { return ImportAsSpecifierNode.fromGeneric(node); } catch (e) {}
        try { return ImportSpecifierNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ImportListItemNode",node);
    }
}

export class ImportSpecifierNode extends ImportListItemNode {
    public _type_ImportSpecifierNode: any;
    public readonly binding: BindingIdentifierNode;

    public constructor(range: Range, binding: BindingIdentifierNode) {
        super(range,"ImportSpecifier");
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): ImportSpecifierNode {
        node = check.node(node,"ImportSpecifier",1);
        const binding = BindingIdentifierNode.fromGeneric(node.children[0]);
        return new ImportSpecifierNode(node.range,binding);
    }
}

export class ImportAsSpecifierNode extends ImportListItemNode {
    public _type_ImportAsSpecifierNode: any;
    public readonly name: IdentifierNode;
    public readonly binding: BindingIdentifierNode;

    public constructor(range: Range, name: IdentifierNode, binding: BindingIdentifierNode) {
        super(range,"ImportAsSpecifier");
        this.name = name;
        this.binding = binding;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.binding];
    }

    // ES6 Section 15.2.2.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.binding.boundNames(out);
    }

    public static fromGeneric(node: ASTNode | null): ImportAsSpecifierNode {
        node = check.node(node,"ImportAsSpecifier",2);
        const name = IdentifierNode.fromGeneric(node.children[0]);
        const binding = BindingIdentifierNode.fromGeneric(node.children[1]);
        return new ImportAsSpecifierNode(node.range,name,binding);
    }
}

// ES6 Section 15.2.3: Exports

export class ExportsListNode extends ASTNode {
    public _type_ExportsListNode: any;
    public readonly elements: ExportsListItemNode[];

    public constructor(range: Range, elements: ExportsListItemNode[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): ExportsListNode {
        const list = check.list(node);
        const elements: ExportsListItemNode[] = [];
        for (const listElement of list.elements)
            elements.push(ExportsListItemNode.fromGeneric(listElement));
        return new ExportsListNode(list.range,elements);
    }
}

export abstract class ExportNode extends ASTNode {
    public _type_ExportNode: any;

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public abstract boundNames(out: string[]): void;

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public abstract lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void;

    // ES6 Section 15.2.1.13 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        // No var declared names for this node type, except for ExportVariableNode, which overrides
        // this method.
    }

    // ES6 Section 15.2.1.14 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        // No var scoped declarations for this node type, except for ExportVariableNode, which
        // overrides this method.
    }

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty>;

    public static fromGeneric(node: ASTNode | null): ExportNode {
        if (node === null)
            throw new CannotConvertError("ExportClauseNode",node);
        switch (node.kind) {
            case "ExportDefault":
                return ExportDefaultNode.fromGeneric(node);
            case "ExportStar":
                return ExportStarNode.fromGeneric(node);
            case "ExportPlain":
                return ExportPlainNode.fromGeneric(node);
            case "ExportVariable":
                return ExportVariableNode.fromGeneric(node);
            case "ExportDeclaration":
                return ExportDeclarationNode.fromGeneric(node);
            case "ExportFrom":
                return ExportFromNode.fromGeneric(node);
            case "ExportClause":
                return ExportClauseNode.fromGeneric(node);
            default:
                throw new CannotConvertError("ExportNode",node);
        }
    }
}

type DeclarationOrExpressionType = DeclarationNode | ExpressionNode;
const DeclarationOrExpressionType = {
    fromGeneric(node: ASTNode | null): DeclarationOrExpressionType {
        if (node === null)
            throw new CannotConvertError("DeclarationOrExpressionType",node);
        switch (node.kind) {
            case "FunctionDeclaration":
            case "GeneratorDeclaration":
            case "ClassDeclaration":
            case "Let":
            case "Const":
                return DeclarationNode_fromGeneric(node);
            default:
                return ExpressionNode_fromGeneric(node);
        }
    }
};

export class ExportDefaultNode extends ExportNode {
    public _type_ExportDefaultNode: any;
    public readonly decl: DeclarationOrExpressionType;

    public constructor(range: Range, decl: DeclarationOrExpressionType) {
        super(range,"ExportDefault");
        this.decl = decl;
    }

    public get children(): (ASTNode | null)[] {
        return [this.decl];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        if (this.decl instanceof DeclarationNode)
            this.decl.boundNames(out);
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        if (this.decl instanceof HoistableDeclarationNode)
            out.push(this.decl);
        else if (this.decl instanceof ClassDeclarationNode)
            out.push(this.decl);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportDefaultNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportDefaultNode {
        node = check.node(node,"ExportDefault",1);
        const decl = DeclarationOrExpressionType.fromGeneric(node.children[0]);
        return new ExportDefaultNode(node.range,decl);
    }
}

export class ExportStarNode extends ExportNode {
    public _type_ExportStarNode: any;
    public readonly from: StringLiteralNode;

    public constructor(range: Range, from: StringLiteralNode) {
        super(range,"ExportStar");
        this.from = from;
    }

    public get children(): (ASTNode | null)[] {
        return [this.from];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        // No bound names for this node type
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("ExportStarNode.lexicallyScopedDeclarations not implemented");
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportStarNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportStarNode {
        node = check.node(node,"ExportStar",1);
        const from = StringLiteralNode.fromGeneric(node.children[0]);
        return new ExportStarNode(node.range,from);
    }
}

export class ExportPlainNode extends ExportNode {
    public _type_ExportPlainNode: any;
    public readonly clause: ExportClauseNode;

    public constructor(range: Range, clause: ExportClauseNode) {
        super(range,"ExportPlain");
        this.clause = clause;
    }

    public get children(): (ASTNode | null)[] {
        return [this.clause];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        // No bound names for this node type
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("ExportPlainNode.lexicallyScopedDeclarations not implemented");
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportPlainNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportPlainNode {
        node = check.node(node,"ExportPlain",1);
        const clause = ExportClauseNode.fromGeneric(node.children[0]);
        return new ExportPlainNode(node.range,clause);
    }
}

export class ExportVariableNode extends ExportNode {
    public _type_ExportVariableNode: any;
    public readonly variable: VarNode;

    public constructor(range: Range, variable: VarNode) {
        super(range,"ExportVariable");
        this.variable = variable;
    }

    public get children(): (ASTNode | null)[] {
        return [this.variable];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.variable.boundNames(out);
    }

    // ES6 Section 15.2.1.13 Static Semantics: VarDeclaredNames
    public varDeclaredNames(out: string[]): void {
        this.variable.boundNames(out);
    }

    // ES6 Section 15.2.1.14 Static Semantics: VarScopedDeclarations
    public varScopedDeclarations(out: VarScopedDeclaration[]): void {
        this.variable.varScopedDeclarations(out);
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("ExportVariableNode.lexicallyScopedDeclarations not implemented");
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportVariableNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportVariableNode {
        node = check.node(node,"ExportVariable",1);
        const variable = VarNode.fromGeneric(node.children[0]);
        return new ExportVariableNode(node.range,variable);
    }
}

export class ExportDeclarationNode extends ExportNode {
    public _type_ExportDeclarationNode: any;
    public readonly decl: DeclarationNode;

    public constructor(range: Range, decl: DeclarationNode) {
        super(range,"ExportDeclaration");
        this.decl = decl;
    }

    public get children(): (ASTNode | null)[] {
        return [this.decl];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        this.decl.boundNames(out);
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        out.push(this.decl);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportDeclarationNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportDeclarationNode {
        node = check.node(node,"ExportDeclaration",1);
        const decl = DeclarationNode_fromGeneric(node.children[0]);
        return new ExportDeclarationNode(node.range,decl);
    }
}

export class ExportFromNode extends ExportNode {
    public _type_ExportFromNode: any;
    public readonly exportClause: ExportClauseNode;
    public readonly fromClause: StringLiteralNode;

    public constructor(
        range: Range,
        exportClause: ExportClauseNode,
        fromClause: StringLiteralNode
    ) {
        super(range,"ExportFrom");
        this.exportClause = exportClause;
        this.fromClause = fromClause;
    }

    public get children(): (ASTNode | null)[] {
        return [this.exportClause,this.fromClause];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        // No bound names for this node type
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("ExportFromNode.lexicallyScopedDeclarations not implemented");
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportFromNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportFromNode {
        node = check.node(node,"ExportFrom",2);
        const exportClause = ExportClauseNode.fromGeneric(node.children[0]);
        const fromClause = StringLiteralNode.fromGeneric(node.children[1]);
        return new ExportFromNode(node.range,exportClause,fromClause);
    }
}

export class ExportClauseNode extends ExportNode {
    public _type_ExportClauseNode: any;
    public readonly items: ExportsListNode;

    public constructor(range: Range, items: ExportsListNode) {
        super(range,"ExportClause");
        this.items = items;
    }

    public get children(): (ASTNode | null)[] {
        return [this.items];
    }

    // ES6 Section 15.2.3.2: Static Semantics: BoundNames
    public boundNames(out: string[]): void {
        // No bound names for this node type
    }

    // ES6 Section 15.2.3.8: Static Semantics: LexicallyScopedDeclarations
    public lexicallyScopedDeclarations(out: LexicallyScopedDeclaration[]): void {
        throw new Error("ExportClauseNode.lexicallyScopedDeclarations not implemented");
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        throw new Error("ExportClauseNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ExportClauseNode {
        node = check.node(node,"ExportClause",1);
        const items = ExportsListNode.fromGeneric(node.children[0]);
        return new ExportClauseNode(node.range,items);
    }
}

export abstract class ExportsListItemNode extends ASTNode {
    public _type_ExportsListItemNode: any;

    public static fromGeneric(node: ASTNode | null): ExportsListItemNode {
        try { return ExportAsSpecifierNode.fromGeneric(node); } catch (e) {}
        try { return ExportNormalSpecifierNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ExportsListItemNode",node);
    }
}

export class ExportNormalSpecifierNode extends ExportsListItemNode {
    public _type_ExportNormalSpecifierNode: any;
    public readonly ident: IdentifierNode;

    public constructor(range: Range, ident: IdentifierNode) {
        super(range,"ExportNormalSpecifier");
        this.ident = ident;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }

    public static fromGeneric(node: ASTNode | null): ExportNormalSpecifierNode {
        node = check.node(node,"ExportNormalSpecifier",1);
        const ident = IdentifierNode.fromGeneric(node.children[0]);
        return new ExportNormalSpecifierNode(node.range,ident);
    }
}

export class ExportAsSpecifierNode extends ExportsListItemNode {
    public _type_ExportAsSpecifierNode: any;
    public readonly ident: IdentifierNode;
    public readonly asIdent: IdentifierNode;

    public constructor(range: Range, ident: IdentifierNode, asIdent: IdentifierNode) {
        super(range,"ExportAsSpecifier");
        this.ident = ident;
        this.asIdent = asIdent;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.asIdent];
    }

    public static fromGeneric(node: ASTNode | null): ExportAsSpecifierNode {
        node = check.node(node,"ExportAsSpecifier",2);
        const ident = IdentifierNode.fromGeneric(node.children[0]);
        const asIdent = IdentifierNode.fromGeneric(node.children[1]);
        return new ExportAsSpecifierNode(node.range,ident,asIdent);
    }
}
