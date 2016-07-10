( {
  set test ( x ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-32 "( {\n  set test ( x ) {\n  }\n} ) ;"
  [] 0-32 "( {\n  set test ( x ) {\n  }\n} ) ;"
    ExpressionStatement 0-32 "( {\n  set test ( x ) {\n  }\n} ) ;"
      ObjectLiteral 2-28 "{\n  set test ( x ) {\n  }\n}"
        [] 6-26 "set test ( x ) {\n  }"
          Setter 6-26 "set test ( x ) {\n  }"
            Identifier("test") 10-14 "test"
            BindingIdentifier("x") 17-18 "x"
            [] 25-25 ""
*******************************************************************************/
