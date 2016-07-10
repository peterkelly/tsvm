a && ( b | c ) && d ;

/*******************************************************************************
ast-module

Module 0-21 "a && ( b | c ) && d ;"
  [] 0-21 "a && ( b | c ) && d ;"
    ExpressionStatement 0-21 "a && ( b | c ) && d ;"
      LogicalAND 0-19 "a && ( b | c ) && d"
        LogicalAND 0-14 "a && ( b | c )"
          IdentifierReference("a") 0-1 "a"
          BitwiseOR 7-12 "b | c"
            IdentifierReference("b") 7-8 "b"
            IdentifierReference("c") 11-12 "c"
        IdentifierReference("d") 18-19 "d"
*******************************************************************************/
