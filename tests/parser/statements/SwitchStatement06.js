switch ( x ) {
    case 1 : ;
    case 2 : ;
    case 3 : ;
    default : ;
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
            EmptyStatement
        CaseClause
          2
          []
            EmptyStatement
        CaseClause
          3
          []
            EmptyStatement
        DefaultClause
          []
            EmptyStatement
*******************************************************************************/
