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
} from "./parser/grammar";
import { grm as sampleGrammar } from "./sample";

function padString(length: number): string {
    let s = "";
    while (s.length < length * 4)
        s += "    ";
    return s;
}

function expandFirstitem(g: Grammar): void {
    const visitor: grammar.Visitor = (action, visitChildren) => {
        action = visitChildren();

        if ((action instanceof SequenceAction) && (action.actions.length > 0)) {
            let first = action.actions[0];
            if (first instanceof RefAction) {
                first = g.lookup(first.name);
                if (first instanceof ProductionAction)
                    first = first.child;
                if (first instanceof SequenceAction)
                    return new SequenceAction(first.actions.concat(action.actions.slice(1)));
                else
                    return new SequenceAction([first].concat(action.actions.slice(1)));
            }
        }

        return action;
    };
    g.visit(visitor);
}

function liftPrefix(g: Grammar): void {
    const visitor: grammar.Visitor = (action, visitChildren) => {
        action = visitChildren();

        if (action instanceof ChoiceAction) {
            const prefixes = action.actions.map((choice): Action => {
                if ((choice instanceof SequenceAction) && (choice.actions.length > 0))
                    return choice.actions[0];
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
                    for (const choice of action.actions) {
                        if ((choice instanceof SequenceAction) && (choice.actions.length > 0)) {
                            newChoices.push(new SequenceAction(choice.actions.slice(1)));
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
    };
    g.visit(visitor);
}

function printGrammar(g: Grammar): void {
    let depth = 0;
    const visitor: grammar.Visitor = (action, visitChildren) => {
        if (action instanceof grammar.ProductionAction)
            console.log(padString(depth) + "Production " + action.name);
        else if (action instanceof KeywordAction)
            console.log(padString(depth) + JSON.stringify(action.str));
        else if (action instanceof RefAction)
            console.log(padString(depth) + "[" + action.name + "]");
        else if (action instanceof SpliceNodeAction)
            console.log(padString(depth) + "=> " + action.name + "(" + action.childIndices.join(",") + ")");
        else
            console.log(padString(depth) + (<any> action).constructor.name);

        depth++;
        action = visitChildren();
        depth--;
        return action;
    };
    g.visit(visitor);
}

function main(): void {
    liftPrefix(sampleGrammar);
    expandFirstitem(sampleGrammar);
    printGrammar(sampleGrammar);
}

main();
