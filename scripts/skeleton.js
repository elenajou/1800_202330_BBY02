function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            $('#navbarPlaceholder').load('../components/nav_after_login.html', function() {
                console.log('Logged in header loaded successfully');
            });
            $('#footerPlaceholder').load('../components/footer.html', function() {
                console.log('Footer loaded successfully');
            });
        } else {
            // No user is signed in
            $('#navbarPlaceholder').load('../components/nav_before_login.html', function() {
                console.log('Logged out header loaded successfully');
            });
            $('#footerPlaceholder').load('../components/footer.html', function() {
                console.log('Footer loaded successfully');
            });
        }
    })
}
loadSkeleton(); //invoke the function