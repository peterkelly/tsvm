do 1 ; while ( x < 10 ) ;

/*******************************************************************************
ast-module

Module 0-25 "do 1 ; while ( x < 10 ) ;"
  [] 0-25 "do 1 ; while ( x < 10 ) ;"
    DoStatement 0-25 "do 1 ; while ( x < 10 ) ;"
      ExpressionStatement 3-6 "1 ;"
        1 3-4 "1"
      LessThan 15-21 "x < 10"
        IdentifierReference("x") 15-16 "x"
        10 19-21 "10"
*******************************************************************************/
