function addToGroceryList() {
  // get the recipeID from the URL
  let params = new URL( window.location.href ); //get URL of search bar
  let docID = params.searchParams.get( "docID" )
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
          // grab existing list otherwise set var to empty array
          var userGroceryList = userDoc.data().groceryList || [];

          // create a new recipe key value pair
          const addRecipe = {
            recipeID: db.doc('recipes/' + docID),
            qty: 1
          }
          
          // Check if the recipeID already exists in userGroceryList
          // Using Deep Comparison lodal to compare Firestore document reference
          const existingRecipe = userGroceryList.find(item => _.isEqual(item.recipeID.id, addRecipe.recipeID.id));

          if (existingRecipe) {
            // If the recipe already exists in the list, increment the qty property
            existingRecipe.qty += 1;
            
            // Find the index of the document reference in the array
            const index = userGroceryList.findIndex(item => _.isEqual(item.recipeID.id, existingRecipe.recipeID.id));

            // Update the qty in Firestore
            if (index != -1) {
              userGroceryList[index].qty = existingRecipe.qty;
              // Update the qty property of the specific document reference in the array
              currentUser
                .update({ groceryList: userGroceryList })
                .then(() => { console.log('Qty updated in Firestore successfully'); })
                .catch(error => { console.error('Error updating qty in Firestore:', error); });
            }
          } else {
            currentUser
              .update({ groceryList: firebase.firestore.FieldValue.arrayUnion(addRecipe) })
              .then(console.log("Added to grocery list"))
              .catch(error => { console.error('Error adding recipe to Firestore:', error); });
          }
        });
    }
  });
}
