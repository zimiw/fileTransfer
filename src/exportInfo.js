const xlsx = require('node-xlsx').default
const fs = require('fs/promises')
const path = require('path')


const dataStructure = [{
	name:'李杰',
	problems:[],
	list: [{
		date: '2022.3.4',
		images:['aaa.jpg','bbb.jpg']
	}]
}]

async function BuildExcel(sourceUrl, position, name){

	try {
		let data = await getData(sourceUrl)
		let parsedData = parseData(data)
		writeExcel(parsedData, position, name)
	} catch (error) {
		console.error(error)
	}
}

async function getData(sourceUrl){
	const files = await fs.readdir(sourceUrl, {withFileTypes:true})
	const data = []
	for (let file of files){
		if(file.isDirectory()){
			let temp = {}
			let splitNameArr = file.name.split('#')
			temp.name = splitNameArr[0]
			temp.problems= splitNameArr[1]?splitNameArr[1].split('&'):[]
			data.push(temp)
			let subfiles = await fs.readdir(path.resolve(sourceUrl,file.name), {withFileTypes:true})
			if(!subfiles) continue
			temp.list = []
			
			for(let subfile of subfiles){
				if(subfile.isDirectory()){
					let subtemp = {}
					subtemp.date = subfile.name
					subtemp.images = []
					temp.list.push(subtemp)
					let images = await fs.readdir(path.resolve(sourceUrl,file.name, subfile.name), {withFileTypes:true})
					if(images){
						for(let image of images){
							if(image.isFile() && isImage(path.resolve(sourceUrl,file.name, subfile.name, image.name))){
								subtemp.images.push(image.name)
							}
						}
					}
				}
			}
		}
	}
	return data
}

function isImage(url){
	// console.log(url)
	let extname = path.extname(url)
	console.log(extname)
	let images = ['.png','.jpg','.jpeg','.bmp']
	if(images.indexOf(extname)>-1){
		return true
	}
	return false
}

function parseData(dataStructure){
	// console.log(dataStructure[0].list)
	let data = [['序号', '姓名', '问题','拍照日期','照片数量']]
	let index = 0
	for(let i=0;i<dataStructure.length;i++){
		let list = dataStructure[i].list
		
		for(let j=0;j<list.length;j++){
			let tempArray = []
			index= index+1
			tempArray.push(index)
			tempArray.push(dataStructure[i].name)
			tempArray.push(dataStructure[i].problems.join(','))
			tempArray.push(list[j].date)
			list[j].images && tempArray.push(list[j].images.length)
			data.push(tempArray)
		}
		if(list.length<1){
			let tempArray = []
			index+=1
			tempArray.push(index)
			tempArray.push(dataStructure[i].name)
			tempArray.push(dataStructure[i].problems.join(','))
			data.push(tempArray)
		}
	}
	// console.log(data)
	return data
}

function writeExcel(data,position, name){
	const buffer = xlsx.build([{name, data}]);
	fs.writeFile(path.resolve(position,name), buffer, {'flag':'w'})
}


BuildExcel('../test/target', '../test', 'info.xlsx')



module.exports = {BuildExcel}

