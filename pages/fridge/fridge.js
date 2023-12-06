function displayFridge() {
  const fridgeList = document.getElementById("ingredients-go-here");
  const cardTemplate = document.getElementById("fridgeCardTemplate");
  const fridgeHeadingTemplate = document.getElementById("purchasedDateHeading");
  fridgeList.innerHTML = "";
  
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      const userFridgeRef = currentUser.collection('refrigerator');
      const userFridgeDocuments = await userFridgeRef.get();

      userFridgeDocuments.forEach(fridgeDoc => {
        if (!fridgeDoc.exists) return;
        const newFridgeHeading = createFridgeHeading(fridgeHeadingTemplate, fridgeDoc);
        fridgeList.appendChild(newFridgeHeading);

        const fridgeData = fridgeDoc.data();
        const ingredientList = fridgeData.ingredientList || [];

        ingredientList.forEach(({ ingredientID, qty }) => {
          ingredientID.get().then(doc => {
            createFridgeCard(cardTemplate, fridgeDoc, doc, qty).then(newCard => {
              fridgeList.appendChild(newCard);
            });
          });
        });        
      })
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Creates and returns a new Bootstrap card with ingredient details
async function createFridgeCard(cardTemplate, fridgeDoc, ingredientDoc, qty) {
  thisIngredient = ingredientDoc.data();
  const newCard = cardTemplate.content.cloneNode(true);

  const thisElementID = fridgeDoc.id + "+" + ingredientDoc.id;
  newCard.querySelector('.card').id = thisElementID;
  // newCard.querySelector('.card-image').src = `/images/recipe01.jpg`;
  newCard.querySelector('.card-qty').innerHTML = qty;
  newCard.querySelector('.card-name').innerHTML = thisIngredient.name;
  newCard.querySelector('.card-add-btn').onclick = () => changeQty(thisElementID, "+");
  newCard.querySelector('.card-subtract-btn').onclick = () => changeQty(thisElementID, "-");
  
  var date = calculateExpiryDate(ingredientDoc, fridgeDoc.data().boughtDate);
  newCard.querySelector('.card-expiry').innerHTML = date.toDateString();

  // get image URL from FireBase Storage
  const storage = firebase.storage();
  try {
    var imageRef = storage.ref(thisIngredient.ingredientCode + ".jpg");
    const url = await imageRef.getDownloadURL();
    newCard.querySelector(".card-image").src = url;
  } catch {
    var undefinedRef = storage.ref("undefined.jpg");
    const undefinedUrl = await undefinedRef.getDownloadURL();
    newCard.querySelector(".card-image").src = undefinedUrl;
  }

  return newCard;
}

displayFridge();

function changeQty(htmlElementID, action) {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      await getUserDoc();

      const htmlElement = document.getElementById(htmlElementID);
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

function deleteFridgeLog(fridgeHeadingID) {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      await getUserDoc();

      const currentFridgeList = document.querySelectorAll(`[id^="${fridgeHeadingID}"]`);
      currentFridgeList.forEach(list => {
        list.remove();
      })

      currentUser.collection('refrigerator').doc(fridgeHeadingID).delete();  
      console.log("deleted fridge log");
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

/* Creates a Heading for every fridge entry */
function createFridgeHeading(headingTemplate, fridgeDoc) {
  const newHeading = headingTemplate.content.cloneNode(true);
  const date = (calculateDate(fridgeDoc.data().boughtDate)).toDateString();

  newHeading.querySelector('.instructions').id = `${fridgeDoc.id}+date`;
  newHeading.querySelector('button').id = fridgeDoc.id;
  newHeading.querySelector('.purchasedDate').innerHTML = date;

  return newHeading;
}
