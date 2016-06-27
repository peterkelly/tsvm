let { p1 : [ a , b ] } = value ;

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
                    BindingIdentifier("b")
          IdentifierReference("value")
*******************************************************************************/
