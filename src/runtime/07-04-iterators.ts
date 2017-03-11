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

// ES6 Section 7.4: Operations on Iterator Objects

import {
    JSValue,
    JSObject,
    Completion,
    Realm,
} from "./datatypes";

// ES6 Section 7.4.1: GetIterator (obj, method)

export function GetIterator(realm: Realm, obj: JSValue, method?: JSObject): Completion<JSObject> {
    throw new Error("GetIterator not implemented");
}

// ES6 Section 7.4.2: IteratorNext (iterator, value)

export function IteratorNext(realm: Realm, iterator: JSValue, value?: JSValue): Completion<JSObject> {
    throw new Error("IteratorNext not implemented");
}

// ES6 Section 7.4.3: IteratorComplete (iterResult)

export function IteratorComplete(realm: Realm, iterResult: JSObject): Completion<boolean> {
    throw new Error("IteratorComplete not implemented");
}

// ES6 Section 7.4.4: IteratorValue (iterResult)

export function IteratorValue(realm: Realm, iterResult: JSObject): Completion<JSValue> {
    throw new Error("IteratorValue not implemented");
}

// ES6 Section 7.4.5: IteratorStep (iterator)

export function IteratorStep(realm: Realm, iterator: JSValue): Completion<JSObject | null> {
    throw new Error("IteratorStep not implemented");
}

// ES6 Section 7.4.6: IteratorClose (iterator, completion)

export function IteratorClose(realm: Realm, iterator: JSObject, completion: Completion<JSValue>): Completion<JSValue> {
    throw new Error("IteratorClose not implemented");
}

// ES6 Section 7.4.7: CreateIterResultObject (value, done)

export function CreateIterResultObject(realm: Realm, value: JSValue, done: boolean): Completion<JSObject> {
    throw new Error("CreateIterResultObject not implemented");
}

// ES6 Section 7.4.8: CreateListIterator (list)

export function CreateListIterator(realm: Realm, list: JSValue[]): Completion<JSObject> {
    throw new Error("CreateListIterator not implemented");
}

// ES6 Section 7.4.8.1: ListIterator next()

export function ListIterator_next(realm: Realm, O: JSObject): Completion<JSObject> {
    throw new Error("ListIterator_next not implemented");
}
