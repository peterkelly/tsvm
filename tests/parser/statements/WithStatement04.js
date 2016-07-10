with ( x ) {
  1 ;
  2 ;
  3 ;
}

/*******************************************************************************
ast-module

Module 0-32 "with ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
  [] 0-32 "with ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
    WithStatement 0-32 "with ( x ) {\n  1 ;\n  2 ;\n  3 ;\n}"
      IdentifierReference("x") 7-8 "x"
      Block 11-32 "{\n  1 ;\n  2 ;\n  3 ;\n}"
        [] 15-30 "1 ;\n  2 ;\n  3 ;"
          ExpressionStatement 15-18 "1 ;"
            1 15-16 "1"
          ExpressionStatement 21-24 "2 ;"
            2 21-22 "2"
          ExpressionStatement 27-30 "3 ;"
            3 27-28 "3"
*******************************************************************************/
