( {
  get test ( ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-30 "( {\n  get test ( ) {\n  }\n} ) ;"
  [] 0-30 "( {\n  get test ( ) {\n  }\n} ) ;"
    ExpressionStatement 0-30 "( {\n  get test ( ) {\n  }\n} ) ;"
      ObjectLiteral 2-26 "{\n  get test ( ) {\n  }\n}"
        [] 6-24 "get test ( ) {\n  }"
          Getter 6-24 "get test ( ) {\n  }"
            Identifier("test") 10-14 "test"
            [] 23-23 ""
*******************************************************************************/
