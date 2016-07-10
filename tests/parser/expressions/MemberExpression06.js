a . foo [ 13 * 2 ] ;

/*******************************************************************************
ast-module

Module 0-20 "a . foo [ 13 * 2 ] ;"
  [] 0-20 "a . foo [ 13 * 2 ] ;"
    ExpressionStatement 0-20 "a . foo [ 13 * 2 ] ;"
      MemberAccessExpr 0-18 "a . foo [ 13 * 2 ]"
        MemberAccessIdent 0-7 "a . foo"
          IdentifierReference("a") 0-1 "a"
          Identifier("foo") 4-7 "foo"
        Multiply 10-16 "13 * 2"
          13 10-12 "13"
          2 15-16 "2"
*******************************************************************************/
