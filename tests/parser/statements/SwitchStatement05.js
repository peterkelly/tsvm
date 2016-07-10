switch ( x ) {
  case 1 : ;
  default : ;
}

/*******************************************************************************
ast-module

Module 0-43 "switch ( x ) {\n  case 1 : ;\n  default : ;\n}"
  [] 0-43 "switch ( x ) {\n  case 1 : ;\n  default : ;\n}"
    SwitchStatement 0-43 "switch ( x ) {\n  case 1 : ;\n  default : ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-41 "case 1 : ;\n  default : ;"
        CaseClause 17-27 "case 1 : ;"
          1 22-23 "1"
          [] 26-27 ";"
            EmptyStatement 26-27 ";"
        DefaultClause 30-41 "default : ;"
          [] 40-41 ";"
            EmptyStatement 40-41 ";"
*******************************************************************************/
