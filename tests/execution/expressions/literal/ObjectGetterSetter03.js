const obj = {
    value: 3,
    get timesTen() {
        return this.value * 10;
    },
    set timesTen(v) {
        this.value = v / 10;
    }
};

console.log("obj.value = " + obj.value);
console.log("obj.timesTen = " + obj.timesTen);
console.log("");

obj.timesTen = 40;
console.log("obj.value = " + obj.value);
console.log("obj.timesTen = " + obj.timesTen);
console.log("");

obj.value = 5;
console.log("obj.value = " + obj.value);
console.log("obj.timesTen = " + obj.timesTen);

/*******************************************************************************
execute

obj.value = 3
obj.timesTen = 30

obj.value = 4
obj.timesTen = 40

obj.value = 5
obj.timesTen = 50
*******************************************************************************/
