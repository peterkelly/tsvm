let [ { a , b } ] = value ;

/*******************************************************************************
ast-module

Module 0-27 "let [ { a , b } ] = value ;"
  [] 0-27 "let [ { a , b } ] = value ;"
    Let 0-27 "let [ { a , b } ] = value ;"
      [] 4-25 "[ { a , b } ] = value"
        LexicalPatternBinding 4-25 "[ { a , b } ] = value"
          ArrayBindingPattern 4-17 "[ { a , b } ]"
            [] 6-15 "{ a , b }"
              ObjectBindingPattern 6-15 "{ a , b }"
                [] 8-13 "a , b"
                  BindingIdentifier("a") 8-9 "a"
                  BindingIdentifier("b") 12-13 "b"
            null
          IdentifierReference("value") 20-25 "value"
*******************************************************************************/
