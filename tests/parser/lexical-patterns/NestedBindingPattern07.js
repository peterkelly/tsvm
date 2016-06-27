let [ { a } = x ] = value ;

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
                IdentifierReference("x")
          IdentifierReference("value")
*******************************************************************************/
