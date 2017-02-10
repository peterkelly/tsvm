// Only function a should be called, because a() returns true, so the if
// statement knows the final result of the expression would be true regardless
// of the result of b(), and is thus supposed to avoid evaluating it.

var aCalled = false;
var bCalled = false;

function a() {
    aCalled = true;
    return true;
}

function b() {
    bCalled = true;
    return true;
}

if (a() || b())
    console.log("true branch");
else
    console.log("false branch");
console.log("a called? " + aCalled);
console.log("b called? " + bCalled);

/*******************************************************************************
execute

true branch
a called? true
b called? false
*******************************************************************************/
