import foo , * as bar from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-37 "import foo , * as bar from \"foo.js\" ;"
  [] 0-37 "import foo , * as bar from \"foo.js\" ;"
    ImportFrom 0-37 "import foo , * as bar from \"foo.js\" ;"
      DefaultAndNameSpaceImports 7-21 "foo , * as bar"
        BindingIdentifier("foo") 7-10 "foo"
        NameSpaceImport 13-21 "* as bar"
          BindingIdentifier("bar") 18-21 "bar"
      "foo.js" 27-35 "\"foo.js\""
*******************************************************************************/
