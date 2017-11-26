// class SingletonTester {
//   constructor(args= {}){
//     this.name = "SingletonTester";
//     this.pointX = args.pointX || 6;
//     this.pointY = args.ponitY || 10;
//   }
//   _static = {
//       name:"SingletonTester",
//       getInstance(args){
//           if(instance === undefined) {
//              instance = new SingletonTester(args);
//           }
//           return instance;
//       }
//   };
//   return _static;
// }
//
// let singletonTest = new singletonTest({pointX:5});
// console.log();

let SingletonTester = (()=> {
  let Singleton =(args = {})  =>{
       this.name = "SingletonTester";
       this.pointX = args.pointX || 6;
       this.pointY = args.ponitY || 10;
  }
  let instance;
  let _static = {
    name:"SingletonTester",
    getInstance(args) {
      if(instance === undefined) {
         instance = new Singleton(args);
      }
      return instance;
    }
  };
  return _static;
})();

var singletonTest = SingletonTester.getInstance({pointX:5});
console.log(SingletonTester.pointX);
