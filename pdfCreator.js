//Author:				Alex McRandal
//Email:				amcrandal@aeconlinestore.com
//Last-Modified:		8-3-2022

const { jsPDF } = require('jspdf');		//module for creating .pdf files
const fs = require('fs');				//module for working with the file system (can also help load images onto the generating pdf)
const url = require('url');				//module for parsing requested information

//Create a .pdf file in "/media/stationeryconf/target_generated/" directory
//@param fileName - the name of the pdf file
//@param data - POST request body that contains information the user submitted
//@returns - a JSON object with information about the generated .pdf file
exports.createPDF = function(fileName, data){
	
	var userData = url.parse("http://localhost:8080/index.html?" + data, true).query;
	
	//Create document
	const doc = new jsPDF(
	{
		orientation: "landscape",		//use landscape orientation
		unit: "px",						//use pixels as the unit of measurement since the size is predefined in magento
		hotfixes: ["px_scaling"],
		format: [1000, 568]				//this is a test of landmark's business card, so this uses the predefined size in magento as of 7/28/22
	}
	);
	
	//Put an image as the background of the document
	var imgPath = "./media/stationeryconf/source_template/" + "Turner_buscard_blank1.jpg";
	var imgData = fs.readFileSync(imgPath).toString("base64");
	doc.addImage(imgData, "JPEG", 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "card-background", "NONE", 0);
	
	//Write message in the center of the document
	doc.setFont("helvetica", "normal", "bold");
	doc.text(`Hello, ${userData.name}!`, doc.internal.pageSize.width/2, doc.internal.pageSize.height/2,
	{
		align: "center"
	});
	
	//Save the document
	doc.save(fileName);
	
	
	//Move the document to the desired directory
	const currentPath = `./${fileName}`;
	const newPath = `./media/stationeryconf/target_generated/${fileName}`;
	try {
		fs.renameSync(currentPath, newPath);
	}
	catch (err){
		console.error(err);
	}
	
	//Save information on the created document
	var response = {
		"success": true,
		"pdfURL": `/media/stationeryconf/target_generated/${fileName}`,
		"pdfId": `${fileName}`
	}
	
	return response;
}