console . log ( "hello" , "world" ) ;

/*******************************************************************************
ast-module

Module 0-37 "console . log ( \"hello\" , \"world\" ) ;"
  [] 0-37 "console . log ( \"hello\" , \"world\" ) ;"
    ExpressionStatement 0-37 "console . log ( \"hello\" , \"world\" ) ;"
      Call 0-35 "console . log ( \"hello\" , \"world\" )"
        MemberAccessIdent 0-13 "console . log"
          IdentifierReference("console") 0-7 "console"
          Identifier("log") 10-13 "log"
        Arguments 14-35 "( \"hello\" , \"world\" )"
          [] 16-33 "\"hello\" , \"world\""
            "hello" 16-23 "\"hello\""
            "world" 26-33 "\"world\""
*******************************************************************************/
