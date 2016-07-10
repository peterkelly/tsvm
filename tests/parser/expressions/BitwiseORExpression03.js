a | b && c | d ;

/*******************************************************************************
ast-module

Module 0-16 "a | b && c | d ;"
  [] 0-16 "a | b && c | d ;"
    ExpressionStatement 0-16 "a | b && c | d ;"
      LogicalAND 0-14 "a | b && c | d"
        BitwiseOR 0-5 "a | b"
          IdentifierReference("a") 0-1 "a"
          IdentifierReference("b") 4-5 "b"
        BitwiseOR 9-14 "c | d"
          IdentifierReference("c") 9-10 "c"
          IdentifierReference("d") 13-14 "d"
*******************************************************************************/
