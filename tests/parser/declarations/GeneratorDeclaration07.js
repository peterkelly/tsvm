function * test ( x ) {
  1 ;
  2 ;
  3 ;
}

/*******************************************************************************
ast-module

Module 0-43 "function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
  [] 0-43 "function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
    GeneratorDeclaration 0-43 "function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
      BindingIdentifier("test") 11-15 "test"
      [] 18-19 "x"
        BindingIdentifier("x") 18-19 "x"
      [] 26-41 "1 ;\n  2 ;\n  3 ;"
        ExpressionStatement 26-29 "1 ;"
          1 26-27 "1"
        ExpressionStatement 32-35 "2 ;"
          2 32-33 "2"
        ExpressionStatement 38-41 "3 ;"
          3 38-39 "3"
*******************************************************************************/
