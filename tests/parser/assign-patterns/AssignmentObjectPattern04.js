( { a , b , c } = value ) ;

/*******************************************************************************
ast-module

Module 0-27 "( { a , b , c } = value ) ;"
  [] 0-27 "( { a , b , c } = value ) ;"
    ExpressionStatement 0-27 "( { a , b , c } = value ) ;"
      Assign 2-23 "{ a , b , c } = value"
        ObjectLiteral 2-15 "{ a , b , c }"
          [] 4-13 "a , b , c"
            IdentifierReference("a") 4-5 "a"
            IdentifierReference("b") 8-9 "b"
            IdentifierReference("c") 12-13 "c"
        IdentifierReference("value") 18-23 "value"
*******************************************************************************/
