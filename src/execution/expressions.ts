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
    IdentifierNode,
    GenericStringNode,
    GenericNumberNode,
    check,
    CannotConvertError,
} from "../parser/ast";
import {
    MethodDefinitionNode,
    FunctionExpressionNode,
    ArrowFunctionNode,
    GeneratorExpressionNode,
    YieldExprNode,
    YieldStarNode,
    YieldNothingNode,
    ClassExpressionNode,
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
import {
    ToString,
    ToNumber,
    ToBoolean,
} from "../runtime/07-01-conversion";
import {
    GetValue,
} from "../runtime/06-02-03-reference";
import {
    ToPrimitive,
} from "../runtime/07-01-conversion";
import {
    RequireObjectCoercible,
    IsCallable,
} from "../runtime/07-02-testcompare";
import {
    Call,
} from "../runtime/07-03-objects";
import {
    pr_double_add,
    pr_double_sub,
    pr_double_mul,
    pr_double_div,
    pr_double_mod,
    pr_string_concat,
} from "../runtime/primitives";

export function ExpressionNode_fromGeneric(node: ASTNode | null): ExpressionNode {
    if (node === null)
        throw new CannotConvertError("ExpressionNode",node);
    switch (node.kind) {
        case "Multiply":
            return MultiplyNode.fromGeneric(node);
        case "Divide":
            return DivideNode.fromGeneric(node);
        case "Modulo":
            return ModuloNode.fromGeneric(node);
        case "Add":
            return AddNode.fromGeneric(node);
        case "Subtract":
            return SubtractNode.fromGeneric(node);
        case "LeftShift":
            return LeftShiftNode.fromGeneric(node);
        case "SignedRightShift":
            return SignedRightShiftNode.fromGeneric(node);
        case "UnsignedRightShift":
            return UnsignedRightShiftNode.fromGeneric(node);
        case "LessThan":
            return LessThanNode.fromGeneric(node);
        case "GreaterThan":
            return GreaterThanNode.fromGeneric(node);
        case "LessEqual":
            return LessEqualNode.fromGeneric(node);
        case "GreaterEqual":
            return GreaterEqualNode.fromGeneric(node);
        case "InstanceOf":
            return InstanceOfNode.fromGeneric(node);
        case "In":
            return InNode.fromGeneric(node);
        case "AbstractEquals":
            return AbstractEqualsNode.fromGeneric(node);
        case "AbstractNotEquals":
            return AbstractNotEqualsNode.fromGeneric(node);
        case "StrictEquals":
            return StrictEqualsNode.fromGeneric(node);
        case "StrictNotEquals":
            return StrictNotEqualsNode.fromGeneric(node);
        case "BitwiseAND":
            return BitwiseANDNode.fromGeneric(node);
        case "BitwiseXOR":
            return BitwiseXORNode.fromGeneric(node);
        case "BitwiseOR":
            return BitwiseORNode.fromGeneric(node);
        case "LogicalAND":
            return LogicalANDNode.fromGeneric(node);
        case "LogicalOR":
            return LogicalORNode.fromGeneric(node);
        case "Assign":
            return AssignNode.fromGeneric(node);
        case "AssignMultiply":
            return AssignMultiplyNode.fromGeneric(node);
        case "AssignDivide":
            return AssignDivideNode.fromGeneric(node);
        case "AssignModulo":
            return AssignModuloNode.fromGeneric(node);
        case "AssignAdd":
            return AssignAddNode.fromGeneric(node);
        case "AssignSubtract":
            return AssignSubtractNode.fromGeneric(node);
        case "AssignLeftShift":
            return AssignLeftShiftNode.fromGeneric(node);
        case "AssignSignedRightShift":
            return AssignSignedRightShiftNode.fromGeneric(node);
        case "AssignUnsignedRightShift":
            return AssignUnsignedRightShiftNode.fromGeneric(node);
        case "AssignBitwiseAND":
            return AssignBitwiseANDNode.fromGeneric(node);
        case "AssignBitwiseXOR":
            return AssignBitwiseXORNode.fromGeneric(node);
        case "AssignBitwiseOR":
            return AssignBitwiseORNode.fromGeneric(node);
        case "Comma":
            return CommaNode.fromGeneric(node);
        case "IdentifierReference":
            return IdentifierReferenceNode.fromGeneric(node);
        case "This":
            return ThisNode.fromGeneric(node);
        case "NullLiteral":
            return NullLiteralNode.fromGeneric(node);
        case "True":
            return TrueNode.fromGeneric(node);
        case "False":
            return FalseNode.fromGeneric(node);
        case "NumericLiteral":
            return NumericLiteralNode.fromGeneric(node);
        case "StringLiteral":
            return StringLiteralNode.fromGeneric(node);
        case "ArrayLiteral":
            return ArrayLiteralNode.fromGeneric(node);
        case "ObjectLiteral":
            return ObjectLiteralNode.fromGeneric(node);
        case "MemberAccessExpr":
            return MemberAccessExprNode.fromGeneric(node);
        case "MemberAccessIdent":
            return MemberAccessIdentNode.fromGeneric(node);
        case "SuperPropertyExpr":
            return SuperPropertyExprNode.fromGeneric(node);
        case "SuperPropertyIdent":
            return SuperPropertyIdentNode.fromGeneric(node);
        case "NewTarget":
            return NewTargetNode.fromGeneric(node);
        case "NewExpression":
            return NewExpressionNode.fromGeneric(node);
        case "Call":
            return CallNode.fromGeneric(node);
        case "SuperCall":
            return SuperCallNode.fromGeneric(node);
        case "PostIncrement":
            return PostIncrementNode.fromGeneric(node);
        case "PostDecrement":
            return PostDecrementNode.fromGeneric(node);
        case "Delete":
            return DeleteNode.fromGeneric(node);
        case "Void":
            return VoidNode.fromGeneric(node);
        case "TypeOf":
            return TypeOfNode.fromGeneric(node);
        case "PreIncrement":
            return PreIncrementNode.fromGeneric(node);
        case "PreDecrement":
            return PreDecrementNode.fromGeneric(node);
        case "UnaryPlus":
            return UnaryPlusNode.fromGeneric(node);
        case "UnaryMinus":
            return UnaryMinusNode.fromGeneric(node);
        case "UnaryBitwiseNot":
            return UnaryBitwiseNotNode.fromGeneric(node);
        case "UnaryLogicalNot":
            return UnaryLogicalNotNode.fromGeneric(node);
        case "Conditional":
            return ConditionalNode.fromGeneric(node);
        case "FunctionExpression":
            return FunctionExpressionNode.fromGeneric(node);
        case "ArrowFunction":
            return ArrowFunctionNode.fromGeneric(node);
        case "GeneratorExpression":
            return GeneratorExpressionNode.fromGeneric(node);
        case "YieldExpr":
            return YieldExprNode.fromGeneric(node);
        case "YieldStar":
            return YieldStarNode.fromGeneric(node);
        case "YieldNothing":
            return YieldNothingNode.fromGeneric(node);
        case "ClassExpression":
            return ClassExpressionNode.fromGeneric(node);
        default:
            throw new CannotConvertError("ExpressionNode",node);
    }
}

export type LiteralPropertyNameType = IdentifierNode | StringLiteralNode | NumericLiteralNode;
export const LiteralPropertyNameType = {
    fromGeneric(node: ASTNode | null): LiteralPropertyNameType {
        if (node === null)
            throw new CannotConvertError("LiteralPropertyNameType",node);
        switch (node.kind) {
            case "Identifier":
                return IdentifierNode.fromGeneric(node);
            case "StringLiteral":
                return StringLiteralNode.fromGeneric(node);
            case "NumericLiteral":
                return NumericLiteralNode.fromGeneric(node);
            default:
                throw new CannotConvertError("LiteralPropertyNameType",node);
        }
    }
};

export type PropertyNameType = ComputedPropertyNameNode | LiteralPropertyNameType;
export const PropertyNameType = {
    fromGeneric(node: ASTNode | null): PropertyNameType {
        if (node === null)
            throw new CannotConvertError("PropertyNameType",node);
        switch (node.kind) {
            case "ComputedPropertyName":
                return ComputedPropertyNameNode.fromGeneric(node);
            case "Identifier":
            case "StringLiteral":
            case "NumericLiteral":
                return LiteralPropertyNameType.fromGeneric(node);
            default:
                throw new CannotConvertError("PropertyNameType",node);
        }
    }
};

export type PropertyDefinitionType = ColonPropertyDefinitionNode | CoverInitializedNameNode |
                                     MethodDefinitionNode | IdentifierReferenceNode;
export const PropertyDefinitionType = {
    fromGeneric(node: ASTNode | null): PropertyDefinitionType {
        if (node === null)
            throw new CannotConvertError("PropertyDefinitionType",node);
        switch (node.kind) {
            case "ColonPropertyDefinition":
                return ColonPropertyDefinitionNode.fromGeneric(node);
            case "CoverInitializedName":
                return CoverInitializedNameNode.fromGeneric(node);
            case "IdentifierReference":
                return IdentifierReferenceNode.fromGeneric(node);
            default:
                return MethodDefinitionNode.fromGeneric(node);
        }
    }
};

export type ArgumentType = ExpressionNode | SpreadElementNode;
export const ArgumentType = {
    fromGeneric(node: ASTNode | null): ArgumentType {
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        try { return SpreadElementNode.fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArgumentType",node);
    }
};

export type ArrayLiteralItemType = ElisionNode | SpreadElementNode | ExpressionNode;
export const ArrayLiteralItemType = {
    fromGeneric(node: ASTNode | null): ArrayLiteralItemType {
        try { return ElisionNode.fromGeneric(node); } catch (e) {}
        try { return SpreadElementNode.fromGeneric(node); } catch (e) {}
        try { return ExpressionNode_fromGeneric(node); } catch (e) {}
        throw new CannotConvertError("ArrayLiteralItemType",node);
    }
};

// ES6 Chapter 12: ECMAScript Language: Expressions

export abstract class BinaryNode extends ExpressionNode {
    public _type_BinaryNode: any;
    public readonly left: ExpressionNode;
    public readonly right: ExpressionNode;
    public readonly _children: ASTNode[];

    public constructor(range: Range, kind: string, left: ExpressionNode, right: ExpressionNode) {
        super(range,kind);
        this.left = left;
        this.right = right;
        this._children = [left,right];
    }

    public get children(): (ASTNode | null)[] {
        return this._children;
    }

    public abstract evaluate(ctx: ExecutionContext): Completion<JSValue | Reference>;
}

// ES6 Section 12.1: Identifiers

export class IdentifierReferenceNode extends ExpressionNode {
    public _type_IdentifierReferenceNode: any;
    public readonly value: string;

    public constructor(range: Range, value: string) {
        super(range,"IdentifierReference");
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        return "IdentifierReference("+JSON.stringify(this.value)+")";
        // return this.value;
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return ctx.ResolveBinding(this.value);
    }

    public static fromGeneric(node: ASTNode | null): IdentifierReferenceNode {
        if ((node === null) || (node.kind !== "IdentifierReference") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("IdentifierReference",node);
        return new IdentifierReferenceNode(node.range,node.value);
    }
}

// ES6 Section 12.2: Primary Expression

// ES6 Section 12.2.1: Semantics

// ES6 Section 12.2.2: The this Keyword

export class ThisNode extends ExpressionNode {
    public _type_ThisNode: any;

    public constructor(range: Range) {
        super(range,"This");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return ctx.ResolveThisBinding();
    }

    public static fromGeneric(node: ASTNode | null): ThisNode {
        node = check.node(node,"This",0);
        return new ThisNode(node.range);
    }
}

// ES6 Section 12.2.3: Identifier Reference

// ES6 Section 12.2.4: Literals

export class NullLiteralNode extends ExpressionNode {
    public _type_NullLiteralNode: any;

    public constructor(range: Range) {
        super(range,"NullLiteral");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return new NormalCompletion(new JSNull());
    }

    public static fromGeneric(node: ASTNode | null): NullLiteralNode {
        node = check.node(node,"NullLiteral",0);
        return new NullLiteralNode(node.range);
    }
}

export class TrueNode extends ExpressionNode {
    public _type_TrueNode: any;

    public constructor(range: Range) {
        super(range,"True");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return new NormalCompletion(new JSBoolean(true));
    }

    public static fromGeneric(node: ASTNode | null): TrueNode {
        node = check.node(node,"True",0);
        return new TrueNode(node.range);
    }
}

export class FalseNode extends ExpressionNode {
    public _type_FalseNode: any;

    public constructor(range: Range) {
        super(range,"False");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return new NormalCompletion(new JSBoolean(false));
    }

    public static fromGeneric(node: ASTNode | null): FalseNode {
        node = check.node(node,"False",0);
        return new FalseNode(node.range);
    }
}

export class NumericLiteralNode extends ExpressionNode {
    public _type_NumericLiteralNode: any;
    public readonly value: number;

    public constructor(range: Range, value: number) {
        super(range,"NumericLiteral");
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        // return "NumericLiteral("+this.value+")";
        return ""+this.value;
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return new NormalCompletion(new JSNumber(this.value));
    }

    public static fromGeneric(node: ASTNode | null): NumericLiteralNode {
        if ((node === null) || (node.kind !== "NumericLiteral") || !(node instanceof GenericNumberNode))
            throw new CannotConvertError("NumericLiteral",node);
        return new NumericLiteralNode(node.range,node.value);
    }
}

export class StringLiteralNode extends ExpressionNode {
    public _type_StringLiteralNode: any;
    public readonly value: string;

    public constructor(range: Range, value: string) {
        super(range,"StringLiteral");
        this.value = value;
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public get label(): string {
        // return "StringLiteral("+JSON.stringify(this.value)+")";
        return JSON.stringify(this.value);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        return new NormalCompletion(new JSString(this.value));
    }

    public static fromGeneric(node: ASTNode | null): StringLiteralNode {
        if ((node === null) || (node.kind !== "StringLiteral") || !(node instanceof GenericStringNode))
            throw new CannotConvertError("StringLiteral",node);
        return new StringLiteralNode(node.range,node.value);
    }
}

// ES6 Section 12.2.5: Array Initializer

export class ElementListNode extends ASTNode {
    public _type_ElementListNode: any;
    public readonly elements: ArrayLiteralItemType[];

    public constructor(range: Range, elements: ArrayLiteralItemType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): ElementListNode {
        const list = check.list(node);
        const elements: ArrayLiteralItemType[] = [];
        for (const listElement of list.elements)
            elements.push(ArrayLiteralItemType.fromGeneric(listElement));
        return new ElementListNode(list.range,elements);
    }
}

export class ArrayLiteralNode extends ExpressionNode {
    public _type_ArrayLiteralNode: any;
    private readonly elements: ElementListNode;

    public constructor(range: Range, elements: ElementListNode) {
        super(range,"ArrayLiteral");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return [this.elements];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ArrayLiteralNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ArrayLiteralNode {
        node = check.node(node,"ArrayLiteral",1);
        const elements = ElementListNode.fromGeneric(node.children[0]);
        return new ArrayLiteralNode(node.range,elements);
    }
}

export class ElisionNode extends ASTNode {
    public _type_ElisionNode: any;

    public constructor(range: Range) {
        super(range,"Elision");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public static fromGeneric(node: ASTNode | null): ElisionNode {
        node = check.node(node,"Elision",0);
        return new ElisionNode(node.range);
    }
}

export class SpreadElementNode extends ASTNode {
    public _type_SpreadElementNode: any;
    public readonly child: ExpressionNode;

    public constructor(range: Range, child: ExpressionNode) {
        super(range,"SpreadElement");
        this.child = child;
    }

    public get children(): (ASTNode | null)[] {
        return [this.child];
    }

    public static fromGeneric(node: ASTNode | null): SpreadElementNode {
        node = check.node(node,"SpreadElement",1);
        const child = ExpressionNode_fromGeneric(node.children[0]);
        return new SpreadElementNode(node.range,child);
    }
}

// ES6 Section 12.2.6: Object Initializer

export class PropertyDefinitionListNode extends ASTNode {
    public _type_PropertyDefinitionListNode: any;
    public readonly elements: PropertyDefinitionType[];

    public constructor(range: Range, elements: PropertyDefinitionType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): PropertyDefinitionListNode {
        const list = check.list(node);
        const elements: PropertyDefinitionType[] = [];
        for (const listElement of list.elements)
            elements.push(PropertyDefinitionType.fromGeneric(listElement));
        return new PropertyDefinitionListNode(list.range,elements);
    }
}

export class ObjectLiteralNode extends ExpressionNode {
    public _type_ObjectLiteralNode: any;
    public readonly properties: PropertyDefinitionListNode;

    public constructor(range: Range, properties: PropertyDefinitionListNode) {
        super(range,"ObjectLiteral");
        this.properties = properties;
    }

    public get children(): (ASTNode | null)[] {
        return [this.properties];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ObjectLiteralNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ObjectLiteralNode {
        node = check.node(node,"ObjectLiteral",1);
        const properties = PropertyDefinitionListNode.fromGeneric(node.children[0]);
        return new ObjectLiteralNode(node.range,properties);
    }
}

export class ColonPropertyDefinitionNode extends ASTNode {
    public _type_ColonPropertyDefinitionNode: any;
    public readonly name: PropertyNameType;
    public readonly init: ExpressionNode;

    public constructor(range: Range, name: PropertyNameType, init: ExpressionNode) {
        super(range,"ColonPropertyDefinition");
        this.name = name;
        this.init = init;
    }

    public get children(): (ASTNode | null)[] {
        return [this.name,this.init];
    }

    public static fromGeneric(node: ASTNode | null): ColonPropertyDefinitionNode {
        node = check.node(node,"ColonPropertyDefinition",2);
        const name = PropertyNameType.fromGeneric(node.children[0]);
        const init = ExpressionNode_fromGeneric(node.children[1]);
        return new ColonPropertyDefinitionNode(node.range,name,init);
    }
}

export class ComputedPropertyNameNode extends ASTNode {
    public _type_ComputedPropertyNameNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"ComputedPropertyName");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public static fromGeneric(node: ASTNode | null): ComputedPropertyNameNode {
        node = check.node(node,"ComputedPropertyName",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new ComputedPropertyNameNode(node.range,expr);
    }
}

export class CoverInitializedNameNode extends ASTNode {
    public _type_CoverInitializedNameNode: any;
    public readonly ident: IdentifierReferenceNode;
    public readonly init: ExpressionNode;

    public constructor(range: Range, ident: IdentifierReferenceNode, init: ExpressionNode) {
        super(range,"CoverInitializedName");
        this.ident = ident;
        this.init = init;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident,this.init];
    }

    public static fromGeneric(node: ASTNode | null): CoverInitializedNameNode {
        node = check.node(node,"CoverInitializedName",2);
        const ident = IdentifierReferenceNode.fromGeneric(node.children[0]);
        const init = ExpressionNode_fromGeneric(node.children[1]);
        return new CoverInitializedNameNode(node.range,ident,init);
    }
}

// ES6 Section 12.2.7: Function Defining Expressions

// ES6 Section 12.2.8: Regular Expression Literals

// ES6 Section 12.2.9: Template Literals

// ES6 Section 12.2.10: The Grouping Operator

// ES6 Section 12.3: Left-Hand-Side Expressions

export class MemberAccessExprNode extends ExpressionNode {
    public _type_MemberAccessExprNode: any;
    public readonly obj: ExpressionNode;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, obj: ExpressionNode, expr: ExpressionNode) {
        super(range,"MemberAccessExpr");
        this.obj = obj;
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.obj,this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("MemberAccessExprNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): MemberAccessExprNode {
        node = check.node(node,"MemberAccessExpr",2);
        const obj = ExpressionNode_fromGeneric(node.children[0]);
        const expr = ExpressionNode_fromGeneric(node.children[1]);
        return new MemberAccessExprNode(node.range,obj,expr);
    }
}

export class MemberAccessIdentNode extends ExpressionNode {
    public _type_MemberAccessIdentNode: any;
    public readonly obj: ExpressionNode;
    public readonly ident: IdentifierNode;

    public constructor(range: Range, obj: ExpressionNode, ident: IdentifierNode) {
        super(range,"MemberAccessIdent");
        this.obj = obj;
        this.ident = ident;
    }

    public get children(): (ASTNode | null)[] {
        return [this.obj,this.ident];
    }

    // ES6 Section 12.3.2.1: Property Accessors - Runtime Semantics: Evaluation

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        const leftNode = this.obj;
        const rightNode = this.ident;

        // 1. Let baseReference be the result of evaluating MemberExpression.
        const baseReferenceComp = leftNode.evaluate(ctx);
        if (!(baseReferenceComp instanceof NormalCompletion))
            return baseReferenceComp;

        // 2. Let baseValue be GetValue(baseReference).
        // 3. ReturnIfAbrupt(baseValue).
        const baseValueComp = GetValue(ctx.realm,baseReferenceComp);
        if (!(baseValueComp instanceof NormalCompletion))
            return baseValueComp;
        const baseValue = baseValueComp.value;

        // 4. Let bv be RequireObjectCoercible(baseValue).
        // 5. ReturnIfAbrupt(bv).
        const bvComp = RequireObjectCoercible(ctx.realm,baseValue);
        if (!(bvComp instanceof NormalCompletion))
            return bvComp;
        const bv = bvComp.value;
        if (!(bv instanceof JSObject))
            throw new Error("FIXME: Need to support non-objects for MemberAccessIdent");

        // 6. Let propertyNameString be StringValue of IdentifierName
        const propertyNameString = rightNode.value;

        // 7. If the code matched by the syntactic production that is being evaluated is strict mode
        // code, let strict be true, else let strict be false.
        const strict = true; // FIXME: This must be determined by the AST node

        // 8. Return a value of type Reference whose base value is bv and whose referenced name is
        // propertyNameString, and whose strict reference flag is strict.
        const ref = new PropertyReference(bv,new JSString(propertyNameString),strict);
        return new NormalCompletion(ref);
    }

    public static fromGeneric(node: ASTNode | null): MemberAccessIdentNode {
        node = check.node(node,"MemberAccessIdent",2);
        const obj = ExpressionNode_fromGeneric(node.children[0]);
        const ident = IdentifierNode.fromGeneric(node.children[1]);
        return new MemberAccessIdentNode(node.range,obj,ident);
    }
}

export class SuperPropertyExprNode extends ExpressionNode {
    public _type_SuperPropertyExprNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"SuperPropertyExpr");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("SuperPropertyExprNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): SuperPropertyExprNode {
        node = check.node(node,"SuperPropertyExpr",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new SuperPropertyExprNode(node.range,expr);
    }
}

export class SuperPropertyIdentNode extends ExpressionNode {
    public _type_SuperPropertyIdentNode: any;
    public readonly ident: IdentifierNode;

    public constructor(range: Range, ident: IdentifierNode) {
        super(range,"SuperPropertyIdent");
        this.ident = ident;
    }

    public get children(): (ASTNode | null)[] {
        return [this.ident];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("SuperPropertyIdentNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): SuperPropertyIdentNode {
        node = check.node(node,"SuperPropertyIdent",1);
        const ident = IdentifierNode.fromGeneric(node.children[0]);
        return new SuperPropertyIdentNode(node.range,ident);
    }
}

export class NewTargetNode extends ExpressionNode {
    public _type_NewTargetNode: any;

    public constructor(range: Range) {
        super(range,"NewTarget");
    }

    public get children(): (ASTNode | null)[] {
        return [];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("NewTargetNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): NewTargetNode {
        node = check.node(node,"NewTarget",0);
        return new NewTargetNode(node.range);
    }
}

export class NewExpressionNode extends ExpressionNode {
    public _type_NewExpressionNode: any;
    public readonly expr: ExpressionNode;
    public readonly args: ArgumentsNode | null;

    public constructor(range: Range, expr: ExpressionNode, args: ArgumentsNode | null) {
        super(range,"NewExpression");
        this.expr = expr;
        this.args = args;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr,this.args];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("NewExpressionNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): NewExpressionNode {
        node = check.node(node,"NewExpression",2);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        const args = (node.children[1] === null) ? null : ArgumentsNode.fromGeneric(node.children[1]);
        return new NewExpressionNode(node.range,expr,args);
    }
}

// ES6 Section 12.3.4.3: Function Call - Runtime Semantics:
// EvaluateDirectCall (func, thisValue, arguments, tailPosition)

function EvaluateDirectCall(ctx: ExecutionContext, func: JSValue, thisValue: JSValue,
                            args: ArgumentType[], tailPosition: boolean): Completion<JSValue> {
    const argListComp = ArgumentListEvaluation(ctx,args);
    if (!(argListComp instanceof NormalCompletion))
        return argListComp;
    const argList = argListComp.value;

    if (!(func instanceof JSValue))
        return ctx.realm.throwTypeError("Attempt to call a value that is not an object");

    if (!IsCallable(ctx.realm,func))
        return ctx.realm.throwTypeError("Object is not callable");

    // FIXME: support tail calls
    return Call(ctx.realm,func,thisValue,argList);
}

// ES6 Section 12.3.6.1: Argument Lists - Runtime Semantics: ArgumentListEvaluation

function ArgumentListEvaluation(ctx: ExecutionContext, argNodes: ArgumentType[]): Completion<JSValue[]> {
    // FIXME: This is just a temporary implementation to get basic functionality... need to look
    // closer at the spec to ensure we're doing it correctly, and add support for spread arguments
    const result: JSValue[] = [];
    for (let i = 0; i < argNodes.length; i++) {
        const argNode = argNodes[i];
        if (argNode instanceof SpreadElementNode)
            throw new Error("SpreadElementNode support not implemented");
        const refComp = argNode.evaluate(ctx);
        const argComp = GetValue(ctx.realm,refComp);
        if (!(argComp instanceof NormalCompletion))
            return argComp;
        const arg = argComp.value;
        result.push(arg);
    }
    return new NormalCompletion(result);
}

export class CallNode extends ExpressionNode {
    public _type_CallNode: any;
    public readonly fun: ExpressionNode;
    public readonly args: ArgumentsNode;

    public constructor(range: Range, fun: ExpressionNode, args: ArgumentsNode) {
        super(range,"Call");
        this.fun = fun;
        this.args = args;
    }

    public get children(): (ASTNode | null)[] {
        return [this.fun,this.args];
    }

    // ES6 Section 12.3.4.1: Function Calls - Runtime Semantics: Evaluation

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        // A basic, incomplete implementation. Need to go through this and expand it to cover all
        // steps given in the spec. For example we don't set the this value correctly.
        // checkNode(node,"Call",2);
        const funNode = this.fun; // checkNodeNotNull(node.children[0]);
        const argsNode = this.args; // checkNode(node.children[1],"Arguments",1);
        const argsListNode = this.args.items; // checkListNode(argsNode.children[0]);

        const refComp = funNode.evaluate(ctx);
        const funcComp = GetValue(ctx.realm,refComp);
        if (!(funcComp instanceof NormalCompletion))
            return funcComp;
        const func = funcComp.value;

        const thisValue = new JSUndefined(); // FIXME: temp

        return EvaluateDirectCall(ctx,func,thisValue,argsListNode.elements,false);
    }

    public static fromGeneric(node: ASTNode | null): CallNode {
        node = check.node(node,"Call",2);
        const fun = ExpressionNode_fromGeneric(node.children[0]);
        const args = ArgumentsNode.fromGeneric(node.children[1]);
        return new CallNode(node.range,fun,args);
    }
}

export class SuperCallNode extends ExpressionNode {
    public _type_SuperCallNode: any;
    public readonly args: ArgumentsNode;

    public constructor(range: Range, args: ArgumentsNode) {
        super(range,"SuperCall");
        this.args = args;
    }

    public get children(): (ASTNode | null)[] {
        return [this.args];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("SuperCallNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): SuperCallNode {
        node = check.node(node,"SuperCall",1);
        const args = ArgumentsNode.fromGeneric(node.children[0]);
        return new SuperCallNode(node.range,args);
    }
}

export class ArgumentListNode extends ASTNode {
    public _type_ArgumentListNode: any;
    public readonly elements: ArgumentType[];

    public constructor(range: Range, elements: ArgumentType[]) {
        super(range,"[]");
        this.elements = elements;
    }

    public get children(): (ASTNode | null)[] {
        return this.elements;
    }

    public static fromGeneric(node: ASTNode | null): ArgumentListNode {
        const list = check.list(node);
        const elements: ArgumentType[] = [];
        for (const listElement of list.elements)
            elements.push(ArgumentType.fromGeneric(listElement));
        return new ArgumentListNode(list.range,elements);
    }
}

export class ArgumentsNode extends ASTNode {
    public _type_ArgumentsNode: any;
    public readonly items: ArgumentListNode;

    public constructor(range: Range, items: ArgumentListNode) {
        super(range,"Arguments");
        this.items = items;
    }

    public get children(): (ASTNode | null)[] {
        return [this.items];
    }

    public static fromGeneric(node: ASTNode | null): ArgumentsNode {
        node = check.node(node,"Arguments",1);
        const items = ArgumentListNode.fromGeneric(node.children[0]);
        return new ArgumentsNode(node.range,items);
    }
}

// ES6 Section 12.4: Postfix Expressions

export class PostIncrementNode extends ExpressionNode {
    public _type_PostIncrementNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PostIncrement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("PostIncrementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): PostIncrementNode {
        node = check.node(node,"PostIncrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PostIncrementNode(node.range,expr);
    }
}

export class PostDecrementNode extends ExpressionNode {
    public _type_PostDecrementNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PostDecrement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("PostDecrementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): PostDecrementNode {
        node = check.node(node,"PostDecrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PostDecrementNode(node.range,expr);
    }
}

// ES6 Section 12.5: Unary Operators

export class DeleteNode extends ExpressionNode {
    public _type_DeleteNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Delete");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("DeleteNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): DeleteNode {
        node = check.node(node,"Delete",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new DeleteNode(node.range,expr);
    }
}

export class VoidNode extends ExpressionNode {
    public _type_VoidNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"Void");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("VoidNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): VoidNode {
        node = check.node(node,"Void",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new VoidNode(node.range,expr);
    }
}

export class TypeOfNode extends ExpressionNode {
    public _type_TypeOfNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"TypeOf");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("TypeOfNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): TypeOfNode {
        node = check.node(node,"TypeOf",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new TypeOfNode(node.range,expr);
    }
}

export class PreIncrementNode extends ExpressionNode {
    public _type_PreIncrementNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PreIncrement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("PreIncrementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): PreIncrementNode {
        node = check.node(node,"PreIncrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PreIncrementNode(node.range,expr);
    }
}

export class PreDecrementNode extends ExpressionNode {
    public _type_PreDecrementNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"PreDecrement");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("PreDecrementNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): PreDecrementNode {
        node = check.node(node,"PreDecrement",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new PreDecrementNode(node.range,expr);
    }
}

export class UnaryPlusNode extends ExpressionNode {
    public _type_UnaryPlusNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryPlus");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("UnaryPlusNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): UnaryPlusNode {
        node = check.node(node,"UnaryPlus",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryPlusNode(node.range,expr);
    }
}

export class UnaryMinusNode extends ExpressionNode {
    public _type_UnaryMinusNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryMinus");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("UnaryMinusNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): UnaryMinusNode {
        node = check.node(node,"UnaryMinus",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryMinusNode(node.range,expr);
    }
}

export class UnaryBitwiseNotNode extends ExpressionNode {
    public _type_UnaryBitwiseNotNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryBitwiseNot");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("UnaryBitwiseNotNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): UnaryBitwiseNotNode {
        node = check.node(node,"UnaryBitwiseNot",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryBitwiseNotNode(node.range,expr);
    }
}

export class UnaryLogicalNotNode extends ExpressionNode {
    public _type_UnaryLogicalNotNode: any;
    public readonly expr: ExpressionNode;

    public constructor(range: Range, expr: ExpressionNode) {
        super(range,"UnaryLogicalNot");
        this.expr = expr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.expr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("UnaryLogicalNotNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): UnaryLogicalNotNode {
        node = check.node(node,"UnaryLogicalNot",1);
        const expr = ExpressionNode_fromGeneric(node.children[0]);
        return new UnaryLogicalNotNode(node.range,expr);
    }
}

// ES6 Section 12.6: Multiplicative Operators

export abstract class MultiplicativeNode extends BinaryNode {
    public _type_MultiplicativeNode: any;

    protected abstract primitiveEvaluate(a: number, b: number): number;

    // ES6 Section 12.6.3: Multiplicative Operators - Runtime Semantics: Evaluation

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        const leftNode = this.left;
        const rightNode = this.right;

        // 1. Let left be the result of evaluating MultiplicativeExpression.
        const leftComp = leftNode.evaluate(ctx);

        // 2. Let leftValue be GetValue(left).
        // 3. ReturnIfAbrupt(leftValue).
        const leftValueComp = GetValue(ctx.realm,leftComp);

        // 4. Let right be the result of evaluating UnaryExpression.
        const rightComp = rightNode.evaluate(ctx);

        // 5. Let rightValue be GetValue(right).
        const rightValueComp = GetValue(ctx.realm,rightComp);

        // 6. Let lnum be ToNumber(leftValue).
        // 7. ReturnIfAbrupt(lnum).
        const lnumComp = ToNumber(ctx.realm,leftValueComp);
        if (!(lnumComp instanceof NormalCompletion))
            return lnumComp;
        const lnum = lnumComp.value;

        // 8. Let rnum be ToNumber(rightValue).
        // 9. ReturnIfAbrupt(rnum).
        const rnumComp = ToNumber(ctx.realm,rightValueComp);
        if (!(rnumComp instanceof NormalCompletion))
            return rnumComp;
        const rnum = rnumComp.value;

        // 10. Return the result of applying the MultiplicativeOperator (*, /, or %) to lnum and rnum
        // as specified in 12.6.3.1, 12.6.3.2, or 12.6.3.3.
        let resultNum = this.primitiveEvaluate(lnum.numberValue,rnum.numberValue);
        return new NormalCompletion(new JSNumber(resultNum));
    }
}

export class MultiplyNode extends MultiplicativeNode {
    public _type_MultiplyNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Multiply",left,right);
    }

    protected primitiveEvaluate(leftValue: number, rightValue: number): number {
        return pr_double_mul(leftValue,rightValue);
    }

    public static fromGeneric(node: ASTNode | null): MultiplyNode {
        node = check.node(node,"Multiply",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new MultiplyNode(node.range,left,right);
    }
}

export class DivideNode extends MultiplicativeNode {
    public _type_DivideNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Divide",left,right);
    }

    protected primitiveEvaluate(leftValue: number, rightValue: number): number {
        return pr_double_div(leftValue,rightValue);
    }

    public static fromGeneric(node: ASTNode | null): DivideNode {
        node = check.node(node,"Divide",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new DivideNode(node.range,left,right);
    }
}

export class ModuloNode extends MultiplicativeNode {
    public _type_ModuloNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Modulo",left,right);
    }

    protected primitiveEvaluate(leftValue: number, rightValue: number): number {
        return pr_double_mod(leftValue,rightValue);
    }

    public static fromGeneric(node: ASTNode | null): ModuloNode {
        node = check.node(node,"Modulo",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new ModuloNode(node.range,left,right);
    }
}

// ES6 Section 12.7: Additive Operators

export class AddNode extends BinaryNode {
    public _type_AddNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Add",left,right);
    }

    // ES6 Section 12.7.3.1: The Addition operator ( + ) - Runtime Semantics: Evaluation

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        const left = this.left;
        const right = this.right;

        // 1. Let lref be the result of evaluating AdditiveExpression.
        const lrefComp = left.evaluate(ctx);

        // 2. Let lval be GetValue(lref).
        // 3. ReturnIfAbrupt(lval).
        const lvalComp = GetValue(ctx.realm,lrefComp);
        if (!(lvalComp instanceof NormalCompletion))
            return lvalComp;
        const lval = lvalComp.value;

        // 4. Let rref be the result of evaluating MultiplicativeExpression.
        const rrefComp = right.evaluate(ctx);

        // 5. Let rval be GetValue(rref).
        // 6. ReturnIfAbrupt(rval).
        const rvalComp = GetValue(ctx.realm,rrefComp);
        if (!(rvalComp instanceof NormalCompletion))
            return rvalComp;
        const rval = rvalComp.value;

        // 7. Let lprim be ToPrimitive(lval).
        // 8. ReturnIfAbrupt(lprim).
        const lprimComp = ToPrimitive(ctx.realm,lval);
        if (!(lprimComp instanceof NormalCompletion))
            return lprimComp;
        const lprim = lprimComp.value;

        // 9. Let rprim be ToPrimitive(rval).
        // 10. ReturnIfAbrupt(rprim).
        const rprimComp = ToPrimitive(ctx.realm,rval);
        if (!(rprimComp instanceof NormalCompletion))
            return rprimComp;
        const rprim = rprimComp.value;

        // 11. If Type(lprim) is String or Type(rprim) is String, then
        if ((lprim instanceof JSString) || (rprim instanceof JSString)) {
            // a. Let lstr be ToString(lprim).
            // b. ReturnIfAbrupt(lstr).
            const lstrComp = ToString(ctx.realm,lprim);
            if (!(lstrComp instanceof NormalCompletion))
                return lstrComp;
            const lstr = lstrComp.value;

            // c. Let rstr be ToString(rprim).
            // d. ReturnIfAbrupt(rstr).
            const rstrComp = ToString(ctx.realm,rprim);
            if (!(rstrComp instanceof NormalCompletion))
                return rstrComp;
            const rstr = rstrComp.value;

            // e. Return the String that is the result of concatenating lstr and rstr.
            const resultStr = pr_string_concat(lstr.stringValue,rstr.stringValue);
            const result = new JSString(resultStr);
            return new NormalCompletion(result);
        }

        // 12. Let lnum be ToNumber(lprim).
        // 13. ReturnIfAbrupt(lnum).
        const lnumComp = ToNumber(ctx.realm,lprim);
        if (!(lnumComp instanceof NormalCompletion))
            return lnumComp;
        const lnum = lnumComp.value;

        // 14. Let rnum be ToNumber(rprim).
        // 15. ReturnIfAbrupt(rnum).
        const rnumComp = ToNumber(ctx.realm,rprim);
        if (!(rnumComp instanceof NormalCompletion))
            return rnumComp;
        const rnum = rnumComp.value;

        // 16. Return the result of applying the addition operation to lnum and rnum.
        const resultNum = pr_double_add(lnum.numberValue,rnum.numberValue);
        const result = new JSNumber(resultNum);
        return new NormalCompletion(result);
    }

    public static fromGeneric(node: ASTNode | null): AddNode {
        node = check.node(node,"Add",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AddNode(node.range,left,right);
    }
}

export class SubtractNode extends BinaryNode {
    public _type_SubtractNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Subtract",left,right);
    }

    // ES6 Section 12.7.4.1: The Subtraction Operator ( - ) - Runtime Semantics: Evaluation

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        const left = this.left;
        const right = this.right;

        // 1. Let lref be the result of evaluating AdditiveExpression.
        const lrefComp = left.evaluate(ctx);

        // 2. Let lval be GetValue(lref).
        // 3. ReturnIfAbrupt(lval).
        const lvalComp = GetValue(ctx.realm,lrefComp);
        if (!(lvalComp instanceof NormalCompletion))
            return lvalComp;
        const lval = lvalComp.value;

        // 4. Let rref be the result of evaluating MultiplicativeExpression.
        const rrefComp = right.evaluate(ctx);

        // 5. Let rval be GetValue(rref).
        // 6. ReturnIfAbrupt(rval).
        const rvalComp = GetValue(ctx.realm,rrefComp);
        if (!(rvalComp instanceof NormalCompletion))
            return rvalComp;
        const rval = rvalComp.value;

        // 7. Let lnum be ToNumber(lval).
        // 8. ReturnIfAbrupt(lnum).
        const lnumComp = ToNumber(ctx.realm,lval);
        if (!(lnumComp instanceof NormalCompletion))
            return lnumComp;
        const lnum = lnumComp.value;

        // 9. Let rnum be ToNumber(rval).
        // 10. ReturnIfAbrupt(rnum).
        const rnumComp = ToNumber(ctx.realm,rval);
        if (!(rnumComp instanceof NormalCompletion))
            return rnumComp;
        const rnum = rnumComp.value;

        // 1. Return the result of applying the subtraction operation to lnum and rnum.
        const resultNum = pr_double_sub(lnum.numberValue,rnum.numberValue);
        const result = new JSNumber(resultNum);
        return new NormalCompletion(result);
    }

    public static fromGeneric(node: ASTNode | null): SubtractNode {
        node = check.node(node,"Subtract",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new SubtractNode(node.range,left,right);
    }
}

// ES6 Section 12.8: Bitwise Shift Operators

export class LeftShiftNode extends BinaryNode {
    public _type_LeftShiftNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LeftShift",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("LeftShiftNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): LeftShiftNode {
        node = check.node(node,"LeftShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LeftShiftNode(node.range,left,right);
    }
}

export class SignedRightShiftNode extends BinaryNode {
    public _type_SignedRightShiftNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"SignedRightShift",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("SignedRightShiftNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): SignedRightShiftNode {
        node = check.node(node,"SignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new SignedRightShiftNode(node.range,left,right);
    }
}

export class UnsignedRightShiftNode extends BinaryNode {
    public _type_UnsignedRightShiftNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"UnsignedRightShift",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("UnsignedRightShiftNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): UnsignedRightShiftNode {
        node = check.node(node,"UnsignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new UnsignedRightShiftNode(node.range,left,right);
    }
}

// ES6 Section 12.9: Relational Operators

export class LessThanNode extends BinaryNode {
    public _type_LessThanNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LessThan",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("LessThanNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): LessThanNode {
        node = check.node(node,"LessThan",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LessThanNode(node.range,left,right);
    }
}

export class GreaterThanNode extends BinaryNode {
    public _type_GreaterThanNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"GreaterThan",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("GreaterThanNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GreaterThanNode {
        node = check.node(node,"GreaterThan",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new GreaterThanNode(node.range,left,right);
    }
}

export class LessEqualNode extends BinaryNode {
    public _type_LessEqualNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LessEqual",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("LessEqualNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): LessEqualNode {
        node = check.node(node,"LessEqual",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LessEqualNode(node.range,left,right);
    }
}

export class GreaterEqualNode extends BinaryNode {
    public _type_GreaterEqualNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"GreaterEqual",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("GreaterEqualNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): GreaterEqualNode {
        node = check.node(node,"GreaterEqual",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new GreaterEqualNode(node.range,left,right);
    }
}

export class InstanceOfNode extends BinaryNode {
    public _type_InstanceOfNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"InstanceOf",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("InstanceOfNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): InstanceOfNode {
        node = check.node(node,"InstanceOf",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new InstanceOfNode(node.range,left,right);
    }
}

export class InNode extends BinaryNode {
    public _type_InNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"In",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("InNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): InNode {
        node = check.node(node,"In",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new InNode(node.range,left,right);
    }
}

// ES6 Section 12.10: Equality Operators

export class AbstractEqualsNode extends BinaryNode {
    public _type_AbstractEqualsNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AbstractEquals",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AbstractEqualsNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AbstractEqualsNode {
        node = check.node(node,"AbstractEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AbstractEqualsNode(node.range,left,right);
    }
}

export class AbstractNotEqualsNode extends BinaryNode {
    public _type_AbstractNotEqualsNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AbstractNotEquals",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AbstractNotEqualsNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AbstractNotEqualsNode {
        node = check.node(node,"AbstractNotEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AbstractNotEqualsNode(node.range,left,right);
    }
}

export class StrictEqualsNode extends BinaryNode {
    public _type_StrictEqualsNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"StrictEquals",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("StrictEqualsNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): StrictEqualsNode {
        node = check.node(node,"StrictEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new StrictEqualsNode(node.range,left,right);
    }
}

export class StrictNotEqualsNode extends BinaryNode {
    public _type_StrictNotEqualsNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"StrictNotEquals",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("StrictNotEqualsNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): StrictNotEqualsNode {
        node = check.node(node,"StrictNotEquals",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new StrictNotEqualsNode(node.range,left,right);
    }
}

// ES6 Section 12.11: Binary Bitwise Operators

export class BitwiseANDNode extends BinaryNode {
    public _type_BitwiseANDNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseAND",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("BitwiseANDNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): BitwiseANDNode {
        node = check.node(node,"BitwiseAND",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new BitwiseANDNode(node.range,left,right);
    }
}

export class BitwiseXORNode extends BinaryNode {
    public _type_BitwiseXORNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseXOR",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("BitwiseXORNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): BitwiseXORNode {
        node = check.node(node,"BitwiseXOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new BitwiseXORNode(node.range,left,right);
    }
}

export class BitwiseORNode extends BinaryNode {
    public _type_BitwiseORNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"BitwiseOR",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("BitwiseORNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): BitwiseORNode {
        node = check.node(node,"BitwiseOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new BitwiseORNode(node.range,left,right);
    }
}

// ES6 Section 12.12: Binary Logical Operators

export class LogicalANDNode extends BinaryNode {
    public _type_LogicalANDNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LogicalAND",left,right);
    }

    // ES6 Section 12.12.3: Binary Logical Operators: Runtime Semantics: Evaluation

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        const leftNode = this.left;
        const rightNode = this.right;

        // 1. Let lref be the result of evaluating LogicalANDExpression.
        const lrefComp = leftNode.evaluate(ctx);
        if (!(lrefComp instanceof NormalCompletion))
            return lrefComp;
        const lref = lrefComp.value;

        // 2. Let lval be GetValue(lref).
        const lvalComp = GetValue(ctx.realm,lrefComp);
        if (!(lvalComp instanceof NormalCompletion))
            return lvalComp;
        const lval = lvalComp.value;

        // 3. Let lbool be ToBoolean(lval).
        // 4. ReturnIfAbrupt(lbool).
        const lboolComp = ToBoolean(ctx.realm,lvalComp);
        if (!(lboolComp instanceof NormalCompletion))
            return lboolComp;
        const lbool = lboolComp.value;

        // 5. If lbool is false, return lval.
        if (lbool.booleanValue === false)
            return new NormalCompletion(lval);

        // 6. Let rref be the result of evaluating BitwiseORExpression.
        const rrefComp = rightNode.evaluate(ctx);

        // 7. Return GetValue(rref).
        return GetValue(ctx.realm,rrefComp);
    }

    public static fromGeneric(node: ASTNode | null): LogicalANDNode {
        node = check.node(node,"LogicalAND",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LogicalANDNode(node.range,left,right);
    }
}

export class LogicalORNode extends BinaryNode {
    public _type_LogicalORNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"LogicalOR",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        const leftNode = this.left;
        const rightNode = this.right;

        // 1. Let lref be the result of evaluating LogicalORExpression.
        const lrefComp = leftNode.evaluate(ctx);
        if (!(lrefComp instanceof NormalCompletion))
            return lrefComp;
        const lref = lrefComp.value;

        // 2. Let lval be GetValue(lref).
        const lvalComp = GetValue(ctx.realm,lref);
        if (!(lvalComp instanceof NormalCompletion))
            return lvalComp;
        const lval = lvalComp.value;

        // 3. Let lbool be ToBoolean(lval).
        // 4. ReturnIfAbrupt(lbool).
        const lboolComp = ToBoolean(ctx.realm,lval);
        if (!(lboolComp instanceof NormalCompletion))
            return lboolComp;
        const lbool = lboolComp.value;

        // 5. If lbool is true, return lval.
        if (lbool.booleanValue === true)
            return new NormalCompletion(lval);

        // 6. Let rref be the result of evaluating LogicalANDExpression.
        const rrefComp = rightNode.evaluate(ctx);

        // 7. Return GetValue(rref).
        return GetValue(ctx.realm,rrefComp);
    }

    public static fromGeneric(node: ASTNode | null): LogicalORNode {
        node = check.node(node,"LogicalOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new LogicalORNode(node.range,left,right);
    }
}

// ES6 Section 12.13: Conditional Operator ( ? : )

export class ConditionalNode extends ExpressionNode {
    public _type_ConditionalNode: any;
    public readonly condition: ExpressionNode;
    public readonly trueExpr: ExpressionNode;
    public readonly falseExpr: ExpressionNode;

    public constructor(
        range: Range,
        condition: ExpressionNode,
        trueExpr: ExpressionNode,
        falseExpr: ExpressionNode
    ) {
        super(range,"Conditional");
        this.condition = condition;
        this.trueExpr = trueExpr;
        this.falseExpr = falseExpr;
    }

    public get children(): (ASTNode | null)[] {
        return [this.condition,this.trueExpr,this.falseExpr];
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("ConditionalNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): ConditionalNode {
        node = check.node(node,"Conditional",3);
        const condition = ExpressionNode_fromGeneric(node.children[0]);
        const trueExpr = ExpressionNode_fromGeneric(node.children[1]);
        const falseExpr = ExpressionNode_fromGeneric(node.children[2]);
        return new ConditionalNode(node.range,condition,trueExpr,falseExpr);
    }
}

// ES6 Section 12.14: Assignment Operators

export class AssignNode extends BinaryNode {
    public _type_AssignNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Assign",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignNode {
        node = check.node(node,"Assign",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignNode(node.range,left,right);
    }
}

export class AssignMultiplyNode extends BinaryNode {
    public _type_AssignMultiplyNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignMultiply",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignMultiplyNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignMultiplyNode {
        node = check.node(node,"AssignMultiply",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignMultiplyNode(node.range,left,right);
    }
}

export class AssignDivideNode extends BinaryNode {
    public _type_AssignDivideNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignDivide",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignDivideNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignDivideNode {
        node = check.node(node,"AssignDivide",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignDivideNode(node.range,left,right);
    }
}

export class AssignModuloNode extends BinaryNode {
    public _type_AssignModuloNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignModulo",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignModuloNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignModuloNode {
        node = check.node(node,"AssignModulo",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignModuloNode(node.range,left,right);
    }
}

export class AssignAddNode extends BinaryNode {
    public _type_AssignAddNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignAdd",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignAddNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignAddNode {
        node = check.node(node,"AssignAdd",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignAddNode(node.range,left,right);
    }
}

export class AssignSubtractNode extends BinaryNode {
    public _type_AssignSubtractNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignSubtract",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignSubtractNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignSubtractNode {
        node = check.node(node,"AssignSubtract",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignSubtractNode(node.range,left,right);
    }
}

export class AssignLeftShiftNode extends BinaryNode {
    public _type_AssignLeftShiftNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignLeftShift",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignLeftShiftNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignLeftShiftNode {
        node = check.node(node,"AssignLeftShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignLeftShiftNode(node.range,left,right);
    }
}

export class AssignSignedRightShiftNode extends BinaryNode {
    public _type_AssignSignedRightShiftNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignSignedRightShift",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignSignedRightShiftNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignSignedRightShiftNode {
        node = check.node(node,"AssignSignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignSignedRightShiftNode(node.range,left,right);
    }
}

export class AssignUnsignedRightShiftNode extends BinaryNode {
    public _type_AssignUnsignedRightShiftNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignUnsignedRightShift",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignUnsignedRightShiftNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignUnsignedRightShiftNode {
        node = check.node(node,"AssignUnsignedRightShift",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignUnsignedRightShiftNode(node.range,left,right);
    }
}

export class AssignBitwiseANDNode extends BinaryNode {
    public _type_AssignBitwiseANDNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseAND",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignBitwiseANDNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignBitwiseANDNode {
        node = check.node(node,"AssignBitwiseAND",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignBitwiseANDNode(node.range,left,right);
    }
}

export class AssignBitwiseXORNode extends BinaryNode {
    public _type_AssignBitwiseXORNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseXOR",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignBitwiseXORNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignBitwiseXORNode {
        node = check.node(node,"AssignBitwiseXOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignBitwiseXORNode(node.range,left,right);
    }
}

export class AssignBitwiseORNode extends BinaryNode {
    public _type_AssignBitwiseORNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"AssignBitwiseOR",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("AssignBitwiseORNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): AssignBitwiseORNode {
        node = check.node(node,"AssignBitwiseOR",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new AssignBitwiseORNode(node.range,left,right);
    }
}

// ES6 Section 12.15: Comma Operator ( , )

export class CommaNode extends BinaryNode {
    public _type_CommaNode: any;

    public constructor(range: Range, left: ExpressionNode, right: ExpressionNode) {
        super(range,"Comma",left,right);
    }

    public evaluate(ctx: ExecutionContext): Completion<JSValue | Reference> {
        throw new Error("CommaNode.evaluate not implemented");
    }

    public static fromGeneric(node: ASTNode | null): CommaNode {
        node = check.node(node,"Comma",2);
        const left = ExpressionNode_fromGeneric(node.children[0]);
        const right = ExpressionNode_fromGeneric(node.children[1]);
        return new CommaNode(node.range,left,right);
    }
}