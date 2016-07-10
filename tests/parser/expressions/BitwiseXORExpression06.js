( a | b ) ^ ( c | d ) ;

/*******************************************************************************
ast-module

Module 0-23 "( a | b ) ^ ( c | d ) ;"
  [] 0-23 "( a | b ) ^ ( c | d ) ;"
    ExpressionStatement 0-23 "( a | b ) ^ ( c | d ) ;"
      BitwiseXOR 0-21 "( a | b ) ^ ( c | d )"
        BitwiseOR 2-7 "a | b"
          IdentifierReference("a") 2-3 "a"
          IdentifierReference("b") 6-7 "b"
        BitwiseOR 14-19 "c | d"
          IdentifierReference("c") 14-15 "c"
          IdentifierReference("d") 18-19 "d"
*******************************************************************************/
