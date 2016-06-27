let [ a , b , c , , ... rest ] = value ;

/*******************************************************************************
ast-module

Module
  []
    Let
      []
        LexicalPatternBinding
          ArrayBindingPattern
            []
              BindingIdentifier("a")
              BindingIdentifier("b")
              BindingIdentifier("c")
              Elision(1)
              BindingRestElement
                BindingIdentifier("rest")
          IdentifierReference("value")
*******************************************************************************/
