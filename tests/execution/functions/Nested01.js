function counter() {
    function inner() {
        value++;
        return value;
    }

    var value = 0;
    return inner;
}

var fun = counter();
console.log(fun());
console.log(fun());
console.log(fun());

/*******************************************************************************
execute

1
2
3
*******************************************************************************/
