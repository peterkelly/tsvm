( class {
  test ( ) {
  }
  static test ( ) {
  }
  get foo ( ) {
  }
  set foo ( value ) {
  }
} ) ;

/*******************************************************************************
ast-module

Module 0-102 "( class {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n} ) ;"
  [] 0-102 "( class {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n} ) ;"
    ExpressionStatement 0-102 "( class {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n} ) ;"
      ClassExpression 2-98 "class {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n}"
        null
        ClassTail 8-98 "{\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n}"
          null
          [] 12-96 "test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }"
            Method 12-26 "test ( ) {\n  }"
              Identifier("test") 12-16 "test"
              FormalParameters1 19-19 ""
              [] 25-25 ""
            StaticMethodDefinition 29-50 "static test ( ) {\n  }"
              Method 36-50 "test ( ) {\n  }"
                Identifier("test") 36-40 "test"
                FormalParameters1 43-43 ""
                [] 49-49 ""
            Getter 53-70 "get foo ( ) {\n  }"
              Identifier("foo") 57-60 "foo"
              [] 69-69 ""
            Setter 73-96 "set foo ( value ) {\n  }"
              Identifier("foo") 77-80 "foo"
              BindingIdentifier("value") 83-88 "value"
              [] 95-95 ""
*******************************************************************************/
