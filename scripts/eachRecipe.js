function displayRecipeInfo() {

    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "recipes" )
        .doc( ID )
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

            recipeIngre = doc.data().ingredients.map( ingredient => {
                const newIngredient = document.createElement("li");
                newIngredient.innerHTML = ingredient.name + `: ` + ingredient.qty;
                document.getElementById( "recipeIngre" ).appendChild(newIngredient);
            });
        } );
}

displayRecipeInfo();