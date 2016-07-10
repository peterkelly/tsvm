class Foo {
  test ( ) {
  }
  static test ( ) {
  }
  get foo ( ) {
  }
  set foo ( value ) {
  }
}

/*******************************************************************************
ast-module

Module 0-100 "class Foo {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n}"
  [] 0-100 "class Foo {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n}"
    ClassDeclaration 0-100 "class Foo {\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n}"
      BindingIdentifier("Foo") 6-9 "Foo"
      ClassTail 10-100 "{\n  test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }\n}"
        null
        [] 14-98 "test ( ) {\n  }\n  static test ( ) {\n  }\n  get foo ( ) {\n  }\n  set foo ( value ) {\n  }"
          Method 14-28 "test ( ) {\n  }"
            Identifier("test") 14-18 "test"
            [] 21-21 ""
            [] 27-27 ""
          StaticMethodDefinition 31-52 "static test ( ) {\n  }"
            Method 38-52 "test ( ) {\n  }"
              Identifier("test") 38-42 "test"
              [] 45-45 ""
              [] 51-51 ""
          Getter 55-72 "get foo ( ) {\n  }"
            Identifier("foo") 59-62 "foo"
            [] 71-71 ""
          Setter 75-98 "set foo ( value ) {\n  }"
            Identifier("foo") 79-82 "foo"
            BindingIdentifier("value") 85-90 "value"
            [] 97-97 ""
*******************************************************************************/
