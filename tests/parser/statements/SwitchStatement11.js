switch ( x ) {
    case 1 :
        a ;
        b ;
    case 2 :
        c ;
        d ;
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
        CaseClause
          2
          []
            ExpressionStatement
              IdentifierReference("c")
            ExpressionStatement
              IdentifierReference("d")
*******************************************************************************/
