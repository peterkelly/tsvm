( {
  * test ( ) {
    1 ;
    2 ;
    3 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-52 "( {\n  * test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
  [] 0-52 "( {\n  * test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
    ExpressionStatement 0-52 "( {\n  * test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n} ) ;"
      ObjectLiteral 2-48 "{\n  * test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }\n}"
        [] 6-46 "* test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
          GeneratorMethod 6-46 "* test ( ) {\n    1 ;\n    2 ;\n    3 ;\n  }"
            Identifier("test") 8-12 "test"
            FormalParameters1 15-15 ""
            [] 23-42 "1 ;\n    2 ;\n    3 ;"
              ExpressionStatement 23-26 "1 ;"
                1 23-24 "1"
              ExpressionStatement 31-34 "2 ;"
                2 31-32 "2"
              ExpressionStatement 39-42 "3 ;"
                3 39-40 "3"
*******************************************************************************/
