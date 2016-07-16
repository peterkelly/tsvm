switch ( x ) {
  case 1 : ;
  case 2 : ;
  default : ;
  case 3 : ;
  case 4 : ;
}

/*******************************************************************************
ast-module

Module 0-82 "switch ( x ) {\n  case 1 : ;\n  case 2 : ;\n  default : ;\n  case 3 : ;\n  case 4 : ;\n}"
  [] 0-82 "switch ( x ) {\n  case 1 : ;\n  case 2 : ;\n  default : ;\n  case 3 : ;\n  case 4 : ;\n}"
    SwitchStatement 0-82 "switch ( x ) {\n  case 1 : ;\n  case 2 : ;\n  default : ;\n  case 3 : ;\n  case 4 : ;\n}"
      IdentifierReference("x") 9-10 "x"
      CaseBlock2 13-82 "{\n  case 1 : ;\n  case 2 : ;\n  default : ;\n  case 3 : ;\n  case 4 : ;\n}"
        [] 17-40 "case 1 : ;\n  case 2 : ;"
          CaseClause 17-27 "case 1 : ;"
            1 22-23 "1"
            [] 26-27 ";"
              EmptyStatement 26-27 ";"
          CaseClause 30-40 "case 2 : ;"
            2 35-36 "2"
            [] 39-40 ";"
              EmptyStatement 39-40 ";"
        DefaultClause 43-54 "default : ;"
          [] 53-54 ";"
            EmptyStatement 53-54 ";"
        [] 57-80 "case 3 : ;\n  case 4 : ;"
          CaseClause 57-67 "case 3 : ;"
            3 62-63 "3"
            [] 66-67 ";"
              EmptyStatement 66-67 ";"
          CaseClause 70-80 "case 4 : ;"
            4 75-76 "4"
            [] 79-80 ";"
              EmptyStatement 79-80 ";"
*******************************************************************************/
