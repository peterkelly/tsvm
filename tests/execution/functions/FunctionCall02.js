function test(a,b,c) {
    console.log("a = " + a);
    console.log("b = " + b);
    console.log("c = " + c);
}

console.log("Before call");
test(3,true,"hello");
console.log("After call");

/*******************************************************************************
execute

Before call
a = 3
b = true
c = hello
After call
*******************************************************************************/
