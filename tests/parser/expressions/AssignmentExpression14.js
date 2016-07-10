x = a == b ;

/*******************************************************************************
ast-module

Module 0-12 "x = a == b ;"
  [] 0-12 "x = a == b ;"
    ExpressionStatement 0-12 "x = a == b ;"
      Assign 0-10 "x = a == b"
        IdentifierReference("x") 0-1 "x"
        AbstractEquals 4-10 "a == b"
          IdentifierReference("a") 4-5 "a"
          IdentifierReference("b") 9-10 "b"
*******************************************************************************/
