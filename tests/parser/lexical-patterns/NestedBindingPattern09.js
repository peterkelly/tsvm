let [ a , { b } = x , c ] = value ;

/*******************************************************************************
ast-module

Module 0-35 "let [ a , { b } = x , c ] = value ;"
  [] 0-35 "let [ a , { b } = x , c ] = value ;"
    Let 0-35 "let [ a , { b } = x , c ] = value ;"
      [] 4-33 "[ a , { b } = x , c ] = value"
        LexicalPatternBinding 4-33 "[ a , { b } = x , c ] = value"
          ArrayBindingPattern2 4-25 "[ a , { b } = x , c ]"
            [] 6-23 "a , { b } = x , c"
              BindingIdentifier("a") 6-7 "a"
              BindingPatternInit 10-19 "{ b } = x"
                ObjectBindingPattern 10-15 "{ b }"
                  [] 12-13 "b"
                    BindingIdentifier("b") 12-13 "b"
                IdentifierReference("x") 18-19 "x"
              BindingIdentifier("c") 22-23 "c"
          IdentifierReference("value") 28-33 "value"
*******************************************************************************/
