let ingredientIndex = 1;

function populateIngredientsMenu(dropdownID) {
  let listItemTemplate = document.getElementById("chooseIngredientTemplate");

  firebase.auth().onAuthStateChanged(async user => {
    try {
      const ingredientsRef = await db.collection("ingredients").orderBy('name').get();

      if (!(ingredientsRef) || !dropdownID) return console.log("None");

      ingredientsRef.forEach(ingredientDoc => {
        const dropdown = document.getElementById(dropdownID);
        const dropdownItem = createIngredientLI(listItemTemplate, ingredientDoc);

        dropdown.appendChild(dropdownItem);
      });
      // document.getElementById('createRecipeModalLabel').innerHTML = 
        // `Your new recipe has been created`;
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Creates and returns a new Bootstrap listItem with ingredient details
function createIngredientLI(listItemTemplate, ingredientDoc) {
  const newListItem = listItemTemplate.content.cloneNode(true);
  const item = newListItem.querySelector('.dropdown-item');

  item.id = ingredientDoc.id;
  item.innerHTML = ingredientDoc.data().name;

  return newListItem;
}

function addDropdown() {
  const ingredientsDropdowns = document.getElementById("ingredients-dropdowns");
  const addDropdownTemplate = document.getElementById("addDropdownTemplate");
  const newDropdown = addDropdownTemplate.content.cloneNode(true);
  const query = newDropdown.querySelector(".ingredients-menu");
  
  query.id = `ingredient-${ingredientIndex}`;
  newDropdown.querySelector("input").id = `qty-${ingredientIndex}`;
  ingredientsDropdowns.appendChild(newDropdown);

  populateIngredientsMenu(query.id);
}
addDropdown();

function addIngredientBtn() {
  ingredientIndex++;
  addDropdown();
}
// ingredientIndex++;
// addDropdown();
// ingredientIndex++;
// addDropdown();

function createRecipe() {
  const recipeName = document.getElementById("recipeName").value;
  const cookingTime = parseInt(document.getElementById("cookingTime").value);
  const recipeDesc = document.getElementById("description").value;
  const recipeInstructions = document.getElementById("instructions").value;

  const ingredients = document.getElementById("ingredients-dropdowns");
  const ingredientsMenu = ingredients.querySelector(".ingredients-menu");
  const ingredientsQty = ingredients.getElementsByClassName("quantity");
  const ingredientsArray = [];
  
  for (let i = 0; i < ingredientsQty.length; i++) {
    const ingredientID = db.collection('ingredients').doc(ingredientsMenu[i].id);
    const qty = parseInt(ingredientsQty[i].value);
    ingredientsArray.push({ ingredientID, qty });
  }
  
  var recipesRef = db.collection("recipes");

  recipesRef.add({
    name: recipeName,
    cook_time: cookingTime,
    description: recipeDesc,
    instructions: recipeInstructions,
    ingredients: ingredientsArray,
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  $('#createdRecipe').modal('show');
}

/* Creates a new ingredient document and adds it to firestore. */
function createIngredient() {
  const newIngredientName = document.getElementById("ingredientName").value;
  const newExpiryDays = parseInt(document.getElementById("expiryDays").value);
  
  var ingredientsRef = db.collection("ingredients");

  ingredientsRef.add({
    name: newIngredientName,
    expiryDays: newExpiryDays,
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  const msgRef = document.getElementById("newIngredientMsg")
  msgRef.innerHTML = `${newIngredientName} has been added`;
  msgRef.classList.remove("hidden");
  
  for (let i = 1; i <= ingredientIndex; i++) {
    const dropdownID = `ingredient-${i}`;
    const ingredientDropdowns = document.getElementById(dropdownID);
    ingredientDropdowns.innerHTML = "";
    populateIngredientsMenu(dropdownID);
  }
}

$('#newIngredientModal').on('shown.bs.modal', function () {
  $('#newIngredient').trigger('focus')
})

// $(".added-recipe").on("hidden.bs.modal", function () {
//   window.location = "/recipeMenu";
// });