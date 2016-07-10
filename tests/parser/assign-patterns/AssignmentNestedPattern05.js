( { p1 : [ a , b ] } = value ) ;

/*******************************************************************************
ast-module

Module 0-32 "( { p1 : [ a , b ] } = value ) ;"
  [] 0-32 "( { p1 : [ a , b ] } = value ) ;"
    ExpressionStatement 0-32 "( { p1 : [ a , b ] } = value ) ;"
      Assign 2-28 "{ p1 : [ a , b ] } = value"
        ObjectLiteral 2-20 "{ p1 : [ a , b ] }"
          [] 4-18 "p1 : [ a , b ]"
            ColonPropertyDefinition 4-18 "p1 : [ a , b ]"
              Identifier("p1") 4-6 "p1"
              ArrayLiteral 9-18 "[ a , b ]"
                [] 11-16 "a , b"
                  IdentifierReference("a") 11-12 "a"
                  IdentifierReference("b") 15-16 "b"
        IdentifierReference("value") 23-28 "value"
*******************************************************************************/
