( [ a , b , c , , , , ] = value ) ;

/*******************************************************************************
ast-module

Module 0-35 "( [ a , b , c , , , , ] = value ) ;"
  [] 0-35 "( [ a , b , c , , , , ] = value ) ;"
    ExpressionStatement 0-35 "( [ a , b , c , , , , ] = value ) ;"
      Assign 2-31 "[ a , b , c , , , , ] = value"
        ArrayLiteral 2-23 "[ a , b , c , , , , ]"
          [] 4-21 "a , b , c , , , ,"
            IdentifierReference("a") 4-5 "a"
            IdentifierReference("b") 8-9 "b"
            IdentifierReference("c") 12-13 "c"
            Elision(3) 16-21 ", , ,"
        IdentifierReference("value") 26-31 "value"
*******************************************************************************/
