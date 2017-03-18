var a = 1;
const b = 2;
let c = 3;

console.log("outer 1: a = " + a);
console.log("outer 1: b = " + b);
console.log("outer 1: c = " + c);

{
    var a = 11;
    const b = 22;
    let c = 33;

    console.log("inner: a = " + a);
    console.log("inner: b = " + b);
    console.log("inner: c = " + c);
}

console.log("outer 2: a = " + a);
console.log("outer 2: b = " + b);
console.log("outer 2: c = " + c);

/*******************************************************************************
execute

outer 1: a = 1
outer 1: b = 2
outer 1: c = 3
inner: a = 11
inner: b = 22
inner: c = 33
outer 2: a = 11
outer 2: b = 2
outer 2: c = 3
*******************************************************************************/
