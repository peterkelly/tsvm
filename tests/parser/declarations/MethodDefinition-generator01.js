( {
  * test ( ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-28 "( {\n  * test ( ) {\n  }\n} ) ;"
  [] 0-28 "( {\n  * test ( ) {\n  }\n} ) ;"
    ExpressionStatement 0-28 "( {\n  * test ( ) {\n  }\n} ) ;"
      ObjectLiteral 2-24 "{\n  * test ( ) {\n  }\n}"
        [] 6-22 "* test ( ) {\n  }"
          GeneratorMethod 6-22 "* test ( ) {\n  }"
            Identifier("test") 8-12 "test"
            FormalParameters1 15-15 ""
            [] 21-21 ""
*******************************************************************************/
