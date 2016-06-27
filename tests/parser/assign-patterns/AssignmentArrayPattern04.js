[ a , b , c , ... rest ] = value ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Assign
        ArrayLiteral
          []
            IdentifierReference("a")
            IdentifierReference("b")
            IdentifierReference("c")
            SpreadElement
              IdentifierReference("rest")
        IdentifierReference("value")
*******************************************************************************/
