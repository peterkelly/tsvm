var fs = require("fs");

var input = fs.readFileSync("src/syntax.ts", { encoding: "utf-8" });
var lines = input.split("\n");

var inDefinition = false;
var first = true;
for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^grm\.define/)) {
        inDefinition = true;
        if (!first)
            console.log();
        first = false;
    }
    else {
        // line = line.replace(/ *\/\/.*$/,"");
        if (line.match(/^[^ ]/) && !line.match(/^grm\.define/))
            inDefinition = false;
    }
    if (inDefinition) {
        line = line.replace(/ *\/\/.*$/,"");
        if (line.length > 0)
            console.log(line);
    }
}
console.log();
console.log();
