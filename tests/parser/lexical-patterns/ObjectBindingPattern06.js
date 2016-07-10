let { a = 1 } = value ;

/*******************************************************************************
ast-module

Module 0-23 "let { a = 1 } = value ;"
  [] 0-23 "let { a = 1 } = value ;"
    Let 0-23 "let { a = 1 } = value ;"
      [] 4-21 "{ a = 1 } = value"
        LexicalPatternBinding 4-21 "{ a = 1 } = value"
          ObjectBindingPattern 4-13 "{ a = 1 }"
            [] 6-11 "a = 1"
              SingleNameBinding 6-11 "a = 1"
                BindingIdentifier("a") 6-7 "a"
                1 10-11 "1"
          IdentifierReference("value") 16-21 "value"
*******************************************************************************/
