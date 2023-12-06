/** Customizes the greeting to the user's name. */
function addName() {
  firebase.auth().onAuthStateChanged(user => {
    setCurrentUser(user);

    currentUser.get().then(userDoc => {
        document.getElementById("name-goes-here").innerHTML = userDoc.data().name;
        console.log(userDoc.data().name)
      });
    });
}
addName();
