log ( a , ... b ) ;

/*******************************************************************************
ast-module

Module 0-19 "log ( a , ... b ) ;"
  [] 0-19 "log ( a , ... b ) ;"
    ExpressionStatement 0-19 "log ( a , ... b ) ;"
      Call 0-17 "log ( a , ... b )"
        IdentifierReference("log") 0-3 "log"
        Arguments 4-17 "( a , ... b )"
          [] 6-15 "a , ... b"
            IdentifierReference("a") 6-7 "a"
            SpreadElement 10-15 "... b"
              IdentifierReference("b") 14-15 "b"
*******************************************************************************/
