// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      var user = authResult.user;                      // get the user object from the Firebase authentication database
      if (authResult.additionalUserInfo.isNewUser) {   //if new user
        db.collection("users").doc(user.uid).set({     //write to firestore. We are using the UID for the ID in users collection
            name: user.displayName,                    //"users" collection
            email: user.email,                         //with authenticated user's ID (user.uid)
          }).then(function () {
            console.log("New user added to firestore");
            window.location.assign("../dashboard/dashboard.html");       //re-direct to index.html that has the afterlogin navbar after signup
          }).catch(function (error) {
            console.log("Error adding new user: " + error);
          });
      } else {
        return true;
      }
      return false;
    },
    uiShown: function() {
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: "../dashboard/dashboard.html", //with the nav_after_login navbar
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ]
};
ui.start('#firebaseui-auth-container', uiConfig);