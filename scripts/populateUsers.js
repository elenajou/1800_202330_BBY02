function writeGroceryList() {
  db.collection( "users" )
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.set({
          groceryList: [db.doc("recipes/7gGvtfCTfWyuoJMW6uaw")]
        })
    });
  });
}

// writeGroceryList();

// function writeFridge() {
//   db.collection( "users" )
//     .get()
//     .then(function(querySnapshot) {
//       querySnapshot.forEach(function(doc) {
//         var groceryListRef = db.collection("users").doc(doc.id).collection("fridge");
//         groceryListRef.add({
//           code: "ingredient01",
//           name: "apple",
//           qty: 2,
//           last_updated: firebase.firestore.FieldValue.serverTimestamp()
//         });

//         groceryListRef.add({
//           code: "ingredient02",
//           name: "egg",
//           qty: 2,
//           last_updated: firebase.firestore.FieldValue.serverTimestamp()
//         });

//         groceryListRef.add({
//           code: "ingredient03",
//           name: "milk",
//           qty: 1,
//           last_updated: firebase.firestore.FieldValue.serverTimestamp()
//         });

//         groceryListRef.add({
//           code: "ingredient04",
//           name: "chocolate",
//           qty: 1,
//           last_updated: firebase.firestore.FieldValue.serverTimestamp()
//         });

//         groceryListRef.add({
//           code: "ingredient05",
//           name: "mayonaise",
//           qty: 1,
//           last_updated: firebase.firestore.FieldValue.serverTimestamp()
//         });
        
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", groceryListRef);
//     });
//   });
// }
// writeFridge();

function writeFridge() {
  var ingredientName = "cake";
  var userRef = db.collection("users");
  userRef.doc('yrx60kXc7EuhjYKXrSfC')
    .get()
    .then(function(doc) {
      fridgeRef = userRef.doc(doc.id).collection("fridge");
      ingredientRef = fridgeRef.doc(ingredientName).get().then(ingredientSnapshot => {
        if (ingredientSnapshot.exists) {
          console.log("it exists");
          fridgeRef.doc(ingredientName).update({ qty: firebase.firestore.FieldValue.increment(1) });
        } else {
          console.log("does not exist");
          fridgeRef.doc(ingredientName).set({
            name: ingredientName,
            qty: 1
          })
        }
      });
    });
}

// writeFridge();