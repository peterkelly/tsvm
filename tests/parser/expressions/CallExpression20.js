log ( a , ... b , c ) ;

/*******************************************************************************
ast-module

Module 0-23 "log ( a , ... b , c ) ;"
  [] 0-23 "log ( a , ... b , c ) ;"
    ExpressionStatement 0-23 "log ( a , ... b , c ) ;"
      Call 0-21 "log ( a , ... b , c )"
        IdentifierReference("log") 0-3 "log"
        Arguments 4-21 "( a , ... b , c )"
          [] 6-19 "a , ... b , c"
            IdentifierReference("a") 6-7 "a"
            SpreadElement 10-15 "... b"
              IdentifierReference("b") 14-15 "b"
            IdentifierReference("c") 18-19 "c"
*******************************************************************************/
