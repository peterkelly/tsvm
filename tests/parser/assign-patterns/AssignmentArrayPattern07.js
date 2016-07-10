[ ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-22 "[ ... rest ] = value ;"
  [] 0-22 "[ ... rest ] = value ;"
    ExpressionStatement 0-22 "[ ... rest ] = value ;"
      Assign 0-20 "[ ... rest ] = value"
        ArrayLiteral 0-12 "[ ... rest ]"
          [] 2-10 "... rest"
            SpreadElement 2-10 "... rest"
              IdentifierReference("rest") 6-10 "rest"
        IdentifierReference("value") 15-20 "value"
*******************************************************************************/
