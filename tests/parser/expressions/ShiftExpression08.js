a | b << c | d ;

/*******************************************************************************
ast-module

Module 0-16 "a | b << c | d ;"
  [] 0-16 "a | b << c | d ;"
    ExpressionStatement 0-16 "a | b << c | d ;"
      BitwiseOR 0-14 "a | b << c | d"
        BitwiseOR 0-10 "a | b << c"
          IdentifierReference("a") 0-1 "a"
          LeftShift 4-10 "b << c"
            IdentifierReference("b") 4-5 "b"
            IdentifierReference("c") 9-10 "c"
        IdentifierReference("d") 13-14 "d"
*******************************************************************************/
