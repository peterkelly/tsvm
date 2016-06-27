let [ a , { b } , c ] = value ;

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
              ObjectBindingPattern
                []
                  BindingIdentifier("b")
              BindingIdentifier("c")
          IdentifierReference("value")
*******************************************************************************/
