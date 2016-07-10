a >>> b >> c << d ;

/*******************************************************************************
ast-module

Module 0-19 "a >>> b >> c << d ;"
  [] 0-19 "a >>> b >> c << d ;"
    ExpressionStatement 0-19 "a >>> b >> c << d ;"
      LeftShift 0-17 "a >>> b >> c << d"
        SignedRightShift 0-12 "a >>> b >> c"
          UnsignedRightShift 0-7 "a >>> b"
            IdentifierReference("a") 0-1 "a"
            IdentifierReference("b") 6-7 "b"
          IdentifierReference("c") 11-12 "c"
        IdentifierReference("d") 16-17 "d"
*******************************************************************************/
