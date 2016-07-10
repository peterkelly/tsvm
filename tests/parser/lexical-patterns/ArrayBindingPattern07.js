let [ ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-26 "let [ ... rest ] = value ;"
  [] 0-26 "let [ ... rest ] = value ;"
    Let 0-26 "let [ ... rest ] = value ;"
      [] 4-24 "[ ... rest ] = value"
        LexicalPatternBinding 4-24 "[ ... rest ] = value"
          ArrayBindingPattern 4-16 "[ ... rest ]"
            [] 6-14 "... rest"
              BindingRestElement 6-14 "... rest"
                BindingIdentifier("rest") 10-14 "rest"
          IdentifierReference("value") 19-24 "value"
*******************************************************************************/
