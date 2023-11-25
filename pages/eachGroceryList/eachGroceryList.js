/* Displays the ingredients in ingredientList representing items the user
needs to buy. */
function displayIngredientList() {
  const ingredientList = document.getElementById("ingredients-go-here");
  const listItemTemplate = document.getElementById("groceryListTemplate");
  ingredientList.innerHTML = "";
  
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
        const ingredientDoc = await ingredientID.get();
        const newListItem = createIngredientItem(listItemTemplate, ingredientDoc, qty)

        ingredientList.appendChild(newListItem);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Creates and returns a new Bootstrap listItem with ingredient details
function createIngredientItem(listItemTemplate, ingredientDoc, qty) {
  const newListItem = listItemTemplate.content.cloneNode(true);

  newListItem.querySelector('.gl-item').id = ingredientDoc.id;
  newListItem.querySelector('.gl-item-qty').innerHTML = qty;
  newListItem.querySelector('.gl-item-name').innerHTML = ingredientDoc.data().name;
  newListItem.querySelector('.gl-item-add-btn').onclick = () => changeQty(ingredientDoc.id, "+");
  newListItem.querySelector('.gl-item-subtract-btn').onclick = () => changeQty(ingredientDoc.id, "-");
  
  return newListItem;
}

displayIngredientList();

/* Linked to buttons in eachGroceryList.thml used to add or remove ingredients.
The ingredients get deleted from ingredientList if qty reaches 0. Cannot pass index
to the function as index changes if it gets deleted. Any files passed into this function
could be outdated. */
function changeQty(htmlElementID, action) {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      if (!user) return console.log("No user is signed in");

      const currentUser = db.collection("users").doc(user.uid);
      const userDoc = await currentUser.get();
      const userIngredientList = userDoc.data().ingredientList || [];
      const htmlElement = document.getElementById(htmlElementID);

      if (userIngredientList.length === 0) return;

      const index = findIndex(htmlElementID, userIngredientList);

      var currentQty = ( () => {
        switch(action) {
          case "+": return ++userIngredientList[index].qty;
          case "-": return --userIngredientList[index].qty;
          default: return userIngredientList[index].qty;
        }
      })();

      if (currentQty < 1) {
        userIngredientList.splice(index, 1);
        htmlElement.remove();
      } else {
        htmlElement.getElementsByClassName('gl-item-qty')[0].innerHTML = currentQty;
      }
      
      updateUserFieldInFirestore(currentUser, 'ingredientList', userIngredientList);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

/* Used to add 'groceryList' ingredients to the 'fridge' list. If a user went to the store
and bought all the listed ingredients in 'groceryList', this function will store the time stamp and
populate those ingredients in the 'fridge'. */
function addToFridge() {
  firebase.auth().onAuthStateChanged(user => {
    try {
      if (!user) return console.log("No user is signed in");

      const currentUser = db.collection("users").doc(user.uid);
      const userFridgeRef = currentUser.collection("refridgerator");

      currentUser.get().then(userDoc => {
        const userIngredientList = userDoc.data().ingredientList || [];

        if (userIngredientList.length < 1) return console.log("No ingredients to add");
        
        // const userFridge = userDoc.data().fridge || [];
        // for (const ingredient of userIngredientList) {
        //   const existingIngredIndex = findIndex(ingredient.ingredientID.id, userFridge);
        //   (existingIngredIndex !== -1) ? userFridge[existingIngredIndex].qty += ingredient.qty : userFridge.push(ingredient);
        //   updateUserFieldInFirestore(currentUser, 'fridge', userFridge);
        // }

        userFridgeRef
          .add({
            ingredientList: userIngredientList,
            boughtDate: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then( () => { console.log("Added refridgerator document successfully") })
          .catch(error => console.error(`Error updating refridgerator in Firestore:`, error));        
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

