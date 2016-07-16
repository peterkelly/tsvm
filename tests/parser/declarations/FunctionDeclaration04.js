function test ( x , y , z , ...rest ) {
}

/*******************************************************************************
ast-module

Module 0-41 "function test ( x , y , z , ...rest ) {\n}"
  [] 0-41 "function test ( x , y , z , ...rest ) {\n}"
    FunctionDeclaration 0-41 "function test ( x , y , z , ...rest ) {\n}"
      BindingIdentifier("test") 9-13 "test"
      [] 16-35 "x , y , z , ...rest"
        BindingIdentifier("x") 16-17 "x"
        BindingIdentifier("y") 20-21 "y"
        BindingIdentifier("z") 24-25 "z"
        BindingRestElement 28-35 "...rest"
          BindingIdentifier("rest") 31-35 "rest"
      [] 40-40 ""
*******************************************************************************/
