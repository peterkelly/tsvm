( {

    test ( x , y , z , ... rest ) {
    }

} ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      ObjectLiteral
        []
          Method
            Identifier("test")
            []
              BindingIdentifier("x")
              BindingIdentifier("y")
              BindingIdentifier("z")
              BindingRestElement
                BindingIdentifier("rest")
            []
*******************************************************************************/
