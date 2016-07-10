if ( 9 < 99 ) {
  1 ;
  2 ;
  3 ;
}
else {
  4 ;
  5 ;
  6 ;
}

/*******************************************************************************
ast-module

Module 0-62 "if ( 9 < 99 ) {\n  1 ;\n  2 ;\n  3 ;\n}\nelse {\n  4 ;\n  5 ;\n  6 ;\n}"
  [] 0-62 "if ( 9 < 99 ) {\n  1 ;\n  2 ;\n  3 ;\n}\nelse {\n  4 ;\n  5 ;\n  6 ;\n}"
    IfStatement 0-62 "if ( 9 < 99 ) {\n  1 ;\n  2 ;\n  3 ;\n}\nelse {\n  4 ;\n  5 ;\n  6 ;\n}"
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
      Block 41-62 "{\n  4 ;\n  5 ;\n  6 ;\n}"
        [] 45-60 "4 ;\n  5 ;\n  6 ;"
          ExpressionStatement 45-48 "4 ;"
            4 45-46 "4"
          ExpressionStatement 51-54 "5 ;"
            5 51-52 "5"
          ExpressionStatement 57-60 "6 ;"
            6 57-58 "6"
*******************************************************************************/
