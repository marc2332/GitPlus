const gitParser = require("./core/index.js").gitParser;

const my_repo = new gitParser({
  path:__dirname
})

my_repo.checkGit().then((result)=>{
  console.log(`· Git is${result.installed === true? "":" not"} installed.`)
})

my_repo.getStatus().then((result)=>{
  console.log(`· Modified files: `)
  result.modified.forEach((item,index)=>{
    console.log(`  ${index} - ${item.split(/,/gm)[0]}`)
  })
})
