a ^ b | c ^ d ;

/*******************************************************************************
ast-module

Module 0-15 "a ^ b | c ^ d ;"
  [] 0-15 "a ^ b | c ^ d ;"
    ExpressionStatement 0-15 "a ^ b | c ^ d ;"
      BitwiseOR 0-13 "a ^ b | c ^ d"
        BitwiseXOR 0-5 "a ^ b"
          IdentifierReference("a") 0-1 "a"
          IdentifierReference("b") 4-5 "b"
        BitwiseXOR 8-13 "c ^ d"
          IdentifierReference("c") 8-9 "c"
          IdentifierReference("d") 12-13 "d"
*******************************************************************************/
