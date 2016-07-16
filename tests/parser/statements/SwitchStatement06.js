switch ( x ) {
  case 1 : ;
  case 2 : ;
  case 3 : ;
  default : ;
}

/*******************************************************************************
ast-module

Module 0-69 "switch ( x ) {\n  case 1 : ;\n  case 2 : ;\n  case 3 : ;\n  default : ;\n}"
  [] 0-69 "switch ( x ) {\n  case 1 : ;\n  case 2 : ;\n  case 3 : ;\n  default : ;\n}"
    SwitchStatement 0-69 "switch ( x ) {\n  case 1 : ;\n  case 2 : ;\n  case 3 : ;\n  default : ;\n}"
      IdentifierReference("x") 9-10 "x"
      CaseBlock2 13-69 "{\n  case 1 : ;\n  case 2 : ;\n  case 3 : ;\n  default : ;\n}"
        [] 17-53 "case 1 : ;\n  case 2 : ;\n  case 3 : ;"
          CaseClause 17-27 "case 1 : ;"
            1 22-23 "1"
            [] 26-27 ";"
              EmptyStatement 26-27 ";"
          CaseClause 30-40 "case 2 : ;"
            2 35-36 "2"
            [] 39-40 ";"
              EmptyStatement 39-40 ";"
          CaseClause 43-53 "case 3 : ;"
            3 48-49 "3"
            [] 52-53 ";"
              EmptyStatement 52-53 ";"
        DefaultClause 56-67 "default : ;"
          [] 66-67 ";"
            EmptyStatement 66-67 ";"
        null
*******************************************************************************/
