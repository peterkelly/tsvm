var array = ["first", "second", "third"];
for (var i = 0; i < array.length; i++)
    console.log("array[" + i + "] = " + array[i]);
array[3] = "new item";
console.log("Added item at index 3");
for (var i = 0; i < array.length; i++)
    console.log("array[" + i + "] = " + array[i]);

/*******************************************************************************
execute

array[0] = first
array[1] = second
array[2] = third
Added item at index 3
array[0] = first
array[1] = second
array[2] = third
array[3] = new item
*******************************************************************************/
