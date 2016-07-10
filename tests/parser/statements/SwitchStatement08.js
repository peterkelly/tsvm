switch ( x ) {
  case 1 : ;
  default : ;
  case 2 : ;
}

/*******************************************************************************
ast-module

Module 0-56 "switch ( x ) {\n  case 1 : ;\n  default : ;\n  case 2 : ;\n}"
  [] 0-56 "switch ( x ) {\n  case 1 : ;\n  default : ;\n  case 2 : ;\n}"
    SwitchStatement 0-56 "switch ( x ) {\n  case 1 : ;\n  default : ;\n  case 2 : ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-54 "case 1 : ;\n  default : ;\n  case 2 : ;"
        CaseClause 17-27 "case 1 : ;"
          1 22-23 "1"
          [] 26-27 ";"
            EmptyStatement 26-27 ";"
        DefaultClause 30-41 "default : ;"
          [] 40-41 ";"
            EmptyStatement 40-41 ";"
        CaseClause 44-54 "case 2 : ;"
          2 49-50 "2"
          [] 53-54 ";"
            EmptyStatement 53-54 ";"
*******************************************************************************/
