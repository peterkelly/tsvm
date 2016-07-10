log ( ... a , b ) ;

/*******************************************************************************
ast-module

Module 0-19 "log ( ... a , b ) ;"
  [] 0-19 "log ( ... a , b ) ;"
    ExpressionStatement 0-19 "log ( ... a , b ) ;"
      Call 0-17 "log ( ... a , b )"
        IdentifierReference("log") 0-3 "log"
        Arguments 4-17 "( ... a , b )"
          [] 6-15 "... a , b"
            SpreadElement 6-11 "... a"
              IdentifierReference("a") 10-11 "a"
            IdentifierReference("b") 14-15 "b"
*******************************************************************************/
