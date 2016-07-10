( a || b ) == ( c || d ) ;

/*******************************************************************************
ast-module

Module 0-26 "( a || b ) == ( c || d ) ;"
  [] 0-26 "( a || b ) == ( c || d ) ;"
    ExpressionStatement 0-26 "( a || b ) == ( c || d ) ;"
      AbstractEquals 0-24 "( a || b ) == ( c || d )"
        LogicalORNode 2-8 "a || b"
          IdentifierReference("a") 2-3 "a"
          IdentifierReference("b") 7-8 "b"
        LogicalORNode 16-22 "c || d"
          IdentifierReference("c") 16-17 "c"
          IdentifierReference("d") 21-22 "d"
*******************************************************************************/
