function addIngredientToFridge(ingredient) {
    var ingredientName = ingredient.toLowerCase();
    var userRef = db.collection("users");
    userRef.doc('yzc3UAmLrESJEuWplVCE') // for now this is a specific user "Stella Hui"
      .get()
      .then(function(doc) {
        fridgeRef = userRef.doc(doc.id).collection("fridge");
        ingredientRef = fridgeRef.doc(ingredientName).get().then(ingredientSnapshot => {
          if (ingredientSnapshot.exists) {
            console.log(ingredientName + " exists in the fridge");
            fridgeRef.doc(ingredientName).update({ qty: firebase.firestore.FieldValue.increment(1) });
          } else {
            console.log(ingredientName + "does not exist yet");
            fridgeRef.doc(ingredientName).set({
              name: ingredientName,
              qty: 1
            })
          }
        });
      });
  }
  
  // addIngredientToFridge();