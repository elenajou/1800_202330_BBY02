function writeRecipes() {
  //define a variable for the collection recipe to create in Firestore to populate data
  var recipesRef = db.collection("recipes");

  recipesRef.add({
    code: "recipe01",
    name: "Whiskey Peach",
    cook_time: 10,
    description: "This content is intended solely for users of legal drinking age. Drink responsibly.",
    instructions: "In a cocktail shaker, combine the ice, peach jam, lemon juice, and whiskey. Cover with the lid and shake vigorously for 30 seconds. Strain into desired serving glass.",
    ingredients: [
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
    ],
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  recipesRef.add({
    code: "recipe02",
    name: "Crème Brûlée",
    cook_time: 40,
    description: "Rich and creamy custard is topped with a crunchy layer of caramelized sugar, making it the perfect indulgent treat.",
    instructions: "Preheat the oven to 325˚F (160˚C). Scoop the ice cream in a microwave-safe bowl. Microwave the ice cream for 30-40 seconds, or until completely melted. Allow to cool for 5 minutes. Add the egg yolk to the melted ice cream and whisk well. Pour the mixture into a ramekin. Place the ramekin in a pan. Pour hot water into the pan to come roughly halfway up the sides of the ramekin. Bake for 40-50 minutes. The crème brûlée should be set, but still a little jiggly in the middle. Remove the ramekin from the roasting pan, allow to cool to room temperature, cover with plastic wrap, and refrigerate for at least 2 hours, and up to 3 days...",
    ingredients: [
      {
        name: "ice cream",
        qty: 1
      },
      {
        name: "egg",
        qty: 1
      },
      {
        name: "sugar",
        qty: 1
      }
    ],
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  recipesRef.add({
    code: "recipe03",
    name: "Peanut Butter Cups",
    cook_time: 30,
    description: "We’ve all had our cravings: sometimes sweet, sometimes salty. But have you ever craved both at once? Sometimes you just need your sweet-salty fix and, well, you can count on a Reese’s cup to deliver. Or, you can just make your own! With only three ingredients and the simplest of directions, these are way easier to throw together than you might think. Get ready for your very own candy factory extravaganza to begin! ",
    instructions: "Prepare a cupcake tin with 6 liners. Stir peanut butter and powdered sugar together until smooth. Spread 1 to 2 tablespoons of chocolate in the bottom of each cupcake liner. Dollop 1 to 2 teaspoons of the peanut butter mixture on top of the chocolate. Cover each dollop of peanut butter with more chocolate and smooth out the top. Refrigerate for 1 hour or until chocolate has hardened. Remove peanut butter cups from the liners.",
    ingredients: [
      {
        name: "peanut butter",
        qty: 1
      },
      {
        name: "sugar",
        qty: 3
      },
      {
        name: "chocolate",
        qty: 1
      }
    ],
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  recipesRef.add({
    code: "recipe04",
    name: "Cloud Bread",
    cook_time: 30,
    description: "This light and fluffy bread is a low-carb alternative to regular bread. Made with just a few simple ingredients, this bread is perfect for sandwiches or as a side to any meal.",
    instructions: "Preheat oven to 300°F (150°C). Separate the eggs into two bowls. Add the cream of tartar to the egg whites and whip into stiff peaks. Add the cream cheese or yogurt into the yolks and mix until combined. Fold half of the egg whites into the yolks until just combined. Add the rest and fold again until incorporated. Line a baking sheet with parchment paper and place six dollops of the mixture on the tray. Spread out the circles with a spatula to about ½ inch (1 cm) thick. Bake for 30 minutes or until golden. Allow to cool for at least 1 hour.",
    ingredients: [
      {
        name: "egg",
        qty: 3
      },
      {
        name: "cream cheese",
        qty: 3
      },
      {
        name: "tartar",
        qty: 1
      }
    ],
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });

  recipesRef.add({
    code: "recipe05",
    name: "Chocolate And Peanut Butter Fudge",
    cook_time: 30,
    description: "Indulge in a little slice of heaven with these 3-ingredient chocolate and peanut butter fudge bites. They're easy to make and perfect for any chocolate lover who also loves a little peanut butter goodness.",
    instructions: "In a medium bowl, combine chocolate chips and condensed milk. Microwave for 1 minute and mix together until smooth. Lay a piece of parchment paper over a 9x9-inch (23x23-cm) baking dish. Transfer chocolate mix to baking dish, spread evenly. Refrigerate for 10 minutes. Spread peanut butter evenly over the top of the cooled fudge. Refrigerate for 2 additional hours. Carefully cut into squares",
    ingredients: [
      {
        name: "chocolate",
        qty: 2
      },
      {
        name: "milk",
        qty: 1
      },
      {
        name: "peanut butter",
        qty: 1
      }
    ],
    last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
  });
}
writeRecipes();