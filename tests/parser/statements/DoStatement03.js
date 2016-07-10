do {
  1 ;
  2 ;
  3 ;
} while ( x < 10 ) ;

/*******************************************************************************
ast-module

Module 0-43 "do {\n  1 ;\n  2 ;\n  3 ;\n} while ( x < 10 ) ;"
  [] 0-43 "do {\n  1 ;\n  2 ;\n  3 ;\n} while ( x < 10 ) ;"
    DoStatement 0-43 "do {\n  1 ;\n  2 ;\n  3 ;\n} while ( x < 10 ) ;"
      Block 3-24 "{\n  1 ;\n  2 ;\n  3 ;\n}"
        [] 7-22 "1 ;\n  2 ;\n  3 ;"
          ExpressionStatement 7-10 "1 ;"
            1 7-8 "1"
          ExpressionStatement 13-16 "2 ;"
            2 13-14 "2"
          ExpressionStatement 19-22 "3 ;"
            3 19-20 "3"
      LessThan 33-39 "x < 10"
        IdentifierReference("x") 33-34 "x"
        10 37-39 "10"
*******************************************************************************/
