export default function foo ( ) { } ;

/*******************************************************************************
ast-module

Module 0-37 "export default function foo ( ) { } ;"
  [] 0-37 "export default function foo ( ) { } ;"
    ExportDefault 0-35 "export default function foo ( ) { }"
      FunctionDeclaration 15-35 "function foo ( ) { }"
        BindingIdentifier("foo") 24-27 "foo"
        FormalParameters1 30-30 ""
        [] 34-34 ""
    EmptyStatement 36-37 ";"
*******************************************************************************/
