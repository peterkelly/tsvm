switch ( x ) {
  case 1 :
    a ;
    b ;
  case 2 :
    c ;
    d ;
  default :
    e ;
    f ;
}

/*******************************************************************************
ast-module

Module 0-98 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n  default :\n    e ;\n    f ;\n}"
  [] 0-98 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n  default :\n    e ;\n    f ;\n}"
    SwitchStatement 0-98 "switch ( x ) {\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n  default :\n    e ;\n    f ;\n}"
      IdentifierReference("x") 9-10 "x"
      CaseBlock2 13-98 "{\n  case 1 :\n    a ;\n    b ;\n  case 2 :\n    c ;\n    d ;\n  default :\n    e ;\n    f ;\n}"
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
        DefaultClause 71-96 "default :\n    e ;\n    f ;"
          [] 85-96 "e ;\n    f ;"
            ExpressionStatement 85-88 "e ;"
              IdentifierReference("e") 85-86 "e"
            ExpressionStatement 93-96 "f ;"
              IdentifierReference("f") 93-94 "f"
        null
*******************************************************************************/
