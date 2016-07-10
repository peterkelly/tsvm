for ( x of y ) {
  total = total + x ;
}

/*******************************************************************************
ast-module

Module 0-40 "for ( x of y ) {\n  total = total + x ;\n}"
  [] 0-40 "for ( x of y ) {\n  total = total + x ;\n}"
    ForOf 0-40 "for ( x of y ) {\n  total = total + x ;\n}"
      IdentifierReference("x") 6-7 "x"
      IdentifierReference("y") 11-12 "y"
      Block 15-40 "{\n  total = total + x ;\n}"
        [] 19-38 "total = total + x ;"
          ExpressionStatement 19-38 "total = total + x ;"
            Assign 19-36 "total = total + x"
              IdentifierReference("total") 19-24 "total"
              Add 27-36 "total + x"
                IdentifierReference("total") 27-32 "total"
                IdentifierReference("x") 35-36 "x"
*******************************************************************************/
