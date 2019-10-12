
module.exports = {
  gitParser : class  {
    constructor({path}){
      this.path = path;
      const me = this;
      this.status= () => {
        let promise_call = new Promise((resolve, reject) => {
          const { exec } = require("child_process");
          exec(`cd ${me.path} && git status `, (a,content,b) => {
            const splitted_content = content.split(" ");
            const filtered = []
            splitted_content.map(( word, index)=>{
              if( word.includes("modified:")){
                filtered.push(splitted_content[index+3].split("\n")[0])
              }
            })
            filtered.filter(Boolean)
            resolve({
              'modified':filtered
            })
          });
        });
        return promise_call;
      }
    }
  }
};
