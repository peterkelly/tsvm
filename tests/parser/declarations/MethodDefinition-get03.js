( {
  get test ( ) {
    1 ;
    2 ;
    3 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-54 "( {\n  get test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
  [] 0-54 "( {\n  get test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
    ExpressionStatement 0-54 "( {\n  get test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
      ObjectLiteral 2-50 "{\n  get test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n}"
        [] 6-48 "get test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
          Getter 6-48 "get test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
            Identifier("test") 10-14 "test"
            [] 25-44 "1 ;\n    2 ;\n    3 ;"
              ExpressionStatement 25-28 "1 ;"
                1 25-26 "1"
              ExpressionStatement 33-36 "2 ;"
                2 33-34 "2"
              ExpressionStatement 41-44 "3 ;"
                3 41-42 "3"
*******************************************************************************/
