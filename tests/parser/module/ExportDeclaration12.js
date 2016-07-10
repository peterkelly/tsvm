export { a as x } ;

/*******************************************************************************
ast-module

Module 0-19 "export { a as x } ;"
  [] 0-19 "export { a as x } ;"
    ExportPlain 0-19 "export { a as x } ;"
      ExportClause 7-17 "{ a as x }"
        [] 9-15 "a as x"
          ExportAsSpecifier 9-15 "a as x"
            Identifier("a") 9-10 "a"
            Identifier("x") 14-15 "x"
*******************************************************************************/
