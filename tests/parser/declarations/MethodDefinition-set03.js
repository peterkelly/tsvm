( {
  set test ( x ) {
    1 ;
    2 ;
    3 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-56 "( {\n  set test ( x ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
  [] 0-56 "( {\n  set test ( x ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
    ExpressionStatement 0-56 "( {\n  set test ( x ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
      ObjectLiteral 2-52 "{\n  set test ( x ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n}"
        [] 6-50 "set test ( x ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
          Setter 6-50 "set test ( x ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
            Identifier("test") 10-14 "test"
            BindingIdentifier("x") 17-18 "x"
            [] 27-46 "1 ;\n    2 ;\n    3 ;"
              ExpressionStatement 27-30 "1 ;"
                1 27-28 "1"
              ExpressionStatement 35-38 "2 ;"
                2 35-36 "2"
              ExpressionStatement 43-46 "3 ;"
                3 43-44 "3"
*******************************************************************************/
