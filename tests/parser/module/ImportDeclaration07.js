import { a , b , c } from "foo.js" ;

/*******************************************************************************
ast-module

Module
  []
    ImportFrom
      NamedImports
        []
          ImportSpecifier
            BindingIdentifier("a")
          ImportSpecifier
            BindingIdentifier("b")
          ImportSpecifier
            BindingIdentifier("c")
      "foo.js"
*******************************************************************************/
