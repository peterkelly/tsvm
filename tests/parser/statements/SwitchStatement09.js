switch ( x ) {
    default : ;
    case 1 : ;
    case 2 : ;
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
            EmptyStatement
        CaseClause
          1
          []
            EmptyStatement
        CaseClause
          2
          []
            EmptyStatement
*******************************************************************************/
