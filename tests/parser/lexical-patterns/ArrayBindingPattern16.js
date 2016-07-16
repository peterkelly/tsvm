let [ , ] = value ;

/*******************************************************************************
ast-module

Module 0-19 "let [ , ] = value ;"
  [] 0-19 "let [ , ] = value ;"
    Let 0-19 "let [ , ] = value ;"
      [] 4-17 "[ , ] = value"
        LexicalPatternBinding 4-17 "[ , ] = value"
          ArrayBindingPattern1 4-9 "[ , ]"
            Elision(1) 6-7 ","
            null
          IdentifierReference("value") 12-17 "value"
*******************************************************************************/
