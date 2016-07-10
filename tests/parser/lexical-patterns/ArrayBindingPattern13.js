let [ a , b , c , , ] = value ;

/*******************************************************************************
ast-module

Module 0-31 "let [ a , b , c , , ] = value ;"
  [] 0-31 "let [ a , b , c , , ] = value ;"
    Let 0-31 "let [ a , b , c , , ] = value ;"
      [] 4-29 "[ a , b , c , , ] = value"
        LexicalPatternBinding 4-29 "[ a , b , c , , ] = value"
          ArrayBindingPattern 4-21 "[ a , b , c , , ]"
            [] 6-19 "a , b , c , ,"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
              Elision(1) 18-19 ","
          IdentifierReference("value") 24-29 "value"
*******************************************************************************/
