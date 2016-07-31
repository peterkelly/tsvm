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
    EnvironmentRecord,
    ValueType,
    JSValue,
    JSPrimitiveValue,
    JSPropertyKey,
    JSUndefined,
    JSNull,
    JSBoolean,
    JSString,
    JSSymbol,
    JSNumber,
    JSObject,
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
    AccessorDescriptor,
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
} from "./types";

import {
    JSOrdinaryObject,
} from "./datatypes";
import {
    Realm,
} from "./context";


export abstract class BuiltinFunction extends JSOrdinaryObject {
    public realm: Realm;
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
        this.realm = realm;
    }
    public get implementsCall(): boolean {
        return true;
    }
    public abstract __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue>;
}

export abstract class BuiltinConstructor extends JSOrdinaryObject {
    public realm: Realm;
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
        this.realm = realm;
        this.__prototype__ = proto;
    }
    public get implementsConstruct(): boolean {
        return true;
    }
    public abstract __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject>;
}

export class ArgGetterFunction extends BuiltinFunction {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, proto: JSObject | JSNull, name: string, env: EnvironmentRecord) {
        super(realm,proto);
        this.name = name;
        this.env = env;
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        return this.env.GetBindingValue(this.name,false);
    }
}

export class ArgSetterFunction extends BuiltinFunction {
    public name: string;
    public env: EnvironmentRecord;

    public constructor(realm: Realm, proto: JSObject | JSNull, name: string, env: EnvironmentRecord) {
        super(realm,proto);
        this.name = name;
        this.env = env;
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        const value = (args.length > 0) ? args[0] : new JSUndefined();
        this.env.SetMutableBinding(this.name,value,false);
        return new NormalCompletion(new JSUndefined());
    }
}

export class ThrowTypeErrorFunction extends BuiltinFunction {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm,proto);
        this.__extensible__ = false;
        this.properties["length"] = new DataDescriptor({
            enumerable: false,
            configurable: false,
            value: new JSNumber(1),
            writable: false
        });
    }

    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        const message = (args.length > 0) ? args[0] : new JSUndefined();
        if (message instanceof JSString)
            return new ThrowCompletion(new TypeErrorObject(message));
        else
            return new ThrowCompletion(new TypeErrorObject(new JSUndefined()));
    }
}

export class TypeErrorObject extends JSOrdinaryObject {
    public constructor(message: JSString | JSUndefined) {
        super();
        this.properties["message"] = new DataDescriptor({
            enumerable: true,
            configurable: false,
            value: message,
            writable: false,
        });
    }
}

export class BuiltinFunctionPrototype extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSUndefined());
    }
}

export class BuiltinArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinArrayBufferConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinArrayBufferPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinArrayIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinArrayProto_values extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinBooleanConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinBooleanPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinDataViewConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinDataViewPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinDateConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinDatePrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltindecodeURIFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURI not implemented");
    }
}

export class BuiltindecodeURIComponentFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURIComponent not implemented");
    }
}

export class BuiltinencodeURIFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURI not implemented");
    }
}

export class BuiltinencodeURIComponentFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURIComponent not implemented");
    }
}

export class BuiltinErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinevalFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("eval not implemented");
    }
}

export class BuiltinEvalErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinEvalErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinFloat32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinFloat32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinFloat64ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinFloat64ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinFunctionConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinGenerator extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinGeneratorFunctionConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinGeneratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinInt8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinInt8ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinInt16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinInt16ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinInt32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinInt32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinisFiniteFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isFinite not implemented");
    }
}

export class BuiltinisNaNFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isNaN not implemented");
    }
}

export class BuiltinIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinJSONObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinMapConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinMapIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinMapPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinMathObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinNumberConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinNumberPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinObjectConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

// FIXME: I don't think this is actually used
export class BuiltinObjectPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinObjProto_toStringFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Object.prototype.toString not implemented");
    }
}

export class BuiltinparseFloatFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseFloat not implemented");
    }
}

export class BuiltinparseIntFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseInt not implemented");
    }
}

export class BuiltinPromiseConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinPromisePrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinProxyConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinRangeErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinRangeErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinReferenceErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinReferenceErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinReflectObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinRegExpConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinRegExpPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinSetConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinSetIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinSetPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinStringConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinStringIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinStringPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinSymbolConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinSymbolPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinSyntaxErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinSyntaxErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export abstract class BuiltinTypedArrayConstructor extends BuiltinConstructor {
}

export class BuiltinTypedArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinTypeErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinTypeErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinUint8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinUint8ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinUint8ClampedArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinUint8ClampedArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinUint16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinUint16ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinUint32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinUint32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinURIErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinURIErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinWeakMapConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinWeakMapPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}

export class BuiltinWeakSetConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject());
    }
}

export class BuiltinWeakSetPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super();
    }
}
