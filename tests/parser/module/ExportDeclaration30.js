export default function * foo ( ) { } ;

/*******************************************************************************
ast-module

Module 0-39 "export default function * foo ( ) { } ;"
  [] 0-39 "export default function * foo ( ) { } ;"
    ExportDefault 0-37 "export default function * foo ( ) { }"
      GeneratorDeclaration 15-37 "function * foo ( ) { }"
        BindingIdentifier("foo") 26-29 "foo"
        [] 32-32 ""
        [] 36-36 ""
    EmptyStatement 38-39 ";"
*******************************************************************************/
