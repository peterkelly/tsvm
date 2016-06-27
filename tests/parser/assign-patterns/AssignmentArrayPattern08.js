[ , ... rest ] = value ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Assign
        ArrayLiteral
          []
            Elision(1)
            SpreadElement
              IdentifierReference("rest")
        IdentifierReference("value")
*******************************************************************************/
