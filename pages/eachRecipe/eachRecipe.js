function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);

      currentUser.get().then((userDoc) => {
        var bookmarks = userDoc.data().bookmarks || [];
        updateBookmarkIcon(bookmarks);
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}

function updateBookmarkIcon(bookmarks) {
  bookmarks.forEach((recipeID) => {
    var iconID = "save-" + recipeID;
    var iconElement = document.getElementById(iconID);
    if (iconElement) {
      iconElement.innerHTML = "bookmark";
    }
  });
}

doAll();

function displayRecipeInfo() {
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"

  var recipeRef = db.collection("recipes").doc(ID);

  recipeRef
    .get()
    .then( doc => {
      populateRecipePage(doc);
      thisRecipe = doc.data();
      recipeIngre = thisRecipe.ingredients;
      let ingredientList = document.getElementById( "recipeIngre" );

      // Iterates through the ingredients array and maps out each item
      recipeIngre.forEach((ingredient) => {
        const { ingredientID, qty } = ingredient;
        // ingredientID points to a firestore object referencing an ingredients document
        ingredientID.get().then((doc) => {
          let listItem = document.createElement("li");
          listItem.innerHTML = thisRecipe.name + ": " + qty;
          ingredientList.appendChild(listItem);
        });
      });

      currentUser.get().then((userDoc) => {
        var bookmarks = userDoc.data().bookmarks || [];
        var isBookmarked = bookmarks.includes(ID);
        let bookmarkButton = document.getElementById("bookmark-button");
        bookmarkButton.innerHTML = isBookmarked ? "Bookmarked" : "Bookmark";
      });
  });
}
displayRecipeInfo();

function populateRecipePage(doc) {
  thisRecipe = doc.data();
  recipeCode = thisRecipe.code;
  recipeName = thisRecipe.name;
  recipeDesc = thisRecipe.description;
  recipeInstr = thisRecipe.instructions;
  title = thisRecipe.name;

  
  document.getElementById("recipeName").innerHTML = recipeName;
  document.getElementById("recipeDesc").innerHTML = recipeDesc;
  document.getElementById("recipeInstr").innerHTML = recipeInstr;
  document.getElementById("addToGLModalLabel").innerHTML = 
    `Added ingredients from ${recipeName} to your grocery list`;
  
  // get image URL from FireBase Storage
  const storage = firebase.storage();
  var imageRef = storage.ref(recipeCode + ".jpg");
  imageRef.getDownloadURL().then((url) => {
    localStorage.setItem(title, url);
  });

  document.getElementById("recipe-image").src = localStorage.getItem(title);
}

function bookmarkRecipe() {
  // Get the recipe ID from the URL
  let params = new URL(window.location.href);
  let recipeID = params.searchParams.get("docID");

  currentUser.get().then((userDoc) => {
    var bookmarks = userDoc.data().bookmarks || [];
    var isBookmarked = bookmarks.includes(recipeID);

    // Update the user's bookmarks with the recipe ID
    currentUser.update({
      bookmarks: isBookmarked
        ? firebase.firestore.FieldValue.arrayRemove(recipeID)
        : firebase.firestore.FieldValue.arrayUnion(recipeID),
    }).then(() => {
      console.log("Bookmark has been " + (isBookmarked ? "removed" : "saved") + " for " + recipeID);
      let bookmarkButton = document.getElementById("bookmark-button");
      bookmarkButton.innerHTML = isBookmarked ? "Bookmark" : "Bookmarked";
      }).catch((error) => {
        console.error("Error bookmarking recipe ", error);
      });
  });
}

document.getElementById("bookmark-button").addEventListener("click", bookmarkRecipe);
