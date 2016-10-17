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

// ES6 Section 15.2: Modules

import {
    UnknownType,
    JSValue,
    JSObject,
    Completion,
    LexicalEnvironment,
    Realm,
} from "./datatypes";
import {
    ASTNode
} from "../parser/ast";

export class ModuleBinding {
    public _type_ModuleBinding: any;
    public readonly module: ModuleRecord;
    public readonly name: string;
    public constructor(module: ModuleRecord, name: string) {
        this.module = module;
        this.name = name;
    }
}

export abstract class ModuleRecord {
    public _type_ModuleRecord: any;

    public realm: Realm | undefined = undefined;
    public environment: LexicalEnvironment | undefined = undefined;
    public namespace: JSObject | undefined = undefined;
    public evaluated: boolean = false;

    public abstract GetExportedNames(exportStarSet: UnknownType): Completion<string[]>;
    public abstract ResolveExport(exportName: string, resolveSet: UnknownType, exportStarSet: UnknownType): Completion<ModuleBinding>;
    public abstract ModuleDeclarationInstantiation(): Completion<void>;
    public abstract ModuleEvaluation(): Completion<JSValue>;
}

export class ImportEntry {
    public _type_ImportEntry: any;
    public moduleRequest: string;
    public importName: string;
    public localName: string;

    public constructor(options: {
        moduleRequest: string,
        importName: string,
        localName: string,
    }) {
        this.moduleRequest = options.moduleRequest;
        this.importName = options.importName;
        this.localName = options.localName;
    }
}

export class ExportEntry {
    public _type_ExportEntry: any;
    public exportName: string;
    public moduleRequest: string | null;
    public importName: string | null;
    public localName: string | null;

    public constructor(exportName: string) {
        this.exportName = exportName;
        this.moduleRequest = null;
        this.importName = null;
        this.localName = null;
    }
}

export class SourceTextModuleRecord extends ModuleRecord {
    public _type_SourceTextModuleRecord: any;
    public ecmascriptCode: ASTNode;
    public requestedModules: string[] = [];
    public importEntries: ImportEntry[] = [];
    public localExportEntries: ExportEntry[] = [];
    public indirectExportEntries: ExportEntry[] = [];
    public starExportEntries: ExportEntry[] = [];

    public constructor(ecmascriptCode: ASTNode) {
        super();
        this.ecmascriptCode = ecmascriptCode;
    }

    public GetExportedNames(exportStarSet: UnknownType): Completion<string[]> {
        throw new Error("SourceTextModuleRecord.GetExportedNames not implemented");
    }

    public ResolveExport(exportName: string, resolveSet: UnknownType, exportStarSet: UnknownType): Completion<ModuleBinding> {
        throw new Error("SourceTextModuleRecord. ResolveExport not implemented");
    }

    public ModuleDeclarationInstantiation(): Completion<void> {
        throw new Error("SourceTextModuleRecord. ModuleDeclarationInstantiation not implemented");
    }

    public ModuleEvaluation(): Completion<JSValue> {
        throw new Error("SourceTextModuleRecord. ModuleEvaluation not implemented");
    }
}
