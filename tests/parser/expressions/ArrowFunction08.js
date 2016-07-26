x => { 1 ; 2 ; 3 ; } ;

/*******************************************************************************
ast-module

Module 0-22 "x => { 1 ; 2 ; 3 ; } ;"
  [] 0-22 "x => { 1 ; 2 ; 3 ; } ;"
    ExpressionStatement 0-22 "x => { 1 ; 2 ; 3 ; } ;"
      ArrowFunction 0-20 "x => { 1 ; 2 ; 3 ; }"
        BindingIdentifier("x") 0-1 "x"
        ArrowBlockBody 5-20 "{ 1 ; 2 ; 3 ; }"
          [] 7-18 "1 ; 2 ; 3 ;"
            ExpressionStatement 7-10 "1 ;"
              1 7-8 "1"
            ExpressionStatement 11-14 "2 ;"
              2 11-12 "2"
            ExpressionStatement 15-18 "3 ;"
              3 15-16 "3"
*******************************************************************************/
