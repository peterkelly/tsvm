switch ( x ) {
    case 1 :
        a ;
        b ;
    default :
        c ;
        d ;
    case 2 :
        e ;
        f ;
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
        DefaultClause
          []
            ExpressionStatement
              IdentifierReference("c")
            ExpressionStatement
              IdentifierReference("d")
        CaseClause
          2
          []
            ExpressionStatement
              IdentifierReference("e")
            ExpressionStatement
              IdentifierReference("f")
*******************************************************************************/
