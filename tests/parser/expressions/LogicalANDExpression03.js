a && b || c && d ;

/*******************************************************************************
ast-module

Module 0-18 "a && b || c && d ;"
  [] 0-18 "a && b || c && d ;"
    ExpressionStatement 0-18 "a && b || c && d ;"
      LogicalOR 0-16 "a && b || c && d"
        LogicalAND 0-6 "a && b"
          IdentifierReference("a") 0-1 "a"
          IdentifierReference("b") 5-6 "b"
        LogicalAND 10-16 "c && d"
          IdentifierReference("c") 10-11 "c"
          IdentifierReference("d") 15-16 "d"
*******************************************************************************/
