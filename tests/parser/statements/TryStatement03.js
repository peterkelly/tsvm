try {
}
catch ( e ) {
}
finally {
}

/*******************************************************************************
ast-module

Module 0-35 "try {\n}\ncatch ( e ) {\n}\nfinally {\n}"
  [] 0-35 "try {\n}\ncatch ( e ) {\n}\nfinally {\n}"
    TryStatement 0-35 "try {\n}\ncatch ( e ) {\n}\nfinally {\n}"
      Block 4-7 "{\n}"
        [] 6-6 ""
      Catch 8-23 "catch ( e ) {\n}"
        BindingIdentifier("e") 16-17 "e"
        Block 20-23 "{\n}"
          [] 22-22 ""
      Finally 24-35 "finally {\n}"
        Block 32-35 "{\n}"
          [] 34-34 ""
*******************************************************************************/
