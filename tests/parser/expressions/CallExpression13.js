f ( a ) [ b ] ( c ) . d ;

/*******************************************************************************
ast-module

Module 0-25 "f ( a ) [ b ] ( c ) . d ;"
  [] 0-25 "f ( a ) [ b ] ( c ) . d ;"
    ExpressionStatement 0-25 "f ( a ) [ b ] ( c ) . d ;"
      MemberAccessIdent 0-23 "f ( a ) [ b ] ( c ) . d"
        Call 0-19 "f ( a ) [ b ] ( c )"
          MemberAccessExpr 0-13 "f ( a ) [ b ]"
            Call 0-7 "f ( a )"
              IdentifierReference("f") 0-1 "f"
              Arguments 2-7 "( a )"
                [] 4-5 "a"
                  IdentifierReference("a") 4-5 "a"
            IdentifierReference("b") 10-11 "b"
          Arguments 14-19 "( c )"
            [] 16-17 "c"
              IdentifierReference("c") 16-17 "c"
        Identifier("d") 22-23 "d"
*******************************************************************************/
