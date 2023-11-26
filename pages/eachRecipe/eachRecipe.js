function displayRecipeInfo() {

  let params = new URL( window.location.href ); //get URL of search bar
  let ID = params.searchParams.get( "docID" ); //get value for key "id"

  var recipeRef = db.collection("recipes").doc(ID);

  recipeRef
    .get()
    .then( doc => {
      thisRecipe = doc.data();
      console.log(thisRecipe.name);
      recipeCode = thisRecipe.code;
      recipeName = thisRecipe.name;
      recipeDesc = thisRecipe.description;
      recipeInstr = thisRecipe.instructions;
      recipeIngre = thisRecipe.ingredients;
      
      document.getElementById("recipeName").innerHTML = recipeName;
      document.getElementById("recipeDesc").innerHTML = recipeDesc;
      document.getElementById("recipeInstr").innerHTML = recipeInstr;
      document.getElementById("addToGLModalLabel").innerHTML = 
        `Added ingredients from ${recipeName} to your grocery list`;
      
      let ingredientList = document.getElementById( "recipeIngre" );

      // Iterates through the ingredients array and maps out each item
      recipeIngre.forEach( ingredient => {
        const { ingredientID, qty } = ingredient;
        // ingredientID points to a firestore object referencing an ingredients document
        ingredientID
          .get()
          .then( doc => {
            let listItem = document.createElement('li');
            listItem.innerHTML = doc.data().name + ": " + qty;
            ingredientList.appendChild(listItem);
          })
      });
    });
}

displayRecipeInfo();
