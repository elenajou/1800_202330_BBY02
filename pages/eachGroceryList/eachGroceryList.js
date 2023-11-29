/* Displays the ingredients in ingredientList representing items the user
needs to buy. */
function displayIngredientList() {
  const ingredientList = document.getElementById("ingredients-go-here");
  const listItemTemplate = document.getElementById("groceryListTemplate");
  
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      await getUserDoc();
      const userIngredientList = userDoc.data().ingredientList || [];

      if (userIngredientList.length === 0) { return; }

      for (const ingredientListItem of userIngredientList) {
        const { ingredientID } = ingredientListItem;
        const ingredientDoc = await ingredientID.get();
        const newListItem = createIngredientItem(listItemTemplate, ingredientDoc, ingredientListItem);

        ingredientList.appendChild(newListItem);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Creates and returns a new Bootstrap listItem with ingredient details
function createIngredientItem(listItemTemplate, ingredientDoc, ingredientListItem) {
  const newListItem = listItemTemplate.content.cloneNode(true);

  newListItem.querySelector('.gl-item').id = ingredientDoc.id;
  newListItem.querySelector('.gl-item-qty').innerHTML = ingredientListItem.qty;
  newListItem.querySelector('.gl-item-name').innerHTML = ingredientDoc.data().name;
  newListItem.querySelector('.gl-item-add-btn').onclick = () => changeQty(ingredientDoc.id, "+");
  newListItem.querySelector('.gl-item-subtract-btn').onclick = () => changeQty(ingredientDoc.id, "-");
  
  const checkboxElement = newListItem.querySelector('.form-check-input');
  checkboxElement.id = "checkbox-" + ingredientDoc.id;
  checkboxElement.value = ingredientListItem.checked;
  checkboxElement.checked = ingredientListItem.checked;

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
      setCurrentUser(user);
      await getUserDoc();
      const userIngredientList = userDoc.data().ingredientList || [];
      const htmlElement = document.getElementById(htmlElementID);

      if (userIngredientList.length === 0) return;

      const index = findIndex(htmlElementID, userIngredientList);

      var currentQty = calculateNewQty(action, userIngredientList[index].qty);
      userIngredientList[index].qty = currentQty;

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

// Updates the checkbox value in firestore for the grocery list
function updateCheckboxValue(checkbox) {
  getUserDoc().then(() => {
      const userIngredientList = userDoc.data().ingredientList;
      const ingredientID = (checkbox.id).split("-")[1];
      const index = findIndex(ingredientID, userIngredientList);
      const checkboxElement = document.getElementById(checkbox.id);

      // Toggle the checked property
      checkboxElement.checked = checkboxElement.checked;
      checkboxElement.value =  checkboxElement.checked;

      // If checked, add the attribute; if unchecked, remove the attribute
      if (checkboxElement.checked) {
        checkboxElement.setAttribute('checked', '');
      } else {
        checkboxElement.removeAttribute('checked');
      }

      userIngredientList[index].checked = checkboxElement.checked;
      updateUserFieldInFirestore(currentUser, 'ingredientList',userIngredientList);
      // Log the current checked state
      console.log("Checkbox toggled. Checked:", checkboxElement.checked);
  });
}


/* Used to add 'groceryList' ingredients to the 'fridge' list. If a user went to the store
and bought all the listed ingredients in 'groceryList', this function will store the time stamp and
populate those ingredients in the 'fridge'. */
function addToFridge() {
  firebase.auth().onAuthStateChanged(async user => {
    try {
      setCurrentUser(user);
      const userFridgeRef = currentUser.collection("refridgerator");
      const lastBoughtDateRef = await userFridgeRef.orderBy('boughtDate', 'desc').limit(1).get();
      const sameDate = checkSameDate(lastBoughtDateRef);

      currentUser.get().then(userDoc => {
        const userIngredientList = userDoc.data().ingredientList || [];
        const ingredientItemsToAdd = [];

        if (userIngredientList.length < 1) return console.log("No ingredients to add");

        // Add items that are checked as true
        for (const ingredientListItem of userIngredientList) {
          if (ingredientListItem.checked) ingredientItemsToAdd.push(ingredientListItem);
        }

        // Add the checked ingredients to the fridge. Combine if applicable
        if (lastBoughtDateRef.empty || !sameDate) {
          addDocumentInFirestore(userFridgeRef, 'ingredientList', 
            ingredientItemsToAdd, 'boughtDate');
          $('#addedToFridgeMsg').modal('show');
        } else {
          lastBoughtDateRef.forEach(async doc => {
            await updateIngredientsInFridge(userFridgeRef, doc.id, ingredientItemsToAdd);
          })
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Checks the current date and the date of the last list of bought items
function checkSameDate(lastBoughtDateRef) {
  const currentBoughtDateRef = firebase.firestore.Timestamp.now();
  const currentBoughtDate = currentBoughtDateRef.toDate().toDateString();
  var sameDate = false;
  lastBoughtDateRef.forEach(doc => {
    const lastBoughtDate = doc.data().boughtDate.toDate().toDateString();
    (currentBoughtDate === lastBoughtDate) ? sameDate = true : sameDate = false;
  })

  return sameDate;
}

// Function to update ingredients in the refridgerator document
async function updateIngredientsInFridge(userFridgeRef, docId, ingredientItemsToAdd) {
  const fridgeIngredientList = (await userFridgeRef.doc(docId).get()).data().ingredientList || [];

  ingredientItemsToAdd.forEach((item) => {
    const { ingredientID, qty } = item;
    const index = findIndex(ingredientID.id, fridgeIngredientList);
    (index !== -1) ? fridgeIngredientList[index].qty += item.qty : fridgeIngredientList.push(item);
  });

  updateUserFieldInFirestore(userFridgeRef.doc(docId), 'ingredientList', fridgeIngredientList);
  $('#addedToFridgeMsg').modal('show');
}

// Redirects the page on closing the modal
$(".modal").on("hidden.bs.modal", function () {
  window.location = "/fridge";
});