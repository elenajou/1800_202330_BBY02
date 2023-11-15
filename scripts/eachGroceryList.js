function displayGroceryItems() {
  let params = new URL(window.location.href);
  let ID = "yzc3UAmLrESJEuWplVCE";
  console.log(ID);

  db.collection("users").doc(ID).collection("groceryLists").get()
    .then((querySnapshot) => 
      querySnapshot.forEach((doc) => {
        const {name, qty} = doc.data();
        // Create a new list element
        const newIngredient = document.createElement("li");
        newIngredient.className = "list-group-item border-0 d-flex align-items-center ps-0";

        // Create checkbox element
        const checkbox= document.createElement("input");
        checkbox.className = "form-check-input me-3";
        checkbox.type = "checkbox";
        checkbox.box = "";
        checkbox.setAttribute("arial-label", "...");

        // // Append checkbox to the list item
        newIngredient.appendChild(checkbox);

        newIngredient.innerHTML += qty + " " + name;

        document.getElementById("groceryList").appendChild(newIngredient);
      }));
    };
displayGroceryItems();
