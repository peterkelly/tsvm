for ( const x of y ) {
    total = total + x ;
}

/*******************************************************************************
ast-module

Module
  []
    ForOf
      ConstForDeclaration
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
