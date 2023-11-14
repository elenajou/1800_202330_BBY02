function displayIngredientsDynamically(userID) {
    let cardTemplate = document.getElementById("fridgeCardTemplate");
  
    db.collection('users').doc(userID).collection('fridge').get()   //the collection called "recipes"
      .then(allIngredients => {
        allIngredients.forEach(doc => {
          var title = doc.data().name;
          var qty = doc.data().qty;
          var ingredientCode = doc.data().code;
          let newCard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newCard) that will be filled with Firestore data
          var docID = doc.id;
  
          //update title and text and image
          newCard.querySelector('.card-title').innerHTML = title;
          newCard.querySelector('.card-qty').innerHTML = "Qty: " + qty;
          newCard.querySelector('.card-image').src = `../images/recipe01.jpg`;
  
          document.getElementById("ingredients-go-here").appendChild(newCard);
        })
      
      })
  }
  
  displayIngredientsDynamically("yrx60kXc7EuhjYKXrSfC"); // Elena Jou Luo's ID