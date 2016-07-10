( [ a , { b } = x , c ] = value ) ;

/*******************************************************************************
ast-module

Module 0-35 "( [ a , { b } = x , c ] = value ) ;"
  [] 0-35 "( [ a , { b } = x , c ] = value ) ;"
    ExpressionStatement 0-35 "( [ a , { b } = x , c ] = value ) ;"
      Assign 2-31 "[ a , { b } = x , c ] = value"
        ArrayLiteral 2-23 "[ a , { b } = x , c ]"
          [] 4-21 "a , { b } = x , c"
            IdentifierReference("a") 4-5 "a"
            Assign 8-17 "{ b } = x"
              ObjectLiteral 8-13 "{ b }"
                [] 10-11 "b"
                  IdentifierReference("b") 10-11 "b"
              IdentifierReference("x") 16-17 "x"
            IdentifierReference("c") 20-21 "c"
        IdentifierReference("value") 26-31 "value"
*******************************************************************************/
