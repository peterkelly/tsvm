var value = 1;
console.log("original value = " + typeof(value) + " " + value);
var result = ++value;
console.log("operation result = " + typeof(result) + " " + result);
console.log("updated value = " + typeof(value) + " " + value);

/*******************************************************************************
execute

original value = number 1
operation result = number 2
updated value = number 2
*******************************************************************************/
