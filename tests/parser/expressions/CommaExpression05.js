a , b = c , d ;

/*******************************************************************************
ast-module

Module 0-15 "a , b = c , d ;"
  [] 0-15 "a , b = c , d ;"
    ExpressionStatement 0-15 "a , b = c , d ;"
      Comma 0-13 "a , b = c , d"
        Comma 0-9 "a , b = c"
          IdentifierReference("a") 0-1 "a"
          Assign 4-9 "b = c"
            IdentifierReference("b") 4-5 "b"
            IdentifierReference("c") 8-9 "c"
        IdentifierReference("d") 12-13 "d"
*******************************************************************************/
