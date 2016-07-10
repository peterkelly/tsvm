class Foo extends Bar {
}

/*******************************************************************************
ast-module

Module 0-25 "class Foo extends Bar {\n}"
  [] 0-25 "class Foo extends Bar {\n}"
    ClassDeclaration 0-25 "class Foo extends Bar {\n}"
      BindingIdentifier("Foo") 6-9 "Foo"
      ClassTail 10-25 "extends Bar {\n}"
        Extends 10-21 "extends Bar"
          IdentifierReference("Bar") 18-21 "Bar"
        [] 24-24 ""
*******************************************************************************/
