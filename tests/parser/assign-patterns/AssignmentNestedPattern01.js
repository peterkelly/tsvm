( [ { a } ] = value ) ;

/*******************************************************************************
ast-module

Module 0-23 "( [ { a } ] = value ) ;"
  [] 0-23 "( [ { a } ] = value ) ;"
    ExpressionStatement 0-23 "( [ { a } ] = value ) ;"
      Assign 2-19 "[ { a } ] = value"
        ArrayLiteral 2-11 "[ { a } ]"
          [] 4-9 "{ a }"
            ObjectLiteral 4-9 "{ a }"
              [] 6-7 "a"
                IdentifierReference("a") 6-7 "a"
        IdentifierReference("value") 14-19 "value"
*******************************************************************************/
