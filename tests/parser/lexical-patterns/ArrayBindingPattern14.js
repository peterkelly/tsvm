let [ a , b , c , , , , ] = value ;

/*******************************************************************************
ast-module

Module 0-35 "let [ a , b , c , , , , ] = value ;"
  [] 0-35 "let [ a , b , c , , , , ] = value ;"
    Let 0-35 "let [ a , b , c , , , , ] = value ;"
      [] 4-33 "[ a , b , c , , , , ] = value"
        LexicalPatternBinding 4-33 "[ a , b , c , , , , ] = value"
          ArrayBindingPattern 4-25 "[ a , b , c , , , , ]"
            [] 6-23 "a , b , c , , , ,"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
              Elision(3) 18-23 ", , ,"
          IdentifierReference("value") 28-33 "value"
*******************************************************************************/
