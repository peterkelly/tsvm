a == ( b || c ) == d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      AbstractEquals
        AbstractEquals
          IdentifierReference("a")
          LogicalORNode
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
