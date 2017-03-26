import { Range, ASTNode } from "./parser/ast";
import {
    StringLiteralNode,
    CallNode,
    MemberAccessIdentNode,
    IdentifierReferenceNode,
    makeArrow,
    makeCall,
} from "./execution/expressions";
import {
    StatementListNode,
} from "./execution/statements";
import {
    FunctionDeclarationNode,
} from "./execution/functions";

export function cpsTransform(root: ASTNode): void {
    const output: string[] = [];

    // const consoleRef = new IdentifierReferenceNode(new Range(0,0),"console");
    // const logRef = new IdentifierReferenceNode(new Range(0,0),"log");

    const transformed = root.cpsTransform(
        makeArrow(["error"],makeCall("printError",[new IdentifierReferenceNode(new Range(0,0),"error")])),
        makeArrow(["result"],makeCall("print",[new IdentifierReferenceNode(new Range(0,0),"result")])),
    );

    transformed.prettyPrint("","",output);
    let combined = output.join("");
    combined = combined.replace(/\n$/,"");
    console.log(combined);

}
