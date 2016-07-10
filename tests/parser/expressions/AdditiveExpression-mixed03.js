a + b - c + d - e ;

/*******************************************************************************
ast-module

Module 0-19 "a + b - c + d - e ;"
  [] 0-19 "a + b - c + d - e ;"
    ExpressionStatement 0-19 "a + b - c + d - e ;"
      Subtract 0-17 "a + b - c + d - e"
        Add 0-13 "a + b - c + d"
          Subtract 0-9 "a + b - c"
            Add 0-5 "a + b"
              IdentifierReference("a") 0-1 "a"
              IdentifierReference("b") 4-5 "b"
            IdentifierReference("c") 8-9 "c"
          IdentifierReference("d") 12-13 "d"
        IdentifierReference("e") 16-17 "e"
*******************************************************************************/
