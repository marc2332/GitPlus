
if(GravitonInfo.version !== "1.2.0") {
  console.warn("GitPlus doesn't work on your current version, you need at least 1.2.0")
  new Notification({
    title:"GitPlus",
    content:"You need Graviton v1.2.0+"}
  )
  return;
}

const gitParser = require("./core/index.js").gitParser;

const refresh = (my_repo) =>{
  my_repo.status().then((result)=>{
     result.modified.map((file)=>{
      const element = document.getElementById((graviton.getCurrentDirectory()+file+"_div").replace(/\\|(\/)|\s/g,""));
        if(element!=undefined && element.getAttribute("gitted")!=="true"){
          element.setAttribute("gitted","true");
          element.title += " · Modified"
          element.children[1].style.color="var(--accentColor)";
          element.children[1].innerHTML += `<b> · M</b>`
      }

    })
  })
}

document.addEventListener("loaded_project",()=>{
  const my_repo = new gitParser({
    path:graviton.getCurrentDirectory()
  })
  refresh(my_repo)
  document.addEventListener("file_saved",()=>{
    Explorer.load(graviton.getCurrentDirectory(),'g_directories',"true")
    refresh(my_repo)
  })
  document.addEventListener("load_explorer",()=>{
    refresh(my_repo)
  })
})


const PitPlus = new dropMenu({
	id:"git_plus_dm"
});

PitPlus.setList({
  "button": "GitPlus",
  "list":{
     "Commit":{
        click: () => {
          const my_dialog = new Dialog({
              id:'my_dialog1',
              title:'Commit message',
              content:`<input class="section-1 input2" placeHolder="A commit..." id="commit_label"></input>`,
              buttons: {
                  'Continue':{
                    click:()=>{
                      const my_repo = new gitParser({
                        path:graviton.getCurrentDirectory()
                      })
                      const { exec } = require("child_process");
                      exec(`cd ${graviton.getCurrentDirectory()} && git add * && git commit -m ${document.getElementById("commit_label").value} `, (a,content,b) => {
                        refresh(my_repo)
                        Explorer.load(graviton.getCurrentDirectory(),'g_directories',true)
                      })
                    }
                  }
              }
          })
        }
      }
  }
})
