var value = true;
console.log("original value = " + typeof(value) + " " + value);
var result = --value;
console.log("operation result = " + typeof(result) + " " + result);
console.log("updated value = " + typeof(value) + " " + value);

/*******************************************************************************
execute

original value = boolean true
operation result = number 0
updated value = number 0
*******************************************************************************/
