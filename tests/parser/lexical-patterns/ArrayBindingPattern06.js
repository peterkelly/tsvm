let [ a , b , c , , , , ... rest ] = value ;

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
              Elision(3)
              BindingRestElement
                BindingIdentifier("rest")
          IdentifierReference("value")
*******************************************************************************/
