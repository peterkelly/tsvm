( [ { a } = x ] = value ) ;

/*******************************************************************************
ast-module

Module 0-27 "( [ { a } = x ] = value ) ;"
  [] 0-27 "( [ { a } = x ] = value ) ;"
    ExpressionStatement 0-27 "( [ { a } = x ] = value ) ;"
      Assign 2-23 "[ { a } = x ] = value"
        ArrayLiteral 2-15 "[ { a } = x ]"
          [] 4-13 "{ a } = x"
            Assign 4-13 "{ a } = x"
              ObjectLiteral 4-9 "{ a }"
                [] 6-7 "a"
                  IdentifierReference("a") 6-7 "a"
              IdentifierReference("x") 12-13 "x"
        IdentifierReference("value") 18-23 "value"
*******************************************************************************/
