( {
  * foo ( ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-27 "( {\n  * foo ( ) {\n  }\n} ) ;"
  [] 0-27 "( {\n  * foo ( ) {\n  }\n} ) ;"
    ExpressionStatement 0-27 "( {\n  * foo ( ) {\n  }\n} ) ;"
      ObjectLiteral 2-23 "{\n  * foo ( ) {\n  }\n}"
        [] 6-21 "* foo ( ) {\n  }"
          GeneratorMethod 6-21 "* foo ( ) {\n  }"
            Identifier("foo") 8-11 "foo"
            FormalParameters1 14-14 ""
            [] 20-20 ""
*******************************************************************************/
