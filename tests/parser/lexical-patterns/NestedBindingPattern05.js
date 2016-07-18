let { p1 : [ a , b ] } = value ;

/*******************************************************************************
ast-module

Module 0-32 "let { p1 : [ a , b ] } = value ;"
  [] 0-32 "let { p1 : [ a , b ] } = value ;"
    Let 0-32 "let { p1 : [ a , b ] } = value ;"
      [] 4-30 "{ p1 : [ a , b ] } = value"
        LexicalPatternBinding 4-30 "{ p1 : [ a , b ] } = value"
          ObjectBindingPattern 4-22 "{ p1 : [ a , b ] }"
            [] 6-20 "p1 : [ a , b ]"
              BindingProperty 6-20 "p1 : [ a , b ]"
                Identifier("p1") 6-8 "p1"
                ArrayBindingPattern 11-20 "[ a , b ]"
                  [] 13-18 "a , b"
                    BindingIdentifier("a") 13-14 "a"
                    BindingIdentifier("b") 17-18 "b"
                  null
          IdentifierReference("value") 25-30 "value"
*******************************************************************************/
