let { one : a , two : b , three : c } = value ;

/*******************************************************************************
ast-module

Module 0-47 "let { one : a , two : b , three : c } = value ;"
  [] 0-47 "let { one : a , two : b , three : c } = value ;"
    Let 0-47 "let { one : a , two : b , three : c } = value ;"
      [] 4-45 "{ one : a , two : b , three : c } = value"
        LexicalPatternBinding 4-45 "{ one : a , two : b , three : c } = value"
          ObjectBindingPattern 4-37 "{ one : a , two : b , three : c }"
            [] 6-35 "one : a , two : b , three : c"
              BindingProperty 6-13 "one : a"
                Identifier("one") 6-9 "one"
                BindingIdentifier("a") 12-13 "a"
              BindingProperty 16-23 "two : b"
                Identifier("two") 16-19 "two"
                BindingIdentifier("b") 22-23 "b"
              BindingProperty 26-35 "three : c"
                Identifier("three") 26-31 "three"
                BindingIdentifier("c") 34-35 "c"
          IdentifierReference("value") 40-45 "value"
*******************************************************************************/
