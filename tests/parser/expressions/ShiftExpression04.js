a << b >> c >>> d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      UnsignedRightShift
        SignedRightShift
          LeftShift
            IdentifierReference("a")
            IdentifierReference("b")
          IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
