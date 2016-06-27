for ( var x of y ) {
    total = total + x ;
}

/*******************************************************************************
ast-module

Module
  []
    ForOf
      VarForDeclaration
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
