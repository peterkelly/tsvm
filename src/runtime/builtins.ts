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

export class BuiltinArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinArrayBufferConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinArrayBufferPrototype extends JSObject {
}

export class BuiltinArrayIteratorPrototype extends JSObject {
}

export class BuiltinArrayPrototype extends JSObject {
}

export class BuiltinArrayProto_values extends JSObject {
}

export class BuiltinBooleanConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinBooleanPrototype extends JSObject {
}

export class BuiltinDataViewConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinDataViewPrototype extends JSObject {
}

export class BuiltinDateConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinDatePrototype extends JSObject {
}

export class BuiltindecodeURIFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURI not implemented");
    }
}

export class BuiltindecodeURIComponentFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURIComponent not implemented");
    }
}

export class BuiltinencodeURIFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURI not implemented");
    }
}

export class BuiltinencodeURIComponentFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURIComponent not implemented");
    }
}

export class BuiltinErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinErrorPrototype extends JSObject {
}

export class BuiltinevalFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("eval not implemented");
    }
}

export class BuiltinEvalErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinEvalErrorPrototype extends JSObject {
}

export class BuiltinFloat32ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinFloat32ArrayPrototype extends JSObject {
}

export class BuiltinFloat64ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinFloat64ArrayPrototype extends JSObject {
}

export class BuiltinFunctionConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinGenerator extends JSObject {
}

export class BuiltinGeneratorFunctionConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinGeneratorPrototype extends JSObject {
}

export class BuiltinInt8ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinInt8ArrayPrototype extends JSObject {
}

export class BuiltinInt16ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinInt16ArrayPrototype extends JSObject {
}

export class BuiltinInt32ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinInt32ArrayPrototype extends JSObject {
}

export class BuiltinisFiniteFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isFinite not implemented");
    }
}

export class BuiltinisNaNFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isNaN not implemented");
    }
}

export class BuiltinIteratorPrototype extends JSObject {
}

export class BuiltinJSONObject extends JSObject {
}

export class BuiltinMapConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinMapIteratorPrototype extends JSObject {
}

export class BuiltinMapPrototype extends JSObject {
}

export class BuiltinMathObject extends JSObject {
}

export class BuiltinNumberConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinNumberPrototype extends JSObject {
}

export class BuiltinObjectConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

// FIXME: I don't think this is actually used
export class BuiltinObjectPrototype extends JSObject {
}

export class BuiltinObjProto_toStringFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Object.prototype.toString not implemented");
    }
}

export class BuiltinparseFloatFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseFloat not implemented");
    }
}

export class BuiltinparseIntFunction extends BuiltinFunction {
    public Call(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseInt not implemented");
    }
}

export class BuiltinPromiseConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinPromisePrototype extends JSObject {
}

export class BuiltinProxyConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinRangeErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinRangeErrorPrototype extends JSObject {
}

export class BuiltinReferenceErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinReferenceErrorPrototype extends JSObject {
}

export class BuiltinReflectObject extends JSObject {
}

export class BuiltinRegExpConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinRegExpPrototype extends JSObject {
}

export class BuiltinSetConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinSetIteratorPrototype extends JSObject {
}

export class BuiltinSetPrototype extends JSObject {
}

export class BuiltinStringConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinStringIteratorPrototype extends JSObject {
}

export class BuiltinStringPrototype extends JSObject {
}

export class BuiltinSymbolConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinSymbolPrototype extends JSObject {
}

export class BuiltinSyntaxErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinSyntaxErrorPrototype extends JSObject {
}

export abstract class BuiltinTypedArrayConstructor extends BuiltinConstructor {
}

export class BuiltinTypedArrayPrototype extends JSObject {
}

export class BuiltinTypeErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinTypeErrorPrototype extends JSObject {
}

export class BuiltinUint8ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinUint8ArrayPrototype extends JSObject {
}

export class BuiltinUint8ClampedArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinUint8ClampedArrayPrototype extends JSObject {
}

export class BuiltinUint16ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinUint16ArrayPrototype extends JSObject {
}

export class BuiltinUint32ArrayConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinUint32ArrayPrototype extends JSObject {
}

export class BuiltinURIErrorConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinURIErrorPrototype extends JSObject {
}

export class BuiltinWeakMapConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinWeakMapPrototype extends JSObject {
}

export class BuiltinWeakSetConstructor extends BuiltinConstructor {
    public Construct(thisValue: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSObject());
    }
}

export class BuiltinWeakSetPrototype extends JSObject {
}
