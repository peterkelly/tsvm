delete void typeof ++ -- + - ~ ! x ;

/*******************************************************************************
ast-module

Module 0-36 "delete void typeof ++ -- + - ~ ! x ;"
  [] 0-36 "delete void typeof ++ -- + - ~ ! x ;"
    ExpressionStatement 0-36 "delete void typeof ++ -- + - ~ ! x ;"
      Delete 0-34 "delete void typeof ++ -- + - ~ ! x"
        Void 7-34 "void typeof ++ -- + - ~ ! x"
          TypeOf 12-34 "typeof ++ -- + - ~ ! x"
            PreIncrement 19-34 "++ -- + - ~ ! x"
              PreDecrement 22-34 "-- + - ~ ! x"
                UnaryPlus 25-34 "+ - ~ ! x"
                  UnaryMinus 27-34 "- ~ ! x"
                    UnaryBitwiseNot 29-34 "~ ! x"
                      UnaryLogicalNot 31-34 "! x"
                        IdentifierReference("x") 33-34 "x"
*******************************************************************************/
