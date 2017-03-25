import { Range, ASTNode } from "./parser/ast";
import {
    StringLiteralNode,
} from "./execution/expressions";
import {
    FunctionDeclarationNode,
} from "./execution/functions";

export function cpsTransform(root: ASTNode): void {
    const output: string[] = [];

    const transformed = root.cpsTransform(
        new StringLiteralNode(new Range(0,0),"[RETURN]"),
        new StringLiteralNode(new Range(0,0),"[EXCEPTION]"),
    );

    transformed.prettyPrint("","",output);
    let combined = output.join("");
    combined = combined.replace(/\n$/,"");
    console.log(combined);

}
