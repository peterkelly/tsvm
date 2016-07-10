( class extends Bar {
} ) ;

/*******************************************************************************
ast-module

Module 0-27 "( class extends Bar {\n} ) ;"
  [] 0-27 "( class extends Bar {\n} ) ;"
    ExpressionStatement 0-27 "( class extends Bar {\n} ) ;"
      ClassExpression 2-23 "class extends Bar {\n}"
        null
        ClassTail 8-23 "extends Bar {\n}"
          Extends 8-19 "extends Bar"
            IdentifierReference("Bar") 16-19 "Bar"
          [] 22-22 ""
*******************************************************************************/
