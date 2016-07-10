import { a , } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-30 "import { a , } from \"foo.js\" ;"
  [] 0-30 "import { a , } from \"foo.js\" ;"
    ImportFrom 0-30 "import { a , } from \"foo.js\" ;"
      NamedImports 7-14 "{ a , }"
        [] 9-10 "a"
          ImportSpecifier 9-10 "a"
            BindingIdentifier("a") 9-10 "a"
      "foo.js" 20-28 "\"foo.js\""
*******************************************************************************/
