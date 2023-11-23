# Project Title

## 1. Project Description
A web application to help people keep track of what ingredients they need to buy by auto-generating a grocery list based on all the recipes they are using. 
* It will use information from previous shopping lists to keep track of expiration times.
* It will use information from previously used recipes to keep track of quantity left.
* It will use the ingredient quantities left and generate an updated grocery list. 

## 2. Names of Contributors
* Elena Jou Luo - CST student at BCIT
* Stella Hui - CST student at BCIT
* Grace - I am excited to make this web application.
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Fonts from https://fonts.google.com/
* Icons from https://icons8.com/
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* ...

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* To use the bootstrap links in the head component, use a script tag and src the head.js file
* To use the footer element, use a script tag and src the footer.js file
* ...

## 5. Known Bugs and Limitations
Here are some known bugs:
* ...
* ...
* ...

## 6. Features for Future
What we'd like to build in the future:
* ...
* ...
* ...
	
## 7. Contents of Folder

```
 Top level of project folder: 
├── .gitignore              # Git ignore file
├── index.js                # Runs the application's startup, routing, 
|                             and other functions. Accessed with Nodejs
|                             at http://localhost:8000/eachGroceryList
├── package.json            # JS file with Nodejs to access web pages
├── package-lock.json       # JS file with Nodejs to access web pages
└── README.md

It has the following subfolders and files:
├── .git                    # Folder for git repo
├-- components              # Folder for reused html items (i.e. navbar)
├── images                  # Folder for static images
├── node_modules            # Folder with libraries and Nodejs packages
├── scripts                 # Folder for scripts used in multiple pages
|   ├── authentication.js   #Firestore authentication
├── styles                  # Folder for styles
|   └-- style.css           # All the custom styles for GrocerEase
├── pages                   # Contains subfolders for each web page and their
|   |                         corresponding files javascript files
|   ├── createRecipe        # Web form for users to add recipes in the database
|   ├── eachGroceryList     # Web page showing the current user grocery list
|   ├── eachRecipe          # View of a selected recipe document
|   ├── fridge              # Web page simulating the ingredients in the
|   |                         current user's physical refridgerator
|   ├── home                # Landing page and main page of the web app
|   ├── login               # Login form for user to access account or sign up
|   ├── recipeMenu          # Web page showing a collection of recipes for 
|   |                         user to check out
|   ├── savedRecipes        # Web page showing the current user saved recipes
|   └── userPage            # Has a summary of user's details
```


