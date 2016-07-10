log ( a , ... b , c , ... d , ... e , f ) ;

/*******************************************************************************
ast-module

Module 0-43 "log ( a , ... b , c , ... d , ... e , f ) ;"
  [] 0-43 "log ( a , ... b , c , ... d , ... e , f ) ;"
    ExpressionStatement 0-43 "log ( a , ... b , c , ... d , ... e , f ) ;"
      Call 0-41 "log ( a , ... b , c , ... d , ... e , f )"
        IdentifierReference("log") 0-3 "log"
        Arguments 4-41 "( a , ... b , c , ... d , ... e , f )"
          [] 6-39 "a , ... b , c , ... d , ... e , f"
            IdentifierReference("a") 6-7 "a"
            SpreadElement 10-15 "... b"
              IdentifierReference("b") 14-15 "b"
            IdentifierReference("c") 18-19 "c"
            SpreadElement 22-27 "... d"
              IdentifierReference("d") 26-27 "d"
            SpreadElement 30-35 "... e"
              IdentifierReference("e") 34-35 "e"
            IdentifierReference("f") 38-39 "f"
*******************************************************************************/
