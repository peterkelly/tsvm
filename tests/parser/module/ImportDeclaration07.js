import { a , b , c } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-36 "import { a , b , c } from \"foo.js\" ;"
  [] 0-36 "import { a , b , c } from \"foo.js\" ;"
    ImportFrom 0-36 "import { a , b , c } from \"foo.js\" ;"
      NamedImports 7-20 "{ a , b , c }"
        [] 9-18 "a , b , c"
          ImportSpecifier 9-10 "a"
            BindingIdentifier("a") 9-10 "a"
          ImportSpecifier 13-14 "b"
            BindingIdentifier("b") 13-14 "b"
          ImportSpecifier 17-18 "c"
            BindingIdentifier("c") 17-18 "c"
      "foo.js" 26-34 "\"foo.js\""
*******************************************************************************/
