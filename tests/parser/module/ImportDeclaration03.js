import * as foo from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-31 "import * as foo from \"foo.js\" ;"
  [] 0-31 "import * as foo from \"foo.js\" ;"
    ImportFrom 0-31 "import * as foo from \"foo.js\" ;"
      NameSpaceImport 7-15 "* as foo"
        BindingIdentifier("foo") 12-15 "foo"
      "foo.js" 21-29 "\"foo.js\""
*******************************************************************************/
