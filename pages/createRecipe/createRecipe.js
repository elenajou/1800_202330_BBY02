/** Tracks how many ingredients are added to firestore */
let ingredientIndex = 1;

/**
 * Adds a new dropdown menu to the form with all the 
 * existing ingredient documents as options.
 * @param {*} dropdownID html dropdown element id
 */
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

/** 
 * Increases ingredient quantity count and adds a dropdown menu 
 * if button is pressed. 
 */
function addIngredientBtn() {
  ingredientIndex++;
  addDropdown();
}

/* Creates and adds a new ingredient dropdown element to the page. */
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

/**
 * Creates and returns an ingredient document as a dropdown list 
 * element (or dropdown option)
 * @param {*} listItemTemplate html template of the list element
 * @param {*} ingredientDoc ingredient document reference in firestore
 * @returns html list element
 */
function createIngredientLI(listItemTemplate, ingredientDoc) {
  const newListItem = listItemTemplate.content.cloneNode(true);
  const item = newListItem.querySelector('.dropdown-item');

  item.id = ingredientDoc.id;
  item.innerHTML = ingredientDoc.data().name;

  return newListItem;
}

/** Creates a recipe document when the form is submitted. */
function createRecipe() {
  const recipeName = document.getElementById("recipeName").value;
  const cookingTime = parseInt(document.getElementById("cookingTime").value);
  const recipeDesc = document.getElementById("description").value;
  const recipeInstructions = document.getElementById("instructions").value;
  const recipeCode = document.getElementById("recipeCode").value;

  const ingredients = document.getElementById("ingredients-dropdowns");
  const ingredientsMenu = ingredients.getElementsByClassName("ingredients-menu");
  const ingredientsQty = ingredients.getElementsByClassName("quantity");
  const ingredientsArray = [];
  
  for (let i = 0; i < ingredientsQty.length; i++) {
    const ingredientItem = ingredientsMenu[i];
    const id = ingredientItem.options[ingredientItem.selectedIndex].id;
    const ingredientID = db.collection('ingredients').doc(id);
    const qty = parseInt(ingredientsQty[i].value);
    ingredientsArray.push({ ingredientID, qty });
  }
  
  var recipesRef = db.collection("recipes");

  recipesRef.add({
    recipeCode: recipeCode,
    name: recipeName,
    cook_time: cookingTime,
    description: recipeDesc,
    instructions: recipeInstructions,
    ingredients: ingredientsArray,
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });
  // Feedback modal for the user
  $('#createdRecipe').modal('show');
}

/**
 * If the dropdown menu does not list the ingredient needed, this function will
 * create a new ingredient document and add it to firestore. The dropdown element
 * will refresh and the new ingredient will show up as an option.
 */
function createIngredient() {
  const newIngredientName = document.getElementById("ingredientName").value;
  const newExpiryDays = parseInt(document.getElementById("expiryDays").value);
  const newIngredientCode = document.getElementById("ingredientCode").value
  
  var ingredientsRef = db.collection("ingredients");

  ingredientsRef.add({
    name: newIngredientName,
    expiryDays: newExpiryDays,
    ingredientCode: newIngredientCode,
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

/** Activates the modal with the form to create an ingredient document. */
$('#newIngredientModal').on('shown.bs.modal', function () {
  $('#newIngredient').trigger('focus')
})

/** Redirects the user to recipeMenu.html after creating the recipe document. */
$("#createdRecipe").on("hidden.bs.modal", function () {
  window.location = "../recipeMenu/recipeMenu.html";
});