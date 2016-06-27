( {

    get test ( ) {
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
          Getter
            Identifier("test")
            []
              ExpressionStatement
                1
              ExpressionStatement
                2
              ExpressionStatement
                3
*******************************************************************************/
