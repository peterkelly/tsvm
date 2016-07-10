let { a , b , c } = value ;

/*******************************************************************************
ast-module

Module 0-27 "let { a , b , c } = value ;"
  [] 0-27 "let { a , b , c } = value ;"
    Let 0-27 "let { a , b , c } = value ;"
      [] 4-25 "{ a , b , c } = value"
        LexicalPatternBinding 4-25 "{ a , b , c } = value"
          ObjectBindingPattern 4-17 "{ a , b , c }"
            [] 6-15 "a , b , c"
              BindingIdentifier("a") 6-7 "a"
              BindingIdentifier("b") 10-11 "b"
              BindingIdentifier("c") 14-15 "c"
          IdentifierReference("value") 20-25 "value"
*******************************************************************************/
