function transform(x) {
    return x * 100;
}

function test(a,b,c,tr) {
    return a + b + tr(c);
}

var result = test(3,4,2,transform);
console.log("result = " + result);

/*******************************************************************************
execute

result = 207
*******************************************************************************/
