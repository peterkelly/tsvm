f ( a ) [ b ] [ c ] ;

/*******************************************************************************
ast-module

Module 0-21 "f ( a ) [ b ] [ c ] ;"
  [] 0-21 "f ( a ) [ b ] [ c ] ;"
    ExpressionStatement 0-21 "f ( a ) [ b ] [ c ] ;"
      MemberAccessExpr 0-19 "f ( a ) [ b ] [ c ]"
        MemberAccessExpr 0-13 "f ( a ) [ b ]"
          Call 0-7 "f ( a )"
            IdentifierReference("f") 0-1 "f"
            Arguments 2-7 "( a )"
              [] 4-5 "a"
                IdentifierReference("a") 4-5 "a"
          IdentifierReference("b") 10-11 "b"
        IdentifierReference("c") 16-17 "c"
*******************************************************************************/
