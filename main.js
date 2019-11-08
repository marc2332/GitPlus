if(GravitonInfo.version !== "1.2.0") {
  console.warn("GitPlus doesn't work on your current version, you need at least 1.2.0")
  new Notification({
    title:"GitPlus",
    content:"You need Graviton v1.2.0+"}
  )
  return;
}

let OLD_PARSED = {  modified:[] };

const refresh = (REPOSITORY) =>{
  const LOCAL_REPO = require('simple-git')(REPOSITORY);
  LOCAL_REPO.status((err,NEW_PARSED)=>{
    if(err) return;
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
    let GITTED_DIRS = []
    NEW_PARSED.modified.map((item)=>{
      const element = document.getElementById((graviton.getCurrentDirectory()+item+"_div").replace(/\\|(\/)|\s/g,""));
      if(element!=undefined && element.getAttribute("gitted")!=="true"){
        element.setAttribute("gitted","true");
        element.title += " · Modified"
        if(element.children[0].tagName === "DIV"){
          //Directory
          element.children[0].children[1].style.color="var(--accentColor)";
          element.children[0].children[1].innerHTML += `<b> · M</b>`
        }else{
          //File
          element.children[1].style.color="var(--accentColor)";
          element.children[1].innerHTML += `<b> · M</b>`
        }
      }
      GITTED_DIRS.push(item.split("/"))
    })
    GITTED_DIRS.map((dirs)=>{
      let added = []
      dirs.map((dir)=>{
        added.push(dir)
        const element = document.getElementById((graviton.getCurrentDirectory()+added.join("/")+"_div").replace(/\\|(\/)|\s/g,""));
        if(element!=undefined && element.getAttribute("gitted")!=="true"){
          element.setAttribute("gitted","true");
          element.title += " · Modified"
          if(element.children[0].tagName === "DIV"){
            //Directory
            element.children[0].children[1].style.color="var(--accentColor)";
            element.children[0].children[1].innerHTML += `<b> • </b>`
          }else{
            //File
            element.children[1].style.color="var(--accentColor)";
            element.children[1].innerHTML += `<b> • </b>`
          }
        }
      })
    })
    NEW_PARSED.not_added.map((item)=>{
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
  refresh(graviton.getCurrentDirectory())
  document.addEventListener("file_saved",()=>{
    refresh(graviton.getCurrentDirectory())
  })
  document.addEventListener("load_explorer",()=>{
    refresh(graviton.getCurrentDirectory())
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
          const repo = require('simple-git')(graviton.getCurrentDirectory())
          repo.branch((err,data)=>{
            const my_dialog = new Dialog({
                id:'commit_git_plus_dialog',
                title:'Commit message',
                content:`
                  <h5>Branch:</h5>
                  <select id="branches_list">
                    ${data.all.map((branch)=>{
                      return `<option>${branch}</option>`
                    })}
                  </select>
                  <h5>Message:</h5>
                  <input class="section-1 input2" placeHolder="A commit..." id="commit_label"></input>
                `,
                buttons: {
                    'Continue':{
                      click:()=>{
                        const MESSAGE = document.getElementById("commit_label").value;
                        const BRANCHES = document.getElementById("branches_list").value
                        repo.checkout(BRANCHES,()=>{
                          repo.commit(MESSAGE,()=>{
                            refresh(graviton.getCurrentDirectory())
                            Explorer.load(graviton.getCurrentDirectory(),'g_directories',true)
                          })
                        })

                      }
                    }
                }
            })
            document.getElementById("commit_label").focus();
          })
        }
      },
      "About":{
        click:()=>{
          new Dialog({
              id:'git_plus_dialog_about',
              title:'About GitPlus',
              content:`GitPlus provides a Git integration for Graviton Editor. It needs to have Git on the machine.`,
              buttons:{
                'Source':{
                  click:()=>{
                    shell.openExternal("https://github.com/marc2332/GitPlus")
                  }
                },
                'Okay':{
                  important:true,
                  click:()=>{
                  }
                }
              }
            })
          }
      }
  }
})
