switch ( x ) {
    case 1 :
        a ;
        b ;
}

/*******************************************************************************
ast-module

Module
  []
    SwitchStatement
      IdentifierReference("x")
      []
        CaseClause
          1
          []
            ExpressionStatement
              IdentifierReference("a")
            ExpressionStatement
              IdentifierReference("b")
*******************************************************************************/
