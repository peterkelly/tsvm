a || x ? b : c || d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Conditional
        LogicalORNode
          IdentifierReference("a")
          IdentifierReference("x")
        IdentifierReference("b")
        LogicalORNode
          IdentifierReference("c")
          IdentifierReference("d")
*******************************************************************************/
