super [ "some" + "property" ] ;

/*******************************************************************************
ast-module

Module 0-31 "super [ \"some\" + \"property\" ] ;"
  [] 0-31 "super [ \"some\" + \"property\" ] ;"
    ExpressionStatement 0-31 "super [ \"some\" + \"property\" ] ;"
      SuperPropertyExpr 0-29 "super [ \"some\" + \"property\" ]"
        Add 8-27 "\"some\" + \"property\""
          "some" 8-14 "\"some\""
          "property" 17-27 "\"property\""
*******************************************************************************/
