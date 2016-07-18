let { p1 : [ a ] = x , p2 : [ b ] = y } = value ;

/*******************************************************************************
ast-module

Module 0-49 "let { p1 : [ a ] = x , p2 : [ b ] = y } = value ;"
  [] 0-49 "let { p1 : [ a ] = x , p2 : [ b ] = y } = value ;"
    Let 0-49 "let { p1 : [ a ] = x , p2 : [ b ] = y } = value ;"
      [] 4-47 "{ p1 : [ a ] = x , p2 : [ b ] = y } = value"
        LexicalPatternBinding 4-47 "{ p1 : [ a ] = x , p2 : [ b ] = y } = value"
          ObjectBindingPattern 4-39 "{ p1 : [ a ] = x , p2 : [ b ] = y }"
            [] 6-37 "p1 : [ a ] = x , p2 : [ b ] = y"
              BindingProperty 6-20 "p1 : [ a ] = x"
                Identifier("p1") 6-8 "p1"
                BindingPatternInit 11-20 "[ a ] = x"
                  ArrayBindingPattern 11-16 "[ a ]"
                    [] 13-14 "a"
                      BindingIdentifier("a") 13-14 "a"
                    null
                  IdentifierReference("x") 19-20 "x"
              BindingProperty 23-37 "p2 : [ b ] = y"
                Identifier("p2") 23-25 "p2"
                BindingPatternInit 28-37 "[ b ] = y"
                  ArrayBindingPattern 28-33 "[ b ]"
                    [] 30-31 "b"
                      BindingIdentifier("b") 30-31 "b"
                    null
                  IdentifierReference("y") 36-37 "y"
          IdentifierReference("value") 42-47 "value"
*******************************************************************************/
