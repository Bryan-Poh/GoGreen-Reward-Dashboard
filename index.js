window.onload = loadData();
// Initialize Cloud Firestore through Firebase

function loadData(){
	// Get localStorage
	var partnerName = localStorage.getItem("name");
	var partnerEmail = localStorage.getItem("email");

	// Clear the localStorage
	localStorage.removeItem( 'partnerData' ); 

	// Set welcome message
	document.getElementById("welcome_message").innerHTML = "Welcome back, " + partnerName + "!";

	// Load all rewards
	loadAllRewards();
}

function loadAllRewards(){
	var db = firebase.firestore();
	db.collection("Rewards").onSnapshot(function(querySnapshot) {
        var rewardsList = [];

		// Clear table
		document.getElementById("tableBody").innerHTML = "";
        querySnapshot.forEach(function(doc) {
            rewardsList.push(doc.data().name);

            var rewardName = doc.data().name;
            var rewardInstruction = doc.data().instructions;
            var rewardTAC = doc.data().termsAndConditions;
            var rewardCost = doc.data().pointsToRedeem;
            var rewardQty = doc.data().quantity;
            var rewardQtyLeft = doc.data().quantityLeft;
            var rewardExpiry = doc.data().useByDate;

			// Readd data
            document.getElementById("tableBody").innerHTML += "<tr> <td>" + rewardName 
            + "</td> <td>" + truncateString(rewardInstruction, 50) + "</td> <td>" + truncateString(rewardTAC, 50) + "</td> <td>" + 
            rewardCost + "</td> <td>" + rewardQty + "</td> <td>" + rewardQtyLeft + "</td> <td>" + rewardExpiry.toDate()
            + "</td> </tr>";
        });

        console.log("Current: ", rewardsList.join(", "));
    });
}

function truncateString(str, num){
	if (str.length <= num) {
		return str
	}
	// Return str truncated with '...' concatenated to the end of str.
	return str.slice(0, num) + '...';
}

function add_reward(){
	// Store input fields in var
	var img_input = document.getElementById("img").files;
	var rewardName_input = document.getElementById("reward_name_field").value;
	var instruction_input = document.getElementById("instruction_field").value;
	var cost_input = document.getElementById("cost_field").value;
	var qty_input = document.getElementById("qty_field").value;
	var tac_input = document.getElementById("tac_field").value;
	var date_input = document.getElementById("date_field").value;

	// Validate inputs to check for empty fields
	if((img_input.length == 0) && (rewardName_input=="") && (instruction_input="") &&
	 (cost_input="") && (qty_input="") && (tac_input="") && (date_input="")){
		alert("Please make sure all fields are filled.");
	}

	// References to firebase storage folder "rewards_images"
	const ref = firebase.storage().ref("rewards_images");

	// Get file from html element 'img'
	const img = document.getElementById("img").files[0];

	// Construct the file/img name to be inserted
	// const img_name = new Date + "-" + img.name;

	const metadata = {
		contentType: img.type
	}

	const task = ref.child(img.name).put(img, metadata);



	// Insert image into storage reference
	task.then(snapshot => snapshot.ref.getDownloadURL())
	.then(url => {
		console.log(url);

		// Convert date
		var new_date_format = firebase.firestore.Timestamp.fromDate(toDate(date_input));

		// Insert reward into database
		var db = firebase.firestore();
		db.collection("Rewards").add({
			imageUrl: url,
			instructions: instruction_input,
			name: rewardName_input,
			pointsToRedeem: parseInt(cost_input),
			quantity: parseInt(qty_input),
			quantityLeft: parseInt(qty_input),
			termsAndConditions: tac_input,
			useByDate: new_date_format,
		}).then(function() {
			console.log("Document successfully wriiten!");
			alert("Succesfully added");
		}).catch(function(error) {
			alert("Error adding reward");
		    console.error("Error writing document: ", error);
		});
	});

	clearForm();
}

function toDate(dateStr) {
	var parts = dateStr.split("-");
	
	// return new Date(parts[2], parts[1] - 1, parts[0]);
	return new Date(parts[0], parts[1] - 1, parts[2]);
}

function clearForm(){
	var img_input = document.getElementById("img").files;
	document.getElementById("reward_name_field").value = "";
	document.getElementById("instruction_field").value = "";
	document.getElementById("cost_field").value = "";
	document.getElementById("qty_field").value = "";
	document.getElementById("tac_field").value = "";
	document.getElementById("date_field").value = "";
}

function addPartner(){
	var inputEmail = document.getElementById("email_field").value;
	var inputPassword = document.getElementById("password_field").value;

	db.collection("Partners").add({
	    email: inputEmail,
	    password: inputPassword
	})
	.then(function(docRef) {
	    console.log("Document written with ID: ", docRef.id);
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
}
