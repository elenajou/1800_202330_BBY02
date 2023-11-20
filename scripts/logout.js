//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("Logging out user");
      window.location.href = "../pages/index.html";
    }).catch((error) => {
      // An error happened.
    });
}