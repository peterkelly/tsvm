a + b - c ;

/*******************************************************************************
ast-module

Module 0-11 "a + b - c ;"
  [] 0-11 "a + b - c ;"
    ExpressionStatement 0-11 "a + b - c ;"
      Subtract 0-9 "a + b - c"
        Add 0-5 "a + b"
          IdentifierReference("a") 0-1 "a"
          IdentifierReference("b") 4-5 "b"
        IdentifierReference("c") 8-9 "c"
*******************************************************************************/
