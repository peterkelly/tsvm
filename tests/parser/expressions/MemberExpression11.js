super . foo . bar ;

/*******************************************************************************
ast-module

Module 0-19 "super . foo . bar ;"
  [] 0-19 "super . foo . bar ;"
    ExpressionStatement 0-19 "super . foo . bar ;"
      MemberAccessIdent 0-17 "super . foo . bar"
        SuperPropertyIdent 0-11 "super . foo"
          Identifier("foo") 8-11 "foo"
        Identifier("bar") 14-17 "bar"
*******************************************************************************/
