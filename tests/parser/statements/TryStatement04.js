try {
  1 ;
  2 ;
}
catch ( e ) {
  3 ;
  4 ;
}

/*******************************************************************************
ast-module

Module 0-47 "try {\n  1 ;\n  2 ;\n}\ncatch ( e ) {\n  3 ;\n  4 ;\n}"
  [] 0-47 "try {\n  1 ;\n  2 ;\n}\ncatch ( e ) {\n  3 ;\n  4 ;\n}"
    TryStatement 0-47 "try {\n  1 ;\n  2 ;\n}\ncatch ( e ) {\n  3 ;\n  4 ;\n}"
      Block 4-19 "{\n  1 ;\n  2 ;\n}"
        [] 8-17 "1 ;\n  2 ;"
          ExpressionStatement 8-11 "1 ;"
            1 8-9 "1"
          ExpressionStatement 14-17 "2 ;"
            2 14-15 "2"
      Catch 20-47 "catch ( e ) {\n  3 ;\n  4 ;\n}"
        BindingIdentifier("e") 28-29 "e"
        Block 32-47 "{\n  3 ;\n  4 ;\n}"
          [] 36-45 "3 ;\n  4 ;"
            ExpressionStatement 36-39 "3 ;"
              3 36-37 "3"
            ExpressionStatement 42-45 "4 ;"
              4 42-43 "4"
      null
*******************************************************************************/
