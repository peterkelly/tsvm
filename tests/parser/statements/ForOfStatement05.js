for ( let x of y ) {
  total = total + x ;
}

/*******************************************************************************
ast-module

Module 0-44 "for ( let x of y ) {\n  total = total + x ;\n}"
  [] 0-44 "for ( let x of y ) {\n  total = total + x ;\n}"
    ForOf 0-44 "for ( let x of y ) {\n  total = total + x ;\n}"
      LetForDeclaration 6-11 "let x"
        BindingIdentifier("x") 10-11 "x"
      IdentifierReference("y") 15-16 "y"
      Block 19-44 "{\n  total = total + x ;\n}"
        [] 23-42 "total = total + x ;"
          ExpressionStatement 23-42 "total = total + x ;"
            Assign 23-40 "total = total + x"
              IdentifierReference("total") 23-28 "total"
              Add 31-40 "total + x"
                IdentifierReference("total") 31-36 "total"
                IdentifierReference("x") 39-40 "x"
*******************************************************************************/
