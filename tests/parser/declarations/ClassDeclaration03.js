class Foo {
  ;
}

/*******************************************************************************
ast-module

Module 0-17 "class Foo {\n  ;\n}"
  [] 0-17 "class Foo {\n  ;\n}"
    ClassDeclaration 0-17 "class Foo {\n  ;\n}"
      BindingIdentifier("Foo") 6-9 "Foo"
      ClassTail 10-17 "{\n  ;\n}"
        null
        [] 14-15 ";"
          EmptyClassElement 14-15 ";"
*******************************************************************************/
