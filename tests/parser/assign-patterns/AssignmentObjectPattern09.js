( { one : a , two : b , three : c } = value ) ;

/*******************************************************************************
ast-module

Module 0-47 "( { one : a , two : b , three : c } = value ) ;"
  [] 0-47 "( { one : a , two : b , three : c } = value ) ;"
    ExpressionStatement 0-47 "( { one : a , two : b , three : c } = value ) ;"
      Assign 2-43 "{ one : a , two : b , three : c } = value"
        ObjectLiteral 2-35 "{ one : a , two : b , three : c }"
          [] 4-33 "one : a , two : b , three : c"
            ColonPropertyDefinition 4-11 "one : a"
              Identifier("one") 4-7 "one"
              IdentifierReference("a") 10-11 "a"
            ColonPropertyDefinition 14-21 "two : b"
              Identifier("two") 14-17 "two"
              IdentifierReference("b") 20-21 "b"
            ColonPropertyDefinition 24-33 "three : c"
              Identifier("three") 24-29 "three"
              IdentifierReference("c") 32-33 "c"
        IdentifierReference("value") 38-43 "value"
*******************************************************************************/
