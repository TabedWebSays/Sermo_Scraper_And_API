
var base_url = 'http://localhost/websays/';
var is_login = true;//getCookie('websaysext_is_login');
var api_token = getCookie('websaysext_token');
var app_user_id = getCookie("websaysext_user_id");
var device_id = "EXT_IAUC";
var Ext = "IAUC";

//const {PubSub} = require("pubsub.min.js");
//import { PubSub } from "./pubsub.min.js";


$(function(){
	'use strict';
	var left_menu = '<div class="ext-left-menu"></div>';
	
	var login ='<div class="div-ext">'+
				'<div>'+
					'<label class="ext-label">Username</label>'+
					'<input type="text" id="ext-login_id" class="form-control ext-input" placeholder="Username" />'+
					'<div class="ext-error"></div>'+
				'</div>'+
				'<div>'+
					'<label class="ext-label">Password</label>'+
					'<input type="password" id="ext-login-password" class="form-control ext-input" placeholder="Password" />'+
					'<div class="ext-error"></div>'+
				'</div>'+
				'<div>'+
					'<input type="button" value="Login" class="ext-btn" id="ext-login-btn">'+
				'</div>'
				+'</div>';
	
	var logged = '<div class="div-ext"><h3 class="ext-title">WebSays</h3>'+
					'<div><input type="button" value="Fetch Data" class="ext-btn" id="ext-data"></div>'+
				'</div>';

	if(is_login == ''){ 
		
		$("body").append(left_menu);
		$(".ext-left-menu").append(login);
		
	}else{
		
		$("body").append(left_menu);
		$(".ext-left-menu").append(logged);
		
	}
	
	/* Authentication start*/

		$(document).on('click','#ext-login-btn',function(){

			var login_id = $('#ext-login_id').val();

			var password = $('#ext-login-password').val();

			var auth_validation =  true;

			if(login_id.length == 0){

				auth_validation = false;

				$('#ext-login_id').next('.ext-error').text('Username is required.');

			}

			if(password.length == 0){

				auth_validation = false;

				$('#ext-login-password').next('.ext-error').text('Password is required.');

			}

			if(auth_validation === true){

				$.ajax({

					type: 'POST',
					
					url: base_url+'api/login',
					
					crossDomain: true,
					
					data:{login_id:login_id,password:password,device_id:device_id},

					success: function(data) {
						
						if(data.hasOwnProperty('success')){
							
							is_login = true;
							api_token = data.user.api_token;
							app_user_id = data.user.id;
							setCookie('websaysext_is_login',true,0.6);
							setCookie('websaysext_token',api_token,0.6);
							setCookie('websaysext_user_id',app_user_id,0.6);

							$('.ext-left-menu').html(logged);

						}else{

							if(data.error){

								alert(data.msg);

							}

						}

					},


				});

			}
			setTimeout(function(){

				$('.ext-error').text('');

				$('.ext-error').text('');

			},15000);
		});	

		
		$(document).on('click','#ext-logout',function(){

			is_login = false;
			api_token = '';
			app_user_id = '';

			setCookie('websaysext_is_login',"",0);
			setCookie('websaysext_token',"",0);
			setCookie('websaysext_user_id',"",0);

			$('.ext-left-menu').html(login);

		});

		$(document).on('focus','input',function(){

			$(this).next('.ext-error').text('');

		});

	/* Authentication end*/

	/*var counter = 0;
	setInterval(function(){ ++counter; console.log("%c "+counter, "color: #bada55;"); }, 1000);*/
	//Fetch Data
	$(document).on('click','#ext-data',function(){
		console.log("scraping...."); 
		scrapeWebsite(); // Calling the scraping function
		connectpubSub();
	});	
	
	
});

function scrapeWebsite() {
	// Select the parent element that contains the result list
	const resultList = document.querySelector('.content #doctorList .doctorSearchResult ul.resultList');
	const items = resultList.querySelectorAll('li.row.showRestCont');
  
	const results = [];
  
	// Iterate over each item in the result list
	items.forEach((item) => {
	  // Extract the name element within the item
	  const nameElement = item.querySelector('.name.col-xs-8.col-sm-8.greedyLink h3 a');
  
	  // Extract the description div within the item
	  const descDiv = item.querySelector('.desc.col-xs-9.col-sm-5');
  
	  // Initialize variables to store the extracted values
	  let name = '';
	  let address = '';
	  let telephone = '';
	  let specialization = '';
  
	  // Check if the name element exists and extract its text content
	  if (nameElement) {
		name = nameElement.textContent.trim();
	  }
  
	  // Check if the description div exists
	  if (descDiv) {
		// Extract the address element within the description div
		const addressElement = descDiv.querySelector('address');
		if (addressElement) {
		  address = addressElement.textContent.trim();
		  // Separate the telephone number from the address
		  const telephoneMatch = address.match(/Telefon:\s*([\d\/\s-]+)/);
		  if (telephoneMatch) {
			telephone = telephoneMatch[1].trim();
			// Remove the telephone number and preceding text from the address
			address = address.replace(telephoneMatch[0], '').trim();
		  }
		}
  
		// Extract the specialization element within the description div
		const specializationElement = descDiv.querySelector('div[title]');
		if (specializationElement) {
		  specialization = specializationElement.getAttribute('title');
		}
	  }
  
	  // Create an object with the extracted data and add it to the results array
	  results.push({
		name,
		address,
		telephone,
		specialization,
	  });
	});
  
	// Output the results to the console
	console.log(results);
  }
  
  
function connectpubSub(){

    console.log("subscription")
}

/* Helper Function Start*/
function setCookie(cname, cvalue, exdays) {
	
	var d = new Date();
	
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	
	var expires = "expires=" + d.toUTCString();
	
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	
	var name = cname + "=";
	
	var decodedCookie = decodeURIComponent(document.cookie);
	
	var ca = decodedCookie.split(';');
	
	for (var i = 0; i < ca.length; i++) {
		
		var c = ca[i];
		
		while (c.charAt(0) == ' ') {
			
			c = c.substring(1);
			
		}
		
		if (c.indexOf(name) == 0) {
			
			return c.substring(name.length, c.length);
			
		}
		
	}
	
	return "";
	
}

var getUrlParameter = function getUrlParameter(sParam,url) {
	
    var sPageURL = url,
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
	

    for (i = 0; i < sURLVariables.length; i++) {
		
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
			
            return sParameterName[1] === undefined ? true : sParameterName[1];
			
        }
		
    }
	
};


function getParameterByName(name, url) {
	
    if (!url) url = window.location.href;
	
    name = name.replace(/[\[\]]/g, "\\$&");
	
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
	
    if (!results) return null;
	
    if (!results[2]) return '';
	
    return decodeURIComponent(results[2].replace(/\+/g, " "));
	
}


function getUrlLastSegment(url){
	
	url = href.split(/[?#]/)[0];

	return url.match(/([^\/]*)\/*$/)[1];
}

function findIn2dArray(arr_2d, val){
    var indexArr = $.map(arr_2d, function(arr, i) {
            if($.inArray(val, arr) != -1) {
                return 1;
            }

            return -1;
    });

    return indexArr.indexOf(1);
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function toDataURLCanves(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.onerror = function(){

  		callback('-1');
  }

  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
/* Helper Function end*/

