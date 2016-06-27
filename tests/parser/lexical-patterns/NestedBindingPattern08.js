let [ { a , b } = x ] = value ;

/*******************************************************************************
ast-module

Module
  []
    Let
      []
        LexicalPatternBinding
          ArrayBindingPattern
            []
              BindingPatternInit
                ObjectBindingPattern
                  []
                    BindingIdentifier("a")
                    BindingIdentifier("b")
                IdentifierReference("x")
          IdentifierReference("value")
*******************************************************************************/
