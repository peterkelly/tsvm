for ( const x in y ) {
  total = total + x ;
}

/*******************************************************************************
ast-module

Module 0-46 "for ( const x in y ) {\n  total = total + x ;\n}"
  [] 0-46 "for ( const x in y ) {\n  total = total + x ;\n}"
    ForIn 0-46 "for ( const x in y ) {\n  total = total + x ;\n}"
      ConstForDeclaration 6-13 "const x"
        BindingIdentifier("x") 12-13 "x"
      IdentifierReference("y") 17-18 "y"
      Block 21-46 "{\n  total = total + x ;\n}"
        [] 25-44 "total = total + x ;"
          ExpressionStatement 25-44 "total = total + x ;"
            Assign 25-42 "total = total + x"
              IdentifierReference("total") 25-30 "total"
              Add 33-42 "total + x"
                IdentifierReference("total") 33-38 "total"
                IdentifierReference("x") 41-42 "x"
*******************************************************************************/
