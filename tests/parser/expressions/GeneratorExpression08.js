( function * test ( x ) {
  1 ;
  2 ;
  3 ;
} ) ;

/*******************************************************************************
ast-module

Module 0-49 "( function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n} ) ;"
  [] 0-49 "( function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n} ) ;"
    ExpressionStatement 0-49 "( function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n} ) ;"
      GeneratorExpression 2-45 "function * test ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
        BindingIdentifier("test") 13-17 "test"
        [] 20-21 "x"
          BindingIdentifier("x") 20-21 "x"
        [] 28-43 "1 ;\n  2 ;\n  3 ;"
          ExpressionStatement 28-31 "1 ;"
            1 28-29 "1"
          ExpressionStatement 34-37 "2 ;"
            2 34-35 "2"
          ExpressionStatement 40-43 "3 ;"
            3 40-41 "3"
*******************************************************************************/
