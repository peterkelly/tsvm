import foo , { a , b , c } from "foo.js" ;

/*******************************************************************************
ast-module

Module 0-42 "import foo , { a , b , c } from \"foo.js\" ;"
  [] 0-42 "import foo , { a , b , c } from \"foo.js\" ;"
    ImportFrom 0-42 "import foo , { a , b , c } from \"foo.js\" ;"
      DefaultAndNamedImports 7-26 "foo , { a , b , c }"
        BindingIdentifier("foo") 7-10 "foo"
        NamedImports 13-26 "{ a , b , c }"
          [] 15-24 "a , b , c"
            ImportSpecifier 15-16 "a"
              BindingIdentifier("a") 15-16 "a"
            ImportSpecifier 19-20 "b"
              BindingIdentifier("b") 19-20 "b"
            ImportSpecifier 23-24 "c"
              BindingIdentifier("c") 23-24 "c"
      "foo.js" 32-40 "\"foo.js\""
*******************************************************************************/
