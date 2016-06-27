let { p1 : [ a , b ] = x } = value ;

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
                BindingPatternInit
                  ArrayBindingPattern
                    []
                      BindingIdentifier("a")
                      BindingIdentifier("b")
                  IdentifierReference("x")
          IdentifierReference("value")
*******************************************************************************/
