( [ { a , b } ] = value ) ;

/*******************************************************************************
ast-module

Module 0-27 "( [ { a , b } ] = value ) ;"
  [] 0-27 "( [ { a , b } ] = value ) ;"
    ExpressionStatement 0-27 "( [ { a , b } ] = value ) ;"
      Assign 2-23 "[ { a , b } ] = value"
        ArrayLiteral 2-15 "[ { a , b } ]"
          [] 4-13 "{ a , b }"
            ObjectLiteral 4-13 "{ a , b }"
              [] 6-11 "a , b"
                IdentifierReference("a") 6-7 "a"
                IdentifierReference("b") 10-11 "b"
        IdentifierReference("value") 18-23 "value"
*******************************************************************************/
