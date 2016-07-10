( { [ "some" + "property" ] : 1 } ) ;

/*******************************************************************************
ast-module

Module 0-37 "( { [ \"some\" + \"property\" ] : 1 } ) ;"
  [] 0-37 "( { [ \"some\" + \"property\" ] : 1 } ) ;"
    ExpressionStatement 0-37 "( { [ \"some\" + \"property\" ] : 1 } ) ;"
      ObjectLiteral 2-33 "{ [ \"some\" + \"property\" ] : 1 }"
        [] 4-31 "[ \"some\" + \"property\" ] : 1"
          ColonPropertyDefinition 4-31 "[ \"some\" + \"property\" ] : 1"
            ComputedPropertyName 4-27 "[ \"some\" + \"property\" ]"
              Add 6-25 "\"some\" + \"property\""
                "some" 6-12 "\"some\""
                "property" 15-25 "\"property\""
            1 30-31 "1"
*******************************************************************************/
