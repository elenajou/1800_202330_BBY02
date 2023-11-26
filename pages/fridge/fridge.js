/* Displays the ingredients in 'Fridge' representing items the user
keeps in the physical refridgerator. */
/*
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
}*/

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
      const userFridgeRef = currentUser.collection('refridgerator');
      const userFridgeDocuments = await userFridgeRef.get();

      userFridgeDocuments.forEach(fridgeDoc => {
        const fridgeData = fridgeDoc.data();
        const ingredientList = fridgeData.ingredientList || [];

        if (ingredientList === 0 ) return console.log("There are no items in your fridge");

        ingredientList.forEach(({ ingredientID, qty }) => {
          ingredientID.get().then(doc => {
            const newCard = createFridgeCard(cardTemplate, fridgeDoc, doc, qty);
            fridgeList.appendChild(newCard);
          });
        });        
      })
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Creates and returns a new Bootstrap card with ingredient details
function createFridgeCard(cardTemplate, fridgeDoc, ingredientDoc, qty) {
  const newCard = cardTemplate.content.cloneNode(true);

  const thisElementID = fridgeDoc.id + "+" + ingredientDoc.id;
  newCard.querySelector('.card').id = thisElementID;
  newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
  newCard.querySelector('.card-qty').innerHTML = qty;
  newCard.querySelector('.card-name').innerHTML = ingredientDoc.data().name;
  newCard.querySelector('.card-add-btn').onclick = () => changeQty(thisElementID, "+");
  newCard.querySelector('.card-subtract-btn').onclick = () => changeQty(thisElementID, "-");
  
  var date = calculateExpiryDate(ingredientDoc, fridgeDoc.data().boughtDate);
  newCard.querySelector('.card-expiry').innerHTML = date.toDateString();

  return newCard;
}

displayFridge();

/* Linked to buttons in eachGroceryList.thml used to add or remove ingredients.
The ingredients get deleted from fridgeList if qty reaches 0. Cannot pass index
to the function as index changes if it gets deleted. Any files passed into this function
could be outdated. */
/*
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
      
      updateUserFieldInFirestore(currentUser,'fridge', userFridgeArray);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}*/

function changeQty(htmlElementID, action) {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      if (!user) return console.log("No user is signed in");

      const htmlElement = document.getElementById(htmlElementID)
      // htmlElementID = fridge document id + ingredient document id stored inside
      const [ fridgeDocID, ingredientDocID ] = htmlElementID.split("+");
      const currentUser = db.collection("users").doc(user.uid);
      const userFridgeDocRef = currentUser.collection('refridgerator').doc(fridgeDocID);
      const userFridgeDoc = await userFridgeDocRef.get();
      const fridgeIngredientList = await userFridgeDoc.data().ingredientList || [];
      
      if (fridgeIngredientList.length === 0) return console.log("No ingredients here");

      const index = findIndex(ingredientDocID, fridgeIngredientList);

      var currentQty = ( () => {
        switch(action) {
          case "+": return ++fridgeIngredientList[index].qty;
          case "-": return --fridgeIngredientList[index].qty;
          default: return fridgeIngredientList[index].qty;
        }
      })();
      
      if (currentQty < 1) {
        fridgeIngredientList.splice(index, 1);
        htmlElement.remove();
      } else {
        htmlElement.getElementsByClassName('card-qty')[0].innerHTML = currentQty;
      }
      
      updateUserFieldInFirestore(userFridgeDocRef,'ingredientList', fridgeIngredientList);
    } catch (error) {
      console.error('Error:', error);
    }
  });
}