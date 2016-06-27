( class Foo extends Bar {
} ) ;

/*******************************************************************************
ast-module

Module
  []
    ExpressionStatement
      ClassExpression
        BindingIdentifier("Foo")
        ClassTail
          Extends
            IdentifierReference("Bar")
          []
*******************************************************************************/
