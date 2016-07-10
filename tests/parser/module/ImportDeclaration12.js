import { a as x , b as y , c as z , } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-53 "import { a as x , b as y , c as z , } from \"foo.js\" ;"
  [] 0-53 "import { a as x , b as y , c as z , } from \"foo.js\" ;"
    ImportFrom 0-53 "import { a as x , b as y , c as z , } from \"foo.js\" ;"
      NamedImports 7-37 "{ a as x , b as y , c as z , }"
        [] 9-33 "a as x , b as y , c as z"
          ImportAsSpecifier 9-15 "a as x"
            Identifier("a") 9-10 "a"
            BindingIdentifier("x") 14-15 "x"
          ImportAsSpecifier 18-24 "b as y"
            Identifier("b") 18-19 "b"
            BindingIdentifier("y") 23-24 "y"
          ImportAsSpecifier 27-33 "c as z"
            Identifier("c") 27-28 "c"
            BindingIdentifier("z") 32-33 "z"
      "foo.js" 43-51 "\"foo.js\""
*******************************************************************************/
