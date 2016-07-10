export { a , b , c } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-36 "export { a , b , c } from \"foo.js\" ;"
  [] 0-36 "export { a , b , c } from \"foo.js\" ;"
    ExportFrom 0-36 "export { a , b , c } from \"foo.js\" ;"
      ExportClause 7-20 "{ a , b , c }"
        [] 9-18 "a , b , c"
          ExportNormalSpecifier 9-10 "a"
            Identifier("a") 9-10 "a"
          ExportNormalSpecifier 13-14 "b"
            Identifier("b") 13-14 "b"
          ExportNormalSpecifier 17-18 "c"
            Identifier("c") 17-18 "c"
      "foo.js" 26-34 "\"foo.js\""
*******************************************************************************/
