let [ { a , b } = x ] = value ;

/*******************************************************************************
ast-module

Module 0-31 "let [ { a , b } = x ] = value ;"
  [] 0-31 "let [ { a , b } = x ] = value ;"
    Let 0-31 "let [ { a , b } = x ] = value ;"
      [] 4-29 "[ { a , b } = x ] = value"
        LexicalPatternBinding 4-29 "[ { a , b } = x ] = value"
          ArrayBindingPattern 4-21 "[ { a , b } = x ]"
            [] 6-19 "{ a , b } = x"
              BindingPatternInit 6-19 "{ a , b } = x"
                ObjectBindingPattern 6-15 "{ a , b }"
                  [] 8-13 "a , b"
                    BindingIdentifier("a") 8-9 "a"
                    BindingIdentifier("b") 12-13 "b"
                IdentifierReference("x") 18-19 "x"
          IdentifierReference("value") 24-29 "value"
*******************************************************************************/
