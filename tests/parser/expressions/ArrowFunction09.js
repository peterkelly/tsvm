( x , y , z , ... rest ) => { 1 ; 2 ; 3 ; } ;

/*******************************************************************************
ast-module

Module 0-45 "( x , y , z , ... rest ) => { 1 ; 2 ; 3 ; } ;"
  [] 0-45 "( x , y , z , ... rest ) => { 1 ; 2 ; 3 ; } ;"
    ExpressionStatement 0-45 "( x , y , z , ... rest ) => { 1 ; 2 ; 3 ; } ;"
      ArrowFunction 0-43 "( x , y , z , ... rest ) => { 1 ; 2 ; 3 ; }"
        FormalParameters4 2-22 "x , y , z , ... rest"
          [] 2-11 "x , y , z"
            BindingIdentifier("x") 2-3 "x"
            BindingIdentifier("y") 6-7 "y"
            BindingIdentifier("z") 10-11 "z"
          BindingRestElement 14-22 "... rest"
            BindingIdentifier("rest") 18-22 "rest"
        [] 30-41 "1 ; 2 ; 3 ;"
          ExpressionStatement 30-33 "1 ;"
            1 30-31 "1"
          ExpressionStatement 34-37 "2 ;"
            2 34-35 "2"
          ExpressionStatement 38-41 "3 ;"
            3 38-39 "3"
*******************************************************************************/
