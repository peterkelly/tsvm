let [ a , b , c , , , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-44 "let [ a , b , c , , , , ... rest ] = value ;"
  [] 0-44 "let [ a , b , c , , , , ... rest ] = value ;"
    Let 0-44 "let [ a , b , c , , , , ... rest ] = value ;"
      [] 4-42 "[ a , b , c , , , , ... rest ] = value"
        LexicalPatternBinding 4-42 "[ a , b , c , , , , ... rest ] = value"
          ArrayBindingPattern3 4-34 "[ a , b , c , , , , ... rest ]"
            [] 6-15 "a , b , c"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
            Elision(3) 18-23 ", , ,"
            BindingRestElement 24-32 "... rest"
              BindingIdentifier("rest") 28-32 "rest"
          IdentifierReference("value") 37-42 "value"
*******************************************************************************/
