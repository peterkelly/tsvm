let [ a , , b , c ] = value ;

/*******************************************************************************
ast-module

Module 0-29 "let [ a , , b , c ] = value ;"
  [] 0-29 "let [ a , , b , c ] = value ;"
    Let 0-29 "let [ a , , b , c ] = value ;"
      [] 4-27 "[ a , , b , c ] = value"
        LexicalPatternBinding 4-27 "[ a , , b , c ] = value"
          ArrayBindingPattern 4-19 "[ a , , b , c ]"
            [] 6-17 "a , , b , c"
              BindingIdentifier("a") 6-7 "a"
              Elision 10-11 ","
              BindingIdentifier("b") 12-13 "b"
              BindingIdentifier("c") 16-17 "c"
            null
          IdentifierReference("value") 22-27 "value"
*******************************************************************************/
