( {
  * test ( x ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-30 "( {\n  * test ( x ) {\n  }\n} ) ;"
  [] 0-30 "( {\n  * test ( x ) {\n  }\n} ) ;"
    ExpressionStatement 0-30 "( {\n  * test ( x ) {\n  }\n} ) ;"
      ObjectLiteral 2-26 "{\n  * test ( x ) {\n  }\n}"
        [] 6-24 "* test ( x ) {\n  }"
          GeneratorMethod 6-24 "* test ( x ) {\n  }"
            Identifier("test") 8-12 "test"
            [] 15-16 "x"
              BindingIdentifier("x") 15-16 "x"
            [] 23-23 ""
*******************************************************************************/
