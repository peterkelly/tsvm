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

// ES6 Section 6.2.6.1: CreateByteDataBlock (size)

import {
    UnknownType,
    Realm,
    Completion,
    DataBlock,
} from "./types";

export function CreateByteDataBlock(realm: Realm, size: number): DataBlock {
    throw new Error("CreateByteDataBlock not implemented");
}

// ES6 Section 6.2.6.2: CopyDataBlockBytes (toBlock, toIndex, fromBlock, fromIndex, count)

export function CopyDataBlockBytes(realm: Realm, toBlock: DataBlock, toIndex: number,
                                   fromBlock: DataBlock, fromIndex: number,
                                   count: number): Completion<UnknownType> {
    throw new Error("CopyDataBlockBytes not implemented");
}
