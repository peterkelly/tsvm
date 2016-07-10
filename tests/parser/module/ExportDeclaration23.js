export class Foo { } ;

/*******************************************************************************
ast-module

Module 0-22 "export class Foo { } ;"
  [] 0-22 "export class Foo { } ;"
    ExportDeclaration 0-20 "export class Foo { }"
      ClassDeclaration 7-20 "class Foo { }"
        BindingIdentifier("Foo") 13-16 "Foo"
        ClassTail 17-20 "{ }"
          null
          [] 19-19 ""
    EmptyStatement 21-22 ";"
*******************************************************************************/
