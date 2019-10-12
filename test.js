const gitParser = require("./core/index.js").gitParser;

const my_repo = new gitParser({
  path:__dirname
})

my_repo.status().then((result)=>{
  console.log(result)
})
