x ? a || b : c || d ;

/*******************************************************************************
ast-module

Module 0-21 "x ? a || b : c || d ;"
  [] 0-21 "x ? a || b : c || d ;"
    ExpressionStatement 0-21 "x ? a || b : c || d ;"
      Conditional 0-19 "x ? a || b : c || d"
        IdentifierReference("x") 0-1 "x"
        LogicalORNode 4-10 "a || b"
          IdentifierReference("a") 4-5 "a"
          IdentifierReference("b") 9-10 "b"
        LogicalORNode 13-19 "c || d"
          IdentifierReference("c") 13-14 "c"
          IdentifierReference("d") 18-19 "d"
*******************************************************************************/
