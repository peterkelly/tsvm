a | ( b && c ) | d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      BitwiseOR
        BitwiseOR
          IdentifierReference("a")
          LogicalAND
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
