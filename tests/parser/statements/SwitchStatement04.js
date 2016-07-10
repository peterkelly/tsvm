switch ( x ) {
  default : ;
}

/*******************************************************************************
ast-module

Module 0-30 "switch ( x ) {\n  default : ;\n}"
  [] 0-30 "switch ( x ) {\n  default : ;\n}"
    SwitchStatement 0-30 "switch ( x ) {\n  default : ;\n}"
      IdentifierReference("x") 9-10 "x"
      [] 17-28 "default : ;"
        DefaultClause 17-28 "default : ;"
          [] 27-28 ";"
            EmptyStatement 27-28 ";"
*******************************************************************************/
