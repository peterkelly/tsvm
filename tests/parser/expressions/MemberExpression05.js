a [ "some" + "property" ] ;

/*******************************************************************************
ast-module

Module 0-27 "a [ \"some\" + \"property\" ] ;"
  [] 0-27 "a [ \"some\" + \"property\" ] ;"
    ExpressionStatement 0-27 "a [ \"some\" + \"property\" ] ;"
      MemberAccessExpr 0-25 "a [ \"some\" + \"property\" ]"
        IdentifierReference("a") 0-1 "a"
        Add 4-23 "\"some\" + \"property\""
          "some" 4-10 "\"some\""
          "property" 13-23 "\"property\""
*******************************************************************************/
