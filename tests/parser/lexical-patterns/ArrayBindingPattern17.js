let [ , , , ] = value ;

/*******************************************************************************
ast-module

Module 0-23 "let [ , , , ] = value ;"
  [] 0-23 "let [ , , , ] = value ;"
    Let 0-23 "let [ , , , ] = value ;"
      [] 4-21 "[ , , , ] = value"
        LexicalPatternBinding 4-21 "[ , , , ] = value"
          ArrayBindingPattern1 4-13 "[ , , , ]"
            Elision(3) 6-11 ", , ,"
            null
          IdentifierReference("value") 16-21 "value"
*******************************************************************************/
