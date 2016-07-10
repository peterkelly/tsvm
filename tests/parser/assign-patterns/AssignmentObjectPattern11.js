( { one : a = 1 , two : b = 2 , three : c = 3 } = value ) ;

/*******************************************************************************
ast-module

Module 0-59 "( { one : a = 1 , two : b = 2 , three : c = 3 } = value ) ;"
  [] 0-59 "( { one : a = 1 , two : b = 2 , three : c = 3 } = value ) ;"
    ExpressionStatement 0-59 "( { one : a = 1 , two : b = 2 , three : c = 3 } = value ) ;"
      Assign 2-55 "{ one : a = 1 , two : b = 2 , three : c = 3 } = value"
        ObjectLiteral 2-47 "{ one : a = 1 , two : b = 2 , three : c = 3 }"
          [] 4-45 "one : a = 1 , two : b = 2 , three : c = 3"
            ColonPropertyDefinition 4-15 "one : a = 1"
              Identifier("one") 4-7 "one"
              Assign 10-15 "a = 1"
                IdentifierReference("a") 10-11 "a"
                1 14-15 "1"
            ColonPropertyDefinition 18-29 "two : b = 2"
              Identifier("two") 18-21 "two"
              Assign 24-29 "b = 2"
                IdentifierReference("b") 24-25 "b"
                2 28-29 "2"
            ColonPropertyDefinition 32-45 "three : c = 3"
              Identifier("three") 32-37 "three"
              Assign 40-45 "c = 3"
                IdentifierReference("c") 40-41 "c"
                3 44-45 "3"
        IdentifierReference("value") 50-55 "value"
*******************************************************************************/
