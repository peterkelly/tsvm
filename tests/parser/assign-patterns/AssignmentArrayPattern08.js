[ , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-24 "[ , ... rest ] = value ;"
  [] 0-24 "[ , ... rest ] = value ;"
    ExpressionStatement 0-24 "[ , ... rest ] = value ;"
      Assign 0-22 "[ , ... rest ] = value"
        ArrayLiteral 0-14 "[ , ... rest ]"
          [] 2-12 ", ... rest"
            Elision(1) 2-3 ","
            SpreadElement 4-12 "... rest"
              IdentifierReference("rest") 8-12 "rest"
        IdentifierReference("value") 17-22 "value"
*******************************************************************************/
