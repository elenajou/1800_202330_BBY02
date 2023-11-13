function writeUsers() {
  //define a variable for the collection recipe to create in Firestore to populate data
  var usersRef = db.collection("users");

  usersRef.add({
    code: "user01",
    name: "Elena Jou Luo",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  usersRef.add({
    code: "user02",
    name: "Stella Hui",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  usersRef.add({
    code: "user03",
    name: "Grace Fang",
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

}  
// writeUsers();

function writeGroceryList() {
  var recipesRef = db.collection("users").doc();
  // doublecheck: is your collection called "Reviews" or "reviews"?
  db.collection( "users" )
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var groceryListRef = db.collection("users").doc(doc.id).collection("groceryLists");
        groceryListRef.add({
          code: "ingredient01",
          name: "apple",
          qty: 2,
          last_updated: firebase.firestore.FieldValue.serverTimestamp()
        });

        groceryListRef.add({
          code: "ingredient02",
          name: "egg",
          qty: 2,
          last_updated: firebase.firestore.FieldValue.serverTimestamp()
        });

        groceryListRef.add({
          code: "ingredient03",
          name: "milk",
          qty: 1,
          last_updated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", groceryListRef);
    });
  });
}

// writeGroceryList();