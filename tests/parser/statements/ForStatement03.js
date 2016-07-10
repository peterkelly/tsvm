for ( i = 0 ; i < 10 ; i = i + 1 ) {
  total = total + i ;
}

/*******************************************************************************
ast-module

Module 0-60 "for ( i = 0 ; i < 10 ; i = i + 1 ) {\n  total = total + i ;\n}"
  [] 0-60 "for ( i = 0 ; i < 10 ; i = i + 1 ) {\n  total = total + i ;\n}"
    ForC 0-60 "for ( i = 0 ; i < 10 ; i = i + 1 ) {\n  total = total + i ;\n}"
      Assign 6-11 "i = 0"
        IdentifierReference("i") 6-7 "i"
        0 10-11 "0"
      LessThan 14-20 "i < 10"
        IdentifierReference("i") 14-15 "i"
        10 18-20 "10"
      Assign 23-32 "i = i + 1"
        IdentifierReference("i") 23-24 "i"
        Add 27-32 "i + 1"
          IdentifierReference("i") 27-28 "i"
          1 31-32 "1"
      Block 35-60 "{\n  total = total + i ;\n}"
        [] 39-58 "total = total + i ;"
          ExpressionStatement 39-58 "total = total + i ;"
            Assign 39-56 "total = total + i"
              IdentifierReference("total") 39-44 "total"
              Add 47-56 "total + i"
                IdentifierReference("total") 47-52 "total"
                IdentifierReference("i") 55-56 "i"
*******************************************************************************/
