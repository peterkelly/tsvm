let [ , , , ] = value ;

/*******************************************************************************
ast-module

Module 0-23 "let [ , , , ] = value ;"
  [] 0-23 "let [ , , , ] = value ;"
    Let 0-23 "let [ , , , ] = value ;"
      [] 4-21 "[ , , , ] = value"
        LexicalPatternBinding 4-21 "[ , , , ] = value"
          ArrayBindingPattern 4-13 "[ , , , ]"
            [] 6-11 ", , ,"
              Elision(3) 6-11 ", , ,"
          IdentifierReference("value") 16-21 "value"
*******************************************************************************/
