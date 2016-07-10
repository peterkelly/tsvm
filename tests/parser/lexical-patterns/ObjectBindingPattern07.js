let { a = 1 , b = 2 , c = 3 } = value ;

/*******************************************************************************
ast-module

Module 0-39 "let { a = 1 , b = 2 , c = 3 } = value ;"
  [] 0-39 "let { a = 1 , b = 2 , c = 3 } = value ;"
    Let 0-39 "let { a = 1 , b = 2 , c = 3 } = value ;"
      [] 4-37 "{ a = 1 , b = 2 , c = 3 } = value"
        LexicalPatternBinding 4-37 "{ a = 1 , b = 2 , c = 3 } = value"
          ObjectBindingPattern 4-29 "{ a = 1 , b = 2 , c = 3 }"
            [] 6-27 "a = 1 , b = 2 , c = 3"
              SingleNameBinding 6-11 "a = 1"
                BindingIdentifier("a") 6-7 "a"
                1 10-11 "1"
              SingleNameBinding 14-19 "b = 2"
                BindingIdentifier("b") 14-15 "b"
                2 18-19 "2"
              SingleNameBinding 22-27 "c = 3"
                BindingIdentifier("c") 22-23 "c"
                3 26-27 "3"
          IdentifierReference("value") 32-37 "value"
*******************************************************************************/
