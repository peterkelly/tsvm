let [ , , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module 0-32 "let [ , , , ... rest ] = value ;"
  [] 0-32 "let [ , , , ... rest ] = value ;"
    Let 0-32 "let [ , , , ... rest ] = value ;"
      [] 4-30 "[ , , , ... rest ] = value"
        LexicalPatternBinding 4-30 "[ , , , ... rest ] = value"
          ArrayBindingPattern1 4-22 "[ , , , ... rest ]"
            Elision(3) 6-11 ", , ,"
            BindingRestElement 12-20 "... rest"
              BindingIdentifier("rest") 16-20 "rest"
          IdentifierReference("value") 25-30 "value"
*******************************************************************************/
