try {
}
catch ( { a : x , b : y } ) {
}

/*******************************************************************************
ast-module

Module 0-39 "try {\n}\ncatch ( { a : x , b : y } ) {\n}"
  [] 0-39 "try {\n}\ncatch ( { a : x , b : y } ) {\n}"
    TryStatement 0-39 "try {\n}\ncatch ( { a : x , b : y } ) {\n}"
      Block 4-7 "{\n}"
        [] 6-6 ""
      Catch 8-39 "catch ( { a : x , b : y } ) {\n}"
        ObjectBindingPattern 16-33 "{ a : x , b : y }"
          [] 18-31 "a : x , b : y"
            BindingProperty 18-23 "a : x"
              Identifier("a") 18-19 "a"
              BindingIdentifier("x") 22-23 "x"
            BindingProperty 26-31 "b : y"
              Identifier("b") 26-27 "b"
              BindingIdentifier("y") 30-31 "y"
        Block 36-39 "{\n}"
          [] 38-38 ""
      null
*******************************************************************************/
