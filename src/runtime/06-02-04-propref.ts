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

// ES6 Section 6.2.4: The Property Descriptor Specification Type

import {
    UnknownType,
    Realm,
    JSUndefined,
    PropertyDescriptor,
    BaseDescriptor,
    DataDescriptor,
    AccessorDescriptor,
    Completion,
    NormalCompletion,
} from "./types";

// ES6 Section 6.2.4.1: IsAccessorDescriptor (Desc)

export function IsAccessorDescriptor(realm: Realm, Desc: PropertyDescriptor): Desc is AccessorDescriptor {
    return (Desc instanceof AccessorDescriptor);
}

// ES6 Section 6.2.4.2: IsDataDescriptor (Desc)

export function IsDataDescriptor(realm: Realm, Desc: PropertyDescriptor): Desc is DataDescriptor {
    return (Desc instanceof DataDescriptor);
}

// ES6 Section 6.2.4.3: IsGenericDescriptor (Desc)

export function IsGenericDescriptor(realm: Realm, Desc: BaseDescriptor | JSUndefined): boolean {
    if (Desc instanceof JSUndefined)
        return false;
    if (!(Desc instanceof AccessorDescriptor) && !(Desc instanceof DataDescriptor))
        return true;
    return false;
}

// ES6 Section 6.2.4.4: FromPropertyDescriptor (Desc)

export function FromPropertyDescriptor(realm: Realm, Desc: PropertyDescriptor): Completion<UnknownType> {
    throw new Error("FromPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.5: ToPropertyDescriptor (Obj)

export function ToPropertyDescriptor(realm: Realm, Obj: any): Completion<UnknownType> {
    throw new Error("ToPropertyDescriptor not implemented");
}

// ES6 Section 6.2.4.6: CompletePropertyDescriptor (Desc)

export function CompletePropertyDescriptor(realm: Realm, Desc: any): Completion<UnknownType> {
    throw new Error("CompletePropertyDescriptor not implemented");
}
