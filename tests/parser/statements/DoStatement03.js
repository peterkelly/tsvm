do {
    1 ;
    2 ;
    3 ;
} while ( x < 10 ) ;

/*******************************************************************************
ast-module

Module
  []
    DoStatement
      Block
        []
          ExpressionStatement
            1
          ExpressionStatement
            2
          ExpressionStatement
            3
      LessThan
        IdentifierReference("x")
        10
*******************************************************************************/
