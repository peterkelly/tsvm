a && b | c && d ;

/*******************************************************************************
ast-module

Module 0-17 "a && b | c && d ;"
  [] 0-17 "a && b | c && d ;"
    ExpressionStatement 0-17 "a && b | c && d ;"
      LogicalAND 0-15 "a && b | c && d"
        LogicalAND 0-10 "a && b | c"
          IdentifierReference("a") 0-1 "a"
          BitwiseOR 5-10 "b | c"
            IdentifierReference("b") 5-6 "b"
            IdentifierReference("c") 9-10 "c"
        IdentifierReference("d") 14-15 "d"
*******************************************************************************/
