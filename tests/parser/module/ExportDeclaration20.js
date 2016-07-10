export var a = 1 , b = 2 , c = 3 ;

/*******************************************************************************
ast-module

Module 0-34 "export var a = 1 , b = 2 , c = 3 ;"
  [] 0-34 "export var a = 1 , b = 2 , c = 3 ;"
    ExportVariable 0-34 "export var a = 1 , b = 2 , c = 3 ;"
      Var 7-34 "var a = 1 , b = 2 , c = 3 ;"
        [] 11-32 "a = 1 , b = 2 , c = 3"
          VarIdentifier 11-16 "a = 1"
            BindingIdentifier("a") 11-12 "a"
            1 15-16 "1"
          VarIdentifier 19-24 "b = 2"
            BindingIdentifier("b") 19-20 "b"
            2 23-24 "2"
          VarIdentifier 27-32 "c = 3"
            BindingIdentifier("c") 27-28 "c"
            3 31-32 "3"
*******************************************************************************/
