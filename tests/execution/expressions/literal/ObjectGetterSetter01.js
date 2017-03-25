const obj = {
    get foo() {
        console.log("Get foo");
        return 3;
    },
    set foo(v) {
        console.log("Set foo: v = " + v);
    }
};

console.log("obj.foo = " + obj.foo);
obj.foo = 4;
console.log("obj.foo = " + obj.foo);

/*******************************************************************************
execute

Get foo
obj.foo = 3
Set foo: v = 4
Get foo
obj.foo = 3
*******************************************************************************/
