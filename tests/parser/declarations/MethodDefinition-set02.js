( {
  set test ( x ) {
    1 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-40 "( {\n  set test ( x ) {\n    1 ;\n  }\n} ) ;"
  [] 0-40 "( {\n  set test ( x ) {\n    1 ;\n  }\n} ) ;"
    ExpressionStatement 0-40 "( {\n  set test ( x ) {\n    1 ;\n  }\n} ) ;"
      ObjectLiteral 2-36 "{\n  set test ( x ) {\n    1 ;\n  }\n}"
        [] 6-34 "set test ( x ) {\n    1 ;\n  }"
          Setter 6-34 "set test ( x ) {\n    1 ;\n  }"
            Identifier("test") 10-14 "test"
            BindingIdentifier("x") 17-18 "x"
            [] 27-30 "1 ;"
              ExpressionStatement 27-30 "1 ;"
                1 27-28 "1"
*******************************************************************************/
