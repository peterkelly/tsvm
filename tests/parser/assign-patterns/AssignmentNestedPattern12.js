( { p1 : [ a ] = x , p2 : [ b ] = y } = value ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Assign
        ObjectLiteral
          []
            ColonPropertyDefinition
              Identifier("p1")
              Assign
                ArrayLiteral
                  []
                    IdentifierReference("a")
                IdentifierReference("x")
            ColonPropertyDefinition
              Identifier("p2")
              Assign
                ArrayLiteral
                  []
                    IdentifierReference("b")
                IdentifierReference("y")
        IdentifierReference("value")
*******************************************************************************/
