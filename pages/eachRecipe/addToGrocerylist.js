function addToGroceryList() {
  const urlParams = new URL(window.location.href);
  const recipeID = urlParams.searchParams.get("docID");

  firebase.auth().onAuthStateChanged(user => {
    setCurrentUser(user);

    currentUser.get().then(userDoc => {
      // const userGroceryList = userDoc.data().groceryList || [];
      const userIngredientList = userDoc.data().ingredientList || [];

      db.doc(`recipes/${recipeID}`).get().then( doc => {
        const recipeIngredArray = doc.data().ingredients ;
        recipeIngredArray.forEach( ingredient => {
          const existingIngredIndex = findIndex(ingredient.ingredientID.id, userIngredientList);

          if (existingIngredIndex !== -1) {
            // ingredient already in the list
            userIngredientList[existingIngredIndex].qty += ingredient.qty;
            updateUserFieldInFirestore(currentUser, 'ingredientList', userIngredientList);
            // updateIngredientListInFirestore(currentUser, userIngredientList);
          } else {
            const newIngredientInGroceryList = ingredient;
            newIngredientInGroceryList['checked'] = false;
            const fieldValue = firebase.firestore.FieldValue.arrayUnion(ingredient);
            updateUserFieldInFirestore(currentUser, 'ingredientList', fieldValue);
          }
        });
      });
    });
  });
}