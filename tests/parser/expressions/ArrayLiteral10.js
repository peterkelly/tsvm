[ 1 , ... x , 2 , ... y ] ;

/*******************************************************************************
ast-module

Module 0-27 "[ 1 , ... x , 2 , ... y ] ;"
  [] 0-27 "[ 1 , ... x , 2 , ... y ] ;"
    ExpressionStatement 0-27 "[ 1 , ... x , 2 , ... y ] ;"
      ArrayLiteral 0-25 "[ 1 , ... x , 2 , ... y ]"
        [] 2-23 "1 , ... x , 2 , ... y"
          1 2-3 "1"
          SpreadElement 6-11 "... x"
            IdentifierReference("x") 10-11 "x"
          2 14-15 "2"
          SpreadElement 18-23 "... y"
            IdentifierReference("y") 22-23 "y"
*******************************************************************************/
