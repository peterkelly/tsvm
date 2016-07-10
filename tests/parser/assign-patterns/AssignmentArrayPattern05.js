[ a , b , c , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-36 "[ a , b , c , , ... rest ] = value ;"
  [] 0-36 "[ a , b , c , , ... rest ] = value ;"
    ExpressionStatement 0-36 "[ a , b , c , , ... rest ] = value ;"
      Assign 0-34 "[ a , b , c , , ... rest ] = value"
        ArrayLiteral 0-26 "[ a , b , c , , ... rest ]"
          [] 2-24 "a , b , c , , ... rest"
            IdentifierReference("a") 2-3 "a"
            IdentifierReference("b") 6-7 "b"
            IdentifierReference("c") 10-11 "c"
            Elision(1) 14-15 ","
            SpreadElement 16-24 "... rest"
              IdentifierReference("rest") 20-24 "rest"
        IdentifierReference("value") 29-34 "value"
*******************************************************************************/
