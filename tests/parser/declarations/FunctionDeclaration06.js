function test ( x ) {
  1 ;
}

/*******************************************************************************
ast-module

Module 0-29 "function test ( x ) {\n  1 ;\n}"
  [] 0-29 "function test ( x ) {\n  1 ;\n}"
    FunctionDeclaration 0-29 "function test ( x ) {\n  1 ;\n}"
      BindingIdentifier("test") 9-13 "test"
      FormalParameters3 16-17 "x"
        [] 16-17 "x"
          BindingIdentifier("x") 16-17 "x"
      [] 24-27 "1 ;"
        ExpressionStatement 24-27 "1 ;"
          1 24-25 "1"
*******************************************************************************/
