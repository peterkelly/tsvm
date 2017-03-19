var obj = {
    a: 1,
    b: 2,
    c: 3,
};

console.log("obj.a = " + obj.a);
console.log("obj.b = " + obj.b);
console.log("obj.c = " + obj.c);
obj.b = 99;
console.log("Modified object.b");
console.log("obj.a = " + obj.a);
console.log("obj.b = " + obj.b);
console.log("obj.c = " + obj.c);

/*******************************************************************************
execute

obj.a = 1
obj.b = 2
obj.c = 3
Modified object.b
obj.a = 1
obj.b = 99
obj.c = 3
*******************************************************************************/
