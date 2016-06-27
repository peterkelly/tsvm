import { a as x , b as y , c as z } from "foo.js" ;

/*******************************************************************************
ast-module

Module
  []
    ImportFrom
      NamedImports
        []
          ImportAsSpecifier
            Identifier("a")
            BindingIdentifier("x")
          ImportAsSpecifier
            Identifier("b")
            BindingIdentifier("y")
          ImportAsSpecifier
            Identifier("c")
            BindingIdentifier("z")
      "foo.js"
*******************************************************************************/
