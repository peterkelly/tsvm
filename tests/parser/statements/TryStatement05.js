try {
  1 ;
  2 ;
}
finally {
  5 ;
  6 ;
}

/*******************************************************************************
ast-module

Module 0-43 "try {\n  1 ;\n  2 ;\n}\nfinally {\n  5 ;\n  6 ;\n}"
  [] 0-43 "try {\n  1 ;\n  2 ;\n}\nfinally {\n  5 ;\n  6 ;\n}"
    TryStatement 0-43 "try {\n  1 ;\n  2 ;\n}\nfinally {\n  5 ;\n  6 ;\n}"
      Block 4-19 "{\n  1 ;\n  2 ;\n}"
        [] 8-17 "1 ;\n  2 ;"
          ExpressionStatement 8-11 "1 ;"
            1 8-9 "1"
          ExpressionStatement 14-17 "2 ;"
            2 14-15 "2"
      null
      Finally 20-43 "finally {\n  5 ;\n  6 ;\n}"
        Block 28-43 "{\n  5 ;\n  6 ;\n}"
          [] 32-41 "5 ;\n  6 ;"
            ExpressionStatement 32-35 "5 ;"
              5 32-33 "5"
            ExpressionStatement 38-41 "6 ;"
              6 38-39 "6"
*******************************************************************************/
