( {
  get test ( ) {
    1 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-38 "( {\n  get test ( ) {\n    1 ;\n  }\n} ) ;"
  [] 0-38 "( {\n  get test ( ) {\n    1 ;\n  }\n} ) ;"
    ExpressionStatement 0-38 "( {\n  get test ( ) {\n    1 ;\n  }\n} ) ;"
      ObjectLiteral 2-34 "{\n  get test ( ) {\n    1 ;\n  }\n}"
        [] 6-32 "get test ( ) {\n    1 ;\n  }"
          Getter 6-32 "get test ( ) {\n    1 ;\n  }"
            Identifier("test") 10-14 "test"
            [] 25-28 "1 ;"
              ExpressionStatement 25-28 "1 ;"
                1 25-26 "1"
*******************************************************************************/
