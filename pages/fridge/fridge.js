/**
 * Dynamically displays the refrigerator documents in the page.
 */
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

/**
 * Creates and returns an ingredient document as a Bootstrap card.
 * @param {*} cardTemplate ingredient html template
 * @param {*} fridgeDoc firestore refrigerator document reference
 * @param {*} ingredientDoc firestore ingredient document reference
 * @param {*} qty quantity to update to
 * @returns html Bootstrap card
 */
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

/**
 * Changes the quantity listed on the specified ingredient and updates value
 * within the refrigerator document in firestore.
 * @param {*} htmlElementID html element id reference
 * @param {*} action type to run
 */
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

/**
 * Deletes the refrigerator document.
 * @param {*} fridgeHeadingID html heading element id
 */
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

/**
 * Creates and returns a heading for every fridge entry
 * @param {*} headingTemplate html template for the heading
 * @param {*} fridgeDoc firestore refrigerator document reference
 * @returns html heading element
 */
function createFridgeHeading(headingTemplate, fridgeDoc) {
  const newHeading = headingTemplate.content.cloneNode(true);
  const date = (calculateDate(fridgeDoc.data().boughtDate)).toDateString();

  newHeading.querySelector('.instructions').id = `${fridgeDoc.id}+date`;
  newHeading.querySelector('button').id = fridgeDoc.id;
  newHeading.querySelector('.purchasedDate').innerHTML = date;

  return newHeading;
}
