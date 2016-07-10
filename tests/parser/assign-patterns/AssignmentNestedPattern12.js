( { p1 : [ a ] = x , p2 : [ b ] = y } = value ) ;

/*******************************************************************************
ast-module

Module 0-49 "( { p1 : [ a ] = x , p2 : [ b ] = y } = value ) ;"
  [] 0-49 "( { p1 : [ a ] = x , p2 : [ b ] = y } = value ) ;"
    ExpressionStatement 0-49 "( { p1 : [ a ] = x , p2 : [ b ] = y } = value ) ;"
      Assign 2-45 "{ p1 : [ a ] = x , p2 : [ b ] = y } = value"
        ObjectLiteral 2-37 "{ p1 : [ a ] = x , p2 : [ b ] = y }"
          [] 4-35 "p1 : [ a ] = x , p2 : [ b ] = y"
            ColonPropertyDefinition 4-18 "p1 : [ a ] = x"
              Identifier("p1") 4-6 "p1"
              Assign 9-18 "[ a ] = x"
                ArrayLiteral 9-14 "[ a ]"
                  [] 11-12 "a"
                    IdentifierReference("a") 11-12 "a"
                IdentifierReference("x") 17-18 "x"
            ColonPropertyDefinition 21-35 "p2 : [ b ] = y"
              Identifier("p2") 21-23 "p2"
              Assign 26-35 "[ b ] = y"
                ArrayLiteral 26-31 "[ b ]"
                  [] 28-29 "b"
                    IdentifierReference("b") 28-29 "b"
                IdentifierReference("y") 34-35 "y"
        IdentifierReference("value") 40-45 "value"
*******************************************************************************/
