( { a = 1 } = value ) ;

/*******************************************************************************
ast-module

Module 0-23 "( { a = 1 } = value ) ;"
  [] 0-23 "( { a = 1 } = value ) ;"
    ExpressionStatement 0-23 "( { a = 1 } = value ) ;"
      Assign 2-19 "{ a = 1 } = value"
        ObjectLiteral 2-11 "{ a = 1 }"
          [] 4-9 "a = 1"
            CoverInitializedName 4-9 "a = 1"
              IdentifierReference("a") 4-5 "a"
              1 8-9 "1"
        IdentifierReference("value") 14-19 "value"
*******************************************************************************/
