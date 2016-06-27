a && ( b || c ) && d;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      LogicalAND
        LogicalAND
          IdentifierReference("a")
          LogicalORNode
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
