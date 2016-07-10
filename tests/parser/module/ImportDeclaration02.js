import a from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-24 "import a from \"foo.js\" ;"
  [] 0-24 "import a from \"foo.js\" ;"
    ImportFrom 0-24 "import a from \"foo.js\" ;"
      DefaultImport 7-8 "a"
        BindingIdentifier("a") 7-8 "a"
      "foo.js" 14-22 "\"foo.js\""
*******************************************************************************/
