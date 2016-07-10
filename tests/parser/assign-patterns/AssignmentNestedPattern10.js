( { p1 : [ a ] = x } = value ) ;

/*******************************************************************************
ast-module

Module 0-32 "( { p1 : [ a ] = x } = value ) ;"
  [] 0-32 "( { p1 : [ a ] = x } = value ) ;"
    ExpressionStatement 0-32 "( { p1 : [ a ] = x } = value ) ;"
      Assign 2-28 "{ p1 : [ a ] = x } = value"
        ObjectLiteral 2-20 "{ p1 : [ a ] = x }"
          [] 4-18 "p1 : [ a ] = x"
            ColonPropertyDefinition 4-18 "p1 : [ a ] = x"
              Identifier("p1") 4-6 "p1"
              Assign 9-18 "[ a ] = x"
                ArrayLiteral 9-14 "[ a ]"
                  [] 11-12 "a"
                    IdentifierReference("a") 11-12 "a"
                IdentifierReference("x") 17-18 "x"
        IdentifierReference("value") 23-28 "value"
*******************************************************************************/
