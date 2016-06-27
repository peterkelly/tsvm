let [ a , { b } = x , c ] = value ;

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
              BindingPatternInit
                ObjectBindingPattern
                  []
                    BindingIdentifier("b")
                IdentifierReference("x")
              BindingIdentifier("c")
          IdentifierReference("value")
*******************************************************************************/
