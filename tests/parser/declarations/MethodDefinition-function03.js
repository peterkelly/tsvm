( {
  test ( x , y , z ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-36 "( {\n  test ( x , y , z ) {\n  }\n} ) ;"
  [] 0-36 "( {\n  test ( x , y , z ) {\n  }\n} ) ;"
    ExpressionStatement 0-36 "( {\n  test ( x , y , z ) {\n  }\n} ) ;"
      ObjectLiteral 2-32 "{\n  test ( x , y , z ) {\n  }\n}"
        [] 6-30 "test ( x , y , z ) {\n  }"
          Method 6-30 "test ( x , y , z ) {\n  }"
            Identifier("test") 6-10 "test"
            FormalParameters3 13-22 "x , y , z"
              [] 13-22 "x , y , z"
                BindingIdentifier("x") 13-14 "x"
                BindingIdentifier("y") 17-18 "y"
                BindingIdentifier("z") 21-22 "z"
            [] 29-29 ""
*******************************************************************************/
