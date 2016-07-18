[ , , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-28 "[ , , , ... rest ] = value ;"
  [] 0-28 "[ , , , ... rest ] = value ;"
    ExpressionStatement 0-28 "[ , , , ... rest ] = value ;"
      Assign 0-26 "[ , , , ... rest ] = value"
        ArrayLiteral 0-18 "[ , , , ... rest ]"
          [] 2-16 ", , , ... rest"
            Elision 2-3 ","
            Elision 4-5 ","
            Elision 6-7 ","
            SpreadElement 8-16 "... rest"
              IdentifierReference("rest") 12-16 "rest"
        IdentifierReference("value") 21-26 "value"
*******************************************************************************/
