( [ a , b , c , , ] = value ) ;

/*******************************************************************************
ast-module

Module 0-31 "( [ a , b , c , , ] = value ) ;"
  [] 0-31 "( [ a , b , c , , ] = value ) ;"
    ExpressionStatement 0-31 "( [ a , b , c , , ] = value ) ;"
      Assign 2-27 "[ a , b , c , , ] = value"
        ArrayLiteral 2-19 "[ a , b , c , , ]"
          [] 4-17 "a , b , c , ,"
            IdentifierReference("a") 4-5 "a"
            IdentifierReference("b") 8-9 "b"
            IdentifierReference("c") 12-13 "c"
            Elision(1) 16-17 ","
        IdentifierReference("value") 22-27 "value"
*******************************************************************************/
