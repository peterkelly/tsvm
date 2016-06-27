switch ( x ) {
    default :
        a ;
        b ;
    case 1 :
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
        DefaultClause
          []
            ExpressionStatement
              IdentifierReference("a")
            ExpressionStatement
              IdentifierReference("b")
        CaseClause
          1
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
