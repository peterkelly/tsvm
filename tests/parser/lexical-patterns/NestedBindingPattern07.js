let [ { a } = x ] = value ;

/*******************************************************************************
ast-module

Module 0-27 "let [ { a } = x ] = value ;"
  [] 0-27 "let [ { a } = x ] = value ;"
    Let 0-27 "let [ { a } = x ] = value ;"
      [] 4-25 "[ { a } = x ] = value"
        LexicalPatternBinding 4-25 "[ { a } = x ] = value"
          ArrayBindingPattern2 4-17 "[ { a } = x ]"
            [] 6-15 "{ a } = x"
              BindingPatternInit 6-15 "{ a } = x"
                ObjectBindingPattern 6-11 "{ a }"
                  [] 8-9 "a"
                    BindingIdentifier("a") 8-9 "a"
                IdentifierReference("x") 14-15 "x"
          IdentifierReference("value") 20-25 "value"
*******************************************************************************/
