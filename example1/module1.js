import module2 from "./module2.js";

const module1 = () => {
  module2();
  console.log("hello from module1!");
};
export default module1;
