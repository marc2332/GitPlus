
module.exports = {
  gitParser : class  {
    constructor({path}){
      const { exec } = require("child_process");
      this.path = path;
      const me = this;
      this.status= () => {
        let promise_call = new Promise((resolve, reject) => {
          const test = exec(`git status --short`,{ cwd: me.path},(err,data) => {
            const splitted_content = data.split(" ");
            const modified_array = []
            const added_array = []
            const untracked_array = []
            const renamed_array = []
            splitted_content.map(( word, index)=>{
              if( word.includes("M") ){
                modified_array.push(splitted_content[index+1].split("\n")[0])
              }else if( word.includes("A") ){
                added_array.push(splitted_content[index+1].split("\n")[0])
              }else if( word.includes("??") ){
                untracked_array.push(splitted_content[index+1].split("\n")[0])
              }else if( word.includes("R") ){
                renamed_array.push(splitted_content[index+1].split("\n")[0])
              }
            })
            modified_array.filter(Boolean)
            added_array.filter(Boolean)
            untracked_array.filter(Boolean)
            renamed_array.filter(Boolean)
            resolve({
              'modified':modified_array,
              'added':added_array,
              'untracked':untracked_array,
              'renamed':renamed_array
            })
            test.kill()
          });
        });
        return promise_call;
      }
    }
  }
};
