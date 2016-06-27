( x , y , z , ... rest ) => { 1 ; 2 ; 3 ; } ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      ArrowFunction
        []
          BindingIdentifier("x")
          BindingIdentifier("y")
          BindingIdentifier("z")
          BindingRestElement
            BindingIdentifier("rest")
        []
          ExpressionStatement
            1
          ExpressionStatement
            2
          ExpressionStatement
            3
*******************************************************************************/
