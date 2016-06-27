a || ( b && c ) || d;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      LogicalORNode
        LogicalORNode
          IdentifierReference("a")
          LogicalAND
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
