const Singleton = (()=>{
  let instanciated;
  let init = ()=>({
       publicMethod(){
           console.log("hello world");
       },
       publicProperty:'test'
  })
  return {
    getInstance(){
        if(!instanciated){
          instanciated = init();
        }
        return instanciated;
    }
  }
})();
Singleton.getInstance().publicMethod();
Singleton.getInstance().publicMethod();
Singleton.getInstance().publicMethod();
console.log(Singleton.getInstance().publicProperty);
