(function() {
  //<script src="https://www.gstatic.com/firebasejs/5.9.2/firebase.js"> </script>
  var config = {
    apiKey: "AIzaSyCJRvvsqkPq45KpBQ_k57bzG8a36IASZEg",
    authDomain: "volunteering-454.firebaseapp.com",
    databaseURL: "https://volunteering-454.firebaseio.com",
    projectId: "volunteering-454",
    storageBucket: "volunteering-454.appspot.com",
    messagingSenderId: "470008611776"
  };
  //firebase.initializeApp(config);

  if (!firebase.apps.length) {
    firebase.initializeApp({config});
 }
  // read the web elements
  var input_email = document.getElementById('email');
  var input_password = document.getElementById('password');
  var login = document.getElementById('signin');
  var signup = document.getElementById('signup');

  // once the user clicks login button
  login.addEventListener('click', e => {
    var email = input_email.value;
    var password = input_password.value;
    var auth = firebase.auth();

    var action = auth.signInWithEmailAndPassword(email,password);
    action.catch(e => console.log(e.message));
  });

  signup.addEventListener('click', e => {
    var email = input_email.value;
    var password = input_password.value;
    var auth = firebase.auth();

    var action = auth.createUserWithEmailAndPassword(email,password);
    //action.then(user => console.l)
    action.catch(e => console.log(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
    } else {
      console.log('not logged in');
    }
  }
    )

}());