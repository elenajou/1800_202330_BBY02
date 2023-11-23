/* Common used functions are placed here to be access by multiple js files. */

// Finds the index of ingredientID within the provided arrayList
function findIndex(docID, arrayList) {
  return arrayList.findIndex(docRef => _.isEqual(docID, docRef.ingredientID.id));
}

// receives current active user and updates the userFridge list
function updateFridgeInFirestore(currentUser, userFridge) {
  currentUser.update({ fridge: userFridge })
    .then(() => console.log('Fridge updated in Firestore successfully'))
    .catch(error => console.error('Error updating fridge in Firestore:', error));
}

// receives current active user and updates the ingredientList
function updateIngredientListInFirestore(currentUser, userIngredientList) {
  currentUser.update({ ingredientList: userIngredientList })
    .then(() => console.log('ingredientList updated in Firestore successfully'))
    .catch(error => console.error('Error updating ingredientList Firestore:', error));
}

// receives current active user and updates the groceryList
function updateGroceryListInFirestore(currentUser, userGroceryList) {
  currentUser.update({ groceryList: userGroceryList })
    .then(() => console.log('groceryList updated in Firestore successfully'))
    .catch(error => console.error('Error updating groceryList Firestore:', error));
}