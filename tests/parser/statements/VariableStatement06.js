var [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;

/*******************************************************************************
ast-module

Module 0-39 "var [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
  [] 0-39 "var [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
    Var 0-39 "var [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
      [] 4-37 "[ x ] = 1 , [ y ] = 2 , [ z ] = 3"
        VarPattern 4-13 "[ x ] = 1"
          ArrayBindingPattern 4-9 "[ x ]"
            [] 6-7 "x"
              BindingIdentifier("x") 6-7 "x"
          1 12-13 "1"
        VarPattern 16-25 "[ y ] = 2"
          ArrayBindingPattern 16-21 "[ y ]"
            [] 18-19 "y"
              BindingIdentifier("y") 18-19 "y"
          2 24-25 "2"
        VarPattern 28-37 "[ z ] = 3"
          ArrayBindingPattern 28-33 "[ z ]"
            [] 30-31 "z"
              BindingIdentifier("z") 30-31 "z"
          3 36-37 "3"
*******************************************************************************/
