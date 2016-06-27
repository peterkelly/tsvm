( [ a , { b } = x , c ] = value ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      Assign
        ArrayLiteral
          []
            IdentifierReference("a")
            Assign
              ObjectLiteral
                []
                  IdentifierReference("b")
              IdentifierReference("x")
            IdentifierReference("c")
        IdentifierReference("value")
*******************************************************************************/
