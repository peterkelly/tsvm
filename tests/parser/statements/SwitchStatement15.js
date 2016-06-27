switch ( x ) {
    default : {
        a ;
        b ;
    }
    case 1 : {
        c ;
        d ;
    }
    case 2 : {
        e ;
        f ;
    }
}

/*******************************************************************************
ast-module

Module
  []
    SwitchStatement
      IdentifierReference("x")
      []
        DefaultClause
          []
            Block
              []
                ExpressionStatement
                  IdentifierReference("a")
                ExpressionStatement
                  IdentifierReference("b")
        CaseClause
          1
          []
            Block
              []
                ExpressionStatement
                  IdentifierReference("c")
                ExpressionStatement
                  IdentifierReference("d")
        CaseClause
          2
          []
            Block
              []
                ExpressionStatement
                  IdentifierReference("e")
                ExpressionStatement
                  IdentifierReference("f")
*******************************************************************************/
