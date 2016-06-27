( a || b ) == ( c || d ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      AbstractEquals
        LogicalORNode
          IdentifierReference("a")
          IdentifierReference("b")
        LogicalORNode
          IdentifierReference("c")
          IdentifierReference("d")
*******************************************************************************/
