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
    Parser,
    ParseFailure,
    ParseError,
    ParseIgnore,
} from "./parser";
import {
    TokenKind,
} from "./lexer";
import {
    CastError,
    Range,
    ASTNode,
    ListNode,
    ErrorNode,
    GenericNode,
    GenericStringNode,
    GenericNumberNode,
} from "./ast";
import {
    Context,
    Grammar,
    Builder,
    Action,
    LeafAction,
    ProductionAction,
    EmptyAction,
    FailAction,
    NotAction,
    RefAction,
    ListAction,
    SequenceAction,
    SpliceNullAction,
    SpliceReplaceAction,
    SpliceNodeAction,
    SpliceStringNodeAction,
    SpliceNumberNodeAction,
    SpliceEmptyListNodeAction,
    PopAction,
    OptAction,
    ChoiceAction,
    RepeatAction,
    PosAction,
    ValueAction,
    TokenAction,
    KeywordAction,
    IdentifierAction,
    WhitespaceAction,
    WhitespaceNoNewlineAction,
    IdentifierTokenAction,
    NumericLiteralTokenAction,
    StringLiteralTokenAction,
    CaseAction,
    SwitchAction,
    LabelAction,
    GotoAction,
    ref,
} from "./grammar";

export function execute(action: Action, b: Builder): void {
    action.started++;
    executeImpl(action, b);
    action.finished++;
}

export function executeImpl(action: Action, b: Builder): void {
    // console.log("executeImpl " + (<any> action).constructor.name);
    if (action instanceof ProductionAction) {
        b.attempt((): void => {
            const oldLength = b.length;
            execute(action.body, b);
            b.assertLengthIs(oldLength + 1);
            b.getNode(0); // Check that the top of the stack is either a node null
        });
    }
    else if (action instanceof EmptyAction) {
        for (let i = 0; i < action.offset; i++)
            b.push(null);
    }
    else if (action instanceof FailAction) {
        for (let i = 0; i < action.offset; i++)
            b.push(null);
    }
    else if (action instanceof NotAction) {
        const start = b.parser.pos;
        const length = b.stack.length;

        let hadException = false;
        try {
            execute(action.child, b);
        }
        catch (e) {
            b.parser.pos = start;
            b.stack.length = length;
            if (!(e instanceof ParseFailure))
                throw e;
            hadException = true;
        }

        b.parser.pos = start;
        b.stack.length = length;

        if (!hadException)
            throw new ParseError(b.parser, b.parser.pos, "NOT predicate failed");
    }
    else if (action instanceof RefAction) {
        const production = b.grammar.lookup(action.name);
        if (production == null)
            throw new Error("Production " + action.name + " not defined");
        execute(production, b);
    }
    else if (action instanceof ListAction) {
        b.attempt(() => {
            const start = b.parser.pos;
            const elements: ASTNode[] = [];
            const initialLength = b.stack.length;

            execute(action.first, b);
            b.assertLengthIs(initialLength + 1);
            const firstNode = b.getNode(0);
            if (firstNode != null)
                elements.push(firstNode);
            b.stack.pop();

            b.assertLengthIs(initialLength);
            b.repeat(() => {
                execute(action.rest, b);
                b.assertLengthIs(initialLength + 1);
                const node = b.get(0);
                if (node != null)
                    elements.push(node);
                b.stack.pop();
                b.assertLengthIs(initialLength);
            });
            b.assertLengthIs(initialLength);
            const end = (elements.length > 0) ? elements[elements.length - 1].range.end : start;
            b.push(new ListNode(new Range(start, end), elements));
        });
    }
    else if (action instanceof SequenceAction) {
        for (const act of action.items)
            execute(act, b);
    }
    else if (action instanceof SpliceNullAction) {
        b.splice(action.index, null);
    }
    else if (action instanceof SpliceReplaceAction) {
        b.splice(action.index, b.get(action.srcIndex));
    }
    else if (action instanceof SpliceNodeAction) {
        const start = b.getNumber(action.startIndex);
        const end = b.getNumber(action.endIndex);
        const children: (ASTNode | null)[] = [];
        for (const childIndex of action.childIndices) {
            children.push(b.getNode(childIndex));
        }
        b.splice(action.index, new GenericNode(new Range(start, end), action.name, children));
    }
    else if (action instanceof SpliceStringNodeAction) {
        const start = b.getNumber(action.startIndex);
        const end = b.getNumber(action.endIndex);
        const range = new Range(start, end);
        const valueNode = b.getStringNode(action.valueIndex);
        if (valueNode == null)
            b.splice(action.index, null);
        else
            b.splice(action.index, new GenericStringNode(range, action.nodeName, valueNode.value));
    }
    else if (action instanceof SpliceNumberNodeAction) {
        const start = b.getNumber(action.startIndex);
        const end = b.getNumber(action.endIndex);
        const range = new Range(start, end);
        const valueNode = b.getNumberNode(action.valueIndex);
        if (valueNode == null)
            b.splice(action.index, null);
        else
            b.splice(action.index, new GenericNumberNode(range, action.nodeName, valueNode.value));
    }
    else if (action instanceof SpliceEmptyListNodeAction) {
        const start = b.getNumber(action.startIndex);
        const end = b.getNumber(action.endIndex);
        b.splice(action.index, new ListNode(new Range(start, end), []));
    }
    else if (action instanceof PopAction) {
        if (b.stack.length === 0)
            throw new Error("Attempt to pop past end of stack");
        b.stack.length--;
    }
    else if (action instanceof OptAction) {
        // child must either throw an exception or result in exactly one extra item on the stack
        try {
            b.attempt(() => {
                const oldLength = b.stack.length;
                execute(action.child, b);
                b.assertLengthIs(oldLength + 1);
            });
        }
        catch (e) {
            if (!(e instanceof ParseFailure))
                throw e;
            b.push(null);
        }
    }
    else if (action instanceof ChoiceAction) {
        const start = b.parser.pos;
        const length = b.stack.length;
        for (const act of action.choices) {
            try {
                execute(act, b);
                return;
            }
            catch (e) {
                if (!(e instanceof ParseFailure))
                    throw e;
                b.parser.pos = start;
                b.stack.length = length;
            }
        }
        throw new ParseError(b.parser, b.parser.pos, "No valid alternative found");
    }
    else if (action instanceof RepeatAction) {
        b.repeat((b: Builder) => {
            execute(action.child, b);
        });
    }
    else if (action instanceof PosAction) {
        b.push(b.parser.pos);
    }
    else if (action instanceof ValueAction) {
        b.push(action.value);
    }
    else if (action instanceof KeywordAction) {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token === null) || (token.value !== action.str))
                throw new ParseError(b.parser, b.parser.pos, "Expected " + action.str);
            b.push(null);
        });
    }
    else if (action instanceof IdentifierAction) {
        b.attempt((): void => {
            const oldLength = b.stack.length;
            const start = b.parser.pos;
            execute(ref("Identifier"), b);
            b.assertLengthIs(oldLength + 1);
            const ident = b.getNode(0);
            if (!(ident instanceof GenericStringNode) || (ident.value !== action.str))
                throw new ParseError(b.parser, start, "Expected " + action.str);
            // Identifier_b will already have pushed onto the stack
        });
    }
    else if (action instanceof WhitespaceAction) {
        b.parser.skipWhitespace();
        b.push(null);
    }
    else if (action instanceof WhitespaceNoNewlineAction) {
        b.parser.skipWhitespaceNoNewline();
        b.push(null);
    }
    else if (action instanceof IdentifierTokenAction) {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind !== TokenKind.IDENT))
                throw new ParseError(b.parser, b.parser.pos, "Expected identifier");
            b.push(new GenericStringNode(token.range, "Identifier", token.value));
        });
    }
    else if (action instanceof NumericLiteralTokenAction) {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind !== TokenKind.NUMBER))
                throw new ParseError(b.parser, b.parser.pos, "Expected number");
            const numericValue = parseFloat(token.value);
            b.push(new GenericNumberNode(token.range, "NumericLiteral", numericValue));
        });
    }
    else if (action instanceof StringLiteralTokenAction) {
        const p = b.parser;
        p.attempt((start) => {
            const token = p.nextToken();
            if ((token == null) || (token.kind !== TokenKind.STRING))
                throw new ParseError(b.parser, b.parser.pos, "Expected string");
            b.push(new GenericStringNode(token.range, "StringLiteral", token.value, true));
        });
    }
    else if (action instanceof CaseAction) {
        throw new Error("CaseAction not implemented");
    }
    else if (action instanceof SwitchAction) {
        throw new Error("SwitchAction not implemented");
    }
    else if (action instanceof LabelAction) {
        throw new Error("LabelAction not implemented");
    }
    else if (action instanceof GotoAction) {
        throw new Error("GotoAction not implemented");
    }
    else {
        throw new Error("Unknown action type: " + (<any> action).constructor.name);
    }
}
