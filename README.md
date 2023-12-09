# Project Title

## 1. Project Description
A web application to help people keep track of what ingredients they need to buy by auto-generating a grocery list based on all the recipes they are using. 
* It will generate a grocery list based on users' added recipes.
* It will track purchased ingredients' expiration dates
* It will bookmark users' favourite recipes.
* It will save users' customized recipes.

## 2. Names of Contributors
* Elena Jou Luo - CST student at BCIT
* Stella Hui - CST student at BCIT
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Fonts from https://fonts.google.com/
* Icons from https://icons8.com/
* Images from https://unsplash.com/
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)

## 4. Complete setup/installation/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Git clone the repository
* Acquire the Firebase config file from the project owners or set up a new database in FireStore
* Copy and paste the Firebase config file into the /scripts folder
* npm install Firebase
* Firebase deploy to run the application or open index.html in Live Serve

## 5. Known Bugs and Limitations
Here are some known bugs:
* Bookmark/add buttons are misaligned on the desktop version of eachRecipe page. 
* Logout button is not responsive on the desktop version.
* Images used to populate the All Recipes and ingredients are in an async function. At every refresh, the images might not get populated.

## 6. Features for Future
What we'd like to build in the future:
* Allow users to share grocery lists with other users.
* Allow users to adjust recipe serving size.
* Allow users to leave a review on recipes.
* Allow users to import recipes from other websites.
* Allow users to add ingredients to the Grocery List page or the Fridge page.
* Allow users to add images to the createRecipe form.
	
## 7. Contents of Folder

```
 Top level of project folder: 
├── .firebaserc             # Firebase init file
├── .gitignore              # Git ignore file
├── 404.html                # Error page
├── firebase.json           # Firebase init file
├── firebase.rules          # Rules to access firebase firestore
├── index.html              # Web app welcome page
├── storage.rules           # Rules to access firebase storage
└── README.md

It has the following subfolders and files:
├── .git                    # Folder for git repo
├-- components              # Folder for reused html items (i.e. navbar)
|   ├── nav_after_login     # Navbar used after user login
|   ├── nav_before_login    # Navbar used before user login
|   └── footer.html         # Footer for the web page in laptop format
├── images                  # Folder for static images.
|   ├── icons8-             # Refrigerator icon for navbar
|   |   refrigerator-50.png 
|   ├── [logo-*]            # Custom logo for GrocerEase
|   ├── [phone-*]           # Custom images for GrocerEase
|   └── [*other images*]    # All images are from unsplash.com
├── pages                   # Contains subfolders for each web page and their
|   |                         corresponding javascript and css files
|   ├── createRecipe        # Web form for users to add recipes to the database
|   ├── dashboard           # Landing page after user login and main page of the web app
|   ├── eachGroceryList     # Web page showing the current user's grocery list
|   ├── eachRecipe          # View of a selected recipe document
|   ├── fridge              # Web page simulating the ingredients in the
|   |                         current user's physical refrigerator
|   ├── login               # Login form for user to access account or sign up
|   ├── recipeMenu          # Web page showing a collection of recipes for 
|   |                         user to check out
|   └── savedRecipes        # Web page showing the current user's saved recipes
├── scripts                 # Folder for scripts used in multiple pages
|   ├── authentication.js   # Firestore authentication
|   ├── functions.js        # Global functions used across different pages
|   ├── head.js             # Global links used across different pages
|   ├── index.js            # JS file for index.html
|   └-- authentication.js   # Firestore authentication
└── styles                  # Folder for styles
    ├-- style.css           # Global custom styles
    └── index.js            # Styles for index.html

```


