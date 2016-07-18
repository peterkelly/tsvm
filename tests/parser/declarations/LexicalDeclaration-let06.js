let [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;

/*******************************************************************************
ast-module

Module 0-39 "let [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
  [] 0-39 "let [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
    Let 0-39 "let [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
      [] 4-37 "[ x ] = 1 , [ y ] = 2 , [ z ] = 3"
        LexicalPatternBinding 4-13 "[ x ] = 1"
          ArrayBindingPattern 4-9 "[ x ]"
            [] 6-7 "x"
              BindingIdentifier("x") 6-7 "x"
            null
          1 12-13 "1"
        LexicalPatternBinding 16-25 "[ y ] = 2"
          ArrayBindingPattern 16-21 "[ y ]"
            [] 18-19 "y"
              BindingIdentifier("y") 18-19 "y"
            null
          2 24-25 "2"
        LexicalPatternBinding 28-37 "[ z ] = 3"
          ArrayBindingPattern 28-33 "[ z ]"
            [] 30-31 "z"
              BindingIdentifier("z") 30-31 "z"
            null
          3 36-37 "3"
*******************************************************************************/
