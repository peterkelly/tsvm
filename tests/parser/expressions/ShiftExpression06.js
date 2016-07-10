a << b | c << d ;

/*******************************************************************************
ast-module

Module 0-17 "a << b | c << d ;"
  [] 0-17 "a << b | c << d ;"
    ExpressionStatement 0-17 "a << b | c << d ;"
      BitwiseOR 0-15 "a << b | c << d"
        LeftShift 0-6 "a << b"
          IdentifierReference("a") 0-1 "a"
          IdentifierReference("b") 5-6 "b"
        LeftShift 9-15 "c << d"
          IdentifierReference("c") 9-10 "c"
          IdentifierReference("d") 14-15 "d"
*******************************************************************************/
