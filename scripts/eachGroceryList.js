// function displayGroceryItems() {
//   let ingredientList = document.getElementById("ingredients-go-here");
//   let cardTemplate = document.getElementById("ingredientCardTemplate");

//   firebase.auth().onAuthStateChanged(user => {
//     // Check if user is signed in:
//     if (!(user)) {
//       // No user is signed in.
//       console.log ("No user is signed in");
//     } else {
//       //go to the correct user document by referencing to the user uid
//       const currentUser = db.collection("users").doc(user.uid)

//       // Create a map to store grouped grocery items by ingredient ID
//       const groupedIngredients = new Map();

//       //get the document for current user.
//       currentUser
//         .get()
//         .then( userDoc => {
//           var userGroceryList = userDoc.data().groceryList || [];
          
//           if (userGroceryList) {
//             console.log("found a grocery list!");
  
//             // Use map to track promises
//             const promises = userGroceryList.flatMap(recipe => {
//               const { recipeID } = recipe;
//               const recQty = recipe.qty;
  
//               // ingredientID points to a firestore object referencing an ingredients document
//               return recipeID.get().then(recDoc => {
//                 thisRecipe = recDoc.data();
//                 const ingredients = recDoc.data().ingredients;
  
//                 // Use Promise.all to wait for all ingredient promises to resolve
//                 ingredients.map(ingredient => {
//                     const { ingredientID } = ingredient;
//                     const ingQty = ingredient.qty;
  
//                     return ingredientID.get().then(doc => {
//                       const key = doc.id;
//                       if (groupedIngredients.has(key)) {
//                         // If it exists, update the quantity
//                         groupedIngredients.get(key).qty += recQty + ingQty;
//                       } else {
//                         // If it doesn't exist, create a new entry in the map
//                         groupedIngredients.set(key, {
//                           qty: ingQty,
//                           name: doc.data().name,
//                         });
//                       }
//                     });
//                   })
//                   // Return a promise that resolves when all ingredient promises are done
//                   return Promise.all(ingredientPromises);
//               });
//             });
//             // Wait for all recipe promises to resolve
//             return Promise.all(recipePromises);
//           } else {
//             console.log("No Grocery Lists");
//             return Promise.resolve(); // Resolve with an empty promise if no grocery list
//           }
//         })
//         .then(() => {
//           // Iterate through the grouped ingredients and create cards
//           groupedIngredients.forEach((groupedIngredient, ingredientID) => {
//             console.log(groupedIngredient);
//             let newCard = cardTemplate.content.cloneNode(true);
  
//             newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
//             newCard.querySelector('.card-title').innerHTML =
//               groupedIngredient.qty + " &times " + groupedIngredient.name;
  
//             ingredientList.appendChild(newCard);
//           });
//         })
//         .catch(error => {
//           console.error('Error:', error);
//         });
//     }
//   });
// }

// displayGroceryItems();
function displayGroceryItems() {
  const ingredientList = document.getElementById("ingredients-go-here");
  const cardTemplate = document.getElementById("ingredientCardTemplate");

  firebase.auth().onAuthStateChanged(async user => {
    try {
      if (!user) {
        console.log("No user is signed in");
        return;
      }

      const currentUser = db.collection("users").doc(user.uid);
      const userDoc = await currentUser.get();
      const userGroceryList = userDoc.data().groceryList || [];
      const groupedIngredients = new Map();

      if (userGroceryList.length === 0) {
        console.log("No Grocery Lists");
        return;
      }

      console.log("Found a grocery list!");

      for (const recipe of userGroceryList) {
        const { recipeID } = recipe;
        const recQty = recipe.qty;
        const recDoc = await recipeID.get();
        const ingredients = recDoc.data().ingredients;

        for (const ingredient of ingredients) {
          const { ingredientID } = ingredient;
          const ingQty = ingredient.qty;
          const doc = await ingredientID.get();

          const key = doc.id;
          if (groupedIngredients.has(key)) {
            groupedIngredients.get(key).qty += recQty * ingQty;
          } else {
            groupedIngredients.set(key, {
              qty: recQty * ingQty,
              name: doc.data().name,
            });
          }
        }
      }

      // Now, groupedIngredients should be populated correctly
      console.log(groupedIngredients);

      // Iterate through the grouped ingredients and create cards
      ingredientList.innerHTML = ''; // Clear existing content
      groupedIngredients.forEach((groupedIngredient, ingredientID) => {
        console.log(groupedIngredient);
        const newCard = cardTemplate.content.cloneNode(true);

        newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
        newCard.querySelector('.card-title').innerHTML =
          groupedIngredient.qty + " &times " + groupedIngredient.name;

        ingredientList.appendChild(newCard);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Call the function to start listening for changes
displayGroceryItems();
