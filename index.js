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
        querySnapshot.forEach(function(doc) {
            rewardsList.push(doc.data().name);

            var rewardName = doc.data().name;
            // var rewardInstruction = doc.data().instructions;
            var rewardInstruction = "ins";
            // var rewardTAC = doc.data().termsAndConditions;
            var rewardTAC = "tac";
            var rewardCost = doc.data().pointsToRedeem;
            var rewardQty = doc.data().quantity;
            var rewardQtyLeft = doc.data().quantityLeft;
            var rewardExpiry = doc.data().useByDate;

            document.getElementById("tableBody").innerHTML += "<tr> <td>" + rewardName 
            + "</td> <td>" + rewardInstruction + "</td> <td>" + rewardTAC + "</td> <td>" + 
            rewardCost + "</td> <td>" + rewardQty + "</td> <td>" + rewardQtyLeft + "</td> <td>" + rewardExpiry
            + "</td> </tr>";


        });

        console.log("Current cities in CA: ", rewardsList.join(", "));
    });
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
