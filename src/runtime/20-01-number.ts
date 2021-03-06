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

// ES6 Section 20.1: Number Objects

import {
    JSNull,
    JSNumber,
    JSObject,
} from "./datatypes";

export class NumberObject extends JSObject {
    public _type_NumberObject: any;
    public numberData: JSNumber;
    public constructor(prototype: JSObject | JSNull, numberData: JSNumber) {
        super(prototype);
        this.numberData = numberData;
    }
}

export class NumberConstructor extends JSObject {
    public _type_NumberConstructor: any;
}
