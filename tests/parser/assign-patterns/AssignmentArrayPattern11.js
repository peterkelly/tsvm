( [ a , , , , b , c ] = value ) ;

/*******************************************************************************
ast-module

Module 0-33 "( [ a , , , , b , c ] = value ) ;"
  [] 0-33 "( [ a , , , , b , c ] = value ) ;"
    ExpressionStatement 0-33 "( [ a , , , , b , c ] = value ) ;"
      Assign 2-29 "[ a , , , , b , c ] = value"
        ArrayLiteral 2-21 "[ a , , , , b , c ]"
          [] 4-19 "a , , , , b , c"
            IdentifierReference("a") 4-5 "a"
            Elision(3) 8-13 ", , ,"
            IdentifierReference("b") 14-15 "b"
            IdentifierReference("c") 18-19 "c"
        IdentifierReference("value") 24-29 "value"
*******************************************************************************/
