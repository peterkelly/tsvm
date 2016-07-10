a === b === c === d ;

/*******************************************************************************
ast-module

Module 0-21 "a === b === c === d ;"
  [] 0-21 "a === b === c === d ;"
    ExpressionStatement 0-21 "a === b === c === d ;"
      StrictEquals 0-19 "a === b === c === d"
        StrictEquals 0-13 "a === b === c"
          StrictEquals 0-7 "a === b"
            IdentifierReference("a") 0-1 "a"
            IdentifierReference("b") 6-7 "b"
          IdentifierReference("c") 12-13 "c"
        IdentifierReference("d") 18-19 "d"
*******************************************************************************/
