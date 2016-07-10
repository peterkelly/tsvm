( { p1 : [ a ] } = value ) ;

/*******************************************************************************
ast-module

Module 0-28 "( { p1 : [ a ] } = value ) ;"
  [] 0-28 "( { p1 : [ a ] } = value ) ;"
    ExpressionStatement 0-28 "( { p1 : [ a ] } = value ) ;"
      Assign 2-24 "{ p1 : [ a ] } = value"
        ObjectLiteral 2-16 "{ p1 : [ a ] }"
          [] 4-14 "p1 : [ a ]"
            ColonPropertyDefinition 4-14 "p1 : [ a ]"
              Identifier("p1") 4-6 "p1"
              ArrayLiteral 9-14 "[ a ]"
                [] 11-12 "a"
                  IdentifierReference("a") 11-12 "a"
        IdentifierReference("value") 19-24 "value"
*******************************************************************************/
