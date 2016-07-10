switch ( x ) {
  case 1 :
    a ;
    b ;
  case 2 :
    c ;
    d ;
}

/*******************************************************************************
ast-module

Module 0-70 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n}"
  [] 0-70 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n}"
    SwitchStatement 0-70 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-68 "case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;"
        CaseClause 17-41 "case 1 :\n    a ;\n    b ;"
          1 22-23 "1"
          [] 30-41 "a ;\n    b ;"
            ExpressionStatement 30-33 "a ;"
              IdentifierReference("a") 30-31 "a"
            ExpressionStatement 38-41 "b ;"
              IdentifierReference("b") 38-39 "b"
        CaseClause 44-68 "case 2 :\n    c ;\n    d ;"
          2 49-50 "2"
          [] 57-68 "c ;\n    d ;"
            ExpressionStatement 57-60 "c ;"
              IdentifierReference("c") 57-58 "c"
            ExpressionStatement 65-68 "d ;"
              IdentifierReference("d") 65-66 "d"
*******************************************************************************/
