const [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;

/*******************************************************************************
ast-module

Module 0-41 "const [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
  [] 0-41 "const [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
    Const 0-41 "const [ x ] = 1 , [ y ] = 2 , [ z ] = 3 ;"
      [] 6-39 "[ x ] = 1 , [ y ] = 2 , [ z ] = 3"
        LexicalPatternBinding 6-15 "[ x ] = 1"
          ArrayBindingPattern 6-11 "[ x ]"
            [] 8-9 "x"
              BindingIdentifier("x") 8-9 "x"
            null
          1 14-15 "1"
        LexicalPatternBinding 18-27 "[ y ] = 2"
          ArrayBindingPattern 18-23 "[ y ]"
            [] 20-21 "y"
              BindingIdentifier("y") 20-21 "y"
            null
          2 26-27 "2"
        LexicalPatternBinding 30-39 "[ z ] = 3"
          ArrayBindingPattern 30-35 "[ z ]"
            [] 32-33 "z"
              BindingIdentifier("z") 32-33 "z"
            null
          3 38-39 "3"
*******************************************************************************/
