try {
}
catch ( { a : x , b : y } ) {
}

/*******************************************************************************
ast-module

Module
  []
    TryStatement
      Block
        []
      Catch
        ObjectBindingPattern
          []
            BindingProperty
              Identifier("a")
              BindingIdentifier("x")
            BindingProperty
              Identifier("b")
              BindingIdentifier("y")
        Block
          []
      null
*******************************************************************************/
