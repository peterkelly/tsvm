f ( a ) . b . c ;

/*******************************************************************************
ast-module

Module 0-17 "f ( a ) . b . c ;"
  [] 0-17 "f ( a ) . b . c ;"
    ExpressionStatement 0-17 "f ( a ) . b . c ;"
      MemberAccessIdent 0-15 "f ( a ) . b . c"
        MemberAccessIdent 0-11 "f ( a ) . b"
          Call 0-7 "f ( a )"
            IdentifierReference("f") 0-1 "f"
            Arguments 2-7 "( a )"
              [] 4-5 "a"
                IdentifierReference("a") 4-5 "a"
          Identifier("b") 10-11 "b"
        Identifier("c") 14-15 "c"
*******************************************************************************/
