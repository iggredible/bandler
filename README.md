# Bandler

The simplest Javascript module bundler. Capable of bundling simple __CJS__ or __ESM__ modules. 

## Why did I create this?

At work we use [webpack](https://github.com/webpack/webpack) and I use [rollup](https://github.com/rollup/rollup) for personal use. Up to this point, much of the bundling process is rather magical. You tell them where the entry is, designate output, and poof! Your code is [automagically](https://www.lexico.com/en/definition/automagically) bundled.

I created this project mainly to teach myself how bundler works. My hope is that others could understand how bundlers work from this project.

This project is inspired by [minipack](https://github.com/ronami/minipack) and [wbpck-bundler](https://github.com/adamisntdead/wbpck-bundler), both of which accomplishes similar things. In case you're wondering, the main difference is that minipack bundles ES6 and wbpck-bundler bundles CJS. Bandler attempts to bundle *both* CJS and ES6 without additional config from user.

With that being said, this project is __not__ production-ready. This is not a webpack/ rollup replacement. This is a toy bundler 🎁. You have been warned.

## Usage

Run `node ./bandler.js /direction/to/entry.js`

1. Install dependencies: `npm i`

2. This project has 2 examples: `./example1/entry.js` uses ES6 modules and `./example2/entry.js` uses CJS modules

3. Run either entries, for example: `node ./bandler.js ./example2/entry.js`

It will output the bundled code on terminal, such as this:

```
(function(modules){
  const require = id => {
    const {factory, map} = modules[id];
    const localRequire = requireDeclarationName => require(map[requireDeclarationName]);
    const module = {exports: {}};

    factory(module, localRequire);
    return module.exports;
  }
  require(0);
})({0: {
    factory: (module, require) => {
      const module1 = require('./module1.js');

      module1();

    },
    map: {"./module1.js":1}
  },1: {
    factory: (module, require) => {
      "use strict";

      var module1 = function module1() {
      console.log("Hello from module1!");
  };

      module.exports = module1;
    },
    map: {}
}})
```
The code above is a bundled code from example2 entry and all its dependencies. Copy/paste the code on your browser console to see the code above works _(disclaimer: it is just console.log)_. 

## Contributing

If you think this project could be made clearer/ better/ found bugs, please feel free to submit PRs.
