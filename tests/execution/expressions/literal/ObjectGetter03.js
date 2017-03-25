const obj = {
    get timesTen() {
        console.log("Get timesTen");
        return this.value * 10;
    }
};

for (let i = 1; i <= 5; i++) {
    obj.value = i;
    console.log(obj.timesTen);
}

/*******************************************************************************
execute

Get timesTen
10
Get timesTen
20
Get timesTen
30
Get timesTen
40
Get timesTen
50
*******************************************************************************/
