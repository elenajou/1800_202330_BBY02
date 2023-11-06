function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("recipeCardTemplate");

  db.collection(collection).get()   //the collection called "recipes"
    .then(allRecipes => {
      allRecipes.forEach(doc => {
        var title = doc.data().name;
        var cookTime = doc.data().cook_time;
        var description = doc.data().description;
        var recipeCode = doc.data().code;
        let newCard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data
        var docID = doc.ID;

        //update title and text and image
        newCard.querySelector('.card-title').innerHTML = title;
        newCard.querySelector('.card-time').innerHTML = "Total time: " + cookTime + "mins";
        newCard.querySelector('.card-text').innerHTML = description.slice(0,80) + "...";
        newCard.querySelector('.card-image').src = `../images/${recipeCode}.jpg`;
        newCard.querySelector('a').href = "eachRecipe.html?docID="+docID;

        document.getElementById(collection + "-go-here").appendChild(newCard);
        
      })
    
    })
}

displayCardsDynamically("recipes");