( {
  test ( ) {
    1 ;
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-34 "( {\n  test ( ) {\n    1 ;\n  }\n} ) ;"
  [] 0-34 "( {\n  test ( ) {\n    1 ;\n  }\n} ) ;"
    ExpressionStatement 0-34 "( {\n  test ( ) {\n    1 ;\n  }\n} ) ;"
      ObjectLiteral 2-30 "{\n  test ( ) {\n    1 ;\n  }\n}"
        [] 6-28 "test ( ) {\n    1 ;\n  }"
          Method 6-28 "test ( ) {\n    1 ;\n  }"
            Identifier("test") 6-10 "test"
            FormalParameters1 13-13 ""
            [] 21-24 "1 ;"
              ExpressionStatement 21-24 "1 ;"
                1 21-22 "1"
*******************************************************************************/
