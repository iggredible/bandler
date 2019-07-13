// get user input and pass it to the bundler function from index.js
const exampleFilePath = process.argv[2];

require("./index.js")(exampleFilePath);
