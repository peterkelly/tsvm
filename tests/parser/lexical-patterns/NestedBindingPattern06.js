let { p1 : [ a ] , p2 : [ b ] } = value ;

/*******************************************************************************
ast-module

Module
  []
    Let
      []
        LexicalPatternBinding
          ObjectBindingPattern
            []
              BindingProperty
                Identifier("p1")
                ArrayBindingPattern
                  []
                    BindingIdentifier("a")
              BindingProperty
                Identifier("p2")
                ArrayBindingPattern
                  []
                    BindingIdentifier("b")
          IdentifierReference("value")
*******************************************************************************/
