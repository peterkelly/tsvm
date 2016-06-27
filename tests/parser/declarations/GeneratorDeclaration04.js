function * test ( x , y , z , ...rest ) {
}

/*******************************************************************************
ast-module

Module
  []
    GeneratorDeclaration
      BindingIdentifier("test")
      []
        BindingIdentifier("x")
        BindingIdentifier("y")
        BindingIdentifier("z")
        BindingRestElement
          BindingIdentifier("rest")
      []
*******************************************************************************/
