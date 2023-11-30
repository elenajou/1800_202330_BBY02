function displayFridge() {
  const fridgeList = document.getElementById("ingredients-go-here");
  const cardTemplate = document.getElementById("fridgeCardTemplate");
  fridgeList.innerHTML = "";
  
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      const userFridgeRef = currentUser.collection('refrigerator');
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
  // newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
  newCard.querySelector('.card-qty').innerHTML = qty;
  newCard.querySelector('.card-name').innerHTML = ingredientDoc.data().name;
  newCard.querySelector('.card-add-btn').onclick = () => changeQty(thisElementID, "+");
  newCard.querySelector('.card-subtract-btn').onclick = () => changeQty(thisElementID, "-");
  
  var date = calculateExpiryDate(ingredientDoc, fridgeDoc.data().boughtDate);
  newCard.querySelector('.card-expiry').innerHTML = date.toDateString();

  return newCard;
}

displayFridge();

function changeQty(htmlElementID, action) {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      await getUserDoc();

      const htmlElement = document.getElementById(htmlElementID)
      // htmlElementID = fridge document id + ingredient document id stored inside
      const [ fridgeDocID, ingredientDocID ] = htmlElementID.split("+");
      const userFridgeDocRef = currentUser.collection('refrigerator').doc(fridgeDocID);
      const userFridgeDoc = await userFridgeDocRef.get();
      const fridgeIngredientList = await userFridgeDoc.data().ingredientList || [];
      
      if (fridgeIngredientList.length === 0) return console.log("No ingredients here");

      const index = findIndex(ingredientDocID, fridgeIngredientList);

      var currentQty = calculateNewQty(action, fridgeIngredientList[index].qty);
      fridgeIngredientList[index].qty = currentQty;
      
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