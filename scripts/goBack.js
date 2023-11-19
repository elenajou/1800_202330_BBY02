let returnBack = document.querySelector('#back-button');

returnBack.addEventListener('click', () => {
  console.log('Back button clicked.');
  window.history.back();
})