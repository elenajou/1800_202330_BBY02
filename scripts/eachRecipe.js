function displayRecipeInfo() {

  let params = new URL( window.location.href ); //get URL of search bar
  let ID = params.searchParams.get( "docID" ); //get value for key "id"
  console.log( ID );

  var recipeRef = db.collection("recipes").doc(ID);

  recipeRef
    .get()
    .then( doc => {
      thisRecipe = doc.data();
      recipeCode = thisRecipe.code;
      recipeName = doc.data().name;
      recipeDesc = doc.data().description;
      recipeInstr = doc.data().instructions;
      
      document.getElementById( "recipeName" ).innerHTML = recipeName;
      document.getElementById( "recipeDesc" ).innerHTML = recipeDesc;
      document.getElementById( "recipeInstr" ).innerHTML = recipeInstr;

      recipeRef
        .collection("ingredients")
        .get()
        .then(snapshot => {
          snapshot.forEach(ingreDoc => {
            const newIngredient = document.createElement("li");
            newIngredient.innerHTML = ingreDoc.data().name + `: ` + ingreDoc.data().qty;
            document.getElementById( "recipeIngre" ).appendChild(newIngredient);
          });
        });
    });
}

displayRecipeInfo();