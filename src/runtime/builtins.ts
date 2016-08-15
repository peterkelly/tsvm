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
    JSValue,
    JSUndefined,
    JSNull,
    JSString,
    JSNumber,
    JSObject,
    DataDescriptor,
    Completion,
    NormalCompletion,
    ThrowCompletion,
    Realm,
} from "./datatypes";
import {
    BooleanObject,
    BooleanConstructor,
} from "./19-03-boolean";
import {
    SymbolObject,
    SymbolConstructor,
} from "./19-04-symbol";
import {
    NumberObject,
    NumberConstructor,
} from "./20-01-number";
import {
    StringObject,
    StringConstructor,
} from "./21-01-string";

// Function

export abstract class BuiltinFunction extends JSObject {
    public constructor(proto: JSObject) {
        super();
    }
    public get implementsCall(): boolean {
        return true;
    }
    public abstract __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue>;
}

// Constructor

export abstract class BuiltinConstructor extends JSObject {
    public constructor(proto: JSObject) {
        super(proto);
    }
    public get implementsConstruct(): boolean {
        return true;
    }
    public abstract __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject>;
}

// ThrowTypeErrorFunction

class ThrowTypeErrorFunction extends BuiltinFunction {
    public constructor(proto: JSObject) {
        super(proto);
        this.__extensible__ = false;
        this.properties.put(new JSString("length"),new DataDescriptor({
            enumerable: false,
            configurable: false,
            value: new JSNumber(1),
            writable: false
        }));
    }

    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        const message = (args.length > 0) ? args[0] : new JSUndefined();
        const proto = realm.intrinsics.TypeErrorPrototype;
        if (message instanceof JSString)
            return new ThrowCompletion(new TypeErrorObject(proto,message));
        else
            return new ThrowCompletion(new TypeErrorObject(proto,new JSUndefined()));
    }
}

export function createThrowTypeErrorFunction(proto: JSObject): JSObject {
    return new ThrowTypeErrorFunction(proto);
}

// TypeErrorObject
// FIXME: This is not currently used

class TypeErrorObject extends JSObject {
    public constructor(prototype: JSObject | JSNull, message: JSString | JSUndefined) {
        super(prototype);
        this.properties.put(new JSString("message"),new DataDescriptor({
            enumerable: true,
            configurable: false,
            value: message,
            writable: false,
        }));
    }
}

export function createTypeErrorObject(proto: JSObject, message: JSString | JSUndefined): JSObject {
    return new TypeErrorObject(proto,message);
}

// FunctionPrototype

class BuiltinFunctionPrototype extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        return new NormalCompletion(new JSUndefined());
    }
}

export function createFunctionPrototype(proto: JSObject): JSObject {
    return new BuiltinFunctionPrototype(proto);
}

// ArrayConstructor
// ArrayPrototype

class BuiltinArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinArrayConstructor(proto);
}

export function createArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// ArrayBufferConstructor
// ArrayBufferPrototype

class BuiltinArrayBufferConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.ArrayBufferPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createArrayBufferConstructor(proto: JSObject): JSObject {
    return new BuiltinArrayBufferConstructor(proto);
}

export function createArrayBufferPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// ArrayIteratorPrototype

class BuiltinArrayIteratorPrototype extends JSObject {
}

export function createArrayIteratorPrototype(proto: JSObject): JSObject {
    return new BuiltinArrayIteratorPrototype(proto);
}

// ArrayProto_values

class BuiltinArrayProto_values extends JSObject {
}

export function createArrayProto_values(proto: JSObject): JSObject {
    return new BuiltinArrayProto_values(proto);
}

// BooleanConstructor
// BooleanPrototype

export function createBooleanConstructor(proto: JSObject): JSObject {
    return new BooleanConstructor(proto);
}

export function createBooleanPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// DataViewConstructor
// DataViewPrototype

class BuiltinDataViewConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.DataViewPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createDataViewConstructor(proto: JSObject): JSObject {
    return new BuiltinDataViewConstructor(proto);
}

export function createDataViewPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// DateConstructor
// DatePrototype

class BuiltinDateConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.DatePrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createDateConstructor(proto: JSObject): JSObject {
    return new BuiltinDateConstructor(proto);
}

export function createDatePrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// decodeURIFunction

class BuiltindecodeURIFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURI not implemented");
    }
}

export function createDecodeURIFunction(proto: JSObject): JSObject {
    return new BuiltindecodeURIFunction(proto);
}

// decodeURIComponentFunction

class BuiltindecodeURIComponentFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("decodeURIComponent not implemented");
    }
}

export function createDecodeURIComponentFunction(proto: JSObject): JSObject {
    return new BuiltindecodeURIComponentFunction(proto);
}

// encodeURIFunction

class BuiltinencodeURIFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURI not implemented");
    }
}

export function createEncodeURIFunction(proto: JSObject): JSObject {
    return new BuiltinencodeURIFunction(proto);
}

// encodeURIComponentFunction

class BuiltinencodeURIComponentFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("encodeURIComponent not implemented");
    }
}

export function createEncodeURIComponentFunction(proto: JSObject): JSObject {
    return new BuiltinencodeURIComponentFunction(proto);
}

// ErrorConstructor
// ErrorPrototype

class BuiltinErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.ErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinErrorConstructor(proto);
}

export function createErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// evalFunction

class BuiltinevalFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("eval not implemented");
    }
}

export function createEvalFunction(proto: JSObject): JSObject {
    return new BuiltinevalFunction(proto);
}

// EvalErrorConstructor
// EvalErrorPrototype

class BuiltinEvalErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.EvalErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createEvalErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinEvalErrorConstructor(proto);
}

export function createEvalErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Float32ArrayConstructor
// Float32ArrayPrototype

class BuiltinFloat32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Float32ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createFloat32ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinFloat32ArrayConstructor(proto);
}

export function createFloat32ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Float64ArrayConstructor
// Float64ArrayPrototype

class BuiltinFloat64ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Float64ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createFloat64ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinFloat64ArrayConstructor(proto);
}

export function createFloat64ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// FunctionConstructor

class BuiltinFunctionConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.FunctionPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createFunctionConstructor(proto: JSObject): JSObject {
    return new BuiltinFunctionConstructor(proto);
}

// Generator
// GeneratorFunctionConstructor
// GeneratorPrototype

export function createGenerator(proto: JSObject): JSObject {
    return new JSObject(proto);
}

class BuiltinGeneratorFunctionConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        throw new Error("BuiltinGeneratorFunctionConstructor: Not sure what prototype should be used");
    }
}

export function createGeneratorFunctionConstructor(proto: JSObject): JSObject {
    return new BuiltinGeneratorFunctionConstructor(proto);
}

export function createGeneratorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Int8ArrayConstructor
// Int8ArrayPrototype

class BuiltinInt8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Int8ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createInt8ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinInt8ArrayConstructor(proto);
}

export function createInt8ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Int16ArrayConstructor
// Int16ArrayPrototype

class BuiltinInt16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Int16ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createInt16ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinInt16ArrayConstructor(proto);
}

export function createInt16ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Int32ArrayConstructor
// Int32ArrayPrototype

class BuiltinInt32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Int32ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createInt32ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinInt32ArrayConstructor(proto);
}

export function createInt32ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// isFiniteFunction

class BuiltinisFiniteFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isFinite not implemented");
    }
}

export function createIsFiniteFunction(proto: JSObject): JSObject {
    return new BuiltinisFiniteFunction(proto);
}

// isNaNFunction

class BuiltinisNaNFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("isNaN not implemented");
    }
}

export function createIsNaNFunction(proto: JSObject): JSObject {
    return new BuiltinisNaNFunction(proto);
}

// IteratorPrototype

export function createIteratorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// JSONObject

class BuiltinJSONObject extends JSObject {
}

export function createJSONObject(proto: JSObject): JSObject {
    return new BuiltinJSONObject(proto);
}

// MapConstructor
// MapPrototype

class BuiltinMapConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.MapPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createMapConstructor(proto: JSObject): JSObject {
    return new BuiltinMapConstructor(proto);
}

export function createMapPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// MapIteratorPrototype

class BuiltinMapIteratorPrototype extends JSObject {
}

export function createMapIteratorPrototype(proto: JSObject): JSObject {
    return new BuiltinMapIteratorPrototype(proto);
}

// MathObject

class BuiltinMathObject extends JSObject {
}

export function createMathObject(proto: JSObject): JSObject {
    return new BuiltinMathObject(proto);
}

// NumberConstructor
// NumberPrototype

export function createNumberConstructor(proto: JSObject): JSObject {
    return new NumberConstructor(proto);
}

export function createNumberPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// ObjectConstructor

class BuiltinObjectConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.ObjectPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createObjectConstructor(proto: JSObject): JSObject {
    return new BuiltinObjectConstructor(proto);
}

// ObjProto_toStringFunction

class BuiltinObjProto_toStringFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("Object.prototype.toString not implemented");
    }
}

export function createObjProto_toStringFunction(proto: JSObject): JSObject {
    return new BuiltinObjProto_toStringFunction(proto);
}

// parseFloatFunction

class BuiltinparseFloatFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseFloat not implemented");
    }
}

export function createParseFloatFunction(proto: JSObject): JSObject {
    return new BuiltinparseFloatFunction(proto);
}

// parseIntFunction

class BuiltinparseIntFunction extends BuiltinFunction {
    public __Call__(realm: Realm, thisArg: JSValue, args: JSValue[]): Completion<JSValue> {
        throw new Error("parseInt not implemented");
    }
}

export function createParseIntFunction(proto: JSObject): JSObject {
    return new BuiltinparseIntFunction(proto);
}

// PromiseConstructor
// PromisePrototype

class BuiltinPromiseConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.PromisePrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createPromiseConstructor(proto: JSObject): JSObject {
    return new BuiltinPromiseConstructor(proto);
}

export function createPromisePrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// ProxyConstructor

class BuiltinProxyConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        throw new Error("BuiltinProxyConstructor: Not sure what prototype should be used");
    }
}

export function createProxyConstructor(proto: JSObject): JSObject {
    return new BuiltinProxyConstructor(proto);
}

// RangeErrorConstructor
// RangeErrorPrototype

class BuiltinRangeErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.RangeErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createRangeErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinRangeErrorConstructor(proto);
}

export function createRangeErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// ReferenceErrorConstructor
// ReferenceErrorPrototype

class BuiltinReferenceErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.ReferenceErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createReferenceErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinReferenceErrorConstructor(proto);
}

export function createReferenceErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// ReflectObject

export function createReflectObject(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// RegExpConstructor
// RegExpPrototype

class BuiltinRegExpConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.RegExpPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createRegExpConstructor(proto: JSObject): JSObject {
    return new BuiltinRegExpConstructor(proto);
}

export function createRegExpPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// SetConstructor
// SetPrototype

class BuiltinSetConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.SetPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createSetConstructor(proto: JSObject): JSObject {
    return new BuiltinSetConstructor(proto);
}

export function createSetPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// SetIteratorPrototype

export function createSetIteratorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// StringConstructor
// StringPrototype

export function createStringConstructor(proto: JSObject): JSObject {
    return new StringConstructor(proto);
}

export function createStringPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// StringIteratorPrototype

export function createStringIteratorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// SymbolConstructor
// SymbolPrototype

export function createSymbolConstructor(proto: JSObject): JSObject {
    return new SymbolConstructor(proto);
}

export function createSymbolPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// SyntaxErrorConstructor
// SyntaxErrorPrototype

class BuiltinSyntaxErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.SyntaxErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createSyntaxErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinSyntaxErrorConstructor(proto);
}

export function createSyntaxErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// TypedArrayConstructor (abstract)
// TypedArrayPrototype

export abstract class BuiltinTypedArrayConstructor extends BuiltinConstructor {
}

export function createTypedArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// TypeErrorConstructor
// TypeErrorPrototype

class BuiltinTypeErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.TypeErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createTypeErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinTypeErrorConstructor(proto);
}

export function createTypeErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Uint8ArrayConstructor
// Uint8ArrayPrototype

class BuiltinUint8ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Uint8ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createUint8ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinUint8ArrayConstructor(proto);
}

export function createUint8ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Uint8ClampedArrayConstructor
// Uint8ClampedArrayPrototype

class BuiltinUint8ClampedArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Uint8ClampedArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createUint8ClampedArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinUint8ClampedArrayConstructor(proto);
}

export function createUint8ClampedArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Uint16ArrayConstructor
// Uint16ArrayPrototype

class BuiltinUint16ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Uint16ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createUint16ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinUint16ArrayConstructor(proto);
}

export function createUint16ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// Uint32ArrayConstructor
// Uint32ArrayPrototype

class BuiltinUint32ArrayConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.Uint32ArrayPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createUint32ArrayConstructor(proto: JSObject): JSObject {
    return new BuiltinUint32ArrayConstructor(proto);
}

export function createUint32ArrayPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// URIErrorConstructor
// URIErrorPrototype

class BuiltinURIErrorConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.URIErrorPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createURIErrorConstructor(proto: JSObject): JSObject {
    return new BuiltinURIErrorConstructor(proto);
}

export function createURIErrorPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// WeakMapConstructor
// WeakMapPrototype

class BuiltinWeakMapConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.WeakMapPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createWeakMapConstructor(proto: JSObject): JSObject {
    return new BuiltinWeakMapConstructor(proto);
}

export function createWeakMapPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}

// WeakSetConstructor
// WeakSetPrototype

class BuiltinWeakSetConstructor extends BuiltinConstructor {
    public __Construct__(realm: Realm, args: JSValue[], obj: JSObject): Completion<JSObject> {
        const proto = realm.intrinsics.WeakSetPrototype;
        const result = new JSObject(proto);
        return new NormalCompletion(result);
    }
}

export function createWeakSetConstructor(proto: JSObject): JSObject {
    return new BuiltinWeakSetConstructor(proto);
}

export function createWeakSetPrototype(proto: JSObject): JSObject {
    return new JSObject(proto);
}
