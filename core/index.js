
module.exports = {
  gitParser : class  {
    constructor({path}){
      const { exec } = require("child_process");
      this.path = path;
      const me = this;
      this.status= () => {
        let promise_call = new Promise((resolve, reject) => {
          const test = exec(`git status`,{ cwd: me.path},(err,data) => {
            const splitted_content = data.split(" ");
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
            test.kill()
          });
        });
        return promise_call;
      }
    }
  }
};
