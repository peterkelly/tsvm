let [ , ... rest ] = value ;

/*******************************************************************************
ast-module

Module
  []
    Let
      []
        LexicalPatternBinding
          ArrayBindingPattern
            []
              Elision(1)
              BindingRestElement
                BindingIdentifier("rest")
          IdentifierReference("value")
*******************************************************************************/
