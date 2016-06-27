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

export enum Opcode {
    NullLiteral,
    TrueLiteral,
    FalseLiteral,
    StringLiteral,
    MemberAccess,
    Call,
    Add,
    Subtract,
    Multiply,
    Divide,
}

export class MemLocation {
    name: string;
}

export class Immediate {
    value: number;
}

export class Instruction {
    public dest: MemLocation;
    public src1: MemLocation | Immediate;
    public src2: MemLocation | Immediate;
}

export class BasicBlock {
    public instructions: Instruction[];
    public next: BasicBlock;
}

export class Assembly {
    public strings: string[];
    public blocks: BasicBlock;
}
