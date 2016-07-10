let { a } = value ;

/*******************************************************************************
ast-module

Module 0-19 "let { a } = value ;"
  [] 0-19 "let { a } = value ;"
    Let 0-19 "let { a } = value ;"
      [] 4-17 "{ a } = value"
        LexicalPatternBinding 4-17 "{ a } = value"
          ObjectBindingPattern 4-9 "{ a }"
            [] 6-7 "a"
              BindingIdentifier("a") 6-7 "a"
          IdentifierReference("value") 12-17 "value"
*******************************************************************************/
