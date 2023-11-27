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

  $('#newIngredientMsg').modal('show');
}

$(".modal").on("hidden.bs.modal", function () {
  window.location = "/recipeMenu";
});