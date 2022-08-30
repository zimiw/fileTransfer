const mkdir  = require("fs/promises").mkdir;
const path = require("path")

const cphelper = require("fs/promises").cp
const readdir = require("fs/promises").readdir
const rename = require("fs/promises").rename

/**
 * 将目录下的所有文件名重命名
 * @param {*} folder
 */
 async function Rename(folder){
	const files = await readdir(folder, {withFileTypes:true});
	for(const dir of files){
		if(dir.isDirectory()){
			let folderName = dir.name
			if(folderName){
				trimfolderName = folderName.replaceAll(/\s+/g,' ')
				console.log('folderName is',trimfolderName)
				let nameArray = trimfolderName.split(' ')
				if(nameArray.length<2){
					continue
				}
				console.log('nameArray is',nameArray)
				let name = nameArray[0]
				let sex = (nameArray[1] === '男' ||  nameArray[1] === '女')?nameArray[1]:undefined
				let symbleStr = nameArray[2] || ''
				if(!sex && nameArray[1].length>1){
					symbleStr = nameArray[1]
				}
				let symbleArray = [symbleStr]
				
				console.log('symbleStr is',symbleStr)
				symbleArray = symbleStr.split(/[、|，|\s |,]/)
				let newName = `${name}-${sex || 'unknow'}#${symbleArray.join('&')}`
				await rename(path.resolve(folder,folderName),path.resolve(folder,newName))
			}
		}
	}
	
}

async function Transfer(sourceUrl, targetUrl){
	
	// const targetFiles = await readdir(targetUrl, {withFileTypes:true});
	// let targetFilesPathArr = []
	// for(let dir of targetFiles){
	// 	if(dir.isDirectory()){
	// 		let subFolders = await readdir(path.resolve(targetFiles,dir.name),{withFileTypes:true})
	// 		for(let subFolder of subFolders){
	// 			if(subFolder.isDirectory()){
	// 				if(subFolder.name){
	// 					targetFilesPathArr.push(`${dir.name}/${subFolder.name}`)
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	const sourceFiles = await readdir(sourceUrl, {withFileTypes:true});
	for(let dir of sourceFiles){
		if(dir.isDirectory()){
			if(dir.name){
				let subFolders = await readdir(path.resolve(sourceUrl,dir.name),{withFileTypes:true})
				for(let subFolder of subFolders){
					if(subFolder.isDirectory()){
						if(subFolder.name){
							let pathUrl = path.resolve(targetUrl,subFolder.name, dir.name)
							const createDir = await mkdir(pathUrl,{
								recursive: true
							})
							let sourceFolder = path.resolve(sourceUrl, dir.name, subFolder.name)
							const result = await cphelper(sourceFolder,pathUrl,{
								force: true,
								recursive:true,
								preserveTimestamps:true
							})
							console.log(result)
						}
					}
				}
			}
			
		}
	}
	
}

module.exports = {Rename,Transfer}

// const baseUrl = '../test'
// transfer(path.resolve(baseUrl,'source/'), path.resolve(baseUrl,'target/'))
