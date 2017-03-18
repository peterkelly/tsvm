function counter(incr) {
    function inner() {
        value = value + incr;
        return value;
    }

    var value = 0;
    return inner;
}

var fun = counter(2);
console.log(fun());
console.log(fun());
console.log(fun());

/*******************************************************************************
execute

2
4
6
*******************************************************************************/
