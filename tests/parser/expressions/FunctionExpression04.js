( function ( x , y , z , ...rest ) {
} ) ;

/*******************************************************************************
ast-module

Module 0-42 "( function ( x , y , z , ...rest ) {\n} ) ;"
  [] 0-42 "( function ( x , y , z , ...rest ) {\n} ) ;"
    ExpressionStatement 0-42 "( function ( x , y , z , ...rest ) {\n} ) ;"
      FunctionExpression 2-38 "function ( x , y , z , ...rest ) {\n}"
        null
        [] 13-32 "x , y , z , ...rest"
          BindingIdentifier("x") 13-14 "x"
          BindingIdentifier("y") 17-18 "y"
          BindingIdentifier("z") 21-22 "z"
          BindingRestElement 25-32 "...rest"
            BindingIdentifier("rest") 28-32 "rest"
        [] 37-37 ""
*******************************************************************************/
