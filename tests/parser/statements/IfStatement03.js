if ( 9 < 99 ) {
  1 ;
  2 ;
  3 ;
}

/*******************************************************************************
ast-module

Module 0-35 "if ( 9 < 99 ) {\n  1 ;\n  2 ;\n  3 ;\n}"
  [] 0-35 "if ( 9 < 99 ) {\n  1 ;\n  2 ;\n  3 ;\n}"
    IfStatement 0-35 "if ( 9 < 99 ) {\n  1 ;\n  2 ;\n  3 ;\n}"
      LessThan 5-11 "9 < 99"
        9 5-6 "9"
        99 9-11 "99"
      Block 14-35 "{\n  1 ;\n  2 ;\n  3 ;\n}"
        [] 18-33 "1 ;\n  2 ;\n  3 ;"
          ExpressionStatement 18-21 "1 ;"
            1 18-19 "1"
          ExpressionStatement 24-27 "2 ;"
            2 24-25 "2"
          ExpressionStatement 30-33 "3 ;"
            3 30-31 "3"
      null
*******************************************************************************/
