var array = ["first", "second", "third"];
console.log("array.length = " + array.length);
console.log("array[0] = " + array[0]);
console.log("array[1] = " + array[1]);
console.log("array[2] = " + array[2]);
array.extraProperty = "hello";
console.log("array.extraProperty = " + array.extraProperty);
array.extraProperty = "goodbye";
console.log("array.extraProperty = " + array.extraProperty);

/*******************************************************************************
execute

array.length = 3
array[0] = first
array[1] = second
array[2] = third
array.extraProperty = hello
array.extraProperty = goodbye
*******************************************************************************/
