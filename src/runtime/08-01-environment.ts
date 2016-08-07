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
    UnknownType,
    JSValue,
    JSUndefined,
    JSObject,
    Completion,
    LexicalEnvironment,
    EnvironmentRecord,
} from "./datatypes";

// ES6 Section 8.1.1: Environment Records

// ES6 Section 8.1.1.1: Declarative Environment Records

export class DeclarativeEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_DeclarativeEnvironmentRecord: any;

    // ES6 Section 8.1.1.1.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.1.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean = false): void {
        throw new Error("DeclarativeEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.1.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean = false): void {
        throw new Error("DeclarativeEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.1.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        throw new Error("DeclarativeEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.1.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("DeclarativeEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.1.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("DeclarativeEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.1.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.1.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.1.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("DeclarativeEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.1.10: WithBaseObject ()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("DeclarativeEnvironmentRecord.WithBaseObject not implemented");
    }
}

export class ObjectEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_ObjectEnvironmentRecord: any;

    // ES6 Section 8.1.1.2.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.2.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): void {
        throw new Error("ObjectEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): void {
        throw new Error("ObjectEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        throw new Error("ObjectEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.2.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("ObjectEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.2.6: GetBindingValue(N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("ObjectEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.2.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.2.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.2.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("ObjectEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.2.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("ObjectEnvironmentRecord.WithBaseObject not implemented");
    }
}

// ES6 Section 8.1.1.3: Function Environment Records

export class FunctionEnvironmentRecord extends DeclarativeEnvironmentRecord {
    _nominal_type_FunctionEnvironmentRecord: any;

    // ES6 Section 8.1.1.3.1: BindThisValue (V)

    public BindThisValue(V: JSValue): Completion<JSValue> {
        throw new Error("FunctionEnvironmentRecord.BindThisValue not implemented");
    }

    // ES6 Section 8.1.1.3.2: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("FunctionEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.3.3: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("FunctionEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.3.4: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        throw new Error("FunctionEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.3.5: GetSuperBase ()

    public GetSuperBase(): Completion<JSValue> {
        throw new Error("FunctionEnvironmentRecord.GetSuperBase not implemented");
    }
}

// ES6 Section 8.1.1.4: Global Environment Records

export class GlobalEnvironmentRecord extends EnvironmentRecord {
    _nominal_type_GlobalEnvironmentRecord: any;

    // ES6 Section 8.1.1.4.1: HasBinding (N)

    public HasBinding(N: string): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasBinding not implemented");
    }

    // ES6 Section 8.1.1.4.2: CreateMutableBinding (N, D)

    public CreateMutableBinding(N: string, D: boolean): void {
        throw new Error("GlobalEnvironmentRecord.CreateMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.3: CreateImmutableBinding (N, S)

    public CreateImmutableBinding(N: string, S: boolean): void {
        throw new Error("GlobalEnvironmentRecord.CreateImmutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.4: InitializeBinding (N, V)

    public InitializeBinding(N: string, V: JSValue): void {
        throw new Error("GlobalEnvironmentRecord.InitializeBinding not implemented");
    }

    // ES6 Section 8.1.1.4.5: SetMutableBinding (N, V, S)

    public SetMutableBinding(N: string, V: JSValue, S: boolean): Completion<void> {
        throw new Error("GlobalEnvironmentRecord.SetMutableBinding not implemented");
    }

    // ES6 Section 8.1.1.4.6: GetBindingValue (N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("GlobalEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.4.7: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.4.8: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.4.9: HasSuperBinding ()

    public HasSuperBinding(): Completion<boolean> {
        throw new Error("GlobalEnvironmentRecord.HasSuperBinding not implemented");
    }

    // ES6 Section 8.1.1.4.10: WithBaseObject()

    public WithBaseObject(): Completion<JSObject | JSUndefined> {
        throw new Error("GlobalEnvironmentRecord.WithBaseObject not implemented");
    }

    // ES6 Section 8.1.1.4.11: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        throw new Error("GlobalEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.4.12: HasVarDeclaration (N)

    public HasVarDeclaration(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.HasVarDeclaration not implemented");
    }

    // ES6 Section 8.1.1.4.13: HasLexicalDeclaration (N)

    public HasLexicalDeclaration(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.HasLexicalDeclaration not implemented");
    }

    // ES6 Section 8.1.1.4.14: HasRestrictedGlobalProperty (N)

    public HasRestrictedGlobalProperty(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.HasRestrictedGlobalProperty not implemented");
    }

    // ES6 Section 8.1.1.4.15: CanDeclareGlobalVar (N)

    public CanDeclareGlobalVar(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CanDeclareGlobalVar not implemented");
    }

    // ES6 Section 8.1.1.4.16: CanDeclareGlobalFunction (N)

    public CanDeclareGlobalFunction(N: string): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CanDeclareGlobalFunction not implemented");
    }

    // ES6 Section 8.1.1.4.17: CreateGlobalVarBinding (N, D)

    public CreateGlobalVarBinding(N: string, D: boolean): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CreateGlobalVarBinding not implemented");
    }

    // ES6 Section 8.1.1.4.18: CreateGlobalFunctionBinding (N, V, D)

    public CreateGlobalFunctionBinding(N: string, V: JSValue, D: boolean): Completion<UnknownType> {
        throw new Error("GlobalEnvironmentRecord.CreateGlobalFunctionBinding not implemented");
    }
}

// ES6 Section 8.1.1.5: Module Environment Records

export class ModuleEnvironmentRecord extends DeclarativeEnvironmentRecord {
    _nominal_type_ModuleEnvironmentRecord: any;

    // ES6 Section 8.1.1.5.1: GetBindingValue (N, S)

    public GetBindingValue(N: string, S: boolean): Completion<JSValue> {
        throw new Error("ModuleEnvironmentRecord.GetBindingValue not implemented");
    }

    // ES6 Section 8.1.1.5.2: DeleteBinding (N)

    public DeleteBinding(N: string): Completion<boolean> {
        throw new Error("ModuleEnvironmentRecord.DeleteBinding not implemented");
    }

    // ES6 Section 8.1.1.5.3: HasThisBinding ()

    public HasThisBinding(): Completion<boolean> {
        throw new Error("ModuleEnvironmentRecord.HasThisBinding not implemented");
    }

    // ES6 Section 8.1.1.5.4: GetThisBinding ()

    public GetThisBinding(): Completion<JSValue> {
        throw new Error("ModuleEnvironmentRecord.GetThisBinding not implemented");
    }

    // ES6 Section 8.1.1.5.5: CreateImportBinding (N, M, N2)

    public CreateImportBinding(N: string, M: UnknownType, N2: string): Completion<UnknownType> {
        throw new Error("ModuleEnvironmentRecord.CreateImportBinding not implemented");
    }
}

// ES6 Section 8.1.2: Lexical Environment Operations

// ES6 Section 8.1.2.1: GetIdentifierReference (lex, name, strict)

export function GetIdentifierReference(lex: LexicalEnvironment | null, name: string, strict: boolean): Completion<UnknownType> {
    throw new Error("GetIdentifierReference not implemented");
}

// ES6 Section 8.1.2.2: NewDeclarativeEnvironment (E)

export function NewDeclarativeEnvironment(E: LexicalEnvironment | null): LexicalEnvironment {
    throw new Error("NewDeclarativeEnvironment not implemented");
}

// ES6 Section 8.1.2.3: NewObjectEnvironment (O, E)

export function NewObjectEnvironment(O: JSObject, E: LexicalEnvironment | null): LexicalEnvironment {
    throw new Error("NewObjectEnvironment not implemented");
}

// ES6 Section 8.1.2.4: NewFunctionEnvironment (F, newTarget)

export function NewFunctionEnvironment(F: JSObject, newTarget: JSUndefined | JSObject): LexicalEnvironment {
    throw new Error("NewFunctionEnvironment not implemented");
}

// ES6 Section 8.1.2.5: NewGlobalEnvironment (G)

export function NewGlobalEnvironment(G: JSObject): LexicalEnvironment {
    throw new Error("NewGlobalEnvironment not implemented");
}

// ES6 Section 8.1.2.6: NewModuleEnvironment (E)

export function NewModuleEnvironment(E: LexicalEnvironment | null): LexicalEnvironment {
    throw new Error("NewModuleEnvironment not implemented");
}
