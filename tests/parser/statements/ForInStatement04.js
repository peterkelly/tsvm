for ( var x in y ) {
    total = total + x ;
}

/*******************************************************************************
ast-module

Module
  []
    ForIn
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
