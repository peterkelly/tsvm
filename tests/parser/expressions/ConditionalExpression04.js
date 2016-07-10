x ? y ? 1 : 2 : z ? 3 : 4 ;

/*******************************************************************************
ast-module

Module 0-27 "x ? y ? 1 : 2 : z ? 3 : 4 ;"
  [] 0-27 "x ? y ? 1 : 2 : z ? 3 : 4 ;"
    ExpressionStatement 0-27 "x ? y ? 1 : 2 : z ? 3 : 4 ;"
      Conditional 0-25 "x ? y ? 1 : 2 : z ? 3 : 4"
        IdentifierReference("x") 0-1 "x"
        Conditional 4-13 "y ? 1 : 2"
          IdentifierReference("y") 4-5 "y"
          1 8-9 "1"
          2 12-13 "2"
        Conditional 16-25 "z ? 3 : 4"
          IdentifierReference("z") 16-17 "z"
          3 20-21 "3"
          4 24-25 "4"
*******************************************************************************/
