function addToGroceryList() {
  const urlParams = new URL(window.location.href);
  const recipeID = urlParams.searchParams.get("docID");

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      console.log("No user is signed in");
    } else {
      const currentUser = db.collection("users").doc(user.uid);

      currentUser.get().then(userDoc => {
        // const userGroceryList = userDoc.data().groceryList || [];
        const userIngredientList = userDoc.data().ingredientList || [];
        const addRecipe = {
          recipeID: db.doc(`recipes/${recipeID}`),
          qty: 1
        };
        
        // const existingRecipeIndex = findIndex(addRecipe.recipeID.id, userGroceryList);

        // if (existingRecipeIndex !== -1) {
        //   // Recipe exists, update qty
        //   userGroceryList[existingRecipeIndex].qty += 1;
        //   updateGroceryListInFirestore(currentUser, userGroceryList);
        // } else {
        //   // Recipe doesn't exist, add to the list
        //   updateGroceryListInFirestore(currentUser, firebase.firestore.FieldValue.arrayUnion(addRecipe));
        // }

        db.doc(`recipes/${recipeID}`).get().then( doc => {
          const recipeIngredArray = doc.data().ingredients ;
          recipeIngredArray.forEach( ingredient => {
            const existingIngredIndex = findIndex(ingredient.ingredientID.id, userIngredientList);

            if (existingIngredIndex !== -1) {
              // ingredient already in the list
              userIngredientList[existIngredIndex].qty += ingredient.qty;
              updateIngredientListInFirestore(currentUser, userIngredientList);
            } else {
              updateIngredientListInFirestore(currentUser, firebase.firestore.FieldValue.arrayUnion(ingredient));
            }
          });
        });
      });
    }
  });
}
