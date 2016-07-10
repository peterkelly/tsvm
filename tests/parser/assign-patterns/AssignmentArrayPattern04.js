[ a , b , c , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-34 "[ a , b , c , ... rest ] = value ;"
  [] 0-34 "[ a , b , c , ... rest ] = value ;"
    ExpressionStatement 0-34 "[ a , b , c , ... rest ] = value ;"
      Assign 0-32 "[ a , b , c , ... rest ] = value"
        ArrayLiteral 0-24 "[ a , b , c , ... rest ]"
          [] 2-22 "a , b , c , ... rest"
            IdentifierReference("a") 2-3 "a"
            IdentifierReference("b") 6-7 "b"
            IdentifierReference("c") 10-11 "c"
            SpreadElement 14-22 "... rest"
              IdentifierReference("rest") 18-22 "rest"
        IdentifierReference("value") 27-32 "value"
*******************************************************************************/
