module.exports = {
	gitParser: class {
		constructor({ path }) {
			const { exec } = require("child_process")
			this.path = path
			const me = this
			this.getStatus = () => {
				let promise_call = new Promise((resolve, reject) => {
					const test = exec(
						`git status --short`,
						{ cwd: me.path },
						(err, data) => {
							const splitted_content = data.split(/( )|(\n)/gm).filter(Boolean)
							const modified_array = []
							const added_array = []
							const untracked_array = []
							const renamed_array = []
							splitted_content.map((word, index) => {
								if (word.includes("M")) {
									modified_array.push(splitted_content[index + 2])
								} else if (word.includes("A")) {
									added_array.push(splitted_content[index + 2])
								} else if (word.includes("??")) {
									untracked_array.push(splitted_content[index + 2])
								} else if (word.includes("R")) {
									renamed_array.push(splitted_content[index + 2])
								}
							})
							modified_array.filter(Boolean)
							added_array.filter(Boolean)
							untracked_array.filter(Boolean)
							renamed_array.filter(Boolean)
							resolve({
								modified: modified_array,
								added: added_array,
								untracked: untracked_array,
								renamed: renamed_array
							})
							test.kill()
						}
					)
				})
				return promise_call
			}
      this.checkGit = () => {
        const promise =  new Promise((resolve, reject) => {
          exec(
            `git`,
            { cwd: me.path },(error,data)=>{
              resolve({
                installed: data.split(" ")[0] === "usage:"? true:false
              })
            });
        });
        return promise;
      }
		}
	}
}
