const path = require("path")

const cphelper = require("fs/promises").cp

async function Transfer(sourceUrl, targetUrl){
	// const sourceFiles = await readdir(sourcUrl, {withFileTypes:true});
	// const targetFiles = await readdir(targetUrl, {withFileTypes:true});
	// for(const dir of sourceFiles){
	// 	if(dir.isDirectory()){
	// 		await cphelper(sourcUrl,targetUrl,{
	// 			force: false
	// 		})
	// 	}
	// }
	const result = await cphelper(sourceUrl,targetUrl,{
		force: true,
		recursive:true,
		preserveTimestamps:true
	})
	console.log(result)
}

module.exports = Transfer

// const baseUrl = '../test'
// transfer(path.resolve(baseUrl,'source/'), path.resolve(baseUrl,'target/'))
