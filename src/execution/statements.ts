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
    BindingIdentifierNode,
} from "../parser/ast";
import {
    PropertyNameType,
    ExpressionNode,
    ElisionNode,
} from "./expressions";
import {
    FunctionDeclarationNode,
} from "./functions";

export type ForCInitType = ExpressionNode | VarNode | LetNode | ConstNode | null;
export type ForBindingType = BindingIdentifierNode | BindingPatternNode;
export type ForInBindingType = ExpressionNode | VarForDeclarationNode | LetForDeclarationNode | ConstForDeclarationNode;
export type ForOfBindingType = ExpressionNode | VarForDeclarationNode | LetForDeclarationNode | ConstForDeclarationNode;
export type CatchParameterType = BindingIdentifierNode | BindingPatternNode;

export type SingleNameBindingType = BindingIdentifierNode | SingleNameBindingNode;
export type BindingElementType = SingleNameBindingType | BindingPatternInitNode |
                                 BindingPatternNode | BindingRestElementNode |
                                 ElisionNode;
export type BindingPropertyType = SingleNameBindingType | BindingPropertyNode;
export type StatementListItemType = StatementNode | DeclarationNode;

// ES6 Chapter 13: ECMAScript Language: Statements and Declarations

export abstract class StatementNode extends ASTNode {
    _nominal_type_StatementNode: any;
}

export class StatementListNode extends ASTNode {
    _nominal_type_StatementListNode: any;
    public readonly elements: StatementListItemType[];
    public constructor(range: Range, elements: StatementListItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class LabelIdentifierNode extends ASTNode {
    _nominal_type_LabelIdentifierNode: any;
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
}

export abstract class BreakableStatementNode extends StatementNode {
    _nominal_type_BreakableStatementNode: any;
}

// ES6 Section 13.1: Statement Semantics

// ES6 Section 13.2: Block

export class BlockNode extends StatementNode {
    _nominal_type_BlockNode: any;
    public statements: StatementListNode;
    public constructor(range: Range, statements: StatementListNode) {
        super(range,"Block");
        this.statements = statements;
    }
    public get children(): (ASTNode | null)[] {
        return [this.statements];
    }
}

// ES6 Section 13.3: Declarations and the Variable Statement

// ES6 Section 13.3.1: Let and Const Declarations

export class BindingListNode extends ASTNode {
    _nominal_type_BindingListNode: any;
    public readonly elements: LexicalBindingNode[];
    public constructor(range: Range, elements: LexicalBindingNode[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class LetNode extends DeclarationNode {
    _nominal_type_LetNode: any;
    public bindings: BindingListNode;
    public constructor(range: Range, bindings: BindingListNode) {
        super(range,"Let");
        this.bindings = bindings;
    }
    public get children(): (ASTNode | null)[] {
        return [this.bindings];
    }
}

export class ConstNode extends DeclarationNode {
    _nominal_type_ConstNode: any;
    public bindings: BindingListNode;
    public constructor(range: Range, bindings: BindingListNode) {
        super(range,"Const");
        this.bindings = bindings;
    }
    public get children(): (ASTNode | null)[] {
        return [this.bindings];
    }
}

export abstract class LexicalBindingNode extends ASTNode {
    _nominal_type_LexicalBindingNode: any;
}

export class LexicalIdentifierBindingNode extends LexicalBindingNode {
    _nominal_type_LexicalIdentifierBindingNode: any;
    public identifier: BindingIdentifierNode;
    public initializer: ExpressionNode;
    public constructor(
        range: Range,
        identifier: BindingIdentifierNode,
        initializer: ExpressionNode
    ) {
        super(range,"LexicalIdentifierBinding");
        this.identifier = identifier;
        this.initializer = initializer;
    }
    public get children(): (ASTNode | null)[] {
        return [this.identifier,this.initializer];
    }
}

export class LexicalPatternBindingNode extends LexicalBindingNode {
    _nominal_type_LexicalPatternBindingNode: any;
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
}

// ES6 Section 13.3.2: Variable Statement

export class VariableDeclarationListNode extends ASTNode {
    _nominal_type_VariableDeclarationListNode: any;
    public readonly elements: (VarIdentifierNode | VarPatternNode)[];
    public constructor(range: Range, elements: (VarIdentifierNode | VarPatternNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class VarNode extends StatementNode {
    _nominal_type_VarNode: any;
    public declarations: VariableDeclarationListNode;
    public constructor(range: Range, declarations: VariableDeclarationListNode) {
        super(range,"Var");
        this.declarations = declarations;
    }
    public get children(): (ASTNode | null)[] {
        return [this.declarations];
    }
}

export class VarIdentifierNode extends ASTNode {
    _nominal_type_VarIdentifierNode: any;
    public identifier: BindingIdentifierNode;
    public initializer: ExpressionNode;
    public constructor(
        range: Range,
        identifier: BindingIdentifierNode,
        initializer: ExpressionNode
    ) {
        super(range,"VarIdentifier");
        this.identifier = identifier;
        this.initializer = initializer;
    }
    public get children(): (ASTNode | null)[] {
        return [this.identifier,this.initializer];
    }
}

export class VarPatternNode extends ASTNode {
    _nominal_type_VarPatternNode: any;
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
}

// ES6 Section 13.3.3: Destructuring Binding Patterns

export class BindingPropertyListNode extends ASTNode {
    _nominal_type_BindingPropertyListNode: any;
    public readonly elements: BindingPropertyType[];
    public constructor(range: Range, elements: BindingPropertyType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export abstract class BindingPatternNode extends ASTNode {
    _nominal_type_BindingPatternNode: any;
}

export class ObjectBindingPatternNode extends BindingPatternNode {
    _nominal_type_ObjectBindingPatternNode: any;
    public readonly properties: BindingPropertyListNode;
    public constructor(range: Range, properties: BindingPropertyListNode) {
        super(range,"ObjectBindingPattern");
        this.properties = properties;
    }
    public get children(): (ASTNode | null)[] {
        return [this.properties];
    }
}

export class BindingElementListNode extends ASTNode {
    _nominal_type_BindingElementListNode: any;
    public readonly elements: BindingElementType[];
    public constructor(range: Range, elements: BindingElementType[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export class ArrayBindingPatternNode extends BindingPatternNode {
    public readonly elements: BindingElementListNode;
    public readonly rest: BindingRestElementNode;
    public constructor(
        range: Range,
        elements: BindingElementListNode,
        rest: BindingRestElementNode
    ) {
        super(range,"ArrayBindingPattern");
        this.elements = elements;
        this.rest = rest;
    }
    public get children(): (ASTNode | null)[] {
        return [this.elements,this.rest];
    }
}

export class BindingPropertyNode extends ASTNode {
    _nominal_type_BindingPropertyNode: any;
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
}

export class BindingPatternInitNode extends ASTNode {
    _nominal_type_BindingPatternInitNode: any;
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
}

export class SingleNameBindingNode extends ASTNode {
    _nominal_type_SingleNameBindingNode: any;
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
}

export class BindingRestElementNode extends ASTNode {
    _nominal_type_BindingRestElementNode: any;
    public readonly ident: BindingIdentifierNode;
    public constructor(range: Range, ident: BindingIdentifierNode) {
        super(range,"BindingRestElement");
        this.ident = ident;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }
}

// ES6 Section 13.4: Empty Statement

export class EmptyStatementNode extends StatementNode {
    _nominal_type_EmptyStatementNode: any;
    public constructor(range: Range) {
        super(range,"EmptyStatement");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}

// ES6 Section 13.5: Expression Statement

export class ExpressionStatementNode extends StatementNode {
    _nominal_type_ExpressionStatementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ExpressionStatement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

// ES6 Section 13.6: The if Statement

export class IfStatementNode extends StatementNode {
    _nominal_type_IfStatementNode: any;
    public readonly condition: ExpressionNode;
    public readonly trueBranch: StatementNode;
    public readonly falseBranch: StatementNode;
    public constructor(
        range: Range,
        condition: ExpressionNode,
        trueBranch: StatementNode,
        falseBranch: StatementNode
    ) {
        super(range,"IfStatement");
        this.condition = condition;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }
    public get children(): (ASTNode | null)[] {
        return [this.condition,this.trueBranch,this.falseBranch];
    }
}

// ES6 Section 13.7: Iteration Statements

// ES6 Section 13.7.1: Semantics

// ES6 Section 13.7.2: The do-while Statement

export class DoStatementNode extends BreakableStatementNode {
    _nominal_type_DoStatementNode: any;
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
}

// ES6 Section 13.7.3: The while Statement

export class WhileStatementNode extends BreakableStatementNode {
    _nominal_type_WhileStatementNode: any;
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
}

// ES6 Section 13.7.4: The for Statement

export class ForCNode extends BreakableStatementNode {
    _nominal_type_ForCNode: any;
    public readonly init: ForCInitType;
    public readonly condition: ExpressionNode;
    public readonly update: ExpressionNode;
    public readonly body: StatementNode;
    public constructor(
        range: Range,
        init: ForCInitType,
        condition: ExpressionNode,
        update: ExpressionNode,
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
}

// ES6 Section 13.7.5: The for-in and for-of Statements

export class ForInNode extends BreakableStatementNode {
    _nominal_type_ForInNode: any;
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
}

export class ForOfNode extends BreakableStatementNode {
    _nominal_type_ForOfNode: any;
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
}

export class VarForDeclarationNode extends ASTNode {
    _nominal_type_VarForDeclarationNode: any;
    public readonly binding: ForBindingType;
    public constructor(range: Range, binding: ForBindingType) {
        super(range,"VarForDeclaration");
        this.binding = binding;
    }
    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }
}

export class LetForDeclarationNode extends ASTNode {
    _nominal_type_LetForDeclarationNode: any;
    public readonly binding: ForBindingType;
    public constructor(range: Range, binding: ForBindingType) {
        super(range,"LetForDeclaration");
        this.binding = binding;
    }
    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }
}

export class ConstForDeclarationNode extends ASTNode {
    _nominal_type_ConstForDeclarationNode: any;
    public readonly binding: ForBindingType;
    public constructor(range: Range, binding: ForBindingType) {
        super(range,"ConstForDeclaration");
        this.binding = binding;
    }
    public get children(): (ASTNode | null)[] {
        return [this.binding];
    }
}

// ES6 Section 13.8: The continue Statement

export class ContinueStatementNode extends StatementNode {
    _nominal_type_ContinueStatementNode: any;
    public readonly labelIdentifier: LabelIdentifierNode;
    public constructor(range: Range, labelIdentifier: LabelIdentifierNode) {
        super(range,"ContinueStatement");
        this.labelIdentifier = labelIdentifier;
    }
    public get children(): (ASTNode | null)[] {
        return [this.labelIdentifier];
    }
}

// ES6 Section 13.9: The break Statement

export class BreakStatementNode extends StatementNode {
    _nominal_type_BreakStatementNode: any;
    public readonly labelIdentifier: LabelIdentifierNode;
    public constructor(range: Range, labelIdentifier: LabelIdentifierNode) {
        super(range,"BreakStatement");
        this.labelIdentifier = labelIdentifier;
    }
    public get children(): (ASTNode | null)[] {
        return [this.labelIdentifier];
    }
}

// ES6 Section 13.10: The return Statement

export class ReturnStatementNode extends StatementNode {
    _nominal_type_ReturnStatementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ReturnStatement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

// ES6 Section 13.11: The with Statement

export class WithStatementNode extends StatementNode {
    _nominal_type_WithStatementNode: any;
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
}

// ES6 Section 13.12: The switch Statement

export class SwitchStatementNode extends BreakableStatementNode {
    _nominal_type_SwitchStatementNode: any;
    public readonly expr: ExpressionNode;
    public readonly cases: CaseClauseListNode;
    public constructor(range: Range, expr: ExpressionNode, cases: CaseClauseListNode) {
        super(range,"SwitchStatement");
        this.expr = expr;
        this.cases = cases;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr,this.cases];
    }
}

export class CaseClauseListNode extends ASTNode {
    _nominal_type_CaseClauseListNode: any;
    public readonly elements: (CaseClauseNode | DefaultClauseNode)[];
    public constructor(range: Range, elements: (CaseClauseNode | DefaultClauseNode)[]) {
        super(range,"[]");
        this.elements = elements;
    }
    public get children(): (ASTNode | null)[] {
        return this.elements;
    }
}

export abstract class CaseBlockNode extends ASTNode {
    _nominal_type_CaseBlockNode: any;
};

export class CaseBlock1Node extends CaseBlockNode {
    _nominal_type_CaseBlock1Node: any;
    public caseClauses: CaseClauseListNode;
    public constructor(range: Range, caseClauses: CaseClauseListNode) {
        super(range,"CaseBlock1");
        this.caseClauses = caseClauses;
    }
    public get children(): (ASTNode | null)[] {
        return [this.caseClauses];
    }
}

export class CaseBlock2Node extends CaseBlockNode {
    _nominal_type_CaseBlock2Node: any;
    public caseClauses1: CaseClauseListNode;
    public defaultClause: DefaultClauseNode;
    public caseClauses2: CaseClauseListNode;
    public constructor(
        range: Range,
        caseClauses1: CaseClauseListNode,
        defaultClause: DefaultClauseNode,
        caseClauses2: CaseClauseListNode
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
}

export class CaseClauseNode extends ASTNode {
    _nominal_type_CaseClauseNode: any;
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
}

export class DefaultClauseNode extends ASTNode {
    _nominal_type_DefaultClauseNode: any;
    public readonly statements: StatementListNode;
    public constructor(range: Range, statements: StatementListNode) {
        super(range,"DefaultClause");
        this.statements = statements;
    }
    public get children(): (ASTNode | null)[] {
        return [this.statements];
    }
}

// ES6 Section 13.13: Labelled Statements

export class LabelledStatementNode extends StatementNode {
    _nominal_type_LabelledStatementNode: any;
    public readonly ident: LabelIdentifierNode;
    public readonly item: StatementNode | FunctionDeclarationNode;
    public constructor(
        range: Range,
        ident: LabelIdentifierNode,
        item: StatementNode | FunctionDeclarationNode
    ) {
        super(range,"LabelledStatement");
        this.ident = ident;
        this.item = item;
    }
    public get children(): (ASTNode | null)[] {
        return [this.ident,this.item];
    }
}

// ES6 Section 13.14: The throw Statement

export class ThrowStatementNode extends StatementNode {
    _nominal_type_ThrowStatementNode: any;
    public readonly expr: ExpressionNode;
    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ThrowStatement");
        this.expr = expr;
    }
    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }
}

// ES6 Section 13.15: The try Statement

export class TryStatementNode extends StatementNode {
    _nominal_type_TryStatementNode: any;
    public tryNode: BlockNode;
    public catchNode: CatchNode;
    public finallyNode: FinallyNode;
    public constructor(
        range: Range,
        tryNode: BlockNode,
        catchNode: CatchNode,
        finallyNode: FinallyNode
    ) {
        super(range,"TryStatement");
        this.tryNode = tryNode;
        this.catchNode = catchNode;
        this.finallyNode = finallyNode;
    }
    public get children(): (ASTNode | null)[] {
        return [this.tryNode,this.catchNode,this.finallyNode];
    }
}

export class CatchNode extends ASTNode {
    _nominal_type_CatchNode: any;
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
}

export class FinallyNode extends ASTNode {
    _nominal_type_FinallyNode: any;
    public readonly block: BlockNode;
    public constructor(range: Range, block: BlockNode) {
        super(range,"Finally");
        this.block = block;
    }
    public get children(): (ASTNode | null)[] {
        return [this.block];
    }
}

// ES6 Section 13.16: The debugger statement

export class DebuggerStatementNode extends StatementNode {
    _nominal_type_DebuggerStatementNode: any;
    public constructor(range: Range) {
        super(range,"DebuggerStatement");
    }
    public get children(): (ASTNode | null)[] {
        return [];
    }
}
