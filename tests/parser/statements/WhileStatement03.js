while ( x < 10 ) {
  1 ;
  2 ;
  3 ;
}

/*******************************************************************************
ast-module

Module 0-38 "while ( x < 10 ) {\n  1 ;\n  2 ;\n  3 ;\n}"
  [] 0-38 "while ( x < 10 ) {\n  1 ;\n  2 ;\n  3 ;\n}"
    WhileStatement 0-38 "while ( x < 10 ) {\n  1 ;\n  2 ;\n  3 ;\n}"
      LessThan 8-14 "x < 10"
        IdentifierReference("x") 8-9 "x"
        10 12-14 "10"
      Block 17-38 "{\n  1 ;\n  2 ;\n  3 ;\n}"
        [] 21-36 "1 ;\n  2 ;\n  3 ;"
          ExpressionStatement 21-24 "1 ;"
            1 21-22 "1"
          ExpressionStatement 27-30 "2 ;"
            2 27-28 "2"
          ExpressionStatement 33-36 "3 ;"
            3 33-34 "3"
*******************************************************************************/
