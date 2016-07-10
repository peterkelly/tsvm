a << b >> c >>> d ;

/*******************************************************************************
ast-module

Module 0-19 "a << b >> c >>> d ;"
  [] 0-19 "a << b >> c >>> d ;"
    ExpressionStatement 0-19 "a << b >> c >>> d ;"
      UnsignedRightShift 0-17 "a << b >> c >>> d"
        SignedRightShift 0-11 "a << b >> c"
          LeftShift 0-6 "a << b"
            IdentifierReference("a") 0-1 "a"
            IdentifierReference("b") 5-6 "b"
          IdentifierReference("c") 10-11 "c"
        IdentifierReference("d") 16-17 "d"
*******************************************************************************/
