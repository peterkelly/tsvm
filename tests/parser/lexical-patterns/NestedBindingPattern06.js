let { p1 : [ a ] , p2 : [ b ] } = value ;

/*******************************************************************************
ast-module

Module 0-41 "let { p1 : [ a ] , p2 : [ b ] } = value ;"
  [] 0-41 "let { p1 : [ a ] , p2 : [ b ] } = value ;"
    Let 0-41 "let { p1 : [ a ] , p2 : [ b ] } = value ;"
      [] 4-39 "{ p1 : [ a ] , p2 : [ b ] } = value"
        LexicalPatternBinding 4-39 "{ p1 : [ a ] , p2 : [ b ] } = value"
          ObjectBindingPattern 4-31 "{ p1 : [ a ] , p2 : [ b ] }"
            [] 6-29 "p1 : [ a ] , p2 : [ b ]"
              BindingProperty 6-16 "p1 : [ a ]"
                Identifier("p1") 6-8 "p1"
                ArrayBindingPattern2 11-16 "[ a ]"
                  [] 13-14 "a"
                    BindingIdentifier("a") 13-14 "a"
              BindingProperty 19-29 "p2 : [ b ]"
                Identifier("p2") 19-21 "p2"
                ArrayBindingPattern2 24-29 "[ b ]"
                  [] 26-27 "b"
                    BindingIdentifier("b") 26-27 "b"
          IdentifierReference("value") 34-39 "value"
*******************************************************************************/
