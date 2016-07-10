( [ a , { b } , c ] = value ) ;

/*******************************************************************************
ast-module

Module 0-31 "( [ a , { b } , c ] = value ) ;"
  [] 0-31 "( [ a , { b } , c ] = value ) ;"
    ExpressionStatement 0-31 "( [ a , { b } , c ] = value ) ;"
      Assign 2-27 "[ a , { b } , c ] = value"
        ArrayLiteral 2-19 "[ a , { b } , c ]"
          [] 4-17 "a , { b } , c"
            IdentifierReference("a") 4-5 "a"
            ObjectLiteral 8-13 "{ b }"
              [] 10-11 "b"
                IdentifierReference("b") 10-11 "b"
            IdentifierReference("c") 16-17 "c"
        IdentifierReference("value") 22-27 "value"
*******************************************************************************/
