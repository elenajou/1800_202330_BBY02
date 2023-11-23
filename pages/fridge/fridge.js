/* Displays the ingredients in 'Fridge' representing items the user
keeps in the physical refridgerator. */
function displayFridge() {
  const fridgeList = document.getElementById("ingredients-go-here");
  const cardTemplate = document.getElementById("fridgeCardTemplate");
  fridgeList.innerHTML = "";
  
  firebase.auth().onAuthStateChanged(async user => {
    try {
      if (!user) {
        console.log("No user is signed in");
        return;
      }

      const currentUser = db.collection("users").doc(user.uid);
      const userDoc = await currentUser.get();
      const userFridgeArray = userDoc.data().fridge || [];

      if (userFridgeArray.length === 0) { return; }

      for (let index = 0; index < userFridgeArray.length; index++) {
        const { ingredientID, qty } = userFridgeArray[index];
        const ingredientDoc = await ingredientID.get();
        const newCard = createIngredientCard(cardTemplate, ingredientDoc, qty)

        fridgeList.appendChild(newCard);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Creates and returns a new Bootstrap card with ingredient details
function createIngredientCard(cardTemplate, ingredientDoc, qty) {
  const newCard = cardTemplate.content.cloneNode(true);

  newCard.querySelector('.card').id = ingredientDoc.id;
  newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
  newCard.querySelector('.card-qty').innerHTML = qty;
  newCard.querySelector('.card-name').innerHTML = ingredientDoc.data().name;
  newCard.querySelector('.card-add-btn').onclick = () => changeQty(ingredientDoc.id, "+");
  newCard.querySelector('.card-subtract-btn').onclick = () => changeQty(ingredientDoc.id, "-");
  
  return newCard;
}

displayFridge();

/* Linked to buttons in eachGroceryList.thml used to add or remove ingredients.
The ingredients get deleted from fridgeList if qty reaches 0. Cannot pass index
to the function as index changes if it gets deleted. Any files passed into this function
could be outdated. */
function changeQty(htmlElementID, action) {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      if (!user) return console.log("No user is signed in");

      const currentUser = db.collection("users").doc(user.uid);
      const userDoc = await currentUser.get();
      const userFridgeArray = userDoc.data().fridge || [];
      const htmlElement = document.getElementById(htmlElementID);

      if (userFridgeArray.length === 0) return;

      const index = findIndex(htmlElementID, userFridgeArray);

      var currentQty = ( () => {
        switch(action) {
          case "+": return ++userFridgeArray[index].qty;
          case "-": return --userFridgeArray[index].qty;
          default: return userFridgeArray[index].qty;
        }
      })();

      if (currentQty < 1) {
        userFridgeArray.splice(index, 1);
        htmlElement.remove();
      } else {
        htmlElement.getElementsByClassName('card-qty')[0].innerHTML = currentQty;
      }
      
      updateFridgeArrayInFirestore(currentUser, userFridgeArray);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Finds the index of ingredientID within the provided arrayList
function findIndex(ingredientID, arrayList) {
  return arrayList.findIndex(docRef => _.isEqual(ingredientID, docRef.ingredientID.id));
}

function updateFridgeArrayInFirestore(currentUser, userFridgeArray) {
  if (userFridgeArray.length === 0) {
    currentUser.update({ fridge: firebase.firestore.FieldValue.delete() });
  } else {
    currentUser.update({ fridge: userFridgeArray })
      .then(() => console.log('Fridge updated in Firestore successfully'))
      .catch(error => console.error('Error updating fridge in Firestore:', error));
  }
}
