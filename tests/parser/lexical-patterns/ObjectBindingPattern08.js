let { one : a } = value ;

/*******************************************************************************
ast-module

Module 0-25 "let { one : a } = value ;"
  [] 0-25 "let { one : a } = value ;"
    Let 0-25 "let { one : a } = value ;"
      [] 4-23 "{ one : a } = value"
        LexicalPatternBinding 4-23 "{ one : a } = value"
          ObjectBindingPattern 4-15 "{ one : a }"
            [] 6-13 "one : a"
              BindingProperty 6-13 "one : a"
                Identifier("one") 6-9 "one"
                BindingIdentifier("a") 12-13 "a"
          IdentifierReference("value") 18-23 "value"
*******************************************************************************/
