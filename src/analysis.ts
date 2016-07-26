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

import { ASTNode, ListNode, ErrorNode } from "./parser/ast";
import { ParseError } from "./parser/parser";

// We use this instead of Array's concat method, since the latter is typed as any[]
function concatenate<T>(...arrays: T[][]): T[] {
    const result: T[] = [];
    for (const arr of arrays) {
        for (const item of arr)
            result.push(item);
    }
    return result;
}

export abstract class NodeError {
    public node: ASTNode;
    public message: string;
    public constructor(node: ASTNode, message: string) {
        this.node = node;
        this.message = message;
    }
    public toString(): string {
        return this.node.kind+": "+this.message;
    }
}

export class InternalSchemaError extends NodeError {
    public constructor(node: ASTNode, message: string) {
        super(node,message);
    }
}

export class UnhandledCaseError extends NodeError {
    public constructor(node: ASTNode, message: string) {
        super(node,message+": Unhandled case");
    }
}

export class StaticSemanticError extends NodeError {
    public constructor(node: ASTNode, message: string) {
        super(node,message);
    }
}

class DeclaredName {
    _DeclaredName: any;
}

function checkChildren(node: ASTNode, count: number): void {
    if (node.children.length != 1)
        throw new InternalSchemaError(node,"Expected exactly "+count+" children");
}

function TopLevelVarDeclaredNames(node: ASTNode): DeclaredName[] {
    return [];
}

function BoundNames(node: ASTNode): DeclaredName[] {
    return [];
}

function VarDeclaredNames(node1: ASTNode | null): DeclaredName[] {
    if (node1 == null)
        return [];

    const node: ASTNode = node1;

    if (node instanceof ListNode) {
        const names: DeclaredName[] = [];
        for (const element of node.elements)
            names.push(...VarDeclaredNames(element));
        return names;
    }

    switch (node.kind) {
        // 13.1.5
        case "EmptyStatement":
        case "ExpressionStatement":
        case "ContinueStatement":
        case "BreakStatement":
        case "ReturnStatement":
        case "ThrowStatement":
        case "DebuggerStatement":
            return [];

        // 13.2.11
        case "Block":
            return [];
        case "StatementList": {
            const children = node.children;
            const result: DeclaredName[] = [];
            for (const child of children)
                result.push(...VarDeclaredNames(child));
            return result;
        }
        case "Declaration":
            return [];

        // 13.3.2.2
        case "VariableDeclarationList":
            checkChildren(node,1);
            return VarDeclaredNames(node.children[0]);

        // 13.6.5
        case "IfStatement": {
            checkChildren(node,3);
            return concatenate(
                VarDeclaredNames(node.children[1]),
                VarDeclaredNames(node.children[2]));
        }

        // 13.7.2.4
        case "DoStatement":
            checkChildren(node,2);
            return VarDeclaredNames(node.children[0]);

        // 13.7.3.4
        case "WhileStatement":
            checkChildren(node,2);
            return VarDeclaredNames(node.children[1]);

        // 13.7.4.5
        case "ForC": {
            checkChildren(node,4);
            const init = node.children[0];
            const body = node.children[3];
            let result: DeclaredName[] = [];
            if ((init != null) && (init.kind == "Var")) {
                checkChildren(init,1);
                const varDeclList = init.children[0];
                result.push(...VarDeclaredNames(varDeclList));
            }
            result.push(...VarDeclaredNames(body));
            return result;
        }

        // 13.7.5.7
        case "ForIn":
        case "ForOf": {
            checkChildren(node,3);
            const decl = node.children[0];
            const stmt = node.children[2];
            if ((decl != null) && decl.kind == "VarForDeclaration") {
                checkChildren(decl,1);
                const forBinding = decl.children[0];
                const forBindingNames = VarDeclaredNames(forBinding);
                const stmtNames = VarDeclaredNames(stmt);
                return concatenate(
                    VarDeclaredNames(forBinding),
                    VarDeclaredNames(stmt));
            }
            else {
                return VarDeclaredNames(stmt);
            }
        }

        // 13.11.5
        case "WithStatement":
            checkChildren(node,2);
            return VarDeclaredNames(node.children[1]);

        // 13.12.7
        case "SwitchStatement":
            checkChildren(node,2);
            return VarDeclaredNames(node.children[1]);
        case "CaseBlock1": {
            checkChildren(node,1);
            return VarDeclaredNames(node.children[0]);
        }
        case "CaseBlock2": {
            checkChildren(node,3);
            return concatenate(
                VarDeclaredNames(node.children[0]),
                VarDeclaredNames(node.children[1]),
                VarDeclaredNames(node.children[2]));
        }
        case "CaseClause": {
            checkChildren(node,2);
            const stmtList = node.children[1];
            return VarDeclaredNames(node.children[1]);
        }
        case "DefaultClause": {
            checkChildren(node,1);
            return VarDeclaredNames(node.children[0]);
        }

        // 13.13.12
        case "LabelledStatement":
            checkChildren(node,2);
            return VarDeclaredNames(node.children[1]);
        case "FunctionDeclaration":
            return [];

        // 13.15.5
        case "TryStatement": {
            checkChildren(node,3);
            const mainBlock = node.children[0];
            const catchBlock = node.children[1];
            const finallyBlock = node.children[2];
            return concatenate(
                VarDeclaredNames(mainBlock),
                VarDeclaredNames(catchBlock),
                VarDeclaredNames(finallyBlock));
        }
        case "Catch":
            checkChildren(node,2);
            return VarDeclaredNames(node.children[1]);

        // 14.1.15
        // FunctionStatementList - taken care of by List handling above

        // 14.2.12
        case "ArrowExpressionBody":
            return [];

        // 15.1.5
        // FIXME: ScriptBody : StatementList

        // 15.2.1.13
        case "Module":
            return [];
            // ref("ImportDeclaration_from"),
        case "ImportFrom":
        case "ImportModule":
            return [];

        case "ExportVariable":
            return BoundNames(node);
        case "ExportDefault":
        case "ExportStar":
        case "ExportFrom":
        case "ExportPlain":
        case "ExportDeclaration":
            return [];
    }
    throw new UnhandledCaseError(node,"VarDeclaredNames");
}

function LexicallyScopedDeclarations(node1: ASTNode | null): ASTNode[] {
    if (node1 == null)
        return [];

    const node: ASTNode = node1;

    if (node instanceof ListNode) {
        const declarations: ASTNode[] = [];
        for (const element of node.elements)
            declarations.push(...LexicallyScopedDeclarations(element));
        return declarations;
    }

    switch (node.kind) {
        // 13.2.6
        // StatementListItem : Statement
        case "LabelledStatement":
            checkChildren(node,2);
            // 13.13.7
            const decl = node.children[1];
            if ((decl != null) && (decl.kind == "FunctionDeclaration"))
                return [decl];
            else
                return [];
        case "ExpressionStatement":
        case "Block":
        case "Var":
        case "EmptyStatement":
        case "IfStatement":
        case "DoStatement":
        case "WhileStatement":
        case "ForC":
        case "ForIn":
        case "ForOf":
        case "SwitchStatement":
        case "ContinueStatement":
        case "BreakStatement":
        case "ReturnStatement":
        case "WithStatement":
        case "ThrowStatement":
        case "TryStatement":
        case "DebuggerStatement":
            return [];
        // StatementListItem : Declaration
        case "FunctionDeclaration":
        case "GeneratorDeclaration":
        case "DefaultGeneratorDeclaration":
        case "ClassDeclaration":
        case "Let":
        case "Const":
            return [node];

        // 13.12.6
        case "CaseBlock1":
            checkChildren(node,1);
            return LexicallyScopedDeclarations(node.children[0]);
        case "CaseBlock2":
            checkChildren(node,3);
            return concatenate(
                LexicallyScopedDeclarations(node.children[0]),
                LexicallyScopedDeclarations(node.children[1]),
                LexicallyScopedDeclarations(node.children[2]))
        // 14.1.14
        // FIXME: Return the TopLevelLexicallyScopedDeclarations of StatementList

        // 14.2.11
        case "ArrowExpressionBody":
            return [];
        // case "ArrowBlockBody": // ????????
        //     return [];

        // 15.1.4
        // FIXME:
        // ScriptBody : StatementList
        // Return TopLevelLexicallyScopedDeclarations of StatementList


        // 15.2.1.12
        case "Module":
            return [];
        case "ImportFrom":
        case "ImportModule":
            return [];


        // 15.2.3.8

    }



    throw new UnhandledCaseError(node,"LexicallyScopedDeclarations");
}

function TopLevelLexicallyScopedDeclarations(node: ASTNode): ASTNode[] {
    throw new UnhandledCaseError(node,"TopLevelLexicallyScopedDeclarations");
}
