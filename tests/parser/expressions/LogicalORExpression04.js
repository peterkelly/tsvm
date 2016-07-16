a || x ? b : c || d ;

/*******************************************************************************
ast-module

Module 0-21 "a || x ? b : c || d ;"
  [] 0-21 "a || x ? b : c || d ;"
    ExpressionStatement 0-21 "a || x ? b : c || d ;"
      Conditional 0-19 "a || x ? b : c || d"
        LogicalOR 0-6 "a || x"
          IdentifierReference("a") 0-1 "a"
          IdentifierReference("x") 5-6 "x"
        IdentifierReference("b") 9-10 "b"
        LogicalOR 13-19 "c || d"
          IdentifierReference("c") 13-14 "c"
          IdentifierReference("d") 18-19 "d"
*******************************************************************************/
