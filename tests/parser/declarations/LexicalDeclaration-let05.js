let [ x ] = 1 ;

/*******************************************************************************
ast-module

Module 0-15 "let [ x ] = 1 ;"
  [] 0-15 "let [ x ] = 1 ;"
    Let 0-15 "let [ x ] = 1 ;"
      [] 4-13 "[ x ] = 1"
        LexicalPatternBinding 4-13 "[ x ] = 1"
          ArrayBindingPattern 4-9 "[ x ]"
            [] 6-7 "x"
              BindingIdentifier("x") 6-7 "x"
            null
          1 12-13 "1"
*******************************************************************************/
