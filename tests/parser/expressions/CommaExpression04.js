a = ( b , c ) = d ;

/*******************************************************************************
ast-module

Module 0-19 "a = ( b , c ) = d ;"
  [] 0-19 "a = ( b , c ) = d ;"
    ExpressionStatement 0-19 "a = ( b , c ) = d ;"
      Assign 0-17 "a = ( b , c ) = d"
        IdentifierReference("a") 0-1 "a"
        Assign 4-17 "( b , c ) = d"
          Comma 6-11 "b , c"
            IdentifierReference("b") 6-7 "b"
            IdentifierReference("c") 10-11 "c"
          IdentifierReference("d") 16-17 "d"
*******************************************************************************/
