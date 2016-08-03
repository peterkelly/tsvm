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
} from "./datatypes";

import {
    JSOrdinaryObject,
} from "./09-01-ordinary";


export abstract class BuiltinFunction extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
    public get implementsCall(): boolean {
        return true;
    }
    public abstract __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue>;
}

export abstract class BuiltinConstructor extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm,proto);
    }
    public get implementsConstruct(): boolean {
        return true;
    }
    public abstract __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject>;
}

class ThrowTypeErrorFunction extends BuiltinFunction {
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

export function createThrowTypeErrorFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new ThrowTypeErrorFunction(realm,proto);
}

// FIXME: This is not currently used
class TypeErrorObject extends JSOrdinaryObject {
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

// FIXME: This is not currently used
export function createTypeErrorObject(realm: Realm, proto: JSObject | JSNull, message: JSString | JSUndefined): JSObject {
    return new TypeErrorObject(realm,proto,message);
}

class BuiltinFunctionPrototype extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSUndefined());
    }
}

export function createFunctionPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinFunctionPrototype(realm,proto);
}

class BuiltinArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinArrayConstructor(realm,proto);
}

class BuiltinArrayBufferConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createArrayBufferConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinArrayBufferConstructor(realm,proto);
}

class BuiltinArrayBufferPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createArrayBufferPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinArrayBufferPrototype(realm,proto);
}

class BuiltinArrayIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createArrayIteratorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinArrayIteratorPrototype(realm,proto);
}

class BuiltinArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinArrayPrototype(realm,proto);
}

class BuiltinArrayProto_values extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createArrayProto_values(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinArrayProto_values(realm,proto);
}

class BuiltinBooleanConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createBooleanConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinBooleanConstructor(realm,proto);
}

class BuiltinBooleanPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createBooleanPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinBooleanPrototype(realm,proto);
}

class BuiltinDataViewConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createDataViewConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinDataViewConstructor(realm,proto);
}

class BuiltinDataViewPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createDataViewPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinDataViewPrototype(realm,proto);
}

class BuiltinDateConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createDateConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinDateConstructor(realm,proto);
}

class BuiltinDatePrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createDatePrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinDatePrototype(realm,proto);
}

class BuiltindecodeURIFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURI not implemented");
    }
}

export function createDecodeURIFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltindecodeURIFunction(realm,proto);
}

class BuiltindecodeURIComponentFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURIComponent not implemented");
    }
}

export function createDecodeURIComponentFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltindecodeURIComponentFunction(realm,proto);
}

class BuiltinencodeURIFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURI not implemented");
    }
}

export function createEncodeURIFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinencodeURIFunction(realm,proto);
}

class BuiltinencodeURIComponentFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURIComponent not implemented");
    }
}

export function createEncodeURIComponentFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinencodeURIComponentFunction(realm,proto);
}

class BuiltinErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinErrorConstructor(realm,proto);
}

class BuiltinErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinErrorPrototype(realm,proto);
}

class BuiltinevalFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("eval not implemented");
    }
}

export function createEvalFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinevalFunction(realm,proto);
}

class BuiltinEvalErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createEvalErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinEvalErrorConstructor(realm,proto);
}

class BuiltinEvalErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createEvalErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinEvalErrorPrototype(realm,proto);
}

class BuiltinFloat32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createFloat32ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinFloat32ArrayConstructor(realm,proto);
}

class BuiltinFloat32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createFloat32ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinFloat32ArrayPrototype(realm,proto);
}

class BuiltinFloat64ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createFloat64ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinFloat64ArrayConstructor(realm,proto);
}

class BuiltinFloat64ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createFloat64ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinFloat64ArrayPrototype(realm,proto);
}

class BuiltinFunctionConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createFunctionConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinFunctionConstructor(realm,proto);
}

class BuiltinGenerator extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createGenerator(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinGenerator(realm,proto);
}

class BuiltinGeneratorFunctionConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createGeneratorFunctionConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinGeneratorFunctionConstructor(realm,proto);
}

class BuiltinGeneratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createGeneratorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinGeneratorPrototype(realm,proto);
}

class BuiltinInt8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createInt8ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinInt8ArrayConstructor(realm,proto);
}

class BuiltinInt8ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createInt8ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinInt8ArrayPrototype(realm,proto);
}

class BuiltinInt16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createInt16ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinInt16ArrayConstructor(realm,proto);
}

class BuiltinInt16ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createInt16ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinInt16ArrayPrototype(realm,proto);
}

class BuiltinInt32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createInt32ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinInt32ArrayConstructor(realm,proto);
}

class BuiltinInt32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createInt32ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinInt32ArrayPrototype(realm,proto);
}

class BuiltinisFiniteFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isFinite not implemented");
    }
}

export function createIsFiniteFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinisFiniteFunction(realm,proto);
}

class BuiltinisNaNFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isNaN not implemented");
    }
}

export function createIsNaNFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinisNaNFunction(realm,proto);
}

class BuiltinIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createIteratorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinIteratorPrototype(realm,proto);
}

class BuiltinJSONObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createJSONObject(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinJSONObject(realm,proto);
}

class BuiltinMapConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createMapConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinMapConstructor(realm,proto);
}

class BuiltinMapIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createMapIteratorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinMapIteratorPrototype(realm,proto);
}

class BuiltinMapPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createMapPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinMapPrototype(realm,proto);
}

class BuiltinMathObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createMathObject(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinMathObject(realm,proto);
}

class BuiltinNumberConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createNumberConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinNumberConstructor(realm,proto);
}

class BuiltinNumberPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createNumberPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinNumberPrototype(realm,proto);
}

class BuiltinObjectConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createObjectConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinObjectConstructor(realm,proto);
}

class BuiltinObjProto_toStringFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Object.prototype.toString not implemented");
    }
}

export function createObjProto_toStringFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinObjProto_toStringFunction(realm,proto);
}

class BuiltinparseFloatFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseFloat not implemented");
    }
}

export function createParseFloatFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinparseFloatFunction(realm,proto);
}

class BuiltinparseIntFunction extends BuiltinFunction {
    public __Call__(thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseInt not implemented");
    }
}

export function createParseIntFunction(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinparseIntFunction(realm,proto);
}

class BuiltinPromiseConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createPromiseConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinPromiseConstructor(realm,proto);
}

class BuiltinPromisePrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createPromisePrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinPromisePrototype(realm,proto);
}

class BuiltinProxyConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createProxyConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinProxyConstructor(realm,proto);
}

class BuiltinRangeErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createRangeErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinRangeErrorConstructor(realm,proto);
}

class BuiltinRangeErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createRangeErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinRangeErrorPrototype(realm,proto);
}

class BuiltinReferenceErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createReferenceErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinReferenceErrorConstructor(realm,proto);
}

class BuiltinReferenceErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createReferenceErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinReferenceErrorPrototype(realm,proto);
}

class BuiltinReflectObject extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createReflectObject(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinReflectObject(realm,proto);
}

class BuiltinRegExpConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createRegExpConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinRegExpConstructor(realm,proto);
}

class BuiltinRegExpPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createRegExpPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinRegExpPrototype(realm,proto);
}

class BuiltinSetConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createSetConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSetConstructor(realm,proto);
}

class BuiltinSetIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createSetIteratorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSetIteratorPrototype(realm,proto);
}

class BuiltinSetPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createSetPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSetPrototype(realm,proto);
}

class BuiltinStringConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createStringConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinStringConstructor(realm,proto);
}

class BuiltinStringIteratorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createStringIteratorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinStringIteratorPrototype(realm,proto);
}

class BuiltinStringPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createStringPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinStringPrototype(realm,proto);
}

class BuiltinSymbolConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createSymbolConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSymbolConstructor(realm,proto);
}

class BuiltinSymbolPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createSymbolPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSymbolPrototype(realm,proto);
}

class BuiltinSyntaxErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createSyntaxErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSyntaxErrorConstructor(realm,proto);
}

class BuiltinSyntaxErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createSyntaxErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinSyntaxErrorPrototype(realm,proto);
}

export abstract class BuiltinTypedArrayConstructor extends BuiltinConstructor {
}

class BuiltinTypedArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createTypedArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinTypedArrayPrototype(realm,proto);
}

class BuiltinTypeErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createTypeErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinTypeErrorConstructor(realm,proto);
}

class BuiltinTypeErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createTypeErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinTypeErrorPrototype(realm,proto);
}

class BuiltinUint8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createUint8ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint8ArrayConstructor(realm,proto);
}

class BuiltinUint8ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createUint8ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint8ArrayPrototype(realm,proto);
}

class BuiltinUint8ClampedArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createUint8ClampedArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint8ClampedArrayConstructor(realm,proto);
}

class BuiltinUint8ClampedArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createUint8ClampedArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint8ClampedArrayPrototype(realm,proto);
}

class BuiltinUint16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createUint16ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint16ArrayConstructor(realm,proto);
}

class BuiltinUint16ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createUint16ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint16ArrayPrototype(realm,proto);
}

class BuiltinUint32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createUint32ArrayConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint32ArrayConstructor(realm,proto);
}

class BuiltinUint32ArrayPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createUint32ArrayPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinUint32ArrayPrototype(realm,proto);
}

class BuiltinURIErrorConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createURIErrorConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinURIErrorConstructor(realm,proto);
}

class BuiltinURIErrorPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createURIErrorPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinURIErrorPrototype(realm,proto);
}

class BuiltinWeakMapConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createWeakMapConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinWeakMapConstructor(realm,proto);
}

class BuiltinWeakMapPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createWeakMapPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinWeakMapPrototype(realm,proto);
}

class BuiltinWeakSetConstructor extends BuiltinConstructor {
    public __Construct__(args: JSValue[], obj: JSObject): Completion<JSObject> {
        return new NormalCompletion(new JSOrdinaryObject(this.realm));
    }
}

export function createWeakSetConstructor(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinWeakSetConstructor(realm,proto);
}

class BuiltinWeakSetPrototype extends JSOrdinaryObject {
    public constructor(realm: Realm, proto: JSObject | JSNull) {
        super(realm);
    }
}

export function createWeakSetPrototype(realm: Realm, proto: JSObject | JSNull): JSObject {
    return new BuiltinWeakSetPrototype(realm,proto);
}
