switch ( x ) {
  case 1 :
    a ;
    b ;
  default :
    c ;
    d ;
  case 2 :
    e ;
    f ;
}

/*******************************************************************************
ast-module

Module 0-98 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  default :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;\n}"
  [] 0-98 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  default :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;\n}"
    SwitchStatement 0-98 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  default :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-96 "case 1 :\n    a ;\n    b ;\n  default :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;"
        CaseClause 17-41 "case 1 :\n    a ;\n    b ;"
          1 22-23 "1"
          [] 30-41 "a ;\n    b ;"
            ExpressionStatement 30-33 "a ;"
              IdentifierReference("a") 30-31 "a"
            ExpressionStatement 38-41 "b ;"
              IdentifierReference("b") 38-39 "b"
        DefaultClause 44-69 "default :\n    c ;\n    d ;"
          [] 58-69 "c ;\n    d ;"
            ExpressionStatement 58-61 "c ;"
              IdentifierReference("c") 58-59 "c"
            ExpressionStatement 66-69 "d ;"
              IdentifierReference("d") 66-67 "d"
        CaseClause 72-96 "case 2 :\n    e ;\n    f ;"
          2 77-78 "2"
          [] 85-96 "e ;\n    f ;"
            ExpressionStatement 85-88 "e ;"
              IdentifierReference("e") 85-86 "e"
            ExpressionStatement 93-96 "f ;"
              IdentifierReference("f") 93-94 "f"
*******************************************************************************/
