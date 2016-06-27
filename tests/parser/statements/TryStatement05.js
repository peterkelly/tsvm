try {
    1 ;
    2 ;
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
      null
      Finally
        Block
          []
            ExpressionStatement
              5
            ExpressionStatement
              6
*******************************************************************************/
