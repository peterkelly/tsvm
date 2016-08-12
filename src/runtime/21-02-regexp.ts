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

// ES6 Section 21.2: RegExp (Regular Expression) Objects

import {
    JSObject,
} from "./datatypes";

export class RegExpObject extends JSObject {
    _nominal_type_RegExpObject: any;
}

export class RegExpConstructor extends JSObject {
    _nominal_type_RegExpConstructor: any;
}