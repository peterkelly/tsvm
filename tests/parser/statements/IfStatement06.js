if ( 9 < 99 ) {
  1 ;
}
else {
  2 ;
}

/*******************************************************************************
ast-module

Module 0-38 "if ( 9 < 99 ) {\n  1 ;\n}\nelse {\n  2 ;\n}"
  [] 0-38 "if ( 9 < 99 ) {\n  1 ;\n}\nelse {\n  2 ;\n}"
    IfStatement 0-38 "if ( 9 < 99 ) {\n  1 ;\n}\nelse {\n  2 ;\n}"
      LessThan 5-11 "9 < 99"
        9 5-6 "9"
        99 9-11 "99"
      Block 14-23 "{\n  1 ;\n}"
        [] 18-21 "1 ;"
          ExpressionStatement 18-21 "1 ;"
            1 18-19 "1"
      Block 29-38 "{\n  2 ;\n}"
        [] 33-36 "2 ;"
          ExpressionStatement 33-36 "2 ;"
            2 33-34 "2"
*******************************************************************************/
