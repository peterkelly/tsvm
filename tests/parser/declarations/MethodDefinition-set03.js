( {

    set test ( x ) {
        1 ;
        2 ;
        3 ;
    }

} ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      ObjectLiteral
        []
          Setter
            Identifier("test")
            BindingIdentifier("x")
            []
              ExpressionStatement
                1
              ExpressionStatement
                2
              ExpressionStatement
                3
*******************************************************************************/
