switch ( x ) {
  case 1 : ;
}

/*******************************************************************************
ast-module

Module 0-29 "switch ( x ) {\n  case 1 : ;\n}"
  [] 0-29 "switch ( x ) {\n  case 1 : ;\n}"
    SwitchStatement 0-29 "switch ( x ) {\n  case 1 : ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-27 "case 1 : ;"
        CaseClause 17-27 "case 1 : ;"
          1 22-23 "1"
          [] 26-27 ";"
            EmptyStatement 26-27 ";"
*******************************************************************************/
