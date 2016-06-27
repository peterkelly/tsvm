switch ( x ) {
    case 1 : ;
    case 2 : ;
    default : ;
    case 3 : ;
    case 4 : ;
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
        DefaultClause
          []
            EmptyStatement
        CaseClause
          3
          []
            EmptyStatement
        CaseClause
          4
          []
            EmptyStatement
*******************************************************************************/
