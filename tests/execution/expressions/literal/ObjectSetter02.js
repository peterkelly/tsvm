const obj = {
    set foo(v) {
        console.log("Set foo: v = " + v);
    }
};

console.log("Before set");
obj.foo = "hello";
console.log("After set");
console.log("obj.foo = "+obj.foo);

/*******************************************************************************
execute

Before set
Set foo: v = hello
After set
obj.foo = undefined
*******************************************************************************/
