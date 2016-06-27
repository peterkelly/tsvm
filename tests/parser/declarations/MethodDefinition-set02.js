( {

    set test ( x ) {
        1 ;
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
*******************************************************************************/
