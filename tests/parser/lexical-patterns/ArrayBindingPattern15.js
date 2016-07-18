let [ ] = value ;

/*******************************************************************************
ast-module

Module 0-17 "let [ ] = value ;"
  [] 0-17 "let [ ] = value ;"
    Let 0-17 "let [ ] = value ;"
      [] 4-15 "[ ] = value"
        LexicalPatternBinding 4-15 "[ ] = value"
          ArrayBindingPattern 4-7 "[ ]"
            [] 6-6 ""
            null
          IdentifierReference("value") 10-15 "value"
*******************************************************************************/
