let [ a , , , , b , c ] = value ;

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
                Elision(3)
                BindingIdentifier("b")
              BindingIdentifier("c")
          IdentifierReference("value")
*******************************************************************************/
