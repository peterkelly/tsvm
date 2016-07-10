let { a , } = value ;

/*******************************************************************************
ast-module

Module 0-21 "let { a , } = value ;"
  [] 0-21 "let { a , } = value ;"
    Let 0-21 "let { a , } = value ;"
      [] 4-19 "{ a , } = value"
        LexicalPatternBinding 4-19 "{ a , } = value"
          ObjectBindingPattern 4-11 "{ a , }"
            [] 6-7 "a"
              BindingIdentifier("a") 6-7 "a"
          IdentifierReference("value") 14-19 "value"
*******************************************************************************/
