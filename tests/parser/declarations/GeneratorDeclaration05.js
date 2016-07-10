function * test ( ...rest ) {
}

/*******************************************************************************
ast-module

Module 0-31 "function * test ( ...rest ) {\n}"
  [] 0-31 "function * test ( ...rest ) {\n}"
    GeneratorDeclaration 0-31 "function * test ( ...rest ) {\n}"
      BindingIdentifier("test") 11-15 "test"
      [] 18-25 "...rest"
        BindingRestElement 18-25 "...rest"
          BindingIdentifier("rest") 21-25 "rest"
      [] 30-30 ""
*******************************************************************************/
