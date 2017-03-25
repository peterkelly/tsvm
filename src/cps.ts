import { ASTNode } from "./parser/ast";
import {
    FunctionDeclarationNode,
} from "./execution/functions";

export function cpsTransform(root: ASTNode): void {
    const output: string[] = [];

    const transformed = root.cpsTransform([]);

    transformed.prettyPrint("","",output);
    let combined = output.join("");
    combined = combined.replace(/\n$/,"");
    console.log(combined);

}
