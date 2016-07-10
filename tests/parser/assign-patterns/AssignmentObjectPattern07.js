( { a = 1 , b = 2 , c = 3 } = value ) ;

/*******************************************************************************
ast-module

Module 0-39 "( { a = 1 , b = 2 , c = 3 } = value ) ;"
  [] 0-39 "( { a = 1 , b = 2 , c = 3 } = value ) ;"
    ExpressionStatement 0-39 "( { a = 1 , b = 2 , c = 3 } = value ) ;"
      Assign 2-35 "{ a = 1 , b = 2 , c = 3 } = value"
        ObjectLiteral 2-27 "{ a = 1 , b = 2 , c = 3 }"
          [] 4-25 "a = 1 , b = 2 , c = 3"
            CoverInitializedName 4-9 "a = 1"
              IdentifierReference("a") 4-5 "a"
              1 8-9 "1"
            CoverInitializedName 12-17 "b = 2"
              IdentifierReference("b") 12-13 "b"
              2 16-17 "2"
            CoverInitializedName 20-25 "c = 3"
              IdentifierReference("c") 20-21 "c"
              3 24-25 "3"
        IdentifierReference("value") 30-35 "value"
*******************************************************************************/
