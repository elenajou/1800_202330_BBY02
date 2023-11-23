function addToGroceryList() {
  const urlParams = new URL(window.location.href);
  const recipeID = urlParams.searchParams.get("docID");

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      console.log("No user is signed in");
    } else {
      const currentUser = db.collection("users").doc(user.uid);

      currentUser.get().then(userDoc => {
        const userGroceryList = userDoc.data().groceryList || [];
        const userIngredientList = userDoc.data().ingredientList || [];
        const addRecipe = {
          recipeID: db.doc(`recipes/${recipeID}`),
          qty: 1
        };
        
        const existingRecipeIndex = userGroceryList.findIndex(item =>
          _.isEqual(item.recipeID.id, addRecipe.recipeID.id)
        );

        if (existingRecipeIndex !== -1) {
          // Recipe exists, update qty
          userGroceryList[existingRecipeIndex].qty += 1;
          currentUser
            .update({ groceryList: userGroceryList })
            .then(() => console.log('recipe qty updated in Firestore successfully'))
            .catch(error => console.error('Error updating qty in Firestore:', error));
        } else {
          // Recipe doesn't exist, add to the list
          currentUser
            .update({ groceryList: firebase.firestore.FieldValue.arrayUnion(addRecipe) })
            .then(() => console.log('Added to grocery list'))
            .catch(error => console.error('Error adding recipe to Firestore:', error));
        }

        db.doc(`recipes/${recipeID}`).get().then( doc => {
          const recipeIngredArray = doc.data().ingredients ;
          recipeIngredArray.forEach( ingredient => {
            const existIngredIndex = userIngredientList.findIndex(item => 
              _.isEqual(item.ingredientID.id, ingredient.ingredientID.id)
            );

            if (existIngredIndex !== -1) {
              // ingredient already in the list
              userIngredientList[existIngredIndex].qty += ingredient.qty;
              currentUser
                .update({ ingredientList: userIngredientList })
                .then(() => console.log('ingredient qty updated in Firestore successfully'))
                .catch(error => console.error('Error updating ingredient in Firestore:', error));
            } else {
              currentUser
                .update({ ingredientList: firebase.firestore.FieldValue.arrayUnion(ingredient) })
                .then(() => console.log('Added to ingredients list'))
                .catch(error => console.error('Error adding ingredient to Firestore:', error));
            }
          });
        });
      });
    }
  });
}
