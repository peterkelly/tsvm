let [ a , , b , c ] = value ;

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
              BindingElisionElement
                Elision(1)
                BindingIdentifier("b")
              BindingIdentifier("c")
          IdentifierReference("value")
*******************************************************************************/
