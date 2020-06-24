
    var globalurl = "http://localhost:7001/";
    //var globalProductId = null;
    var xmlIdsDropdown = new Array();
    $(document).ready(function(){
  	  refreshDropDown();
    });
    
    function refreshDropDown(){
  	  var selectList  = document.getElementById("selectXmlDocumentId");
  	  $("#selectXmlDocumentId").empty();
  	  $.ajax({
            method: "GET",
            url: "http://localhost:7001/xml/ids",
            success: function (data) {
          	  console.log("ids");
          	  
          	  xmlIdsDropdown = data;
          		console.log(xmlIdsDropdown);
          	 var optionString="";
          	
          	for(let i=0;i<data.length;i++){
          		//optionString+="<option value=\'"+data[i]+"\'>"+data[i]+"</option>";
          		var option = document.createElement("option");
          	    option.value = data[i];
          	    option.text = data[i];
          	    selectList.appendChild(option);
     
          	}
      
            },
            error: function (err) {
              console.log("error occured from server");
            }
          });
    }
    
    
    function callView() {
      var item = document.getElementById("selectID");
      if (item.value == 1) {
        $("#xmlcontainer").hide();
        $("#jsoncontainer").show();
      }
      if (item.value == 2) {
        $("#jsoncontainer").hide();
        $("#xmlcontainer").show();
      }
    }

    function ensureNumberic(e) {
      let value = document.getElementById("idField").value;
      if (value.length + 1 > 3) {
        return false;
      }
      var keyValue = e.key;
      if (keyValue.match(/[0-9]/g)) {
        return true;
      }
      return false;
    }

    // JSON Functions-------------------------------------
    
    function getJsonById() {
  	 let id = document.getElementById("idField");
  	 if(!id.value.length >0){
  		 alert("Please enter a valid id");
  		 return;
  	 }
      $.ajax({
        method: "GET",
        url: "http://localhost:7001/json/product/"+id.value,
        dataType:'json',
        success: function (data) {
      	 let item = document.querySelector("#jsonBodyContainer");
      	 item.innerHTML = JSON.stringify(data);
        },
        error: function (xhr,err) {
      	  let item = document.querySelector("#jsonBodyContainer");
            if(xhr.status == 200){
            	
           	 	item.innerHTML = "There exists no any data for given pid";
            }else{
            	item.innerHTML = "Server error";
            }
            
        }
      });
    }
    
    function updateJsonById(){
  	  ///product/update
  	  let item = document.querySelector("#jsonBodyContainer");
  	  let obj;
  	  try{
  		  obj= JSON.parse(item.innerText);
  		  
  	  }catch(e){
  		  alert("Not a proper json");
  		  return;
  	  }
  	 
  	  if(obj.pid<0){
  		  alert("PID NOT VALID");
  		  return;
  	  }
  	  let dataToSend = JSON.stringify(obj);
  	  //console.log(obj);
  	  $.ajax({
            method: "POST",
            url: "http://localhost:7001/json/product/update",
            dataType:'text',
            contentType: 'application/json',
            data:JSON.stringify(obj),
            success: function (data) {
          	 let item = document.querySelector("#jsonBodyContainer");
          	 item.innerHTML = data;
            },
            error: function (xhr,err) {
          	  console.log("error occured from server");
            }
          });
  
    }
    
    function deleteJsonById(){
  	  ///product/update
  	  let item = document.querySelector("#jsonBodyContainer");
  	  let obj = JSON.parse(item.innerText);
  	  if(obj.pid<0){
  		  alert("PID NOT VALID");
  		  return;
  	  }
  	  let dataToSend = JSON.stringify(obj);
  	  console.log(obj);
  	  $.ajax({
            method: "POST",
            url: "http://localhost:7001/json/product/delete",
            contentType: 'application/json',
            dataType:'text',
            data:JSON.stringify(obj),
            success: function (data) {
          	 let item = document.querySelector("#jsonBodyContainer");
          	 item.innerHTML = "Product deleted successfully"
            },
            error: function (err) {
              console.log("error occured from server");
            }
          });
  
    }
    
    
    function insertJson(){
  	  ///product/update
  	  let item = document.querySelector("#jsonBodyContainer");
  	  let obj;
  	  try{
  		  obj = JSON.parse(item.innerText);
  	  }catch(e){
  		  alert("Not a valid JSON");
  		  
  	  }
  	  
  	  if(obj.pid<0){
  		  alert("PID NOT VALID");
  		  return;
  	  }
  	  let dataToSend = JSON.stringify(obj);
  	  console.log(obj);
  	  $.ajax({
            method: "POST",
            url: "http://localhost:7001/json/product/insert",
            contentType: 'application/json',
            dataType:'text',
            data:JSON.stringify(obj),
            success: function (data) {
          	 let item = document.querySelector("#jsonBodyContainer");
          	 item.innerHTML = data;
            },
            error: function (err) {
              console.log("error occured from server");
            }
          });
  
    }
    
    //----------------XML Functions
    function getXmlData(){
  	  var item =document.getElementById("selectXmlDocumentId");
  	  $.ajax({
            method: "GET",
            url: "http://localhost:7001/xml/read/"+item.value,
            dataType:'xml',
            success: function (data) {
          	 console.log(data);
          	 let item = document.querySelector("#xmlBodyContainer");
          	 let parsedData = new XMLSerializer().serializeToString(data);
          	 item.innerText = parsedData;
            },
            error: function (err) {
              console.log("error occured from server");
            }
          });
    }
    function updateXmlData(){
    	let id = document.getElementById("selectXmlDocumentId").value;
    	let query = document.getElementById("queryXml").value+"/text()";
    	let value =document.getElementById("valueXml").value;
    	if(id.length <1 || query.length<1 || value.length<1){
    		alert("Missing fields");
    		return;
    	}
    	var data = {query:query,id:id,value:value};
    	$.ajax({
      		method:"POST",
      		url:"http://localhost:7001/xml/update",
      		contentType: "application/json",
      	    dataType: "text",
      		data:JSON.stringify(data),
      	  	success: function(data){
      	  		let item = document.querySelector("#xmlBodyContainer");
             	 	item.innerHTML = data;
             	 	refreshDropDown();
      	  	},
      	  	error:function(err){
      	  		console.log("error occured while inserting");
      	  	}
      	  	
      	  });
    	
    }
    
    function deleteXmlData(){
    	var item =document.getElementById("selectXmlDocumentId").value;
    	let data = {id:item};
    	$.ajax({
    		method:"POST",
    		url:"http://localhost:7001/xml/delete",
    		contentType: "application/json",
      	    dataType: "text",
      	  	data:JSON.stringify(data),
    	  	success: function(data){
    	  		let item = document.querySelector("#xmlBodyContainer");
           	 	item.innerHTML = data;
           	 	refreshDropDown();
    	  	},
    	  	error:function(err){
    	  		console.log(err);
    	  		let item = document.querySelector("#xmlBodyContainer");
           	 	item.innerHTML = "<p>error occured while Deleting</p>";
    	  	}
    	});
    }
    
    function insertXmlData(){
    	
  	  var t = document.getElementById("xmlBodyContainer");
  	  let data = t.innerText.trim();
  	  let parser = new DOMParser();
  	  let xmldoc = parser.parseFromString(data,"text/xml");
  	  console.log("before sending");
  	  console.log(data);
  	  
  	  try{
  		/*  console.log(xmldoc.documentElement.cloneNode(false));
  		if(xmldoc.documentElement.cloneNode(false) !="<order></order>"){
  			alert("Root element to be order");
  			return;
  		} */
  		if(xmldoc.getElementsByTagName("order")[0].parentNode.parentNode !=null){
  			alert("Order tag is not the parent tag");
  			return;
  		}
  		var nodeList = (xmldoc.getElementsByTagName("order")[0].childNodes);
  		var ar = new Array();
  		nodeList.forEach(x=>{
  			ar.push(x.nodeName);
  		});
  		indexOfId = ar.indexOf("id");
  		console.log(xmldoc.getElementsByTagName("order")[0].childNodes[indexOfId].nodeName);
  		 if(xmldoc.getElementsByTagName("order")[0].childNodes[indexOfId].nodeName !="id"){
  			alert("Id should be immediate child of order node");
  			return;
  		} 
  			
  		let id=  xmldoc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
  		if(xmlIdsDropdown.includes(parseInt(id))){
  			alert("Entry with the id exists, please change the id and try again");
  			return;
  		}
  		
  		if(isNaN(parseInt(id))){
  			alert("Id not a number");
  			return;
  		}
  	  }catch(e){
  		  alert("Please have Order tag as root and Id as its child");
  		  return;
  	  }
  	 $.ajax({
  		method:"POST",
  		url:"http://localhost:7001/xml/insert",
  		contentType: "text/xml",
  	    dataType: "text",
  		data:data,
  	  	success: function(data){
  	  		let item = document.querySelector("#xmlBodyContainer");
         	 	item.innerHTML = data;
         	 	refreshDropDown();
  	  	},
  	  	error:function(err){
  	  		console.log("error occured while inserting");
  	  	}
  	  	
  	  });
    }
	function clearScreen(){
		let item = document.querySelector("#xmlBodyContainer");
		item.innerText ="";
	}
	
	//-- Common functions
	function validatePin(e) {
		
		var keyValue = e.key;
		if (keyValue.match(/[0-9]/g)) {
			return true;
		}
		return false;
	}
	
	
	function ensureNumberic(e) {
		let value = document.getElementById("phone").value;
		if (value.length + 1 > 10) {
			return false;
		}
		var keyValue = e.key;
		if (keyValue.match(/[0-9]/g)) {
			return true;
		}
		return false;
	}
