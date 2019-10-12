const gitParser = require("./core/index.js").gitParser;

document.addEventListener("loaded_project",()=>{
  const my_repo = new gitParser({
    path:graviton.getCurrentDirectory()
  })
  const refresh = () =>{
    my_repo.status().then((result)=>{
      result.modified.map((dir)=>{
        const element = document.getElementById((graviton.getCurrentDirectory()+dir+"_div").replace(/\\|(\/)/g,""));
        if(element!=undefined && element.getAttribute("gitted")!=="true"){
          element.setAttribute("gitted","true");
          element.children[1].style.color="var(--accentColor)";
          element.children[1].innerHTML += `<b>M</b>`
        }
      })
    })
  }
  refresh()
  document.addEventListener("file_saved",()=>{
    refresh()
  })
  document.addEventListener("load_explorer",()=>{
    refresh()
  })

})
