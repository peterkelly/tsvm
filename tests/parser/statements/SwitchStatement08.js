switch ( x ) {
    case 1 : ;
    default : ;
    case 2 : ;
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
        DefaultClause
          []
            EmptyStatement
        CaseClause
          2
          []
            EmptyStatement
*******************************************************************************/
