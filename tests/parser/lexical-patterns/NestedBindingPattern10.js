let { p1 : [ a ] = x } = value ;

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
                  IdentifierReference("x")
          IdentifierReference("value")
*******************************************************************************/
