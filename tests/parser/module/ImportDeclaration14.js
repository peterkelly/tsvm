import foo , * as bar from "foo.js" ;

/*******************************************************************************
ast-module

Module
  []
    ImportFrom
      ImportedDefaultBinding
        BindingIdentifier("foo")
        NameSpaceImport
          BindingIdentifier("bar")
      "foo.js"
*******************************************************************************/
