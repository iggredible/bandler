import module2 from "./module2.js";

module2();
export const module1 = () => {
  module2();
  console.log("hello from module1!");
};
