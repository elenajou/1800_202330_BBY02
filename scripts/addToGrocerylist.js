const db = firebase.firestore();

const userId = 'YOUR_USER_ID';
const userRef = db.collection('users').doc(userId);

//using data from the first fake recipe created in the database
const recipeIngredients = [
  {
    name: "peach jam",
    qty: 1
  },
  {
    name: "lemon juice",
    qty: 2
  },
  {
    name: "whiskey",
    qty: 2
  }
];

recipeIngredients.forEach((ingredient) => {
  const groceryItem = {
    date: new Date(),
    ingredient: ingredient.name,
    amount: ingredient.qty,
  };

  // Add the grocery item to the user's grocery list
  userRef.collection('groceryList').add(groceryItem)
    .then((docRef) => {
      console.log('Grocery item added with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding grocery item: ', error);
    });
});
