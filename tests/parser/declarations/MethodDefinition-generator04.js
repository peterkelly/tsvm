( {

    * test ( x , y , z , ... rest ) {
    }

} ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      ObjectLiteral
        []
          GeneratorMethod
            Identifier("test")
            []
              BindingIdentifier("x")
              BindingIdentifier("y")
              BindingIdentifier("z")
              BindingRestElement
                BindingIdentifier("rest")
            []
*******************************************************************************/
