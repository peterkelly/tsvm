switch ( x ) {
  case 1 :
    a ;
    b ;
}

/*******************************************************************************
ast-module

Module 0-43 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n}"
  [] 0-43 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n}"
    SwitchStatement 0-43 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-41 "case 1 :\n    a ;\n    b ;"
        CaseClause 17-41 "case 1 :\n    a ;\n    b ;"
          1 22-23 "1"
          [] 30-41 "a ;\n    b ;"
            ExpressionStatement 30-33 "a ;"
              IdentifierReference("a") 30-31 "a"
            ExpressionStatement 38-41 "b ;"
              IdentifierReference("b") 38-39 "b"
*******************************************************************************/
