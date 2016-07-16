let [ { a } ] = value ;

/*******************************************************************************
ast-module

Module 0-23 "let [ { a } ] = value ;"
  [] 0-23 "let [ { a } ] = value ;"
    Let 0-23 "let [ { a } ] = value ;"
      [] 4-21 "[ { a } ] = value"
        LexicalPatternBinding 4-21 "[ { a } ] = value"
          ArrayBindingPattern2 4-13 "[ { a } ]"
            [] 6-11 "{ a }"
              ObjectBindingPattern 6-11 "{ a }"
                [] 8-9 "a"
                  BindingIdentifier("a") 8-9 "a"
          IdentifierReference("value") 16-21 "value"
*******************************************************************************/
