try {
}
catch ( [ a , b , ... rest ] ) {
}

/*******************************************************************************
ast-module

Module
  []
    TryStatement
      Block
        []
      Catch
        ArrayBindingPattern
          []
            BindingIdentifier("a")
            BindingIdentifier("b")
            BindingRestElement
              BindingIdentifier("rest")
        Block
          []
      null
*******************************************************************************/
