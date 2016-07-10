( {
  set x ( value ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-33 "( {\n  set x ( value ) {\n  }\n} ) ;"
  [] 0-33 "( {\n  set x ( value ) {\n  }\n} ) ;"
    ExpressionStatement 0-33 "( {\n  set x ( value ) {\n  }\n} ) ;"
      ObjectLiteral 2-29 "{\n  set x ( value ) {\n  }\n}"
        [] 6-27 "set x ( value ) {\n  }"
          Setter 6-27 "set x ( value ) {\n  }"
            Identifier("x") 10-11 "x"
            BindingIdentifier("value") 14-19 "value"
            [] 26-26 ""
*******************************************************************************/
