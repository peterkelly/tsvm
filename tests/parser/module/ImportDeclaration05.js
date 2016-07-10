import { a } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-28 "import { a } from \"foo.js\" ;"
  [] 0-28 "import { a } from \"foo.js\" ;"
    ImportFrom 0-28 "import { a } from \"foo.js\" ;"
      NamedImports 7-12 "{ a }"
        [] 9-10 "a"
          ImportSpecifier 9-10 "a"
            BindingIdentifier("a") 9-10 "a"
      "foo.js" 18-26 "\"foo.js\""
*******************************************************************************/
