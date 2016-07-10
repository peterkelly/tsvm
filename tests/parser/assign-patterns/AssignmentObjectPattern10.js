( { one : a = 1 } = value ) ;

/*******************************************************************************
ast-module

Module 0-29 "( { one : a = 1 } = value ) ;"
  [] 0-29 "( { one : a = 1 } = value ) ;"
    ExpressionStatement 0-29 "( { one : a = 1 } = value ) ;"
      Assign 2-25 "{ one : a = 1 } = value"
        ObjectLiteral 2-17 "{ one : a = 1 }"
          [] 4-15 "one : a = 1"
            ColonPropertyDefinition 4-15 "one : a = 1"
              Identifier("one") 4-7 "one"
              Assign 10-15 "a = 1"
                IdentifierReference("a") 10-11 "a"
                1 14-15 "1"
        IdentifierReference("value") 20-25 "value"
*******************************************************************************/
