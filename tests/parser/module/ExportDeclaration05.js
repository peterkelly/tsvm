export { a , b , c } from "foo.js" ;

/*******************************************************************************
ast-module

Module
  []
    ExportFrom
      ExportClause
        []
          ExportNormalSpecifier
            Identifier("a")
          ExportNormalSpecifier
            Identifier("b")
          ExportNormalSpecifier
            Identifier("c")
      "foo.js"
*******************************************************************************/
