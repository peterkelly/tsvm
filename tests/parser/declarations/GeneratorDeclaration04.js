function * test ( x , y , z , ...rest ) {
}

/*******************************************************************************
ast-module

Module 0-43 "function * test ( x , y , z , ...rest ) {\n}"
  [] 0-43 "function * test ( x , y , z , ...rest ) {\n}"
    GeneratorDeclaration 0-43 "function * test ( x , y , z , ...rest ) {\n}"
      BindingIdentifier("test") 11-15 "test"
      [] 18-37 "x , y , z , ...rest"
        BindingIdentifier("x") 18-19 "x"
        BindingIdentifier("y") 22-23 "y"
        BindingIdentifier("z") 26-27 "z"
        BindingRestElement 30-37 "...rest"
          BindingIdentifier("rest") 33-37 "rest"
      [] 42-42 ""
*******************************************************************************/
