a | ( b && c ) | d ;

/*******************************************************************************
ast-module

Module 0-20 "a | ( b && c ) | d ;"
  [] 0-20 "a | ( b && c ) | d ;"
    ExpressionStatement 0-20 "a | ( b && c ) | d ;"
      BitwiseOR 0-18 "a | ( b && c ) | d"
        BitwiseOR 0-14 "a | ( b && c )"
          IdentifierReference("a") 0-1 "a"
          LogicalAND 6-12 "b && c"
            IdentifierReference("b") 6-7 "b"
            IdentifierReference("c") 11-12 "c"
        IdentifierReference("d") 17-18 "d"
*******************************************************************************/
