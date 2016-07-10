log ( "hello" , "world" ) ;

/*******************************************************************************
ast-module

Module 0-27 "log ( \"hello\" , \"world\" ) ;"
  [] 0-27 "log ( \"hello\" , \"world\" ) ;"
    ExpressionStatement 0-27 "log ( \"hello\" , \"world\" ) ;"
      Call 0-25 "log ( \"hello\" , \"world\" )"
        IdentifierReference("log") 0-3 "log"
        Arguments 4-25 "( \"hello\" , \"world\" )"
          [] 6-23 "\"hello\" , \"world\""
            "hello" 6-13 "\"hello\""
            "world" 16-23 "\"world\""
*******************************************************************************/
