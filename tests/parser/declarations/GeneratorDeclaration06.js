function * test ( x ) {
  1 ;
}

/*******************************************************************************
ast-module

Module 0-31 "function * test ( x ) {\n  1 ;\n}"
  [] 0-31 "function * test ( x ) {\n  1 ;\n}"
    GeneratorDeclaration 0-31 "function * test ( x ) {\n  1 ;\n}"
      BindingIdentifier("test") 11-15 "test"
      FormalParameters3 18-19 "x"
        [] 18-19 "x"
          BindingIdentifier("x") 18-19 "x"
      [] 26-29 "1 ;"
        ExpressionStatement 26-29 "1 ;"
          1 26-27 "1"
*******************************************************************************/
