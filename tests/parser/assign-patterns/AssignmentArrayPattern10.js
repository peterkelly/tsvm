( [ a , , b , c ] = value ) ;

/*******************************************************************************
ast-module

Module 0-29 "( [ a , , b , c ] = value ) ;"
  [] 0-29 "( [ a , , b , c ] = value ) ;"
    ExpressionStatement 0-29 "( [ a , , b , c ] = value ) ;"
      Assign 2-25 "[ a , , b , c ] = value"
        ArrayLiteral 2-17 "[ a , , b , c ]"
          [] 4-15 "a , , b , c"
            IdentifierReference("a") 4-5 "a"
            Elision 8-9 ","
            IdentifierReference("b") 10-11 "b"
            IdentifierReference("c") 14-15 "c"
        IdentifierReference("value") 20-25 "value"
*******************************************************************************/
