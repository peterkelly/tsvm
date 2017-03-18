var value = false;
console.log("original value = " + typeof(value) + " " + value);
var result = value--;
console.log("operation result = " + typeof(result) + " " + result);
console.log("updated value = " + typeof(value) + " " + value);


/*******************************************************************************
execute

original value = boolean false
operation result = number 0
updated value = number -1
*******************************************************************************/
