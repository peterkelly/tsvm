switch ( x ) {
  default : ;
  case 1 : ;
  case 2 : ;
}

/*******************************************************************************
ast-module

Module 0-56 "switch ( x ) {\n  default : ;\n  case 1 : ;\n  case 2 : ;\n}"
  [] 0-56 "switch ( x ) {\n  default : ;\n  case 1 : ;\n  case 2 : ;\n}"
    SwitchStatement 0-56 "switch ( x ) {\n  default : ;\n  case 1 : ;\n  case 2 : ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-54 "default : ;\n  case 1 : ;\n  case 2 : ;"
        DefaultClause 17-28 "default : ;"
          [] 27-28 ";"
            EmptyStatement 27-28 ";"
        CaseClause 31-41 "case 1 : ;"
          1 36-37 "1"
          [] 40-41 ";"
            EmptyStatement 40-41 ";"
        CaseClause 44-54 "case 2 : ;"
          2 49-50 "2"
          [] 53-54 ";"
            EmptyStatement 53-54 ";"
*******************************************************************************/
