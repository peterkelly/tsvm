let { one : a = 1 , two : b = 2 , three : c = 3 } = value ;

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
              BindingProperty
                Identifier("two")
                SingleNameBinding
                  BindingIdentifier("b")
                  2
              BindingProperty
                Identifier("three")
                SingleNameBinding
                  BindingIdentifier("c")
                  3
          IdentifierReference("value")
*******************************************************************************/
