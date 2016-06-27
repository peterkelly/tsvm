let { p1 : [ a ] = x , p2 : [ b ] = y } = value ;

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
                Identifier("p1")
                BindingPatternInit
                  ArrayBindingPattern
                    []
                      BindingIdentifier("a")
                  IdentifierReference("x")
              BindingProperty
                Identifier("p2")
                BindingPatternInit
                  ArrayBindingPattern
                    []
                      BindingIdentifier("b")
                  IdentifierReference("y")
          IdentifierReference("value")
*******************************************************************************/
