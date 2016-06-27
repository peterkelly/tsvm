x ? y ? 1 : 2 : z ? 3 : 4 ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Conditional
        IdentifierReference("x")
        Conditional
          IdentifierReference("y")
          1
          2
        Conditional
          IdentifierReference("z")
          3
          4
*******************************************************************************/
