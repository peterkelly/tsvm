( [ { a , b } = x ] = value ) ;

/*******************************************************************************
ast-module

Module 0-31 "( [ { a , b } = x ] = value ) ;"
  [] 0-31 "( [ { a , b } = x ] = value ) ;"
    ExpressionStatement 0-31 "( [ { a , b } = x ] = value ) ;"
      Assign 2-27 "[ { a , b } = x ] = value"
        ArrayLiteral 2-19 "[ { a , b } = x ]"
          [] 4-17 "{ a , b } = x"
            Assign 4-17 "{ a , b } = x"
              ObjectLiteral 4-13 "{ a , b }"
                [] 6-11 "a , b"
                  IdentifierReference("a") 6-7 "a"
                  IdentifierReference("b") 10-11 "b"
              IdentifierReference("x") 16-17 "x"
        IdentifierReference("value") 22-27 "value"
*******************************************************************************/
