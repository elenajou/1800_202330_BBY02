const firebase = require('./firebaseAPI_BBY02');
const db = firebase.db;

function writeRecipes() {
  //define a variable for the collection recipe to create in Firestore to populate data
  var recipesRef = db.collection("recipes");

  recipesRef.add({
    code: "BBY01",
    name: "Apple Pie",
    cook_time: 120,       //number value
    description: "This is an apple pie description",
    instructions: "You must do 1, 2, and 3 to cook apple pies"
    // last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  // const ingredientsRef = doc(db, "recipes", "ingredients");

  // ingredientsRef.add({
  //   name: "apple",
  //   qty: 2
  // });
  // ingredientsRef.add({
  //   name: "flour",
  //   qty: 1
  // })

}

writeRecipes();