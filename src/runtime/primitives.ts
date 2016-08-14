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

export function pr_double_strictEqualityComparison(x: number, y: number): boolean {
    if (pr_double_isNaN(x))
        return false;
    if (pr_double_isNaN(y))
        return false;
    if (pr_double_equalsExact(x,y))
        return true;
    if (pr_double_isPositiveZero(x) && pr_double_isNegativeZero(y))
        return true;
    if (pr_double_isNegativeZero(x) && pr_double_isPositiveZero(y))
        return true;
    return false;
}

export function pr_double_abstractRelationalComparison(x: number, y: number): boolean | undefined {
    if (pr_double_isNaN(x))
        return undefined;
    if (pr_double_isNaN(y))
        return undefined;
    if (x === y)
        return false;
    if (pr_double_isPositiveZero(x) && pr_double_isNegativeZero(y))
        return false;
    if (pr_double_isNegativeZero(x) && pr_double_isPositiveZero(y))
        return false;
    if (pr_double_isPositiveInfinity(x))
        return false;
    if (pr_double_isPositiveInfinity(y))
        return true;
    if (pr_double_isNegativeInfinity(y))
        return false;
    if (pr_double_isNegativeInfinity(x))
        return true;
    const result = (x < y);
}

export function pr_double_equalsExact(x: number, y: number): boolean {
    if (pr_double_isNaN(x) || pr_double_isNaN(y))
        return true;
    else
        return (x === y);
}

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

export function pr_double_isInteger(value: number): boolean {
    if (pr_double_isNaN(value))
        return false;
    if (pr_double_isPositiveInfinity(value))
        return false;
    if (pr_double_isNegativeInfinity(value))
        return false;
    return (Math.floor(Math.abs(value)) === Math.abs(value));
}

export function pr_double_to_string(value: number): string {
    return ""+value;
}

export function pr_string_to_double(value: string): number {
    return new Number(value).valueOf();
}

export function pr_string_lessThan(x: string, y: string): boolean {
    return (x < y);
}

export function pr_Infinity(): number {
    return Infinity;
}

export function pr_NaN(): number {
    return NaN;
}

export function pr_double_add(a: number, b: number) {
    return a + b;
}

export function pr_double_sub(a: number, b: number) {
    return a - b;
}

export function pr_double_mul(a: number, b: number) {
    return a * b;
}

export function pr_double_div(a: number, b: number) {
    return a / b;
}

export function pr_double_mod(a: number, b: number) {
    return a % b;
}

export function pr_string_concat(s1: string, s2: string): string {
    return s1 + s2;
}
