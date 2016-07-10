( class Foo {
} ) ;

/*******************************************************************************
ast-module

Module 0-19 "( class Foo {\n} ) ;"
  [] 0-19 "( class Foo {\n} ) ;"
    ExpressionStatement 0-19 "( class Foo {\n} ) ;"
      ClassExpression 2-15 "class Foo {\n}"
        BindingIdentifier("Foo") 8-11 "Foo"
        ClassTail 12-15 "{\n}"
          null
          [] 14-14 ""
*******************************************************************************/
