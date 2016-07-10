let [ a , b , c , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-40 "let [ a , b , c , , ... rest ] = value ;"
  [] 0-40 "let [ a , b , c , , ... rest ] = value ;"
    Let 0-40 "let [ a , b , c , , ... rest ] = value ;"
      [] 4-38 "[ a , b , c , , ... rest ] = value"
        LexicalPatternBinding 4-38 "[ a , b , c , , ... rest ] = value"
          ArrayBindingPattern 4-30 "[ a , b , c , , ... rest ]"
            [] 6-28 "a , b , c , , ... rest"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
              Elision(1) 18-19 ","
              BindingRestElement 20-28 "... rest"
                BindingIdentifier("rest") 24-28 "rest"
          IdentifierReference("value") 33-38 "value"
*******************************************************************************/
