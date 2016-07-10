f ( a ) ( b ) . c [ d ] ;

/*******************************************************************************
ast-module

Module 0-25 "f ( a ) ( b ) . c [ d ] ;"
  [] 0-25 "f ( a ) ( b ) . c [ d ] ;"
    ExpressionStatement 0-25 "f ( a ) ( b ) . c [ d ] ;"
      MemberAccessExpr 0-23 "f ( a ) ( b ) . c [ d ]"
        MemberAccessIdent 0-17 "f ( a ) ( b ) . c"
          Call 0-13 "f ( a ) ( b )"
            Call 0-7 "f ( a )"
              IdentifierReference("f") 0-1 "f"
              Arguments 2-7 "( a )"
                [] 4-5 "a"
                  IdentifierReference("a") 4-5 "a"
            Arguments 8-13 "( b )"
              [] 10-11 "b"
                IdentifierReference("b") 10-11 "b"
          Identifier("c") 16-17 "c"
        IdentifierReference("d") 20-21 "d"
*******************************************************************************/
