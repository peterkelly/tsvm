let { p1 : [ a , b ] = x } = value ;

/*******************************************************************************
ast-module

Module 0-36 "let { p1 : [ a , b ] = x } = value ;"
  [] 0-36 "let { p1 : [ a , b ] = x } = value ;"
    Let 0-36 "let { p1 : [ a , b ] = x } = value ;"
      [] 4-34 "{ p1 : [ a , b ] = x } = value"
        LexicalPatternBinding 4-34 "{ p1 : [ a , b ] = x } = value"
          ObjectBindingPattern 4-26 "{ p1 : [ a , b ] = x }"
            [] 6-24 "p1 : [ a , b ] = x"
              BindingProperty 6-24 "p1 : [ a , b ] = x"
                Identifier("p1") 6-8 "p1"
                BindingPatternInit 11-24 "[ a , b ] = x"
                  ArrayBindingPattern 11-20 "[ a , b ]"
                    [] 13-18 "a , b"
                      BindingIdentifier("a") 13-14 "a"
                      BindingIdentifier("b") 17-18 "b"
                    null
                  IdentifierReference("x") 23-24 "x"
          IdentifierReference("value") 29-34 "value"
*******************************************************************************/
