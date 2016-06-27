x ? a || b : c || d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Conditional
        IdentifierReference("x")
        LogicalORNode
          IdentifierReference("a")
          IdentifierReference("b")
        LogicalORNode
          IdentifierReference("c")
          IdentifierReference("d")
*******************************************************************************/
