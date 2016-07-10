switch ( x ) {
  default :
    a ;
    b ;
  case 1 :
    c ;
    d ;
  case 2 :
    e ;
    f ;
}

/*******************************************************************************
ast-module

Module 0-98 "switch ( x ) {\n  default :\n    a ;\n    b ;\n  case 1 :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;\n}"
  [] 0-98 "switch ( x ) {\n  default :\n    a ;\n    b ;\n  case 1 :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;\n}"
    SwitchStatement 0-98 "switch ( x ) {\n  default :\n    a ;\n    b ;\n  case 1 :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-96 "default :\n    a ;\n    b ;\n  case 1 :\n    c ;\n    d ;\n  case 2 :\n    e ;\n    f ;"
        DefaultClause 17-42 "default :\n    a ;\n    b ;"
          [] 31-42 "a ;\n    b ;"
            ExpressionStatement 31-34 "a ;"
              IdentifierReference("a") 31-32 "a"
            ExpressionStatement 39-42 "b ;"
              IdentifierReference("b") 39-40 "b"
        CaseClause 45-69 "case 1 :\n    c ;\n    d ;"
          1 50-51 "1"
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
