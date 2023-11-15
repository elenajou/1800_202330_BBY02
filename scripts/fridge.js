function displayIngredientsDynamically(userID) {
  let cardTemplate = document.getElementById("fridgeCardTemplate");

  db.collection('users').doc(userID).collection('fridge').get()   //the collection called "recipes"
    .then(allIngredients => {
      allIngredients.forEach(doc => {
        var title = doc.data().name;
        var qty = doc.data().qty;
      //   var ingredientCode = doc.data().code;
        let newCard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data
        var docID = doc.id;

        //update title and text and image
        newCard.querySelector('.card-title').innerHTML = title;
        newCard.querySelector('.card-qty').innerHTML = "Qty: " + qty;
        newCard.querySelector('.card-image').src = `../images/recipe01.jpg`;

        // set value for buttons
        newCard.querySelector('.card-add-btn').id = `${docID}`;
        newCard.querySelector('.card-subtract-btn').id = `${docID}`;
        document.getElementById("ingredients-go-here").appendChild(newCard);
      })
    
    })
}
  
displayIngredientsDynamically("yrx60kXc7EuhjYKXrSfC"); // Elena Jou Luo's ID

function addQty(ingredientID) {
  var ingredientName = ingredientID;
  var userRef = db.collection("users");
  userRef.doc("yrx60kXc7EuhjYKXrSfC") // for now this is a specific user "Elena Jou Luo"
    .get()
    .then(function(doc) {
      fridgeRef = userRef.doc(doc.id).collection("fridge");
      fridgeRef
        .doc(ingredientName)
        .get()
        .then(ingredientSnapshot => {
          if (ingredientSnapshot.exists) {
            fridgeRef
              .doc(ingredientName)
              .update({ qty: firebase.firestore.FieldValue.increment(1) });
            console.log("Increased " + ingredientName + " by 1.");
          } else {
            console.log(ingredientName + " does not exist in the database.");
          }
      });
    });
}

function subtractQty(ingredientID) {
  var ingredientName = ingredientID;
  var userRef = db.collection("users");
  userRef.doc("yrx60kXc7EuhjYKXrSfC") // for now this is a specific user "Elena Jou Luo"
    .get()
    .then( doc => {
      fridgeRef = userRef.doc(doc.id).collection("fridge");
      fridgeRef
        .doc(ingredientName)
        .get()
        .then(ingredientSnapshot => {
            if (ingredientSnapshot.exists) {
              if (ingredientSnapshot.data().qty <= 1){
                console.log("There are no " + ingredientName + " remaining.");
                fridgeRef
                  .doc(ingredientName)
                  .delete();
                console.log(ingredientName + " deleted from list.")
              } else {
                fridgeRef
                  .doc(ingredientName)
                  .update({ qty: firebase.firestore.FieldValue.increment(-1) });
                console.log("Decreased " + ingredientName + " by 1.")
              }
            }
        });
    });
  }