try {
    1 ;
    2 ;
}
catch ( e ) {
    3 ;
    4 ;
}

/*******************************************************************************
ast-module

Module
  []
    TryStatement
      Block
        []
          ExpressionStatement
            1
          ExpressionStatement
            2
      Catch
        BindingIdentifier("e")
        Block
          []
            ExpressionStatement
              3
            ExpressionStatement
              4
      null
*******************************************************************************/
