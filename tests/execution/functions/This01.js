function foo(a, b) {
    return this.base + a * b;
}

const obj = {
    base: 3,
    foo: foo,
};

console.log(obj.foo(4, 5));

/*******************************************************************************
execute

23
*******************************************************************************/