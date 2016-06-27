try {
    1 ;
    2 ;
}
catch ( e ) {
    3 ;
    4 ;
}
finally {
    5 ;
    6 ;
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
      Finally
        Block
          []
            ExpressionStatement
              5
            ExpressionStatement
              6
*******************************************************************************/
