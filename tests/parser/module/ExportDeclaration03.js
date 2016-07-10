export { a } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-28 "export { a } from \"foo.js\" ;"
  [] 0-28 "export { a } from \"foo.js\" ;"
    ExportFrom 0-28 "export { a } from \"foo.js\" ;"
      ExportClause 7-12 "{ a }"
        [] 9-10 "a"
          ExportNormalSpecifier 9-10 "a"
            Identifier("a") 9-10 "a"
      "foo.js" 18-26 "\"foo.js\""
*******************************************************************************/
