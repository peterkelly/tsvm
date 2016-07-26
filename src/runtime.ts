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

export class JSValue {
    _nominal_type_JSValue: any;
}

export class JSUndefined extends JSValue {
    _nominal_type_JSUndefined: any;
}

export class JSNull extends JSValue {
    _nominal_type_JSNull: any;
}

export class JSBoolean extends JSValue {
    _nominal_type_JSBoolean: any;
}

export class JSString extends JSValue {
    _nominal_type_JSString: any;
}

export class JSSymbol extends JSValue {
    _nominal_type_JSSymbol: any;
}

export class JSNumber extends JSValue {
    _nominal_type_JSNumber: any;
}

export class JSObject extends JSValue {
    _nominal_type_JSObject: any;
}

export class Reference {
    _nominal_type_Reference: any;
}

export class PropertyDesc {
    _nominal_type_PropertyDesc: any;
}

export class LexicalEnvironment {
    _nominal_type_LexicalEnvironment: any;
}

export class EnvironmentRecord {
    _nominal_type_EnvironmentRecord: any;
}

export class DataBlock {
    _nominal_type_DataBlock: any;
}

export class Empty {
    _nominal_type_EmptyType: any;
}

// 6.2.2 The Completion Record Specification Type

export enum CompletionType {
    Normal,
    Break,
    Continue,
    Return,
    Throw,
}

export class Completion {
    _nominal_type_Completion: any;
    public type: CompletionType;
    public value: JSValue | Empty;
    public target: JSString | Empty;

    public constructor(type: CompletionType, value: JSValue | Empty, target: JSString | Empty) {
        this.type = type;
        this.value = value;
        this.target = target;
    }
}

export function NormalCompletion(value: JSValue | Empty): Completion {
    return new Completion(CompletionType.Normal,value,new Empty());
}

export function UpdateEmpty(completionRecord: Completion, value: JSValue | Empty): Completion {
    if ((completionRecord.type == CompletionType.Throw) &&
        (completionRecord.value instanceof Empty))
        throw new Error("Assertion error: Completion record has type throw, but empty value");
    if (completionRecord.type == CompletionType.Throw)
        return completionRecord;
    if (!(completionRecord.value instanceof Empty))
        return completionRecord;
    return new Completion(completionRecord.type,value,completionRecord.target);
}
