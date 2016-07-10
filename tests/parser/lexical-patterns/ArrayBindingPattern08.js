let [ , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-28 "let [ , ... rest ] = value ;"
  [] 0-28 "let [ , ... rest ] = value ;"
    Let 0-28 "let [ , ... rest ] = value ;"
      [] 4-26 "[ , ... rest ] = value"
        LexicalPatternBinding 4-26 "[ , ... rest ] = value"
          ArrayBindingPattern 4-18 "[ , ... rest ]"
            [] 6-16 ", ... rest"
              Elision(1) 6-7 ","
              BindingRestElement 8-16 "... rest"
                BindingIdentifier("rest") 12-16 "rest"
          IdentifierReference("value") 21-26 "value"
*******************************************************************************/
