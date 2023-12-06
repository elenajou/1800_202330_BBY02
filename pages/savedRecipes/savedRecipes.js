function displaySavedRecipes() {
  currentUser.get().then(userDoc => {
    var bookmarks = userDoc.data().bookmarks;
    bookmarks.forEach(recipeDocID => {
      db.collection("recipes").doc(recipeDocID).get().then(recipeDoc => {
        if (recipeDoc.exists) {
          const newCard = populateSavedRecipes(recipeDoc, recipeDocID);

          currentUser.get().then(userDoc => {
            //get the user name
            var bookmarks = userDoc.data().bookmarks;
            if (bookmarks.includes(recipeDocID)) {
              document.getElementById('save-' + recipeDocID).innerText = 'bookmark';
            }
          })
          document.getElementById("saved-recipes-go-here").appendChild(newCard);
        }
      })
    })
  })
}

function populateSavedRecipes(recipeDoc, recipeDocID){
  let savedCardTemplate = document.getElementById("savedRecipeCardTemplate");

  var title = recipeDoc.data().name;
  var cookTime = recipeDoc.data().cook_time;
  var description = recipeDoc.data().description;
  var recipeCode = recipeDoc.data().recipeCode;
  let newCard = savedCardTemplate.content.cloneNode(true);

  newCard.querySelector('.card-title').innerHTML = title;
  newCard.querySelector('.card-time').innerHTML = "Total time: " + cookTime + "mins";
  newCard.querySelector('.card-text').innerHTML = description.slice(0, 80) + "...";
  newCard.querySelector(".card-body").docID = recipeDocID;
  newCard.querySelector(".recipe-img").docID = recipeDocID;
  newCard.querySelector('a').href = "/pages/eachRecipe/eachRecipe.html?docID=" + recipeDocID;
  newCard.querySelector('i').id = 'save-' + recipeDocID;
  newCard.querySelector('i').onclick = () => unsaveRecipe(recipeDocID); 

  // get image URL from FireBase Storage
  const storage = firebase.storage();
  var imageRef = storage.ref(recipeCode + ".jpg");
  imageRef.getDownloadURL().then((url) => {
    localStorage.setItem(title, url);
  }); 
  
  newCard.querySelector(".card-image").src = localStorage.getItem(title);

  return newCard;
}

function unsaveRecipe(recipeDocID) {
  currentUser.update({
    bookmarks: firebase.firestore.FieldValue.arrayRemove(recipeDocID)
  }).then(() => {
    console.log("Recipe " + recipeDocID + " has been unsaved");
    const savedCard = document.getElementById('save-' + recipeDocID).closest('.card');
    if (savedCard) {
      savedCard.remove();
    }
  })
}

function initSavedRecipePage() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      displaySavedRecipes();
    } else {
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}
initSavedRecipePage();