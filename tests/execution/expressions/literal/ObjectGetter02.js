const obj = {
    value: 3,
    get timesTen() {
        console.log("Get timesTen");
        return this.value * 10;
    }
};

console.log(obj.timesTen);

/*******************************************************************************
execute

Get timesTen
30
*******************************************************************************/
