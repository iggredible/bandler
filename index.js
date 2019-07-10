const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser"); // parses and returns AST
const traverse = require("@babel/traverse").default; // AST walker
const babel = require("@babel/core"); // main babel functionality

let ID = 0;

/*
 * Given filePath, return module information
 * Module information includes:
 * module ID
 * module filePath
 * all dependencies used in the module (in array form)
 * code inside the module
 */
function createModuleInfo(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module"
  });
  const deps = [];
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      deps.push(node.source.value);
    }
  });
  const id = ID++;
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"]
  });

  return {
    id,
    filePath,
    deps,
    code
  };
}

/*
 * Given entry path,
 * returns an array containing information from each module
 */
function createDependencyGraph(entry) {
  const entryInfo = createModuleInfo(entry);
  const graphArr = [];
  graphArr.push(entryInfo);
  for (const module of graphArr) {
    module.map = {};
    module.deps.forEach(depPath => {
      const baseDir = path.dirname(module.filePath);
      const baseModuleDir = path.join(baseDir, depPath);
      const absPath = path.resolve(baseModuleDir);

      const moduleInfo = createModuleInfo(absPath);
      graphArr.push(moduleInfo);
      module.map[depPath] = moduleInfo.id;
    });
  }
  return graphArr;
}

/*
 * Given an array containing information from each module
 * return a bundled code to run the modules
 */
function pack(graph) {
  const moduleArgArr = graph.map(module => {
    return `${module.id}: {
      factory: (exports, require) => {
        ${module.code}
      },
      map: ${JSON.stringify(module.map)}
    }`;
  });
  const iifeBundler = `(function(modules){
    const require = id => {
      const {factory, map} = modules[id];
      const localRequire = requireDeclarationName => require(map[requireDeclarationName]); 
      const module = {exports: {}};

      factory(module.exports, localRequire); 
      return module.exports; 
    } 
    require(0);
  })({${moduleArgArr.join()}})
  `;
  return iifeBundler;
}

console.log("***** Copy code below and paste into browser *****");

/* create dependency graph */
const graph = createDependencyGraph("./example1/entry.js");
/* create bundle based on dependency graph */
const bundle = pack(graph);

console.log(bundle);
console.log("***** Copy code above and paste into browser *****");
