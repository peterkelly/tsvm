let { p1 : [ a ] } = value ;

/*******************************************************************************
ast-module

Module 0-28 "let { p1 : [ a ] } = value ;"
  [] 0-28 "let { p1 : [ a ] } = value ;"
    Let 0-28 "let { p1 : [ a ] } = value ;"
      [] 4-26 "{ p1 : [ a ] } = value"
        LexicalPatternBinding 4-26 "{ p1 : [ a ] } = value"
          ObjectBindingPattern 4-18 "{ p1 : [ a ] }"
            [] 6-16 "p1 : [ a ]"
              BindingProperty 6-16 "p1 : [ a ]"
                Identifier("p1") 6-8 "p1"
                ArrayBindingPattern2 11-16 "[ a ]"
                  [] 13-14 "a"
                    BindingIdentifier("a") 13-14 "a"
          IdentifierReference("value") 21-26 "value"
*******************************************************************************/
