( {
  * test ( x , y , z , ... rest ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-49 "( {\n  * test ( x , y , z , ... rest ) {\n  }\n} ) ;"
  [] 0-49 "( {\n  * test ( x , y , z , ... rest ) {\n  }\n} ) ;"
    ExpressionStatement 0-49 "( {\n  * test ( x , y , z , ... rest ) {\n  }\n} ) ;"
      ObjectLiteral 2-45 "{\n  * test ( x , y , z , ... rest ) {\n  }\n}"
        [] 6-43 "* test ( x , y , z , ... rest ) {\n  }"
          GeneratorMethod 6-43 "* test ( x , y , z , ... rest ) {\n  }"
            Identifier("test") 8-12 "test"
            [] 15-35 "x , y , z , ... rest"
              BindingIdentifier("x") 15-16 "x"
              BindingIdentifier("y") 19-20 "y"
              BindingIdentifier("z") 23-24 "z"
              BindingRestElement 27-35 "... rest"
                BindingIdentifier("rest") 31-35 "rest"
            [] 42-42 ""
*******************************************************************************/
