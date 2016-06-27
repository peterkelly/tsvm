a ^ ( b | c ) ^ d;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      BitwiseXOR
        BitwiseXOR
          IdentifierReference("a")
          BitwiseOR
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
