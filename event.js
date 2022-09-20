var actionButton = $("#button");
var pdfDisplay = $("#pdf-view");
var pdfContainer = $("#pdf-container");

//pdfDisplay.attr("style", "display: none");

var testFunc = function test(){
	window.alert("Testing");
}

//console.log($("button"));

var callFunc = function callToEndpoint(){
	
	console.log("Calling Connection...");
	
	var errorFunc = function(e){
		window.alert(`Error sending request: ${e}`);
	}
	
	var successFunc = function(res){
		pdfContainer.attr("src", res.pdfURL);
		pdfDisplay.attr("style", "display: block");
	}
	
	console.log($("#info").serialize());
	
	$.ajax({
		url: "stationeryconfigurator/create/pdf",
		type: "post",
		dataType: "json",
		data: $("#info").serialize(),
		success: function(data){
			if (data.success){
				successFunc(data);
			}
			else {
				errorFunc("During successful retrieval");
			}
		},
		error: function(jqXHR, textStatus, errorThrown){
			errorFunc("When sending request");
		}
	});
};

$("#button").click(callFunc);

/*
$.ajax({
				url: '/stationeryconfigurator/Create/PDF',
				type: 'post',
				dataType: 'json',
				data: $('#product_addtocart_form').serialize(),
				success: function(data) {
					if (data.success) {
						success(data);
					} else {
						error();
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					error();
				}
			});
*/