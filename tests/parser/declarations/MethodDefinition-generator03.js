( {
  * test ( x , y , z ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-38 "( {\n  * test ( x , y , z ) {\n  }\n} ) ;"
  [] 0-38 "( {\n  * test ( x , y , z ) {\n  }\n} ) ;"
    ExpressionStatement 0-38 "( {\n  * test ( x , y , z ) {\n  }\n} ) ;"
      ObjectLiteral 2-34 "{\n  * test ( x , y , z ) {\n  }\n}"
        [] 6-32 "* test ( x , y , z ) {\n  }"
          GeneratorMethod 6-32 "* test ( x , y , z ) {\n  }"
            Identifier("test") 8-12 "test"
            FormalParameters3 15-24 "x , y , z"
              [] 15-24 "x , y , z"
                BindingIdentifier("x") 15-16 "x"
                BindingIdentifier("y") 19-20 "y"
                BindingIdentifier("z") 23-24 "z"
            [] 31-31 ""
*******************************************************************************/
