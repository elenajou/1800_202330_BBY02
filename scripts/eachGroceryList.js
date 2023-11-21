function displayGroceryItems() {
  let ingredientList = document.getElementById("ingredients-go-here");
  let cardTemplate = document.getElementById("ingredientCardTemplate");

  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (!(user)) {
      // No user is signed in.
      console.log ("No user is signed in");
    } else {
      //go to the correct user document by referencing to the user uid
      const currentUser = db.collection("users").doc(user.uid)
      
      //get the document for current user.
      currentUser
        .get()
        .then( userDoc => {
          var userGroceryList = userDoc.data().groceryList || [];
          // Create a map to store grouped grocery items by ingredient ID
          const groupedIngredients = new Map();
          
          if (userGroceryList) {
            console.log("found a grocery list!");
  
            // Use map to track promises
            const promisesMap = userGroceryList.map(recipe => {
              const { recipeID } = recipe;
              const recQty = recipe.qty;
  
              // ingredientID points to a firestore object referencing an ingredients document
              return recipeID.get().then(recDoc => {
                thisRecipe = recDoc.data();
                const ingredients = recDoc.data().ingredients;
  
                // Use Promise.all to wait for all ingredient promises to resolve
                return Promise.all(
                  ingredients.map(ingredient => {
                    const { ingredientID } = ingredient;
                    const ingQty = ingredient.qty;
  
                    return ingredientID.get().then(doc => {
                      const key = doc.id;
                      if (groupedIngredients.has(key)) {
                        // If it exists, update the quantity
                        groupedIngredients.get(key).qty += recQty + ingQty;
                      } else {
                        // If it doesn't exist, create a new entry in the map
                        groupedIngredients.set(key, {
                          qty: ingQty,
                          name: doc.data().name,
                        });
                      }
                    });
                  })
                );
              });
            });
  
            // Use Promise.all to wait for all recipe promises to resolve
            Promise.all(promisesMap.flat()).then(() => {
              // Iterate through the grouped ingredients and create cards
              groupedIngredients.forEach((groupedIngredient, ingredientID) => {
                console.log(groupedIngredient);
                let newCard = cardTemplate.content.cloneNode(true);
  
                newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
                newCard.querySelector('.card-title').innerHTML =
                  groupedIngredient.qty + " &times " + groupedIngredient.name;
  
                ingredientList.appendChild(newCard);
              });
            });
          } else {
            console.log("No Grocery Lists");
          }
        })
    }
  });
}

displayGroceryItems();
