var value = "2";
console.log("original value = " + typeof(value) + " " + value);
var result = value++;
console.log("operation result = " + typeof(result) + " " + result);
console.log("updated value = " + typeof(value) + " " + value);


/*******************************************************************************
execute

original value = string 2
operation result = number 2
updated value = number 3
*******************************************************************************/
