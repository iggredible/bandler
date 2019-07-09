const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser"); // parses and returns AST
const traverse = require("@babel/traverse").default; // AST walker
const babel = require("@babel/core");
const util = require("util");

let ID = 0;

function createModuleInfo(filePath) {
  const content = fs.readFileSync(filePath, "utf-8"); // read entry.js content
  const ast = parser.parse(content, {
    // parse entry.js content
    // create AST from content
    sourceType: "module"
  });
  const deps = [];
  traverse(ast, {
    // traverse ast from parse, find ImportDeclaration's source.value
    ImportDeclaration: ({ node }) => {
      deps.push(node.source.value); // append that value(s) into deps array
    }
  });
  // deps now is an array containing ALL dependencies
  const id = ID++;
  const { code } = babel.transformFromAstSync(ast, null, {
    // transfrom ast using @babel/preset-env presets - looks like CJS
    presets: ["@babel/preset-env"]
  });

  return {
    id,
    filePath,
    deps,
    code
  };
}

createModuleInfo("entry.js");
