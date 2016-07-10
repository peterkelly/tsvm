[ a , b , c ] = value ;

/*******************************************************************************
ast-module

Module 0-23 "[ a , b , c ] = value ;"
  [] 0-23 "[ a , b , c ] = value ;"
    ExpressionStatement 0-23 "[ a , b , c ] = value ;"
      Assign 0-21 "[ a , b , c ] = value"
        ArrayLiteral 0-13 "[ a , b , c ]"
          [] 2-11 "a , b , c"
            IdentifierReference("a") 2-3 "a"
            IdentifierReference("b") 6-7 "b"
            IdentifierReference("c") 10-11 "c"
        IdentifierReference("value") 16-21 "value"
*******************************************************************************/
