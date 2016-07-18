let [ a , b , c , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-38 "let [ a , b , c , ... rest ] = value ;"
  [] 0-38 "let [ a , b , c , ... rest ] = value ;"
    Let 0-38 "let [ a , b , c , ... rest ] = value ;"
      [] 4-36 "[ a , b , c , ... rest ] = value"
        LexicalPatternBinding 4-36 "[ a , b , c , ... rest ] = value"
          ArrayBindingPattern 4-28 "[ a , b , c , ... rest ]"
            [] 6-15 "a , b , c"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
            BindingRestElement 18-26 "... rest"
              BindingIdentifier("rest") 22-26 "rest"
          IdentifierReference("value") 31-36 "value"
*******************************************************************************/
