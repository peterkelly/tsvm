export { a as x , b as y , c as z , } from "foo.js" ;

/*******************************************************************************
ast-module

Module
  []
    ExportFrom
      ExportClause
        []
          ExportAsSpecifier
            Identifier("a")
            Identifier("x")
          ExportAsSpecifier
            Identifier("b")
            Identifier("y")
          ExportAsSpecifier
            Identifier("c")
            Identifier("z")
      "foo.js"
*******************************************************************************/
