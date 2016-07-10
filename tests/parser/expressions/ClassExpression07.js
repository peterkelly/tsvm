( class Foo extends Bar {
} ) ;

/*******************************************************************************
ast-module

Module 0-31 "( class Foo extends Bar {\n} ) ;"
  [] 0-31 "( class Foo extends Bar {\n} ) ;"
    ExpressionStatement 0-31 "( class Foo extends Bar {\n} ) ;"
      ClassExpression 2-27 "class Foo extends Bar {\n}"
        BindingIdentifier("Foo") 8-11 "Foo"
        ClassTail 12-27 "extends Bar {\n}"
          Extends 12-23 "extends Bar"
            IdentifierReference("Bar") 20-23 "Bar"
          [] 26-26 ""
*******************************************************************************/
