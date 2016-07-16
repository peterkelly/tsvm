export function * foo ( ) { } ;

/*******************************************************************************
ast-module

Module 0-31 "export function * foo ( ) { } ;"
  [] 0-31 "export function * foo ( ) { } ;"
    ExportDeclaration 0-29 "export function * foo ( ) { }"
      GeneratorDeclaration 7-29 "function * foo ( ) { }"
        BindingIdentifier("foo") 18-21 "foo"
        FormalParameters1 24-24 ""
        [] 28-28 ""
    EmptyStatement 30-31 ";"
*******************************************************************************/
