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
    TransformationContext,
    Grammar,
    Action,
    ProductionAction,
    RefAction,
    KeywordAction,
    ChoiceAction,
    SequenceAction,
    EmptyAction,
    OptAction,
    SpliceNodeAction,
    LabelAction,
    GotoAction,
} from "./parser/grammar";
import { grm as sampleGrammar } from "./sample";
import { leftpad, rightpad } from "./util";

function showTransform(name: string, before: Action, after: Action, ctx: TransformationContext): void {
    const beforeLines = actionTreeString(before, ctx.grammar).split("\n");
    const afterLines = actionTreeString(after, ctx.grammar).split("\n");
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
            before = rightpad(beforeLines[lineno], beforeWidth);
        else
            before = rightpad("", beforeWidth);
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
                    first = first.child;
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

// function appendGotoOnSuccess(action: Action, labelId: number): Action {
//     if (action instanceof ChoiceAction) { // Optimisation only
//         return grammar.choice(action.choices.map(choice => appendGotoOnSuccess(choice, labelId)));
//     }
//     else if (action instanceof SequenceAction) { // Optimisation only
//         return grammar.sequence(action.items.concat([grammar.goto(labelId)]));
//     }
//     else {
//         return grammar.sequence([
//             action,
//             grammar.goto(labelId),
//         ]);
//     }
// }
//
// function appendGotoOnFailure(action: Action, labelId: number): Action {
//     if (action instanceof ChoiceAction) { // Optimisation only
//         return grammar.choice(action.choices.concat([grammar.goto(labelId)]));
//     }
//     else {
//         return grammar.choice([
//             action,
//             grammar.goto(labelId),
//         ]);
//     }
// }

function flattenRepeat(action: Action, ctx: TransformationContext): Action {
    if (!(action instanceof grammar.RepeatAction))
        return action;
    const startLabel = grammar.label();
    const endLabel = grammar.label();
    return grammar.sequence([
        startLabel,
        grammar.choice([
            grammar.sequence([
                action.child,
                grammar.goto(startLabel.labelId),
            ]),
            grammar.goto(endLabel.labelId),
        ]),
        endLabel,
    ]);
}

function collapseIteration(gr: Grammar): Grammar {
    return gr.transform((action, ctx) => {
        action = action.transform(ctx);

        while (true) {
            const prevAction = action;
            if ((action = flattenRepeat(action, ctx)) !== prevAction)
                continue;
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

function simplifyNestedSequence(action: Action, ctx: TransformationContext): Action {
    if (!(action instanceof SequenceAction) || !sequenceContainsSequence(action))
        return action;
    const newItems: Action[] = [];
    for (const item of action.items) {
        if (item instanceof SequenceAction)
            newItems.push(...item.items);
        else
            newItems.push(item);
    }
    return grammar.sequence(newItems);
}

function simplifyNestedChoice(action: Action, ctx: TransformationContext): Action {
    if (!(action instanceof ChoiceAction) || !choiceContainsChoice(action))
        return action;
    const newChoices: Action[] = [];
    for (const choice of action.choices) {
        if (choice instanceof ChoiceAction)
            newChoices.push(...choice.choices);
        else
            newChoices.push(choice);
    }
    return grammar.choice(newChoices);
}

function simplifyUnarySequence(action: Action, ctx: TransformationContext): Action {
    if ((action instanceof SequenceAction) && (action.items.length === 1))
        return action.items[0];
    else
        return action;
}

function simplifyUnaryChoice(action: Action, ctx: TransformationContext): Action {
    if ((action instanceof ChoiceAction) && (action.choices.length === 1))
        return action.choices[0];
    else
        return action;
}

function tryTransform(t: Transformer, action: Action, ctx: TransformationContext): Action {
    let name = "(unknown)";
    try {
        if (typeof(t.name) === "string")
            name = t.name;
    }
    catch (e) {
    }
    const newAction = t(action, ctx);
    if (newAction !== action)
        showTransform(name, action, newAction, ctx);
    return action;
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

function actionTreeString(act: Action, gr: Grammar): string {
    const output: string[] = [];
    let depth = 0;
    const transform: Transformer = (action, ctx) => {
        if (action instanceof grammar.ProductionAction)
            output.push(padString(depth) + "Production " + action.name);
        else if (action instanceof KeywordAction)
            output.push(padString(depth) + JSON.stringify(action.str));
        else if (action instanceof RefAction)
            output.push(padString(depth) + "[" + action.name + "]");
        else if (action instanceof SpliceNodeAction)
            output.push(padString(depth) + "=> " + action.name + "(" + action.childIndices.join(",") + ")");
        else if (action instanceof LabelAction)
            output.push(padString(depth) + "label" + action.labelId + ":");
        else if (action instanceof GotoAction)
            output.push(padString(depth) + "goto label" + action.labelId + ";");
        else
            output.push(padString(depth) + (<any> action).constructor.name);

        depth++;
        action = action.transform(ctx);
        depth--;
        return action;
    };
    new TransformationContext(transform, gr).process(act);
    return output.join("\n");
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
    // gr = liftPrefix(gr);
    // gr = expandFirstitem(gr);
    // gr = collapseIteration(gr);
    gr = simplify(gr);
    console.log("");
    console.log("================================================================================");
    console.log("");
    printGrammar(gr);
}

main();
