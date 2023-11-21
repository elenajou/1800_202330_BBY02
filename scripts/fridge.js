function displayFridge() {
  const ingredientList = document.getElementById("ingredients-go-here");
  const cardTemplate = document.getElementById("fridgeCardTemplate");

  firebase.auth().onAuthStateChanged(async user => {
    try {
      if (!user) {
        console.log("No user is signed in");
        return;
      }

      const currentUser = db.collection("users").doc(user.uid);
      const userDoc = await currentUser.get();
      const userFridge = userDoc.data().fridge || [];

      if (userFridge.length === 0) {
        console.log("Nothing in your fridge");
        return;
      }

      for (const item of userFridge) {
        const { ingredientID, qty } = item;
        const ingredient = await ingredientID.get();
        
        const newCard = cardTemplate.content.cloneNode(true);

        newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
        newCard.querySelector('.card-title').innerHTML = qty + " &times " + ingredient.data().name;

        ingredientList.appendChild(newCard);
        console.log(ingredient.data().name);

      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

displayFridge();
  
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