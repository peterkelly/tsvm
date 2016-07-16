( {
  test ( ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-26 "( {\n  test ( ) {\n  }\n} ) ;"
  [] 0-26 "( {\n  test ( ) {\n  }\n} ) ;"
    ExpressionStatement 0-26 "( {\n  test ( ) {\n  }\n} ) ;"
      ObjectLiteral 2-22 "{\n  test ( ) {\n  }\n}"
        [] 6-20 "test ( ) {\n  }"
          Method 6-20 "test ( ) {\n  }"
            Identifier("test") 6-10 "test"
            FormalParameters1 13-13 ""
            [] 19-19 ""
*******************************************************************************/
