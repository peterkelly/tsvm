let { one : a = 1 , two : b = 2 , three : c = 3 } = value ;

/*******************************************************************************
ast-module

Module 0-59 "let { one : a = 1 , two : b = 2 , three : c = 3 } = value ;"
  [] 0-59 "let { one : a = 1 , two : b = 2 , three : c = 3 } = value ;"
    Let 0-59 "let { one : a = 1 , two : b = 2 , three : c = 3 } = value ;"
      [] 4-57 "{ one : a = 1 , two : b = 2 , three : c = 3 } = value"
        LexicalPatternBinding 4-57 "{ one : a = 1 , two : b = 2 , three : c = 3 } = value"
          ObjectBindingPattern 4-49 "{ one : a = 1 , two : b = 2 , three : c = 3 }"
            [] 6-47 "one : a = 1 , two : b = 2 , three : c = 3"
              BindingProperty 6-17 "one : a = 1"
                Identifier("one") 6-9 "one"
                SingleNameBinding 12-17 "a = 1"
                  BindingIdentifier("a") 12-13 "a"
                  1 16-17 "1"
              BindingProperty 20-31 "two : b = 2"
                Identifier("two") 20-23 "two"
                SingleNameBinding 26-31 "b = 2"
                  BindingIdentifier("b") 26-27 "b"
                  2 30-31 "2"
              BindingProperty 34-47 "three : c = 3"
                Identifier("three") 34-39 "three"
                SingleNameBinding 42-47 "c = 3"
                  BindingIdentifier("c") 42-43 "c"
                  3 46-47 "3"
          IdentifierReference("value") 52-57 "value"
*******************************************************************************/
