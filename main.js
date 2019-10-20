if(GravitonInfo.version !== "1.2.0") {
  console.warn("GitPlus doesn't work on your current version, you need at least 1.2.0")
  new Notification({
    title:"GitPlus",
    content:"You need Graviton v1.2.0+"}
  )
  return;
}

const gitParser = require("./core/index.js").gitParser; //Import Git Repository Parser

let OLD_PARSED = {  modified:[]};

const refresh = (REPOSITORY) =>{
  REPOSITORY.getStatus().then((NEW_PARSED)=>{
    OLD_PARSED.modified.map((item)=>{
      if(!NEW_PARSED.modified.includes(item)){ //No need to redisplay on items which still being modified
        const element = document.getElementById((graviton.getCurrentDirectory()+item+"_div").replace(/\\|(\/)|\s/g,""));
        if(element!=undefined && element.getAttribute("gitted")!=="false"){
          element.setAttribute("gitted","false");
          element.title = element.title.replace("· Modified"," ")
          if(element.children[0].tagName === "DIV"){
            //Directory
            element.children[1].style = "";
            element.children[1].children[0].remove();
          }else{
            //File
            element.children[0].children[1].style = "";
            element.children[0].children[1].children[0].remove();
          }

        }
      }
    })
    NEW_PARSED.modified.map((item)=>{
      const element = document.getElementById((graviton.getCurrentDirectory()+item+"_div").replace(/\\|(\/)|\s/g,""));
        if(element!=undefined && element.getAttribute("gitted")!=="true"){
          element.setAttribute("gitted","true");
          element.title += " · Modified"
          if(element.children[0].tagName === "DIV"){
            //Directory
            element.children[0].children[1].style.color="var(--accentColor)";
            element.children[0].children[1].innerHTML += `<b> · U</b>`
          }else{
            //File
            element.children[1].style.color="var(--accentColor)";
            element.children[1].innerHTML += `<b> · M</b>`
          }
      }
    })
    NEW_PARSED.untracked.map((item)=>{
     const element = document.getElementById((graviton.getCurrentDirectory()+item+"_div").replace(/\\|(\/)|\s/g,""));
       if(element!=undefined && element.getAttribute("gitted")!=="true"){
         element.setAttribute("gitted","true");
         element.title += " · Untracked"
         if(element.children[0].tagName === "DIV"){
           //Directory
           element.children[0].children[1].style.color="var(--accentColor)";
           element.children[0].children[1].innerHTML += `<b> · U</b>`
         }else{
           //File
           element.children[1].style.color="var(--accentColor)";
           element.children[1].innerHTML += `<b> · U</b>`
         }
     }
   })
   NEW_PARSED.renamed.map((item)=>{
    const element = document.getElementById((graviton.getCurrentDirectory()+item+"_div").replace(/\\|(\/)|\s/g,""));
      if(element!=undefined && element.getAttribute("gitted")!=="true"){
        element.setAttribute("gitted","true");
        element.title += " · Renamed"
        if(element.children[0].tagName === "DIV"){
          //Directory
          element.children[0].children[1].style.color="var(--accentColor)";
          element.children[0].children[1].innerHTML += `<b> · R</b>`
        }else{
          //File
          element.children[1].style.color="var(--accentColor)";
          element.children[1].innerHTML += `<b> · R</b>`
        }
    }
  })
  OLD_PARSED = NEW_PARSED;
  })
}

document.addEventListener("loaded_project",()=>{
  const CURRENT_REPO = new gitParser({
    path:graviton.getCurrentDirectory()
  })
  refresh(CURRENT_REPO)
  document.addEventListener("file_saved",()=>{
    refresh(CURRENT_REPO)
  })
  document.addEventListener("load_explorer",()=>{
    refresh(CURRENT_REPO)
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
              content:`<input  class="section-1 input2" placeHolder="A commit..." id="commit_label"></input>`,
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
          document.getElementById("commit_label").focus();
        }
      }
  }
})
