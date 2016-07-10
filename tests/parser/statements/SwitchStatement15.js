switch ( x ) {
  default : {
    a ;
    b ;
  }
  case 1 : {
    c ;
    d ;
  }
  case 2 : {
    e ;
    f ;
  }
}

/*******************************************************************************
ast-module

Module 0-116 "switch ( x ) {\n  default : {\n    a ;\n    b ;\n  }\n  case 1 : {\n    c ;\n    d ;\n  }\n  case 2 : {\n    e ;\n    f ;\n  }\n}"
  [] 0-116 "switch ( x ) {\n  default : {\n    a ;\n    b ;\n  }\n  case 1 : {\n    c ;\n    d ;\n  }\n  case 2 : {\n    e ;\n    f ;\n  }\n}"
    SwitchStatement 0-116 "switch ( x ) {\n  default : {\n    a ;\n    b ;\n  }\n  case 1 : {\n    c ;\n    d ;\n  }\n  case 2 : {\n    e ;\n    f ;\n  }\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-114 "default : {\n    a ;\n    b ;\n  }\n  case 1 : {\n    c ;\n    d ;\n  }\n  case 2 : {\n    e ;\n    f ;\n  }"
        DefaultClause 17-48 "default : {\n    a ;\n    b ;\n  }"
          [] 27-48 "{\n    a ;\n    b ;\n  }"
            Block 27-48 "{\n    a ;\n    b ;\n  }"
              [] 33-44 "a ;\n    b ;"
                ExpressionStatement 33-36 "a ;"
                  IdentifierReference("a") 33-34 "a"
                ExpressionStatement 41-44 "b ;"
                  IdentifierReference("b") 41-42 "b"
        CaseClause 51-81 "case 1 : {\n    c ;\n    d ;\n  }"
          1 56-57 "1"
          [] 60-81 "{\n    c ;\n    d ;\n  }"
            Block 60-81 "{\n    c ;\n    d ;\n  }"
              [] 66-77 "c ;\n    d ;"
                ExpressionStatement 66-69 "c ;"
                  IdentifierReference("c") 66-67 "c"
                ExpressionStatement 74-77 "d ;"
                  IdentifierReference("d") 74-75 "d"
        CaseClause 84-114 "case 2 : {\n    e ;\n    f ;\n  }"
          2 89-90 "2"
          [] 93-114 "{\n    e ;\n    f ;\n  }"
            Block 93-114 "{\n    e ;\n    f ;\n  }"
              [] 99-110 "e ;\n    f ;"
                ExpressionStatement 99-102 "e ;"
                  IdentifierReference("e") 99-100 "e"
                ExpressionStatement 107-110 "f ;"
                  IdentifierReference("f") 107-108 "f"
*******************************************************************************/
