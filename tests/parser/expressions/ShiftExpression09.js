( a | b ) << ( c | d ) ;

/*******************************************************************************
ast-module

Module 0-24 "( a | b ) << ( c | d ) ;"
  [] 0-24 "( a | b ) << ( c | d ) ;"
    ExpressionStatement 0-24 "( a | b ) << ( c | d ) ;"
      LeftShift 0-22 "( a | b ) << ( c | d )"
        BitwiseOR 2-7 "a | b"
          IdentifierReference("a") 2-3 "a"
          IdentifierReference("b") 6-7 "b"
        BitwiseOR 15-20 "c | d"
          IdentifierReference("c") 15-16 "c"
          IdentifierReference("d") 19-20 "d"
*******************************************************************************/
