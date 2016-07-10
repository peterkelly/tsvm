let { p1 : [ a ] = x } = value ;

/*******************************************************************************
ast-module

Module 0-32 "let { p1 : [ a ] = x } = value ;"
  [] 0-32 "let { p1 : [ a ] = x } = value ;"
    Let 0-32 "let { p1 : [ a ] = x } = value ;"
      [] 4-30 "{ p1 : [ a ] = x } = value"
        LexicalPatternBinding 4-30 "{ p1 : [ a ] = x } = value"
          ObjectBindingPattern 4-22 "{ p1 : [ a ] = x }"
            [] 6-20 "p1 : [ a ] = x"
              BindingProperty 6-20 "p1 : [ a ] = x"
                Identifier("p1") 6-8 "p1"
                BindingPatternInit 11-20 "[ a ] = x"
                  ArrayBindingPattern 11-16 "[ a ]"
                    [] 13-14 "a"
                      BindingIdentifier("a") 13-14 "a"
                  IdentifierReference("x") 19-20 "x"
          IdentifierReference("value") 25-30 "value"
*******************************************************************************/
