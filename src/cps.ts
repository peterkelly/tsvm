import { ASTNode } from "./parser/ast";

export function cpsTransform(root: ASTNode): void {
    const output: string[] = [];
    root.prettyPrint("","",output);
    let combined = output.join("");
    combined = combined.replace(/\n$/,"");
    console.log(combined);
}
