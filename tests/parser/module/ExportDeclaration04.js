export { a , } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-30 "export { a , } from \"foo.js\" ;"
  [] 0-30 "export { a , } from \"foo.js\" ;"
    ExportFrom 0-30 "export { a , } from \"foo.js\" ;"
      ExportClause 7-14 "{ a , }"
        [] 9-10 "a"
          ExportNormalSpecifier 9-10 "a"
            Identifier("a") 9-10 "a"
      "foo.js" 20-28 "\"foo.js\""
*******************************************************************************/
