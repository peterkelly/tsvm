let [ a , b , c , ] = value ;

/*******************************************************************************
ast-module

Module 0-29 "let [ a , b , c , ] = value ;"
  [] 0-29 "let [ a , b , c , ] = value ;"
    Let 0-29 "let [ a , b , c , ] = value ;"
      [] 4-27 "[ a , b , c , ] = value"
        LexicalPatternBinding 4-27 "[ a , b , c , ] = value"
          ArrayBindingPattern3 4-19 "[ a , b , c , ]"
            [] 6-15 "a , b , c"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
            null
            null
          IdentifierReference("value") 22-27 "value"
*******************************************************************************/
