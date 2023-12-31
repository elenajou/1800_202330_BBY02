/* Global functions and variables are placed here to be accessed by multiple js files. */

/* Stores user document's reference. */
let currentUser;
/* Stores user document */
let userDoc;

/**
 * Sets or updates currentUser. 
 * @param {*} user firestore user reference
 */
async function setCurrentUser(user) {
  currentUser = user ? db.collection("users").doc(user.uid) : null;
}

/* Gets the user document and sets it to a global variable.  */
async function getUserDoc() {
  if (currentUser) {
    userDoc = await currentUser.get();
  }
}

/* Loads the skeleton for each page. */
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      $('#navbarPlaceholder').load('../../components/nav_after_login.html', function () {
        $('#logout-button').on('click', function () {
          // Call the logout function when the button is clicked
          logout();
        })
        setPageTitle();
      });
      $('#footerPlaceholder').load('../../components/footer.html', function () { });
    } else {
      // No user is signed in
      $('#navbarPlaceholder').load('../../components/nav_before_login.html', function () {
      });
      $('#footerPlaceholder').load('../../components/footer.html', function () {
      });
    }
  })
}
loadSkeleton(); //invoke the function

/**
 * Returns the index of ingredientID within the provided arrayList. 
 * @param {*} ingredientId firestore ingredient document id as string
 * @param {*} arrayList an array of ingredient ids
 * @returns the index if ingredientId is within the array
 */
function findIndex(ingredientId, arrayList) {
  return arrayList.findIndex(docRef => _.isEqual(ingredientId, docRef.ingredientID.id));
}

/**
 * Generic function to update a specific field of the user document in Firestore.
 * @param {*} docRef firestore document reference
 * @param {*} fieldName firestore document field name
 * @param {*} fieldValue firestore document field value
 */
function updateUserFieldInFirestore(docRef, fieldName, fieldValue) {
  const updateObject = {};
  updateObject[fieldName] = fieldValue;

  docRef.update(updateObject)
    .then(() => console.log(`${fieldName} updated in Firestore successfully`))
    .catch(error => console.error(`Error updating ${fieldName} in Firestore:`, error));
}
/**
 *  Example usage:
 * updateFieldInFirestore(currentUser, 'fridge', userFridge, 'Fridge');
 * updateFieldInFirestore(currentUser, 'ingredientList', userIngredientList, 'ingredientList');
 * updateFieldInFirestore(currentUser, 'groceryList', userGroceryList, 'groceryList');
 */

/* Call this function when the "logout" button is clicked. */
function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("Logging out user");
    // Redirect to welcome page
    window.location.href = "/index.html";
  }).catch((error) => {
    console.log("Error logging out", error);
  });
}

/* Creates a 'back' button that allows users to go back to the previous page in mobile view */
function returnBack() {
  window.history.back();
}

/**
 * Calculates the expiry date and returns it as a Date object 
 * @param {*} ingredientDocRef firestore ingredient document reference
 * @param {*} boughtDate firestore field value
 * @returns Date object representation of boughtDate
 */
function calculateExpiryDate(ingredientDocRef, boughtDate) {
  // 1 Day: 86,400 seconds, One second = 1 in UNIX time
  const daysToExpiry = ingredientDocRef.data().expiryDays * 86400 * 1000;
  const unixBoughtDate = Date.parse(boughtDate.toDate());
  return new Date(unixBoughtDate + daysToExpiry);
}

/**
 * Returns the given firestore date field as a Date object
 * @param {*} firestoreDate to parse
 * @returns Date object representing firestoreDate
 */
function calculateDate(firestoreDate) {
  const unixBoughtDate = Date.parse(firestoreDate.toDate());
  return new Date(unixBoughtDate);
}

/* Sets title heading of each page. */
function setPageTitle() {
  const headerTitle = document.title;
  let pageTitle = document.getElementById("pageTitle");
  if (pageTitle) {
    pageTitle.textContent = headerTitle;
  }
}

/**
 * Helper function to calculate the new ingredient quantity based on the action.
 * @param {*} action to perform
 * @param {*} currentQty current ingredient quantity
 * @returns the new quantity value
 */
function calculateNewQty(action, currentQty) {
  switch (action) {
    case "+": return ++currentQty;
    case "-": return --currentQty;
    default: return currentQty;
  }
}

/**
 * Generic function to add a field to the given Firestore document.
 * @param {*} docRef firestore document reference
 * @param {*} fieldName firestore document field name
 * @param {*} fieldValue firestore document field value
 * @param {*} timestampField firestore timestamp value
 */
function addDocumentInFirestore(docRef, fieldName, fieldValue, timestampField) {
  const addObject = {};
  addObject[fieldName] = fieldValue;
  addObject[timestampField] = firebase.firestore.Timestamp.now();

  docRef.add(addObject)
    .then(() => console.log(`${fieldName} updated in Firestore successfully`))
    .catch(error => console.error(`Error updating ${fieldName} in Firestore:`, error));
}

/**
 * Function to redirect to eachRecipe.html and display the selected item.
 * @param {*} docID param passed to eachRecipe.html
 */
function readRecipe(docID) {
  window.location.href = "../eachRecipe/eachRecipe.html?docID=" + docID;
}