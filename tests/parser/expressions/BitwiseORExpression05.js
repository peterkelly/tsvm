a && b | c && d ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      LogicalAND
        LogicalAND
          IdentifierReference("a")
          BitwiseOR
            IdentifierReference("b")
            IdentifierReference("c")
        IdentifierReference("d")
*******************************************************************************/
