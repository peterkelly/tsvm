( {
  test ( x , y , z , ... rest ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-47 "( {\n  test ( x , y , z , ... rest ) {\n  }\n} ) ;"
  [] 0-47 "( {\n  test ( x , y , z , ... rest ) {\n  }\n} ) ;"
    ExpressionStatement 0-47 "( {\n  test ( x , y , z , ... rest ) {\n  }\n} ) ;"
      ObjectLiteral 2-43 "{\n  test ( x , y , z , ... rest ) {\n  }\n}"
        [] 6-41 "test ( x , y , z , ... rest ) {\n  }"
          Method 6-41 "test ( x , y , z , ... rest ) {\n  }"
            Identifier("test") 6-10 "test"
            FormalParameters4 13-33 "x , y , z , ... rest"
              [] 13-22 "x , y , z"
                BindingIdentifier("x") 13-14 "x"
                BindingIdentifier("y") 17-18 "y"
                BindingIdentifier("z") 21-22 "z"
              BindingRestElement 25-33 "... rest"
                BindingIdentifier("rest") 29-33 "rest"
            [] 40-40 ""
*******************************************************************************/
