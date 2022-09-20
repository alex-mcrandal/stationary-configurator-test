//Author:			Alex McRandal
//Email:			amcrandal@aeconlinestore.com
//Last-Modified:	8-3-2022


//TODO: Change the server to use the "https" package to ensure better security
var http = require('http');				//module for initializing a web server
var url = require('url');				//module for parsing url requests from the user
var fs = require('fs');					//module for reading and writing files
var pdf = require('./pdfCreator');		//custom module for creating a pdf

//Declare a variable so each generated pdf has a different name
var fileCounter = 0;

//Action taken when the server receives a request for a pdf file
//@param req - the body of a POST request sent to the server
//@returns - a JSON object with information about the generated .pdf file
function receiveMsg(req){
	//Feedback
	console.log(`Hello, ${req}`);
	console.log("Received Message!");
	
	fileCounter += 1;										//Increment file naming
	return pdf.createPDF(`${fileCounter}.pdf`, req);		//Create a pdf and retrieve and object containing its information
}

//Create an HTTP server listening on port 8080
http.createServer(function (req, res) {
	
	//parse the request url to an easy-to-use object
	var q = url.parse(req.url, true);
	
	//if the user is asking to generate a pdf
	if (q.pathname == "/stationeryconfigurator/create/pdf"){
		res.writeHead(200, {'Content-Type': 'json'});
		
		//the body of a POST request is only accessible throught the 'data' event on a request
		let data = '';
		req.on('data', chunk => {
			data += chunk;
		});
		//when finished reading the POST data
		req.on('end', () => {
			res.writeHead(200, {'Content-Type': 'json'});
			res.write(JSON.stringify(receiveMsg(data)));
			return res.end();								//return an object that contains the information on the generated pdf (not the pdf itself)
		});
	  
	}
	
	//the user is asking for a file
	var filename = "." + q.pathname;
	
	//read the desired file
	fs.readFile(filename, function(err, data) {
	if (err) {													//the file was not found, so a page that says "404 Not Found" is sent to the user
		res.writeHead(404, {'Content-Type': 'text/html'});
		return res.end("404 Not Found");
    } 
	
	//the file was found, and assume for now it is an .html file
	let contentType = 'text/html';
	
	//if the user asked for a .pdf file, change the content type to match
	let pdfReg = /(.pdf)$/;
	if(pdfReg.test(q.pathname)){
		contentType = 'application/pdf';
	}
	
    res.writeHead(200, {'Content-Type': contentType});
    res.write(data);
    return res.end();										//return a file of the desired type to the user
	});
}).listen(8080);

console.log("Server started on port 8080");