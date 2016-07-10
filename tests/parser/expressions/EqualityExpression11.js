a || b == c || d ;

/*******************************************************************************
ast-module

Module 0-18 "a || b == c || d ;"
  [] 0-18 "a || b == c || d ;"
    ExpressionStatement 0-18 "a || b == c || d ;"
      LogicalORNode 0-16 "a || b == c || d"
        LogicalORNode 0-11 "a || b == c"
          IdentifierReference("a") 0-1 "a"
          AbstractEquals 5-11 "b == c"
            IdentifierReference("b") 5-6 "b"
            IdentifierReference("c") 10-11 "c"
        IdentifierReference("d") 15-16 "d"
*******************************************************************************/
