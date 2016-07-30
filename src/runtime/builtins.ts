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

import {
    UnknownType,
    Empty,
    JSValue,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
    JSPrimitiveValue,
    JSPropertyKey,
    JSInteger,
    JSInt32,
    JSUInt32,
    JSInt16,
    JSUInt16,
    JSInt8,
    JSUInt8,
    PropertyDescriptor,
    BaseDescriptor,
    DataDescriptor,
    newDataDescriptor,
    AccessorDescriptor,
    newAccessorDescriptor,
    Intrinsics,
    Completion,
    NormalCompletion,
    BreakCompletion,
    ContinueCompletion,
    ReturnCompletion,
    ThrowCompletion,
    Reference,
    SuperReference,
    DataBlock,
} from "./datatypes";
import {
    EnvironmentRecord,
} from "./context";
import {
    Realm,
} from "./context";

export abstract class BuiltinFunction extends JSObject {
    public realm: Realm;
    public constructor(realm: Realm) {
        super();
        this.realm = realm;
    }
    public abstract Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue>;
}

export abstract class BuiltinConstructor extends JSObject {
    public realm: Realm;
    public constructor(realm: Realm) {
        super();
        this.realm = realm;
    }
    public abstract Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue>;
}

export class ArgGetterFunction extends BuiltinFunction {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, name: string, env: EnvironmentRecord) {
        super(realm);
        this.name = name;
        this.env = env;
    }

    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return this.env.GetBindingValue(this.name,false);
    }
}

export class ArgSetterFunction extends BuiltinFunction {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, name: string, env: EnvironmentRecord) {
        super(realm);
        this.name = name;
        this.env = env;
    }

    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        const value = (args.length > 0) ? args[0] : new JSUndefined();
        this.env.SetMutableBinding(this.name,value,false);
        return new NormalCompletion(new JSUndefined());
    }
}

export class ThrowTypeErrorFunction extends BuiltinFunction {
    public constructor(realm: Realm) {
        super(realm);
        this.__extensible__ = false;
        this.properties["length"] = newDataDescriptor({
            enumerable: false,
            configurable: false,
            value: new JSNumber(1),
            writable: false
        });
    }

    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        const message = (args.length > 0) ? args[0] : new JSUndefined();
        if (message instanceof JSString)
            return new ThrowCompletion(new TypeErrorObject(message));
        else
            return new ThrowCompletion(new TypeErrorObject(new JSUndefined()));
    }
}

export class TypeErrorObject extends JSObject {
    public constructor(message: JSString | JSUndefined) {
        super();
        this.properties["message"] = newDataDescriptor({
            enumerable: true,
            configurable: false,
            value: message,
            writable: false,
        });
    }
}

export class FunctionPrototypeFunction extends BuiltinFunction {
    public constructor(realm: Realm) {
        super(realm);
    }
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSUndefined());
    }
}

export class ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class ArrayBufferConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class ArrayBufferPrototype_Intrinsic extends JSObject {
}

export class ArrayIteratorPrototype_Intrinsic extends JSObject {
}

export class ArrayPrototypePrototype_Intrinsic extends JSObject {
}

export class ArrayProto_values_Intrinsic extends JSObject {
}

export class BooleanConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BooleanPrototype_Intrinsic extends JSObject {
}

export class DataViewConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class DataViewPrototype_Intrinsic extends JSObject {
}

export class DateConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class DatePrototype_Intrinsic extends JSObject {
}

export class decodeURIFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURI not implemented");
    }
}

export class decodeURIComponentFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURIComponent not implemented");
    }
}

export class encodeURIFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURI not implemented");
    }
}

export class encodeURIComponentFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURIComponent not implemented");
    }
}

export class ErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class ErrorPrototype_Intrinsic extends JSObject {
}

export class evalFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("eval not implemented");
    }
}

export class EvalErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class EvalErrorPrototype_Intrinsic extends JSObject {
}

export class Float32ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Float32ArrayPrototype_Intrinsic extends JSObject {
}

export class Float64ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Float64ArrayPrototype_Intrinsic extends JSObject {
}

export class FunctionConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Generator_Intrinsic extends JSObject {
}

export class GeneratorFunctionConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class GeneratorPrototype_Intrinsic extends JSObject {
}

export class Int8ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Int8ArrayPrototype_Intrinsic extends JSObject {
}

export class Int16ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Int16ArrayPrototype_Intrinsic extends JSObject {
}

export class Int32ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Int32ArrayPrototype extends JSObject {
}

export class isFiniteFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isFinite not implemented");
    }
}

export class isNaNFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isNaN not implemented");
    }
}

export class IteratorPrototype_Intrinsic extends JSObject {
}

export class JSON_Intrinsic extends JSObject {
}

export class MapConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class MapIteratorPrototype_Intrinsic extends JSObject {
}

export class MapPrototype_Intrinsic extends JSObject {
}

export class Math_Intrinsic extends JSObject {
}

export class NumberConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class NumberPrototype_Intrinsic extends JSObject {
}

export class ObjectConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class ObjectPrototype_Intrinsic extends JSObject {
}

export class ObjProto_toStringFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Object.prototype.toString not implemented");
    }
}

export class parseFloatFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseFloat not implemented");
    }
}

export class parseIntFunction_Intrinsic extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseInt not implemented");
    }
}

export class PromiseConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class PromisePrototype_Intrinsic extends JSObject {
}

export class ProxyConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class RangeErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class RangeErrorPrototype_Intrinsic extends JSObject {
}

export class ReferenceErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class ReferenceErrorPrototype_Intrinsic extends JSObject {
}

export class Reflect_Intrinsic extends JSObject {
}

export class RegExpConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class RegExpPrototype_Intrinsic extends JSObject {
}

export class SetConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class SetIteratorPrototype_Intrinsic extends JSObject {
}

export class SetPrototype_Intrinsic extends JSObject {
}

export class StringConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class StringIteratorPrototype_Intrinsic extends JSObject {
}

export class StringPrototype_Intrinsic extends JSObject {
}

export class SymbolConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class SymbolPrototype_Intrinsic extends JSObject {
}

export class SyntaxErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class SyntaxErrorPrototype_Intrinsic extends JSObject {
}

export abstract class TypedArrayConstructor_Intrinsic extends BuiltinConstructor {
}

export class TypedArrayPrototype_Intrinsic extends JSObject {
}

export class TypeErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class TypeErrorPrototype_Intrinsic extends JSObject {
}

export class Uint8ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Uint8ArrayPrototype_Intrinsic extends JSObject {
}

export class Uint8ClampedArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Uint8ClampedArrayPrototype_Intrinsic extends JSObject {
}

export class Uint16ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Uint16ArrayPrototype_Intrinsic extends JSObject {
}

export class Uint32ArrayConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class Uint32ArrayPrototype_Intrinsic extends JSObject {
}

export class URIErrorConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class URIErrorPrototype_Intrinsic extends JSObject {
}

export class WeakMapConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class WeakMapPrototype_Intrinsic extends JSObject {
}

export class WeakSetConstructor_Intrinsic extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class WeakSetPrototype_Intrinsic extends JSObject {
}
