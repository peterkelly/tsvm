let { one : a = 1 } = value ;

/*******************************************************************************
ast-module

Module 0-29 "let { one : a = 1 } = value ;"
  [] 0-29 "let { one : a = 1 } = value ;"
    Let 0-29 "let { one : a = 1 } = value ;"
      [] 4-27 "{ one : a = 1 } = value"
        LexicalPatternBinding 4-27 "{ one : a = 1 } = value"
          ObjectBindingPattern 4-19 "{ one : a = 1 }"
            [] 6-17 "one : a = 1"
              BindingProperty 6-17 "one : a = 1"
                Identifier("one") 6-9 "one"
                SingleNameBinding 12-17 "a = 1"
                  BindingIdentifier("a") 12-13 "a"
                  1 16-17 "1"
          IdentifierReference("value") 22-27 "value"
*******************************************************************************/
