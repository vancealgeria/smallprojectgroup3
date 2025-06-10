const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let error = 0;

var script = document.createElement("script");  
script.src = '/js/md5.js';  
document.head.appendChild(script);  


function doLoginErrorCheck(){
	error = 0;

	let username = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";
	document.getElementById("usernameLengthErrorResult").innerHTML = "";
	document.getElementById("passwordLengthErrorResult").innerHTML = "";

	if(username === '' || password === '')
	{
		document.getElementById("loginResult").innerHTML = "One or multiple fields are blank";
		error = 1;
	}

	if(username.length > 50){
		document.getElementById("usernameLengthErrorResult").innerHTML = "Username input must be 50 characters or less";
		error = 1;
	}

	if(password.length > 50){
		document.getElementById("passwordLengthErrorResult").innerHTML = "Password input must be 50 characters or less";
		error = 1;
	}
}


function doLogin()
{
	doLoginErrorCheck();

	if(error === 1){
		return;
	}

	userId = 0;
	firstName = "";
	lastName = "";
	
	let username = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;

	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {username:username, password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegisterErrorCheck(){
	error = 0;

	firstName = document.getElementById("registerFirstName").value;
	lastName = document.getElementById("registerLastName").value;
	let username = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;
	let confirmPassword = document.getElementById("registerConfirmPassword").value;

	document.getElementById("registerResult").innerHTML = "";
	document.getElementById("addFirstNameLengthErrorResult").innerHTML = "";
	document.getElementById("addLastNameLengthErrorResult").innerHTML = "";
	document.getElementById("addUsernameLengthErrorResult").innerHTML = "";
	document.getElementById("addPasswordLengthErrorResult").innerHTML = "";
	document.getElementById("passwordUppercaseErrorResult").innerHTML = "";
	document.getElementById("passwordLowercaseErrorResult").innerHTML = "";
	document.getElementById("passwordNumberErrorResult").innerHTML = "";
	document.getElementById("passwordSpecialCharErrorResult").innerHTML = "";
	document.getElementById("confirmPasswordLengthErrorResult").innerHTML = "";
	document.getElementById("confirmMatchResult").innerHTML = "";

	if(firstName === '' || lastName === '' || username === '' || password === '' || confirmPassword === '')
	{
		document.getElementById("registerResult").innerHTML = "One or multiple fields are blank";
		error = 1;
	}

	if(firstName.length > 50){
		document.getElementById("addFirstNameLengthErrorResult").innerHTML = "First Name input must be 50 characters or less";
		error = 1;
	}

	if(lastName.length > 50){
		document.getElementById("addLastNameLengthErrorResult").innerHTML = "Last Name input must be 50 characters or less";
		error = 1;
	}

	if(username.length > 50){
		document.getElementById("addUsernameLengthErrorResult").innerHTML = "Username input must be 50 characters or less";
		error = 1;
	}

	const hasUpperCase = /[A-Z]/;
	const hasLowerCase = /[a-z]/;
	const hasNumber = /\d/;
	const hasSpecialChar = /[\W_]/;

	if(!(hasUpperCase.test(password))){
		document.getElementById("passwordUppercaseErrorResult").innerHTML = "Password must have at least 1 uppercase letter";
		error = 1;
	}

	if(!(hasLowerCase.test(password))){
		document.getElementById("passwordLowercaseErrorResult").innerHTML = "Password must have at least 1 lowercase letter";
		error = 1;
	}

	if(!(hasNumber.test(password))){
		document.getElementById("passwordNumberErrorResult").innerHTML = "Password must have at least 1 number";
		error = 1;
	}

	if(!(hasSpecialChar.test(password))){
		document.getElementById("passwordSpecialCharErrorResult").innerHTML = "Password must have at least 1 special character";
		error = 1;
	}

	if(password.length < 8){
		document.getElementById("addPasswordLengthErrorResult").innerHTML = "Password input must be 8 characters or more";
		error = 1;
	}

	if(password.length > 50){
		document.getElementById("addPasswordLengthErrorResult").innerHTML = "Password input must be 50 characters or less";
		error = 1;
	}

	if(confirmPassword.length > 50){
		document.getElementById("confirmPasswordLengthErrorResult").innerHTML = "Confirm Password input must be 50 characters or less";
		error = 1;
	}

	if( password != confirmPassword )
	{		
		document.getElementById("confirmMatchResult").innerHTML = "Passwords not matching! Please re-check the password you typed.";
		error = 1;
	}
}

function doRegister()
{
	doRegisterErrorCheck();

	if(error === 1){
		return;
	}

	userId = 0;

	firstName = document.getElementById("registerFirstName").value;
	lastName = document.getElementById("registerLastName").value;
	let username = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;

	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";

	var tmp = {firstName:firstName, lastName:lastName, username:username, password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 0.1 )
				{		
					document.getElementById("registerResult").innerHTML = "Account created! Please login on the login page.";
					return;
				}

				if( userId < 0.2 )
				{		
					document.getElementById("registerResult").innerHTML = "Username already registered in system. Please login instead.";
					return;
				}

				if( userId < 0.3 )
				{		
					document.getElementById("registerResult").innerHTML = "Connection to database failed!";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

let matchCount = 0;

let determinedIndex = 0;

let pageIndex = 0;

let apiSearchLowerBound = 0;

let apiSearchUpperBound = 0;

let text = "<table border='1'>"

let srch = '';



function searchContacts()
{

	hideNextPageButton();
	hidePrevPageButton();


	srch = document.getElementById("searchContactText").value;
	document.getElementById("searchLengthErrorResult").innerHTML = "";

	if(srch.length > 50){
		document.getElementById("searchLengthErrorResult").innerHTML = "Search input must be 50 characters or less";
		return;
	}
	
	let tmp = {search:srch,userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContactsNumber.' + extension; 
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				matchCount = jsonObject.MatchCount;
				if (jsonObject.MatchCount > 20)
				{
					determinedIndex = parseInt((jsonObject.MatchCount)/20);
					pageIndex = 0;
					apiSearchLowerBound = (pageIndex * 20)+1;
					apiSearchUpperBound = (pageIndex * 20) + 20;

					let tmpRange = {userID:userId,search:srch,apiSearchLowerBound:apiSearchLowerBound,apiSearchUpperBound:apiSearchUpperBound};
					let jsonPayloadRange = JSON.stringify( tmpRange );

					let urlRange = urlBase + '/ContactsRangeFind.' + extension; 

					let xhrRange = new XMLHttpRequest();
					xhrRange.open("POST", urlRange, true);
					xhrRange.setRequestHeader("Content-type", "application/json; charset=UTF-8");
					try
					{
						xhrRange.onreadystatechange = function() 
						{
							if (this.readyState == 4 && this.status == 200) 
							{
								let jsonObjectRange = JSON.parse( xhrRange.responseText );
								if(matchCount%20 === 0){
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex);
								}else{
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex + 1);
								}
								text = "<table border='1'>"
								for(let i = 0; i < 20; i++)
								{
									displaytableresults((jsonObjectRange.results)[i], i);
								}
								text += "</table>"
                				document.getElementById("tbody").innerHTML = text;
								showNextPageButton();
								const searchResult = document.getElementById("contactSearchResult");
								searchResult.textContent = "Searched successfully!";
								searchResult.style.visibility = "visible";
								setTimeout(() => {
									searchResult.visibility = "hidden";
								}, 5000);
							}
						};
						xhrRange.send(jsonPayloadRange);
					}
					catch(err)
					{
						document.getElementById("contactSearchResult").innerHTML = err.message;
					}
				} 
				else
				{
					determinedIndex = parseInt((jsonObject.MatchCount)/20);
					pageIndex = 0;
					apiSearchLowerBound = 1;
					apiSearchUpperBound = jsonObject.MatchCount;

					let tmpRange = {userID:userId,search:srch,apiSearchLowerBound:apiSearchLowerBound,apiSearchUpperBound:apiSearchUpperBound};
					let jsonPayloadRange = JSON.stringify( tmpRange );

					let urlRange = urlBase + '/ContactsRangeFind.' + extension; 

					let xhrRange = new XMLHttpRequest();
					xhrRange.open("POST", urlRange, true);
					xhrRange.setRequestHeader("Content-type", "application/json; charset=UTF-8");
					try
					{
						xhrRange.onreadystatechange = function() 
						{
							if (this.readyState == 4 && this.status == 200) 
							{
								let jsonObjectRange = JSON.parse( xhrRange.responseText );
								if(matchCount === 0){
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex) + "/" + (determinedIndex);
								}else if(matchCount%20 === 0){
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex);
								}else{
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex + 1);
								}
								text = "<table border='1'>"
								for(let i = 0; i < (jsonObject.MatchCount); i++){
									displaytableresults((jsonObjectRange.results)[i], i);
								}
								text += "</table>"
                				document.getElementById("tbody").innerHTML = text;
								const searchResult = document.getElementById("contactSearchResult");
								searchResult.textContent = "Searched successfully!";
								searchResult.style.display = "inline-block";
								setTimeout(() => {
									searchResult.style.display = "none";
								}, 5000);
							}
						};
						xhrRange.send(jsonPayloadRange);
					}
					catch(err)
					{
						document.getElementById("contactSearchResult").innerHTML = err.message;
					}

				}
				

			}
		};
		xhr.send(jsonPayload);
	}	
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
	


function goNextPage()
{
	if(pageIndex < determinedIndex){
		pageIndex++;
		apiSearchLowerBound = (pageIndex * 20)+1;
		apiSearchUpperBound = ((pageIndex * 20) + 20);

		let tmpRange = {userID:userId,search:srch,apiSearchLowerBound:apiSearchLowerBound,apiSearchUpperBound:apiSearchUpperBound};
		let jsonPayloadRange = JSON.stringify( tmpRange );

		let urlRange = urlBase + '/ContactsRangeFind.' + extension; 

		let xhrRange = new XMLHttpRequest();
		xhrRange.open("POST", urlRange, true);
		xhrRange.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhrRange.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					
					let jsonObjectRange = JSON.parse( xhrRange.responseText );

					if(pageIndex === determinedIndex){
						iterationIndex = matchCount%20;
					}
					else
					{
						iterationIndex = 20;
					}
					if(matchCount%20 === 0){
						document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex);
					}else{
						document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex + 1);
					}
					deleteOldTableResults();
					text = "<table border='1'>"
					for(let i = 0; i < iterationIndex; i++)
					{
						displaytableresults((jsonObjectRange.results)[i], i);
					}
					text += "</table>"
                	document.getElementById("tbody").innerHTML = text;
					if(pageIndex === determinedIndex){
						hideNextPageButton();
					}else if(((pageIndex+1) === determinedIndex) && ((matchCount%20) === 0)){
						hideNextPageButton();
					}
					showPrevPageButton();
				}
			};
			xhrRange.send(jsonPayloadRange);
		}
		catch(err)
		{
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

let prevPageValue = 0;

function goPrevPage()
{
	if(pageIndex > 0){
		pageIndex--;
		apiSearchLowerBound = (pageIndex * 20)+1;
		apiSearchUpperBound = ((pageIndex * 20) + 20);

		let tmpRange = {userID:userId,search:srch,apiSearchLowerBound:apiSearchLowerBound,apiSearchUpperBound:apiSearchUpperBound};
		let jsonPayloadRange = JSON.stringify( tmpRange );

		let urlRange = urlBase + '/ContactsRangeFind.' + extension; 

		let xhrRange = new XMLHttpRequest();
		xhrRange.open("POST", urlRange, true);
		xhrRange.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhrRange.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					let jsonObjectRange = JSON.parse( xhrRange.responseText );

					if(pageIndex === determinedIndex){
						iterationIndex = matchCount%20;
					}
					else
					{
						iterationIndex = 20;
					}
					if(matchCount%20 === 0){
						document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex);
					}else{
						document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex + 1);
					}
					deleteOldTableResults();
					text = "<table border='1'>"
					for(let i = 0; i < iterationIndex; i++)
					{
						displaytableresults((jsonObjectRange.results)[i], i);
					}
					text += "</table>"
                	document.getElementById("tbody").innerHTML = text;
					if(pageIndex === 0){
						hidePrevPageButton();
					} 
					if(prevPageValue === 1){
						hideNextPageButton();
					}else{
						showNextPageButton();
					}
					prevPageValue = 0;
				}
			};
			xhrRange.send(jsonPayloadRange);
		}
		catch(err)
		{
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
	}
}

let addValueSignal = 0;


function goRefresh()
{
	let prevMatchCount = matchCount;
	let tmp = {search:srch,userID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContactsNumber.' + extension; 
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				matchCount = jsonObject.MatchCount;
				determinedIndex = parseInt((matchCount)/20);
				apiSearchLowerBound = (pageIndex * 20)+1;
				apiSearchUpperBound = ((pageIndex * 20) + 20);

				if((prevMatchCount !== matchCount) && (matchCount%20 === 0) && (matchCount !== 0) && ((prevMatchCount - matchCount) === 1) && (pageIndex === determinedIndex)){
					prevPageValue = 1;
					goPrevPage();
				}else{
		
					if(addValueSignal === 1){
						apiSearchUpperBound++;
					}
					
					let tmpRange = {userID:userId,search:srch,apiSearchLowerBound:apiSearchLowerBound,apiSearchUpperBound:apiSearchUpperBound};
					let jsonPayloadRange = JSON.stringify( tmpRange );

					let urlRange = urlBase + '/ContactsRangeFind.' + extension; 

					let xhrRange = new XMLHttpRequest();
					xhrRange.open("POST", urlRange, true);
					xhrRange.setRequestHeader("Content-type", "application/json; charset=UTF-8");
					try
					{
						xhrRange.onreadystatechange = function() 
						{
							if (this.readyState == 4 && this.status == 200) 
							{
								let jsonObjectRange = JSON.parse( xhrRange.responseText );

								if (pageIndex === determinedIndex && matchCount % 20 !== 0) {
									iterationIndex = matchCount % 20;
								} else {
									iterationIndex = 20;
								}

								if(matchCount === 0){
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex) + "/" + (determinedIndex);
								}else if(matchCount%20 === 0){
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex);
								}else{
									document.getElementById("pageNumberLive").textContent = "Page: " + (pageIndex + 1) + "/" + (determinedIndex + 1);
								}
								deleteOldTableResults();
								text = "<table border='1'>"
								for(let i = 0; i < iterationIndex; i++)
								{
									displaytableresults((jsonObjectRange.results)[i], i);
								}
								text += "</table>"
								document.getElementById("tbody").innerHTML = text;
								if(pageIndex === 0){
									hidePrevPageButton();
								}else{
									showPrevPageButton();
								}
								if(pageIndex === determinedIndex){
									hideNextPageButton();
								}else if(((pageIndex+1) === determinedIndex) && ((matchCount%20) === 0)){
									hideNextPageButton();
								}else{
									showNextPageButton();
								}
								addValueSignal = 0;
							}
						};
						xhrRange.send(jsonPayloadRange);
					}
					catch(err)
					{
						document.getElementById("contactSearchResult").innerHTML = err.message;
					}
				}
			}
		};
		xhr.send(jsonPayload);
	}	
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}	
}


function showNextPageButton(){

	document.getElementById("nextButton").style.visibility = true;

	
}

function hideNextPageButton(){

	document.getElementById("nextButton").style.visibility = hidden;

}

function showPrevPageButton(){

	document.getElementById("prevButton").style.visibility = true;
	
}

function hidePrevPageButton(){

	document.getElementById("prevButton").style.visibility = hidden;

}



function deleteOldTableResults(){
	const tbody = document.getElementById("tbody");
  	tbody.innerHTML = "";
}

function displaytableresults(inputForTable, passedIndex){
	text += "<tr id='row" + passedIndex + "'>"
	text += "<td id='first_Name" + passedIndex + "'><span>" + inputForTable.FirstName + "</span></td>";
	text += "<td id='last_Name" + passedIndex + "'><span>" + inputForTable.LastName + "</span></td>";
	text += "<td id='email" + passedIndex + "'><span>" + inputForTable.Phone + "</span></td>";
	text += "<td id='phone" + passedIndex + "'><span>" + inputForTable.Email + "</span></td>";
	text += "<td>" +
		"<button type='button' id='edit_button" + passedIndex + "' class='edit' onclick='editContact(" +
			'"' + inputForTable.ID + '","' + inputForTable.FirstName + '","' + inputForTable.LastName + '","' + inputForTable.Phone + '","' + inputForTable.Email + '"' +
		")'>Edit" +
			"<span class='edit'></span>" +
		"</button>" +
		"&nbsp;" + 
		"<button type='button' id='delete_button" + passedIndex + "' class='delete' onclick='deleteContact(" + inputForTable.ID + ")'>Delete" +
			"<span class='delete'></span>" +
		"</button>" +
	"</td>";

	text += "</tr>";
}


function goHome(){
	document.getElementById("accessUIDiv").style.display = "block";
    document.getElementById("editContactDiv").style.display = "none";
	document.getElementById("spacerDiv1").style.display = "block";
	document.getElementById("spacerDiv2").style.display = "none";
	document.getElementById("addContactDiv").style.display = "none";
	document.getElementById("editBlankResult").innerHTML = "";
	document.getElementById("editFirstNameLengthErrorResult").innerHTML = "";
	document.getElementById("editLastNameLengthErrorResult").innerHTML = "";
	document.getElementById("editPhoneLengthErrorResult").innerHTML = "";
	document.getElementById("editPhonePatternErrorResult").innerHTML = "";
	document.getElementById("editEmailLengthErrorResult").innerHTML = "";
	document.getElementById("editEmailPatternErrorResult").innerHTML = "";
	document.getElementById("addBlankResult").innerHTML = "";
	document.getElementById("addFirstNameLengthErrorResult").innerHTML = "";
	document.getElementById("addLastNameLengthErrorResult").innerHTML = "";
	document.getElementById("addPhoneLengthErrorResult").innerHTML = "";
	document.getElementById("addPhonePatternErrorResult").innerHTML = "";
	document.getElementById("addEmailLengthErrorResult").innerHTML = "";
	document.getElementById("addEmailPatternErrorResult").innerHTML = "";
}


function editContact(ID, FirstName, LastName, Phone, Email){
	document.getElementById("accessUIDiv").style.display = "none";
    document.getElementById("editContactDiv").style.display = "block";
	document.getElementById("spacerDiv1").style.display = "none";
	document.getElementById("spacerDiv2").style.display = "block";
	document.getElementById("editButton").setAttribute("onclick", "saveContact(" + ID + ")");
	document.getElementById("editFirstName").value = FirstName;
	document.getElementById("editLastName").value = LastName;
	document.getElementById("editPhone").value = Phone;
	document.getElementById("editEmail").value = Email;
}

function addContactButton(){
	document.getElementById("accessUIDiv").style.display = "none";
    document.getElementById("addContactDiv").style.display = "block";
	document.getElementById("spacerDiv1").style.display = "none";
	document.getElementById("spacerDiv2").style.display = "block";
	document.getElementById("addFirstName").value = '';
	document.getElementById("addLastName").value = '';
	document.getElementById("addPhone").value = '';
	document.getElementById("addEmail").value = '';
}

function addContactErrorCheck(){
	error = 0;

	let FirstName = document.getElementById("addFirstName").value;
	let LastName = document.getElementById("addLastName").value;
	let Phone = document.getElementById("addPhone").value;
	let Email = document.getElementById("addEmail").value;

	document.getElementById("addBlankResult").innerHTML = "";
	document.getElementById("addFirstNameLengthErrorResult").innerHTML = "";
	document.getElementById("addLastNameLengthErrorResult").innerHTML = "";
	document.getElementById("addPhoneLengthErrorResult").innerHTML = "";
	document.getElementById("addPhonePatternErrorResult").innerHTML = "";
	document.getElementById("addEmailLengthErrorResult").innerHTML = "";
	document.getElementById("addEmailPatternErrorResult").innerHTML = "";

	

	if(FirstName === '' || LastName === '' || Phone === '' || Email === '')
	{
		document.getElementById("addBlankResult").innerHTML = "One or multiple fields are blank";
		error = 1;
	}

	if(FirstName.length > 50){
		document.getElementById("addFirstNameLengthErrorResult").innerHTML = "First name input must be 50 characters or less";
		error = 1;
	}

	if(LastName.length > 50){
		document.getElementById("addLastNameLengthErrorResult").innerHTML = "Last name input must be 50 characters or less";
		error = 1;
	}

	const phonePattern = /^(\+?1\s?)?(\(\d{3}\)|\d{3})?[\s.-]?\d{3}[\s.-]?\d{4}$/;

	if(Phone.length > 50){
		document.getElementById("addPhoneLengthErrorResult").innerHTML = "Phone number input must be 50 characters or less";
		error = 1;
	} 
	
	if(!(phonePattern.test(Phone))){
		document.getElementById("addPhonePatternErrorResult").innerHTML = "Phone number input is not in phone number format";
		error = 1;
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if(Email.length > 50){
		document.getElementById("addEmailLengthErrorResult").innerHTML = "Email address input must be 50 characters or less";
		error = 1;
	}

	if(!(emailPattern.test(Email))){
		document.getElementById("addEmailPatternErrorResult").innerHTML = "Email address input is not in email address format";
		error = 1;
	}
}

function addContact(){

	addContactErrorCheck();

	if(error === 1){
		return;
	}

	let FirstName = document.getElementById("addFirstName").value;
	let LastName = document.getElementById("addLastName").value;
	let Phone = document.getElementById("addPhone").value;
	let Email = document.getElementById("addEmail").value;

	document.getElementById("addContactDiv").style.display = "none";
    document.getElementById("accessUIDiv").style.display = "block";
	document.getElementById("spacerDiv1").style.display = "block";
	document.getElementById("spacerDiv2").style.display = "none";

	var tmp = {FirstName:FirstName,LastName:LastName,Phone:Phone,Email:Email,ID:userId};
	let jsonPayload = JSON.stringify( tmp );

	document.getElementById("addResult").innerHTML = "";
	
	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
		
				const addResult = document.getElementById("addResult");
				addResult.textContent = "Added successfully!";
				addResult.style.visibility = true;

				// Hide it after 5 seconds
				setTimeout(() => {
					addResult.style.visibility = hidden;
				}, 5000);

				addValueSignal = 1;

				goRefresh();
				
				saveCookie();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}

}


function saveContactErrorCheck(){
	error = 0;

	let FirstName = document.getElementById("editFirstName").value;
	let LastName = document.getElementById("editLastName").value;
	let Phone = document.getElementById("editPhone").value;
	let Email = document.getElementById("editEmail").value;

	document.getElementById("editBlankResult").innerHTML = "";
	document.getElementById("editFirstNameLengthErrorResult").innerHTML = "";
	document.getElementById("editLastNameLengthErrorResult").innerHTML = "";
	document.getElementById("editPhoneLengthErrorResult").innerHTML = "";
	document.getElementById("editPhonePatternErrorResult").innerHTML = "";
	document.getElementById("editEmailLengthErrorResult").innerHTML = "";
	document.getElementById("editEmailPatternErrorResult").innerHTML = "";

	if(FirstName === '' || LastName === '' || Phone === '' || Email === '')
	{
		document.getElementById("editBlankResult").innerHTML = "One or multiple fields are blank";
		error = 1;
	}

	if(FirstName.length > 50){
		document.getElementById("editFirstNameLengthErrorResult").innerHTML = "First name input must be 50 characters or less";
		error = 1;
	}

	if(LastName.length > 50){
		document.getElementById("editLastNameLengthErrorResult").innerHTML = "Last name input must be 50 characters or less";
		error = 1;
	}

	const phonePattern = /^(\+?1\s?)?(\(\d{3}\)|\d{3})?[\s.-]?\d{3}[\s.-]?\d{4}$/;

	if(Phone.length > 50){
		document.getElementById("editPhoneLengthErrorResult").innerHTML = "Phone number input must be 50 characters or less";
		error = 1;
	} 
	
	if(!(phonePattern.test(Phone))){
		document.getElementById("editPhonePatternErrorResult").innerHTML = "Phone number input is not in phone number format";
		error = 1;
	}

	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if(Email.length > 50){
		document.getElementById("editEmailLengthErrorResult").innerHTML = "Email address input must be 50 characters or less";
		error = 1;
	}

	if(!(emailPattern.test(Email))){
		document.getElementById("editEmailPatternErrorResult").innerHTML = "Email address input is not in email address format";
		error = 1;
	}
}

function saveContact(ID){

	saveContactErrorCheck();

	if(error === 1){
		return;
	}

	let FirstName = document.getElementById("editFirstName").value;
	let LastName = document.getElementById("editLastName").value;
	let Phone = document.getElementById("editPhone").value;
	let Email = document.getElementById("editEmail").value;

	document.getElementById("editContactDiv").style.display = "none";
    document.getElementById("accessUIDiv").style.display = "block";
	document.getElementById("spacerDiv1").style.display = "block";
	document.getElementById("spacerDiv2").style.display = "none";

	var tmp = {ID:ID,FirstName:FirstName,LastName:LastName,Phone:Phone,Email:Email};
	let jsonPayload = JSON.stringify( tmp );

	document.getElementById("editResult").innerHTML = "";
	
	let url = urlBase + '/EditContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
		
				const editResult = document.getElementById("editResult");
				editResult.textContent = "Edited successfully!";
				editResult.style.visibility = true;

				// Hide it after 5 seconds
				setTimeout(() => {
					editResult.style.visibility = hidden;
				}, 5000);

				goRefresh();
				
				saveCookie();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}

}

function deleteContact(ID){

	const confirmDelete = confirm("Are you sure you want to delete this contact?")

	if(!confirmDelete){
		return;
	}

	var tmp = {ID:ID};
	let jsonPayload = JSON.stringify( tmp );

	document.getElementById("deleteResult").innerHTML = "";
	
	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
		
				
				const deleteResult = document.getElementById("deleteResult");
				deleteResult.textContent = "Deleted successfully!";
				deleteResult.style.display = "inline-block";

				// Hide it after 5 seconds
				setTimeout(() => {
					deleteResult.style.display = "none";
				}, 5000);

				goRefresh();
				
				saveCookie();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("deleteResult").innerHTML = err.message;
	}

}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("pageNameDisplay").innerHTML = "Currently logged in: " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}




