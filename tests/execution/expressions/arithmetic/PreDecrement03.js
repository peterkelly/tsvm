var value = null;
console.log("original value = " + typeof(value) + " " + value);
var result = --value;
console.log("operation result = " + typeof(result) + " " + result);
console.log("updated value = " + typeof(value) + " " + value);

/*******************************************************************************
execute

original value = object null
operation result = number -1
updated value = number -1
*******************************************************************************/
