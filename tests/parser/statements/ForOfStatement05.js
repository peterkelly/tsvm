for ( let x of y ) {
    total = total + x ;
}

/*******************************************************************************
ast-module

Module
  []
    ForOf
      LetForDeclaration
        BindingIdentifier("x")
      IdentifierReference("y")
      Block
        []
          ExpressionStatement
            Assign
              IdentifierReference("total")
              Add
                IdentifierReference("total")
                IdentifierReference("x")
*******************************************************************************/
