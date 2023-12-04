function redirectToDashboard() {
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        window.location.replace("./pages/dashboard/dashboard.html");
      }
  })
}
redirectToDashboard();

let currentUser;
let userDoc;

// Function to set or update currentUser
async function setCurrentUser(user) {
  currentUser = user ? db.collection("users").doc(user.uid) : null;
}

// Function to get user document
async function getUserDoc() {
  if (currentUser) {
    userDoc = await currentUser.get();
  }
}

/* Common used functions are placed here to be access by multiple js files. */
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
          redirectToDashboard();
      } else {
          // No user is signed in
          $('#navbarPlaceholder').load('./components/nav_before_login.html', function() {
              console.log('Logged out header loaded successfully');
          });
          $('#footerPlaceholder').load('./components/footer.html', function() {
              console.log('Footer loaded successfully');
          });
      }
  })
}
loadSkeleton(); //invoke the function

/* Calculates the expiry date and returns it as a Date object */
function calculateExpiryDate(ingredientDocRef, boughtDate) {
  // 1 Day: 86,400 seconds, One second = 1 in UNIX time
  const daysToExpiry = ingredientDocRef.data().expiryDays * 86400 * 1000;
  const unixBoughtDate = Date.parse(boughtDate.toDate());
  return new Date(unixBoughtDate + daysToExpiry);
}