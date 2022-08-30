const path = require("path")

const {Transfer} = require("./fileOperate")


function CopyAll(sourcUrl, targetUrl){
	Transfer(sourcUrl, targetUrl)
}

function CreateExcel(){
	
}

module.exports = {
	CopyAll,
	CreateExcel
}

