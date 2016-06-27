for ( let i = 0 ; i < 10 ; i = i + 1 ) {
    total = total + i ;
}

/*******************************************************************************
ast-module

Module
  []
    ForC
      Let
        []
          LexicalIdentifierBinding
            BindingIdentifier("i")
            0
      LessThan
        IdentifierReference("i")
        10
      Assign
        IdentifierReference("i")
        Add
          IdentifierReference("i")
          1
      Block
        []
          ExpressionStatement
            Assign
              IdentifierReference("total")
              Add
                IdentifierReference("total")
                IdentifierReference("i")
*******************************************************************************/
