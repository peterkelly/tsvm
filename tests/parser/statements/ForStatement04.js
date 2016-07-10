for ( var i = 0 ; i < 10 ; i = i + 1 ) {
  total = total + i ;
}

/*******************************************************************************
ast-module

Module 0-64 "for ( var i = 0 ; i < 10 ; i = i + 1 ) {\n  total = total + i ;\n}"
  [] 0-64 "for ( var i = 0 ; i < 10 ; i = i + 1 ) {\n  total = total + i ;\n}"
    ForC 0-64 "for ( var i = 0 ; i < 10 ; i = i + 1 ) {\n  total = total + i ;\n}"
      Var 6-15 "var i = 0"
        [] 10-15 "i = 0"
          VarIdentifier 10-15 "i = 0"
            BindingIdentifier("i") 10-11 "i"
            0 14-15 "0"
      LessThan 18-24 "i < 10"
        IdentifierReference("i") 18-19 "i"
        10 22-24 "10"
      Assign 27-36 "i = i + 1"
        IdentifierReference("i") 27-28 "i"
        Add 31-36 "i + 1"
          IdentifierReference("i") 31-32 "i"
          1 35-36 "1"
      Block 39-64 "{\n  total = total + i ;\n}"
        [] 43-62 "total = total + i ;"
          ExpressionStatement 43-62 "total = total + i ;"
            Assign 43-60 "total = total + i"
              IdentifierReference("total") 43-48 "total"
              Add 51-60 "total + i"
                IdentifierReference("total") 51-56 "total"
                IdentifierReference("i") 59-60 "i"
*******************************************************************************/
