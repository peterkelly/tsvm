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
    DeclarationNode,
    IdentifierNode,
    BindingIdentifierNode,
} from "../parser/ast";
import {
    ExpressionNode,
    StringLiteralNode,
} from "./expressions";
import {
    StatementListItemType,
    VarNode,
} from "./statements";

export type ModuleItemType = ImportNode | ExportNode | StatementListItemType;

// ES6 Chapter 15: ECMAScript Language: Scripts and Modules

// ES6 Section 15.1: Scripts

export class ScriptNode extends ASTNode {
    _nominal_type_ScriptNode: any;
    public readonly body: ASTNode;
    public constructor(range: Range, body: ASTNode) {
        super(range,"Script");
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.body];
    }
}

// ES6 Section 15.2: Modules

export class ModuleItemListNode extends ASTNode {
    _nominal_type_ModuleItemListNode: any;
    public readonly elements: ModuleItemType[];
    public constructor(range: Range, elements: ModuleItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ModuleNode extends ASTNode {
    _nominal_type_ModuleNode: any;
    public readonly body: ASTNode;
    public constructor(range: Range, body: ASTNode) {
        super(range,"Module");
        this.body = body;
    }
    public get children(): (ASTNode | null)[] {
        return [this.body];
    }
}

// ES6 Section 15.2.1: Module Semantics

// ES6 Section 15.2.2: Imports

export class ImportsListNode extends ASTNode {
    _nominal_type_ImportsListNode: any;
    public readonly elements: (ImportAsSpecifierNode | ImportSpecifierNode)[];
    public constructor(range: Range, elements: (ImportAsSpecifierNode | ImportSpecifierNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export abstract class ImportNode extends ASTNode {
    _nominal_type_ImportNode: any;
}

export class ImportFromNode extends ImportNode {
    _nominal_type_ImportFromNode: any;
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
}

export class ImportModuleNode extends ImportNode {
    _nominal_type_ImportModuleNode: any;
    public readonly specifier: StringLiteralNode;
    public constructor(range: Range, specifier: StringLiteralNode) {
        super(range,"ImportModule");
        this.specifier = specifier;
    }
    public get children(): (ASTNode | null)[] {
        return [this.specifier];
    }
}

export abstract class ImportClauseNode extends ASTNode {
    _nominal_type_ImportClauseNode: any;
}

export class DefaultAndNameSpaceImportsNode extends ImportClauseNode {
    _nominal_type_DefaultAndNameSpaceImportsNode: any;
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
}

export class DefaultAndNamedImportsNode extends ImportClauseNode {
    _nominal_type_DefaultAndNamedImportsNode: any;
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
}

export class DefaultImportNode extends ImportClauseNode {
    _nominal_type_DefaultImportNode: any;
    public readonly binding: BindingIdentifierNode;
    public constructor(range: Range, binding: BindingIdentifierNode) {
        super(range,"DefaultImport");
        this.binding = binding;
    }
    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }
}

export class NameSpaceImportNode extends ImportClauseNode {
    _nominal_type_NameSpaceImportNode: any;
    public readonly binding: BindingIdentifierNode;
    public constructor(range: Range, binding: BindingIdentifierNode) {
        super(range,"NameSpaceImport");
        this.binding = binding;
    }
    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }
}

export class NamedImportsNode extends ImportClauseNode {
    _nominal_type_NamedImportsNode: any;
    public readonly imports: ImportsListNode;
    public constructor(range: Range, imports: ImportsListNode) {
        super(range,"NamedImports");
        this.imports = imports;
    }
    public get children(): (ASTNode | null)[] {
        return [this.imports];
    }
}

export class ImportSpecifierNode extends ASTNode {
    _nominal_type_ImportSpecifierNode: any;
    public readonly binding: BindingIdentifierNode;
    public constructor(range: Range, binding: BindingIdentifierNode) {
        super(range,"ImportSpecifier");
        this.binding = binding;
    }
    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }
}

export class ImportAsSpecifierNode extends ASTNode {
    _nominal_type_ImportAsSpecifierNode: any;
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
}

// ES6 Section 15.2.3: Exports

export class ExportsListNode extends ASTNode {
    _nominal_type_ExportsListNode: any;
    public readonly elements: (ExportAsSpecifierNode | ExportNormalSpecifierNode)[];
    public constructor(range: Range, elements: (ExportAsSpecifierNode | ExportNormalSpecifierNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export abstract class ExportNode extends ASTNode {
    _nominal_type_ExportNode: any;
}

export class ExportDefaultNode extends ExportNode {
    _nominal_type_ExportDefaultNode: any;
    public readonly decl: DeclarationNode | ExpressionNode;
    public constructor(range: Range, decl: DeclarationNode | ExpressionNode) {
        super(range,"ExportDefault");
        this.decl = decl;
    }
    public get children(): (ASTNode | null)[] {
        return [this.decl];
    }
}

export class ExportStarNode extends ExportNode {
    _nominal_type_ExportStarNode: any;
    public readonly from: StringLiteralNode;
    public constructor(range: Range, from: StringLiteralNode) {
        super(range,"ExportStar");
        this.from = from;
    }
    public get children(): (ASTNode | null)[] {
        return [this.from];
    }
}

export class ExportPlainNode extends ExportNode {
    _nominal_type_ExportPlainNode: any;
    public readonly clause: ExportClauseNode;
    public constructor(range: Range, clause: ExportClauseNode) {
        super(range,"ExportPlain");
        this.clause = clause;
    }
    public get children(): (ASTNode | null)[] {
        return [this.clause];
    }
}

export class ExportVariableNode extends ExportNode {
    _nominal_type_ExportVariableNode: any;
    public readonly variable: VarNode;
    public constructor(range: Range, variable: VarNode) {
        super(range,"ExportVariable");
        this.variable = variable;
    }
    public get children(): (ASTNode | null)[] {
        return [this.variable];
    }
}

export class ExportDeclarationNode extends ExportNode {
    _nominal_type_ExportDeclarationNode: any;
    public readonly decl: DeclarationNode;
    public constructor(range: Range, decl: DeclarationNode) {
        super(range,"ExportDeclaration");
        this.decl = decl;
    }
    public get children(): (ASTNode | null)[] {
        return [this.decl];
    }
}

export class ExportFromNode extends ExportNode {
    _nominal_type_ExportFromNode: any;
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
}

export class ExportClauseNode extends ExportNode {
    _nominal_type_ExportClauseNode: any;
    public readonly items: ExportsListNode;
    public constructor(range: Range, items: ExportsListNode) {
        super(range,"ExportClause");
        this.items = items;
    }
    public get children(): (ASTNode | null)[] {
        return [this.items];
    }
}

export class ExportNormalSpecifierNode extends ASTNode {
    _nominal_type_ExportNormalSpecifierNode: any;
    public readonly ident: IdentifierNode;
    public constructor(range: Range, ident: IdentifierNode) {
        super(range,"ExportNormalSpecifier");
        this.ident = ident;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }
}

export class ExportAsSpecifierNode extends ASTNode {
    _nominal_type_ExportAsSpecifierNode: any;
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
}
