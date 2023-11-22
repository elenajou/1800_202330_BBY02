function displaySavedRecipes() {
  let savedCardTemplate = document.getElementById("savedRecipeCardTemplate");
  currentUser.get().then(userDoc => {
    var bookmarks = userDoc.data().bookmarks;
    bookmarks.forEach(recipeDocID => {
      db.collection("recipes").doc(recipeDocID).get().then(recipeDoc => {
        if (recipeDoc.exists) {
          var title = recipeDoc.data().name;
          var cookTime = recipeDoc.data().cook_time;
          var description = recipeDoc.data().description;
          var recipeCode = recipeDoc.data().code;
          let newCard = savedCardTemplate.content.cloneNode(true);

          newCard.querySelector('.card-title').innerHTML = title;
          newCard.querySelector('.card-time').innerHTML = "Total time: " + cookTime + "mins";
          newCard.querySelector('.card-text').innerHTML = description.slice(0, 80) + "...";
          newCard.querySelector('.card-image').src = `../images/${recipeCode}.jpg`;
          newCard.querySelector('a').href = "eachRecipe.html?docID=" + recipeDocID;
          newCard.querySelector('i').id = 'save-' + recipeDocID;
          newCard.querySelector('i').onclick = () => unsaveRecipe(recipeDocID); 

          currentUser.get().then(userDoc => {
            //get the user name
            var bookmarks = userDoc.data().bookmarks;
            if (bookmarks.includes(recipeDocID)) {
              document.getElementById('save-' + recipeDocID).innerText = 'bookmark';
            }
          })
          console.log(recipeDocID);
          document.getElementById("saved-recipes-go-here").appendChild(newCard);
        }
      })
    })
  })
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
      console.log(currentUser);
      displaySavedRecipes();
    } else {
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}
initSavedRecipePage();