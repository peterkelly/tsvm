let [ , , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module
  []
    Let
      []
        LexicalPatternBinding
          ArrayBindingPattern
            []
              Elision(3)
              BindingRestElement
                BindingIdentifier("rest")
          IdentifierReference("value")
*******************************************************************************/
