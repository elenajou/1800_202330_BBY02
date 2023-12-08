/**
 * Dynamically displays all the recipes documents into the page
 * @param {*} collection firestore recipes collection reference
 */
function displayCardsDynamically(collection) {

  db.collection(collection)
    .get() //the collection called "recipes"
    .then((allRecipes) => {
      allRecipes.forEach((doc) => {
        const newCard = createNewRecipeCard(doc);
        document.getElementById(collection + "-go-here").appendChild(newCard);
      });
    });
}

/**
 * Creates and returns a new recipe card populated with data from the recipe document.
 * @param {*} doc firestore recipe document reference
 * @returns html Bootstrap card of the recipe document
 */
function createNewRecipeCard(doc) {
  const cardTemplate = document.getElementById("recipeCardTemplate");

  const title = doc.data().name;
  const cookTime = doc.data().cook_time;
  const description = doc.data().description;
  const recipeCode = doc.data().recipeCode;
  const docID = doc.id;
  
  // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data
  var newCard = cardTemplate.content.cloneNode(true);

  // update title and text and image
  newCard.querySelector(".card-title").innerHTML = title;
  newCard.querySelector(".card-time").innerHTML =
    "Total time: " + cookTime + " mins";
  newCard.querySelector(".card-text").innerHTML =
    description.slice(0, 80) + "...";
  newCard.querySelector(".card-body").docID = docID;
  newCard.querySelector(".recipe-img").docID = docID;
  newCard.querySelector('i').id = 'save-' + docID;
  newCard.querySelector('i').onclick = () => saveBookmark(docID); 

  // get image URL from FireBase Storage
  const storage = firebase.storage();
  var imageRef = storage.ref(recipeCode + ".jpg");
  imageRef.getDownloadURL().then((url) => {
    localStorage.setItem(title, url);
  }); 
  
  newCard.querySelector(".card-image").src = localStorage.getItem(title);

  return newCard;
}

/**
 * Updates the status of the bookmark icon if the recipe is referenced in the
 * bookmark array field under the user document.
 */
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    try {
      setCurrentUser(user);
      displayCardsDynamically("recipes");

      currentUser.get().then((userDoc) => {
        var bookmarks = userDoc.data().bookmarks || [];
        let params = new URL(window.location.href);
        let isCurrentlyBookmarked = bookmarks.includes(
          params.searchParams.get("docID")
        );

        bookmarks.forEach((recipeID) => {
          var iconID = "save-" + recipeID;
          var iconElement = document.getElementById(iconID);
          let params = new URL(window.location.href);
          if (iconElement) {
            iconElement.innerHTML = "bookmark";
          }
          if (isCurrentlyBookmarked && params.searchParams.get("docID") === recipeID) {
            let bookmarkButton = document.getElementById("bookmark-button");
            bookmarkButton.innerHTML = "Bookmarked";
          }
        });
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
}
doAll();

/**
 * Updates the bookmarks array field in the user document if the bookmark icon is selected.
 * Adds or removes the recipe document reference to the bookmarks array field and updates
 * the icon status.
 * @param {*} recipeDocID firestore recipe document id
 */
function saveBookmark(recipeDocID) {
  currentUser.get().then((userDoc) => {
    var bookmarks = userDoc.data().bookmarks || [];
    var isBookmarked = bookmarks.includes(recipeDocID);

    if (isBookmarked) {
      currentUser.update({
        bookmarks: firebase.firestore.FieldValue.arrayRemove(recipeDocID),
      });
      console.log("Bookmark has been removed for " + recipeDocID);
    } else {
      currentUser.update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(recipeDocID),
      });
      console.log("Bookmark has been saved for " + recipeDocID);
    }
    var iconID = "save-" + recipeDocID;
    var iconElement = document.getElementById(iconID);
    if (iconElement) {
      iconElement.innerHTML = isBookmarked ? "bookmark_border" : "bookmark";
    }
  });
}
