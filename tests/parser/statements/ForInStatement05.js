for ( let x in y ) {
    total = total + x ;
}

/*******************************************************************************
ast-module

Module
  []
    ForIn
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
