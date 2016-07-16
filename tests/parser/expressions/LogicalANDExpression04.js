a && ( b || c ) && d ;

/*******************************************************************************
ast-module

Module 0-22 "a && ( b || c ) && d ;"
  [] 0-22 "a && ( b || c ) && d ;"
    ExpressionStatement 0-22 "a && ( b || c ) && d ;"
      LogicalAND 0-20 "a && ( b || c ) && d"
        LogicalAND 0-15 "a && ( b || c )"
          IdentifierReference("a") 0-1 "a"
          LogicalOR 7-13 "b || c"
            IdentifierReference("b") 7-8 "b"
            IdentifierReference("c") 12-13 "c"
        IdentifierReference("d") 19-20 "d"
*******************************************************************************/
