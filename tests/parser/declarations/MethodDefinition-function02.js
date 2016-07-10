( {
  test ( x ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-28 "( {\n  test ( x ) {\n  }\n} ) ;"
  [] 0-28 "( {\n  test ( x ) {\n  }\n} ) ;"
    ExpressionStatement 0-28 "( {\n  test ( x ) {\n  }\n} ) ;"
      ObjectLiteral 2-24 "{\n  test ( x ) {\n  }\n}"
        [] 6-22 "test ( x ) {\n  }"
          Method 6-22 "test ( x ) {\n  }"
            Identifier("test") 6-10 "test"
            [] 13-14 "x"
              BindingIdentifier("x") 13-14 "x"
            [] 21-21 ""
*******************************************************************************/
