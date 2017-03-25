const obj = {
    realFoo: 3,
    get foo() {
        console.log("Get foo");
        return this.realFoo;
    },
    set foo(v) {
        console.log("Set foo: v = " + v);
        this.realFoo = v;
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
obj.foo = 4
*******************************************************************************/
