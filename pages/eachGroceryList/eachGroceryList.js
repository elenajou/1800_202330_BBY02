// currently being unused. see displayIngredientList for latest code
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
// displayGroceryItems();

// displayGroceryList took too long to load so the ingredient list 
// was auto populated when adding recipes to groceryList. Removes the use of Map()
function displayIngredientList() {
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
      const userIngredientList = userDoc.data().ingredientList || [];

      if (userIngredientList.length === 0) { return; }

      for (let index = 0; index < userIngredientList.length; index++) {
        const { ingredientID, qty } = userIngredientList[index];
        const ingDoc = await ingredientID.get();
        const newCard = cardTemplate.content.cloneNode(true);

        newCard.querySelector('.card').id = ingDoc.id;
        newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
        newCard.querySelector('.card-qty').innerHTML = qty;
        newCard.querySelector('.card-name').innerHTML = ingDoc.data().name;
        newCard.querySelector('.card-add-btn').onclick = () => { 
          changeQty(currentUser, userIngredientList, index, ingDoc.id, "+")
        };
        newCard.querySelector('.card-subtract-btn').onclick = () => { 
          changeQty(currentUser, userIngredientList, index, ingDoc.id, "-")
        };

        ingredientList.appendChild(newCard);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

displayIngredientList();

// updates the cards with new qty or deletes the card if qty < 1
function changeQty(currentUser, userIngreList, index, htmlElementID, action) {
  const htmlElement = document.getElementById(htmlElementID);
  var currentQty;

  if (action === "+") {
    currentQty = ++userIngreList[index].qty;
  } else if (action === "-") {
    currentQty = --userIngreList[index].qty;
  }

  if (currentQty < 1) {
    userIngreList.splice(index, 1);
    htmlElement.remove();
  } else {
    htmlElement.getElementsByClassName('card-qty')[0].innerHTML = currentQty;
  }
  
  currentUser
    .update({ ingredientList: userIngreList })
    .then(() => console.log('fridge updated in Firestore successfully'))
    .catch(error => console.error('Error updating fridge in Firestore:', error));
}
// function checks for any updated values

/*
function addToFridge() {
  firebase.auth().onAuthStateChanged(user => {
    try {
      const currentUser = checkUserLoggedIn(user);;

      currentUser.get().then(userDoc => {
        const userIngredientList = userDoc.data().ingredientList || [];
        const userFridge = userDoc.data().fridge || [];

        if (userIngredientList.length < 1) {
          console.log("No ingredients to add to fridge");
          return;
        }
        
        for (const ingredient of userIngredientList) {
          const existIngredIndex = userFridge.findIndex(item => 
            _.isEqual(item.ingredientID.id, ingredient.ingredientID.id)
          );
            // console.log(ingredient.ingredientID.id);
          if (existIngredIndex !== -1) {
            // ingredient already in the list
            userFridge[existIngredIndex].qty += ingredient.qty;
          } else {
            userFridge.push(ingredient);
          }
          currentUser
            .update({ fridge: userFridge })
            .then(() => console.log('fridge updated in Firestore successfully'))
            .catch(error => console.error('Error updating fridge in Firestore:', error));
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
}
*/
