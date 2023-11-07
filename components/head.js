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
  <!-------------------- Stylesheets --------------newCard.querySelector('.card-title').innerHTML = title;--------->
  <!-------------------------------------------------------->
  <link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
`;

document.head.appendChild(bootstrap_head.content);