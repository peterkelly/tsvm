let [ a , { b } , c ] = value ;

/*******************************************************************************
ast-module

Module 0-31 "let [ a , { b } , c ] = value ;"
  [] 0-31 "let [ a , { b } , c ] = value ;"
    Let 0-31 "let [ a , { b } , c ] = value ;"
      [] 4-29 "[ a , { b } , c ] = value"
        LexicalPatternBinding 4-29 "[ a , { b } , c ] = value"
          ArrayBindingPattern2 4-21 "[ a , { b } , c ]"
            [] 6-19 "a , { b } , c"
              BindingIdentifier("a") 6-7 "a"
              ObjectBindingPattern 10-15 "{ b }"
                [] 12-13 "b"
                  BindingIdentifier("b") 12-13 "b"
              BindingIdentifier("c") 18-19 "c"
          IdentifierReference("value") 24-29 "value"
*******************************************************************************/
