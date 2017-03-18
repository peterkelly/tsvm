// Note: In non-strict mode, the last line should be d = 44.
// See ES6 Section B.3.3 for details.
"use strict";

function test() {
    var a = 1;
    const b = 2;
    let c = 3;
    function d() { return 4; }

    console.log("outer 1: a = " + a);
    console.log("outer 1: b = " + b);
    console.log("outer 1: c = " + c);
    console.log("outer 1: d = " + d());

    {
        var a = 11;
        const b = 22;
        let c = 33;
        function d() { return 44; }

        console.log("inner: a = " + a);
        console.log("inner: b = " + b);
        console.log("inner: c = " + c);
        console.log("inner: d = " + d());
    }

    console.log("outer 2: a = " + a);
    console.log("outer 2: b = " + b);
    console.log("outer 2: c = " + c);
    console.log("outer 2: d = " + d());
}

test();

/*******************************************************************************
execute

outer 1: a = 1
outer 1: b = 2
outer 1: c = 3
outer 1: d = 4
inner: a = 11
inner: b = 22
inner: c = 33
inner: d = 44
outer 2: a = 11
outer 2: b = 2
outer 2: c = 3
outer 2: d = 4
*******************************************************************************/
