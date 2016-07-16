function test ( x ) {
  1 ;
  2 ;
  3 ;
}

/*******************************************************************************
ast-module

Module 0-41 "function test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
  [] 0-41 "function test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
    FunctionDeclaration 0-41 "function test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
      BindingIdentifier("test") 9-13 "test"
      FormalParameters3 16-17 "x"
        [] 16-17 "x"
          BindingIdentifier("x") 16-17 "x"
      [] 24-39 "1 ;\n  2 ;\n  3 ;"
        ExpressionStatement 24-27 "1 ;"
          1 24-25 "1"
        ExpressionStatement 30-33 "2 ;"
          2 30-31 "2"
        ExpressionStatement 36-39 "3 ;"
          3 36-37 "3"
*******************************************************************************/
