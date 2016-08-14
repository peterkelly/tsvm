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

// This file contains functions which will ultimately need to be implemented as native methods
// (ideally with the possibility to inline them during code generation).

export function pr_double_isNaN(value: number): boolean {
    return isNaN(value);
}

export function pr_double_isPositiveZero(value: number): boolean {
    return pr_double_isPositiveInfinity(1/value);
}

export function pr_double_isNegativeZero(value: number): boolean {
    return pr_double_isNegativeInfinity(1/value);
}

export function pr_double_isPositiveInfinity(value: number): boolean {
    return (value === Number.POSITIVE_INFINITY);
}

export function pr_double_isNegativeInfinity(value: number): boolean {
    return (value === Number.NEGATIVE_INFINITY);
}

export function pr_double_to_string(value: number): string {
    return ""+value;
}

export function pr_string_to_double(value: string): number {
    return new Number(value).valueOf();
}
