export default class Foo { } ;

/*******************************************************************************
ast-module

Module 0-30 "export default class Foo { } ;"
  [] 0-30 "export default class Foo { } ;"
    ExportDefault 0-28 "export default class Foo { }"
      ClassDeclaration 15-28 "class Foo { }"
        BindingIdentifier("Foo") 21-24 "Foo"
        ClassTail 25-28 "{ }"
          null
          [] 27-27 ""
    EmptyStatement 29-30 ";"
*******************************************************************************/
