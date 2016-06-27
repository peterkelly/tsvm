let { one : a = 1 } = value ;

/*******************************************************************************
ast-module

Module
  []
    Let
      []
        LexicalPatternBinding
          ObjectBindingPattern
            []
              BindingProperty
                Identifier("one")
                SingleNameBinding
                  BindingIdentifier("a")
                  1
          IdentifierReference("value")
*******************************************************************************/
