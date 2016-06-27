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

Module
  []
    ClassDeclaration
      BindingIdentifier("Foo")
      ClassTail
        null
        []
          Method
            Identifier("test")
            []
            []
          StaticMethodDefinition
            Method
              Identifier("test")
              []
              []
          Getter
            Identifier("foo")
            []
          Setter
            Identifier("foo")
            BindingIdentifier("value")
            []
*******************************************************************************/
