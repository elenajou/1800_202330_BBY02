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
          var userGroceryList;

          // create a new recipe key value pair
          const addRecipe = {
            recipeID: db.doc('recipes/' + docID),
            qty: 1
          }

          // if there is an existing list, append the new recipe
          if (userDoc.data().groceryList) {
            userGroceryList = userDoc.data().groceryList;
            userGroceryList[userGroceryList.length] = addRecipe;
            console.log("Added to grocery list");
          } else { // else create a new list and add the recipe
            console.log("Created a new grocery list");
            userGroceryList[0] = addRecipe;
          }

          currentUser.update({ groceryList: userGroceryList });
        });
    }
  });
}
