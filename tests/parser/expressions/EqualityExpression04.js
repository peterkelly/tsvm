a != b != c != d ;

/*******************************************************************************
ast-module

Module 0-18 "a != b != c != d ;"
  [] 0-18 "a != b != c != d ;"
    ExpressionStatement 0-18 "a != b != c != d ;"
      AbstractNotEquals 0-16 "a != b != c != d"
        AbstractNotEquals 0-11 "a != b != c"
          AbstractNotEquals 0-6 "a != b"
            IdentifierReference("a") 0-1 "a"
            IdentifierReference("b") 5-6 "b"
          IdentifierReference("c") 10-11 "c"
        IdentifierReference("d") 15-16 "d"
*******************************************************************************/
