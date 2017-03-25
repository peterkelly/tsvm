const obj = {
    value: 3,
    set timesTen(v) {
        console.log("Set timesTen: v = " + v);
        this.value = v / 10;
    }
};

console.log("obj.value = "+obj.value);
obj.timesTen = 40;
console.log("obj.value = "+obj.value);

/*******************************************************************************
execute

obj.value = 3
Set timesTen: v = 40
obj.value = 4
*******************************************************************************/
