export { a as x , b as y , c as z } ;

/*******************************************************************************
ast-module

Module 0-37 "export { a as x , b as y , c as z } ;"
  [] 0-37 "export { a as x , b as y , c as z } ;"
    ExportPlain 0-37 "export { a as x , b as y , c as z } ;"
      ExportClause 7-35 "{ a as x , b as y , c as z }"
        [] 9-33 "a as x , b as y , c as z"
          ExportAsSpecifier 9-15 "a as x"
            Identifier("a") 9-10 "a"
            Identifier("x") 14-15 "x"
          ExportAsSpecifier 18-24 "b as y"
            Identifier("b") 18-19 "b"
            Identifier("y") 23-24 "y"
          ExportAsSpecifier 27-33 "c as z"
            Identifier("c") 27-28 "c"
            Identifier("z") 32-33 "z"
*******************************************************************************/
