var array = ["first", "second", "third"];
for (var i = 0; i < array.length; i++)
    console.log("array[" + i + "] = " + array[i]);
array[1] = "something else";
console.log("Modified array[1]");
for (var i = 0; i < array.length; i++)
    console.log("array[" + i + "] = " + array[i]);

/*******************************************************************************
execute

array[0] = first
array[1] = second
array[2] = third
Modified array[1]
array[0] = first
array[1] = something else
array[2] = third
*******************************************************************************/
