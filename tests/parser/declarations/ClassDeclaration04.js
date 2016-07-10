class Foo {
  ;
  ;
  ;
}

/*******************************************************************************
ast-module

Module 0-25 "class Foo {\n  ;\n  ;\n  ;\n}"
  [] 0-25 "class Foo {\n  ;\n  ;\n  ;\n}"
    ClassDeclaration 0-25 "class Foo {\n  ;\n  ;\n  ;\n}"
      BindingIdentifier("Foo") 6-9 "Foo"
      ClassTail 10-25 "{\n  ;\n  ;\n  ;\n}"
        null
        [] 14-23 ";\n  ;\n  ;"
          EmptyClassElement 14-15 ";"
          EmptyClassElement 18-19 ";"
          EmptyClassElement 22-23 ";"
*******************************************************************************/
