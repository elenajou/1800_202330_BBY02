/** index.js is the javascript file for only index.html. */

/** Redirects user to the dashboard if they are logged in. */
function redirectToDashboard() {
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        window.location.replace("./pages/dashboard/dashboard.html");
      }
  })
}
redirectToDashboard(); // calls function