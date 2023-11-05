function displayRecipeInfo() {

    let params = new URL( window.location.href ); //get URL of search bar
    let ID = "BIztFNgCLEuq2HArUYCO"; //params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "recipes" )
        .doc( ID )
        .get()
        .then( doc => {
            thisRecipe = doc.data();
            recipeCode = thisRecipe.code;
            recipeName = doc.data().name;
            recipeInstr = doc.data().instructions;
            
            // only populate title, and image
            document.getElementById( "recipeName" ).innerHTML = recipeName;
            document.getElementById( "recipeInstr" ).innerHTML = recipeInstr;
            // let imgEvent = document.querySelector( ".recipe-img" );
            // imgEvent.src = "../images/" + hikeCode + ".jpg";
        } );
}
displayRecipeInfo();