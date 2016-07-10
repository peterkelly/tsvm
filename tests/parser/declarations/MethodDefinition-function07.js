( {
  test ( ) {
    1 ;
    2 ;
    3 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-50 "( {\n  test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
  [] 0-50 "( {\n  test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
    ExpressionStatement 0-50 "( {\n  test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
      ObjectLiteral 2-46 "{\n  test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n}"
        [] 6-44 "test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
          Method 6-44 "test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
            Identifier("test") 6-10 "test"
            [] 13-13 ""
            [] 21-40 "1 ;\n    2 ;\n    3 ;"
              ExpressionStatement 21-24 "1 ;"
                1 21-22 "1"
              ExpressionStatement 29-32 "2 ;"
                2 29-30 "2"
              ExpressionStatement 37-40 "3 ;"
                3 37-38 "3"
*******************************************************************************/
