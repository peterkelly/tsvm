[ a , b , c , , ... rest ] = value ;

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
            Elision(1)
            SpreadElement
              IdentifierReference("rest")
        IdentifierReference("value")
*******************************************************************************/
