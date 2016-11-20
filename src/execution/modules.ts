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

import {
    Range,
    ASTNode,
    ExpressionNode,
    StatementListItemNode,
    DeclarationNode,
    IdentifierNode,
    BindingIdentifierNode,
    check,
    CannotConvertError,
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
} from "../runtime/datatypes";
import {
    ExecutionContext,
} from "../runtime/08-03-context";
import {
    RealmImpl,
} from "../runtime/08-02-realm";
import {
    DeclarativeEnvironmentRecord,
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
    public readonly body: ModuleItemListNode;

    public constructor(range: Range, body: ModuleItemListNode) {
        super(range,"Module");
        this.body = body;
    }

    public get children(): (ASTNode | null)[] {
        return [this.body];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference | Empty> {
        return this.body.evaluate(ctx);
    }

    public static fromGeneric(node: ASTNode | null): ModuleNode {
        node = check.node(node,"Module",1);
        const body = ModuleItemListNode.fromGeneric(node.children[0]);
        return new ModuleNode(node.range,body);
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

    public static fromGeneric(node: ASTNode | null): NamedImportsNode {
        node = check.node(node,"NamedImports",1);
        const imports = ImportsListNode.fromGeneric(node.children[0]);
        return new NamedImportsNode(node.range,imports);
    }
}

export abstract class ImportListItemNode extends ASTNode {
    public _type_ImportListItemNode: any;

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
            case "DefaultGeneratorDeclaration":
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
