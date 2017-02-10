// Both functions should be called, because a() returns false, so the if statement
// has to evaluate b() before it can determine the final result of the expression.

var aCalled = false;
var bCalled = false;

function a() {
    aCalled = true;
    return false;
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
b called? true
*******************************************************************************/
