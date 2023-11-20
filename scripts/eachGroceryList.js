function displayGroceryItems() {
  var currentUser;

  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (!(user)) {
      // No user is signed in.
      console.log ("No user is signed in");
    } else {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid)
      //get the document for current user.
      currentUser
        .get()
        .then( userDoc => {
          var userGroceryList = userDoc.data().groceryList;
          
          if (userGroceryList) {
            console.log("found a grocery list!");
            // Iterates through the ingredients array and maps out each item
            userGroceryList.forEach( recipe => {
              const { recipeID } = recipe;
              // ingredientID points to a firestore object referencing an ingredients document
              recipeID.get().then( recDoc => {
                thisRecipe = recDoc.data();
                const ingredients = recDoc.data().ingredients;

                ingredients.forEach( ingredient => {
                  const { ingredientID, qty } = ingredient;

                  ingredientID.get().then( doc => {
                    let ingredientList = document.getElementById("ingredients-go-here");
                    let cardTemplate = document.getElementById("ingredientCardTemplate");
                    // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data
                    let newCard = cardTemplate.content.cloneNode(true);

                    //update title and text and image
                    newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
                    newCard.querySelector('.card-title').innerHTML = qty + " &times " + doc.data().name;

                    ingredientList.appendChild(newCard);
                  });
                });
              })
            });
          } else {
            console.log("No Grocery Lists");
          }
        });
    }
  });
}
displayGroceryItems();
