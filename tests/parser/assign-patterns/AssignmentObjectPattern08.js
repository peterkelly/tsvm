( { one : a } = value ) ;

/*******************************************************************************
ast-module

Module 0-25 "( { one : a } = value ) ;"
  [] 0-25 "( { one : a } = value ) ;"
    ExpressionStatement 0-25 "( { one : a } = value ) ;"
      Assign 2-21 "{ one : a } = value"
        ObjectLiteral 2-13 "{ one : a }"
          [] 4-11 "one : a"
            ColonPropertyDefinition 4-11 "one : a"
              Identifier("one") 4-7 "one"
              IdentifierReference("a") 10-11 "a"
        IdentifierReference("value") 16-21 "value"
*******************************************************************************/
