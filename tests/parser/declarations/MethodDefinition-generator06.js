( {
  * test ( ) {
    1 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-36 "( {\n  * test ( ) {\n    1 ;\n  }\n} ) ;"
  [] 0-36 "( {\n  * test ( ) {\n    1 ;\n  }\n} ) ;"
    ExpressionStatement 0-36 "( {\n  * test ( ) {\n    1 ;\n  }\n} ) ;"
      ObjectLiteral 2-32 "{\n  * test ( ) {\n    1 ;\n  }\n}"
        [] 6-30 "* test ( ) {\n    1 ;\n  }"
          GeneratorMethod 6-30 "* test ( ) {\n    1 ;\n  }"
            Identifier("test") 8-12 "test"
            FormalParameters1 15-15 ""
            [] 23-26 "1 ;"
              ExpressionStatement 23-26 "1 ;"
                1 23-24 "1"
*******************************************************************************/
