a !== b ;

/*******************************************************************************
ast-module

Module 0-9 "a !== b ;"
  [] 0-9 "a !== b ;"
    ExpressionStatement 0-9 "a !== b ;"
      StrictNotEquals 0-7 "a !== b"
        IdentifierReference("a") 0-1 "a"
        IdentifierReference("b") 6-7 "b"
*******************************************************************************/
