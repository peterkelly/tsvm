var value = undefined;
console.log("original value = " + typeof(value) + " " + value);
var result = value++;
console.log("operation result = " + typeof(result) + " " + result);
console.log("updated value = " + typeof(value) + " " + value);


/*******************************************************************************
execute

original value = undefined undefined
operation result = number NaN
updated value = number NaN
*******************************************************************************/
