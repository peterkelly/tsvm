( { p1 : [ a ] , p2 : [ b ] } = value ) ;

/*******************************************************************************
ast-module

Module 0-41 "( { p1 : [ a ] , p2 : [ b ] } = value ) ;"
  [] 0-41 "( { p1 : [ a ] , p2 : [ b ] } = value ) ;"
    ExpressionStatement 0-41 "( { p1 : [ a ] , p2 : [ b ] } = value ) ;"
      Assign 2-37 "{ p1 : [ a ] , p2 : [ b ] } = value"
        ObjectLiteral 2-29 "{ p1 : [ a ] , p2 : [ b ] }"
          [] 4-27 "p1 : [ a ] , p2 : [ b ]"
            ColonPropertyDefinition 4-14 "p1 : [ a ]"
              Identifier("p1") 4-6 "p1"
              ArrayLiteral 9-14 "[ a ]"
                [] 11-12 "a"
                  IdentifierReference("a") 11-12 "a"
            ColonPropertyDefinition 17-27 "p2 : [ b ]"
              Identifier("p2") 17-19 "p2"
              ArrayLiteral 22-27 "[ b ]"
                [] 24-25 "b"
                  IdentifierReference("b") 24-25 "b"
        IdentifierReference("value") 32-37 "value"
*******************************************************************************/
