import { a as x } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-33 "import { a as x } from \"foo.js\" ;"
  [] 0-33 "import { a as x } from \"foo.js\" ;"
    ImportFrom 0-33 "import { a as x } from \"foo.js\" ;"
      NamedImports 7-17 "{ a as x }"
        [] 9-15 "a as x"
          ImportAsSpecifier 9-15 "a as x"
            Identifier("a") 9-10 "a"
            BindingIdentifier("x") 14-15 "x"
      "foo.js" 23-31 "\"foo.js\""
*******************************************************************************/
