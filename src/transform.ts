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

import * as grammar from "./parser/grammar";
import {
    Transformer,
    Context,
    Grammar,
    Action,
    ProductionAction,
    RefAction,
    TokenAction,
    KeywordAction,
    ChoiceAction,
    SequenceAction,
    EmptyAction,
    OptAction,
    SpliceNodeAction,
    LabelAction,
    GotoAction,
    CaseAction,
    SwitchAction,
} from "./parser/grammar";
import { grm as sampleGrammar } from "./sample";
import { leftpad, rightpad } from "./util";
import * as ansi from "./ansi";

function setOfActions(root: Action, gr: Grammar): Set<Action> {
    const result = new Set<Action>();
    const transform: Transformer = (action, ctx) => {
        result.add(action);
        return action.transform(ctx);
    };
    new Context(transform, gr).process(root);
    return result;
}

function showTransform(name: string, before: Action, after: Action, ctx: Context): void {
    const beforeActionSet = setOfActions(before, ctx.grammar);
    const afterActionSet = setOfActions(after, ctx.grammar);

    const beforeRemoved = new Set<Action>();
    for (const action of Array.from(beforeActionSet)) {
        if (!afterActionSet.has(action))
            beforeRemoved.add(action);
    }

    const afterAdded = new Set<Action>();
    for (const action of Array.from(afterActionSet)) {
        if (!beforeActionSet.has(action))
            afterAdded.add(action);
    }

    const derived = new Set<Action>();
    for (const action of Array.from(afterActionSet)) {
        for (let d: Action | null = action; d !== null; d = d.derivedFrom) {
            if (beforeRemoved.has(d)) {
                beforeRemoved.delete(d);
                afterAdded.delete(d);
                derived.add(d);

                beforeRemoved.delete(action);
                afterAdded.delete(action);
                derived.add(action);
            }
        }
    }

    const beforeLines = actionTreeString(before, ctx.grammar, { removed: beforeRemoved, derived: derived }).split("\n");
    const afterLines = actionTreeString(after, ctx.grammar, { added: afterAdded, derived: derived }).split("\n");
    console.log("================================================================================");
    // console.log(actionTreeString(before, gr));
    // console.log(actionTreeString(after, gr));
    console.log(name);
    console.log("================================================================================");
    console.log("");
    const beforeWidth = Math.max(...beforeLines.map(s => s.length)) + 8;
    for (let lineno = 0; (lineno < beforeLines.length) || (lineno < afterLines.length); lineno++) {
        let before: string;
        let after: string;
        if (lineno < beforeLines.length)
            before = ansi.padRight(beforeLines[lineno], beforeWidth);
        else
            before = ansi.padRight("", beforeWidth);
        if (lineno < afterLines.length)
            after = afterLines[lineno];
        else
            after = "";
        console.log(before + after);
    }
    console.log("");
}

function padString(length: number): string {
    let s = "";
    while (s.length < length * 4)
        s += "    ";
    return s;
}

function expandFirstitem(gr: Grammar): Grammar {
    return gr.transform((action, ctx) => {
        action = action.transform(ctx);

        if ((action instanceof SequenceAction) && (action.items.length > 0)) {
            let first = action.items[0];
            if (first instanceof RefAction) {
                first = ctx.grammar.lookup(first.name);
                if (first instanceof ProductionAction)
                    first = first.body;
                if (first instanceof SequenceAction)
                    return new SequenceAction(first.items.concat(action.items.slice(1)));
                else
                    return new SequenceAction([first].concat(action.items.slice(1)));
            }
        }

        return action;
    });
}

function liftPrefix(gr: Grammar): Grammar {
    return gr.transform((action, ctx) => {
        action = action.transform(ctx);

        if (action instanceof ChoiceAction) {
            const prefixes = action.choices.map((choice): Action => {
                if ((choice instanceof SequenceAction) && (choice.items.length > 0))
                    return choice.items[0];
                else
                    return choice;
            });
            if (prefixes.length >= 2) {
                let same = true;
                for (let i = 1; i < prefixes.length; i++) {
                    if (!prefixes[i].equals(prefixes[0])) {
                        same = false;
                        break;
                    }
                }
                if (same) {
                    const newChoices: Action[] = [];
                    let haveEmpty = false;
                    for (const choice of action.choices) {
                        if ((choice instanceof SequenceAction) && (choice.items.length > 0)) {
                            newChoices.push(new SequenceAction(choice.items.slice(1)));
                        }
                        else {
                            haveEmpty = true;
                        }
                    }

                    let remainder: Action = new ChoiceAction(newChoices);
                    if (haveEmpty)
                        remainder = new OptAction(remainder);

                    return new SequenceAction([prefixes[0], remainder]);
                }
            }
        }
        return action;
    });
}

function appendGotoOnSuccess(action: Action, labelId: number): Action {
    if (action instanceof ChoiceAction) { // Optimisation only
        return grammar.choice(action.choices.map(choice => appendGotoOnSuccess(choice, labelId)))
            .recordDerivation(action);
    }
    else if (action instanceof SequenceAction) { // Optimisation only
        return grammar.sequence(action.items.concat([grammar.goto(labelId)]))
            .recordDerivation(action);
    }
    else {
        return grammar.sequence([
            action,
            grammar.goto(labelId),
        ]);
    }
}

function appendGotoOnFailure(action: Action, labelId: number): Action {
    if (action instanceof ChoiceAction) { // Optimisation only
        return grammar.choice(action.choices.concat([grammar.goto(labelId)]))
            .recordDerivation(action);
    }
    else {
        return grammar.choice([
            action,
            grammar.goto(labelId),
        ]);
    }
}

function getFirstToken(action: Action): TokenAction | null {
    if (action instanceof TokenAction) {
        return action;
    }
    else if ((action instanceof SequenceAction) && (action.items.length > 0)) {
        return getFirstToken(action.items[0]);
    }
    else if ((action instanceof ChoiceAction) && (action.choices.length > 0)) {
        const token = getFirstToken(action.choices[0]);
        if (token !== null) {
            for (let i = 1; i < action.choices.length; i++) {
                const other = getFirstToken(action.choices[i]);
                if ((other === null) || !other.equals(token))
                    return null;
            }
            return token;
        }
    }
    return null;
}

function removeFirstToken(tok: TokenAction, action: Action): Action {
    if (action instanceof TokenAction) {
        if (!action.equals(tok))
            throw new Error("Token mismatch: expected " + tok + ", got " + action);
        return grammar.empty();
    }
    else if ((action instanceof SequenceAction) && (action.items.length > 0)) {
        const first = removeFirstToken(tok, action.items[0]);
        const rest = action.items.slice(1);

        return grammar.sequence([first].concat(rest))
            .recordDerivation(action);
    }
    else if ((action instanceof ChoiceAction) && (action.choices.length > 0)) {
        return grammar.choice(action.choices.map(choice => removeFirstToken(tok, choice)))
            .recordDerivation(action);
    }
    else {
        return action;
    }
}

function choiceToSwitch(action: Action, ctx: Context): Action {
    if (!(action instanceof ChoiceAction))
        return action;
    const cases: CaseAction[] = [];
    for (const choice of action.choices) {
        const token = getFirstToken(choice);
        if (token === null)
            return action;
        cases.push(new CaseAction(token, removeFirstToken(token, choice)));
    }
    return new SwitchAction(cases, grammar.fail());
}

function flattenRepeat(action: Action, ctx: Context): Action {
    if (!(action instanceof grammar.RepeatAction))
        return action;
    const startLabel = grammar.label();
    const endLabel = grammar.label();
    return grammar.sequence([
        startLabel,
        appendGotoOnFailure(
            appendGotoOnSuccess(
                action.child,
                startLabel.labelId
            ),
            endLabel.labelId
        ),
        endLabel,
    ]);
}

function flattenOpt(action: Action, ctx: Context): Action {
    if (!(action instanceof OptAction))
        return action;
    const skipLabel = grammar.label();
    return grammar.sequence([
        appendGotoOnFailure(
            action.child,
            skipLabel.labelId
        ),
        skipLabel,
    ]);
}

function collapseIteration(gr: Grammar): Grammar {
    return gr.transform((action1, ctx) => {
        let action = action1;

        action = action.transform(ctx);

        while (true) {
            const prevAction = action;

            if ((action = tryTransform(choiceToSwitch, action, ctx)) !== prevAction) continue;
            if ((action = tryTransform(flattenRepeat, action, ctx)) !== prevAction) continue;
            if ((action = tryTransform(flattenOpt, action, ctx)) !== prevAction) continue;

            return action;
        }
    });
}

function sequenceContainsSequence(action: SequenceAction): boolean {
    for (const item of action.items) {
        if (item instanceof SequenceAction)
            return true;
    }
    return false;
}

function choiceContainsChoice(action: ChoiceAction): boolean {
    for (const choice of action.choices) {
        if (choice instanceof ChoiceAction)
            return true;
    }
    return false;
}

function simplifyNestedSequence(action: Action, ctx: Context): Action {
    if (!(action instanceof SequenceAction) || !sequenceContainsSequence(action))
        return action;
    const newItems: Action[] = [];
    for (const item of action.items) {
        if (item instanceof SequenceAction)
            newItems.push(...item.items);
        else
            newItems.push(item);
    }
    return grammar.sequence(newItems).recordDerivation(action);
}

function simplifyNestedChoice(action: Action, ctx: Context): Action {
    if (!(action instanceof ChoiceAction) || !choiceContainsChoice(action))
        return action;
    const newChoices: Action[] = [];
    for (const choice of action.choices) {
        if (choice instanceof ChoiceAction)
            newChoices.push(...choice.choices);
        else
            newChoices.push(choice);
    }
    return grammar.choice(newChoices).recordDerivation(action);
}

function simplifyUnarySequence(action: Action, ctx: Context): Action {
    if ((action instanceof SequenceAction) && (action.items.length === 1))
        return action.items[0];
    else
        return action;
}

function simplifyUnaryChoice(action: Action, ctx: Context): Action {
    if ((action instanceof ChoiceAction) && (action.choices.length === 1))
        return action.choices[0];
    else
        return action;
}

function tryTransform(t: Transformer, action: Action, ctx: Context): Action {
    let name = "(unknown)";
    try {
        if (typeof(t.name) === "string")
            name = t.name;
    }
    catch (e) {
    }
    const heading = name + " " + action.id + " " + (<any> action).constructor.name;
    const newAction = t(action, ctx);
    if (newAction !== action)
        showTransform(heading, action, newAction, ctx);
    return newAction;
}

function simplify(gr: Grammar): Grammar {
    return gr.transform((action, ctx) => {
        action = action.transform(ctx);

        while (true) {
            const prevAction = action;

            if ((action = tryTransform(simplifyNestedSequence, action, ctx)) !== prevAction) continue;
            if ((action = tryTransform(simplifyNestedChoice, action, ctx)) !== prevAction) continue;
            if ((action = tryTransform(simplifyUnarySequence, action, ctx)) !== prevAction) continue;
            if ((action = tryTransform(simplifyUnaryChoice, action, ctx)) !== prevAction) continue;

            return action;
        }
    });
}

function actionTreeString(act: Action, gr: Grammar, options?: {
        added?: Set<Action>, removed?: Set<Action>, derived?: Set<Action>,
    }): string {
    const added = (options && options.added) ? options.added : new Set<Action>();
    const removed = (options && options.removed) ? options.removed : new Set<Action>();
    const derived = (options && options.derived) ? options.derived : new Set<Action>();
    const output: string[] = [];
    let depth = 0;
    const transform: Transformer = (action, ctx) => {
        let line = linePrefix(depth, action);

        if (action instanceof CaseAction) {
            line += "case " + action.token;
            output.push(colorLine(line, action));
            depth++;
            ctx.process(action.body);
            depth--;
            return action;
        }

        if (action instanceof SwitchAction) {
            line += "switch";
            output.push(colorLine(line, action));
            depth++;
            for (const cas of action.cases) {
                ctx.process(cas);
            }
            output.push(colorLine(linePrefix(depth - 1, action) + "otherwise", action));
            ctx.process(action.otherwise);
            depth--;
            return action;
        }

        if (action instanceof grammar.ProductionAction)
            line += "Production " + action.name;
        else if (action instanceof KeywordAction)
            line += JSON.stringify(action.str);
        else if (action instanceof RefAction)
            line += "[" + action.name + "]";
        else if (action instanceof SpliceNodeAction)
            line += "=> " + action.name + "(" + action.childIndices.join(",") + ")";
        else if (action instanceof LabelAction)
            line += "label" + action.labelId + ":";
        else if (action instanceof GotoAction)
            line += "goto label" + action.labelId + ";";
        else
            line += (<any> action).constructor.name;

        output.push(colorLine(line, action));

        depth++;
        action = action.transform(ctx);
        depth--;
        return action;
    };
    new Context(transform, gr).process(act);
    return output.join("\n");

    function linePrefix(depth: number, action: Action): string {
        if (depth > 0)
            return padString(depth) + " " + action.id + " ";
        else
            return action.id + " ";
    }

    function colorLine(line: string, action: Action): string {
        const inSets: string[] = [];
        let result: string;
        if (added.has(action)) {
            result = ansi.green(line);
            inSets.push("added");
        }
        else if (removed.has(action)) {
            result = ansi.red(line);
            inSets.push("removed");
        }
        else if (derived.has(action)) {
            result = ansi.yellow(line);
            inSets.push("derived");
        }
        else {
            result = line;
        }
        if (inSets.length > 1) {
            throw new Error("Action is in multiple sets: " + action.id + " " +
                (<any> action).constructor.name + " (" + inSets.join(", ") + ")");
        }
        return result;
    }
}

function printGrammar(gr: Grammar): void {
    gr.transform((action, ctx) => {
        if (action instanceof grammar.ProductionAction) {
            console.log("Production " + action.name);
            const raw = actionTreeString(action, gr);
            for (const line of raw.split("\n")) {
                console.log("    " + line);
            }
        }
        else {
        }
        return action;
    });
}

function main(): void {
    let gr = sampleGrammar;
    gr = liftPrefix(gr);
    gr = expandFirstitem(gr);
    gr = collapseIteration(gr);
    gr = simplify(gr);
    // console.log("");
    console.log("================================================================================");
    console.log("");
    printGrammar(gr);
}

main();
