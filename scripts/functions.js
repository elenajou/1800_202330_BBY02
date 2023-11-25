/* Common used functions are placed here to be access by multiple js files. */

// Finds the index of ingredientID within the provided arrayList
function findIndex(docID, arrayList) {
  return arrayList.findIndex(docRef => _.isEqual(docID, docRef.ingredientID.id));
}

/* Generic function to update a specific field of the users document in Firestore. */
function updateUserFieldInFirestore(currentUser, fieldName, fieldValue) {
  const updateObject = {};
  updateObject[fieldName] = fieldValue;

  currentUser.update(updateObject)
    .then(() => console.log(`${fieldName} updated in Firestore successfully`))
    .catch(error => console.error(`Error updating ${fieldName} in Firestore:`, error));
}

// Example usage:
// updateFieldInFirestore(currentUser, 'fridge', userFridge, 'Fridge');
// updateFieldInFirestore(currentUser, 'ingredientList', userIngredientList, 'ingredientList');
// updateFieldInFirestore(currentUser, 'groceryList', userGroceryList, 'groceryList');

/* Call this function when the "logout" button is clicked. */
function logout() {
  firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("Logging out user");
      window.location.href = "/pages/home.html";
    }).catch((error) => {
      // An error happened.
    });
}

/* Creates a 'back' button that allows users to go back to the previous page. */
let returnBack = document.querySelector('#back-button');
if (returnBack) {
  returnBack.addEventListener('click', () => {
    console.log('Back button clicked.');
    window.history.back();
  })
}

/* gets the timestamp saved in boughtDate and returns it as a JS string */
function getBoughtDateTimestamp(collectionRef, documentID) {
  collectionRef.doc(documentID).get().then( doc => {
    const timestamp = doc.data().boughtDate;
    return timestamp.toDate();
  });
}

/* Calculates the expiry date and returns it as a Date object */
function calculateExpiryDate(ingredientDocRef, boughtDate) {
  // 1 Day: 86,400 seconds, One second = 1 in UNIX time
  const daysToExpiry = ingredientDocRef.data().expiryDays * 86400 * 1000;
  const unixBoughtDate = Date.parse(boughtDate.toDate());
  return new Date(unixBoughtDate + daysToExpiry);
}