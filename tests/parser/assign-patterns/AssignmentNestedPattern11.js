( { p1 : [ a , b ] = x } = value ) ;

/*******************************************************************************
ast-module

Module 0-36 "( { p1 : [ a , b ] = x } = value ) ;"
  [] 0-36 "( { p1 : [ a , b ] = x } = value ) ;"
    ExpressionStatement 0-36 "( { p1 : [ a , b ] = x } = value ) ;"
      Assign 2-32 "{ p1 : [ a , b ] = x } = value"
        ObjectLiteral 2-24 "{ p1 : [ a , b ] = x }"
          [] 4-22 "p1 : [ a , b ] = x"
            ColonPropertyDefinition 4-22 "p1 : [ a , b ] = x"
              Identifier("p1") 4-6 "p1"
              Assign 9-22 "[ a , b ] = x"
                ArrayLiteral 9-18 "[ a , b ]"
                  [] 11-16 "a , b"
                    IdentifierReference("a") 11-12 "a"
                    IdentifierReference("b") 15-16 "b"
                IdentifierReference("x") 21-22 "x"
        IdentifierReference("value") 27-32 "value"
*******************************************************************************/
