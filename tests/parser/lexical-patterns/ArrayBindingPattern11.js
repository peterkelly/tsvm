let [ a , , , , b , c ] = value ;

/*******************************************************************************
ast-module

Module 0-33 "let [ a , , , , b , c ] = value ;"
  [] 0-33 "let [ a , , , , b , c ] = value ;"
    Let 0-33 "let [ a , , , , b , c ] = value ;"
      [] 4-31 "[ a , , , , b , c ] = value"
        LexicalPatternBinding 4-31 "[ a , , , , b , c ] = value"
          ArrayBindingPattern 4-23 "[ a , , , , b , c ]"
            [] 6-21 "a , , , , b , c"
              BindingIdentifier("a") 6-7 "a"
              Elision 10-11 ","
              Elision 12-13 ","
              Elision 14-15 ","
              BindingIdentifier("b") 16-17 "b"
              BindingIdentifier("c") 20-21 "c"
            null
          IdentifierReference("value") 26-31 "value"
*******************************************************************************/
