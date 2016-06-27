a << ( b | c ) << d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      LeftShift
        LeftShift
          IdentifierReference("a")
          BitwiseOR
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
