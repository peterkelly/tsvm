import foo , { a , b , c } from "foo.js" ;

/*******************************************************************************
ast-module

Module
  []
    ImportFrom
      ImportedDefaultBinding
        BindingIdentifier("foo")
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
