try {
}
catch ( [ a , b , ... rest ] ) {
}

/*******************************************************************************
ast-module

Module 0-42 "try {\n}\ncatch ( [ a , b , ... rest ] ) {\n}"
  [] 0-42 "try {\n}\ncatch ( [ a , b , ... rest ] ) {\n}"
    TryStatement 0-42 "try {\n}\ncatch ( [ a , b , ... rest ] ) {\n}"
      Block 4-7 "{\n}"
        [] 6-6 ""
      Catch 8-42 "catch ( [ a , b , ... rest ] ) {\n}"
        ArrayBindingPattern 16-36 "[ a , b , ... rest ]"
          [] 18-23 "a , b"
            BindingIdentifier("a") 18-19 "a"
            BindingIdentifier("b") 22-23 "b"
          BindingRestElement 26-34 "... rest"
            BindingIdentifier("rest") 30-34 "rest"
        Block 39-42 "{\n}"
          [] 41-41 ""
      null
*******************************************************************************/
