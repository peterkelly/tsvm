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
    LexicalEnvironment,
    Realm,
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


export abstract class BuiltinFunction extends JSOrdinaryObject {
    public realm: Realm;
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
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
        super(realm);
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
        const proto = this.realm.intrinsics.TypeErrorPrototype;
        if (message instanceof JSString)
            return new ThrowCompletion(new TypeErrorObject(this.realm,proto,message));
        else
            return new ThrowCompletion(new TypeErrorObject(this.realm,proto,new JSUndefined()));
    }
}

export class TypeErrorObject extends JSOrdinaryObject {
    public constructor(realm: Realm, prototype: JSObject | JSNull, message: JSString | JSUndefined) {
        super(realm,prototype);
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
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinArrayBufferConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinArrayBufferPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinArrayIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinArrayProto_values extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinBooleanConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinBooleanPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinDataViewConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinDataViewPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinDateConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinDatePrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
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
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinevalFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("eval not implemented");
    }
}

export class BuiltinEvalErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinEvalErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinFloat32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinFloat32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinFloat64ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinFloat64ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinFunctionConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinGenerator extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinGeneratorFunctionConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinGeneratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinInt8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinInt8ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinInt16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinInt16ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinInt32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinInt32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
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
        super(realm);
    }
}

export class BuiltinJSONObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinMapConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinMapIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinMapPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinMathObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinNumberConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinNumberPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinObjectConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

// FIXME: I don't think this is actually used
export class BuiltinObjectPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
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
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinPromisePrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinProxyConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinRangeErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinRangeErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinReferenceErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinReferenceErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinReflectObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinRegExpConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinRegExpPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinSetConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinSetIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinSetPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinStringConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinStringIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinStringPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinSymbolConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinSymbolPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinSyntaxErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinSyntaxErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export abstract class BuiltinTypedArrayConstructor extends BuiltinConstructor {
}

export class BuiltinTypedArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinTypeErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinTypeErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinUint8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinUint8ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinUint8ClampedArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinUint8ClampedArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinUint16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinUint16ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinUint32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinUint32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinURIErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinURIErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinWeakMapConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinWeakMapPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export class BuiltinWeakSetConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export class BuiltinWeakSetPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}
