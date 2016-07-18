[ a , b , c , , , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-40 "[ a , b , c , , , , ... rest ] = value ;"
  [] 0-40 "[ a , b , c , , , , ... rest ] = value ;"
    ExpressionStatement 0-40 "[ a , b , c , , , , ... rest ] = value ;"
      Assign 0-38 "[ a , b , c , , , , ... rest ] = value"
        ArrayLiteral 0-30 "[ a , b , c , , , , ... rest ]"
          [] 2-28 "a , b , c , , , , ... rest"
            IdentifierReference("a") 2-3 "a"
            IdentifierReference("b") 6-7 "b"
            IdentifierReference("c") 10-11 "c"
            Elision 14-15 ","
            Elision 16-17 ","
            Elision 18-19 ","
            SpreadElement 20-28 "... rest"
              IdentifierReference("rest") 24-28 "rest"
        IdentifierReference("value") 33-38 "value"
*******************************************************************************/
