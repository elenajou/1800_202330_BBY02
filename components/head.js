const bootstrap_head = document.createElement('template');

bootstrap_head.innerHTML = `
  <!-------------------------------------------------------->
  <!------------- Boostrap Library JS CDN ------------------>
  <!-------------------------------------------------------->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

  <!-------------------------------------------------------->
  <!--------------------- Google Fonts --------------------->
  <!-------------------------------------------------------->
  <link href="https://fonts.googleapis.com/css2?family=Autour+One&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Autour+One&family=Dosis:wght@500&display=swap" rel="stylesheet">

  <!-------------------------------------------------------->
  <!-------------------- Stylesheets ----------------------->
  <!-------------------------------------------------------->
  <link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

  <!-------------------------------------------------------->
  <!-- Firebase 8 Library related CSS, JS, JQuery go here -->
  <!-------------------------------------------------------->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.js"></script> 
  <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.css" />
`;

document.head.appendChild(bootstrap_head.content);